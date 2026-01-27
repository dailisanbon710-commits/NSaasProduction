import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jytjdryjgcxgnfwlgtwc.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5dGpkcnlqZ2N4Z25md2xndHdjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODYwNjAyNCwiZXhwIjoyMDg0MTgyMDI0fQ.H1c6S6DkhpZUqh6dOqwVUjnwZwtmf3_OsxNIR0ty9m0';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkTables() {
  console.log('🔍 Supabase veritabanını inceliyorum...\n');

  try {
    // List all tables using PostgreSQL information schema
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');

    if (tablesError) {
      console.error('❌ Tablo listesi alınamadı:', tablesError.message);
      
      // Try alternate method - query specific tables
      console.log('\n📊 Bilinen tablolar kontrol ediliyor...\n');
      
      const knownTables = ['calls', 'analysis', 'transcript', 'users', 'reps', 'managers', 'performance_dimensions', 'ai_insights', 'scheduled_calls'];
      
      for (const tableName of knownTables) {
        try {
          const { data, error, count } = await supabase
            .from(tableName)
            .select('*', { count: 'exact', head: true });
          
          if (!error) {
            console.log(`✅ ${tableName} - ${count || 0} kayıt`);
          }
        } catch (e) {
          console.log(`❌ ${tableName} - Tablo yok`);
        }
      }
      
      return;
    }

    if (!tables || tables.length === 0) {
      console.log('⚠️  Public schema\'da tablo bulunamadı.\n');
      return;
    }

    console.log(`📋 Bulunan tablolar (${tables.length}):\n`);
    
    for (const table of tables) {
      const tableName = table.table_name;
      
      // Get row count
      const { count, error: countError } = await supabase
        .from(tableName)
        .select('*', { count: 'exact', head: true });
      
      if (countError) {
        console.log(`  • ${tableName} - (kayıt sayısı alınamadı)`);
      } else {
        console.log(`  ✅ ${tableName} - ${count || 0} kayıt`);
      }
    }

    // Check specific tables we need
    console.log('\n\n🔎 İhtiyaç duyulan tablolar kontrolü:\n');
    
    const requiredTables = {
      'calls': 'Satış görüşmeleri',
      'analysis': 'Call analysis verileri',
      'transcript': 'Transcript verileri',
      'users': 'Kullanıcılar (auth.users extend)',
      'reps': 'Satış temsilcileri',
      'managers': 'Yöneticiler',
      'performance_dimensions': 'Performans boyutları (discovery, qualification, vb.)',
      'ai_insights': 'AI tarafından üretilen insights',
      'scheduled_calls': 'Planlanmış görüşmeler',
      'team_metrics': 'Takım metrikleri'
    };

    const existingTableNames = tables.map(t => t.table_name);

    for (const [tableName, description] of Object.entries(requiredTables)) {
      const exists = existingTableNames.includes(tableName);
      if (exists) {
        console.log(`  ✅ ${tableName} - ${description}`);
      } else {
        console.log(`  ❌ ${tableName} - ${description} (EKSİK)`);
      }
    }

    // If calls table exists, show its structure
    if (existingTableNames.includes('calls')) {
      console.log('\n\n📊 "calls" tablosu detayı:\n');
      
      const { data: sampleCall } = await supabase
        .from('calls')
        .select('*')
        .limit(1)
        .single();
      
      if (sampleCall) {
        console.log('  Mevcut sütunlar:');
        Object.keys(sampleCall).forEach(key => {
          console.log(`    • ${key}: ${typeof sampleCall[key]}`);
        });
      }
    }

    // If analysis table exists, show its structure
    if (existingTableNames.includes('analysis')) {
      console.log('\n\n📊 "analysis" tablosu detayı:\n');
      
      const { data: sampleAnalysis } = await supabase
        .from('analysis')
        .select('*')
        .limit(1)
        .single();
      
      if (sampleAnalysis) {
        console.log('  Mevcut sütunlar:');
        Object.keys(sampleAnalysis).forEach(key => {
          console.log(`    • ${key}: ${typeof sampleAnalysis[key]}`);
        });
      }
    }

    // If transcript table exists, show its structure
    if (existingTableNames.includes('transcript')) {
      console.log('\n\n📊 "transcript" tablosu detayı:\n');
      
      const { data: sampleTranscript } = await supabase
        .from('transcript')
        .select('*')
        .limit(1)
        .single();
      
      if (sampleTranscript) {
        console.log('  Mevcut sütunlar:');
        Object.keys(sampleTranscript).forEach(key => {
          console.log(`    • ${key}: ${typeof sampleTranscript[key]}`);
        });
      }
    }

  } catch (error: any) {
    console.error('❌ Hata:', error.message);
  }
}

checkTables();
