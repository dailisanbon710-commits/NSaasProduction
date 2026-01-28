/**
 * Check what scores are in the analysis table
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAnalysisScores() {
  console.log('🔍 Checking Analysis Table Scores...\n');

  const { data: analyses, error } = await supabase
    .from('analysis')
    .select('*, calls(customer_name, rep_name)')
    .order('created_at', { ascending: false });

  if (error || !analyses) {
    console.error('❌ Error:', error);
    return;
  }

  analyses.forEach((analysis: any) => {
    const call = analysis.calls;
    console.log(`📞 ${call.customer_name} (${call.rep_name})`);
    console.log(`   Call ID: ${analysis.call_id}`);
    console.log(`   Scores:`, JSON.stringify(analysis.scores, null, 2));
    console.log('');
  });

  console.log('✅ Check complete!\n');
}

checkAnalysisScores().catch(console.error);

