import OpenAI from 'openai';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

const openaiKey = process.env.OPENAI_API_KEY || '';

if (!openaiKey) {
  console.error('❌ Missing OPENAI_API_KEY environment variable');
  console.error('Please set OPENAI_API_KEY in .env file');
  process.exit(1);
}

const openai = new OpenAI({ apiKey: openaiKey });

async function testAudioGeneration() {
  console.log('🎙️ Testing OpenAI TTS...\n');
  
  const testText = "Hello, this is Emma Rodriguez from FinanceHub. Thanks for scheduling this call with me.";
  
  console.log(`📝 Text: ${testText}`);
  console.log(`🗣️ Voice: nova (female)`);
  
  try {
    const mp3 = await openai.audio.speech.create({
      model: 'tts-1',
      voice: 'nova',
      input: testText,
    });
    
    const buffer = Buffer.from(await mp3.arrayBuffer());
    
    // Save to temp file
    const tempDir = path.join(process.cwd(), 'temp-audio');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    
    const tempFilePath = path.join(tempDir, 'test-audio.mp3');
    fs.writeFileSync(tempFilePath, buffer);
    
    console.log(`\n✅ Audio generated successfully!`);
    console.log(`📁 File: ${tempFilePath}`);
    console.log(`📦 Size: ${(buffer.length / 1024).toFixed(2)} KB`);
    console.log(`\n🎧 You can play this file to test!`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testAudioGeneration();

