import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

interface MediaFile {
  id: string;
  name: string;
  url: string;
  size: number;
  created_at: string;
  type: 'image' | 'video';
  folder: string;
}

// GET - List all media files from storage (including subfolders)
export async function GET() {
  try {
    const adminClient = createServerSupabaseClient();
    const allMedia: MediaFile[] = [];

    // List folders first
    const { data: folders, error: folderError } = await adminClient
      .storage
      .from('portfolio-media')
      .list('', { limit: 100 });

    if (folderError) {
      console.error('Storage list error:', folderError);
      return NextResponse.json({ error: folderError.message }, { status: 400 });
    }

    // Process root level files and folders
    for (const item of folders || []) {
      // Skip hidden files
      if (item.name.startsWith('.')) continue;

      // Check if it's a folder (no id means it's a folder)
      if (!item.id) {
        // List files inside this folder
        const { data: subFiles } = await adminClient
          .storage
          .from('portfolio-media')
          .list(item.name, { 
            limit: 100,
            sortBy: { column: 'created_at', order: 'desc' }
          });

        for (const file of subFiles || []) {
          if (!file.id || file.name.startsWith('.')) continue;

          const filePath = `${item.name}/${file.name}`;
          const { data: urlData } = adminClient
            .storage
            .from('portfolio-media')
            .getPublicUrl(filePath);

          const isVideo = file.metadata?.mimetype?.startsWith('video') || 
                         file.name.match(/\.(mp4|webm|mov|avi)$/i);

          allMedia.push({
            id: file.id,
            name: file.name,
            url: urlData.publicUrl,
            size: file.metadata?.size || 0,
            created_at: file.created_at || '',
            type: isVideo ? 'video' : 'image',
            folder: item.name
          });
        }
      } else {
        // It's a file at root level
        const { data: urlData } = adminClient
          .storage
          .from('portfolio-media')
          .getPublicUrl(item.name);

        const isVideo = item.metadata?.mimetype?.startsWith('video') ||
                       item.name.match(/\.(mp4|webm|mov|avi)$/i);

        allMedia.push({
          id: item.id,
          name: item.name,
          url: urlData.publicUrl,
          size: item.metadata?.size || 0,
          created_at: item.created_at || '',
          type: isVideo ? 'video' : 'image',
          folder: ''
        });
      }
    }

    // Sort by created_at descending
    allMedia.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    return NextResponse.json(allMedia);
  } catch (error) {
    console.error('Media API error:', error);
    return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 });
  }
}
