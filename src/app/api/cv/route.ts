import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

// GET - List all resumes (for admin/dashboard)
export async function GET() {
  try {
    const supabase = createServerSupabaseClient();
    
    const { data, error } = await supabase
      .from('resumes')
      .select('id, title, slug, is_public, created_at, updated_at')
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('List resumes error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('GET resumes error:', error);
    return NextResponse.json({ error: 'Failed to fetch resumes' }, { status: 500 });
  }
}

// POST - Create a new resume
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, slug, content, is_public = false, user_id } = body;
    
    if (!title || !slug) {
      return NextResponse.json({ error: 'Title and slug are required' }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();

    // Check if slug already exists - use maybeSingle to avoid error when not found
    const { data: existing, error: checkError } = await supabase
      .from('resumes')
      .select('id')
      .eq('slug', slug)
      .maybeSingle();

    if (checkError) {
      console.error('Slug check error:', checkError);
      return NextResponse.json({ error: 'Failed to check slug availability' }, { status: 500 });
    }

    if (existing) {
      return NextResponse.json({ error: 'A resume with this slug already exists' }, { status: 409 });
    }

    // Get a default user_id if none provided (for dashboard use without auth)
    let effectiveUserId = user_id;
    if (!effectiveUserId) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .limit(1)
        .single();
      
      if (profile) {
        effectiveUserId = profile.id;
      } else {
        console.error('No profile found for default user');
        return NextResponse.json({ error: 'No user profile available. Please log in first.' }, { status: 401 });
      }
    }

    const { data, error } = await supabase
      .from('resumes')
      .insert({
        title,
        slug,
        content: content || {
          basics: { name: '' },
          work: [],
          education: [],
          skills: [],
        },
        is_public,
        user_id: effectiveUserId,
      })
      .select()
      .single();

    if (error) {
      console.error('Create resume error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('POST resume error:', error);
    return NextResponse.json({ error: 'Failed to create resume' }, { status: 500 });
  }
}
