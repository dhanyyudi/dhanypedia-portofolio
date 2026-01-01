import { NextResponse } from 'next/server';
import { supabase, createServerSupabaseClient } from '@/lib/supabase';
import type { Project } from '@/types';

export async function GET() {
  try {
    // Fetch all projects (remove is_visible filter for debugging)
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('*')
      .order('year', { ascending: false });

    console.log('Projects query result:', { projects, error: projectsError });

    if (projectsError) {
      console.error('Projects error:', projectsError);
      return NextResponse.json({ error: projectsError.message, code: projectsError.code }, { status: 500 });
    }

    if (!projects || projects.length === 0) {
      return NextResponse.json([]);
    }

    // Fetch media for all projects
    const projectIds = projects.map(p => p.id);
    const { data: allMedia, error: mediaError } = await supabase
      .from('project_media')
      .select('*')
      .in('project_id', projectIds)
      .order('display_order');

    if (mediaError) {
      console.error('Media error:', mediaError);
    }

    // Transform to frontend format
    const formattedProjects: Project[] = projects.map(p => ({
      id: p.id,
      title: p.title,
      description: p.description || '',
      year: p.year || new Date().getFullYear(),
      location: {
        name: p.location_name || '',
        latitude: p.location_lat || 0,
        longitude: p.location_lng || 0,
      },
      tech_stack: p.tech_stack || [],
      media: (allMedia || [])
        .filter(m => m.project_id === p.id)
        .map(m => ({
          type: m.type as 'image' | 'video',
          url: m.url,
          caption: m.caption,
        })),
      external_link: p.external_link,
      category: p.category,
      is_visible: p.is_visible,
      impacts: p.impacts || [],
      created_at: p.created_at,
      updated_at: p.updated_at,
    }));

    return NextResponse.json(formattedProjects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects', details: error instanceof Error ? error.message : 'Unknown' },
      { status: 500 }
    );
  }
}

// POST - Create new project (admin - uses service role)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const adminClient = createServerSupabaseClient();
    
    // Insert project
    const { data: project, error: projectError } = await adminClient
      .from('projects')
      .insert({
        title: body.title,
        description: body.description,
        year: body.year,
        location_name: body.location?.name || body.location_name,
        location_lat: body.location?.latitude || body.location_lat,
        location_lng: body.location?.longitude || body.location_lng,
        tech_stack: body.tech_stack || [],
        impacts: body.impacts || [],
        external_link: body.external_link,
        category: body.category,
        is_visible: body.is_visible ?? true,
      })
      .select()
      .single();

    if (projectError) {
      console.error('Project insert error:', projectError);
      return NextResponse.json({ error: projectError.message }, { status: 400 });
    }

    // Insert media if provided
    if (body.media && body.media.length > 0) {
      for (let i = 0; i < body.media.length; i++) {
        const m = body.media[i];
        await adminClient.from('project_media').insert({
          project_id: project.id,
          type: m.type || 'image',
          url: m.url,
          caption: m.caption,
          display_order: i,
        });
      }
    }

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}
