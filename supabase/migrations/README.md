# Supabase Migration Guide

## 📋 Mevcut Durum

Supabase'de şu tablolar mevcut:
- ✅ `calls` (6 kayıt) - Satış görüşmeleri
- ✅ `analysis` (3 kayıt) - Call analysis verileri  
- ❌ `transcript` - Tablo adı yanlış veya eksik (transcripts olmalı)
- ⚠️ `users`, `reps`, `managers`, `performance_dimensions`, `ai_insights`, `scheduled_calls` - Boş tablolar

## 🚀 Migration Adımları

### 1. SQL Editor'ı Aç
```
https://supabase.com/dashboard/project/jytjdryjgcxgnfwlgtwc/sql/new
```

### 2. İlk Migration'ı Çalıştır (Tablo ve Sütun Eklemeleri)

Dosya: `supabase/migrations/001_add_missing_columns_and_tables.sql`

Bu migration şunları yapar:
- `calls` tablosuna eksik sütunlar ekler (company, industry, duration_seconds, outcome, audio_url, rep_id)
- `transcripts` tablosunu oluşturur
- `ai_insights` tablosunu oluşturur
- `key_moments` tablosunu oluşturur
- `reps` tablosunu oluşturur
- `managers` tablosunu oluşturur
- `scheduled_calls` tablosunu oluşturur
- Index'ler ekler (performance için)
- Row Level Security (RLS) aktif eder
- RLS policies oluşturur

**ÖNEMLİ:** Bu SQL'i kopyalayıp Supabase SQL Editor'a yapıştırın ve "RUN" butonuna basın.

### 3. Seed Data'yı Çalıştır (Test Verileri)

Dosya: `supabase/migrations/002_seed_data.sql`

Bu migration şunları yapar:
- Reps (Sarah Johnson, Tom Martinez, Emma Rodriguez) ekler
- Manager ekler
- Mevcut call'lara ek bilgiler ekler (company, industry, duration, outcome)
- Transcripts ekler
- AI Insights ekler (her call için 2-3 insight)
- Key Moments ekler (timeline üzerindeki önemli anlar)
- Scheduled Calls ekler (gelecek görüşmeler)

**NOT:** Eğer auth.users tablosunda bu kullanıcılar yoksa, seed data çalışmayabilir. O zaman önce kullanıcıları oluşturmanız gerekir.

### 4. Auth Kullanıcılarını Oluştur (Eğer yoksa)

```sql
-- Önce dummy password ile test kullanıcıları oluştur
-- Bunları Supabase Auth > Users panelinden de oluşturabilirsiniz

-- Veya sign up sayfasından kayıt yapın:
-- sarah.johnson@company.com
-- tom.martinez@company.com
-- emma.rodriguez@company.com
-- manager@company.com
```

## 🔍 Verification (Doğrulama)

Migration'lardan sonra bu query'leri çalıştırarak kontrol edin:

```sql
-- Tüm tabloların kayıt sayıları
SELECT 'calls' as table_name, COUNT(*) as count FROM calls
UNION ALL
SELECT 'analysis', COUNT(*) FROM analysis
UNION ALL
SELECT 'transcripts', COUNT(*) FROM transcripts
UNION ALL
SELECT 'ai_insights', COUNT(*) FROM ai_insights
UNION ALL
SELECT 'key_moments', COUNT(*) FROM key_moments
UNION ALL
SELECT 'reps', COUNT(*) FROM reps
UNION ALL
SELECT 'managers', COUNT(*) FROM managers
UNION ALL
SELECT 'scheduled_calls', COUNT(*) FROM scheduled_calls;

-- Bir örnek call ile tüm ilişkili verileri göster
SELECT 
  c.id,
  c.rep_name,
  c.customer_name,
  c.company,
  c.call_type,
  c.duration_seconds,
  c.outcome,
  a.scores->>'overall' as overall_score,
  t.full_text as transcript_preview,
  (SELECT COUNT(*) FROM ai_insights WHERE call_id = c.id) as insights_count,
  (SELECT COUNT(*) FROM key_moments WHERE call_id = c.id) as moments_count
FROM calls c
LEFT JOIN analysis a ON a.call_id = c.id
LEFT JOIN transcripts t ON t.call_id = c.id
WHERE c.external_call_id LIKE 'fake-call%'
LIMIT 3;
```

## 📊 Beklenen Sonuçlar

Migration başarılı olursa:
- ✅ 6 call kaydı (mevcut + güncellenmiş)
- ✅ 3 analysis kaydı (mevcut)
- ✅ 2-3 transcript kaydı (yeni)
- ✅ 7-8 ai_insights kaydı (yeni)
- ✅ 9-10 key_moments kaydı (yeni)
- ✅ 3 reps kaydı (yeni)
- ✅ 1 manager kaydı (yeni)
- ✅ 4 scheduled_calls kaydı (yeni)

## ⚠️ Sorun Giderme

### Hata: "foreign key constraint"
**Sebep:** auth.users tablosunda kullanıcılar yok
**Çözüm:** Önce kullanıcıları oluşturun (Sign Up sayfasından veya Supabase Dashboard > Auth > Users)

### Hata: "table already exists"
**Sebep:** Tablo zaten var
**Çözüm:** Sorun değil, `IF NOT EXISTS` kullandık, devam et

### Hata: "duplicate key value"
**Sebep:** Seed data zaten var
**Çözüm:** Sorun değil, `ON CONFLICT DO NOTHING` kullandık

## 🎯 Sonraki Adımlar

Migration'lar başarılı olduktan sonra:

1. ✅ Frontend API servislerini oluştur
2. ✅ Dashboard'ları gerçek veriye bağla
3. ✅ Mock data'yı kaldır
4. ✅ Loading states ekle
5. ✅ Real-time subscriptions ekle

Hazır mısın? Migration'ları çalıştıralım! 🚀
