/**
 * View actual transcript segments
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function viewTranscripts() {
  console.log('📝 Viewing Transcript Segments...\n');

  const { data: calls, error } = await supabase
    .from('calls')
    .select(`
      id,
      customer_name,
      rep_name,
      transcripts (
        id,
        segments
      )
    `)
    .order('created_at', { ascending: false });

  if (error || !calls) {
    console.error('❌ Error:', error);
    return;
  }

  for (const call of calls) {
    console.log(`\n${'='.repeat(80)}`);
    console.log(`📞 ${call.customer_name} (${call.rep_name})`);
    console.log(`Call ID: ${call.id}`);
    
    const transcript = (call as any).transcripts?.[0];
    
    if (!transcript || !transcript.segments) {
      console.log('⚠️  No transcript found');
      continue;
    }

    const segments = transcript.segments;
    console.log(`\n📝 Segments (${segments.length}):\n`);

    segments.forEach((seg: any, i: number) => {
      console.log(`${i + 1}. [${seg.timestamp}] ${seg.speaker}:`);
      console.log(`   "${seg.text}"`);
      console.log('');
    });
  }

  console.log(`${'='.repeat(80)}\n`);
}

viewTranscripts().catch(console.error);

