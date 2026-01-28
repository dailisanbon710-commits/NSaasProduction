/**
 * Check agent scores in master_coach_reports
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAgentScores() {
  console.log('🔍 Checking Agent Scores...\n');

  const { data: reports, error } = await supabase
    .from('master_coach_reports')
    .select('*, calls(customer_name, rep_name)')
    .order('overall_score', { ascending: false });

  if (error || !reports) {
    console.error('❌ Error:', error);
    return;
  }

  reports.forEach((report: any) => {
    const call = report.calls;
    console.log(`📞 ${call.customer_name} (${call.rep_name})`);
    console.log(`   Overall Score: ${report.overall_score}/100`);
    console.log(`   Agent Scores:`);
    console.log(`      Discovery: ${report.agent_scores.discovery}/100`);
    console.log(`      Objection Handling: ${report.agent_scores.objection_handling}/100`);
    console.log(`      Rapport Building: ${report.agent_scores.rapport_building}/100`);
    console.log(`      Closing: ${report.agent_scores.closing}/100`);
    console.log('');
  });

  console.log('✅ Check complete!\n');
}

checkAgentScores().catch(console.error);

