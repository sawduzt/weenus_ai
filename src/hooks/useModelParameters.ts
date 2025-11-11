/**
 * useModelParameters Hook
 * 
 * Custom hook for managing per-model parameter presets and state.
 */

import { useState, useCallback, useEffect } from 'react';
import type { ModelParameters } from '../types/parameters.types';
import { DEFAULT_PARAMETERS } from '../types/parameters.types';
import { modelParametersService } from '../services/modelParameters';

export function useModelParameters(selectedModel: string | null) {
  const [parameters, setParameters] = useState<ModelParameters>({ ...DEFAULT_PARAMETERS });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load parameters for selected model
  useEffect(() => {
    if (!selectedModel) {
      setParameters({ ...DEFAULT_PARAMETERS });
      return;
    }

    const loadParameters = async () => {
      setIsLoading(true);
      try {
        const params = await modelParametersService.getModelParameters(selectedModel);
        setParameters(params);
      } catch (error) {
        console.error('Error loading parameters:', error);
        setParameters({ ...DEFAULT_PARAMETERS });
      } finally {
        setIsLoading(false);
      }
    };

    loadParameters();
  }, [selectedModel]);

  // Update a single parameter
  const updateParameter = useCallback(
    <K extends keyof ModelParameters>(key: K, value: ModelParameters[K]) => {
      setParameters(prev => ({
        ...prev,
        [key]: value,
      }));
    },
    []
  );

  // Save all parameters for current model
  const saveParameters = useCallback(async () => {
    if (!selectedModel) return;

    setIsSaving(true);
    try {
      await modelParametersService.saveModelParameters(selectedModel, parameters);
      return true;
    } catch (error) {
      console.error('Error saving parameters:', error);
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [selectedModel, parameters]);

  // Reset to defaults for current model
  const resetToDefaults = useCallback(async () => {
    if (!selectedModel) return;

    setIsSaving(true);
    try {
      await modelParametersService.resetModelParameters(selectedModel);
      setParameters({ ...DEFAULT_PARAMETERS });
      return true;
    } catch (error) {
      console.error('Error resetting parameters:', error);
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [selectedModel]);

  return {
    parameters,
    updateParameter,
    saveParameters,
    resetToDefaults,
    isLoading,
    isSaving,
  };
}
