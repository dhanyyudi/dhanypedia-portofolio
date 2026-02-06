#!/usr/bin/env node
/**
 * Script to add is_featured column to resumes table
 * Run: node scripts/add_featured_column.js
 */

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Error: SUPABASE_SERVICE_ROLE_KEY environment variable is required');
  console.error('Please set it in your .env.local file or export it in your shell');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function addFeaturedColumn() {
  console.log('🔧 Adding is_featured column to resumes table...\n');

  try {
    // Check if column already exists
    const { data: columns, error: checkError } = await supabase
      .from('information_schema.columns')
      .select('column_name')
      .eq('table_name', 'resumes')
      .eq('column_name', 'is_featured');

    if (checkError) {
      console.error('❌ Error checking columns:', checkError.message);
      process.exit(1);
    }

    if (columns && columns.length > 0) {
      console.log('✅ Column "is_featured" already exists in resumes table');
      return;
    }

    // Add the column using raw SQL via rpc
    const { error } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE resumes 
        ADD COLUMN is_featured BOOLEAN DEFAULT FALSE;
        
        -- Add comment for documentation
        COMMENT ON COLUMN resumes.is_featured IS 'Whether this CV is featured on the About page';
      `
    });

    if (error) {
      // Try alternative method using REST API
      console.log('⚠️ RPC method failed, trying REST API...\n');
      
      const response = await fetch(`${SUPABASE_URL}/rest/v1/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          'apikey': SUPABASE_SERVICE_ROLE_KEY,
          'Prefer': 'resolution=merge-duplicates',
        },
        body: JSON.stringify({
          query: 'ALTER TABLE resumes ADD COLUMN is_featured BOOLEAN DEFAULT FALSE;'
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`);
      }
    }

    console.log('✅ Successfully added "is_featured" column to resumes table');
    console.log('   - Type: BOOLEAN');
    console.log('   - Default: FALSE');
    console.log('   - Nullable: YES (with default)');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n💡 Manual alternative:');
    console.log('   1. Go to your Supabase Dashboard > SQL Editor');
    console.log('   2. Navigate to SQL Editor');
    console.log('   3. Run: ALTER TABLE resumes ADD COLUMN is_featured BOOLEAN DEFAULT FALSE;');
    process.exit(1);
  }
}

addFeaturedColumn();
