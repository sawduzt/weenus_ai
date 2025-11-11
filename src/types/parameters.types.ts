/**
 * Model Parameters Types
 * 
 * Type definitions for per-model parameter configuration and storage.
 */

export interface ModelParameters {
  temperature: number;
  topP: number;
  topK: number;
  repeatPenalty: number;
  maxTokens: number;
}

export interface SavedModelPreset {
  modelName: string;
  parameters: ModelParameters;
  savedAt: Date;
  description?: string;
}

export interface ModelParametersStorage {
  presets: { [modelName: string]: ModelParameters };
}

export const DEFAULT_PARAMETERS: ModelParameters = {
  temperature: 0.7,
  topP: 0.9,
  topK: 40,
  repeatPenalty: 1.1,
  maxTokens: 2048,
};

export const PARAMETER_RANGES = {
  temperature: { min: 0, max: 2, step: 0.1, label: 'Temperature', hint: 'Controls randomness (0=deterministic, 2=creative)' },
  topP: { min: 0, max: 1, step: 0.05, label: 'Top P', hint: 'Nucleus sampling (lower=focused, higher=diverse)' },
  topK: { min: 1, max: 100, step: 1, label: 'Top K', hint: 'Limits to top K tokens (lower=focused)' },
  repeatPenalty: { min: 0.5, max: 2, step: 0.1, label: 'Repeat Penalty', hint: 'Penalizes repetition (1.0=no penalty)' },
  maxTokens: { min: 100, max: 8192, step: 100, label: 'Max Tokens', hint: 'Maximum response length in tokens' },
};
