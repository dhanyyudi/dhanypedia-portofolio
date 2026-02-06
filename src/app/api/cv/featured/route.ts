import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

// GET - Get the featured CV (public)
export async function GET() {
  try {
    const supabase = createServerSupabaseClient();
    
    const { data, error } = await supabase
      .from('resumes')
      .select('*')
      .eq('is_featured', true)
      .eq('is_public', true)
      .maybeSingle();

    if (error) {
      console.error('Get featured CV error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: 'No featured CV found' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('GET featured CV error:', error);
    return NextResponse.json({ error: 'Failed to fetch featured CV' }, { status: 500 });
  }
}

// POST - Set a CV as featured (admin)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { resume_id } = body;
    
    if (!resume_id) {
      return NextResponse.json({ error: 'Resume ID is required' }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();

    // First, un-feature all other CVs
    const { error: unfeatureError } = await supabase
      .from('resumes')
      .update({ is_featured: false, updated_at: new Date().toISOString() })
      .neq('id', resume_id);

    if (unfeatureError) {
      console.error('Unfeature CVs error:', unfeatureError);
      return NextResponse.json({ error: unfeatureError.message }, { status: 500 });
    }

    // Then, set the selected CV as featured
    const { data, error } = await supabase
      .from('resumes')
      .update({ is_featured: true, updated_at: new Date().toISOString() })
      .eq('id', resume_id)
      .select()
      .single();

    if (error) {
      console.error('Set featured CV error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('POST featured CV error:', error);
    return NextResponse.json({ error: 'Failed to set featured CV' }, { status: 500 });
  }
}
