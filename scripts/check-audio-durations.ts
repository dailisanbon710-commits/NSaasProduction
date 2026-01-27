import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jytjdryjgcxgnfwlgtwc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5dGpkcnlqZ2N4Z25md2xndHdjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODYwNjAyNCwiZXhwIjoyMDg0MTgyMDI0fQ.H1c6S6DkhpZUqh6dOqwVUjnwZwtmf3_OsxNIR0ty9m0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAudioDurations() {
  console.log('🔍 Checking audio files and durations...\n');

  // Get all calls with audio URLs
  const { data: calls, error } = await supabase
    .from('calls')
    .select('id, rep_name, customer_name, audio_url, duration_seconds')
    .not('audio_url', 'is', null)
    .order('id');

  if (error) {
    console.error('❌ Error fetching calls:', error);
    return;
  }

  if (!calls || calls.length === 0) {
    console.log('⚠️ No calls with audio URLs found');
    return;
  }

  console.log(`✅ Found ${calls.length} calls with audio files:\n`);

  for (const call of calls) {
    console.log(`📞 Call ID: ${call.id}`);
    console.log(`   Rep: ${call.rep_name}`);
    console.log(`   Customer: ${call.customer_name}`);
    console.log(`   Audio URL: ${call.audio_url}`);
    console.log(`   Duration (DB): ${call.duration_seconds} seconds (${Math.floor(call.duration_seconds / 60)}:${String(call.duration_seconds % 60).padStart(2, '0')})`);
    console.log('');
  }

  console.log('\n💡 Next steps:');
  console.log('1. Download audio files and check actual durations');
  console.log('2. Update duration_seconds in database if needed');
  console.log('3. Update key_moments timestamps to match audio duration');
}

checkAudioDurations();

