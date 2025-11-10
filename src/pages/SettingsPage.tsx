/**
 * Settings Page Component
 * 
 * Application settings including theme selection, model parameters,
 * API configuration, and user preferences.
 */

import { useState, useEffect } from 'react';
import { FolderOpen, Save } from 'lucide-react';
import { useToast } from '../components/ui/ToastProvider';
import './SettingsPage.css';

export interface SettingsPageProps {
  onThemeChange: (theme: string) => void;
}

interface Settings {
  theme: string;
  defaultModel: string;
  modelPath: string;
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
  defaultModel: '',
  modelPath: '',
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
  const [isSaving, setIsSaving] = useState(false);
  const toast = useToast();

  // Load settings from electron store on mount
  useEffect(() => {
    const loadSettings = async () => {
      if (window.electronAPI?.store) {
        const savedModelPath = await window.electronAPI.store.get('modelPath');
        if (savedModelPath) {
          setSettings(prev => ({ ...prev, modelPath: savedModelPath }));
        }
      }
    };
    loadSettings();
  }, []);

  const updateSetting = <K extends keyof Settings>(
    key: K,
    value: Settings[K]
  ): void => {
    setSettings((prev: Settings) => ({ ...prev, [key]: value }));
    
    // Handle special cases
    if (key === 'theme') {
      onThemeChange(value as string);
    }
    
    // Save model path to electron store
    if (key === 'modelPath' && window.electronAPI?.store) {
      window.electronAPI.store.set('modelPath', value);
    }
  };

  const handleSelectModelPath = async (): Promise<void> => {
    if (!window.electronAPI?.fileSystem) {
      toast.warning('Desktop App Required', 'File system access is only available in the desktop app.');
      return;
    }

    try {
      const result = await window.electronAPI.fileSystem.showOpenDialog({
        properties: ['openDirectory'],
        title: 'Select Ollama Models Directory',
        defaultPath: settings.modelPath || undefined,
      });

      if (!result.canceled && result.filePaths.length > 0) {
        updateSetting('modelPath', result.filePaths[0]);
        toast.success('Path Selected', 'Model path updated successfully');
      }
    } catch (error) {
      console.error('Error selecting model path:', error);
      toast.error('Selection Failed', 'Failed to open directory picker.');
    }
  };

  const handleSaveSettings = async (): Promise<void> => {
    if (!window.electronAPI?.ollama) {
      toast.warning('Desktop App Required', 'Settings save with Ollama restart is only available in the desktop app.');
      return;
    }

    setIsSaving(true);
    
    try {
      // Save model path to store
      if (window.electronAPI?.store && settings.modelPath) {
        await window.electronAPI.store.set('modelPath', settings.modelPath);
      }

      // Restart Ollama with new settings
      const result = await window.electronAPI.ollama.restart(settings.modelPath || undefined);
      
      if (result.success) {
        toast.success('Settings Saved!', 'Ollama has been restarted with the new model path.');
      } else {
        toast.warning('Partial Success', `Settings saved, but failed to restart Ollama:\n${result.error || 'Unknown error'}\n\nPlease restart Ollama manually.`);
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Save Failed', 'Failed to save settings and restart Ollama.');
    } finally {
      setIsSaving(false);
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
        <button
          onClick={handleSaveSettings}
          disabled={isSaving}
          className="setting-button"
          style={{
            position: 'absolute',
            top: '24px',
            right: '24px',
            padding: '10px 20px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: isSaving ? 'var(--border)' : 'var(--pink)',
            color: 'white',
            fontWeight: '600',
            fontSize: '14px',
            cursor: isSaving ? 'not-allowed' : 'pointer',
            border: 'none',
            borderRadius: '6px',
          }}
        >
          <Save size={16} />
          {isSaving ? 'Saving...' : 'Save & Restart Ollama'}
        </button>
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
                  Ollama Models Directory
                </label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="text"
                    value={settings.modelPath}
                    onChange={(e) => updateSetting('modelPath', e.target.value)}
                    className="setting-input"
                    placeholder="Default: %USERPROFILE%\.ollama\models (Windows) or ~/.ollama/models (Mac/Linux)"
                    style={{ flex: 1 }}
                  />
                  <button
                    onClick={handleSelectModelPath}
                    className="setting-button"
                    style={{
                      padding: '8px 16px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <FolderOpen size={16} />
                    Browse
                  </button>
                </div>
                <p className="setting-description">
                  Location where Ollama models are stored. Leave empty to use the default location.
                  <br />
                  <strong>Note:</strong> Click "Save & Restart Ollama" in the top right to apply changes.
                </p>
              </div>

              <div className="setting-group">
                <label className="setting-label">
                  Default Model
                  <select
                    value={settings.defaultModel}
                    onChange={(e) => updateSetting('defaultModel', e.target.value)}
                    className="setting-input"
                    disabled
                  >
                    <option value="">Coming soon...</option>
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