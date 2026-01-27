/**
 * Service utilities and helpers
 */

import type { Call, CallAnalysis } from './types';

/**
 * Calculate call quality score
 */
export const calculateCallScore = (analysis: CallAnalysis | null): number => {
  if (!analysis) return 0;
  return Math.round(analysis.scores.overall);
};

/**
 * Get call status color
 */
export const getCallStatusColor = (status: string | null): string => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'in_progress':
      return 'bg-blue-100 text-blue-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'failed':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

/**
 * Format duration in seconds to readable format
 */
export const formatDuration = (seconds: number | null | undefined): string => {
  if (!seconds) return '0m';
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (minutes === 0) return `${secs}s`;
  if (secs === 0) return `${minutes}m`;
  return `${minutes}m ${secs}s`;
};

/**
 * Format date to readable format
 */
export const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return 'Invalid date';
  }
};

/**
 * Format time HH:MM
 */
export const formatTime = (dateString: string | null | undefined): string => {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return 'Invalid time';
  }
};

/**
 * Get dimension score badge
 */
export const getDimensionBadge = (
  score: number,
  _dimension: string
): { color: string; label: string } => {
  if (score >= 80) {
    return { color: 'bg-green-100 text-green-800', label: 'Excellent' };
  } else if (score >= 60) {
    return { color: 'bg-blue-100 text-blue-800', label: 'Good' };
  } else if (score >= 40) {
    return { color: 'bg-yellow-100 text-yellow-800', label: 'Fair' };
  } else {
    return { color: 'bg-red-100 text-red-800', label: 'Needs Improvement' };
  }
};

/**
 * Get coaching feedback priority
 */
export const getCoachingPriority = (insights: string[]): 'high' | 'medium' | 'low' => {
  if (insights.length >= 3) return 'high';
  if (insights.length >= 1) return 'medium';
  return 'low';
};

/**
 * Calculate call trends
 */
export const calculateTrend = (current: number, previous: number): 'up' | 'down' | 'stable' => {
  if (current > previous) return 'up';
  if (current < previous) return 'down';
  return 'stable';
};

/**
 * Group calls by status
 */
export const groupCallsByStatus = (calls: Call[]) => {
  return calls.reduce(
    (acc, call) => {
      const status = call.status || 'unknown';
      if (!acc[status]) acc[status] = [];
      acc[status].push(call);
      return acc;
    },
    {} as Record<string, Call[]>
  );
};

/**
 * Get calls in date range
 */
export const getCallsInDateRange = (
  calls: Call[],
  startDate: Date,
  endDate: Date
): Call[] => {
  return calls.filter(call => {
    if (!call.created_at) return false;
    const callDate = new Date(call.created_at);
    return callDate >= startDate && callDate <= endDate;
  });
};

/**
 * Calculate win rate
 */
export const calculateWinRate = (calls: Call[]): number => {
  const completed = calls.filter(c => c.status === 'completed');
  if (completed.length === 0) return 0;

  const won = completed.filter(c => 
    c.outcome && c.outcome.toLowerCase().includes('scheduled') || 
    c.outcome && c.outcome.toLowerCase().includes('demo') ||
    c.outcome && c.outcome.toLowerCase().includes('proposal')
  );

  return Math.round((won.length / completed.length) * 100);
};

/**
 * Get skill gaps from coaching feedback
 */
export const getSkillGaps = (analyses: CallAnalysis[]): Record<string, number> => {
  const gaps: Record<string, number> = {};

  analyses.forEach(analysis => {
    const { discovery, qualification, objection_handling, closing, rapport_building } = analysis.scores;
    const avgScore = (discovery + qualification + objection_handling + closing + rapport_building) / 5;

    if (discovery < avgScore) gaps['discovery'] = (gaps['discovery'] || 0) + 1;
    if (qualification < avgScore) gaps['qualification'] = (gaps['qualification'] || 0) + 1;
    if (objection_handling < avgScore) gaps['objection_handling'] = (gaps['objection_handling'] || 0) + 1;
    if (closing < avgScore) gaps['closing'] = (gaps['closing'] || 0) + 1;
    if (rapport_building < avgScore) gaps['rapport_building'] = (gaps['rapport_building'] || 0) + 1;
  });

  return gaps;
};
