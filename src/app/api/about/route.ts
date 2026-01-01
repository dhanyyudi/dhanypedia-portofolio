import { NextResponse } from 'next/server';
import { supabase, createServerSupabaseClient } from '@/lib/supabase';

// GET about data (public read)
export async function GET() {
  try {
    const { data: aboutData, error: aboutError } = await supabase
      .from('about')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (aboutError) {
      console.error('GET about error:', aboutError);
      return NextResponse.json({ error: aboutError.message }, { status: 400 });
    }

    // Fetch related tables
    const { data: socialLinks } = await supabase
      .from('social_links')
      .select('*')
      .order('display_order', { ascending: true });

    // Combine data
    const result = {
      ...(aboutData || {}),
      social_links: socialLinks || []
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Failed to fetch about:', error);
    return NextResponse.json({ error: 'Failed to fetch about' }, { status: 500 });
  }
}

// UPDATE about data (admin only - uses service role)
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const adminClient = createServerSupabaseClient();

// 1. Update About Profile
    const { data: existing } = await adminClient
      .from('about')
      .select('id')
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    let aboutId;
    if (existing) {
      const { data, error } = await adminClient
        .from('about')
        .update({
          name: body.name,
          title: body.title,
          summary: body.summary,
          photo_url: body.photo_url,
          cv_url: body.cv_url,
          skills: body.skills,
          experience: body.experience,
          education: body.education,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id)
        .select()
        .single();
      
      if (error) throw error;
      aboutId = data.id;
    } else {
      const { data, error } = await adminClient
        .from('about')
        .insert({
          name: body.name,
          title: body.title,
          summary: body.summary,
          photo_url: body.photo_url,
          cv_url: body.cv_url,
          skills: body.skills || [],
          experience: body.experience || [],
          education: body.education || [],
        })
        .select()
        .single();
      
      if (error) throw error;
      aboutId = data.id;
    }

    // 2. Update Social Links (Strategy: Delete All & Re-insert)
    // This is simple and effective for small lists
    if (body.social_links && Array.isArray(body.social_links)) {
      // Delete existing
      await adminClient.from('social_links').delete().neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

      // Insert new
      if (body.social_links.length > 0) {
        const linksToInsert = body.social_links.map((link: any, index: number) => ({
          platform: link.platform,
          url: link.url,
          icon: link.icon,
          display_order: index
        }));

        const { error: socialError } = await adminClient
          .from('social_links')
          .insert(linksToInsert);
        
        if (socialError) throw socialError;
      }
    }

    return NextResponse.json({ success: true });
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
