import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jytjdryjgcxgnfwlgtwc.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5dGpkcnlqZ2N4Z25md2xndHdjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODYwNjAyNCwiZXhwIjoyMDg0MTgyMDI0fQ.H1c6S6DkhpZUqh6dOqwVUjnwZwtmf3_OsxNIR0ty9m0';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function viewData() {
  console.log('📊 MEVCUT VERİLER\n');
  console.log('='.repeat(80));

  // CALLS TABLE
  console.log('\n📞 CALLS TABLOSU (6 kayıt)\n');
  const { data: calls, error: callsError } = await supabase
    .from('calls')
    .select('*')
    .order('id', { ascending: true });

  if (callsError) {
    console.log('❌ Hata:', callsError.message);
  } else if (calls && calls.length > 0) {
    console.log('Sütunlar:', Object.keys(calls[0]).join(', '));
    console.log('\nVeriler:');
    calls.forEach((call, idx) => {
      console.log(`\n${idx + 1}. Kayıt:`);
      console.log(JSON.stringify(call, null, 2));
    });
  }

  // ANALYSIS TABLE
  console.log('\n\n' + '='.repeat(80));
  console.log('\n📊 ANALYSIS TABLOSU (3 kayıt)\n');
  const { data: analysis, error: analysisError } = await supabase
    .from('analysis')
    .select('*')
    .order('id', { ascending: true });

  if (analysisError) {
    console.log('❌ Hata:', analysisError.message);
  } else if (analysis && analysis.length > 0) {
    console.log('Sütunlar:', Object.keys(analysis[0]).join(', '));
    console.log('\nVeriler:');
    analysis.forEach((item, idx) => {
      console.log(`\n${idx + 1}. Kayıt:`);
      console.log(JSON.stringify(item, null, 2));
    });
  }

  // TRANSCRIPTS TABLE
  console.log('\n\n' + '='.repeat(80));
  console.log('\n📝 TRANSCRIPTS TABLOSU\n');
  const { data: transcripts, error: transcriptError } = await supabase
    .from('transcripts')
    .select('*')
    .limit(3);

  if (transcriptError) {
    console.log('❌ Hata:', transcriptError.message);
  } else if (transcripts && transcripts.length > 0) {
    console.log('Sütunlar:', Object.keys(transcripts[0]).join(', '));
    console.log('\nVeriler:');
    transcripts.forEach((item, idx) => {
      console.log(`\n${idx + 1}. Kayıt:`);
      console.log(JSON.stringify(item, null, 2));
    });
  } else {
    console.log('⚠️  Boş tablo - yapıyı görmek için örnek bir kayıt ekleyelim mi?');
  }
}

viewData();
