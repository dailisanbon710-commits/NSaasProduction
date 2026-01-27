import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jytjdryjgcxgnfwlgtwc.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5dGpkcnlqZ2N4Z25md2xndHdjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODYwNjAyNCwiZXhwIjoyMDg0MTgyMDI0fQ.H1c6S6DkhpZUqh6dOqwVUjnwZwtmf3_OsxNIR0ty9m0';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function verifyMigrations() {
  console.log('\n' + '='.repeat(80));
  console.log('🔍 VERIFYING MIGRATIONS');
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
        console.log(`❌ ${table.padEnd(20)} - Error: ${error.message}`);
      } else {
        const icon = count! > 0 ? '✅' : '⚠️';
        console.log(`${icon} ${table.padEnd(20)} - ${count} records`);
      }
    } catch (err: any) {
      console.log(`❌ ${table.padEnd(20)} - ${err.message}`);
    }
  }

  console.log('\n' + '='.repeat(80));
  console.log('📊 DETAILED DATA SAMPLE');
  console.log('='.repeat(80) + '\n');

  // Check if calls table has new columns
  const { data: callData, error: callError } = await supabase
    .from('calls')
    .select('id, customer_name, company, industry, duration_seconds, outcome, rep_id')
    .limit(1);

  if (callError) {
    console.log('❌ Error fetching call data:', callError.message);
  } else if (callData && callData.length > 0) {
    console.log('✅ Calls table new columns:');
    console.log(JSON.stringify(callData[0], null, 2));
  }

  console.log('\n' + '='.repeat(80));
  console.log('✨ MIGRATION VERIFICATION COMPLETE');
  console.log('='.repeat(80) + '\n');
}

verifyMigrations().catch(console.error);
