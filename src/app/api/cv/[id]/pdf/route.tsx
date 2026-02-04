import { NextRequest, NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import { createServerSupabaseClient } from '@/lib/supabase';
import { CVPDFTemplate } from '@/lib/pdf/cv-pdf-template';
import { Resume } from '@/types/resume';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log('PDF route: Fetching resume with ID:', id);
    const supabase = createServerSupabaseClient();
    
    // Determine if id is UUID
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

    // Fetch resume data
    let query = supabase.from('resumes').select('*');
    
    if (isUUID) {
      query = query.eq('id', id);
    } else {
      query = query.eq('slug', id);
    }

    const { data, error } = await query.single();

    console.log('PDF route: Query result:', { data: data ? 'found' : 'null', error: error?.message });

    if (error || !data) {
      console.error('PDF route: Resume not found. Error:', error?.message || 'No data returned');
      return NextResponse.json({ error: 'Resume not found', details: error?.message }, { status: 404 });
    }

    const resume = data as Resume;

    // Generate PDF
    const pdfBuffer = await renderToBuffer(<CVPDFTemplate data={resume.content} />);

    // Create filename: CV_Dhany_Yudi_Prasetyo_2024-05-21.pdf
    const name = resume.content.basics.name || 'Resume';
    const formattedName = name.replace(/[^a-zA-Z0-9]/g, '_');
    const date = new Date().toISOString().split('T')[0];
    const filename = `CV_${formattedName}_${date}.pdf`;

    // Return PDF as download (convert Buffer to Uint8Array for NextResponse)
    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
