import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createServerSupabaseClient();

    // 1. Fetch the source resume
    const { data: sourceResume, error: fetchError } = await supabase
      .from('resumes')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !sourceResume) {
      console.error('Fetch resume error:', fetchError);
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
    }

    // 2. Generate new title and slug
    const timestamp = new Date().getTime();
    const baseSlug = sourceResume.slug.replace(/-\d+$/, ''); // Remove existing timestamp suffix if any
    const newSlug = `${baseSlug}-copy-${timestamp}`;
    const newTitle = `${sourceResume.title} (Copy)`;

    // 3. Check if the new slug is unique (should be due to timestamp, but just in case)
    const { data: existing, error: checkError } = await supabase
      .from('resumes')
      .select('id')
      .eq('slug', newSlug)
      .maybeSingle();

    if (checkError) {
      console.error('Slug check error:', checkError);
      return NextResponse.json({ error: 'Failed to check slug availability' }, { status: 500 });
    }

    if (existing) {
      return NextResponse.json({ error: 'Generated slug already exists, please try again' }, { status: 409 });
    }

    // 4. Create the duplicate
    const { data: newResume, error: insertError } = await supabase
      .from('resumes')
      .insert({
        title: newTitle,
        slug: newSlug,
        content: sourceResume.content,
        is_public: false, // Always set to private for duplicates
        user_id: sourceResume.user_id,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Duplicate resume error:', insertError);
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json(newResume, { status: 201 });
  } catch (error) {
    console.error('Duplicate resume error:', error);
    return NextResponse.json({ error: 'Failed to duplicate resume' }, { status: 500 });
  }
}
