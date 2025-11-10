/**
 * Custom Toggle Switch Component
 * 
 * A beautiful, animated toggle switch that matches the app's pink theme.
 * Replaces basic checkboxes with professional toggle switches.
 */

import React from 'react';
import './ToggleSwitch.css';

export interface ToggleSwitchProps {
  /** Current toggle state */
  checked: boolean;
  /** Callback when toggle state changes */
  onChange: (checked: boolean) => void;
  /** Optional label for the toggle */
  label?: string;
  /** Optional description text */
  description?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Size variant */
  size?: 'small' | 'medium' | 'large';
  /** Custom className */
  className?: string;
  /** Unique identifier */
  id?: string;
}

export function ToggleSwitch({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  size = 'medium',
  className = '',
  id
}: ToggleSwitchProps): JSX.Element {
  const toggleId = id || `toggle-${Math.random().toString(36).substr(2, 9)}`;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!disabled) {
      onChange(event.target.checked);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if ((event.key === 'Enter' || event.key === ' ') && !disabled) {
      event.preventDefault();
      onChange(!checked);
    }
  };

  return (
    <div className={`toggle-switch-container ${size} ${className}`}>
      <div className="toggle-switch-wrapper">
        <input
          type="checkbox"
          id={toggleId}
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          className="toggle-switch-input"
          aria-describedby={description ? `${toggleId}-desc` : undefined}
        />
        <label
          htmlFor={toggleId}
          className={`toggle-switch ${checked ? 'checked' : ''} ${disabled ? 'disabled' : ''}`}
          onKeyDown={handleKeyDown}
          tabIndex={disabled ? -1 : 0}
          role="switch"
          aria-checked={checked}
          aria-disabled={disabled}
        >
          <span className="toggle-switch-slider">
            <span className="toggle-switch-knob"></span>
          </span>
        </label>
        {label && (
          <label htmlFor={toggleId} className="toggle-switch-label">
            {label}
          </label>
        )}
      </div>
      {description && (
        <p id={`${toggleId}-desc`} className="toggle-switch-description">
          {description}
        </p>
      )}
    </div>
  );
}