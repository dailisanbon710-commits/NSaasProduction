import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jytjdryjgcxgnfwlgtwc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5dGpkcnlqZ2N4Z25md2xndHdjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODYwNjAyNCwiZXhwIjoyMDg0MTgyMDI0fQ.H1c6S6DkhpZUqh6dOqwVUjnwZwtmf3_OsxNIR0ty9m0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function addAICoachingData() {
  console.log('🤖 Adding AI Coaching data to existing calls...\n');

  // Get all calls
  const { data: calls, error: callsError } = await supabase
    .from('calls')
    .select('id, customer_name, rep_name')
    .limit(5);

  if (callsError || !calls || calls.length === 0) {
    console.error('❌ Error fetching calls:', callsError);
    return;
  }

  console.log(`✅ Found ${calls.length} calls\n`);

  for (const call of calls) {
    console.log(`📞 Processing call: ${call.rep_name} → ${call.customer_name}`);

    // 1. Add Master Coach Report
    const { data: masterReport, error: masterError } = await supabase
      .from('master_coach_reports')
      .insert({
        call_id: call.id,
        overall_score: Math.floor(Math.random() * 30) + 70, // 70-100
        top_strengths: [
          'Strong discovery questions that uncovered key pain points',
          'Excellent active listening and rapport building',
          'Effective use of data to support value proposition'
        ],
        top_improvements: [
          'Create more urgency in closing - ask for specific next steps',
          'Handle price objections with ROI calculator instead of discounting',
          'Improve talk-to-listen ratio (currently 65/35, target 40/60)'
        ],
        priority_coaching_focus: 'Objection Handling - Price Concerns',
        recommended_actions: {
          immediate: 'Practice price objection responses with manager',
          this_week: 'Review 3 successful calls from top performers',
          this_month: 'Complete objection handling certification'
        },
        agent_scores: {
          objection_handling: Math.floor(Math.random() * 30) + 60,
          discovery: Math.floor(Math.random() * 20) + 75,
          closing: Math.floor(Math.random() * 25) + 65,
          talk_time: Math.floor(Math.random() * 20) + 70,
          question_quality: Math.floor(Math.random() * 25) + 70
        }
      })
      .select()
      .single();

    if (masterError) {
      console.error('  ❌ Error adding master report:', masterError.message);
    } else {
      console.log('  ✅ Master Coach Report added');
    }

    // 2. Add Objections
    const objections = [
      {
        call_id: call.id,
        timestamp: '3:45',
        customer_said: 'This seems expensive compared to what we\'re paying now',
        category: 'price',
        severity: 'high',
        rep_response: 'I understand. Let me show you the ROI calculator...',
        response_score: 7,
        response_analysis: 'Good pivot to value, but could have asked about current costs first',
        suggested_responses: [
          'What are you currently spending on your existing solution?',
          'Let\'s break down the cost per user - it\'s actually $12/month, which includes...'
        ],
        was_resolved: true
      },
      {
        call_id: call.id,
        timestamp: '8:20',
        customer_said: 'We need to think about it and discuss with the team',
        category: 'timing',
        severity: 'medium',
        rep_response: 'Of course, when would be a good time to follow up?',
        response_score: 5,
        response_analysis: 'Missed opportunity to uncover real objection and create urgency',
        suggested_responses: [
          'I completely understand. What specific concerns do you need to discuss with the team?',
          'What would need to happen for you to move forward this quarter?'
        ],
        was_resolved: false
      }
    ];

    const { error: objectionsError } = await supabase
      .from('objections')
      .insert(objections);

    if (objectionsError) {
      console.error('  ❌ Error adding objections:', objectionsError.message);
    } else {
      console.log(`  ✅ ${objections.length} objections added`);
    }

    // 3. Add Questions
    const questions = [
      {
        call_id: call.id,
        timestamp: '2:15',
        question_text: 'What challenges are you facing with your current solution?',
        question_type: 'open_ended',
        quality_score: 9,
        why_good: 'Open-ended question that encourages detailed response about pain points',
        customer_response: 'We struggle with data integration and reporting'
      },
      {
        call_id: call.id,
        timestamp: '5:30',
        question_text: 'So you mentioned integration issues - can you tell me more about that?',
        question_type: 'probing',
        quality_score: 8,
        why_good: 'Probing question that digs deeper into specific pain point',
        customer_response: 'Yes, we have to manually export data from 3 different systems'
      },
      {
        call_id: call.id,
        timestamp: '12:45',
        question_text: 'Do you like our product?',
        question_type: 'closed',
        quality_score: 3,
        why_bad: 'Closed question that only gets yes/no answer, doesn\'t uncover insights',
        better_alternative: 'What aspects of our solution would be most valuable for your team?',
        customer_response: 'Yeah, it looks good'
      }
    ];

    const { error: questionsError } = await supabase
      .from('questions')
      .insert(questions);

    if (questionsError) {
      console.error('  ❌ Error adding questions:', questionsError.message);
    } else {
      console.log(`  ✅ ${questions.length} questions added`);
    }

    console.log('');
  }

  console.log('🎉 Done! AI Coaching data added to all calls.');
}

addAICoachingData();

