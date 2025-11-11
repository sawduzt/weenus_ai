/**
 * Model Library Page Component
 * 
 * Displays installed AI models with metadata, browse Ollama registry, and HuggingFace models.
 */

import { useState, useEffect } from 'react';
import { Package, HardDrive, Calendar, RefreshCw, Bot, Search, Trash2, Download, Filter, CheckCircle, Loader, ExternalLink, MessageSquare, Image, Video, Sparkles, Eye, Wrench, MessageCircle } from 'lucide-react';
import { useOllama } from '../hooks/useOllama';
import { useToast } from '../components/ui/ToastProvider';
import { DownloadQueuePanel } from '../components/DownloadQueuePanel';
import { downloadQueueStore } from '../store/downloadQueue';
import { ollamaService } from '../services/ollama';
import * as ollamaRegistry from '../services/ollamaRegistry';
import * as huggingFace from '../services/huggingFace';
import './ModelLibraryPage.css';

type TabType = 'installed' | 'ollama' | 'huggingface';

interface FilterState {
  sizeMin: number; // in GB
  sizeMax: number; // in GB
  modelTypes: {
    text: boolean;
    image: boolean;
    video: boolean;
    multimodal: boolean;
  };
  capabilities: {
    vision: boolean;
    tools: boolean;
    chat: boolean;
  };
}

export function ModelLibraryPage(): JSX.Element {
  const [activeTab, setActiveTab] = useState<TabType>('installed');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    sizeMin: 0,
    sizeMax: 200,
    modelTypes: {
      text: true,
      image: true,
      video: true,
      multimodal: true,
    },
    capabilities: {
      vision: false,
      tools: false,
      chat: false,
    },
  });
  const [isStartingOllama, setIsStartingOllama] = useState(false);
  const toast = useToast();
  
  const {
    isConnected,
    models,
    isLoadingModels,
    loadModels,
    checkConnection,
  } = useOllama();

  useEffect(() => {
    checkConnection();
  }, [checkConnection]);

  useEffect(() => {
    if (isConnected) {
      loadModels();
    }
  }, [isConnected, loadModels]);

  // Register cancel handler for download queue
  useEffect(() => {
    downloadQueueStore.setCancelHandler((id: string) => {
      // Mark as cancelled and stop processing further
      downloadQueueStore.setStatus(id, 'cancelled');
    });
  }, []);

  const handleStartOllama = async () => {
    if (!window.electronAPI?.ollama) {
      toast.warning('Desktop App Required', 'Please start Ollama manually with: ollama serve');
      return;
    }

    setIsStartingOllama(true);
    try {
      // Get model path from settings if configured
      let modelPath: string | undefined;
      try {
        modelPath = await window.electronAPI?.store?.get('modelPath');
      } catch (error) {
        console.warn('Failed to get modelPath from settings:', error);
      }

      // Use restart instead of start to properly set OLLAMA_MODELS env var
      const result = await window.electronAPI.ollama.restart(modelPath);
      
      if (!result.success) {
        let errorMsg = result.error || 'Unknown error';
        if (result.details) {
          errorMsg += '\n\nDetails: ' + result.details;
        }
        errorMsg += '\n\nPlease ensure:\n';
        errorMsg += '1. Ollama is installed from https://ollama.com\n';
        errorMsg += '2. Restart this app after installing\n';
        errorMsg += '3. Or start manually with: ollama serve';
        
        toast.error('Failed to Start Ollama', errorMsg);
        setIsStartingOllama(false);
        return;
      }

      console.log('Ollama started successfully:', result.path, 'PID:', result.pid);
      toast.success('Ollama Started', 'Loading models...');

      await new Promise(resolve => setTimeout(resolve, 4000));
      await checkConnection();
      if (isConnected) {
        await loadModels();
        toast.success('Connected!', 'Models loaded successfully');
      }
    } catch (error) {
      console.error('Error starting Ollama:', error);
      toast.error('Start Failed', 'Please start Ollama manually');
    } finally {
      setIsStartingOllama(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    const gb = bytes / (1024 * 1024 * 1024);
    return `${gb.toFixed(2)} GB`;
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString();
  };

  const getModelSizeInGB = (bytes: number): number => {
    return bytes / (1024 * 1024 * 1024);
  };

  const matchesFilters = (model: any): boolean => {
    const sizeGB = getModelSizeInGB(model.size);
    const matchesSize = sizeGB >= filters.sizeMin && sizeGB <= filters.sizeMax;
    const matchesSearch = model.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSize && matchesSearch;
  };

  const filteredModels = models.filter(matchesFilters);

  const resetFilters = () => {
    setFilters({
      sizeMin: 0,
      sizeMax: 200,
      modelTypes: {
        text: true,
        image: true,
        video: true,
        multimodal: true,
      },
      capabilities: {
        vision: false,
        tools: false,
        chat: false,
      },
    });
  };

  const hasActiveFilters = (): boolean => {
    return (
      filters.sizeMin > 0 ||
      filters.sizeMax < 200 ||
      !filters.modelTypes.text ||
      !filters.modelTypes.image ||
      !filters.modelTypes.video ||
      !filters.modelTypes.multimodal ||
      filters.capabilities.vision ||
      filters.capabilities.tools ||
      filters.capabilities.chat
    );
  };

  const handleDeleteModel = async (modelName: string) => {
    if (!isConnected) {
      toast.error('Not Connected', 'Cannot delete models while Ollama is not connected');
      return;
    }

    const confirmed = window.confirm(
      `Delete model "${modelName}"?\n\nThis will permanently remove the model from your system.\nThis action cannot be undone.`
    );
    
    if (!confirmed) return;

    try {
      toast.info('Deleting...', `Removing ${modelName}`);
      
      // Use Ollama API to delete the model
      const result = await ollamaService.deleteModel(modelName);
      
      if (result.success) {
        toast.success('Model Deleted', `Successfully removed ${modelName}`);
        
        // Refresh the model list
        await loadModels();
      } else {
        throw new Error(result.error || 'Unknown error');
      }
    } catch (error) {
      console.error('Error deleting model:', error);
      toast.error('Delete Failed', error instanceof Error ? error.message : 'Failed to delete model');
    }
  };

  if (!isConnected) {
    return (
      <div className="model-library-page">
        <div className="coming-soon">
          <div className="coming-soon-icon"><Package size={48} /></div>
          <h2>Ollama Not Connected</h2>
          <p>Please start Ollama to view your installed models</p>
          
          <div style={{ marginTop: '24px', display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button
              onClick={handleStartOllama}
              disabled={isStartingOllama}
              style={{
                padding: '12px 24px',
                borderRadius: '8px',
                border: 'none',
                background: isStartingOllama ? 'var(--border)' : 'var(--pink)',
                color: 'white',
                cursor: isStartingOllama ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Bot size={16} />
              {isStartingOllama ? 'Starting...' : 'Start Ollama'}
            </button>

            <button
              onClick={checkConnection}
              disabled={isStartingOllama}
              style={{
                padding: '12px 24px',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                background: 'var(--surface)',
                color: 'var(--text)',
                cursor: isStartingOllama ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <RefreshCw size={16} />
              Check Connection
            </button>
          </div>

          <div style={{ marginTop: '32px', textAlign: 'left', maxWidth: '500px' }}>
            <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>Manual start:</h3>
            <ol style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
              <li>Open a terminal and run: <code style={{ background: 'var(--surface)', padding: '2px 8px', borderRadius: '4px' }}>ollama serve</code></li>
              <li>Click "Check Connection" above</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="model-library-page">
      {/* Header with tabs */}
      <div className="page-header" style={{ padding: '8px 2px 0', display: 'flex', flexDirection: 'column', position: 'relative' }}>
        <div style={{ flex: 1, paddingLeft: '10px', paddingBottom: '12px' }}>
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
            <Package size={20} />
            Model Library
          </h1>
        </div>

        {/* Tab Navigation */}
        <div className="tab-navigation">
          <button
            className={`tab-button ${activeTab === 'installed' ? 'active' : ''}`}
            onClick={() => setActiveTab('installed')}
          >
            <Package size={16} />
            Installed Models
            <span className="tab-count">{models.length}</span>
          </button>
          <button
            className={`tab-button ${activeTab === 'ollama' ? 'active' : ''}`}
            onClick={() => setActiveTab('ollama')}
          >
            <Bot size={16} />
            Ollama Registry
          </button>
          <button
            className={`tab-button ${activeTab === 'huggingface' ? 'active' : ''}`}
            onClick={() => setActiveTab('huggingface')}
          >
            <Download size={16} />
            HuggingFace Models
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="search-filter-bar">
        <div className="search-box">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder={`Search ${activeTab === 'installed' ? 'installed' : activeTab === 'ollama' ? 'Ollama' : 'HuggingFace'} models...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-button-wrapper">
          <button
            className={`filter-button ${hasActiveFilters() ? 'active' : ''}`}
            onClick={() => setShowFilterPanel(!showFilterPanel)}
          >
            <Filter size={16} />
            Filters
            {hasActiveFilters() && <span className="filter-badge">•</span>}
          </button>

          {showFilterPanel && (
            <div className="filter-panel">
              <div className="filter-panel-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Filter size={18} />
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>Filter Models</h3>
                </div>
                <button
                  onClick={resetFilters}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: '1px solid var(--border)',
                    background: 'transparent',
                    color: 'var(--pink)',
                    fontSize: '13px',
                    cursor: 'pointer',
                    fontWeight: '500',
                  }}
                >
                  Reset All
                </button>
              </div>

              {/* Model Size Filter */}
              <div className="filter-section">
                <label className="filter-label">
                  Model Size: {filters.sizeMin}GB - {filters.sizeMax >= 200 ? '200GB+' : `${filters.sizeMax}GB`}
                </label>
                <div className="dual-range-slider">
                  <div className="range-track">
                    <div
                      className="range-fill"
                      style={{
                        left: `${(filters.sizeMin / 200) * 100}%`,
                        width: `${((filters.sizeMax - filters.sizeMin) / 200) * 100}%`,
                      }}
                    />
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    step="1"
                    value={filters.sizeMin}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        sizeMin: Math.min(Number(e.target.value), prev.sizeMax - 1),
                      }))
                    }
                    className="range-input range-min"
                  />
                  <input
                    type="range"
                    min="0"
                    max="200"
                    step="1"
                    value={filters.sizeMax}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        sizeMax: Math.max(Number(e.target.value), prev.sizeMin + 1),
                      }))
                    }
                    className="range-input range-max"
                  />
                </div>
              </div>

              {/* Model Type Filters */}
              <div className="filter-section">
                <label className="filter-label">Model Types</label>
                <div className="filter-checkboxes">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={filters.modelTypes.text}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          modelTypes: { ...prev.modelTypes, text: e.target.checked },
                        }))
                      }
                    />
                    <MessageSquare size={14} />
                    Text
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={filters.modelTypes.image}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          modelTypes: { ...prev.modelTypes, image: e.target.checked },
                        }))
                      }
                    />
                    <Image size={14} />
                    Image
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={filters.modelTypes.video}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          modelTypes: { ...prev.modelTypes, video: e.target.checked },
                        }))
                      }
                    />
                    <Video size={14} />
                    Video
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={filters.modelTypes.multimodal}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          modelTypes: { ...prev.modelTypes, multimodal: e.target.checked },
                        }))
                      }
                    />
                    <Sparkles size={14} />
                    Multimodal
                  </label>
                </div>
              </div>

              {/* Capability Filters */}
              <div className="filter-section">
                <label className="filter-label">Capabilities</label>
                <div className="filter-checkboxes">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={filters.capabilities.vision}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          capabilities: { ...prev.capabilities, vision: e.target.checked },
                        }))
                      }
                    />
                    <Eye size={14} />
                    Vision
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={filters.capabilities.tools}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          capabilities: { ...prev.capabilities, tools: e.target.checked },
                        }))
                      }
                    />
                    <Wrench size={14} />
                    Tool Use
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={filters.capabilities.chat}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          capabilities: { ...prev.capabilities, chat: e.target.checked },
                        }))
                      }
                    />
                    <MessageCircle size={14} />
                    Chat Optimized
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {activeTab === 'installed' && (
          <button
            onClick={loadModels}
            disabled={isLoadingModels}
            className="refresh-button"
          >
            <RefreshCw size={16} className={isLoadingModels ? 'spin' : ''} />
            Refresh
          </button>
        )}

        <DownloadQueuePanel />
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'installed' && (
          <InstalledModelsTab
            models={filteredModels}
            isLoading={isLoadingModels}
            isConnected={isConnected}
            onStartOllama={handleStartOllama}
            onCheckConnection={checkConnection}
            onDeleteModel={handleDeleteModel}
            isStartingOllama={isStartingOllama}
            formatFileSize={formatFileSize}
            formatDate={formatDate}
          />
        )}

        {activeTab === 'ollama' && (
          <OllamaRegistryTab
            searchQuery={searchQuery}
            filters={filters}
          />
        )}

        {activeTab === 'huggingface' && (
          <HuggingFaceTab
            searchQuery={searchQuery}
            filters={filters}
          />
        )}
      </div>
    </div>
  );
}

// Installed Models Tab Component
interface InstalledModelsTabProps {
  models: any[];
  isLoading: boolean;
  isConnected: boolean;
  onStartOllama: () => void;
  onCheckConnection: () => void;
  onDeleteModel: (name: string) => void;
  isStartingOllama: boolean;
  formatFileSize: (bytes: number) => string;
  formatDate: (date: string) => string;
}

function InstalledModelsTab({
  models,
  isLoading,
  isConnected,
  onStartOllama,
  onCheckConnection,
  onDeleteModel,
  isStartingOllama,
  formatFileSize,
  formatDate,
}: InstalledModelsTabProps): JSX.Element {
  if (!isConnected) {
    return (
      <div className="coming-soon">
        <div className="coming-soon-icon"><Package size={48} /></div>
        <h2>Ollama Not Connected</h2>
        <p>Please start Ollama to view your installed models</p>
        
        <div style={{ marginTop: '24px', display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button
            onClick={onStartOllama}
            disabled={isStartingOllama}
            style={{
              padding: '12px 24px',
              borderRadius: '8px',
              border: 'none',
              background: isStartingOllama ? 'var(--border)' : 'var(--pink)',
              color: 'white',
              cursor: isStartingOllama ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Bot size={16} />
            {isStartingOllama ? 'Starting...' : 'Start Ollama'}
          </button>

          <button
            onClick={onCheckConnection}
            disabled={isStartingOllama}
            style={{
              padding: '12px 24px',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              background: 'var(--surface)',
              color: 'var(--text)',
              cursor: isStartingOllama ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <RefreshCw size={16} />
            Check Connection
          </button>
        </div>

        <div style={{ marginTop: '32px', textAlign: 'left', maxWidth: '500px' }}>
          <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>Manual start:</h3>
          <ol style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
            <li>Open a terminal and run: <code style={{ background: 'var(--surface)', padding: '2px 8px', borderRadius: '4px' }}>ollama serve</code></li>
            <li>Click "Check Connection" above</li>
          </ol>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="coming-soon">
        <div className="coming-soon-icon"><Package size={48} /></div>
        <h2>Weenus is Thinking...</h2>
        <p>Loading your models</p>
      </div>
    );
  }

  if (models.length === 0) {
    return (
      <div className="coming-soon">
        <div className="coming-soon-icon"><Package size={48} /></div>
        <h2>No Models Found</h2>
        <p>Try adjusting your filters or download a model from the other tabs</p>
      </div>
    );
  }

  return (
    <div className="models-grid-container">
      {models.map((model) => (
        <div key={model.name} className="model-card-enhanced">
          <div className="model-card-header">
            <div className="model-icon">
              <Bot size={24} className="icon-text" />
            </div>
            <div style={{ flex: 1 }}>
              <h3 className="model-card-title">{model.name}</h3>
              <div className="model-badges">
                <span className="badge badge-size">{formatFileSize(model.size)}</span>
                {model.details.family && (
                  <span className="badge badge-family">{model.details.family}</span>
                )}
                {model.details.quantization_level && (
                  <span className="badge badge-quant">{model.details.quantization_level}</span>
                )}
              </div>
            </div>
            <button
              onClick={() => onDeleteModel(model.name)}
              className="delete-button"
              title="Delete model"
            >
              <Trash2 size={16} />
            </button>
          </div>

          <div className="model-card-info">
            <div className="info-row">
              <Package size={14} />
              <span>Format: {model.details.format}</span>
            </div>
            <div className="info-row">
              <HardDrive size={14} />
              <span>Parameters: {model.details.parameter_size}</span>
            </div>
            <div className="info-row">
              <Calendar size={14} />
              <span>Modified: {formatDate(model.modified_at)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Ollama Registry Tab Component
interface OllamaRegistryTabProps {
  searchQuery: string;
  filters: FilterState;
}

function OllamaRegistryTab({ searchQuery, filters }: OllamaRegistryTabProps): JSX.Element {
  const [models, setModels] = useState<ollamaRegistry.OllamaRegistryModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<{ [modelName: string]: string }>({});
  const [expandedVariantModel, setExpandedVariantModel] = useState<string | null>(null);
  const { models: installedModels, loadModels } = useOllama();
  const toast = useToast();

  useEffect(() => {
    const loadModels = async () => {
      setIsLoading(true);
      try {
        let results = await ollamaRegistry.searchModels(searchQuery);
        
        // Filter by model type
        const activeTypes = Object.entries(filters.modelTypes)
          .filter(([_, active]) => active)
          .map(([type]) => type as any);
        if (activeTypes.length < 4) { // Not all types selected
          results = results.filter(model => 
            activeTypes.includes(model.modelType)
          );
        }
        
        // Filter by size range
        results = results.filter(model => {
          if (!model.sizeDisplay) return true;
          const sizes = model.sizeDisplay.match(/(\d+(?:\.\d+)?)\s*GB/gi);
          if (!sizes || sizes.length === 0) return true;
          return sizes.some(size => {
            const gb = parseFloat(size);
            return gb >= filters.sizeMin && gb <= filters.sizeMax;
          });
        });
        
        // Filter by capabilities if any are selected
        if (filters.capabilities.vision || filters.capabilities.tools || filters.capabilities.chat) {
          results = results.filter(model => {
            if (filters.capabilities.vision && !model.capabilities?.vision) return false;
            if (filters.capabilities.tools && !model.capabilities?.tools) return false;
            if (filters.capabilities.chat && !model.capabilities?.chat) return false;
            return true;
          });
        }
        setModels(results);
      } catch (error) {
        console.error('Error loading Ollama models:', error);
        toast.error('Load Failed', 'Failed to load Ollama registry models');
      } finally {
        setIsLoading(false);
      }
    };

    loadModels();
  }, [searchQuery, filters, toast]);

  const handleDownload = async (modelName: string, selectedTag?: string) => {
    const fullModelName = selectedTag ? `${modelName}:${selectedTag}` : modelName;
    
    // Add to queue instead of downloading immediately
    downloadQueueStore.addToQueue(fullModelName);
    
    // Start queue processing
    processDownloadQueue();
  };

  const processDownloadQueue = async () => {
    // If already downloading, don't start another
    if (downloadQueueStore.isDownloading()) {
      return;
    }

    // Get next pending download
    const nextId = downloadQueueStore.getNextPending();
    if (!nextId) {
      return;
    }

    const queue = downloadQueueStore.getQueue();
    const item = queue.find(q => q.id === nextId);
    if (!item) return;

    const fullModelName = item.modelName;

    downloadQueueStore.updateProgress(nextId, 0, 'Starting download...', 0);

    try {
      // Get model path from settings if available
      let modelPath: string | undefined;
      try {
        modelPath = await window.electronAPI?.store?.get('modelPath');
      } catch (error) {
        console.warn('Failed to get modelPath from settings:', error);
      }

      const result = await ollamaRegistry.downloadModel(fullModelName, (progress) => {
        downloadQueueStore.updateProgress(
          nextId,
          progress.total ? (progress.completed || 0) / progress.total * 100 : 0,
          progress.status,
          0
        );
      }, modelPath);

      if (result.success) {
        downloadQueueStore.setStatus(nextId, 'completed');
        toast.success('Download Complete', `${fullModelName} is ready to use!`);
        loadModels(); // Refresh installed models
      } else {
        downloadQueueStore.setStatus(nextId, 'failed', result.error || 'Unknown error');
        toast.error('Download Failed', result.error || 'Unknown error');
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      downloadQueueStore.setStatus(nextId, 'failed', errorMsg);
      toast.error('Download Failed', errorMsg);
    }

    // After download completes, process next in queue
    setTimeout(() => processDownloadQueue(), 500);
  };

  const isModelInstalled = (modelName: string): boolean => {
    return installedModels.some(m => m.name.startsWith(modelName + ':'));
  };

  const isVariantInstalled = (modelName: string, tag: string): boolean => {
    return installedModels.some(m => m.name === `${modelName}:${tag}`);
  };

  if (isLoading) {
    return (
      <div className="coming-soon">
        <div className="coming-soon-icon"><Bot size={48} /></div>
        <h2>Loading Ollama Registry...</h2>
        <p>Fetching available models</p>
      </div>
    );
  }

  if (models.length === 0) {
    return (
      <div className="coming-soon">
        <div className="coming-soon-icon"><Bot size={48} /></div>
        <h2>No Models Found</h2>
        <p>Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="models-grid-container">
      {models.map((model) => {
        const installed = isModelInstalled(model.name);

        return (
          <div key={model.name} className="model-card-enhanced registry-card">
            <div className="model-card-header">
              <div className="model-icon">
                {model.capabilities?.vision ? (
                  <Image size={24} className="icon-image" />
                ) : (
                  <MessageSquare size={24} className="icon-text" />
                )}
              </div>
              <div style={{ flex: 1 }}>
                <h3 className="model-card-title">{model.name}</h3>
                <p className="model-description">{model.description}</p>
                <div className="model-badges">
                  {model.sizeDisplay && (
                    <span className="badge badge-size">{model.sizeDisplay}</span>
                  )}
                  {model.tags.map((tag) => (
                    <span key={tag} className="badge badge-tag">{tag}</span>
                  ))}
                  {model.capabilities?.vision && (
                    <span className="badge badge-vision">Vision</span>
                  )}
                  {model.capabilities?.tools && (
                    <span className="badge badge-tools">Tools</span>
                  )}
                </div>
              </div>
            </div>

            <div className="model-card-actions">
              {installed ? (
                <button className="download-button installed" disabled>
                  <CheckCircle size={16} />
                  Installed
                </button>
              ) : model.tags.length > 1 ? (
                // Multiple variants available
                <div className="variant-selector">
                  <button
                    className="download-button variant-trigger"
                    onClick={() => setExpandedVariantModel(
                      expandedVariantModel === model.name ? null : model.name
                    )}
                  >
                    <Download size={16} />
                    {selectedVariant[model.name] ? `${selectedVariant[model.name]}` : 'Select Size'}
                  </button>
                  {expandedVariantModel === model.name && (
                    <div className="variant-dropdown">
                      {model.tags.map((tag) => {
                        const variantInstalled = isVariantInstalled(model.name, tag);
                        return (
                          <button
                            key={tag}
                            className={`variant-option ${variantInstalled ? 'installed' : ''}`}
                            onClick={() => {
                              if (!variantInstalled) {
                                setSelectedVariant(prev => ({ ...prev, [model.name]: tag }));
                                handleDownload(model.name, tag);
                              }
                            }}
                            disabled={variantInstalled}
                            title={variantInstalled ? 'Already installed' : `Download ${tag} variant`}
                          >
                            <Download size={14} />
                            <span>{tag}</span>
                            {variantInstalled && <span className="badge-tiny">✓</span>}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : (
                // Single variant or no variants
                <button
                  className="download-button"
                  onClick={() => handleDownload(model.name, model.tags[0])}
                >
                  <Download size={16} />
                  Download
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// HuggingFace Tab Component
interface HuggingFaceTabProps {
  searchQuery: string;
  filters: FilterState;
}

function HuggingFaceTab({ searchQuery, filters }: HuggingFaceTabProps): JSX.Element {
  const [models, setModels] = useState<huggingFace.HuggingFaceModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [modelFiles, setModelFiles] = useState<huggingFace.HuggingFaceFile[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const loadModels = async () => {
      setIsLoading(true);
      try {
        let results = await huggingFace.searchModels(searchQuery);
        
        // Filter by model type
        const activeTypes = Object.entries(filters.modelTypes)
          .filter(([_, active]) => active)
          .map(([type]) => type as any);
        if (activeTypes.length < 4) { // Not all types selected
          results = results.filter(model => 
            activeTypes.includes(model.modelType)
          );
        }
        
        // Filter by size range - estimate based on model name and file data
        results = results.filter(model => {
          // Try to extract size hints from model name
          const nameSizeMatch = model.name.match(/(\d+(?:\.\d+)?)[bB]/);
          if (nameSizeMatch) {
            const sizeInB = parseFloat(nameSizeMatch[1]);
            const sizeInGB = sizeInB / 1000; // Rough estimate: 1B params ≈ 2-4GB, using 2GB per B
            const estimatedSize = sizeInGB * 2;
            if (estimatedSize < filters.sizeMin || estimatedSize > filters.sizeMax) {
              return false;
            }
          }
          return true;
        });
        
        setModels(results);
      } catch (error) {
        console.error('Error loading HuggingFace models:', error);
        toast.error('Load Failed', 'Failed to load HuggingFace models');
      } finally {
        setIsLoading(false);
      }
    };

    loadModels();
  }, [searchQuery, filters, toast]);

  const handleSelectModel = async (modelId: string) => {
    if (selectedModel === modelId) {
      setSelectedModel(null);
      setModelFiles([]);
      return;
    }

    setSelectedModel(modelId);
    setLoadingFiles(true);

    try {
      const files = await huggingFace.getModelFiles(modelId);
      setModelFiles(files);
    } catch (error) {
      console.error('Error loading model files:', error);
      toast.error('Load Failed', 'Failed to load model files');
    } finally {
      setLoadingFiles(false);
    }
  };

  const handleDownloadFile = async (file: huggingFace.HuggingFaceFile, model: huggingFace.HuggingFaceModel) => {
    const queueName = `${model.id}/${file.filename}`;
    downloadQueueStore.addToQueue(queueName);
    processHFDownloadQueue(file, model);
  };

  const processHFDownloadQueue = async (file: huggingFace.HuggingFaceFile, model: huggingFace.HuggingFaceModel) => {
    const queueName = `${model.id}/${file.filename}`;
    const queue = downloadQueueStore.getQueue();
    const item = queue.find(q => q.modelName === queueName);
    
    if (!item) return;

    downloadQueueStore.updateProgress(item.id, 0, 'Starting download...', 0);

    const result = await huggingFace.downloadModel(
      file,
      model.id,
      model.modelType,
      (percent, status) => {
        downloadQueueStore.updateProgress(item.id, percent, status, 0);
      }
    );

    if (result.success) {
      downloadQueueStore.setStatus(item.id, 'completed');
      toast.success('Success', result.message || 'Model imported successfully!');
    } else {
      downloadQueueStore.setStatus(item.id, 'failed', result.error || 'Unknown error');
      toast.error('Download Failed', result.error || 'Unknown error');
    }
  };

  const getModelTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'text':
        return 'badge-text-type';
      case 'image':
        return 'badge-image-type';
      case 'video':
        return 'badge-video-type';
      case 'multimodal':
        return 'badge-multimodal-type';
      default:
        return 'badge-family';
    }
  };

  if (isLoading) {
    return (
      <div className="coming-soon">
        <div className="coming-soon-icon"><Download size={48} /></div>
        <h2>Loading HuggingFace Models...</h2>
        <p>Searching for GGUF models</p>
      </div>
    );
  }

  if (models.length === 0) {
    return (
      <div className="coming-soon">
        <div className="coming-soon-icon"><Download size={48} /></div>
        <h2>No Models Found</h2>
        <p>Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="models-grid-container">
      {models.map((model) => (
        <div key={model.id} className="model-card-enhanced hf-card">
          <div 
            className="model-card-header clickable"
            onClick={() => handleSelectModel(model.id)}
            style={{ cursor: 'pointer' }}
          >
            <div className="model-icon">
              {model.modelType === 'image' ? (
                <Image size={24} className="icon-image" />
              ) : model.modelType === 'video' ? (
                <Video size={24} className="icon-video" />
              ) : model.modelType === 'multimodal' ? (
                <Sparkles size={24} className="icon-multimodal" />
              ) : (
                <MessageSquare size={24} className="icon-text" />
              )}
            </div>
            <div style={{ flex: 1 }}>
              <h3 className="model-card-title">{model.name}</h3>
              <p className="model-author">by {model.author}</p>
              {model.description && (
                <p className="model-description">{model.description}</p>
              )}
              <div className="model-badges">
                <span className={`badge ${getModelTypeBadgeColor(model.modelType || 'text')}`}>
                  {model.modelType || 'text'}
                </span>
                <span className="badge badge-downloads">
                  {(model.downloads / 1000).toFixed(0)}k downloads
                </span>
                <span className="badge badge-likes">
                  {model.likes} likes
                </span>
              </div>
            </div>
            <ExternalLink size={16} style={{ color: 'var(--text-muted)' }} />
          </div>

          {selectedModel === model.id && (
            <div className="model-files-section">
              {loadingFiles ? (
                <div className="files-loading">
                  <Loader size={16} className="spin" />
                  <span>Loading files...</span>
                </div>
              ) : modelFiles.length === 0 ? (
                <p className="no-files">No GGUF files found</p>
              ) : (
                <>
                  <h4 className="files-header">Available GGUF Files:</h4>
                  <div className="files-list">
                    {modelFiles.map((file) => (
                        <div key={file.filename} className="file-item">
                          <div className="file-info">
                            <span className="file-name">{file.filename}</span>
                            <div className="file-meta">
                              <span className="file-size">{file.sizeDisplay}</span>
                              {file.quantization && (
                                <span className="badge badge-quant">{file.quantization}</span>
                              )}
                            </div>
                          </div>
                          <button
                            className="download-file-button"
                            onClick={() => handleDownloadFile(file, model)}
                          >
                            <Download size={14} />
                            Download
                          </button>
                        </div>
                      ))}
                  </div>
                  <p className="import-hint">
                    {model.modelType === 'text' 
                      ? 'Text models will be automatically imported into Ollama!'
                      : 'After downloading, import the GGUF file into Ollama using: '}
                    {model.modelType !== 'text' && (
                      <code>ollama create &lt;model-name&gt; -f &lt;modelfile&gt;</code>
                    )}
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}