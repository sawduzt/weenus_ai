/**
 * useMetrics Hook
 * 
 * React hook for managing performance metrics including:
 * - Token generation rate (tokens/s)
 * - Memory usage
 * - GPU usage
 * - Running models
 */

import { useState, useEffect, useCallback } from 'react';
import { ollamaService, RunningModel, ChatResponse } from '../services/ollama';

interface MetricsState {
  tokensPerSecond: number;
  memoryUsage: string;
  gpuUsage: string;
  runningModels: RunningModel[];
}

interface UseMetricsReturn extends MetricsState {
  updateTokensPerSecond: (chatResponse: ChatResponse) => void;
  refreshMetrics: () => Promise<void>;
}

export function useMetrics(): UseMetricsReturn {
  const [metrics, setMetrics] = useState<MetricsState>({
    tokensPerSecond: 0,
    memoryUsage: '--',
    gpuUsage: '--',
    runningModels: [],
  });

  /**
   * Update tokens per second from a chat response
   */
  const updateTokensPerSecond = useCallback((chatResponse: ChatResponse | any) => {
    const evalCount = chatResponse?.eval_count;
    const evalDuration = chatResponse?.eval_duration;
    
    const tokensPerSecond = ollamaService.calculateTokensPerSecond(
      evalCount,
      evalDuration
    );
    
    if (tokensPerSecond > 0) {
      const rounded = Math.round(tokensPerSecond * 100) / 100;
      setMetrics(prev => ({
        ...prev,
        tokensPerSecond: rounded,
      }));
    }
  }, []);

  /**
   * Fetch running processes and update metrics
   */
  const refreshMetrics = useCallback(async () => {
    try {
      const processes = await ollamaService.getRunningProcesses();
      const runningModels = processes.models || [];

      // Calculate total memory usage
      let totalMemory = 0;
      runningModels.forEach(model => {
        totalMemory += model.size || 0;
      });

      const memoryUsage = ollamaService.formatMemory(totalMemory);

      setMetrics(prev => ({
        ...prev,
        memoryUsage: totalMemory > 0 ? memoryUsage : '--',
        gpuUsage: runningModels.length > 0 ? 'Active' : '--',
        runningModels,
      }));
    } catch (error) {
      console.error('Error refreshing metrics:', error);
    }
  }, []);

  /**
   * Periodically refresh metrics when models are running
   */
  useEffect(() => {
    // Initial fetch
    refreshMetrics();

    // Poll every 2 seconds
    const interval = setInterval(() => {
      refreshMetrics();
    }, 2000);

    return () => clearInterval(interval);
  }, [refreshMetrics]);

  return {
    ...metrics,
    updateTokensPerSecond,
    refreshMetrics,
  };
}
