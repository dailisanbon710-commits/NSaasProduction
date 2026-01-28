/**
 * Create realistic full transcripts with objections and questions
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Realistic full transcripts for each call
const transcripts = {
  // Sarah Johnson - Michael Chen (Score: 85/100) - Good call
  'Michael Chen': [
    { timestamp: '0:00', speaker: 'Rep', text: 'Good morning, this is Sarah Johnson from TechSolutions. Am I speaking with Michael Chen?' },
    { timestamp: '0:05', speaker: 'Customer', text: 'Yes, that is me. Hi Sarah.' },
    { timestamp: '0:08', speaker: 'Rep', text: 'Great! Thanks for taking my call, Michael. I see you recently downloaded our whitepaper on cloud migration strategies. What challenges are you currently facing with your infrastructure?' },
    { timestamp: '0:20', speaker: 'Customer', text: 'Well, we are running into scalability issues. Our current setup cannot handle the growth we are experiencing.' },
    { timestamp: '0:28', speaker: 'Rep', text: 'I understand. Can you tell me more about what specific bottlenecks you are seeing?' },
    { timestamp: '0:35', speaker: 'Customer', text: 'Our database performance degrades significantly during peak hours, and our deployment process takes too long.' },
    { timestamp: '0:45', speaker: 'Rep', text: 'That sounds frustrating. How is this impacting your business operations?' },
    { timestamp: '0:50', speaker: 'Customer', text: 'We are losing customers due to slow response times, and our development team is spending too much time on infrastructure instead of features.' },
    { timestamp: '1:02', speaker: 'Rep', text: 'I see. What solutions have you explored so far?' },
    { timestamp: '1:08', speaker: 'Customer', text: 'We looked at AWS and Azure, but the complexity is overwhelming. We need something more managed.' },
    { timestamp: '1:18', speaker: 'Rep', text: 'That makes sense. Our platform is designed specifically for companies in your situation. We handle all the infrastructure complexity while you focus on your application. How many users are you supporting currently?' },
    { timestamp: '1:32', speaker: 'Customer', text: 'About 50,000 active users, but we are growing at 20% month over month.' },
    { timestamp: '1:40', speaker: 'Rep', text: 'Impressive growth! Our platform scales automatically to handle that kind of growth. What is your timeline for making a decision?' },
    { timestamp: '1:50', speaker: 'Customer', text: 'We need to move quickly. Probably within the next quarter.' },
    { timestamp: '1:56', speaker: 'Rep', text: 'Perfect. Let me show you how we can help. But first, this seems expensive compared to what we are currently paying. What is the actual cost?' },
    { timestamp: '2:05', speaker: 'Customer', text: 'This seems expensive compared to what we are currently paying. What is the actual cost?' },
    { timestamp: '2:12', speaker: 'Rep', text: 'Great question. While our base price might seem higher, most of our customers actually save money because we eliminate the need for dedicated DevOps staff. What are you currently spending on infrastructure and DevOps combined?' },
    { timestamp: '2:28', speaker: 'Customer', text: 'About $15,000 per month total.' },
    { timestamp: '2:32', speaker: 'Rep', text: 'Our solution would be around $12,000 per month for your scale, and that includes 24/7 support and automatic scaling. Plus, your DevOps team can focus on higher-value work. Does that help clarify the value?' },
    { timestamp: '2:48', speaker: 'Customer', text: 'Yes, that actually makes sense when you put it that way.' },
    { timestamp: '2:53', speaker: 'Rep', text: 'Excellent. Would it make sense to schedule a technical demo with your engineering team next week?' },
    { timestamp: '3:00', speaker: 'Customer', text: 'Yes, let me check my calendar. How about Tuesday at 2 PM?' },
    { timestamp: '3:06', speaker: 'Rep', text: 'Perfect! I will send you a calendar invite. Looking forward to showing you what we can do, Michael.' },
    { timestamp: '3:12', speaker: 'Customer', text: 'Sounds good, Sarah. Talk to you then.' }
  ],

  // Tom Martinez - Jennifer Wu (Score: 35/100) - Poor call
  'Jennifer Wu': [
    { timestamp: '0:00', speaker: 'Rep', text: 'Hi, is this Jennifer?' },
    { timestamp: '0:02', speaker: 'Customer', text: 'Yes, who is calling?' },
    { timestamp: '0:05', speaker: 'Rep', text: 'This is Tom from MarketPro. I wanted to talk to you about our marketing automation software. Do you have a few minutes?' },
    { timestamp: '0:14', speaker: 'Customer', text: 'I guess so. What is this about?' },
    { timestamp: '0:18', speaker: 'Rep', text: 'We have this great marketing automation tool that can help your business. It has email campaigns, social media posting, and analytics.' },
    { timestamp: '0:28', speaker: 'Customer', text: 'Okay, but we already use HubSpot for that.' },
    { timestamp: '0:32', speaker: 'Rep', text: 'Oh. Well, our tool is better. It has more features.' },
    { timestamp: '0:38', speaker: 'Customer', text: 'Like what? Can you be more specific?' },
    { timestamp: '0:42', speaker: 'Rep', text: 'Um, well, it has AI-powered recommendations and stuff. Do you like our product?' },
    { timestamp: '0:50', speaker: 'Customer', text: 'I do not even know what your product does yet. This sounds expensive. How much does it cost?' },
    { timestamp: '0:58', speaker: 'Rep', text: 'The pricing starts at $500 per month.' },
    { timestamp: '1:02', speaker: 'Customer', text: 'That is way more than we are paying now. Why would we switch?' },
    { timestamp: '1:08', speaker: 'Rep', text: 'Because it is better? I mean, it has more features.' },
    { timestamp: '1:14', speaker: 'Customer', text: 'I need to think about it and discuss with my team. This is not a good time.' },
    { timestamp: '1:22', speaker: 'Rep', text: 'Okay, when would be a better time?' },
    { timestamp: '1:26', speaker: 'Customer', text: 'I am not sure. We are pretty happy with our current solution.' },
    { timestamp: '1:32', speaker: 'Rep', text: 'Alright. Should I follow up next month?' },
    { timestamp: '1:36', speaker: 'Customer', text: 'Maybe. I have to go now.' },
    { timestamp: '1:40', speaker: 'Rep', text: 'Okay, thanks for your time.' }
  ],

  // Emma Rodriguez - David Kim (Score: 85/100) - Good call
  'David Kim': [
    { timestamp: '0:00', speaker: 'Rep', text: 'Hello David, this is Emma Rodriguez from FinanceHub. Thanks for scheduling this call with me.' },
    { timestamp: '0:06', speaker: 'Customer', text: 'Hi Emma, yes, I have been looking into your platform for our accounting needs.' },
    { timestamp: '0:12', speaker: 'Rep', text: 'Excellent! Before I dive into our solution, can you walk me through your current accounting workflow and what is working well versus what is not?' },
    { timestamp: '0:24', speaker: 'Customer', text: 'Sure. We are using QuickBooks right now, and while it is okay for basic bookkeeping, we struggle with real-time reporting and multi-currency support.' },
    { timestamp: '0:38', speaker: 'Rep', text: 'I see. Tell me more about the multi-currency challenges. How many currencies do you deal with?' },
    { timestamp: '0:46', speaker: 'Customer', text: 'We operate in five countries, so we deal with USD, EUR, GBP, JPY, and AUD. The currency conversions and reporting are a nightmare.' },
    { timestamp: '1:00', speaker: 'Rep', text: 'That sounds really painful. How much time is your finance team spending on manual currency reconciliation each month?' },
    { timestamp: '1:10', speaker: 'Customer', text: 'Probably 40-50 hours. It is killing our productivity.' },
    { timestamp: '1:16', speaker: 'Rep', text: 'Wow, that is significant. At an average finance salary, that is costing you thousands in labor alone. What would it mean for your business if you could automate that entirely?' },
    { timestamp: '1:30', speaker: 'Customer', text: 'It would be huge. We could reallocate that time to strategic analysis instead of data entry.' },
    { timestamp: '1:38', speaker: 'Rep', text: 'Exactly. Our platform handles multi-currency automatically with real-time exchange rates. You mentioned real-time reporting - what specific reports do you need?' },
    { timestamp: '1:50', speaker: 'Customer', text: 'Cash flow projections, P&L by region, and consolidated balance sheets. Right now we have to wait until month-end to get accurate numbers.' },
    { timestamp: '2:04', speaker: 'Rep', text: 'Got it. With FinanceHub, all of those reports are available in real-time, 24/7. You can even set up automated alerts when cash flow drops below certain thresholds. Would that be valuable?' },
    { timestamp: '2:20', speaker: 'Customer', text: 'Definitely. But I am concerned about the cost. We are a mid-sized company and budget is tight right now.' },
    { timestamp: '2:30', speaker: 'Rep', text: 'I totally understand budget concerns. Let me ask you this - you mentioned 50 hours per month on manual work. If we could save you that time, what is that worth to your organization?' },
    { timestamp: '2:44', speaker: 'Customer', text: 'Well, if we are paying our finance team an average of $60 per hour, that is $3,000 per month in labor costs alone.' },
    { timestamp: '2:54', speaker: 'Rep', text: 'Exactly. Our platform for a company your size would be around $1,200 per month. So you would actually save $1,800 per month while getting better insights. Does that change the equation?' },
    { timestamp: '3:10', speaker: 'Customer', text: 'When you put it that way, yes. That is a strong ROI. What is the implementation timeline?' },
    { timestamp: '3:18', speaker: 'Rep', text: 'Great question. For a company your size, implementation typically takes 2-3 weeks. We handle the data migration and provide training for your team. What is your ideal go-live date?' },
    { timestamp: '3:32', speaker: 'Customer', text: 'We would want to start at the beginning of next quarter, so about 6 weeks from now.' },
    { timestamp: '3:40', speaker: 'Rep', text: 'Perfect, that gives us plenty of time. Would it make sense to schedule a technical walkthrough with your CFO and finance team next week?' },
    { timestamp: '3:50', speaker: 'Customer', text: 'Yes, let me coordinate with them and get back to you with some times.' },
    { timestamp: '3:56', speaker: 'Rep', text: 'Excellent! I will send you a follow-up email with some proposed times and a demo link. Looking forward to working with you, David.' },
    { timestamp: '4:04', speaker: 'Customer', text: 'Thanks Emma, talk soon!' }
  ]
};

async function createRealisticTranscripts() {
  console.log('📝 Creating Realistic Full Transcripts...\n');

  const { data: calls, error } = await supabase
    .from('calls')
    .select('id, customer_name')
    .order('created_at', { ascending: false });

  if (error || !calls) {
    console.error('❌ Error:', error);
    return;
  }

  for (const call of calls) {
    const segments = transcripts[call.customer_name as keyof typeof transcripts];
    
    if (!segments) {
      console.log(`⚠️  No transcript template for ${call.customer_name}`);
      continue;
    }

    console.log(`📞 Updating transcript for ${call.customer_name}...`);

    // Delete existing transcript
    await supabase.from('transcripts').delete().eq('call_id', call.id);

    // Insert new transcript
    const { error: insertError } = await supabase
      .from('transcripts')
      .insert({
        call_id: call.id,
        segments: segments,
        language: 'en'
      });

    if (insertError) {
      console.error(`   ❌ Error:`, insertError);
    } else {
      console.log(`   ✅ Created ${segments.length} segments`);
    }
  }

  console.log('\n✅ All transcripts updated!\n');
}

createRealisticTranscripts().catch(console.error);

