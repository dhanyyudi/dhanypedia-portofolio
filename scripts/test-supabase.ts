// Test Supabase connection
// Run with: npx tsx scripts/test-supabase.ts

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

async function testConnection() {
  console.log('🔌 Testing Supabase Connection...\n');
  console.log('URL:', supabaseUrl);
  console.log('Key:', supabaseAnonKey?.substring(0, 20) + '...\n');

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Missing environment variables!');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  // Test 1: Check connection by querying system
  console.log('📡 Test 1: Connection check...');
  try {
    const { error } = await supabase.from('projects').select('count', { count: 'exact', head: true });
    if (error && error.code === '42P01') {
      console.log('⚠️  Tables not created yet (this is expected if you haven\'t run the SQL)');
    } else if (error) {
      console.error('❌ Query error:', error.message);
    } else {
      console.log('✅ Connected successfully!');
    }
  } catch (e) {
    console.error('❌ Connection failed:', e);
  }

  // Test 2: Check if storage bucket exists
  console.log('\n📦 Test 2: Storage bucket check...');
  try {
    const { data, error } = await supabase.storage.listBuckets();
    if (error) {
      console.error('❌ Storage error:', error.message);
    } else {
      const mediaBucket = data?.find(b => b.name === 'portfolio-media');
      if (mediaBucket) {
        console.log('✅ Storage bucket "portfolio-media" exists!');
        console.log('   Public:', mediaBucket.public ? 'Yes' : 'No');
      } else {
        console.log('⚠️  Storage bucket "portfolio-media" not found. Please create it.');
      }
    }
  } catch (e) {
    console.error('❌ Storage check failed:', e);
  }

  // Test 3: List tables
  console.log('\n📋 Test 3: Tables check...');
  const tables = ['projects', 'project_media', 'about', 'skills', 'experience', 'education', 'social_links'];
  
  for (const table of tables) {
    const { error } = await supabase.from(table).select('count', { count: 'exact', head: true });
    if (error && error.code === '42P01') {
      console.log(`   ⚠️  ${table} - NOT CREATED`);
    } else if (error) {
      console.log(`   ❌ ${table} - Error: ${error.message}`);
    } else {
      console.log(`   ✅ ${table} - OK`);
    }
  }

  console.log('\n✨ Test complete!');
}

testConnection();
