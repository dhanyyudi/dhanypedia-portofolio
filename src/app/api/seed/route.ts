import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { sampleProjects, sampleAbout } from '@/data/sample';

export async function POST() {
  const results: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    projects: { status: 'pending' },
    about: { status: 'pending' },
    skills: { status: 'pending' },
    experience: { status: 'pending' },
    education: { status: 'pending' },
    social_links: { status: 'pending' },
  };

  try {
    // 1. Seed Projects
    console.log('Seeding projects...');
    for (const project of sampleProjects) {
      // Insert project (let Supabase generate UUID)
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .insert({
          title: project.title,
          description: project.description,
          year: project.year,
          location_name: project.location.name,
          location_lat: project.location.latitude,
          location_lng: project.location.longitude,
          tech_stack: project.tech_stack,
          external_link: project.external_link,
          is_visible: project.is_visible,
        })
        .select()
        .single();

      if (projectError) {
        console.error('Project error:', projectError);
        continue;
      }

      // Insert media for this project
      for (let i = 0; i < project.media.length; i++) {
        const media = project.media[i];
        await supabase.from('project_media').insert({
          project_id: projectData.id,
          type: media.type,
          url: media.url,
          caption: media.caption,
          display_order: i,
        });
      }
    }
    results.projects = { status: 'success', count: sampleProjects.length };

    // 2. Seed About
    console.log('Seeding about...');
    const { error: aboutError } = await supabase.from('about').insert({
      name: sampleAbout.name,
      title: sampleAbout.title,
      summary: sampleAbout.summary,
      photo_url: sampleAbout.photo,
    });
    results.about = aboutError ? { status: 'error', message: aboutError.message } : { status: 'success' };

    // 3. Seed Skills
    console.log('Seeding skills...');
    for (let i = 0; i < sampleAbout.skills.length; i++) {
      const skill = sampleAbout.skills[i];
      await supabase.from('skills').insert({
        category: skill.category,
        items: skill.items,
        display_order: i,
      });
    }
    results.skills = { status: 'success', count: sampleAbout.skills.length };

    // 4. Seed Experience
    console.log('Seeding experience...');
    for (let i = 0; i < sampleAbout.experience.length; i++) {
      const exp = sampleAbout.experience[i];
      await supabase.from('experience').insert({
        role: exp.role,
        company: exp.company,
        period: exp.period,
        description: exp.description,
        display_order: i,
      });
    }
    results.experience = { status: 'success', count: sampleAbout.experience.length };

    // 5. Seed Education
    console.log('Seeding education...');
    for (let i = 0; i < sampleAbout.education.length; i++) {
      const edu = sampleAbout.education[i];
      await supabase.from('education').insert({
        degree: edu.degree,
        institution: edu.institution,
        year: edu.year,
        display_order: i,
      });
    }
    results.education = { status: 'success', count: sampleAbout.education.length };

    // 6. Seed Social Links
    console.log('Seeding social links...');
    for (let i = 0; i < sampleAbout.social_links.length; i++) {
      const link = sampleAbout.social_links[i];
      await supabase.from('social_links').insert({
        platform: link.platform,
        url: link.url,
        icon: link.icon,
        display_order: i,
      });
    }
    results.social_links = { status: 'success', count: sampleAbout.social_links.length };

    results.overall = 'success';
    
  } catch (error) {
    results.overall = 'error';
    results.error = error instanceof Error ? error.message : 'Unknown error';
  }

  return NextResponse.json(results);
}
