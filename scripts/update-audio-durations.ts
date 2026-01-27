import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const supabaseUrl = 'https://jytjdryjgcxgnfwlgtwc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5dGpkcnlqZ2N4Z25md2xndHdjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODYwNjAyNCwiZXhwIjoyMDg0MTgyMDI0fQ.H1c6S6DkhpZUqh6dOqwVUjnwZwtmf3_OsxNIR0ty9m0';

const supabase = createClient(supabaseUrl, supabaseKey);

// Function to get MP3 duration using ffprobe (if available) or estimate from file size
async function getAudioDuration(audioUrl: string): Promise<number> {
  try {
    // Download audio file
    console.log(`   📥 Downloading audio...`);
    const response = await fetch(audioUrl);
    const buffer = await response.arrayBuffer();
    const tempFile = path.join(process.cwd(), 'temp-audio.mp3');
    fs.writeFileSync(tempFile, Buffer.from(buffer));

    // Try to use ffprobe to get exact duration
    try {
      const { stdout } = await execAsync(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${tempFile}"`);
      const duration = parseFloat(stdout.trim());
      fs.unlinkSync(tempFile);
      return Math.round(duration);
    } catch (ffprobeError) {
      // If ffprobe not available, estimate from file size
      // MP3 bitrate is typically 128kbps for TTS
      const fileSizeBytes = buffer.byteLength;
      const estimatedDuration = Math.round((fileSizeBytes * 8) / (128 * 1000)); // Convert to seconds
      fs.unlinkSync(tempFile);
      console.log(`   ⚠️ ffprobe not available, estimated duration from file size`);
      return estimatedDuration;
    }
  } catch (error) {
    console.error(`   ❌ Error getting audio duration:`, error);
    return 0;
  }
}

async function updateAudioDurations() {
  console.log('🔍 Updating audio durations from actual files...\n');

  // Get all calls with audio URLs
  const { data: calls, error } = await supabase
    .from('calls')
    .select('id, rep_name, customer_name, audio_url, duration_seconds')
    .not('audio_url', 'is', null)
    .order('id');

  if (error) {
    console.error('❌ Error fetching calls:', error);
    return;
  }

  if (!calls || calls.length === 0) {
    console.log('⚠️ No calls with audio URLs found');
    return;
  }

  console.log(`✅ Found ${calls.length} calls with audio files\n`);

  for (const call of calls) {
    console.log(`📞 Call: ${call.rep_name} → ${call.customer_name}`);
    console.log(`   Current duration: ${call.duration_seconds}s (${Math.floor(call.duration_seconds / 60)}:${String(call.duration_seconds % 60).padStart(2, '0')})`);
    
    const actualDuration = await getAudioDuration(call.audio_url);
    
    if (actualDuration > 0 && actualDuration !== call.duration_seconds) {
      console.log(`   🔄 Updating to: ${actualDuration}s (${Math.floor(actualDuration / 60)}:${String(actualDuration % 60).padStart(2, '0')})`);
      
      const { error: updateError } = await supabase
        .from('calls')
        .update({ duration_seconds: actualDuration })
        .eq('id', call.id);
      
      if (updateError) {
        console.error(`   ❌ Error updating:`, updateError);
      } else {
        console.log(`   ✅ Updated successfully`);
      }
    } else if (actualDuration === call.duration_seconds) {
      console.log(`   ✅ Duration already correct`);
    }
    
    console.log('');
  }

  console.log('\n🎉 Done! All audio durations updated.');
  console.log('\n💡 Next step: Update key_moments timestamps to match audio durations');
}

updateAudioDurations();

