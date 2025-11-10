/**
 * Model Library Page Component
 * 
 * Displays installed AI models with metadata.
 */

import { useState, useEffect } from 'react';
import { Package, HardDrive, Calendar, RefreshCw, Bot } from 'lucide-react';
import { useOllama } from '../hooks/useOllama';
import './ModelLibraryPage.css';

export function ModelLibraryPage(): JSX.Element {
  const [isStartingOllama, setIsStartingOllama] = useState(false);
  
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

  const handleStartOllama = async () => {
    if (!window.electronAPI?.ollama) {
      alert('Please start Ollama manually with: ollama serve');
      return;
    }

    setIsStartingOllama(true);
    try {
      const result = await window.electronAPI.ollama.start();
      
      if (!result.success) {
        // Show detailed error message
        let errorMsg = 'Failed to start Ollama.\n\n';
        errorMsg += result.error || 'Unknown error';
        if (result.details) {
          errorMsg += '\n\nDetails: ' + result.details;
        }
        if (result.paths) {
          errorMsg += '\n\nSearched paths:\n' + result.paths.join('\n');
        }
        errorMsg += '\n\nPlease ensure:\n';
        errorMsg += '1. Ollama is installed from https://ollama.com\n';
        errorMsg += '2. Restart this app after installing\n';
        errorMsg += '3. Or start manually with: ollama serve';
        
        alert(errorMsg);
        setIsStartingOllama(false);
        return;
      }

      console.log('Ollama started successfully:', result.path, 'PID:', result.pid);

      await new Promise(resolve => setTimeout(resolve, 4000));
      await checkConnection();
      if (isConnected) {
        await loadModels();
      }
    } catch (error) {
      console.error('Error starting Ollama:', error);
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
      <div className="page-header">
        <div>
          <h1><Package size={24} style={{ display: 'inline', marginRight: '8px' }} />Model Library</h1>
          <p>{models.length} models installed</p>
        </div>
        
        <button
          onClick={loadModels}
          disabled={isLoadingModels}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: '1px solid var(--border)',
            background: 'var(--surface)',
            color: 'var(--text)',
            cursor: isLoadingModels ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
          }}
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      <div style={{ padding: '24px' }}>
        {isLoadingModels ? (
          <div className="coming-soon">
            <div className="coming-soon-icon"><Package size={48} /></div>
            <h2>Loading Models...</h2>
          </div>
        ) : models.length === 0 ? (
          <div className="coming-soon">
            <div className="coming-soon-icon"><Package size={48} /></div>
            <h2>No Models Found</h2>
            <p>No models are currently installed</p>
            <div style={{ marginTop: '24px', textAlign: 'left', maxWidth: '500px' }}>
              <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>To install a model:</h3>
              <ol style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
                <li>Open a terminal or command prompt</li>
                <li>Run: <code style={{ background: 'var(--surface)', padding: '2px 8px', borderRadius: '4px' }}>ollama pull llama2</code></li>
                <li>Click "Refresh" above to see your models</li>
              </ol>
            </div>
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '16px',
          }}>
            {models.map((model) => (
              <div
                key={model.name}
                style={{
                  padding: '20px',
                  borderRadius: '12px',
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'start',
                  marginBottom: '16px',
                }}>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: 'var(--pink)',
                    margin: 0,
                  }}>
                    {model.name}
                  </h3>
                  <span style={{
                    fontSize: '12px',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    background: 'var(--background)',
                    color: 'var(--text-secondary)',
                  }}>
                    {formatFileSize(model.size)}
                  </span>
                </div>

                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  fontSize: '14px',
                  color: 'var(--text-secondary)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Package size={14} />
                    <span>Format: {model.details.format}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <HardDrive size={14} />
                    <span>Parameters: {model.details.parameter_size}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Calendar size={14} />
                    <span>Modified: {formatDate(model.modified_at)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}