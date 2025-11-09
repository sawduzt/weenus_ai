/**
 * Chat Page Component
 * 
 * Main chat interface for interacting with AI models.
 * Features message history, streaming responses, and model selection.
 */

import React, { useState, useRef, useEffect } from 'react';
import { useOllamaChat } from '../hooks/useOllama';
import './ChatPage.css';

export function ChatPage(): JSX.Element {
  const [input, setInput] = useState('');
  const [streamingResponse, setStreamingResponse] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const {
    messages,
    currentModel,
    setCurrentModel,
    models,
    isConnected,
    isGenerating,
    sendMessageStream,
    clearMessages,
    loadModels,
  } = useOllamaChat();

  // Load models on mount
  useEffect(() => {
    if (isConnected) {
      loadModels();
    }
  }, [isConnected, loadModels]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingResponse]);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!input.trim() || isGenerating || !currentModel) return;

    const userInput = input;
    setInput('');
    setStreamingResponse('');

    try {
      await sendMessageStream(
        userInput,
        (chunk: string) => {
          setStreamingResponse((prev: string) => prev + chunk);
        }
      );
    } catch (error) {
      console.error('Chat error:', error);
    } finally {
      setStreamingResponse('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  if (!isConnected) {
    return (
      <div className="chat-page">
        <div className="connection-error">
          <div className="error-icon">🔌</div>
          <h2>Not Connected to Ollama</h2>
          <p>Please ensure Ollama is running and accessible at http://localhost:11434</p>
          <div className="error-help">
            <h3>Quick Setup:</h3>
            <ol>
              <li>Download and install Ollama from <a href="https://ollama.ai" target="_blank" rel="noopener noreferrer">ollama.ai</a></li>
              <li>Run <code>ollama serve</code> in your terminal</li>
              <li>Download a model: <code>ollama pull llama2</code></li>
              <li>Refresh this application</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-page">
      {/* Chat Header */}
      <div className="chat-header">
        <div className="chat-title">
          <h1>AI Chat</h1>
          <span className="chat-subtitle">
            {models.length} models available
          </span>
        </div>
        
        <div className="chat-controls">
          <select
            value={currentModel}
            onChange={(e) => setCurrentModel(e.target.value)}
            className="model-selector"
            disabled={isGenerating}
          >
            <option value="">Select a model...</option>
            {models.map((model) => (
              <option key={model.name} value={model.name}>
                {model.name}
              </option>
            ))}
          </select>
          
          <button
            onClick={clearMessages}
            className="clear-button"
            disabled={isGenerating || messages.length === 0}
            title="Clear conversation"
          >
            🗑️
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">💬</div>
            <h2>Start a conversation</h2>
            <p>Select a model and type your message below to begin chatting with AI.</p>
            
            {!currentModel && (
              <div className="model-prompt">
                <p>👆 Don't forget to select a model first!</p>
              </div>
            )}
          </div>
        ) : (
          <div className="messages-list">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`message ${message.role}`}
              >
                <div className="message-header">
                  <span className="message-role">
                    {message.role === 'user' ? '👤' : '🤖'} {message.role}
                  </span>
                </div>
                <div className="message-content">
                  {message.content}
                </div>
              </div>
            ))}
            
            {/* Streaming Response */}
            {streamingResponse && (
              <div className="message assistant streaming">
                <div className="message-header">
                  <span className="message-role">
                    🤖 assistant
                  </span>
                  <span className="streaming-indicator">
                    <span className="dot"></span>
                    <span className="dot"></span>
                    <span className="dot"></span>
                  </span>
                </div>
                <div className="message-content">
                  {streamingResponse}
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="input-container">
        <form onSubmit={handleSubmit} className="input-form">
          <div className="input-wrapper">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                currentModel 
                  ? "Type your message... (Press Enter to send, Shift+Enter for new line)"
                  : "Select a model first..."
              }
              className="message-input"
              disabled={isGenerating || !currentModel}
              rows={1}
            />
            <button
              type="submit"
              disabled={!input.trim() || isGenerating || !currentModel}
              className="send-button"
              title="Send message"
            >
              {isGenerating ? '⏳' : '➤'}
            </button>
          </div>
          
          {isGenerating && (
            <div className="generation-status">
              <span className="status-text">Generating response...</span>
              <span className="model-info">Using {currentModel}</span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}