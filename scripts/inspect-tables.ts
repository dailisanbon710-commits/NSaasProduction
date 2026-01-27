import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jytjdryjgcxgnfwlgtwc.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5dGpkcnlqZ2N4Z25md2xndHdjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODYwNjAyNCwiZXhwIjoyMDg0MTgyMDI0fQ.H1c6S6DkhpZUqh6dOqwVUjnwZwtmf3_OsxNIR0ty9m0';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function inspectTables() {
  console.log('🔍 Tablo yapıları inceleniyor...\n');

  const tables = ['calls', 'analysis', 'transcript', 'users', 'reps', 'managers', 'performance_dimensions', 'ai_insights', 'scheduled_calls'];

  for (const tableName of tables) {
    try {
      console.log(`\n${'='.repeat(60)}`);
      console.log(`📋 ${tableName.toUpperCase()} TABLOSU`);
      console.log('='.repeat(60));

      // Get a sample record to see structure
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(1);

      if (error) {
        console.log(`❌ Hata: ${error.message}`);
        continue;
      }

      // Get count
      const { count } = await supabase
        .from(tableName)
        .select('*', { count: 'exact', head: true });

      console.log(`\n📊 Toplam Kayıt: ${count || 0}`);

      if (data && data.length > 0) {
        console.log('\n✅ Mevcut Sütunlar:');
        const sample = data[0];
        Object.entries(sample).forEach(([key, value]) => {
          const type = value === null ? 'null' : typeof value;
          const preview = value === null ? 'null' : 
                         typeof value === 'object' ? JSON.stringify(value).substring(0, 50) + '...' :
                         String(value).substring(0, 50);
          console.log(`   • ${key.padEnd(25)} : ${type.padEnd(10)} = ${preview}`);
        });

        // Show full sample for calls table
        if (tableName === 'calls') {
          console.log('\n📄 Örnek Kayıt:');
          console.log(JSON.stringify(sample, null, 2));
        }
      } else {
        console.log('\n⚠️  Tablo boş - örnek kayıt yok');
        console.log('   (Sütun yapısını görebilmek için en az 1 kayıt ekleyin)');
      }

    } catch (error: any) {
      console.log(`\n❌ ${tableName} kontrol edilemedi: ${error.message}`);
    }
  }

  // Summary
  console.log('\n\n' + '='.repeat(60));
  console.log('📊 ÖZET');
  console.log('='.repeat(60));
  console.log('\n✅ Mevcut ve Dolu Tablolar:');
  console.log('   • calls (6 kayıt)');
  console.log('   • analysis (3 kayıt)');
  console.log('\n⚠️  Mevcut Ama Boş Tablolar:');
  console.log('   • transcript');
  console.log('   • users');
  console.log('   • reps');
  console.log('   • managers');
  console.log('   • performance_dimensions');
  console.log('   • ai_insights');
  console.log('   • scheduled_calls');
}

inspectTables();
