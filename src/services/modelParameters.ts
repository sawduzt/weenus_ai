/**
 * Model Parameters Service
 * 
 * Handles persistent storage and management of per-model parameter presets.
 */

import type { ModelParameters, SavedModelPreset } from '../types/parameters.types';
import { DEFAULT_PARAMETERS } from '../types/parameters.types';

const STORAGE_KEY = 'modelParameters';

class ModelParametersService {
  /**
   * Get parameters for a specific model
   */
  async getModelParameters(modelName: string): Promise<ModelParameters> {
    try {
      if (window.electronAPI?.store) {
        const storage = await window.electronAPI.store.get(STORAGE_KEY);
        if (storage && storage[modelName]) {
          return storage[modelName];
        }
      }
      return { ...DEFAULT_PARAMETERS };
    } catch (error) {
      console.error('Error getting model parameters:', error);
      return { ...DEFAULT_PARAMETERS };
    }
  }

  /**
   * Save parameters for a specific model
   */
  async saveModelParameters(modelName: string, parameters: ModelParameters): Promise<void> {
    try {
      if (!window.electronAPI?.store) {
        throw new Error('Store not available');
      }

      const storage = (await window.electronAPI.store.get(STORAGE_KEY)) || {};
      storage[modelName] = parameters;
      await window.electronAPI.store.set(STORAGE_KEY, storage);
    } catch (error) {
      console.error('Error saving model parameters:', error);
      throw error;
    }
  }

  /**
   * Reset parameters for a model to defaults
   */
  async resetModelParameters(modelName: string): Promise<void> {
    try {
      if (!window.electronAPI?.store) {
        throw new Error('Store not available');
      }

      const storage = (await window.electronAPI.store.get(STORAGE_KEY)) || {};
      delete storage[modelName];
      await window.electronAPI.store.set(STORAGE_KEY, storage);
    } catch (error) {
      console.error('Error resetting model parameters:', error);
      throw error;
    }
  }

  /**
   * Get all saved model presets
   */
  async getAllPresets(): Promise<SavedModelPreset[]> {
    try {
      if (!window.electronAPI?.store) {
        return [];
      }

      const storage = (await window.electronAPI.store.get(STORAGE_KEY)) || {};
      return Object.entries(storage).map(([modelName, parameters]) => ({
        modelName,
        parameters: parameters as ModelParameters,
        savedAt: new Date(),
      }));
    } catch (error) {
      console.error('Error getting all presets:', error);
      return [];
    }
  }

  /**
   * Delete all parameters for a model
   */
  async deleteModelParameters(modelName: string): Promise<void> {
    try {
      if (!window.electronAPI?.store) {
        throw new Error('Store not available');
      }

      const storage = (await window.electronAPI.store.get(STORAGE_KEY)) || {};
      delete storage[modelName];
      await window.electronAPI.store.set(STORAGE_KEY, storage);
    } catch (error) {
      console.error('Error deleting model parameters:', error);
      throw error;
    }
  }
}

export const modelParametersService = new ModelParametersService();
