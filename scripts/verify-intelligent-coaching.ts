/**
 * Verify intelligent coaching data with full details
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyIntelligentCoaching() {
  console.log('🔍 Verifying Intelligent AI Coaching Data...\n');

  const { data: calls, error } = await supabase
    .from('calls')
    .select('id, customer_name, rep_name')
    .order('created_at', { ascending: false })
    .limit(1);

  if (error || !calls || calls.length === 0) {
    console.error('❌ Error:', error);
    return;
  }

  const call = calls[0];
  console.log(`📞 Call: ${call.customer_name} (${call.rep_name})`);
  console.log(`   ID: ${call.id}\n`);

  // Get objections with full details
  const { data: objections } = await supabase
    .from('objections')
    .select('*')
    .eq('call_id', call.id)
    .order('timestamp');

  if (objections && objections.length > 0) {
    console.log(`\n🚨 OBJECTIONS (${objections.length}):\n`);
    objections.forEach((obj, i) => {
      console.log(`${i + 1}. [${obj.timestamp}] ${obj.category.toUpperCase()} - ${obj.severity} severity`);
      console.log(`   Customer: "${obj.customer_said}"`);
      console.log(`   Rep Response (${obj.response_score}/10): "${obj.rep_response}"`);
      console.log(`   💡 Suggested Better Responses:`);
      obj.suggested_responses?.forEach((sugg: string, j: number) => {
        console.log(`      ${j + 1}. "${sugg}"`);
      });
      console.log('');
    });
  }

  // Get questions with full details
  const { data: questions } = await supabase
    .from('questions')
    .select('*')
    .eq('call_id', call.id)
    .order('timestamp');

  if (questions && questions.length > 0) {
    console.log(`\n❓ QUESTIONS (${questions.length}):\n`);
    questions.forEach((q, i) => {
      console.log(`${i + 1}. [${q.timestamp}] ${q.question_type.toUpperCase()} - ${q.quality_score}/10`);
      console.log(`   Question: "${q.question_text}"`);
      
      if (q.why_good) {
        console.log(`   ✅ Why Good: ${q.why_good}`);
      }
      
      if (q.why_bad) {
        console.log(`   ❌ Why Bad: ${q.why_bad}`);
      }
      
      if (q.better_alternative) {
        console.log(`   💡 Better Alternative: ${q.better_alternative}`);
      }
      
      console.log('');
    });
  }

  console.log('\n✅ Verification complete!\n');
}

verifyIntelligentCoaching().catch(console.error);

