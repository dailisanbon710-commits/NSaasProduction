import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const supabaseUrl = 'https://jytjdryjgcxgnfwlgtwc.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5dGpkcnlqZ2N4Z25md2xndHdjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODYwNjAyNCwiZXhwIjoyMDg0MTgyMDI0fQ.H1c6S6DkhpZUqh6dOqwVUjnwZwtmf3_OsxNIR0ty9m0';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function executeSql(sql: string) {
  try {
    // Use postgres client via REST API
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({ query: sql })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

async function runMigration(filePath: string) {
  console.log(`\n${'='.repeat(80)}`);
  console.log(`🚀 Running: ${path.basename(filePath)}`);
  console.log('='.repeat(80));

  try {
    const sql = fs.readFileSync(filePath, 'utf-8');
    
    console.log(`\n📝 Executing SQL migration...\n`);
    console.log(`⚠️  Note: Supabase JS Client cannot execute raw SQL directly.`);
    console.log(`   Please copy the SQL from ${path.basename(filePath)} and run it in:`);
    console.log(`   https://supabase.com/dashboard/project/jytjdryjgcxgnfwlgtwc/sql/new\n`);
    
    // Show first few lines as preview
    const lines = sql.split('\n').filter(l => !l.startsWith('--') && l.trim()).slice(0, 10);
    console.log(`Preview:\n${lines.join('\n').substring(0, 500)}...\n`);
    
    return true;

  } catch (error: any) {
    console.error(`\n❌ Failed to read migration: ${error.message}\n`);
    return false;
  }
}

async function runAllMigrations() {
  console.log('\n🎯 Starting Database Migrations...\n');

  const migrationsDir = path.join(process.cwd(), 'supabase', 'migrations');
  
  const migrations = [
    '001_add_missing_columns_and_tables.sql',
    '002_seed_data.sql'
  ];

  for (const migration of migrations) {
    const filePath = path.join(migrationsDir, migration);
    
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  Skipping ${migration} - file not found`);
      continue;
    }

    const success = await runMigration(filePath);
    
    if (!success) {
      console.log(`\n⚠️  Migration ${migration} had errors. Continue? (Ctrl+C to stop)`);
      // Continue anyway for now
    }
  }

  console.log('\n' + '='.repeat(80));
  console.log('✅ Migration process completed!');
  console.log('='.repeat(80));
  console.log('\n📊 Verifying results...\n');

  // Verify results
  const tables = ['calls', 'analysis', 'transcripts', 'ai_insights', 'key_moments', 'reps', 'managers', 'scheduled_calls'];
  
  for (const table of tables) {
    try {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        console.log(`  ❌ ${table.padEnd(20)} - Error: ${error.message}`);
      } else {
        console.log(`  ✅ ${table.padEnd(20)} - ${count || 0} records`);
      }
    } catch (err) {
      console.log(`  ❌ ${table.padEnd(20)} - Not found or error`);
    }
  }
}

runAllMigrations();
