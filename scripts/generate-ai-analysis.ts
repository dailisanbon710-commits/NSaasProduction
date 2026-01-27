/**
 * Generate realistic AI analysis for call transcripts using OpenAI
 * This script reads transcripts from Supabase and generates:
 * - AI insights with timestamps
 * - Performance scores
 * - Coaching feedback
 * - Key moments
 * - Talk ratio analysis
 */

import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || 'https://jytjdryjgcxgnfwlgtwc.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const openaiKey = process.env.OPENAI_API_KEY || '';

if (!supabaseKey || !openaiKey) {
  console.error('❌ Missing required environment variables');
  console.error('Please set SUPABASE_SERVICE_ROLE_KEY and OPENAI_API_KEY in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const openai = new OpenAI({ apiKey: openaiKey });

interface CallAnalysis {
  call_id: string;
  scores: {
    overall: number;
    discovery: number;
    qualification: number;
    objection_handling: number;
    closing: number;
    rapport_building: number;
  };
  coaching: {
    feedback: string;
    strengths: string[];
    improvement_areas: string[];
  };
  insights: Array<{
    timestamp: string;
    type: 'positive' | 'improvement' | 'warning';
    text: string;
    category: string;
  }>;
  key_moments: Array<{
    time: string;
    label: string;
    type: 'milestone' | 'warning' | 'success';
  }>;
  talk_ratio: {
    rep: number;
    customer: number;
  };
}

async function analyzeTranscript(transcript: string, callId: string, repName: string, customerName: string): Promise<CallAnalysis> {
  console.log(`\n🤖 Analyzing call ${callId} with OpenAI...`);

  const prompt = `You are an expert sales coach analyzing a sales call transcript. Analyze the following call and provide detailed feedback.

TRANSCRIPT:
${transcript}

Provide your analysis in the following JSON format:
{
  "scores": {
    "overall": <0-100>,
    "discovery": <0-100>,
    "qualification": <0-100>,
    "objection_handling": <0-100>,
    "closing": <0-100>,
    "rapport_building": <0-100>
  },
  "coaching": {
    "feedback": "<2-3 paragraph detailed coaching feedback>",
    "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
    "improvement_areas": ["<area 1>", "<area 2>"]
  },
  "insights": [
    {
      "timestamp": "<MM:SS format based on transcript flow>",
      "type": "positive|improvement|warning",
      "text": "<specific insight about what happened>",
      "category": "discovery|qualification|objection_handling|closing|rapport_building"
    }
  ],
  "key_moments": [
    {
      "time": "<MM:SS>",
      "label": "<brief label>",
      "type": "milestone|warning|success"
    }
  ]
}

Important:
- Be realistic and specific based on the actual transcript
- Timestamps should reflect the actual flow of conversation
- Identify 3-5 key insights
- Identify 2-4 key moments
- Scores should reflect actual performance in the transcript
- Feedback should be constructive and actionable`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: 'You are an expert sales performance analyst. Provide detailed, realistic analysis in valid JSON format only.'
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    temperature: 0.7,
    response_format: { type: 'json_object' }
  });

  const analysis = JSON.parse(response.choices[0].message.content || '{}');
  
  // Calculate talk ratio from transcript
  const lines = transcript.split('\n').filter(line => line.trim().length > 0);
  const repLines = lines.filter(line => line.trim().startsWith('Rep:')).length;
  const customerLines = lines.filter(line => line.trim().startsWith('Customer:')).length;
  const total = repLines + customerLines;
  
  const talk_ratio = total > 0 ? {
    rep: Math.round((repLines / total) * 100),
    customer: Math.round((customerLines / total) * 100)
  } : { rep: 50, customer: 50 };

  return {
    call_id: callId,
    scores: analysis.scores,
    coaching: analysis.coaching,
    insights: analysis.insights || [],
    key_moments: analysis.key_moments || [],
    talk_ratio
  };
}

async function main() {
  console.log('🚀 Starting AI analysis generation...\n');

  // Fetch all transcripts
  const { data: transcripts, error: transcriptError } = await supabase
    .from('transcripts')
    .select('*');

  if (transcriptError) {
    console.error('❌ Error fetching transcripts:', transcriptError);
    return;
  }

  console.log(`📝 Found ${transcripts?.length || 0} transcripts\n`);

  for (const transcript of transcripts || []) {
    if (!transcript.transcript_text || transcript.transcript_text.length < 50) {
      console.log(`⏭️  Skipping transcript ${transcript.id} - no content`);
      continue;
    }

    // Get call details
    const { data: call } = await supabase
      .from('calls')
      .select('*')
      .eq('id', transcript.call_id)
      .single();

    if (!call) {
      console.log(`⏭️  Skipping transcript ${transcript.id} - call not found`);
      continue;
    }

    try {
      // Generate AI analysis
      const analysis = await analyzeTranscript(
        transcript.transcript_text,
        transcript.call_id,
        call.rep_name || 'Rep',
        call.customer_name || 'Customer'
      );

      console.log(`✅ Analysis complete for call ${call.customer_name}`);
      console.log(`   Overall Score: ${analysis.scores.overall}`);
      console.log(`   Talk Ratio: ${analysis.talk_ratio.rep}% Rep / ${analysis.talk_ratio.customer}% Customer`);
      console.log(`   Insights: ${analysis.insights.length}`);
      console.log(`   Key Moments: ${analysis.key_moments.length}`);

      // Delete existing analysis and insert new one
      await supabase.from('analysis').delete().eq('call_id', transcript.call_id);

      const { error: analysisError } = await supabase
        .from('analysis')
        .insert({
          call_id: transcript.call_id,
          scores: analysis.scores,
          coaching: analysis.coaching,
          raw: {},
          created_at: new Date().toISOString()
        });

      if (analysisError) {
        console.error(`❌ Error saving analysis:`, analysisError);
      }

      // Delete existing insights and moments for this call
      await supabase.from('ai_insights').delete().eq('call_id', transcript.call_id);
      await supabase.from('key_moments').delete().eq('call_id', transcript.call_id);

      // Insert AI insights
      if (analysis.insights.length > 0) {
        const { error: insightsError } = await supabase
          .from('ai_insights')
          .insert(
            analysis.insights.map(insight => ({
              call_id: transcript.call_id,
              timestamp: insight.timestamp,
              type: insight.type,
              text: insight.text,
              category: insight.category
            }))
          );

        if (insightsError) {
          console.error(`❌ Error saving insights:`, insightsError);
        }
      }

      // Insert key moments
      if (analysis.key_moments.length > 0) {
        const { error: momentsError } = await supabase
          .from('key_moments')
          .insert(
            analysis.key_moments.map(moment => ({
              call_id: transcript.call_id,
              time: moment.time,
              label: moment.label,
              type: moment.type
            }))
          );

        if (momentsError) {
          console.error(`❌ Error saving key moments:`, momentsError);
        }
      }

      console.log(`💾 Saved to Supabase\n`);

      // Wait a bit to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 2000));

    } catch (error) {
      console.error(`❌ Error analyzing call:`, error);
    }
  }

  console.log('\n✨ Analysis generation complete!');
}

main().catch(console.error);

