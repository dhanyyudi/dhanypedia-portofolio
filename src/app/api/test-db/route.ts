import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  const results: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    connection: 'pending',
    tables: {},
    storage: 'pending'
  };

  // Test tables
  const tables = ['projects', 'project_media', 'about', 'skills', 'experience', 'education', 'social_links'];
  
  for (const table of tables) {
    const { count, error } = await supabase
      .from(table)
      .select('*', { count: 'exact', head: true });
    
    if (error && error.code === '42P01') {
      (results.tables as Record<string, string>)[table] = 'NOT_CREATED';
    } else if (error) {
      (results.tables as Record<string, string>)[table] = `ERROR: ${error.message}`;
    } else {
      (results.tables as Record<string, string>)[table] = `OK (${count} rows)`;
      results.connection = 'success';
    }
  }

  // Test storage
  try {
    const { data, error } = await supabase.storage.listBuckets();
    if (error) {
      results.storage = `ERROR: ${error.message}`;
    } else {
      const bucket = data?.find(b => b.name === 'portfolio-media');
      if (bucket) {
        results.storage = `OK (bucket exists, public: ${bucket.public})`;
      } else {
        results.storage = 'NOT_FOUND (create portfolio-media bucket)';
      }
    }
  } catch (e) {
    results.storage = `ERROR: ${e}`;
  }

  // Overall status
  const tablesCreated = Object.values(results.tables as Record<string, string>).some(v => v.startsWith('OK'));
  const allTablesCreated = Object.values(results.tables as Record<string, string>).every(v => v.startsWith('OK'));
  
  if (tablesCreated) {
    results.connection = 'success';
  }
  
  results.summary = {
    connected: results.connection === 'success',
    allTablesReady: allTablesCreated,
    storageReady: (results.storage as string).startsWith('OK')
  };

  return NextResponse.json(results, { status: 200 });
}
