/**
 * Supabase API Service Layer
 * Provides typed, error-safe queries for dashboard data
 */

import { createClient } from '@supabase/supabase-js';
import {
  Call,
  CallAnalysis,
  Transcript,
  AIInsight,
  KeyMoment,
  Rep,
  Manager,
  ScheduledCall,
  CallWithDetails,
  RepWithCalls,
} from './types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://jytjdryjgcxgnfwlgtwc.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5dGpkcnlqZ2N4Z25md2xndHdjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2MDYwMjQsImV4cCI6MjA4NDE4MjAyNH0.lLWFWMIrLm0GzPAF3vFRAUfKaFkCMkxIXsXN8P5z-vU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * CALLS API
 */
export const callsAPI = {
  /**
   * Fetch all calls for a specific rep
   */
  async getRepCalls(repId: string): Promise<Call[]> {
    const { data, error } = await supabase
      .from('calls')
      .select('*')
      .eq('rep_id', repId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching rep calls:', error.message);
      throw new Error(`Failed to fetch calls: ${error.message}`);
    }

    return data || [];
  },

  /**
   * Fetch all calls (for managers/admin)
   */
  async getAllCalls(): Promise<Call[]> {
    const { data, error } = await supabase
      .from('calls')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching calls:', error.message);
      throw new Error(`Failed to fetch calls: ${error.message}`);
    }

    return data || [];
  },

  /**
   * Fetch all analysis records
   */
  async getAllAnalysis(): Promise<any[]> {
    const { data, error } = await supabase
      .from('analysis')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching analysis:', error.message);
      throw new Error(`Failed to fetch analysis: ${error.message}`);
    }

    return data || [];
  },

  /**
   * Fetch a specific call with all related data
   */
  async getCallDetails(callId: string): Promise<CallWithDetails | null> {
    let callData: Call | null = null;
    try {
      const { data: call, error: callError } = await supabase
        .from('calls')
        .select('*')
        .eq('id', callId);

      if (callError || !call || call.length === 0) {
        return null;
      }

      callData = call[0];
    } catch (err) {
      return null;
    }

    // Fetch related data in parallel
    try {

      const [analysis, transcript, insights, moments] = await Promise.all([
        callsAPI.getCallAnalysis(callId),
        callsAPI.getCallTranscript(callId),
        callsAPI.getCallInsights(callId),
        callsAPI.getCallMoments(callId),
      ]);

      return {
        ...(callData as Call),
        analysis: analysis || undefined,
        transcript: transcript || undefined,
        ai_insights: insights,
        key_moments: moments,
      };
    } catch (err) {
      return null;
    }
  },

  /**
   * Get analysis for a call
   */
  async getCallAnalysis(callId: string): Promise<CallAnalysis | null> {
    try {
      const { data, error } = await supabase
        .from('analysis')
        .select('*')
        .eq('call_id', callId);

      if (error) {
        return null;
      }

      return (data && data.length > 0) ? data[0] : null;
    } catch (err) {
      return null;
    }
  },

  /**
   * Get transcript for a call
   */
  async getCallTranscript(callId: string): Promise<Transcript | null> {
    try {
      const { data, error } = await supabase
        .from('transcripts')
        .select('*')
        .eq('call_id', callId);

      if (error) {
        return null;
      }

      return (data && data.length > 0) ? data[0] : null;
    } catch (err) {
      return null;
    }
  },

  /**
   * Get AI insights for a call
   */
  async getCallInsights(callId: string): Promise<AIInsight[]> {
    try {
      const { data, error } = await supabase
        .from('ai_insights')
        .select('*')
        .eq('call_id', callId)
        .order('timestamp', { ascending: true });

      if (error) {
        return [];
      }

      return data || [];
    } catch (err) {
      return [];
    }
  },

  /**
   * Get key moments for a call
   */
  async getCallMoments(callId: string): Promise<KeyMoment[]> {
    try {
      const { data, error } = await supabase
        .from('key_moments')
        .select('*')
        .eq('call_id', callId)
        .order('time', { ascending: true });

      if (error) {
        return [];
      }

      return data || [];
    } catch (err) {
      return [];
    }
  },

  /**
   * Get all transcripts
   */
  async getAllTranscripts(): Promise<Transcript[]> {
    try {
      const { data, error } = await supabase
        .from('transcripts')
        .select('*');

      if (error) {
        return [];
      }

      return data || [];
    } catch (err) {
      return [];
    }
  },

  /**
   * Get all AI insights
   */
  async getAllInsights(): Promise<AIInsight[]> {
    try {
      const { data, error } = await supabase
        .from('ai_insights')
        .select('*')
        .order('timestamp', { ascending: true });

      if (error) {
        return [];
      }

      return data || [];
    } catch (err) {
      return [];
    }
  },

  /**
   * Get all key moments
   */
  async getAllMoments(): Promise<KeyMoment[]> {
    try {
      const { data, error } = await supabase
        .from('key_moments')
        .select('*')
        .order('time', { ascending: true });

      if (error) {
        return [];
      }

      return data || [];
    } catch (err) {
      return [];
    }
  },
};

/**
 * REPS API
 */
export const repsAPI = {
  /**
   * Get all reps
   */
  async getAllReps(): Promise<Rep[]> {
    const { data, error } = await supabase
      .from('reps')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching reps:', error.message);
      throw new Error(`Failed to fetch reps: ${error.message}`);
    }

    return data || [];
  },

  /**
   * Get a specific rep with all their data
   */
  async getRepProfile(repId: string): Promise<RepWithCalls | null> {
    try {
      const { data: reps, error: repError } = await supabase
        .from('reps')
        .select('*')
        .eq('id', repId);

      if (repError || !reps || reps.length === 0) {
        return null;
      }

      const rep = reps[0];

      // Fetch rep's calls and scheduled calls in parallel
      const [calls, scheduled_calls] = await Promise.all([
        callsAPI.getRepCalls(repId),
        repsAPI.getRepScheduledCalls(repId),
      ]);

      return {
        ...rep,
        calls,
        scheduled_calls,
      };
    } catch (err) {
      return null;
    }
  },

  /**
   * Get scheduled calls for a rep
   */
  async getRepScheduledCalls(repId: string): Promise<ScheduledCall[]> {
    // Use start-of-day to avoid dropping same-day calls that already started
    const startOfToday = new Date();
    startOfToday.setUTCHours(0, 0, 0, 0);

    const { data, error } = await supabase
      .from('scheduled_calls')
      .select('*')
      .eq('rep_id', repId)
      .gte('scheduled_date', startOfToday.toISOString())
      .order('scheduled_date', { ascending: true });

    if (error) {
      console.error('Error fetching scheduled calls:', error.message);
      return [];
    }

    return data || [];
  },

  /**
   * Get all scheduled calls (for all reps)
   */
  async getAllScheduledCalls(): Promise<ScheduledCall[]> {
    // Use start-of-day to avoid dropping same-day calls that already started
    const startOfToday = new Date();
    startOfToday.setUTCHours(0, 0, 0, 0);

    const { data, error } = await supabase
      .from('scheduled_calls')
      .select('*')
      .gte('scheduled_date', startOfToday.toISOString())
      .order('scheduled_date', { ascending: true });

    if (error) {
      console.error('Error fetching all scheduled calls:', error.message);
      return [];
    }

    return data || [];
  },

  /**
   * Get performance metrics for a rep
   */
  async getRepMetrics(repId: string) {
    try {
      const calls = await callsAPI.getRepCalls(repId);
      const analysisPromises = calls.map(call => callsAPI.getCallAnalysis(call.id));
      const analyses = await Promise.all(analysisPromises);

      const validAnalyses = analyses.filter(a => a !== null) as CallAnalysis[];

      if (validAnalyses.length === 0) {
        return {
          totalCalls: calls.length,
          avgScore: 0,
          avgDiscovery: 0,
          avgQualification: 0,
          avgObjectionHandling: 0,
          avgClosing: 0,
          avgRapportBuilding: 0,
        };
      }

      const avgScore = validAnalyses.reduce((sum, a) => sum + a.scores.overall, 0) / validAnalyses.length;
      const avgDiscovery = validAnalyses.reduce((sum, a) => sum + a.scores.discovery, 0) / validAnalyses.length;
      const avgQualification = validAnalyses.reduce((sum, a) => sum + a.scores.qualification, 0) / validAnalyses.length;
      const avgObjectionHandling = validAnalyses.reduce((sum, a) => sum + a.scores.objection_handling, 0) / validAnalyses.length;
      const avgClosing = validAnalyses.reduce((sum, a) => sum + a.scores.closing, 0) / validAnalyses.length;
      const avgRapportBuilding = validAnalyses.reduce((sum, a) => sum + a.scores.rapport_building, 0) / validAnalyses.length;

      return {
        totalCalls: calls.length,
        avgScore: Math.round(avgScore),
        avgDiscovery: Math.round(avgDiscovery),
        avgQualification: Math.round(avgQualification),
        avgObjectionHandling: Math.round(avgObjectionHandling),
        avgClosing: Math.round(avgClosing),
        avgRapportBuilding: Math.round(avgRapportBuilding),
      };
    } catch (error) {
      console.error('Error fetching rep metrics:', error);
      throw error;
    }
  },
};

/**
 * MANAGERS API
 */
export const managersAPI = {
  /**
   * Get all managers
   */
  async getAllManagers(): Promise<Manager[]> {
    const { data, error } = await supabase
      .from('managers')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching managers:', error.message);
      throw new Error(`Failed to fetch managers: ${error.message}`);
    }

    return data || [];
  },

  /*try {
      const { data: managers, error: managerError } = await supabase
        .from('managers')
        .select('*')
        .eq('id', managerId);

      if (managerError || !managers || managers.length === 0) {
        return null;
      }

      const manager = managers[0];

      // Fetch team reps and all calls
      const [reps, calls] = await Promise.all([
        repsAPI.getAllReps(), // In a real app, filter by manager_id
        callsAPI.getAllCalls(),
      ]);

      return {
        ...manager,
        reps,
        team_calls: calls,
      };
    } catch (err) {
      return null;
    }turn {
      ...manager,
      reps,
      team_calls: calls,
    };
  },

  /**
   * Get team performance overview
   */
  async getTeamMetrics(_managerId: string) {
    try {
      const reps = await repsAPI.getAllReps();
      const metrics = await Promise.all(
        reps.map(rep => repsAPI.getRepMetrics(rep.id))
      );

      const totalCalls = metrics.reduce((sum, m) => sum + m.totalCalls, 0);
      const avgScore = Math.round(
        metrics.reduce((sum, m) => sum + m.avgScore, 0) / metrics.length
      );

      return {
        totalReps: reps.length,
        totalCalls,
        avgTeamScore: avgScore,
        repMetrics: reps.map((rep, idx) => ({
          repId: rep.id,
          name: rep.name,
          email: rep.email,
          ...metrics[idx],
        })),
      };
    } catch (error) {
      console.error('Error fetching team metrics:', error);
      throw error;
    }
  },

  /**
   * Get all scheduled calls for the team (for managers)
   */
  async getTeamScheduledCalls(): Promise<ScheduledCall[]> {
    // Use start-of-day to avoid dropping same-day calls that already started
    const startOfToday = new Date();
    startOfToday.setUTCHours(0, 0, 0, 0);

    const { data, error } = await supabase
      .from('scheduled_calls')
      .select('*')
      .gte('scheduled_date', startOfToday.toISOString())
      .order('scheduled_date', { ascending: true });

    if (error) {
      console.error('Error fetching team scheduled calls:', error.message);
      return [];
    }

    return data || [];
  },
};

/**
 * ANALYTICS API
 */
export const analyticsAPI = {
  /**
   * Get call statistics
   */
  async getCallStats() {
    try {
      const calls = await callsAPI.getAllCalls();
      const completed = calls.filter(c => c.status === 'completed').length;
      const avgDuration = Math.round(
        calls.reduce((sum, c) => sum + (c.duration_seconds || 0), 0) / calls.length
      );

      return {
        totalCalls: calls.length,
        completedCalls: completed,
        avgDuration,
      };
    } catch (error) {
      console.error('Error fetching call stats:', error);
      throw error;
    }
  },

  /**
   * Get dimension performance across all calls
   */
  async getDimensionPerformance() {
    try {
      const calls = await callsAPI.getAllCalls();
      const analyses = await Promise.all(
        calls.map(call => callsAPI.getCallAnalysis(call.id))
      );

      const validAnalyses = analyses.filter(a => a !== null) as CallAnalysis[];

      if (validAnalyses.length === 0) {
        return {
          discovery: 0,
          qualification: 0,
          objection_handling: 0,
          closing: 0,
          rapport_building: 0,
        };
      }

      return {
        discovery: Math.round(
          validAnalyses.reduce((sum, a) => sum + a.scores.discovery, 0) / validAnalyses.length
        ),
        qualification: Math.round(
          validAnalyses.reduce((sum, a) => sum + a.scores.qualification, 0) / validAnalyses.length
        ),
        objection_handling: Math.round(
          validAnalyses.reduce((sum, a) => sum + a.scores.objection_handling, 0) / validAnalyses.length
        ),
        closing: Math.round(
          validAnalyses.reduce((sum, a) => sum + a.scores.closing, 0) / validAnalyses.length
        ),
        rapport_building: Math.round(
          validAnalyses.reduce((sum, a) => sum + a.scores.rapport_building, 0) / validAnalyses.length
        ),
      };
    } catch (error) {
      console.error('Error fetching dimension performance:', error);
      throw error;
    }
  },
};

/**
 * Real-time subscription helpers
 */
export const realtimeAPI = {
  /**
   * Subscribe to call changes for a rep
   */
  subscribeToRepCalls(repId: string, callback: (call: Call) => void) {
    return supabase
      .channel(`calls:rep:${repId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'calls',
          filter: `rep_id=eq.${repId}`,
        },
        (payload: any) => {
          callback(payload.new || payload.old);
        }
      )
      .subscribe();
  },

  /**
   * Subscribe to all calls (for managers)
   */
  subscribeToAllCalls(callback: (call: Call) => void) {
    return supabase
      .channel('calls:all')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'calls',
        },
        (payload: any) => {
          callback(payload.new || payload.old);
        }
      )
      .subscribe();
  },

  /**
   * Unsubscribe from a channel
   */
  unsubscribe(channel: any) {
    if (channel) {
      supabase.removeChannel(channel);
    }
  },
};
