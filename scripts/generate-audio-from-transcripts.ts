import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
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

// Voice mapping based on names (gender detection)
const MALE_NAMES = ['David', 'Michael', 'James', 'Robert', 'John', 'Tom', 'Chen'];
const FEMALE_NAMES = ['Emma', 'Sarah', 'Jennifer', 'Lisa', 'Michelle', 'Wu'];

function getVoiceForName(name: string): 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer' {
  const firstName = name.split(' ')[0];
  
  // Check if male
  if (MALE_NAMES.some(n => firstName.includes(n))) {
    return 'onyx'; // Deep male voice
  }
  
  // Check if female
  if (FEMALE_NAMES.some(n => firstName.includes(n))) {
    return 'nova'; // Female voice
  }
  
  // Default
  return 'alloy';
}

async function generateAudioForCall(callId: string, transcript: string, repName: string, customerName: string) {
  console.log(`\n🎙️ Generating audio for call ${callId}...`);
  console.log(`   Rep: ${repName}, Customer: ${customerName}`);
  
  // Parse transcript into segments
  const lines = transcript.split('\n').filter(line => line.trim());
  const audioSegments: Buffer[] = [];
  
  for (const line of lines) {
    if (line.startsWith('Rep:')) {
      const text = line.replace('Rep:', '').trim();
      const voice = getVoiceForName(repName);
      console.log(`   🗣️ Rep (${voice}): ${text.substring(0, 50)}...`);
      
      const mp3 = await openai.audio.speech.create({
        model: 'tts-1',
        voice: voice,
        input: text,
      });
      
      const buffer = Buffer.from(await mp3.arrayBuffer());
      audioSegments.push(buffer);
      
    } else if (line.startsWith('Customer:')) {
      const text = line.replace('Customer:', '').trim();
      const voice = getVoiceForName(customerName);
      console.log(`   👤 Customer (${voice}): ${text.substring(0, 50)}...`);
      
      const mp3 = await openai.audio.speech.create({
        model: 'tts-1',
        voice: voice,
        input: text,
      });
      
      const buffer = Buffer.from(await mp3.arrayBuffer());
      audioSegments.push(buffer);
    }
  }
  
  // Combine all segments
  const combinedAudio = Buffer.concat(audioSegments);
  
  // Save to temp file
  const tempDir = path.join(process.cwd(), 'temp-audio');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }
  
  const tempFilePath = path.join(tempDir, `call-${callId}.mp3`);
  fs.writeFileSync(tempFilePath, combinedAudio);
  
  console.log(`   ✅ Audio saved to: ${tempFilePath}`);
  console.log(`   📦 Size: ${(combinedAudio.length / 1024).toFixed(2)} KB`);
  
  return tempFilePath;
}

async function uploadToSupabase(filePath: string, callId: string) {
  console.log(`\n📤 Uploading to Supabase Storage...`);
  
  const fileBuffer = fs.readFileSync(filePath);
  const fileName = `call-recordings/call-${callId}.mp3`;
  
  const { data, error } = await supabase.storage
    .from('audio-files')
    .upload(fileName, fileBuffer, {
      contentType: 'audio/mpeg',
      upsert: true,
    });
  
  if (error) {
    console.error(`   ❌ Upload error:`, error);
    return null;
  }
  
  // Get public URL
  const { data: urlData } = supabase.storage
    .from('audio-files')
    .getPublicUrl(fileName);
  
  console.log(`   ✅ Uploaded: ${urlData.publicUrl}`);
  return urlData.publicUrl;
}

async function updateCallWithAudioUrl(callId: string, audioUrl: string) {
  const { error } = await supabase
    .from('calls')
    .update({ audio_url: audioUrl })
    .eq('id', callId);
  
  if (error) {
    console.error(`   ❌ Database update error:`, error);
  } else {
    console.log(`   ✅ Database updated with audio URL`);
  }
}

async function main() {
  console.log('🎬 Starting audio generation from transcripts...\n');
  
  // Fetch all calls with transcripts
  const { data: calls, error: callsError } = await supabase
    .from('calls')
    .select('id, rep_name, customer_name')
    .order('started_at', { ascending: false });
  
  if (callsError || !calls) {
    console.error('❌ Error fetching calls:', callsError);
    return;
  }

  console.log(`📊 Found ${calls.length} calls\n`);

  for (const call of calls) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Processing Call ID: ${call.id}`);
    console.log(`Rep: ${call.rep_name}, Customer: ${call.customer_name}`);

    // Fetch transcript
    const { data: transcriptData, error: transcriptError } = await supabase
      .from('transcripts')
      .select('transcript_text')
      .eq('call_id', call.id)
      .single();

    if (transcriptError || !transcriptData?.transcript_text) {
      console.log(`   ⚠️ No transcript found, skipping...`);
      continue;
    }

    try {
      // Generate audio
      const audioFilePath = await generateAudioForCall(
        call.id,
        transcriptData.transcript_text,
        call.rep_name,
        call.customer_name
      );

      // Upload to Supabase
      const audioUrl = await uploadToSupabase(audioFilePath, call.id);

      if (audioUrl) {
        // Update call record
        await updateCallWithAudioUrl(call.id, audioUrl);
      }

      // Clean up temp file
      fs.unlinkSync(audioFilePath);
      console.log(`   🗑️ Temp file deleted`);

    } catch (error) {
      console.error(`   ❌ Error processing call:`, error);
    }
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log('✅ Audio generation complete!');
  console.log('\n📝 Next steps:');
  console.log('1. Check Supabase Storage bucket "audio-files"');
  console.log('2. Verify audio_url field in calls table');
  console.log('3. Test audio playback in the dashboard');
}

main().catch(console.error);

