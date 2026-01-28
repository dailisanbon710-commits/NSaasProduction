/**
 * Check what data we have for enrichment
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkEnrichmentData() {
  console.log('🔍 Checking Enrichment Data Sources...\n');

  // 1. Check scheduled calls
  console.log('📞 SCHEDULED CALLS:');
  const { data: scheduledCalls } = await supabase
    .from('scheduled_calls')
    .select('*')
    .eq('status', 'scheduled')
    .order('scheduled_date');

  if (scheduledCalls) {
    console.log(`   Found ${scheduledCalls.length} scheduled calls\n`);
    scheduledCalls.forEach((call: any) => {
      console.log(`   • ${call.customer_name} (${call.company || 'No company'})`);
      console.log(`     LinkedIn URL: ${call.linkedin_url || 'None'}`);
      console.log(`     LinkedIn Data: ${call.linkedin_data ? '✅ Has data' : '❌ Empty'}`);
      console.log(`     CRM Data: ${call.crm_data ? '✅ Has data' : '❌ Empty'}`);
      console.log(`     Prior Calls Summary: ${call.prior_calls_summary ? '✅ Has data' : '❌ Empty'}`);
      console.log('');
    });
  }

  // 2. Check if we have prior calls for these customers
  console.log('\n📊 PRIOR CALLS CHECK:');
  if (scheduledCalls) {
    for (const call of scheduledCalls) {
      const { data: priorCalls } = await supabase
        .from('calls')
        .select('id, created_at, call_type, outcome, customer_name')
        .eq('customer_name', call.customer_name)
        .order('created_at', { ascending: false });

      console.log(`   ${call.customer_name}:`);
      if (priorCalls && priorCalls.length > 0) {
        console.log(`     ✅ ${priorCalls.length} prior calls found`);
        priorCalls.slice(0, 3).forEach((pc: any) => {
          console.log(`        - ${new Date(pc.created_at).toLocaleDateString()}: ${pc.call_type} (${pc.outcome || 'N/A'})`);
        });
      } else {
        console.log(`     ❌ No prior calls found`);
      }
      console.log('');
    }
  }

  // 3. Check customer_profiles table
  console.log('\n👥 CUSTOMER PROFILES:');
  const { data: profiles } = await supabase
    .from('customer_profiles')
    .select('*');

  console.log(`   ${profiles?.length || 0} customer profiles in database`);
  if (profiles && profiles.length > 0) {
    profiles.forEach((p: any) => {
      console.log(`   • ${p.customer_name} (${p.company || 'No company'})`);
    });
  }

  // 4. Check call_preparation table
  console.log('\n📋 CALL PREPARATION:');
  const { data: prep } = await supabase
    .from('call_preparation')
    .select('*');

  console.log(`   ${prep?.length || 0} call preparation records`);

  // 5. Check crm_deals table
  console.log('\n💼 CRM DEALS:');
  const { data: deals } = await supabase
    .from('crm_deals')
    .select('*');

  console.log(`   ${deals?.length || 0} CRM deals in database`);

  console.log('\n' + '='.repeat(60));
  console.log('\n✅ Enrichment data check complete!\n');
}

checkEnrichmentData().catch(console.error);

