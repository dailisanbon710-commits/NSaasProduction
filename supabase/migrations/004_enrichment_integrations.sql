-- =====================================================
-- DATA ENRICHMENT & INTEGRATIONS
-- For LinkedIn, CRM, and external data sources
-- =====================================================

-- 1. CUSTOMER_PROFILES - Enriched customer data
CREATE TABLE IF NOT EXISTS customer_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  company VARCHAR(255),
  
  -- LinkedIn Data
  linkedin_url TEXT,
  linkedin_data JSONB, -- {"title": "CEO", "company_size": "11-50", "industry": "SaaS"}
  
  -- Company Data
  company_size VARCHAR(50), -- "11-50 employees"
  industry VARCHAR(100),
  company_website TEXT,
  funding_stage VARCHAR(50), -- "Seed", "Series A", etc.
  funding_amount VARCHAR(50), -- "$2M"
  
  -- Engagement History
  total_calls INTEGER DEFAULT 0,
  last_call_date TIMESTAMPTZ,
  first_call_date TIMESTAMPTZ,
  
  -- AI-generated insights
  customer_persona VARCHAR(100), -- "Early-stage founder", "Enterprise buyer", etc.
  pain_points TEXT[], -- Array of identified pain points
  interests TEXT[], -- Array of interests
  objections_history TEXT[], -- Common objections from this customer
  
  -- Enrichment metadata
  enriched_at TIMESTAMPTZ,
  enrichment_source VARCHAR(50), -- "linkedin", "clearbit", "manual"
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(email)
);

-- 2. CALL_PREPARATION - Pre-call research and prep
CREATE TABLE IF NOT EXISTS call_preparation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scheduled_call_id UUID NOT NULL REFERENCES scheduled_calls(id) ON DELETE CASCADE,
  customer_profile_id UUID REFERENCES customer_profiles(id),
  
  -- Auto-generated prep data
  ai_insights TEXT[], -- AI-generated insights about customer
  recommended_talking_points TEXT[], -- What to discuss
  potential_objections TEXT[], -- Objections to prepare for
  competitive_intel TEXT, -- Info about competitors customer might mention
  
  -- Prior interaction summary
  prior_calls_summary TEXT, -- Summary of previous calls
  prior_calls_count INTEGER DEFAULT 0,
  last_interaction_summary TEXT,
  
  -- Research notes
  recent_company_news TEXT[], -- Recent news about their company
  social_media_activity TEXT[], -- Recent LinkedIn posts, tweets, etc.
  
  -- Preparation checklist
  checklist_items JSONB, -- [{"item": "Review pricing", "completed": false}]
  prep_completed BOOLEAN DEFAULT false,
  prep_completed_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CRM_INTEGRATION - Store CRM deal data
CREATE TABLE IF NOT EXISTS crm_deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_deal_id VARCHAR(255) UNIQUE, -- Deal ID from Salesforce/HubSpot
  call_id UUID REFERENCES calls(id),
  customer_profile_id UUID REFERENCES customer_profiles(id),
  
  -- Deal info
  deal_name VARCHAR(255),
  deal_value DECIMAL(12, 2),
  deal_stage VARCHAR(100), -- "Discovery", "Demo", "Negotiation", "Closed Won"
  probability INTEGER, -- 0-100
  expected_close_date DATE,
  
  -- Deal metadata
  lead_source VARCHAR(100), -- "Webinar", "Inbound", "Referral"
  deal_owner VARCHAR(255), -- Rep name
  
  -- Outcome
  actual_close_date DATE,
  outcome VARCHAR(50), -- "won", "lost", "open"
  lost_reason TEXT,
  
  -- CRM sync
  crm_system VARCHAR(50), -- "salesforce", "hubspot", "pipedrive"
  last_synced_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. PRIOR_INTERACTIONS - History of all customer interactions
CREATE TABLE IF NOT EXISTS prior_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_profile_id UUID NOT NULL REFERENCES customer_profiles(id) ON DELETE CASCADE,
  call_id UUID REFERENCES calls(id),
  
  -- Interaction details
  interaction_type VARCHAR(50), -- "call", "email", "demo", "meeting"
  interaction_date TIMESTAMPTZ NOT NULL,
  rep_name VARCHAR(255),
  
  -- Summary
  summary TEXT, -- AI-generated or manual summary
  key_points TEXT[], -- Important points from interaction
  next_steps TEXT, -- What was agreed
  
  -- Sentiment
  customer_sentiment VARCHAR(50), -- "positive", "neutral", "negative"
  engagement_level VARCHAR(50), -- "high", "medium", "low"
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ENRICHMENT_QUEUE - Queue for data enrichment jobs
CREATE TABLE IF NOT EXISTS enrichment_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type VARCHAR(50) NOT NULL, -- "customer", "company"
  entity_id UUID NOT NULL,
  
  -- Enrichment request
  enrichment_type VARCHAR(50), -- "linkedin", "company_data", "news"
  priority VARCHAR(20) DEFAULT 'medium', -- "high", "medium", "low"
  
  -- Status
  status VARCHAR(50) DEFAULT 'pending', -- "pending", "processing", "completed", "failed"
  attempts INTEGER DEFAULT 0,
  max_attempts INTEGER DEFAULT 3,
  
  -- Results
  result_data JSONB,
  error_message TEXT,
  
  -- Timestamps
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Add columns to scheduled_calls for enrichment
ALTER TABLE scheduled_calls 
ADD COLUMN IF NOT EXISTS customer_profile_id UUID REFERENCES customer_profiles(id),
ADD COLUMN IF NOT EXISTS linkedin_data JSONB,
ADD COLUMN IF NOT EXISTS crm_data JSONB,
ADD COLUMN IF NOT EXISTS prior_calls_summary TEXT,
ADD COLUMN IF NOT EXISTS ai_prep_insights TEXT[];

-- 7. Add indexes
CREATE INDEX IF NOT EXISTS idx_customer_profiles_email ON customer_profiles(email);
CREATE INDEX IF NOT EXISTS idx_customer_profiles_company ON customer_profiles(company);
CREATE INDEX IF NOT EXISTS idx_call_preparation_scheduled_call ON call_preparation(scheduled_call_id);
CREATE INDEX IF NOT EXISTS idx_crm_deals_external_id ON crm_deals(external_deal_id);
CREATE INDEX IF NOT EXISTS idx_crm_deals_call_id ON crm_deals(call_id);
CREATE INDEX IF NOT EXISTS idx_prior_interactions_customer ON prior_interactions(customer_profile_id);
CREATE INDEX IF NOT EXISTS idx_prior_interactions_date ON prior_interactions(interaction_date DESC);
CREATE INDEX IF NOT EXISTS idx_enrichment_queue_status ON enrichment_queue(status);

-- 8. Add updated_at triggers
DROP TRIGGER IF EXISTS update_customer_profiles_updated_at ON customer_profiles;
CREATE TRIGGER update_customer_profiles_updated_at BEFORE UPDATE ON customer_profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_call_preparation_updated_at ON call_preparation;
CREATE TRIGGER update_call_preparation_updated_at BEFORE UPDATE ON call_preparation
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_crm_deals_updated_at ON crm_deals;
CREATE TRIGGER update_crm_deals_updated_at BEFORE UPDATE ON crm_deals
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 9. Enable Row Level Security
ALTER TABLE customer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE call_preparation ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE prior_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrichment_queue ENABLE ROW LEVEL SECURITY;

-- 10. Create RLS Policies
-- Everyone can view customer profiles (needed for scheduled calls)
CREATE POLICY "Users can view customer profiles" ON customer_profiles
FOR SELECT USING (true);

-- Users can view call preparation for their scheduled calls
CREATE POLICY "Users can view call preparation" ON call_preparation
FOR SELECT USING (
  scheduled_call_id IN (
    SELECT id FROM scheduled_calls
    WHERE rep_id = auth.uid() OR auth.uid() IN (SELECT id FROM managers)
  )
);

-- Users can view CRM deals related to their calls
CREATE POLICY "Users can view CRM deals" ON crm_deals
FOR SELECT USING (
  call_id IN (SELECT id FROM calls WHERE rep_id = auth.uid() OR auth.uid() IN (SELECT id FROM managers))
  OR auth.uid() IN (SELECT id FROM managers)
);

-- Users can view prior interactions
CREATE POLICY "Users can view prior interactions" ON prior_interactions
FOR SELECT USING (true);

-- Only system can access enrichment queue
CREATE POLICY "System can access enrichment queue" ON enrichment_queue
FOR ALL USING (auth.uid() IN (SELECT id FROM managers));

