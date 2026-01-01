import { NextResponse } from 'next/server';
import { supabase, createServerSupabaseClient } from '@/lib/supabase';

// GET about data (public read) - gets the most recent about entry
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('about')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('GET about error:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data || null);
  } catch (error) {
    console.error('Failed to fetch about:', error);
    return NextResponse.json({ error: 'Failed to fetch about' }, { status: 500 });
  }
}

// UPDATE about data (admin only - uses service role)
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    
    // Use service role client for admin operations (bypasses RLS)
    const adminClient = createServerSupabaseClient();

    // Get the most recent about entry
    const { data: existing } = await adminClient
      .from('about')
      .select('id')
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    let result;
    if (existing) {
      // Update existing
      const { data, error } = await adminClient
        .from('about')
        .update({
          name: body.name,
          title: body.title,
          summary: body.summary,
          photo_url: body.photo_url,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id)
        .select()
        .single();
      
      if (error) {
        console.error('Update error:', error);
        throw error;
      }
      result = data;
    } else {
      // Insert new
      const { data, error } = await adminClient
        .from('about')
        .insert({
          name: body.name,
          title: body.title,
          summary: body.summary,
          photo_url: body.photo_url,
        })
        .select()
        .single();
      
      if (error) {
        console.error('Insert error:', error);
        throw error;
      }
      result = data;
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('About API error:', error);
    return NextResponse.json({ error: 'Failed to update about' }, { status: 500 });
  }
}

// DELETE - Clean up duplicate about entries (keep only the most recent)
export async function DELETE() {
  try {
    const adminClient = createServerSupabaseClient();

    // Get all about entries ordered by updated_at
    const { data: allAbout, error: fetchError } = await adminClient
      .from('about')
      .select('id')
      .order('updated_at', { ascending: false });

    if (fetchError) throw fetchError;

    if (allAbout && allAbout.length > 1) {
      // Keep the first (most recent), delete the rest
      const idsToDelete = allAbout.slice(1).map(a => a.id);
      
      const { error: deleteError } = await adminClient
        .from('about')
        .delete()
        .in('id', idsToDelete);

      if (deleteError) throw deleteError;

      return NextResponse.json({ 
        message: `Cleaned up ${idsToDelete.length} duplicate entries`,
        kept: allAbout[0].id 
      });
    }

    return NextResponse.json({ message: 'No duplicates to clean up' });
  } catch (error) {
    console.error('Cleanup error:', error);
    return NextResponse.json({ error: 'Failed to cleanup' }, { status: 500 });
  }
}
