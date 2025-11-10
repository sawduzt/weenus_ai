/**
 * Chat Page Component
 * 
 * Main chat interface for interacting with AI models via Ollama.
 */

import { useState, useRef, useEffect } from 'react';
import { Send, Trash2, User, Bot, RefreshCw } from 'lucide-react';
import { useOllama } from '../hooks/useOllama';
import './ChatPage.css';

export function ChatPage(): JSX.Element {
  const [input, setInput] = useState('');
  const [streamingResponse, setStreamingResponse] = useState('');
  const [isCheckingConnection, setIsCheckingConnection] = useState(true);
  const [isStartingOllama, setIsStartingOllama] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    isConnected,
    checkConnection,
    models,
    loadModels,
    messages,
    currentModel,
    setCurrentModel,
    isGenerating,
    sendMessageStream,
    clearMessages,
  } = useOllama();

  // Check connection on mount
  useEffect(() => {
    const initConnection = async () => {
      setIsCheckingConnection(true);
      await checkConnection();
      setIsCheckingConnection(false);
    };
    initConnection();
  }, [checkConnection]);

  // Load models when connected
  useEffect(() => {
    if (isConnected) {
      loadModels();
    }
  }, [isConnected, loadModels]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingResponse]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isGenerating || !currentModel) return;

    const userInput = input;
    setInput('');
    setStreamingResponse('');

    try {
      await sendMessageStream(userInput, (chunk: string) => {
        setStreamingResponse((prev: string) => prev + chunk);
      });
    } catch (error) {
      console.error('Chat error:', error);
    } finally {
      setStreamingResponse('');
    }
  };

  const handleRefreshConnection = async () => {
    setIsCheckingConnection(true);
    await checkConnection();
    setIsCheckingConnection(false);
    if (isConnected) {
      loadModels();
    }
  };

  const handleStartOllama = async () => {
    if (!window.electronAPI?.ollama) {
      alert('Ollama start feature is only available in the desktop app. Please start Ollama manually.');
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

      // Wait 4 seconds for Ollama to fully start up
      await new Promise(resolve => setTimeout(resolve, 4000));
      
      // Try checking connection multiple times
      for (let i = 0; i < 3; i++) {
        setIsCheckingConnection(true);
        await checkConnection();
        setIsCheckingConnection(false);
        
        if (isConnected) {
          await loadModels();
          return; // Success!
        }
        
        // Wait before retrying
        if (i < 2) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
      
      // If we get here, connection failed after retries
      alert('Ollama started but connection check failed. It may need more time to initialize. Try "Check Connection" in a few seconds.');
    } catch (error) {
      console.error('Error starting Ollama:', error);
      alert('Failed to start Ollama. Please start it manually with: ollama serve');
    } finally {
      setIsStartingOllama(false);
    }
  };

  // Show connection check screen
  if (isCheckingConnection) {
    return (
      <div className="chat-page">
        <div className="coming-soon">
          <div className="coming-soon-icon"><Bot size={48} /></div>
          <h2>Checking Ollama Connection...</h2>
          <p>Please wait while we verify the Ollama service</p>
        </div>
      </div>
    );
  }

  // Show "Start Ollama" screen if not connected
  if (!isConnected) {
    return (
      <div className="chat-page">
        <div className="coming-soon">
          <div className="coming-soon-icon"><Bot size={48} /></div>
          <h2>Ollama Not Running</h2>
          <p>Please start the Ollama service to begin chatting</p>
          
          <div style={{ marginTop: '24px', display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button 
              onClick={handleStartOllama}
              disabled={isStartingOllama}
              className="setting-button primary"
              style={{
                padding: '12px 24px',
                borderRadius: '8px',
                border: 'none',
                background: isStartingOllama ? 'var(--border)' : 'var(--pink)',
                color: 'white',
                cursor: isStartingOllama ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Bot size={16} />
              {isStartingOllama ? 'Starting Ollama...' : 'Start Ollama'}
            </button>

            <button 
              onClick={handleRefreshConnection}
              disabled={isStartingOllama}
              className="setting-button"
              style={{
                padding: '12px 24px',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                background: 'var(--surface)',
                color: 'var(--text)',
                cursor: isStartingOllama ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <RefreshCw size={16} />
              Check Connection
            </button>
          </div>

          <div style={{ marginTop: '32px', textAlign: 'left', maxWidth: '500px' }}>
            <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>Manual start (recommended):</h3>
            <ol style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
              <li>Open a terminal or command prompt</li>
              <li>Run: <code style={{ background: 'var(--surface)', padding: '2px 8px', borderRadius: '4px' }}>ollama serve</code></li>
              <li>Wait for "Ollama is running" message</li>
              <li>Click "Check Connection" above</li>
            </ol>
            <p style={{ marginTop: '16px', fontSize: '14px', color: 'var(--text-secondary)' }}>
              💡 Tip: If the "Start Ollama" button doesn't work, Ollama may not be installed or not in your system PATH.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Main chat interface
  return (
    <div className="chat-page">
      <div className="page-header">
        <div>
          <h1><Bot size={24} style={{ display: 'inline', marginRight: '8px' }} />AI Chat</h1>
          <p>Powered by Ollama</p>
        </div>
        
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {/* Model Selector */}
          <select
            value={currentModel}
            onChange={(e) => setCurrentModel(e.target.value)}
            disabled={isGenerating}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              background: 'var(--surface)',
              color: 'var(--text)',
              fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            <option value="">Select a model...</option>
            {models.map((model) => (
              <option key={model.name} value={model.name}>
                {model.name}
              </option>
            ))}
          </select>

          {/* Clear Chat */}
          <button
            onClick={clearMessages}
            disabled={messages.length === 0 || isGenerating}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              background: 'var(--surface)',
              color: 'var(--text)',
              cursor: messages.length === 0 ? 'not-allowed' : 'pointer',
              opacity: messages.length === 0 ? 0.5 : 1,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Trash2 size={16} />
            Clear
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="messages-container" style={{
        flex: 1,
        overflowY: 'auto',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}>
        {messages.length === 0 ? (
          <div className="coming-soon">
            <div className="coming-soon-icon">💬</div>
            <h2>Start a Conversation</h2>
            <p>Select a model and type your message below</p>
          </div>
        ) : (
          <>
            {messages.map((message, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  padding: '16px',
                  borderRadius: '12px',
                  background: message.role === 'user' ? 'var(--surface)' : 'var(--background)',
                  border: '1px solid var(--border)',
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: 'var(--pink)',
                }}>
                  {message.role === 'user' ? (
                    <><User size={16} />User</>
                  ) : (
                    <><Bot size={16} />{currentModel || 'AI'}</>
                  )}
                </div>
                <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                  {message.content}
                </div>
              </div>
            ))}

            {/* Streaming Response */}
            {streamingResponse && (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                padding: '16px',
                borderRadius: '12px',
                background: 'var(--background)',
                border: '1px solid var(--pink)',
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: 'var(--pink)',
                }}>
                  <Bot size={16} />{currentModel || 'AI'}
                </div>
                <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                  {streamingResponse}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      <div style={{
        padding: '24px',
        borderTop: '1px solid var(--border)',
      }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '12px' }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={currentModel ? "Type your message..." : "Select a model first..."}
            disabled={!currentModel || isGenerating}
            style={{
              flex: 1,
              padding: '12px 16px',
              borderRadius: '12px',
              border: '1px solid var(--border)',
              background: 'var(--surface)',
              color: 'var(--text)',
              fontSize: '14px',
            }}
          />
          <button
            type="submit"
            disabled={!input.trim() || !currentModel || isGenerating}
            style={{
              padding: '12px 24px',
              borderRadius: '12px',
              border: 'none',
              background: !input.trim() || !currentModel || isGenerating ? 'var(--border)' : 'var(--pink)',
              color: 'white',
              cursor: !input.trim() || !currentModel || isGenerating ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Send size={16} />
            {isGenerating ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
}