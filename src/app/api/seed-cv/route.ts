import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import path from 'path';
import { promises as fs } from 'fs';

export async function POST() {
  try {
    const supabase = createServerSupabaseClient();
    
    // Read the CV data from JSON file
    const filePath = path.join(process.cwd(), 'dhany-cv-data.json');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const cvData = JSON.parse(fileContent);
    
    // First, get a user_id from profiles
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .limit(1)
      .single();
    
    if (!profile) {
      return NextResponse.json({ error: 'No profile found. Create a user first.' }, { status: 400 });
    }

    // Check if resume already exists
    const { data: existing } = await supabase
      .from('resumes')
      .select('id')
      .eq('slug', 'dhany-yudi-prasetyo')
      .maybeSingle();

    if (existing) {
      // Update existing resume with full data
      const { data, error } = await supabase
        .from('resumes')
        .update({
          title: 'Dhany Yudi Prasetyo - CV',
          content: cvData,
          is_public: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) {
        console.error('Update error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        action: 'updated',
        resume: data,
        content_summary: {
          work: cvData.work?.length || 0,
          education: cvData.education?.length || 0,
          skills: cvData.skills?.length || 0,
          volunteer: cvData.volunteer?.length || 0,
          certificates: cvData.certificates?.length || 0,
          projects: cvData.projects?.length || 0,
          languages: cvData.languages?.length || 0,
        }
      });
    } else {
      // Insert new resume
      const { data, error } = await supabase
        .from('resumes')
        .insert({
          user_id: profile.id,
          title: 'Dhany Yudi Prasetyo - CV',
          slug: 'dhany-yudi-prasetyo',
          content: cvData,
          is_public: true,
        })
        .select()
        .single();

      if (error) {
        console.error('Insert error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        action: 'created',
        resume: data,
        content_summary: {
          work: cvData.work?.length || 0,
          education: cvData.education?.length || 0,
          skills: cvData.skills?.length || 0,
          volunteer: cvData.volunteer?.length || 0,
          certificates: cvData.certificates?.length || 0,
          projects: cvData.projects?.length || 0,
          languages: cvData.languages?.length || 0,
        }
      });
    }
  } catch (error) {
    console.error('Seed CV error:', error);
    return NextResponse.json({ error: 'Failed to seed CV data' }, { status: 500 });
  }
}
