/**
 * Model Library Page Component
 * 
 * Manage AI models including downloading, viewing information,
 * and configuring model-specific settings.
 */

import React, { useEffect, useState } from 'react';
import { useOllama } from '../hooks/useOllama';
import { OllamaModel } from '../services/ollama';
import './ModelLibraryPage.css';

export function ModelLibraryPage(): JSX.Element {
  const {
    models,
    isLoadingModels,
    modelsError,
    isConnected,
    loadModels,
    pullModel,
    deleteModel,
    isLoading,
    error,
  } = useOllama();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModel, setSelectedModel] = useState<OllamaModel | null>(null);
  const [availableModels] = useState([
    { name: 'llama2', description: 'Meta\'s Llama 2 model for general conversation' },
    { name: 'codellama', description: 'Code-focused version of Llama 2' },
    { name: 'mistral', description: 'Mistral 7B model for various tasks' },
    { name: 'neural-chat', description: 'Intel\'s neural chat model' },
    { name: 'starcode', description: 'Code generation model by BigCode' },
    { name: 'vicuna', description: 'Vicuna model fine-tuned from Llama' },
  ]);

  useEffect(() => {
    if (isConnected) {
      loadModels();
    }
  }, [isConnected, loadModels]);

  const filteredModels = models.filter(model =>
    model.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatFileSize = (bytes: number): string => {
    const gb = bytes / (1024 * 1024 * 1024);
    return `${gb.toFixed(2)} GB`;
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString();
  };

  const handlePullModel = async (modelName: string): Promise<void> => {
    try {
      await pullModel(modelName);
    } catch (err) {
      console.error('Failed to pull model:', err);
    }
  };

  const handleDeleteModel = async (modelName: string): Promise<void> => {
    if (window.confirm(`Are you sure you want to delete ${modelName}?`)) {
      try {
        await deleteModel(modelName);
      } catch (err) {
        console.error('Failed to delete model:', err);
      }
    }
  };

  if (!isConnected) {
    return (
      <div className="model-library-page">
        <div className="connection-error">
          <div className="error-icon">🔌</div>
          <h2>Not Connected to Ollama</h2>
          <p>Please connect to Ollama to manage models</p>
        </div>
      </div>
    );
  }

  return (
    <div className="model-library-page">
      <div className="library-header">
        <h1>Model Library</h1>
        <p>Manage your AI models</p>
      </div>

      <div className="library-content">
        {/* Search and Filters */}
        <div className="library-controls">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search models..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>
          
          <div className="library-stats">
            <span className="stat">
              {models.length} models installed
            </span>
            <span className="stat">
              {models.reduce((total, model) => total + model.size, 0) / (1024 * 1024 * 1024).toFixed(1)} GB total
            </span>
          </div>
        </div>

        {/* Error Display */}
        {(modelsError || error) && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {modelsError || error}
          </div>
        )}

        {/* Models Grid */}
        <div className="models-grid">
          {/* Installed Models */}
          <div className="models-section">
            <h2>Installed Models</h2>
            
            {isLoadingModels ? (
              <div className="loading-state">
                <div className="loading-spinner"></div>
                <p>Loading models...</p>
              </div>
            ) : filteredModels.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📦</div>
                <h3>No models found</h3>
                <p>
                  {searchTerm 
                    ? 'No models match your search criteria'
                    : 'No models are currently installed'
                  }
                </p>
              </div>
            ) : (
              <div className="models-list">
                {filteredModels.map((model) => (
                  <div
                    key={model.name}
                    className={`model-card ${selectedModel?.name === model.name ? 'selected' : ''}`}
                    onClick={() => setSelectedModel(model)}
                  >
                    <div className="model-header">
                      <h3 className="model-name">{model.name}</h3>
                      <span className="model-size">{formatFileSize(model.size)}</span>
                    </div>
                    
                    <div className="model-info">
                      <div className="model-detail">
                        <span className="detail-label">Family:</span>
                        <span className="detail-value">{model.details.family}</span>
                      </div>
                      <div className="model-detail">
                        <span className="detail-label">Parameters:</span>
                        <span className="detail-value">{model.details.parameter_size}</span>
                      </div>
                      <div className="model-detail">
                        <span className="detail-label">Format:</span>
                        <span className="detail-value">{model.details.format}</span>
                      </div>
                      <div className="model-detail">
                        <span className="detail-label">Modified:</span>
                        <span className="detail-value">{formatDate(model.modified_at)}</span>
                      </div>
                    </div>
                    
                    <div className="model-actions">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteModel(model.name);
                        }}
                        className="action-button delete"
                        disabled={isLoading}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Available Models to Download */}
          <div className="models-section">
            <h2>Available Models</h2>
            
            <div className="available-models">
              {availableModels.map((model) => {
                const isInstalled = models.some(installed => installed.name.includes(model.name));
                
                return (
                  <div key={model.name} className="available-model-card">
                    <div className="available-model-header">
                      <h3 className="model-name">{model.name}</h3>
                      {isInstalled && <span className="installed-badge">✓ Installed</span>}
                    </div>
                    
                    <p className="model-description">{model.description}</p>
                    
                    <div className="available-model-actions">
                      <button
                        onClick={() => handlePullModel(model.name)}
                        className="action-button download"
                        disabled={isLoading || isInstalled}
                      >
                        {isLoading ? '⏳' : '⬇️'} {isInstalled ? 'Installed' : 'Download'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Model Details Panel */}
        {selectedModel && (
          <div className="model-details-panel">
            <div className="details-header">
              <h3>Model Details: {selectedModel.name}</h3>
              <button
                onClick={() => setSelectedModel(null)}
                className="close-button"
              >
                ✕
              </button>
            </div>
            
            <div className="details-content">
              <div className="detail-section">
                <h4>Basic Information</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <strong>Model Name:</strong> {selectedModel.model}
                  </div>
                  <div className="detail-item">
                    <strong>Size:</strong> {formatFileSize(selectedModel.size)}
                  </div>
                  <div className="detail-item">
                    <strong>Family:</strong> {selectedModel.details.family}
                  </div>
                  <div className="detail-item">
                    <strong>Parameters:</strong> {selectedModel.details.parameter_size}
                  </div>
                  <div className="detail-item">
                    <strong>Quantization:</strong> {selectedModel.details.quantization_level}
                  </div>
                  <div className="detail-item">
                    <strong>Format:</strong> {selectedModel.details.format}
                  </div>
                </div>
              </div>
              
              <div className="detail-section">
                <h4>Metadata</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <strong>Digest:</strong> <code>{selectedModel.digest}</code>
                  </div>
                  <div className="detail-item">
                    <strong>Modified:</strong> {formatDate(selectedModel.modified_at)}
                  </div>
                  <div className="detail-item">
                    <strong>Expires:</strong> {formatDate(selectedModel.expires_at)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}