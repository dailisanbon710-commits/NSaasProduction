/**
 * Check AI Coaching Data in Supabase
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkData() {
  console.log('🔍 Checking AI Coaching Data in Supabase...\n');

  // Get all calls
  const { data: calls, error: callsError } = await supabase
    .from('calls')
    .select('id, customer_name, rep_name')
    .limit(5);

  if (callsError) {
    console.error('❌ Error fetching calls:', callsError);
    return;
  }

  console.log(`✅ Found ${calls?.length || 0} calls\n`);

  if (!calls || calls.length === 0) {
    console.log('⚠️  No calls found in database');
    return;
  }

  // Check each call for AI coaching data
  for (const call of calls) {
    console.log(`\n📞 Call: ${call.customer_name} (${call.rep_name})`);
    console.log(`   ID: ${call.id}`);

    // Check master coach report
    const { data: masterReport, error: masterError } = await supabase
      .from('master_coach_reports')
      .select('*')
      .eq('call_id', call.id)
      .maybeSingle();

    if (masterError) {
      console.log(`   ❌ Master Report Error:`, masterError);
    } else if (masterReport) {
      console.log(`   ✅ Master Report: Score ${masterReport.overall_score}/100`);
      console.log(`      Focus: ${masterReport.priority_coaching_focus}`);
      console.log(`      Strengths: ${masterReport.top_strengths?.length || 0}`);
      console.log(`      Improvements: ${masterReport.top_improvements?.length || 0}`);
    } else {
      console.log(`   ⚠️  No Master Report`);
    }

    // Check objections
    const { data: objections, error: objectionsError } = await supabase
      .from('objections')
      .select('*')
      .eq('call_id', call.id);

    if (objectionsError) {
      console.log(`   ❌ Objections Error:`, objectionsError);
    } else {
      console.log(`   ✅ Objections: ${objections?.length || 0}`);
      if (objections && objections.length > 0) {
        objections.forEach((obj, i) => {
          console.log(`      ${i + 1}. [${obj.timestamp}] ${obj.category}: "${obj.customer_said?.substring(0, 50)}..."`);
          console.log(`         Response Score: ${obj.response_score}/10`);
        });
      }
    }

    // Check questions
    const { data: questions, error: questionsError } = await supabase
      .from('questions')
      .select('*')
      .eq('call_id', call.id);

    if (questionsError) {
      console.log(`   ❌ Questions Error:`, questionsError);
    } else {
      console.log(`   ✅ Questions: ${questions?.length || 0}`);
      if (questions && questions.length > 0) {
        questions.forEach((q, i) => {
          console.log(`      ${i + 1}. [${q.timestamp}] "${q.question_text?.substring(0, 50)}..."`);
          console.log(`         Type: ${q.question_type} | Score: ${q.quality_score}/10`);
        });
      }
    }
  }

  console.log('\n✅ Data check complete!');
}

checkData().catch(console.error);

