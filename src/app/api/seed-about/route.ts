import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { sampleAbout } from '@/data/sample';

// Seed only the about table (for re-running after RLS fix)
export async function POST() {
  const results: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
  };

  try {
    // Check if about already exists
    const { data: existing } = await supabase.from('about').select('id').limit(1);
    
    if (existing && existing.length > 0) {
      results.about = { status: 'skipped', message: 'About already exists' };
    } else {
      const { error: aboutError } = await supabase.from('about').insert({
        name: sampleAbout.name,
        title: sampleAbout.title,
        summary: sampleAbout.summary,
        photo_url: sampleAbout.photo,
      });
      
      results.about = aboutError 
        ? { status: 'error', message: aboutError.message } 
        : { status: 'success' };
    }

    results.overall = 'success';
    
  } catch (error) {
    results.overall = 'error';
    results.error = error instanceof Error ? error.message : 'Unknown error';
  }

  return NextResponse.json(results);
}
