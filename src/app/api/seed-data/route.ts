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

    // Seed Experience Data (Career Route)
    const experienceData = [
      {
        role: 'UAV LiDAR Pilot',
        company: 'PT Geo Survey Persada',
        period: '2013',
        description: 'Executed critical aerial mapping missions for disaster mitigation (BNPB) and infrastructure planning, ensuring high-accuracy topographic data acquisition.',
        display_order: 0
      },
      {
        role: 'GIS Programmer',
        company: 'PT Geosang Inovasi Geospasial',
        period: '2023',
        description: 'Developed custom WebGIS applications, including the "SAKATA" land mapping project, ensuring seamless spatial data visualization for government clients.',
        display_order: 1
      },
      {
        role: 'Geodetic Officer',
        company: 'PT Hutama Karya (Persero)',
        period: '2023-2024',
        description: 'Led LiDAR data acquisition using VTOL UAVs for the Trans-Sumatra Toll Road (JTTS). Processed high-resolution Point Clouds for cut-and-fill analysis and developed BIM-integrated Power BI dashboards to monitor construction progress.',
        display_order: 2
      },
      {
        role: 'Associate Cartography Engineer',
        company: 'SWAT Mobility (Singapore)',
        period: '2024 - Present',
        description: 'Managing and optimizing spatial datasets to improve routing accuracy and operational efficiency across regions. Curating basemaps and road networks to support dynamic routing and high-precision ETA algorithms for logistics and shuttle services.',
        display_order: 3
      }
    ];

    // Clear and insert experience
    await supabase.from('experience').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    const { error: expError } = await supabase.from('experience').insert(experienceData);
    
    if (expError) {
      results.experience = { status: 'error', error: expError.message };
    } else {
      results.experience = { status: 'success', count: experienceData.length };
    }

    return NextResponse.json({
      success: true,
      message: 'All data seeded successfully',
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
    message: 'Use POST to seed education, social_links, and experience data',
    endpoints: {
      POST: 'Seeds education, social_links, and experience tables with correct data'
    }
  });
}
