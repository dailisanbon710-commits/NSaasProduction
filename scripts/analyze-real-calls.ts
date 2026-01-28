/**
 * Analyze Real Calls from Supabase
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function analyzeRealCalls() {
  console.log('🔍 Analyzing Real Calls from Supabase...\n');

  // Get all calls with full details
  const { data: calls, error: callsError } = await supabase
    .from('calls')
    .select('*')
    .order('created_at', { ascending: false });

  if (callsError) {
    console.error('❌ Error fetching calls:', callsError);
    return;
  }

  console.log(`✅ Found ${calls?.length || 0} calls\n`);

  if (!calls || calls.length === 0) {
    console.log('⚠️  No calls found in database');
    return;
  }

  // Analyze each call
  for (const call of calls) {
    console.log(`\n${'='.repeat(80)}`);
    console.log(`📞 CALL: ${call.customer_name} (${call.rep_name})`);
    console.log(`   ID: ${call.id}`);
    console.log(`   Type: ${call.call_type}`);
    console.log(`   Duration: ${call.duration}`);
    console.log(`   Score: ${call.score}/100`);
    console.log(`   Date: ${call.call_date}`);

    // Get transcript
    const { data: transcript, error: transcriptError } = await supabase
      .from('transcripts')
      .select('*')
      .eq('call_id', call.id)
      .maybeSingle();

    if (transcript) {
      console.log(`\n   📝 TRANSCRIPT:`);
      console.log(`      Segments: ${transcript.segments?.length || 0}`);
      if (transcript.segments && transcript.segments.length > 0) {
        console.log(`\n      First 5 segments:`);
        transcript.segments.slice(0, 5).forEach((seg: any, i: number) => {
          console.log(`      ${i + 1}. [${seg.timestamp}] ${seg.speaker}: "${seg.text.substring(0, 60)}..."`);
        });
      }
    } else {
      console.log(`   ⚠️  No transcript found`);
    }

    // Get analysis
    const { data: analysis, error: analysisError } = await supabase
      .from('analysis')
      .select('*')
      .eq('call_id', call.id)
      .maybeSingle();

    if (analysis) {
      console.log(`\n   📊 ANALYSIS:`);
      console.log(`      Sentiment: ${analysis.sentiment_score}`);
      console.log(`      Talk Ratio: ${analysis.talk_ratio}`);
      console.log(`      Key Topics: ${analysis.key_topics?.join(', ') || 'N/A'}`);
      console.log(`      Action Items: ${analysis.action_items?.length || 0}`);
    } else {
      console.log(`   ⚠️  No analysis found`);
    }

    // Get insights
    const { data: insights, error: insightsError } = await supabase
      .from('insights')
      .select('*')
      .eq('call_id', call.id);

    if (insights && insights.length > 0) {
      console.log(`\n   💡 INSIGHTS (${insights.length}):`);
      insights.forEach((insight: any, i: number) => {
        console.log(`      ${i + 1}. [${insight.category}] ${insight.title}`);
        console.log(`         ${insight.description.substring(0, 80)}...`);
      });
    }

    // Get key moments
    const { data: keyMoments, error: momentsError } = await supabase
      .from('key_moments')
      .select('*')
      .eq('call_id', call.id);

    if (keyMoments && keyMoments.length > 0) {
      console.log(`\n   ⭐ KEY MOMENTS (${keyMoments.length}):`);
      keyMoments.forEach((moment: any, i: number) => {
        console.log(`      ${i + 1}. [${moment.timestamp}] ${moment.type}: ${moment.title}`);
        console.log(`         "${moment.description.substring(0, 80)}..."`);
      });
    }
  }

  console.log(`\n${'='.repeat(80)}\n`);
  console.log('✅ Analysis complete!');
}

analyzeRealCalls().catch(console.error);

