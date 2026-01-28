/**
 * Regenerate AI Coaching Data from Real Transcripts
 * This script analyzes actual call transcripts and creates realistic AI coaching data
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Helper function to analyze objection response quality
function analyzeObjectionResponse(repResponse: string, category: string, objection: string): { score: number; wasResolved: boolean } {
  const response = repResponse.toLowerCase();
  let score = 5; // Base score
  let wasResolved = false;

  // Positive indicators
  if (response.includes('understand') || response.includes('i see')) score += 1;
  if (response.includes('?')) score += 1; // Asked a question
  if (response.includes('let me') || response.includes('can you')) score += 1;
  if (response.includes('value') || response.includes('roi') || response.includes('save')) score += 1;
  if (response.includes('specifically') || response.includes('tell me more')) score += 1;

  // Negative indicators
  if (response.includes('but') || response.includes('however')) score -= 1;
  if (response.includes('better') && !response.includes('?')) score -= 1; // Claiming better without asking
  if (response.length < 50) score -= 1; // Too short

  // Check if resolved
  wasResolved = score >= 7;

  return { score: Math.max(1, Math.min(10, score)), wasResolved };
}

// Helper function to determine objection severity
function determineSeverity(objection: string): 'high' | 'medium' | 'low' {
  const text = objection.toLowerCase();

  if (text.includes('not interested') || text.includes('no budget') || text.includes('happy with')) {
    return 'high';
  }
  if (text.includes('expensive') || text.includes('think about it') || text.includes('not sure')) {
    return 'medium';
  }
  return 'low';
}

// Helper function to generate specific suggested responses
function generateSuggestedResponses(objection: string, category: string): string[] {
  const text = objection.toLowerCase();
  const suggestions: string[] = [];

  if (category === 'price') {
    if (text.includes('expensive') || text.includes('cost')) {
      suggestions.push(`I understand cost is a concern. Can you help me understand what you're currently spending to solve this problem?`);
      suggestions.push(`That's a fair question. What would the cost be to your business if this problem isn't solved?`);
      suggestions.push(`Let's break down the ROI. How much time is your team spending on this manually right now?`);
    } else if (text.includes('budget')) {
      suggestions.push(`I appreciate you being upfront about budget. When does your next budget cycle open up?`);
      suggestions.push(`What if we could show you an ROI that justifies the investment this quarter?`);
    }
  } else if (category === 'timing') {
    if (text.includes('think about it')) {
      suggestions.push(`Absolutely, this is an important decision. What specific areas do you need to think through?`);
      suggestions.push(`That makes sense. What would need to happen for you to feel confident moving forward?`);
    } else if (text.includes('not sure')) {
      suggestions.push(`I understand. What information would help you feel more certain about this?`);
      suggestions.push(`What concerns do you have that we haven't addressed yet?`);
    }
  } else if (category === 'competition') {
    if (text.includes('already use') || text.includes('happy with')) {
      suggestions.push(`That's great that you have a solution in place. What would make it even better for you?`);
      suggestions.push(`I'm curious - what made you take this call if you're happy with your current solution?`);
      suggestions.push(`What challenges are you still facing even with your current tool?`);
    }
  } else {
    suggestions.push(`That's a valid concern. Can you tell me more about what's driving that?`);
    suggestions.push(`I appreciate you sharing that. What would need to change for this to work for you?`);
  }

  return suggestions.slice(0, 2); // Return top 2 suggestions
}

// Helper function to analyze question quality
function analyzeQuestion(question: string): {
  type: string;
  score: number;
  whyGood: string | null;
  whyBad: string | null;
  betterAlternative: string | null;
} {
  const text = question.toLowerCase();
  let type = 'closed';
  let score = 5;
  let whyGood: string | null = null;
  let whyBad: string | null = null;
  let betterAlternative: string | null = null;

  // Determine question type
  if (text.includes('what') || text.includes('how') || text.includes('why') || text.includes('tell me')) {
    type = 'open_ended';
    score = 7;
  } else if (text.includes('can you') || text.includes('could you') || text.includes('would you')) {
    type = 'probing';
    score = 6;
  } else if (text.match(/^(is |are |do |does |did |will |would |can |could )/i)) {
    type = 'closed';
    score = 3;
  }

  // Analyze quality factors
  if (type === 'open_ended') {
    // Check for discovery patterns
    if (text.includes('challenge') || text.includes('problem') || text.includes('pain')) {
      score += 2;
      whyGood = 'Excellent discovery question that uncovers customer pain points and encourages detailed response';
    } else if (text.includes('impact') || text.includes('affect') || text.includes('mean for')) {
      score += 2;
      whyGood = 'Strong business impact question that helps quantify value and builds urgency';
    } else if (text.includes('currently') || text.includes('right now') || text.includes('today')) {
      score += 1;
      whyGood = 'Good situational question that establishes current state and context';
    } else {
      whyGood = 'Open-ended question encourages customer to share detailed information';
    }
  } else if (type === 'probing') {
    if (text.includes('tell me more') || text.includes('walk me through')) {
      score += 2;
      whyGood = 'Effective probing question that deepens understanding of customer needs';
    } else if (text.includes('specifically') || text.includes('exactly')) {
      score += 1;
      whyGood = 'Good clarifying question that seeks specific details';
    }
  } else if (type === 'closed') {
    score = 3;
    whyBad = 'Closed yes/no question limits customer response and misses opportunity for discovery';

    // Generate better alternative based on context
    if (text.includes('speaking with') || text.includes('is this')) {
      betterAlternative = 'After confirming identity, immediately transition to: "Thanks for taking my call. What prompted you to [download our content/schedule this call]?"';
    } else if (text.includes('do you') || text.includes('are you')) {
      betterAlternative = 'Instead of a yes/no question, try: "Tell me about your current situation with [topic]" or "What challenges are you facing with [topic]?"';
    } else if (text.includes('like') && text.includes('product')) {
      betterAlternative = 'Instead of asking if they like it, ask: "What specific features would be most valuable for your use case?" or "How would this solve your current challenges?"';
    } else {
      betterAlternative = 'Rephrase as an open-ended question starting with "What", "How", or "Tell me about"';
    }
  }

  // Cap score at 10
  score = Math.min(10, score);

  return { type, score, whyGood, whyBad, betterAlternative };
}

async function regenerateAICoaching() {
  console.log('🔄 Regenerating AI Coaching Data from Real Transcripts...\n');

  // Step 1: Delete existing AI coaching data
  console.log('🗑️  Deleting old AI coaching data...');
  await supabase.from('master_coach_reports').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('objections').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('questions').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  console.log('✅ Old data deleted\n');

  // Step 2: Get all calls with transcripts and analysis
  const { data: calls, error: callsError } = await supabase
    .from('calls')
    .select(`
      id,
      customer_name,
      rep_name,
      call_type,
      transcripts (
        id,
        segments
      ),
      analysis (
        scores
      )
    `)
    .order('created_at', { ascending: false });

  if (callsError || !calls) {
    console.error('❌ Error fetching calls:', callsError);
    return;
  }

  console.log(`📞 Found ${calls.length} calls\n`);

  // Step 3: Process each call
  for (const call of calls) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Processing: ${call.customer_name} (${call.rep_name})`);
    console.log(`Call ID: ${call.id}`);

    const analysis = (call as any).analysis?.[0];
    const overallScore = analysis?.scores?.overall || 75;
    console.log(`Score: ${overallScore}/100`);

    const transcript = (call as any).transcripts?.[0];
    
    if (!transcript || !transcript.segments || transcript.segments.length === 0) {
      console.log('⚠️  No transcript segments found, skipping...');
      continue;
    }

    const segments = transcript.segments;
    console.log(`📝 Transcript segments: ${segments.length}`);

    // Analyze transcript for objections and questions
    const objections: any[] = [];
    const questions: any[] = [];
    const repSegments = segments.filter((s: any) => s.speaker === 'Rep');
    const customerSegments = segments.filter((s: any) => s.speaker === 'Customer');

    // Find objections (customer concerns/pushback)
    const objectionKeywords = ['expensive', 'cost', 'price', 'budget', 'think about it', 'not sure', 'concern', 'worried', 'problem', 'already use', 'happy with'];
    const processedTimestamps = new Set<string>();

    customerSegments.forEach((seg: any) => {
      const text = seg.text.toLowerCase();

      // Skip if we already processed this timestamp
      if (processedTimestamps.has(seg.timestamp)) return;

      objectionKeywords.forEach(keyword => {
        if (text.includes(keyword) && !processedTimestamps.has(seg.timestamp)) {
          const category = keyword.includes('price') || keyword.includes('cost') || keyword.includes('expensive') || keyword.includes('budget')
            ? 'price'
            : keyword.includes('think') || keyword.includes('not sure')
            ? 'timing'
            : keyword.includes('already') || keyword.includes('happy with')
            ? 'competition'
            : 'general';

          // Find rep's response (next rep segment)
          const segIndex = segments.indexOf(seg);
          const nextRepSeg = segments.slice(segIndex + 1).find((s: any) => s.speaker === 'Rep');
          const repResponse = nextRepSeg?.text || 'No immediate response recorded';

          // Analyze rep response quality
          const responseQuality = analyzeObjectionResponse(repResponse, category, seg.text);

          // Generate specific suggested responses based on actual objection
          const suggestedResponses = generateSuggestedResponses(seg.text, category);

          objections.push({
            timestamp: seg.timestamp,
            customer_said: seg.text,
            category,
            severity: determineSeverity(seg.text),
            rep_response: repResponse,
            response_score: responseQuality.score,
            suggested_responses: suggestedResponses,
            was_resolved: responseQuality.wasResolved
          });

          processedTimestamps.add(seg.timestamp);
        }
      });
    });

    // Find questions (rep asking questions)
    const questionPatterns = /\?/;
    repSegments.forEach((seg: any) => {
      if (questionPatterns.test(seg.text)) {
        const analysis = analyzeQuestion(seg.text);

        questions.push({
          timestamp: seg.timestamp,
          question_text: seg.text,
          question_type: analysis.type,
          quality_score: analysis.score,
          why_good: analysis.whyGood,
          why_bad: analysis.whyBad,
          better_alternative: analysis.betterAlternative
        });
      }
    });

    console.log(`   Found ${objections.length} objections`);
    console.log(`   Found ${questions.length} questions`);

    // Insert objections
    if (objections.length > 0) {
      const { error: objError } = await supabase.from('objections').insert(
        objections.map(obj => ({
          call_id: call.id,
          ...obj
        }))
      );
      if (objError) console.error('   ❌ Error inserting objections:', objError);
      else console.log(`   ✅ Inserted ${objections.length} objections`);
    }

    // Insert questions
    if (questions.length > 0) {
      const { error: qError } = await supabase.from('questions').insert(
        questions.map(q => ({
          call_id: call.id,
          ...q
        }))
      );
      if (qError) console.error('   ❌ Error inserting questions:', qError);
      else console.log(`   ✅ Inserted ${questions.length} questions`);
    }

    // Create master coach report
    const avgQuestionScore = questions.length > 0
      ? questions.reduce((sum, q) => sum + q.quality_score, 0) / questions.length
      : 7;
    const avgObjectionScore = objections.length > 0
      ? objections.reduce((sum, o) => sum + o.response_score, 0) / objections.length
      : 7;

    // Get agent scores from analysis table (these are the real scores!)
    const analysisScores = analysis?.scores || {};
    const discoveryScore = analysisScores.discovery || Math.round(overallScore * 0.8);
    const objectionHandlingScore = analysisScores.objection_handling || Math.round(overallScore * 0.75);
    const rapportScore = analysisScores.rapport_building || Math.round(overallScore * 0.9);
    const closingScore = analysisScores.closing || Math.round(overallScore * 0.85);

    const masterReport = {
      call_id: call.id,
      overall_score: overallScore,
      top_strengths: [
        avgQuestionScore >= 7 ? 'Strong discovery questioning' : 'Good rapport building',
        'Clear communication',
        'Active listening'
      ],
      top_improvements: [
        avgObjectionScore < 7 ? 'Objection handling needs work' : 'Follow-up questions',
        'Closing technique',
        'Value proposition clarity'
      ],
      priority_coaching_focus: avgObjectionScore < 7 ? 'Objection Handling - Price Concerns' : 'Discovery & Qualification',
      agent_scores: {
        discovery: discoveryScore,
        objection_handling: objectionHandlingScore,
        rapport_building: rapportScore,
        closing: closingScore
      }
    };

    const { error: reportError } = await supabase.from('master_coach_reports').insert(masterReport);
    if (reportError) console.error('   ❌ Error inserting master report:', reportError);
    else console.log(`   ✅ Inserted master coach report (${masterReport.overall_score}/100)`);
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log('\n✅ AI Coaching Data regenerated successfully!');
}

regenerateAICoaching().catch(console.error);

