/**
 * Type definitions for Supabase data models
 */

export interface Call {
  id: string;
  external_call_id: string | null;
  source: string | null;
  rep_name: string | null;
  customer_name: string | null;
  started_at: string | null;
  ended_at: string | null;
  status: string | null;
  created_at: string;
  call_type: string | null;
  company: string | null;
  industry: string | null;
  duration_seconds: number | null;
  outcome: string | null;
  audio_url: string | null;
  rep_id: string | null;
  updated_at: string;
}

export interface CallAnalysis {
  id: string;
  call_id: string;
  scores: {
    overall: number;
    discovery: number;
    qualification: number;
    objection_handling: number;
    closing: number;
    rapport_building: number;
  };
  coaching: {
    feedback: string;
    strengths: string[];
    dimension_notes: Record<string, string>;
    improvement_areas: string[];
  };
  raw: Record<string, unknown>;
  created_at: string;
}

export interface Transcript {
  id: string;
  call_id: string;
  transcript_text: string;
  segments: Array<{
    timestamp: string;
    speaker: 'rep' | 'customer';
    text: string;
  }> | null;
  language: string | null;
  raw: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface AIInsight {
  id: string;
  call_id: string;
  timestamp: string;
  type: 'positive' | 'improvement' | 'warning';
  text: string;
  category: string;
  created_at: string;
}

export interface KeyMoment {
  id: string;
  call_id: string;
  time: string;
  label: string;
  type: 'milestone' | 'warning' | 'success';
  created_at: string;
}

export interface Rep {
  id: string;
  name: string;
  email: string;
  manager_id: string | null;
  hire_date: string | null;
  status: 'active' | 'inactive';
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Manager {
  id: string;
  name: string;
  email: string;
  team_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface ScheduledCall {
  id: string;
  rep_id: string;
  customer_name: string;
  company: string | null;
  call_type: string;
  scheduled_date: string;
  duration_minutes: number;
  priority: 'high' | 'medium' | 'low';
  notes: string | null;
  preparation_tips: string[] | null;
  linkedin_url: string | null;
  status: 'scheduled' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
  // New enrichment fields
  customer_profile_id?: string | null;
  linkedin_data?: LinkedInData | null;
  crm_data?: CRMData | null;
  prior_calls_summary?: string | null;
  ai_prep_insights?: string[] | null;
}

export interface LinkedInData {
  title?: string;
  company_size?: string;
  industry?: string;
  recent_activity?: string;
  profile_url?: string;
}

export interface CRMData {
  deal_stage?: string;
  deal_value?: number;
  lead_source?: string;
  last_interaction?: string;
}

export interface CallWithDetails extends Call {
  analysis?: CallAnalysis;
  transcript?: Transcript;
  ai_insights?: AIInsight[];
  key_moments?: KeyMoment[];
}

export interface RepWithCalls extends Rep {
  calls: Call[];
  scheduled_calls: ScheduledCall[];
}

export interface ManagerWithTeam extends Manager {
  reps: Rep[];
  team_calls: Call[];
}

// AI Agent System Types
export interface AgentAnalysis {
  id: string;
  call_id: string;
  agent_type: 'objection_handler' | 'discovery_coach' | 'closing_coach' | 'talk_time_analyzer' | 'question_quality';
  score: number; // 0-100
  analysis_data: any;
  strengths: string[];
  improvements: string[];
  recommendations: string[];
  created_at: string;
  updated_at: string;
}

export interface Objection {
  id: string;
  call_id: string;
  timestamp: string;
  customer_said: string;
  category: 'price' | 'timing' | 'authority' | 'need' | 'trust' | 'competition';
  severity: 'high' | 'medium' | 'low';
  rep_response: string | null;
  response_score: number; // 0-10
  response_analysis: string | null;
  suggested_responses: string[];
  was_resolved: boolean;
  created_at: string;
}

export interface Question {
  id: string;
  call_id: string;
  timestamp: string;
  question_text: string;
  question_type: 'open_ended' | 'probing' | 'clarifying' | 'closed' | 'leading';
  quality_score: number; // 0-10
  why_good: string | null;
  why_bad: string | null;
  better_alternative: string | null;
  customer_response: string | null;
  created_at: string;
}

export interface RepSkill {
  id: string;
  rep_id: string;
  skill_name: string;
  current_score: number;
  previous_score: number;
  trend: 'improving' | 'declining' | 'stable';
  change: number;
  team_percentile: number;
  benchmark: string;
  measurement_date: string;
  created_at: string;
  updated_at: string;
}

export interface MasterCoachReport {
  id: string;
  call_id: string;
  overall_score: number;
  top_strengths: string[];
  top_improvements: string[];
  priority_coaching_focus: string;
  recommended_actions: any;
  agent_scores: {
    objection_handling?: number;
    discovery?: number;
    closing?: number;
    talk_time?: number;
    question_quality?: number;
  };
  created_at: string;
}

export interface CustomerProfile {
  id: string;
  customer_name: string;
  email: string | null;
  company: string | null;
  linkedin_url: string | null;
  linkedin_data: LinkedInData | null;
  company_size: string | null;
  industry: string | null;
  funding_stage: string | null;
  customer_persona: string | null;
  pain_points: string[];
  interests: string[];
  total_calls: number;
  last_call_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface CallWithAICoaching extends CallWithDetails {
  agent_analysis?: AgentAnalysis[];
  objections?: Objection[];
  questions?: Question[];
  master_coach_report?: MasterCoachReport;
}
