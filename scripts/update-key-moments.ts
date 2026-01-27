import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jytjdryjgcxgnfwlgtwc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5dGpkcnlqZ2N4Z25md2xndHdjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODYwNjAyNCwiZXhwIjoyMDg0MTgyMDI0fQ.H1c6S6DkhpZUqh6dOqwVUjnwZwtmf3_OsxNIR0ty9m0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateKeyMoments() {
  console.log('🔍 Updating key moments based on audio durations...\n');

  // Get all calls with their durations
  const { data: calls, error: callsError } = await supabase
    .from('calls')
    .select('id, rep_name, customer_name, duration_seconds')
    .order('id');

  if (callsError) {
    console.error('❌ Error fetching calls:', callsError);
    return;
  }

  if (!calls || calls.length === 0) {
    console.log('⚠️ No calls found');
    return;
  }

  console.log(`✅ Found ${calls.length} calls\n`);

  for (const call of calls) {
    console.log(`📞 Call: ${call.rep_name} → ${call.customer_name}`);
    console.log(`   Duration: ${call.duration_seconds}s (${Math.floor(call.duration_seconds / 60)}:${String(call.duration_seconds % 60).padStart(2, '0')})`);

    // Get key moments for this call
    const { data: moments, error: momentsError } = await supabase
      .from('key_moments')
      .select('*')
      .eq('call_id', call.id)
      .order('time');

    if (momentsError) {
      console.error(`   ❌ Error fetching moments:`, momentsError);
      continue;
    }

    if (!moments || moments.length === 0) {
      console.log(`   ⚠️ No key moments found`);
      console.log('');
      continue;
    }

    console.log(`   Found ${moments.length} key moments:`);

    // Distribute key moments evenly across the call duration
    const totalMoments = moments.length;
    const callDurationSeconds = call.duration_seconds;

    for (let i = 0; i < totalMoments; i++) {
      const moment = moments[i];
      
      // Calculate new timestamp (distribute evenly)
      // First moment at ~20% of duration, last at ~80%
      const position = (i + 1) / (totalMoments + 1);
      const newTimeSeconds = Math.round(callDurationSeconds * position);
      const newTimeFormatted = `${Math.floor(newTimeSeconds / 60)}:${String(newTimeSeconds % 60).padStart(2, '0')}`;

      console.log(`   - "${moment.label}": ${moment.time} → ${newTimeFormatted}`);

      // Update the moment
      const { error: updateError } = await supabase
        .from('key_moments')
        .update({ time: newTimeFormatted })
        .eq('id', moment.id);

      if (updateError) {
        console.error(`     ❌ Error updating:`, updateError);
      }
    }

    console.log('');
  }

  console.log('🎉 Done! All key moments updated to match audio durations.');
}

updateKeyMoments();

