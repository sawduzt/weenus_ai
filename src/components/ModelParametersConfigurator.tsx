/**
 * Model Parameters Configurator Component
 * 
 * Per-model parameter configuration UI with save and reset functionality.
 */

import { useState, useEffect } from 'react';
import { Save, RotateCcw, AlertCircle } from 'lucide-react';
import { useOllama } from '../hooks/useOllama';
import { useModelParameters } from '../hooks/useModelParameters';
import { useToast } from '../components/ui/ToastProvider';
import { PARAMETER_RANGES } from '../types/parameters.types';
import './ModelParametersConfigurator.css';

export function ModelParametersConfigurator(): JSX.Element {
  const { models, currentModel, setCurrentModel, loadModels } = useOllama();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const toast = useToast();

  const { parameters, updateParameter, saveParameters, resetToDefaults, isSaving } =
    useModelParameters(currentModel || null);

  // Load models on mount
  useEffect(() => {
    loadModels();
  }, [loadModels]);

  const handleSaveParameters = async () => {
    const success = await saveParameters();
    if (success) {
      toast.success('Parameters Saved', `Settings saved for ${currentModel}`);
    } else {
      toast.error('Save Failed', 'Failed to save parameters');
    }
  };

  const handleResetConfirm = async () => {
    setShowResetConfirm(false);
    const success = await resetToDefaults();
    if (success) {
      toast.success('Reset to Defaults', `Parameters reset for ${currentModel}`);
    } else {
      toast.error('Reset Failed', 'Failed to reset parameters');
    }
  };

  return (
    <div className="parameters-configurator">
      {/* Model Selector Section */}
      <div className="configurator-header">
        <div className="model-selector-section">
          <label className="selector-label">Select Model</label>
          <div className="model-selector-wrapper-params">
            <select
              value={currentModel || ''}
              onChange={(e) => setCurrentModel(e.target.value)}
              className="model-selector-params"
              disabled={models.length === 0}
            >
              <option value="">Choose a model...</option>
              {models.map(model => (
                <option key={model.name} value={model.name}>
                  {model.name}
                </option>
              ))}
            </select>
          </div>
          {models.length === 0 && (
            <p className="no-models-hint">No models available. Install models in Ollama first.</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="configurator-actions">
          <button
            onClick={handleSaveParameters}
            disabled={!currentModel || isSaving}
            className="action-button save-button"
            title="Save parameters for this model"
          >
            <Save size={18} />
            <span>{isSaving ? 'Saving...' : 'Save'}</span>
          </button>

          <button
            onClick={() => setShowResetConfirm(true)}
            disabled={!currentModel || isSaving}
            className="action-button reset-button"
            title="Reset to Ollama defaults"
          >
            <RotateCcw size={18} />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Reset Confirmation Dialog */}
      {showResetConfirm && (
        <div className="confirmation-overlay">
          <div className="confirmation-dialog">
            <div className="confirmation-header">
              <AlertCircle size={24} className="warning-icon" />
              <h3>Reset to Defaults?</h3>
            </div>
            <p className="confirmation-message">
              This will reset all parameters for <strong>{currentModel}</strong> back to Ollama's default values.
              This action cannot be undone.
            </p>
            <div className="confirmation-actions">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="confirmation-button cancel"
              >
                Cancel
              </button>
              <button
                onClick={handleResetConfirm}
                className="confirmation-button confirm"
              >
                Reset to Defaults
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Parameters Grid */}
      {currentModel && (
        <div className="parameters-grid">
          {Object.entries(PARAMETER_RANGES).map(([key, config]) => {
            const paramKey = key as keyof typeof parameters;
            const value = parameters[paramKey];

            return (
              <div key={key} className="parameter-card">
                <div className="parameter-header">
                  <label className="parameter-label">{config.label}</label>
                  <span className="parameter-value">{typeof value === 'number' ? value.toFixed(2) : value}</span>
                </div>

                <input
                  type="range"
                  min={config.min}
                  max={config.max}
                  step={config.step}
                  value={value}
                  onChange={(e) => {
                    const numValue = key === 'maxTokens' || key === 'topK'
                      ? parseInt(e.target.value)
                      : parseFloat(e.target.value);
                    updateParameter(paramKey, numValue as any);
                  }}
                  className="parameter-slider"
                  disabled={!currentModel}
                />

                <p className="parameter-hint">{config.hint}</p>
              </div>
            );
          })}
        </div>
      )}

      {!currentModel && (
        <div className="empty-state">
          <AlertCircle size={48} className="empty-icon" />
          <h3>Select a Model</h3>
          <p>Choose a model from the dropdown above to configure its parameters</p>
        </div>
      )}
    </div>
  );
}
