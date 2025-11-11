/**
 * Per-Chat Parameter Adjuster Component
 * 
 * Quick parameter adjustment panel for individual chats.
 * Shows above the message bar with dropdown parameter selection.
 */

import { useState, useEffect } from 'react';
import { RotateCcw, Save } from 'lucide-react';
import type { ModelParameters } from '../types/parameters.types';
import { PARAMETER_RANGES } from '../types/parameters.types';
import './PerChatParameterAdjuster.css';

export interface PerChatParameterAdjusterProps {
  parameters: ModelParameters;
  hasOverrides: boolean;
  onSave: (parameters: ModelParameters) => Promise<void>;
  onReset: () => Promise<void>;
  isExpanded?: boolean;
}

type ParameterKey = keyof ModelParameters;

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
  const [selectedParam, setSelectedParam] = useState<ParameterKey>('temperature');
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Sync local params when prop changes
  useEffect(() => {
    setLocalParams(parameters);
  }, [parameters]);

  const handleParameterChange = (value: number): void => {
    setLocalParams((prev) => ({
      ...prev,
      [selectedParam]: value,
    }));
  };

  const handleSave = async (): Promise<void> => {
    setIsSaving(true);
    try {
      await onSave(localParams);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async (): Promise<void> => {
    await onReset();
    setShowResetConfirm(false);
  };

  const handleResetClick = (): void => {
    if (!hasOverrides) return;
    setShowResetConfirm(true);
  };

  const paramRange = PARAMETER_RANGES[selectedParam];
  const currentValue = localParams[selectedParam];

  return (
    <div className="per-chat-parameter-adjuster">
      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="param-toggle-button"
      >
        <span>Quick Parameters</span>
        {hasOverrides ? (
          <span className="param-badge">Custom</span>
        ) : (
          <span className="param-badge default-badge">Default</span>
        )}
      </button>

      {/* Compact Panel */}
      {isExpanded && (
        <div className="param-panel">
          {/* Parameter Selector */}
          <select
            value={selectedParam}
            onChange={(e) => setSelectedParam(e.target.value as ParameterKey)}
            className="param-selector"
          >
            <option value="temperature">Temperature</option>
            <option value="topP">Top-P</option>
            <option value="topK">Top-K</option>
            <option value="repeatPenalty">Repeat Penalty</option>
            <option value="maxTokens">Max Tokens</option>
          </select>

          {/* Value Display */}
          <div className="param-value-display">
            {parseFloat(currentValue.toString()).toFixed(selectedParam === 'topK' || selectedParam === 'maxTokens' ? 0 : 2)}
          </div>

          {/* Slider */}
          <input
            type="range"
            min={paramRange.min}
            max={paramRange.max}
            step={paramRange.step}
            value={currentValue}
            onChange={(e) => handleParameterChange(parseFloat(e.target.value))}
            className="param-slider"
          />

          {/* Action Buttons */}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="param-action-button save-btn"
            title="Save for this chat"
          >
            <Save size={12} />
            {isSaving ? 'Saving...' : 'Save'}
          </button>

          <button
            onClick={handleResetClick}
            disabled={!hasOverrides}
            className="param-action-button reset-btn"
            title="Reset to defaults"
          >
            <RotateCcw size={12} />
            Reset
          </button>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="reset-confirm-overlay" onClick={() => setShowResetConfirm(false)}>
          <div className="reset-confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <p>Reset this chat's parameters to model defaults?</p>
            <div className="reset-confirm-buttons">
              <button onClick={handleReset} className="confirm-yes">Yes, Reset</button>
              <button onClick={() => setShowResetConfirm(false)} className="confirm-no">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
