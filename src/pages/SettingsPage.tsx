/**
 * Settings Page Component
 * 
 * Application settings including theme selection, model parameters,
 * API configuration, and user preferences.
 */

import React, { useState } from 'react';
import './SettingsPage.css';

export interface SettingsPageProps {
  onThemeChange: (theme: string) => void;
}

interface Settings {
  theme: string;
  ollamaUrl: string;
  defaultModel: string;
  autoSave: boolean;
  streamResponses: boolean;
  maxTokens: number;
  temperature: number;
  topP: number;
  topK: number;
  repeatPenalty: number;
}

const defaultSettings: Settings = {
  theme: 'dark',
  ollamaUrl: 'http://localhost:11434',
  defaultModel: '',
  autoSave: true,
  streamResponses: true,
  maxTokens: 2048,
  temperature: 0.7,
  topP: 0.9,
  topK: 40,
  repeatPenalty: 1.1,
};

export function SettingsPage({ onThemeChange }: SettingsPageProps): JSX.Element {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [activeTab, setActiveTab] = useState<string>('general');

  const updateSetting = <K extends keyof Settings>(
    key: K,
    value: Settings[K]
  ): void => {
    setSettings((prev: Settings) => ({ ...prev, [key]: value }));
    
    // Handle special cases
    if (key === 'theme') {
      onThemeChange(value as string);
    }
  };

  const resetToDefaults = (): void => {
    setSettings(defaultSettings);
    onThemeChange(defaultSettings.theme);
  };

  const exportSettings = (): void => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'weenus-settings.json';
    link.click();
    
    URL.revokeObjectURL(url);
  };

  const tabs = [
    { id: 'general', label: 'General', icon: '⚙️' },
    { id: 'models', label: 'Models', icon: '🤖' },
    { id: 'parameters', label: 'Parameters', icon: '🎛️' },
    { id: 'advanced', label: 'Advanced', icon: '🔧' },
  ];

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1>Settings</h1>
        <p>Configure your Weenus AI experience</p>
      </div>

      <div className="settings-content">
        {/* Settings Tabs */}
        <div className="settings-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Settings Panels */}
        <div className="settings-panels">
          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="settings-panel">
              <h2>General Settings</h2>
              
              <div className="setting-group">
                <label className="setting-label">
                  Theme
                  <select
                    value={settings.theme}
                    onChange={(e) => updateSetting('theme', e.target.value)}
                    className="setting-input"
                  >
                    <option value="dark">Dark</option>
                    <option value="light">Light</option>
                  </select>
                </label>
                <p className="setting-description">
                  Choose your preferred application theme
                </p>
              </div>

              <div className="setting-group">
                <label className="setting-label">
                  <input
                    type="checkbox"
                    checked={settings.autoSave}
                    onChange={(e) => updateSetting('autoSave', e.target.checked)}
                    className="setting-checkbox"
                  />
                  Auto-save conversations
                </label>
                <p className="setting-description">
                  Automatically save chat history and settings
                </p>
              </div>

              <div className="setting-group">
                <label className="setting-label">
                  <input
                    type="checkbox"
                    checked={settings.streamResponses}
                    onChange={(e) => updateSetting('streamResponses', e.target.checked)}
                    className="setting-checkbox"
                  />
                  Stream responses
                </label>
                <p className="setting-description">
                  Show AI responses in real-time as they're generated
                </p>
              </div>
            </div>
          )}

          {/* Model Settings */}
          {activeTab === 'models' && (
            <div className="settings-panel">
              <h2>Model Settings</h2>
              
              <div className="setting-group">
                <label className="setting-label">
                  Ollama API URL
                  <input
                    type="url"
                    value={settings.ollamaUrl}
                    onChange={(e) => updateSetting('ollamaUrl', e.target.value)}
                    className="setting-input"
                    placeholder="http://localhost:11434"
                  />
                </label>
                <p className="setting-description">
                  URL for your Ollama API server
                </p>
              </div>

              <div className="setting-group">
                <label className="setting-label">
                  Default Model
                  <select
                    value={settings.defaultModel}
                    onChange={(e) => updateSetting('defaultModel', e.target.value)}
                    className="setting-input"
                  >
                    <option value="">Select default model...</option>
                    <option value="llama2">Llama 2</option>
                    <option value="codellama">Code Llama</option>
                    <option value="mistral">Mistral</option>
                  </select>
                </label>
                <p className="setting-description">
                  Model to use by default for new conversations
                </p>
              </div>
            </div>
          )}

          {/* Parameter Settings */}
          {activeTab === 'parameters' && (
            <div className="settings-panel">
              <h2>Model Parameters</h2>
              
              <div className="setting-group">
                <label className="setting-label">
                  Max Tokens: {settings.maxTokens}
                  <input
                    type="range"
                    min="100"
                    max="8192"
                    step="100"
                    value={settings.maxTokens}
                    onChange={(e) => updateSetting('maxTokens', parseInt(e.target.value))}
                    className="setting-slider"
                  />
                </label>
                <p className="setting-description">
                  Maximum number of tokens to generate
                </p>
              </div>

              <div className="setting-group">
                <label className="setting-label">
                  Temperature: {settings.temperature}
                  <input
                    type="range"
                    min="0"
                    max="2"
                    step="0.1"
                    value={settings.temperature}
                    onChange={(e) => updateSetting('temperature', parseFloat(e.target.value))}
                    className="setting-slider"
                  />
                </label>
                <p className="setting-description">
                  Controls randomness in responses (0.0 = deterministic, 2.0 = very creative)
                </p>
              </div>

              <div className="setting-group">
                <label className="setting-label">
                  Top P: {settings.topP}
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={settings.topP}
                    onChange={(e) => updateSetting('topP', parseFloat(e.target.value))}
                    className="setting-slider"
                  />
                </label>
                <p className="setting-description">
                  Nucleus sampling parameter (lower = more focused)
                </p>
              </div>

              <div className="setting-group">
                <label className="setting-label">
                  Top K: {settings.topK}
                  <input
                    type="range"
                    min="1"
                    max="100"
                    step="1"
                    value={settings.topK}
                    onChange={(e) => updateSetting('topK', parseInt(e.target.value))}
                    className="setting-slider"
                  />
                </label>
                <p className="setting-description">
                  Limits token selection to top K choices
                </p>
              </div>

              <div className="setting-group">
                <label className="setting-label">
                  Repeat Penalty: {settings.repeatPenalty}
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={settings.repeatPenalty}
                    onChange={(e) => updateSetting('repeatPenalty', parseFloat(e.target.value))}
                    className="setting-slider"
                  />
                </label>
                <p className="setting-description">
                  Penalty for repeating tokens (1.0 = no penalty)
                </p>
              </div>
            </div>
          )}

          {/* Advanced Settings */}
          {activeTab === 'advanced' && (
            <div className="settings-panel">
              <h2>Advanced Settings</h2>
              
              <div className="setting-group">
                <h3>Data Management</h3>
                <div className="button-group">
                  <button onClick={exportSettings} className="setting-button">
                    📁 Export Settings
                  </button>
                  <button className="setting-button">
                    📂 Import Settings
                  </button>
                  <button onClick={resetToDefaults} className="setting-button danger">
                    🔄 Reset to Defaults
                  </button>
                </div>
              </div>

              <div className="setting-group">
                <h3>Performance</h3>
                <p className="setting-description">
                  Performance settings will be available in future updates.
                </p>
              </div>

              <div className="setting-group">
                <h3>Debug</h3>
                <p className="setting-description">
                  Debug options will be available in future updates.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}