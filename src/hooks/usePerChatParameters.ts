/**
 * usePerChatParameters Hook
 * 
 * Manages parameter overrides for individual chats.
 * Falls back to model defaults from Settings when no override exists.
 */

import { useState, useEffect, useCallback } from 'react';
import { chatParametersService } from '../services/chatParameters';
import { modelParametersService } from '../services/modelParameters';
import type { ModelParameters, ChatParameterOverride } from '../types/parameters.types';
import { DEFAULT_PARAMETERS } from '../types/parameters.types';

export function usePerChatParameters(chatId: string | null, currentModel: string | null) {
  const [chatParameterOverrides, setChatParameterOverrides] = useState<ChatParameterOverride | null>(null);
  const [effectiveParameters, setEffectiveParameters] = useState<ModelParameters>(DEFAULT_PARAMETERS);
  const [hasOverrides, setHasOverrides] = useState(false);

  // Load parameter overrides when chat changes
  useEffect(() => {
    if (!chatId) {
      setChatParameterOverrides(null);
      setHasOverrides(false);
      setEffectiveParameters(DEFAULT_PARAMETERS);
      return;
    }

    const loadParameters = async () => {
      const overrides = chatParametersService.getChatParameters(chatId);

      if (overrides) {
        const { lastModified, ...params } = overrides;
        setEffectiveParameters(params as ModelParameters);
        setChatParameterOverrides(overrides);
        setHasOverrides(true);
      } else if (currentModel) {
        // Load model defaults from Settings
        const modelParams = await modelParametersService.getModelParameters(currentModel);
        setEffectiveParameters(modelParams || DEFAULT_PARAMETERS);
        setChatParameterOverrides(null);
        setHasOverrides(false);
      } else {
        setEffectiveParameters(DEFAULT_PARAMETERS);
        setChatParameterOverrides(null);
        setHasOverrides(false);
      }
    };

    loadParameters();
  }, [chatId, currentModel]);

  // Save chat parameter overrides
  const saveChatParameters = useCallback((parameters: ModelParameters) => {
    if (!chatId) {
      console.warn('Cannot save parameters: no active chat');
      return;
    }

    chatParametersService.setChatParameters(chatId, parameters);
    setChatParameterOverrides({
      ...parameters,
      lastModified: Date.now(),
    });
    setEffectiveParameters(parameters);
    setHasOverrides(true);
  }, [chatId]);

  // Reset to model defaults
  const resetToModelDefaults = useCallback(async () => {
    if (!chatId) {
      console.warn('Cannot reset parameters: no active chat');
      return;
    }

    chatParametersService.clearChatParameters(chatId);
    setChatParameterOverrides(null);
    setHasOverrides(false);

    // Load model defaults
    if (currentModel) {
      const modelParams = await modelParametersService.getModelParameters(currentModel);
      setEffectiveParameters(modelParams || DEFAULT_PARAMETERS);
    } else {
      setEffectiveParameters(DEFAULT_PARAMETERS);
    }
  }, [chatId, currentModel]);

  return {
    effectiveParameters,
    chatParameterOverrides,
    hasOverrides,
    saveChatParameters,
    resetToModelDefaults,
  };
}
