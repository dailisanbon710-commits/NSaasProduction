/**
 * Run AI Agent System on existing calls
 *
 * This script runs all 10 AI agents on calls to generate coaching insights
 */

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env.local FIRST before any other imports
const result = dotenv.config({ path: resolve(__dirname, '../.env.local') });

if (result.error) {
  console.error('❌ Error loading .env.local:', result.error);
  process.exit(1);
}

console.log('✅ Environment loaded');
console.log('   VITE_SUPABASE_URL:', process.env.VITE_SUPABASE_URL ? '✓' : '✗');
console.log('   VITE_SUPABASE_ANON_KEY:', process.env.VITE_SUPABASE_ANON_KEY ? '✓' : '✗');
console.log('   VITE_OPENAI_API_KEY:', process.env.VITE_OPENAI_API_KEY ? '✓' : '✗');
console.log('');

// NOW import modules that need env vars
import { createClient } from '@supabase/supabase-js';
import { runAllAgents } from '../src/services/aiAgentService.js';

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function runAgentsOnCalls() {
  console.log('🤖 AI Agent System - Running on all calls...\n');

  // Get all calls with transcripts
  const { data: calls, error } = await supabase
    .from('calls')
    .select(`
      id,
      customer_name,
      rep_name,
      call_type,
      transcripts (
        id,
        segments
      )
    `)
    .not('transcripts', 'is', null)
    .order('created_at', { ascending: false })
    .limit(5); // Process 5 most recent calls

  if (error || !calls) {
    console.error('❌ Error fetching calls:', error);
    return;
  }

  console.log(`📞 Found ${calls.length} calls with transcripts\n`);

  for (const call of calls) {
    if (!call.transcripts || call.transcripts.length === 0) {
      console.log(`⚠️  Skipping ${call.customer_name} - no transcript`);
      continue;
    }

    console.log(`\n${'='.repeat(70)}`);
    console.log(`📞 Processing: ${call.customer_name} (${call.call_type})`);
    console.log(`   Rep: ${call.rep_name}`);
    console.log(`   Call ID: ${call.id}`);
    console.log(`${'='.repeat(70)}\n`);

    try {
      // Run all agents
      const results = await runAllAgents(call.id);

      console.log('\n📊 RESULTS SUMMARY:');
      console.log(`   Overall Score: ${results.master_orchestrator.overall_score}/100`);
      console.log(`   Objection Handling: ${results.master_orchestrator.agent_scores.objection_handling}/100`);
      console.log(`   Discovery: ${results.master_orchestrator.agent_scores.discovery}/100`);
      console.log(`   Closing: ${results.master_orchestrator.agent_scores.closing}/100`);
      console.log(`   Talk-Time: ${results.master_orchestrator.agent_scores.talk_time}/100`);
      console.log(`   Question Quality: ${results.master_orchestrator.agent_scores.question_quality}/100`);
      
      console.log('\n💪 TOP STRENGTHS:');
      results.master_orchestrator.top_strengths.forEach((s: string, i: number) => {
        console.log(`   ${i + 1}. ${s}`);
      });

      console.log('\n📈 TOP IMPROVEMENTS:');
      results.master_orchestrator.top_improvements.forEach((imp: string, i: number) => {
        console.log(`   ${i + 1}. ${imp}`);
      });

      console.log(`\n🎯 PRIORITY FOCUS: ${results.master_orchestrator.priority_coaching_focus}`);

      console.log('\n✅ Agent analysis complete!\n');

    } catch (error) {
      console.error(`\n❌ Error processing call:`, error);
    }

    // Wait 2 seconds between calls to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  console.log(`\n${'='.repeat(70)}`);
  console.log('✅ All calls processed!');
  console.log(`${'='.repeat(70)}\n`);
}

runAgentsOnCalls().catch(console.error);

