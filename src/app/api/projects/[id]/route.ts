import { NextRequest, NextResponse } from 'next/server';
import { supabase, createServerSupabaseClient } from '@/lib/supabase';
import type { Project } from '@/types';

// GET single project (public read)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (projectError || !project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const { data: media } = await supabase
      .from('project_media')
      .select('*')
      .eq('project_id', id)
      .order('display_order');

    const formattedProject: Project = {
      id: project.id,
      title: project.title,
      description: project.description || '',
      year: project.year || new Date().getFullYear(),
      location: {
        name: project.location_name || '',
        latitude: project.location_lat || 0,
        longitude: project.location_lng || 0,
      },
      tech_stack: project.tech_stack || [],
      media: (media || []).map(m => ({
        type: m.type as 'image' | 'video',
        url: m.url,
        caption: m.caption,
      })),
      external_link: project.external_link,
      category: project.category,
      is_visible: project.is_visible,
      impacts: project.impacts || [],
      created_at: project.created_at,
      updated_at: project.updated_at,
    };

    return NextResponse.json(formattedProject);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
  }
}

// UPDATE project (admin - uses service role)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const body = await request.json();
    const adminClient = createServerSupabaseClient();

    // Extract media from body - it goes to separate table
    const { media, ...projectData } = body;

    // Build update object with only valid project columns
    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    // Only include fields that are actually being updated
    if (projectData.title !== undefined) updateData.title = projectData.title;
    if (projectData.description !== undefined) updateData.description = projectData.description;
    if (projectData.year !== undefined) updateData.year = projectData.year;
    if (projectData.location_name !== undefined) updateData.location_name = projectData.location_name;
    if (projectData.location_lat !== undefined) updateData.location_lat = projectData.location_lat;
    if (projectData.location_lng !== undefined) updateData.location_lng = projectData.location_lng;
    if (projectData.tech_stack !== undefined) updateData.tech_stack = projectData.tech_stack;
    if (projectData.external_link !== undefined) updateData.external_link = projectData.external_link;
    if (projectData.category !== undefined) updateData.category = projectData.category;
    if (projectData.is_visible !== undefined) updateData.is_visible = projectData.is_visible;
    if (projectData.impacts !== undefined) updateData.impacts = projectData.impacts;

    // Update project
    const { data: project, error } = await adminClient
      .from('projects')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Update error:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Handle media updates if provided
    if (media && Array.isArray(media)) {
      // Delete existing media
      await adminClient
        .from('project_media')
        .delete()
        .eq('project_id', id);

      // Insert new media
      if (media.length > 0) {
        const mediaInserts = media
          .filter((m: { url?: string }) => m.url && m.url.trim() !== '')
          .map((m: { type?: string; url: string; caption?: string }, index: number) => ({
            project_id: id,
            type: m.type || 'image',
            url: m.url,
            caption: m.caption || null,
            display_order: index,
          }));

        if (mediaInserts.length > 0) {
          await adminClient.from('project_media').insert(mediaInserts);
        }
      }
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error('PATCH error:', error);
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

// DELETE project (admin - uses service role)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const adminClient = createServerSupabaseClient();

    // First delete related media
    await adminClient
      .from('project_media')
      .delete()
      .eq('project_id', id);

    // Then delete project
    const { error } = await adminClient
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Delete error:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
