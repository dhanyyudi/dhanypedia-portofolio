import { NextRequest, NextResponse } from 'next/server';
import { VertexAI } from '@google-cloud/vertexai';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client for server-side
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Enhanced portfolio context with anti-hallucination guardrails
async function getPortfolioContext(): Promise<{
  context: string;
  lastUpdated: string;
  dataCompleteness: number;
}> {
  const startTime = Date.now();
  let context = '';
  let tablesLoaded = 0;
  const totalTables = 5; // about, projects, skills, experience, education
  
  try {
    // 1. Fetch complete About data with all fields
    const { data: about, error: aboutError } = await supabase
      .from('about')
      .select('*')
      .single();
    
    if (!aboutError && about) {
      tablesLoaded++;
      context += `\n=== PORTFOLIO OWNER PROFILE ===
Name: ${about.name}
Title/Role: ${about.title}
Location: Jakarta, Indonesia
Summary/Bio: ${about.summary}
Email: dhanypedia@gmail.com
Last Profile Update: ${about.updated_at || about.created_at}
`;
      
      // 2. Extract Skills (embedded in about table)
      if (about.skills && Array.isArray(about.skills)) {
        tablesLoaded++;
        context += `\n=== TECHNICAL SKILLS ===\n`;
        about.skills.forEach((skillGroup: { category: string; items: string[] }) => {
          context += `**${skillGroup.category}**: ${skillGroup.items.join(', ')}\n`;
        });
      }
      
      // 3. Extract Experience (embedded in about table)
      if (about.experience && Array.isArray(about.experience)) {
        tablesLoaded++;
        context += `\n=== WORK EXPERIENCE ===\n`;
        about.experience.forEach((exp: { role: string; company: string; period: string; description: string }, i: number) => {
          context += `${i + 1}. ${exp.role} at ${exp.company}
   Period: ${exp.period}
   Description: ${exp.description}
   \n`;
        });
      }
      
      // 4. Extract Education (embedded in about table)
      if (about.education && Array.isArray(about.education)) {
        tablesLoaded++;
        context += `\n=== EDUCATION ===\n`;
        about.education.forEach((edu: { degree: string; institution: string; year: string }) => {
          context += `- ${edu.degree} from ${edu.institution} (${edu.year})\n`;
        });
      }
    }
    
    // 5. Fetch ALL visible projects with COMPLETE data (no truncation)
    const { data: projects } = await supabase
      .from('projects')
      .select('*')
      .eq('is_visible', true)
      .order('year', { ascending: false });
    
    if (projects && projects.length > 0) {
      tablesLoaded++;
      context += `\n=== PORTFOLIO PROJECTS (Total: ${projects.length}) ===\n`;
      projects.forEach((p, i) => {
        context += `
Project #${i + 1}: "${p.title}"
- Year: ${p.year}
- Category: ${p.category}
- Location: ${p.location_name || 'N/A'}
- Coordinates: Lat ${p.location?.lat || 'N/A'}, Lng ${p.location?.lng || 'N/A'}
- Description: ${p.description}
- Technologies/Tools: ${p.tech_stack?.join(', ') || 'N/A'}
- Key Impacts/Results: ${p.impacts?.join('; ') || 'N/A'}
- Status: ${p.is_visible ? 'Public in portfolio' : 'Hidden'}
- Last Updated: ${p.updated_at || p.created_at}
`;
      });
    }
    
    const loadTime = Date.now() - startTime;
    const completeness = (tablesLoaded / totalTables) * 100;
    
    console.log(`Portfolio context loaded: ${tablesLoaded}/${totalTables} tables, ${loadTime}ms, ${completeness.toFixed(0)}% complete`);
    
    return {
      context,
      lastUpdated: new Date().toISOString(),
      dataCompleteness: completeness
    };
    
  } catch (error) {
    console.error('Error fetching portfolio context:', error);
    return {
      context: 'ERROR: Unable to load portfolio data from database.',
      lastUpdated: new Date().toISOString(),
      dataCompleteness: 0
    };
  }
}

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    console.log('Chat API called with message:', message?.substring(0, 100));

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const projectId = process.env.GOOGLE_PROJECT_ID;
    const location = process.env.GOOGLE_LOCATION || 'us-central1';

    if (!projectId) {
      console.error('GOOGLE_PROJECT_ID not configured');
      return NextResponse.json({ error: 'AI service not configured (Project ID missing)' }, { status: 500 });
    }

    // Initialize Vertex AI
    // Support Vercel deployment by checking for raw JSON credentials
    let authOptions = undefined;
    if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
      try {
        const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
        authOptions = { credentials };
      } catch (e) {
        console.error('Failed to parse GOOGLE_SERVICE_ACCOUNT_JSON:', e);
      }
    }

    const vertexAI = new VertexAI({
      project: projectId,
      location: location,
      googleAuthOptions: authOptions
    });
    
    // Using Gemini 2.5 Flash as requested (available in preview/latest endpoints)
    const model = vertexAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // Fetch portfolio context with metadata
    const { context: portfolioContext, lastUpdated, dataCompleteness } = await getPortfolioContext();
    console.log(`Portfolio context loaded: ${dataCompleteness.toFixed(0)}% complete, updated at ${lastUpdated}`);

    // Build prompt with comprehensive guardrails
    const prompt = `You are an AI assistant for Dhany Yudi Prasetyo's GIS Portfolio website.

===================
CRITICAL GUARDRAILS
===================

1. **ANTI-HALLUCINATION RULES**:
   - ONLY use information from the "PORTFOLIO DATA" section below
   - If information is NOT explicitly stated in the data, respond: "I don't have that specific information in the portfolio. You can contact Dhany directly at dhanypedia@gmail.com for more details."
   - NEVER make up project details, dates, technologies, company names, or achievements
   - NEVER infer or assume information not explicitly stated
   - If asked about something unclear or ambiguous, ask for clarification rather than guessing
   - Use phrases like "According to the portfolio..." or "Based on the available data..." to ground responses

2. **DATA FRESHNESS**:
   - All data below was fetched from the database at: ${lastUpdated}
   - Data completeness: ${dataCompleteness.toFixed(0)}%
   - This represents the MOST CURRENT information available
   - If data seems incomplete (<100%), acknowledge this limitation

3. **RESPONSE CONSISTENCY**:
   - Always cite specific projects, skills, or experiences when answering
   - Use exact names, dates, titles, and details from the data
   - For technical questions, reference the "TECHNICAL SKILLS" section
   - For project questions, reference specific project entries by name or number
   - Never paraphrase in a way that could alter factual accuracy

4. **SCOPE LIMITATIONS**:
   - ONLY answer questions about:
     * Dhany's professional background and profile
     * GIS/geospatial projects listed in the portfolio
     * Technical skills and competencies
     * Education and work history
     * How to contact or work with Dhany
   - If asked about unrelated topics (weather, news, general knowledge, other people), politely respond: "I can only answer questions about Dhany's GIS portfolio. Please ask about his projects, skills, experience, or professional background."
   - Do not provide personal opinions or advice beyond portfolio information

5. **LANGUAGE HANDLING**:
   - Detect the user's language (English or Indonesian)
   - Respond in the SAME language as the question
   - Keep responses concise (2-4 paragraphs maximum unless listing multiple items)
   - Use professional but friendly tone

6. **VERIFICATION & ACCURACY**:
   - When listing projects, always include project numbers/titles exactly as shown
   - When mentioning technologies, use exact names from tech stack
   - When referencing dates, use exact years/periods from the data
   - If multiple projects match a query, list all relevant ones
   - If a query is too vague, ask for specifics (e.g., "Which type of GIS project are you interested in?")

===================
PORTFOLIO DATA
===================
${portfolioContext || 'ERROR: No portfolio data available. Please try again later.'}

===================
DATA VALIDATION SUMMARY
===================
- Data Freshness: ${lastUpdated}
- Completeness: ${dataCompleteness.toFixed(0)}%
- Total Projects Loaded: ${(portfolioContext.match(/Project #/g) || []).length}
- Skills Categories: ${(portfolioContext.match(/\*\*/g) || []).length}
- Work Experience Entries: ${(portfolioContext.match(/Period:/g) || []).length}

===================
USER QUESTION
===================
${message}

===================
YOUR RESPONSE
===================
(Remember: Only use information from PORTFOLIO DATA above. If the answer isn't there, admit you don't know and suggest contacting Dhany directly.)
`;

    console.log('Sending request to Vertex AI...');

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.candidates?.[0].content.parts[0].text;

    console.log('Vertex AI response received, length:', text?.length);

    // Validate response for potential hallucination indicators
    const hallucinationPatterns = [
      /I think|I believe|probably|maybe|it might be|could be/gi,
      /based on my (knowledge|understanding)/gi,
      /as far as I (know|understand)/gi
    ];

    let hasWarning = false;
    if (text) {
        for (const pattern of hallucinationPatterns) {
        if (pattern.test(text)) {
            hasWarning = true;
            console.warn('Response contains uncertainty indicators');
            break;
        }
        }
    }

    return NextResponse.json({ 
      response: text,
      metadata: {
        dataFreshness: lastUpdated,
        dataCompleteness: `${dataCompleteness.toFixed(0)}%`,
        warning: hasWarning ? 'Response may contain uncertain information' : null,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error: unknown) {
    console.error('Chat API error:', error);
    
    let errorMessage = 'Failed to generate response';
    if (error instanceof Error) {
      // Check for rate limit (Vertex AI)
      if (error.message.includes('429') || error.message.includes('RESOURCE_EXHAUSTED')) {
        errorMessage = '429';
      }
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
