/**
 * Per-Chat Parameter Adjuster Component
 * 
 * Quick parameter adjustment panel for individual chats.
 * Shows below the model selector with sliders for quick tweaks.
 */

import { useState, useEffect } from 'react';
import { RotateCcw, ChevronDown, ChevronUp, Save } from 'lucide-react';
import type { ModelParameters } from '../types/parameters.types';
import { PARAMETER_RANGES } from '../types/parameters.types';
import './PerChatParameterAdjuster.css';

export interface PerChatParameterAdjusterProps {
  parameters: ModelParameters;
  hasOverrides: boolean;
  onSave: (parameters: ModelParameters) => void;
  onReset: () => void;
  isExpanded?: boolean;
}

export function PerChatParameterAdjuster({
  parameters,
  hasOverrides,
  onSave,
  onReset,
  isExpanded: defaultExpanded = false,
}: PerChatParameterAdjusterProps): JSX.Element {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [localParams, setLocalParams] = useState<ModelParameters>(parameters);
  const [isSaving, setIsSaving] = useState(false);

  // Sync local params when prop changes
  useEffect(() => {
    setLocalParams(parameters);
  }, [parameters]);

  const handleParameterChange = (
    param: keyof ModelParameters,
    value: number
  ): void => {
    setLocalParams((prev) => ({
      ...prev,
      [param]: value,
    }));
  };

  const handleSave = (): void => {
    setIsSaving(true);
    setTimeout(() => {
      onSave(localParams);
      setIsSaving(false);
    }, 300);
  };

  const handleReset = (): void => {
    onReset();
    setLocalParams(parameters);
  };

  return (
    <div className="per-chat-parameter-adjuster">
      {/* Header / Toggle */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="adjuster-header"
      >
        <div className="adjuster-header-content">
          <span className="adjuster-title">Quick Parameters</span>
          {hasOverrides && <span className="override-badge">Custom</span>}
        </div>
        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="adjuster-content">
          {/* Parameter Sliders */}
          <div className="parameters-grid">
            {Object.entries(PARAMETER_RANGES).map(([key, range]) => {
              const paramKey = key as keyof ModelParameters;
              const value = localParams[paramKey];

              return (
                <div key={key} className="parameter-item">
                  <div className="parameter-header">
                    <label className="parameter-label">
                      {range.label}
                    </label>
                    <span className="parameter-value">{parseFloat(value.toString()).toFixed(key === 'maxTokens' ? 0 : 2)}</span>
                  </div>
                  <input
                    type="range"
                    min={range.min}
                    max={range.max}
                    step={range.step}
                    value={value}
                    onChange={(e) =>
                      handleParameterChange(paramKey, parseFloat(e.target.value))
                    }
                    className="parameter-slider"
                  />
                  <p className="parameter-hint">{range.hint}</p>
                </div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="adjuster-actions">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="action-button save-button"
            >
              <Save size={16} />
              {isSaving ? 'Saving...' : 'Save for This Chat'}
            </button>
            <button
              onClick={handleReset}
              disabled={!hasOverrides}
              className="action-button reset-button"
              title={hasOverrides ? 'Reset to model defaults' : 'No custom parameters to reset'}
            >
              <RotateCcw size={16} />
              Reset to Defaults
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
