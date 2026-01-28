-- =====================================================
-- AI AGENT SYSTEM TABLES
-- =====================================================

-- 1. AGENT_ANALYSIS - Stores results from each specialized agent
CREATE TABLE IF NOT EXISTS agent_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  call_id UUID NOT NULL REFERENCES calls(id) ON DELETE CASCADE,
  agent_type VARCHAR(50) NOT NULL, -- 'objection_handler', 'discovery_coach', 'closing_coach', etc.
  score INTEGER CHECK (score >= 0 AND score <= 100), -- 0-100
  analysis_data JSONB NOT NULL, -- Full agent output (objections, questions, etc.)
  strengths TEXT[], -- Array of strengths identified
  improvements TEXT[], -- Array of improvement areas
  recommendations TEXT[], -- Array of actionable recommendations
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. OBJECTIONS - Detected objections from calls
CREATE TABLE IF NOT EXISTS objections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  call_id UUID NOT NULL REFERENCES calls(id) ON DELETE CASCADE,
  agent_analysis_id UUID REFERENCES agent_analysis(id) ON DELETE CASCADE,
  timestamp VARCHAR(10), -- "2:15"
  customer_said TEXT NOT NULL, -- What customer said
  category VARCHAR(50), -- 'price', 'timing', 'authority', 'need', 'trust', 'competition'
  severity VARCHAR(20), -- 'high', 'medium', 'low'
  rep_response TEXT, -- How rep responded
  response_score INTEGER CHECK (response_score >= 0 AND response_score <= 10), -- 0-10
  response_analysis TEXT, -- Why the response was good/bad
  suggested_responses TEXT[], -- Better alternatives
  was_resolved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. QUESTIONS - Questions asked by rep during call
CREATE TABLE IF NOT EXISTS questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  call_id UUID NOT NULL REFERENCES calls(id) ON DELETE CASCADE,
  agent_analysis_id UUID REFERENCES agent_analysis(id) ON DELETE CASCADE,
  timestamp VARCHAR(10), -- "1:30"
  question_text TEXT NOT NULL,
  question_type VARCHAR(50), -- 'open_ended', 'probing', 'clarifying', 'closed', 'leading'
  quality_score INTEGER CHECK (quality_score >= 0 AND quality_score <= 10), -- 0-10
  why_good TEXT, -- Explanation if good
  why_bad TEXT, -- Explanation if bad
  better_alternative TEXT, -- Suggested better question
  customer_response TEXT, -- How customer responded
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. REP_SKILLS - Track rep skills over time
CREATE TABLE IF NOT EXISTS rep_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rep_id UUID NOT NULL REFERENCES reps(id) ON DELETE CASCADE,
  skill_name VARCHAR(100) NOT NULL, -- 'objection_handling', 'discovery', 'closing', etc.
  current_score INTEGER CHECK (current_score >= 0 AND current_score <= 100),
  previous_score INTEGER CHECK (previous_score >= 0 AND previous_score <= 100),
  trend VARCHAR(20), -- 'improving', 'declining', 'stable'
  change INTEGER, -- +10, -5, etc.
  team_percentile INTEGER, -- 0-100 (where they rank in team)
  benchmark VARCHAR(50), -- 'Top 10%', 'Average', 'Below Average'
  measurement_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(rep_id, skill_name, measurement_date)
);

-- 5. COACHING_PLANS - Personalized development plans
CREATE TABLE IF NOT EXISTS coaching_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rep_id UUID NOT NULL REFERENCES reps(id) ON DELETE CASCADE,
  skill_focus VARCHAR(100) NOT NULL, -- Which skill to improve
  priority VARCHAR(20), -- 'high', 'medium', 'low'
  current_level INTEGER, -- 0-100
  target_level INTEGER, -- 0-100
  timeline_weeks INTEGER, -- How many weeks to achieve
  practice_scenarios TEXT[], -- Array of practice scenarios
  resources TEXT[], -- Array of resources (links, docs, etc.)
  weekly_goals JSONB, -- {"week_1": "Study 3 examples", "week_2": "Practice 2x"}
  status VARCHAR(50) DEFAULT 'active', -- 'active', 'completed', 'paused'
  completion_percentage INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. DEAL_PREDICTIONS - AI predictions for deal outcomes
CREATE TABLE IF NOT EXISTS deal_predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  call_id UUID NOT NULL REFERENCES calls(id) ON DELETE CASCADE,
  deal_id VARCHAR(255), -- CRM deal ID (if integrated)
  win_probability INTEGER CHECK (win_probability >= 0 AND win_probability <= 100), -- 0-100
  risk_level VARCHAR(20), -- 'low', 'medium', 'high', 'critical'
  confidence INTEGER CHECK (confidence >= 0 AND confidence <= 100), -- How confident is the prediction
  predicted_close_date DATE,
  risk_factors JSONB, -- [{"factor": "budget_not_discussed", "severity": "high", "impact": -20}]
  positive_signals JSONB, -- [{"signal": "demo_scheduled", "impact": +20}]
  recommended_actions JSONB, -- [{"priority": "high", "action": "Send budget email"}]
  actual_outcome VARCHAR(50), -- 'won', 'lost', 'open' (filled in later)
  prediction_accuracy INTEGER, -- How accurate was the prediction (0-100)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. COMPETITOR_MENTIONS - Track competitor mentions
CREATE TABLE IF NOT EXISTS competitor_mentions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  call_id UUID NOT NULL REFERENCES calls(id) ON DELETE CASCADE,
  competitor_name VARCHAR(255) NOT NULL,
  mention_count INTEGER DEFAULT 1,
  customer_sentiment VARCHAR(50), -- 'positive', 'negative', 'neutral'
  customer_perception TEXT, -- What customer said about competitor
  rep_response_quality INTEGER CHECK (rep_response_quality >= 0 AND rep_response_quality <= 10),
  rep_positioning TEXT, -- How rep positioned against competitor
  effective_points TEXT[], -- What rep did well
  missed_opportunities TEXT[], -- What rep could have done better
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. BEST_PRACTICES - Extract winning patterns from top performers
CREATE TABLE IF NOT EXISTS best_practices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  practice_name VARCHAR(255) NOT NULL,
  practice_description TEXT NOT NULL,
  category VARCHAR(100), -- 'objection_handling', 'discovery', 'closing'
  example_call_ids UUID[], -- Array of call IDs where this was used
  success_rate INTEGER, -- 0-100 (correlation with wins)
  usage_count INTEGER DEFAULT 0,
  example_transcript TEXT, -- Example of the practice in action
  why_effective TEXT, -- Explanation of why it works
  recommended_for TEXT[], -- Which rep types benefit most
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. MASTER_COACH_REPORTS - Orchestrator output
CREATE TABLE IF NOT EXISTS master_coach_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  call_id UUID NOT NULL REFERENCES calls(id) ON DELETE CASCADE,
  overall_score INTEGER CHECK (overall_score >= 0 AND overall_score <= 100),
  top_strengths TEXT[], -- Top 3 strengths
  top_improvements TEXT[], -- Top 3 improvements needed
  priority_coaching_focus VARCHAR(100), -- Which skill to focus on first
  recommended_actions JSONB, -- Prioritized action items
  agent_scores JSONB, -- {"objection_handling": 45, "discovery": 85, ...}
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_agent_analysis_call_id ON agent_analysis(call_id);
CREATE INDEX IF NOT EXISTS idx_agent_analysis_type ON agent_analysis(agent_type);
CREATE INDEX IF NOT EXISTS idx_objections_call_id ON objections(call_id);
CREATE INDEX IF NOT EXISTS idx_objections_category ON objections(category);
CREATE INDEX IF NOT EXISTS idx_questions_call_id ON questions(call_id);
CREATE INDEX IF NOT EXISTS idx_rep_skills_rep_id ON rep_skills(rep_id);
CREATE INDEX IF NOT EXISTS idx_rep_skills_skill_name ON rep_skills(skill_name);
CREATE INDEX IF NOT EXISTS idx_coaching_plans_rep_id ON coaching_plans(rep_id);
CREATE INDEX IF NOT EXISTS idx_deal_predictions_call_id ON deal_predictions(call_id);
CREATE INDEX IF NOT EXISTS idx_competitor_mentions_call_id ON competitor_mentions(call_id);
CREATE INDEX IF NOT EXISTS idx_master_coach_reports_call_id ON master_coach_reports(call_id);

-- 11. Add updated_at triggers
DROP TRIGGER IF EXISTS update_agent_analysis_updated_at ON agent_analysis;
CREATE TRIGGER update_agent_analysis_updated_at BEFORE UPDATE ON agent_analysis
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_rep_skills_updated_at ON rep_skills;
CREATE TRIGGER update_rep_skills_updated_at BEFORE UPDATE ON rep_skills
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_coaching_plans_updated_at ON coaching_plans;
CREATE TRIGGER update_coaching_plans_updated_at BEFORE UPDATE ON coaching_plans
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_deal_predictions_updated_at ON deal_predictions;
CREATE TRIGGER update_deal_predictions_updated_at BEFORE UPDATE ON deal_predictions
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_best_practices_updated_at ON best_practices;
CREATE TRIGGER update_best_practices_updated_at BEFORE UPDATE ON best_practices
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 12. Enable Row Level Security
ALTER TABLE agent_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE objections ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE rep_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE coaching_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE deal_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE competitor_mentions ENABLE ROW LEVEL SECURITY;
ALTER TABLE best_practices ENABLE ROW LEVEL SECURITY;
ALTER TABLE master_coach_reports ENABLE ROW LEVEL SECURITY;

-- 13. Create RLS Policies
-- Users can view agent analysis of their calls
CREATE POLICY "Users can view agent analysis" ON agent_analysis
FOR SELECT USING (
  call_id IN (SELECT id FROM calls WHERE rep_id = auth.uid() OR auth.uid() IN (SELECT id FROM managers))
);

-- Users can view objections from their calls
CREATE POLICY "Users can view objections" ON objections
FOR SELECT USING (
  call_id IN (SELECT id FROM calls WHERE rep_id = auth.uid() OR auth.uid() IN (SELECT id FROM managers))
);

-- Users can view questions from their calls
CREATE POLICY "Users can view questions" ON questions
FOR SELECT USING (
  call_id IN (SELECT id FROM calls WHERE rep_id = auth.uid() OR auth.uid() IN (SELECT id FROM managers))
);

-- Reps can view their own skills
CREATE POLICY "Reps can view their skills" ON rep_skills
FOR SELECT USING (rep_id = auth.uid() OR auth.uid() IN (SELECT id FROM managers));

-- Reps can view their coaching plans
CREATE POLICY "Reps can view their coaching plans" ON coaching_plans
FOR SELECT USING (rep_id = auth.uid() OR auth.uid() IN (SELECT id FROM managers));

-- Users can view deal predictions
CREATE POLICY "Users can view deal predictions" ON deal_predictions
FOR SELECT USING (
  call_id IN (SELECT id FROM calls WHERE rep_id = auth.uid() OR auth.uid() IN (SELECT id FROM managers))
);

-- Users can view competitor mentions
CREATE POLICY "Users can view competitor mentions" ON competitor_mentions
FOR SELECT USING (
  call_id IN (SELECT id FROM calls WHERE rep_id = auth.uid() OR auth.uid() IN (SELECT id FROM managers))
);

-- Everyone can view best practices
CREATE POLICY "Everyone can view best practices" ON best_practices
FOR SELECT USING (true);

-- Users can view master coach reports
CREATE POLICY "Users can view master coach reports" ON master_coach_reports
FOR SELECT USING (
  call_id IN (SELECT id FROM calls WHERE rep_id = auth.uid() OR auth.uid() IN (SELECT id FROM managers))
);

