import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client for server-side
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Fetch portfolio context server-side (secure - not exposed to browser)
async function getPortfolioContext(): Promise<string> {
  let context = '';

  try {
    // Fetch about data
    const { data: about } = await supabase
      .from('about')
      .select('*')
      .single();

    if (about) {
      context += `\n--- ABOUT THE PORTFOLIO OWNER ---
Name: ${about.name || 'Dhany Yudi Prasetyo'}
Title: ${about.title || 'GIS Specialist'}
Summary: ${about.summary || 'N/A'}
Skills: ${about.skills?.map((s: { category: string; items: string[] }) => `${s.category}: ${s.items?.join(', ')}`).join(' | ') || 'N/A'}
Experience: ${about.experience?.map((e: { role: string; company: string; period: string }) => `${e.role} at ${e.company} (${e.period})`).join(' | ') || 'N/A'}
`;
    }

    // Fetch projects data
    const { data: projects } = await supabase
      .from('projects')
      .select('*')
      .eq('is_visible', true)
      .order('year', { ascending: false });

    if (projects && projects.length > 0) {
      context += `\n--- PORTFOLIO PROJECTS (${projects.length} total) ---\n`;
      projects.forEach((p, i) => {
        context += `
Project ${i + 1}: ${p.title}
- Year: ${p.year}
- Location: ${p.location_name || 'N/A'}
- Category: ${p.category || 'N/A'}
- Description: ${p.description?.substring(0, 300)}...
- Tech Stack: ${p.tech_stack?.join(', ') || 'N/A'}
- Key Impacts: ${p.impacts?.join('; ') || 'N/A'}
`;
      });
    }
  } catch (error) {
    console.error('Error fetching portfolio context:', error);
  }

  return context;
}

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    console.log('Chat API called with message:', message?.substring(0, 100));

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const apiKey = process.env.GOOGLE_AI_API_KEY;

    if (!apiKey) {
      console.error('GOOGLE_AI_API_KEY not configured');
      return NextResponse.json({ error: 'AI service not configured' }, { status: 500 });
    }

    // Fetch portfolio context server-side (secure)
    const portfolioContext = await getPortfolioContext();
    console.log('Portfolio context loaded, length:', portfolioContext.length);

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // Build prompt (all server-side, not visible to client)
    const prompt = `You are a helpful assistant for Dhany Yudi Prasetyo's GIS Portfolio website.

RULES:
1. ONLY answer questions about the portfolio projects, skills, and experience.
2. If asked about unrelated topics, politely redirect to portfolio topics.
3. Keep responses concise and friendly.
4. Respond in the user's language (English or Indonesian).
5. When asked about projects, provide specific details from the data.

PORTFOLIO DATA:
${portfolioContext || 'Portfolio data not available.'}

USER QUESTION: ${message}

RESPONSE:`;

    console.log('Sending request to Gemini...');

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    console.log('Gemini response received, length:', text?.length);

    return NextResponse.json({ response: text });
  } catch (error: unknown) {
    console.error('Chat API error:', error);
    
    let errorMessage = 'Failed to generate response';
    if (error instanceof Error) {
      // Check for rate limit
      if (error.message.includes('429') || error.message.includes('quota')) {
        errorMessage = '429';
      }
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
