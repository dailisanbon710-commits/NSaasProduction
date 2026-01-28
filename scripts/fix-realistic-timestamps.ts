/**
 * Fix timestamps to be more realistic based on actual call duration
 * Distributes timestamps proportionally across the call duration
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Helper to format seconds as MM:SS
function formatTimestamp(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Helper to calculate realistic timestamps based on text length
function calculateRealisticTimestamps(segments: any[], totalDurationSeconds: number): any[] {
  // Calculate total text length
  const totalTextLength = segments.reduce((sum, seg) => sum + seg.text.length, 0);
  
  let currentTime = 0;
  const updatedSegments = segments.map((seg, index) => {
    // Estimate speaking time based on text length (average 150 chars per minute)
    const charsPerSecond = 2.5; // ~150 chars/min
    const segmentDuration = seg.text.length / charsPerSecond;
    
    // Add natural pauses between speakers (1-3 seconds)
    const pause = index > 0 && segments[index - 1].speaker !== seg.speaker ? 1 + Math.random() * 2 : 0.5;
    
    currentTime += pause;
    const timestamp = formatTimestamp(currentTime);
    currentTime += segmentDuration;
    
    return {
      ...seg,
      timestamp
    };
  });
  
  // Scale timestamps to fit actual duration
  const calculatedDuration = currentTime;
  const scaleFactor = totalDurationSeconds / calculatedDuration;
  
  let scaledTime = 0;
  return updatedSegments.map((seg, index) => {
    const originalTime = parseTimestamp(seg.timestamp);
    scaledTime = originalTime * scaleFactor;
    
    return {
      ...seg,
      timestamp: formatTimestamp(scaledTime)
    };
  });
}

// Helper to parse MM:SS timestamp to seconds
function parseTimestamp(timestamp: string): number {
  const [mins, secs] = timestamp.split(':').map(Number);
  return mins * 60 + secs;
}

async function fixTimestamps() {
  console.log('🕐 Fixing Timestamps to Match Call Duration...\n');

  // Get all calls with transcripts
  const { data: calls, error } = await supabase
    .from('calls')
    .select('id, customer_name, rep_name, duration_seconds')
    .order('created_at', { ascending: false });

  if (error || !calls) {
    console.error('❌ Error:', error);
    return;
  }

  for (const call of calls) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Processing: ${call.customer_name} (${call.rep_name})`);
    console.log(`Duration: ${Math.floor(call.duration_seconds / 60)}:${(call.duration_seconds % 60).toString().padStart(2, '0')}`);

    // Get transcript
    const { data: transcript } = await supabase
      .from('transcripts')
      .select('segments')
      .eq('call_id', call.id)
      .single();

    if (!transcript || !transcript.segments) {
      console.log('   ⚠️  No transcript found');
      continue;
    }

    const segments = transcript.segments;
    console.log(`   📝 ${segments.length} segments`);

    // Calculate realistic timestamps
    const updatedSegments = calculateRealisticTimestamps(segments, call.duration_seconds);

    // Update transcript
    const { error: updateError } = await supabase
      .from('transcripts')
      .update({ segments: updatedSegments })
      .eq('call_id', call.id);

    if (updateError) {
      console.error('   ❌ Error updating transcript:', updateError);
    } else {
      console.log(`   ✅ Updated timestamps (0:00 → ${updatedSegments[updatedSegments.length - 1].timestamp})`);
    }

    // Now update objections and questions timestamps
    const { data: objections } = await supabase
      .from('objections')
      .select('*')
      .eq('call_id', call.id);

    const { data: questions } = await supabase
      .from('questions')
      .select('*')
      .eq('call_id', call.id);

    // Update objection timestamps to match new segment timestamps
    if (objections && objections.length > 0) {
      for (const obj of objections) {
        const matchingSegment = updatedSegments.find(seg => 
          seg.speaker === 'Customer' && seg.text === obj.customer_said
        );
        if (matchingSegment) {
          await supabase
            .from('objections')
            .update({ timestamp: matchingSegment.timestamp })
            .eq('id', obj.id);
        }
      }
      console.log(`   ✅ Updated ${objections.length} objection timestamps`);
    }

    // Update question timestamps to match new segment timestamps
    if (questions && questions.length > 0) {
      for (const q of questions) {
        const matchingSegment = updatedSegments.find(seg => 
          seg.speaker === 'Rep' && seg.text === q.question_text
        );
        if (matchingSegment) {
          await supabase
            .from('questions')
            .update({ timestamp: matchingSegment.timestamp })
            .eq('id', q.id);
        }
      }
      console.log(`   ✅ Updated ${questions.length} question timestamps`);
    }
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log('\n✅ All timestamps fixed!\n');
}

fixTimestamps().catch(console.error);

