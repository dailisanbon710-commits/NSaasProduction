/**
 * Custom React hooks for data fetching and state management
 */

import { useEffect, useState } from 'react';
import {
  callsAPI,
  repsAPI,
  managersAPI,
  analyticsAPI,
  realtimeAPI,
} from './supabase';
import type { Call } from './types';

interface UseAsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

/**
 * Generic async data hook
 */
export const useAsync = <T,>(
  asyncFunction: () => Promise<T>,
  immediate = true,
  deps: unknown[] = []
): UseAsyncState<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!immediate) return;

    let isMounted = true;
    const controller = new AbortController();

    const execute = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await asyncFunction();
        if (isMounted && !controller.signal.aborted) {
          setData(response);
        }
      } catch (err) {
        if (isMounted && !controller.signal.aborted) {
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      } finally {
        if (isMounted && !controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    execute();

    return () => {
      isMounted = false;
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [immediate, ...deps]);

  return { data, loading, error };
};

/**
 * Fetch calls for a specific rep
 */
export const useRepCalls = (repId: string) => {
  return useAsync(() => callsAPI.getRepCalls(repId), !!repId, [repId]);
};

/**
 * Fetch all calls
 */
export const useAllCalls = () => {
  return useAsync(() => callsAPI.getAllCalls());
};

/**
 * Fetch all analysis records
 */
export const useAllAnalysis = () => {
  return useAsync(() => callsAPI.getAllAnalysis());
};

/**
 * Fetch call details with all related data
 */
export const useCallDetails = (callId: string) => {
  return useAsync(() => callsAPI.getCallDetails(callId), !!callId, [callId]);
};

/**
 * Fetch all reps
 */
export const useAllReps = () => {
  return useAsync(() => repsAPI.getAllReps());
};

/**
 * Fetch rep profile with calls
 */
export const useRepProfile = (repId: string) => {
  return useAsync(() => repsAPI.getRepProfile(repId), !!repId, [repId]);
};

/**
 * Fetch rep metrics
 */
export const useRepMetrics = (repId: string) => {
  return useAsync(() => repsAPI.getRepMetrics(repId), !!repId, [repId]);
};

/**
 * Fetch rep scheduled calls
 */
export const useRepScheduledCalls = (repId: string) => {
  return useAsync(() => repsAPI.getRepScheduledCalls(repId), !!repId, [repId]);
};

/**
 * Fetch all scheduled calls (for all reps)
 */
export const useAllScheduledCalls = () => {
  return useAsync(() => repsAPI.getAllScheduledCalls());
};

/**
 * Fetch transcript for a call
 */
export const useCallTranscript = (callId: string) => {
  return useAsync(() => callsAPI.getCallTranscript(callId), !!callId, [callId]);
};

/**
 * Fetch AI insights for a call
 */
export const useCallInsights = (callId: string) => {
  return useAsync(() => callsAPI.getCallInsights(callId), !!callId, [callId]);
};

/**
 * Fetch key moments for a call
 */
export const useCallMoments = (callId: string) => {
  return useAsync(() => callsAPI.getCallMoments(callId), !!callId, [callId]);
};

/**
 * Fetch all transcripts
 */
export const useAllTranscripts = () => {
  return useAsync(() => callsAPI.getAllTranscripts());
};

/**
 * Fetch all AI insights
 */
export const useAllInsights = () => {
  return useAsync(() => callsAPI.getAllInsights());
};

/**
 * Fetch all key moments
 */
export const useAllKeyMoments = () => {
  return useAsync(() => callsAPI.getAllMoments());
};

/**
 * Fetch all managers
 */
export const useAllManagers = () => {
  return useAsync(() => managersAPI.getAllManagers());
};

/**
 * Fetch manager profile with team
 */
// Manager profile hook removed (API not implemented)

/**
 * Fetch team metrics
 */
export const useTeamMetrics = (managerId: string) => {
  return useAsync(() => managersAPI.getTeamMetrics(managerId), !!managerId);
};

/**
 * Fetch team scheduled calls (for managers)
 */
export const useTeamScheduledCalls = () => {
  return useAsync(() => managersAPI.getTeamScheduledCalls());
};

/**
 * Fetch call statistics
 */
export const useCallStats = () => {
  return useAsync(() => analyticsAPI.getCallStats());
};

/**
 * Fetch dimension performance
 */
export const useDimensionPerformance = () => {
  return useAsync(() => analyticsAPI.getDimensionPerformance());
};

/**
 * Subscribe to real-time rep calls
 */
export const useRealtimeRepCalls = (repId: string, onUpdate: (call: Call) => void) => {
  useEffect(() => {
    if (!repId) return;

    const subscription = realtimeAPI.subscribeToRepCalls(repId, onUpdate);

    return () => {
      realtimeAPI.unsubscribe(subscription);
    };
  }, [repId, onUpdate]);
};

/**
 * Subscribe to all calls (manager view)
 */
export const useRealtimeAllCalls = (onUpdate: (call: Call) => void) => {
  useEffect(() => {
    const subscription = realtimeAPI.subscribeToAllCalls(onUpdate);

    return () => {
      realtimeAPI.unsubscribe(subscription);
    };
  }, [onUpdate]);
};
