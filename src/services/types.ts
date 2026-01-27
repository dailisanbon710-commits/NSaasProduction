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
