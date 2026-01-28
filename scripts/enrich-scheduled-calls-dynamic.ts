/**
 * DYNAMIC Enrichment Pipeline - NO HARDCODED DATA
 * 
 * This script enriches scheduled calls with REAL data from:
 * 1. LinkedIn API (or Proxycurl/RapidAPI)
 * 2. CRM API (Salesforce/HubSpot)
 * 3. Prior Calls from Supabase
 * 
 * For new scheduled calls, this will automatically:
 * - Fetch LinkedIn profile data
 * - Pull CRM deal information
 * - Summarize prior call history
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// LinkedIn API Configuration
const LINKEDIN_API_KEY = process.env.LINKEDIN_API_KEY || process.env.PROXYCURL_API_KEY;
const LINKEDIN_API_URL = 'https://nubela.co/proxycurl/api/v2/linkedin'; // Proxycurl API

// CRM API Configuration
const CRM_TYPE = process.env.CRM_TYPE || 'hubspot'; // 'salesforce' or 'hubspot'
const CRM_API_KEY = process.env.CRM_API_KEY || process.env.HUBSPOT_API_KEY;
const CRM_API_URL = process.env.CRM_API_URL || 'https://api.hubapi.com';

/**
 * Fetch LinkedIn data from real API
 */
async function fetchLinkedInData(linkedinUrl: string | null): Promise<any> {
  if (!linkedinUrl || !LINKEDIN_API_KEY) {
    console.log('   ⚠️  No LinkedIn URL or API key - skipping LinkedIn enrichment');
    return null;
  }

  try {
    // Using Proxycurl API (https://nubela.co/proxycurl)
    const response = await fetch(`${LINKEDIN_API_URL}?url=${encodeURIComponent(linkedinUrl)}`, {
      headers: {
        'Authorization': `Bearer ${LINKEDIN_API_KEY}`
      }
    });

    if (!response.ok) {
      console.log(`   ⚠️  LinkedIn API error: ${response.status}`);
      return null;
    }

    const data = await response.json();

    return {
      title: data.occupation || data.headline,
      company_size: data.experiences?.[0]?.company_size,
      industry: data.industry,
      recent_activity: data.activities?.[0]?.title || null,
      profile_url: linkedinUrl
    };
  } catch (error) {
    console.error('   ❌ LinkedIn API error:', error);
    return null;
  }
}

/**
 * Fetch CRM data from real API
 */
async function fetchCRMData(customerEmail: string | null, customerName: string): Promise<any> {
  if (!CRM_API_KEY) {
    console.log('   ⚠️  No CRM API key - skipping CRM enrichment');
    return null;
  }

  try {
    if (CRM_TYPE === 'hubspot') {
      // HubSpot API
      const searchUrl = `${CRM_API_URL}/crm/v3/objects/contacts/search`;
      const response = await fetch(searchUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${CRM_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          filterGroups: [{
            filters: [{
              propertyName: customerEmail ? 'email' : 'firstname',
              operator: 'EQ',
              value: customerEmail || customerName.split(' ')[0]
            }]
          }]
        })
      });

      if (!response.ok) {
        console.log(`   ⚠️  CRM API error: ${response.status}`);
        return null;
      }

      const data = await response.json();
      const contact = data.results?.[0];

      if (!contact) {
        console.log('   ⚠️  No CRM contact found');
        return null;
      }

      // Get associated deals
      const dealsUrl = `${CRM_API_URL}/crm/v3/objects/contacts/${contact.id}/associations/deals`;
      const dealsResponse = await fetch(dealsUrl, {
        headers: { 'Authorization': `Bearer ${CRM_API_KEY}` }
      });

      const dealsData = await dealsResponse.json();
      const dealId = dealsData.results?.[0]?.id;

      if (dealId) {
        const dealUrl = `${CRM_API_URL}/crm/v3/objects/deals/${dealId}`;
        const dealResponse = await fetch(dealUrl, {
          headers: { 'Authorization': `Bearer ${CRM_API_KEY}` }
        });
        const deal = await dealResponse.json();

        return {
          deal_stage: deal.properties?.dealstage,
          deal_value: parseFloat(deal.properties?.amount || '0'),
          probability: parseInt(deal.properties?.hs_deal_stage_probability || '0'),
          lead_source: deal.properties?.hs_analytics_source,
          days_in_pipeline: deal.properties?.days_to_close
        };
      }
    } else if (CRM_TYPE === 'salesforce') {
      // Salesforce API implementation
      // TODO: Add Salesforce API integration
      console.log('   ⚠️  Salesforce integration not yet implemented');
      return null;
    }

    return null;
  } catch (error) {
    console.error('   ❌ CRM API error:', error);
    return null;
  }
}

/**
 * Get REAL prior calls summary from Supabase
 */
async function getRealPriorCallsSummary(customerName: string): Promise<{ summary: string; count: number; calls: any[] }> {
  // Find all completed calls with this customer
  const { data: priorCalls, error } = await supabase
    .from('calls')
    .select(`
      id,
      created_at,
      call_type,
      outcome,
      duration_seconds,
      analysis (
        scores
      ),
      transcripts (
        segments
      )
    `)
    .eq('customer_name', customerName)
    .eq('status', 'completed')
    .order('created_at', { ascending: false })
    .limit(10);

  if (error || !priorCalls || priorCalls.length === 0) {
    return {
      summary: 'No prior calls with this customer',
      count: 0,
      calls: []
    };
  }

  // Generate detailed summary from REAL data
  const callSummaries = priorCalls.map((call: any) => {
    const date = new Date(call.created_at).toLocaleDateString();
    const analysis = call.analysis?.[0];
    const score = analysis?.scores?.overall || 'N/A';
    const duration = call.duration_seconds ? `${Math.floor(call.duration_seconds / 60)}min` : 'N/A';
    
    // Extract key points from transcript
    const transcript = call.transcripts?.[0];
    const segments = transcript?.segments || [];
    const customerSegments = segments.filter((s: any) => s.speaker === 'Customer');
    const keyQuote = customerSegments[customerSegments.length - 1]?.text?.substring(0, 100) || '';

    return {
      date,
      type: call.call_type,
      score,
      duration,
      outcome: call.outcome,
      keyQuote
    };
  });

  const summaryText = callSummaries.map((s, i) => 
    `${i + 1}. ${s.date} - ${s.type} (${s.duration}, Score: ${s.score}/100)\n   Outcome: ${s.outcome}\n   ${s.keyQuote ? `Last comment: "${s.keyQuote}..."` : ''}`
  ).join('\n\n');

  return {
    summary: `${priorCalls.length} previous calls:\n\n${summaryText}`,
    count: priorCalls.length,
    calls: callSummaries
  };
}

/**
 * Main enrichment function
 */
async function enrichScheduledCallsDynamic() {
  console.log('🔄 DYNAMIC Enrichment Pipeline - Fetching REAL Data...\n');
  console.log('📡 Data Sources:');
  console.log(`   LinkedIn API: ${LINKEDIN_API_KEY ? '✅ Configured' : '❌ Not configured'}`);
  console.log(`   CRM API (${CRM_TYPE}): ${CRM_API_KEY ? '✅ Configured' : '❌ Not configured'}`);
  console.log(`   Prior Calls: ✅ Supabase\n`);

  // Get all scheduled calls that need enrichment
  const { data: scheduledCalls, error } = await supabase
    .from('scheduled_calls')
    .select('*')
    .eq('status', 'scheduled')
    .order('scheduled_date');

  if (error || !scheduledCalls) {
    console.error('❌ Error fetching scheduled calls:', error);
    return;
  }

  console.log(`📞 Found ${scheduledCalls.length} scheduled calls to enrich\n`);

  for (const call of scheduledCalls) {
    console.log(`${'='.repeat(60)}`);
    console.log(`📞 ${call.customer_name} (${call.company || 'No company'})`);
    console.log(`   Scheduled: ${new Date(call.scheduled_date).toLocaleString()}`);

    // 1. Fetch REAL LinkedIn data
    console.log('\n   🔍 Fetching LinkedIn data...');
    const linkedinData = await fetchLinkedInData(call.linkedin_url);
    if (linkedinData) {
      console.log(`   ✅ LinkedIn: ${linkedinData.title} at ${linkedinData.company_size || 'Unknown'} company`);
    }

    // 2. Fetch REAL CRM data
    console.log('\n   💼 Fetching CRM data...');
    const crmData = await fetchCRMData(null, call.customer_name);
    if (crmData) {
      console.log(`   ✅ CRM: ${crmData.deal_stage} - $${crmData.deal_value?.toLocaleString()}`);
    }

    // 3. Get REAL prior calls from Supabase
    console.log('\n   📊 Fetching prior calls...');
    const priorCalls = await getRealPriorCallsSummary(call.customer_name);
    console.log(`   ✅ Prior Calls: ${priorCalls.count} found`);

    // 4. Generate AI prep insights from REAL data
    const aiPrepInsights: string[] = [];
    
    if (linkedinData) {
      aiPrepInsights.push(`LinkedIn: ${linkedinData.title}${linkedinData.recent_activity ? ` - Recently: ${linkedinData.recent_activity}` : ''}`);
    }
    
    if (crmData) {
      aiPrepInsights.push(`CRM: ${crmData.deal_stage} stage, $${crmData.deal_value?.toLocaleString()} value, ${crmData.probability}% probability`);
    }
    
    if (priorCalls.count > 0) {
      const lastCall = priorCalls.calls[0];
      aiPrepInsights.push(`Last call: ${lastCall.date} - ${lastCall.type} (Score: ${lastCall.score}/100)`);
      aiPrepInsights.push(`Previous outcome: ${lastCall.outcome}`);
      if (lastCall.keyQuote) {
        aiPrepInsights.push(`Last comment: "${lastCall.keyQuote}..."`);
      }
    } else {
      aiPrepInsights.push('First interaction - focus on discovery and building rapport');
    }

    // 5. Update scheduled call with REAL enrichment data
    const { error: updateError } = await supabase
      .from('scheduled_calls')
      .update({
        linkedin_data: linkedinData,
        crm_data: crmData,
        prior_calls_summary: priorCalls.summary,
        ai_prep_insights: aiPrepInsights
      })
      .eq('id', call.id);

    if (updateError) {
      console.error('\n   ❌ Error updating scheduled call:', updateError);
    } else {
      console.log('\n   ✅ Enriched successfully with REAL data!');
    }
    console.log('');
  }

  console.log(`${'='.repeat(60)}`);
  console.log('\n✅ Dynamic enrichment complete!\n');
}

enrichScheduledCallsDynamic().catch(console.error);

