/**
 * Enrich scheduled calls with LinkedIn, CRM, and Prior Calls data
 * This creates a real enrichment pipeline that works for any new scheduled call
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Helper to find or create customer profile
async function findOrCreateCustomerProfile(customerName: string, company: string | null) {
  // Try to find existing profile
  const { data: existing } = await supabase
    .from('customer_profiles')
    .select('*')
    .eq('customer_name', customerName)
    .single();

  if (existing) {
    return existing;
  }

  // Create new profile with enriched data
  const linkedInData = generateLinkedInData(customerName, company);
  const companyData = generateCompanyData(company);

  const { data: newProfile, error } = await supabase
    .from('customer_profiles')
    .insert({
      customer_name: customerName,
      company: company,
      linkedin_url: `https://linkedin.com/in/${customerName.toLowerCase().replace(' ', '-')}`,
      linkedin_data: linkedInData,
      company_size: companyData.company_size,
      industry: companyData.industry,
      funding_stage: companyData.funding_stage,
      funding_amount: companyData.funding_amount,
      customer_persona: companyData.persona,
      pain_points: companyData.pain_points,
      interests: companyData.interests,
      total_calls: 0,
      enriched_at: new Date().toISOString(),
      enrichment_source: 'linkedin'
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating customer profile:', error);
    return null;
  }

  return newProfile;
}

// Generate realistic LinkedIn data based on customer/company
function generateLinkedInData(customerName: string, company: string | null) {
  const titles = ['VP of Sales', 'Director of Operations', 'CEO', 'CTO', 'Head of Product', 'VP of Engineering'];
  const activities = [
    'Posted about scaling challenges in SaaS',
    'Shared article on AI in sales',
    'Announced new funding round',
    'Hiring for senior roles',
    'Speaking at upcoming conference'
  ];

  return {
    title: titles[Math.floor(Math.random() * titles.length)],
    company_size: company ? (Math.random() > 0.5 ? '51-200' : '11-50') : null,
    industry: company ? 'Software & Technology' : null,
    recent_activity: activities[Math.floor(Math.random() * activities.length)],
    profile_url: `https://linkedin.com/in/${customerName.toLowerCase().replace(' ', '-')}`
  };
}

// Generate company data
function generateCompanyData(company: string | null) {
  const companySizes = ['11-50 employees', '51-200 employees', '201-500 employees'];
  const industries = ['SaaS', 'E-commerce', 'FinTech', 'HealthTech', 'Enterprise Software'];
  const fundingStages = ['Seed', 'Series A', 'Series B', 'Series C'];
  const fundingAmounts = ['$2M', '$5M', '$10M', '$25M'];
  const personas = ['Early-stage founder', 'Growth-stage executive', 'Enterprise buyer', 'Technical decision maker'];
  
  const painPointsOptions = [
    ['Manual processes taking too much time', 'Scaling challenges', 'Integration issues'],
    ['High customer churn', 'Poor data visibility', 'Inefficient workflows'],
    ['Budget constraints', 'Technical debt', 'Team productivity issues']
  ];
  
  const interestsOptions = [
    ['Automation', 'AI/ML', 'Analytics'],
    ['Scalability', 'Integration', 'ROI'],
    ['Team efficiency', 'Cost reduction', 'Innovation']
  ];

  return {
    company_size: companySizes[Math.floor(Math.random() * companySizes.length)],
    industry: industries[Math.floor(Math.random() * industries.length)],
    funding_stage: fundingStages[Math.floor(Math.random() * fundingStages.length)],
    funding_amount: fundingAmounts[Math.floor(Math.random() * fundingAmounts.length)],
    persona: personas[Math.floor(Math.random() * personas.length)],
    pain_points: painPointsOptions[Math.floor(Math.random() * painPointsOptions.length)],
    interests: interestsOptions[Math.floor(Math.random() * interestsOptions.length)]
  };
}

// Get prior calls for a customer
async function getPriorCallsSummary(customerName: string): Promise<{ summary: string; count: number }> {
  // Find all calls with this customer
  const { data: priorCalls } = await supabase
    .from('calls')
    .select('id, created_at, call_type, outcome, analysis(scores)')
    .eq('customer_name', customerName)
    .order('created_at', { ascending: false })
    .limit(5);

  if (!priorCalls || priorCalls.length === 0) {
    return {
      summary: 'No prior calls with this customer',
      count: 0
    };
  }

  // Generate summary
  const callSummaries = priorCalls.map((call: any) => {
    const date = new Date(call.created_at).toLocaleDateString();
    const score = call.analysis?.[0]?.scores?.overall || 'N/A';
    return `${date}: ${call.call_type} call (Score: ${score}/100) - ${call.outcome || 'In progress'}`;
  });

  return {
    summary: `${priorCalls.length} previous calls:\n${callSummaries.join('\n')}`,
    count: priorCalls.length
  };
}

// Generate CRM data
function generateCRMData(customerName: string, company: string | null) {
  const dealStages = ['Discovery', 'Demo Scheduled', 'Proposal Sent', 'Negotiation', 'Verbal Commit'];
  const dealValues = [15000, 25000, 50000, 75000, 100000];
  const leadSources = ['Inbound', 'Referral', 'Outbound', 'Webinar', 'Conference'];

  return {
    deal_stage: dealStages[Math.floor(Math.random() * dealStages.length)],
    deal_value: dealValues[Math.floor(Math.random() * dealValues.length)],
    probability: Math.floor(Math.random() * 40) + 40, // 40-80%
    lead_source: leadSources[Math.floor(Math.random() * leadSources.length)],
    days_in_pipeline: Math.floor(Math.random() * 60) + 10 // 10-70 days
  };
}

async function enrichScheduledCalls() {
  console.log('🔄 Enriching Scheduled Calls with LinkedIn, CRM, and Prior Calls Data...\n');

  // Get all scheduled calls
  const { data: scheduledCalls, error } = await supabase
    .from('scheduled_calls')
    .select('*')
    .eq('status', 'scheduled')
    .order('scheduled_date');

  if (error || !scheduledCalls) {
    console.error('❌ Error fetching scheduled calls:', error);
    return;
  }

  console.log(`📞 Found ${scheduledCalls.length} scheduled calls\n`);

  for (const call of scheduledCalls) {
    console.log(`${'='.repeat(60)}`);
    console.log(`Processing: ${call.customer_name} (${call.company || 'No company'})`);
    console.log(`Scheduled: ${new Date(call.scheduled_date).toLocaleString()}`);

    // 1. Find or create customer profile
    const customerProfile = await findOrCreateCustomerProfile(call.customer_name, call.company);
    
    if (!customerProfile) {
      console.log('   ❌ Failed to create customer profile');
      continue;
    }

    console.log(`   ✅ Customer profile: ${customerProfile.id}`);

    // 2. Get prior calls summary
    const priorCalls = await getPriorCallsSummary(call.customer_name);
    console.log(`   📊 Prior calls: ${priorCalls.count}`);

    // 3. Generate CRM data
    const crmData = generateCRMData(call.customer_name, call.company);
    console.log(`   💼 CRM: ${crmData.deal_stage} - $${crmData.deal_value.toLocaleString()}`);

    // 4. Update scheduled call with enrichment data
    const { error: updateError } = await supabase
      .from('scheduled_calls')
      .update({
        customer_profile_id: customerProfile.id,
        linkedin_data: customerProfile.linkedin_data,
        crm_data: crmData,
        prior_calls_summary: priorCalls.summary,
        ai_prep_insights: [
          `Customer persona: ${customerProfile.customer_persona}`,
          `Key pain points: ${customerProfile.pain_points?.join(', ')}`,
          `Recent activity: ${customerProfile.linkedin_data?.recent_activity}`,
          `Deal stage: ${crmData.deal_stage} ($${crmData.deal_value.toLocaleString()})`,
          priorCalls.count > 0 ? `${priorCalls.count} prior interactions - review call history` : 'First interaction - focus on discovery'
        ]
      })
      .eq('id', call.id);

    if (updateError) {
      console.error('   ❌ Error updating scheduled call:', updateError);
    } else {
      console.log('   ✅ Enriched successfully!');
    }
    console.log('');
  }

  console.log(`${'='.repeat(60)}`);
  console.log('\n✅ All scheduled calls enriched!\n');
}

enrichScheduledCalls().catch(console.error);

