#!/usr/bin/env node
/**
 * Apply migration to add is_featured column
 * Run: node scripts/apply_migration.mjs
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const projectRef = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace('https://', '').replace('.supabase.co', '');

if (!projectRef) {
  console.error('❌ Error: Could not determine project ref from NEXT_PUBLIC_SUPABASE_URL');
  process.exit(1);
}
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!serviceRoleKey) {
  console.error('❌ Error: SUPABASE_SERVICE_ROLE_KEY environment variable is required');
  console.error('It should be in your .env.local file');
  process.exit(1);
}

async function applyMigration() {
  console.log('🔧 Applying migration to add is_featured column...\n');
  
  // Read SQL file
  const sqlPath = join(__dirname, 'add_featured_column.sql');
  const sql = readFileSync(sqlPath, 'utf8');
  
  try {
    const response = await fetch(`https://${projectRef}.supabase.co/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${serviceRoleKey}`,
        'apikey': serviceRoleKey,
      },
      body: JSON.stringify({ sql }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`HTTP ${response.status}: ${error}`);
    }

    console.log('✅ Migration applied successfully!');
    console.log('\n📋 SQL executed:');
    console.log(sql);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n💡 Please run the SQL manually:');
    console.log('   1. Go to: https://supabase.com/dashboard/project/' + projectRef + '/sql/new');
    console.log('   2. Copy the SQL from: scripts/add_featured_column.sql');
    console.log('   3. Click "Run"');
  }
}

applyMigration();
