import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jytjdryjgcxgnfwlgtwc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5dGpkcnlqZ2N4Z25md2xndHdjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODYwNjAyNCwiZXhwIjoyMDg0MTgyMDI0fQ.H1c6S6DkhpZUqh6dOqwVUjnwZwtmf3_OsxNIR0ty9m0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateAIInsights() {
  console.log('🔍 Updating AI insights timestamps based on audio durations...\n');

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

    // Get AI insights for this call
    const { data: insights, error: insightsError } = await supabase
      .from('ai_insights')
      .select('*')
      .eq('call_id', call.id)
      .order('timestamp');

    if (insightsError) {
      console.error(`   ❌ Error fetching insights:`, insightsError);
      continue;
    }

    if (!insights || insights.length === 0) {
      console.log(`   ⚠️ No AI insights found`);
      console.log('');
      continue;
    }

    console.log(`   Found ${insights.length} AI insights:`);

    // Distribute AI insights evenly across the call duration
    const totalInsights = insights.length;
    const callDurationSeconds = call.duration_seconds;

    for (let i = 0; i < totalInsights; i++) {
      const insight = insights[i];
      
      // Calculate new timestamp (distribute evenly)
      // First insight at ~15% of duration, last at ~85%
      const position = 0.15 + (i / (totalInsights - 1 || 1)) * 0.7;
      const newTimeSeconds = Math.round(callDurationSeconds * position);
      const newTimeFormatted = `${Math.floor(newTimeSeconds / 60)}:${String(newTimeSeconds % 60).padStart(2, '0')}`;

      console.log(`   - [${insight.type}] "${insight.text.substring(0, 50)}...": ${insight.timestamp} → ${newTimeFormatted}`);

      // Update the insight
      const { error: updateError } = await supabase
        .from('ai_insights')
        .update({ timestamp: newTimeFormatted })
        .eq('id', insight.id);

      if (updateError) {
        console.error(`     ❌ Error updating:`, updateError);
      }
    }

    console.log('');
  }

  console.log('🎉 Done! All AI insights updated to match audio durations.');
}

updateAIInsights();

