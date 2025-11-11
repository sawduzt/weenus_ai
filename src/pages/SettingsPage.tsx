/**
 * Settings Page Component
 * 
 * Application settings including theme selection, model parameters,
 * API configuration, and user preferences.
 */

import { useState, useEffect } from 'react';
import { FolderOpen, Save, Settings as SettingsIcon, Bot, Sliders, Wrench, Download, Upload, RotateCcw, HelpCircle } from 'lucide-react';
import { useToast } from '../components/ui/ToastProvider';
import { ToggleSwitch } from '../components/ui/ToggleSwitch';
import { ModelParametersConfigurator } from '../components/ModelParametersConfigurator';
import './SettingsPage.css';

export interface SettingsPageProps {
  onThemeChange: (theme: string) => void;
  onHardwareAccelerationChange: (enabled: boolean) => void;
  onShowOnboarding?: () => void;
}

interface Settings {
  theme: string;
  defaultModel: string;
  modelPath: string;
  autoSave: boolean;
  streamResponses: boolean;
  hardwareAcceleration: boolean;
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
  hardwareAcceleration: true,
  maxTokens: 2048,
  temperature: 0.7,
  topP: 0.9,
  topK: 40,
  repeatPenalty: 1.1,
};

export function SettingsPage({ onThemeChange, onHardwareAccelerationChange, onShowOnboarding }: SettingsPageProps): JSX.Element {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [activeTab, setActiveTab] = useState<string>('general');
  const [isSaving, setIsSaving] = useState(false);
  const [showRestartPrompt, setShowRestartPrompt] = useState(false);
  const [prevModelPath, setPrevModelPath] = useState<string>('');
  const toast = useToast();

  // Load settings from electron store on mount
  useEffect(() => {
    const loadSettings = async () => {
      if (window.electronAPI?.store) {
        const savedModelPath = await window.electronAPI.store.get('modelPath');
        if (savedModelPath) {
          setSettings(prev => ({ ...prev, modelPath: savedModelPath }));
          setPrevModelPath(savedModelPath);
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
    
    if (key === 'hardwareAcceleration') {
      onHardwareAccelerationChange(value as boolean);
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
    if (!window.electronAPI?.store) {
      toast.warning('Desktop App Required', 'Settings save is only available in the desktop app.');
      return;
    }

    setIsSaving(true);
    
    try {
      // Save all settings to store
      await window.electronAPI.store.set('modelPath', settings.modelPath);

      toast.success('Settings Saved!', 'Your settings have been saved successfully.');

      // Check if model path changed - if so, ask to restart Ollama
      if (settings.modelPath !== prevModelPath) {
        setShowRestartPrompt(true);
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Save Failed', 'Failed to save settings.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRestartOllama = async (): Promise<void> => {
    if (!window.electronAPI?.ollama) {
      toast.warning('Desktop App Required', 'Ollama control is only available in the desktop app.');
      return;
    }

    setIsSaving(true);
    
    try {
      const result = await window.electronAPI.ollama.restart(settings.modelPath || undefined);
      
      if (result.success) {
        toast.success('Ollama Restarted!', 'Ollama has been restarted with the new model path.');
        setPrevModelPath(settings.modelPath);
      } else {
        toast.warning('Restart Failed', `Failed to restart Ollama:\n${result.error || 'Unknown error'}\n\nPlease restart Ollama manually.`);
      }
    } catch (error) {
      console.error('Error restarting Ollama:', error);
      toast.error('Restart Failed', 'Failed to restart Ollama.');
    } finally {
      setShowRestartPrompt(false);
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
    { id: 'general', label: 'General', icon: <SettingsIcon size={16} /> },
    { id: 'models', label: 'Models', icon: <Bot size={16} /> },
    { id: 'parameters', label: 'Parameters', icon: <Sliders size={16} /> },
    { id: 'advanced', label: 'Advanced', icon: <Wrench size={16} /> },
  ];

  return (
    <div className="settings-page">
      <div className="settings-header" style={{ padding: '8px 2px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
        <div style={{ flex: 1, paddingLeft: '10px' }}>
          <h1 
            style={{ 
              fontSize: '18px', 
              margin: '0', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              fontWeight: '600',
            }}
          >
            <SettingsIcon size={20} />
            Settings
          </h1>
        </div>
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
          
          {/* Save Button at Bottom */}
          <button
            onClick={handleSaveSettings}
            disabled={isSaving}
            className="settings-save-button"
          >
            <Save size={18} />
            <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
          </button>
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
                <ToggleSwitch
                  checked={settings.autoSave}
                  onChange={(checked) => updateSetting('autoSave', checked)}
                  label="Auto-save conversations"
                  description="Automatically save chat history and settings"
                />
              </div>

              <div className="setting-group">
                <ToggleSwitch
                  checked={settings.streamResponses}
                  onChange={(checked) => updateSetting('streamResponses', checked)}
                  label="Stream responses"
                  description="Show AI responses in real-time as they're generated"
                />
              </div>

              <div className="setting-group">
                <ToggleSwitch
                  checked={settings.hardwareAcceleration}
                  onChange={(checked) => updateSetting('hardwareAcceleration', checked)}
                  label="Hardware Acceleration"
                  description="Enable GPU acceleration for smoother animations and effects (recommended)"
                />
              </div>

              <div className="setting-group">
                <button
                  onClick={() => onShowOnboarding?.()}
                  style={{
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.1), rgba(236, 72, 153, 0.05))',
                    border: '1px solid rgba(236, 72, 153, 0.3)',
                    borderRadius: '6px',
                    color: 'var(--color-text-primary)',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'all 0.2s ease',
                    width: '100%',
                    justifyContent: 'center',
                  }}
                  onMouseOver={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = 'linear-gradient(135deg, rgba(236, 72, 153, 0.15), rgba(236, 72, 153, 0.1))';
                    (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(236, 72, 153, 0.5)';
                  }}
                  onMouseOut={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = 'linear-gradient(135deg, rgba(236, 72, 153, 0.1), rgba(236, 72, 153, 0.05))';
                    (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(236, 72, 153, 0.3)';
                  }}
                >
                  <HelpCircle size={16} />
                  Replay Getting Started Tour
                </button>
                <p className="setting-description">
                  Watch the interactive walkthrough again to learn how to use Weenus AI
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
            <div className="settings-panel parameters-panel-wrapper">
              <ModelParametersConfigurator />
            </div>
          )}

          {/* Advanced Settings */}
          {activeTab === 'advanced' && (
            <div className="settings-panel">
              <h2>Advanced Settings</h2>
              
              <div className="setting-group">
                <h3>Data Management</h3>
                <div className="button-group">
                  <button onClick={exportSettings} className="setting-button" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Download size={16} /> Export Settings
                  </button>
                  <button className="setting-button" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Upload size={16} /> Import Settings
                  </button>
                  <button onClick={resetToDefaults} className="setting-button danger" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <RotateCcw size={16} /> Reset to Defaults
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

      {/* Restart Ollama Prompt */}
      {showRestartPrompt && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            padding: '24px',
            maxWidth: '400px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          }}>
            <h3 style={{ margin: '0 0 12px 0', color: 'var(--text-primary)' }}>
              Restart Ollama?
            </h3>
            <p style={{ margin: '0 0 24px 0', color: 'var(--text-secondary)', fontSize: '14px' }}>
              Model path has changed. Ollama needs to be restarted to use the new path. Would you like to restart it now?
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowRestartPrompt(false)}
                disabled={isSaving}
                style={{
                  padding: '8px 16px',
                  background: 'var(--border)',
                  color: 'var(--text-primary)',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: isSaving ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                }}
              >
                Skip
              </button>
              <button
                onClick={handleRestartOllama}
                disabled={isSaving}
                style={{
                  padding: '8px 16px',
                  background: 'var(--pink)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: isSaving ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                }}
              >
                {isSaving ? 'Restarting...' : 'Restart Now'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}