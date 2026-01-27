import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const supabaseUrl = 'https://jytjdryjgcxgnfwlgtwc.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5dGpkcnlqZ2N4Z25md2xndHdjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODYwNjAyNCwiZXhwIjoyMDg0MTgyMDI0fQ.H1c6S6DkhpZUqh6dOqwVUjnwZwtmf3_OsxNIR0ty9m0';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function verifyMigrations() {
  console.log('\n' + '='.repeat(80));
  console.log('📋 MIGRATION FILES VERIFICATION');
  console.log('='.repeat(80) + '\n');

  const migrationsDir = path.join(process.cwd(), 'supabase', 'migrations');
  const files = fs.readdirSync(migrationsDir).sort();

  console.log('📂 Migration files found:');
  files.forEach(file => {
    const filePath = path.join(migrationsDir, file);
    const stats = fs.statSync(filePath);
    const size = (stats.size / 1024).toFixed(1);
    console.log(`   ✓ ${file} (${size} KB)`);
  });

  console.log('\n' + '='.repeat(80));
  console.log('📊 CURRENT DATABASE STATE');
  console.log('='.repeat(80) + '\n');

  const tables = [
    'calls',
    'analysis',
    'transcripts',
    'ai_insights',
    'reps',
    'managers',
    'scheduled_calls',
    'key_moments'
  ];

  for (const table of tables) {
    try {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.log(`❌ ${table.padEnd(20)} - ${error.message}`);
      } else {
        console.log(`✅ ${table.padEnd(20)} - ${count} records`);
      }
    } catch (err: any) {
      console.log(`❌ ${table.padEnd(20)} - Error`);
    }
  }

  console.log('\n' + '='.repeat(80));
  console.log('🔍 CALLS TABLE DETAILS');
  console.log('='.repeat(80) + '\n');

  const { data: calls, error: callsError } = await supabase
    .from('calls')
    .select('id, external_call_id, customer_name, company, industry, duration_seconds, outcome, rep_id')
    .order('created_at', { ascending: false })
    .limit(3);

  if (callsError) {
    console.log('❌ Error:', callsError.message);
  } else if (calls && calls.length > 0) {
    console.log(`Total calls: ${calls.length}\n`);
    calls.forEach((call, idx) => {
      console.log(`${idx + 1}. ${call.external_call_id || 'No ID'} | ${call.customer_name || 'No Customer'}`);
      console.log(`   Company: ${call.company || 'NULL'}`);
      console.log(`   Industry: ${call.industry || 'NULL'}`);
      console.log(`   Duration: ${call.duration_seconds || 'NULL'} sec`);
      console.log(`   Outcome: ${call.outcome || 'NULL'}`);
      console.log(`   Rep ID: ${call.rep_id || 'NULL'}\n`);
    });
  }

  console.log('\n' + '='.repeat(80));
  console.log('🔍 REPS TABLE DETAILS');
  console.log('='.repeat(80) + '\n');

  const { data: reps, error: repsError } = await supabase
    .from('reps')
    .select('id, name, email, hire_date, status');

  if (repsError) {
    console.log('❌ Error:', repsError.message);
  } else if (reps && reps.length > 0) {
    console.log(`Total reps: ${reps.length}\n`);
    reps.forEach((rep, idx) => {
      console.log(`${idx + 1}. ${rep.name} (${rep.email})`);
      console.log(`   ID: ${rep.id}`);
      console.log(`   Hire Date: ${rep.hire_date}`);
      console.log(`   Status: ${rep.status}\n`);
    });
  } else {
    console.log('⚠️  No reps found yet\n');
  }

  console.log('\n' + '='.repeat(80));
  console.log('🎯 READY TO RUN MIGRATIONS');
  console.log('='.repeat(80) + '\n');

  console.log('📋 Migration Order:');
  console.log('   1. supabase/migrations/001_add_missing_columns_and_tables.sql');
  console.log('      - Adds columns to calls table');
  console.log('      - Creates ai_insights, reps, managers, scheduled_calls, key_moments tables');
  console.log('      - Adds indexes and triggers');
  console.log('      - Enables RLS with policies\n');
  
  console.log('   2. supabase/migrations/002_seed_data.sql');
  console.log('      - Inserts reps and managers');
  console.log('      - Updates calls with company, industry, duration, outcome, rep_id');
  console.log('      - Updates transcripts with segments');
  console.log('      - Inserts ai_insights, key_moments, scheduled_calls\n');

  console.log('✨ Copy these files to Supabase SQL Editor and run in order!');
  console.log('   https://supabase.com/dashboard/project/jytjdryjgcxgnfwlgtwc/sql/new\n');
}

verifyMigrations().catch(console.error);
