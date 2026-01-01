import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST() {
  const results: Record<string, { status: string; count?: number; error?: string }> = {};

  try {
    // Seed Education Data
    const educationData = [
      {
        degree: 'Bachelors Degree Survey and Mapping',
        institution: 'Universitas Gadjah Mada',
        year: '2021',
        display_order: 0
      },
      {
        degree: 'Diploma Degree Geomatics',
        institution: 'Universitas Gadjah Mada',
        year: '2018',
        display_order: 1
      }
    ];

    // Clear and insert education
    await supabase.from('education').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    const { error: eduError } = await supabase.from('education').insert(educationData);
    
    if (eduError) {
      results.education = { status: 'error', error: eduError.message };
    } else {
      results.education = { status: 'success', count: educationData.length };
    }

    // Seed Social Links Data
    const socialLinksData = [
      {
        platform: 'GitHub',
        url: 'https://github.com/dhanyyudi',
        icon: 'github',
        display_order: 0
      },
      {
        platform: 'LinkedIn',
        url: 'https://linkedin.com/in/dhanyyudi',
        icon: 'linkedin',
        display_order: 1
      }
    ];

    // Clear and insert social_links
    await supabase.from('social_links').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    const { error: socialError } = await supabase.from('social_links').insert(socialLinksData);
    
    if (socialError) {
      results.social_links = { status: 'error', error: socialError.message };
    } else {
      results.social_links = { status: 'success', count: socialLinksData.length };
    }

    return NextResponse.json({
      success: true,
      message: 'Data seeded successfully',
      results
    });

  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      results
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Use POST to seed education and social_links data',
    endpoints: {
      POST: 'Seeds education and social_links tables with correct data'
    }
  });
}
