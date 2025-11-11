/**
 * Chat Page Component
 * 
 * Main chat interface for interacting with AI models via Ollama.
 */

import { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, RefreshCw, MessageCircle, Lightbulb, Loader, Sliders } from 'lucide-react';
import { useOllama } from '../hooks/useOllama';
import { useChat } from '../hooks/useChat';
import { usePerChatParameters } from '../hooks/usePerChatParameters';
import { useToast } from '../components/ui/ToastProvider';
import { PerChatParameterAdjuster } from '../components/PerChatParameterAdjuster';
import { chatService } from '../services/chat';
import { streamingChatService } from '../services/streamingChat';
import type { ChatMessage } from '../types/chat.types';
import './ChatPage.css';

export interface ChatPageProps {
  activeChatId: string | null;
  onChatChange: (chatId: string | null) => void;
}

export function ChatPage({ activeChatId, onChatChange }: ChatPageProps): JSX.Element {
  const [input, setInput] = useState('');
  const [isCheckingConnection, setIsCheckingConnection] = useState(true);
  const [isStartingOllama, setIsStartingOllama] = useState(false);
  const [isGeneratingResponse, setIsGeneratingResponse] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [streamingResponse, setStreamingResponse] = useState('');
  const [showParameterPanel, setShowParameterPanel] = useState(false);
  const [chatParameters, setChatParameters] = useState({
    temperature: 0.7,
    topP: 0.9,
    topK: 40,
    repeatPenalty: 1.1,
    maxTokens: 2048,
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const toast = useToast();
  const isFirstMessage = useRef(false);

  const {
    isConnected,
    checkConnection,
    models,
    loadModels,
    currentModel,
    setCurrentModel,
  } = useOllama();

  const { activeChat, switchChat, createNewChat, refreshChats } = useChat();

  // Per-chat parameter management
  const {
    effectiveParameters,
    hasOverrides,
    saveChatParameters,
    resetToModelDefaults,
  } = usePerChatParameters(activeChatId, currentModel);

  // Get messages from active chat or empty array
  const messages = activeChat?.messages || [];

  // Loading messages for AI responses
  const loadingMessages = [
    'crunching numbers',
    'gearing up',
    'chewing hay',
    'thinking deeply',
    'pondering existence',
    'consulting the stars',
    'brewing thoughts',
    'summoning wisdom',
    'processing vibes',
    'doing bunny math',
  ];

  // Sync active chat when prop changes
  useEffect(() => {
    if (activeChatId && activeChatId !== activeChat?.id) {
      switchChat(activeChatId);
    } else if (!activeChatId && activeChat) {
      // Clear active chat when activeChatId is set to null (New Chat button)
      chatService.setActiveChat(null).then(() => refreshChats());
    }
  }, [activeChatId, activeChat, switchChat, refreshChats]);

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

  // Subscribe to streaming updates when component mounts
  useEffect(() => {
    const unsubscribe = streamingChatService.subscribe('chat-page', (state) => {
      setStreamingResponse(state.currentResponse);
    });

    return unsubscribe;
  }, []);

  // Handle title editing
  const handleTitleClick = () => {
    if (activeChat) {
      setEditedTitle(activeChat.title);
      setIsEditingTitle(true);
    }
  };

  const handleTitleSubmit = async () => {
    if (activeChatId && editedTitle.trim() && editedTitle !== activeChat?.title) {
      await chatService.updateChat(activeChatId, { title: editedTitle.trim() });
      await refreshChats();
      toast.success('Chat Renamed', `Chat renamed to "${editedTitle.trim()}"`);
    }
    setIsEditingTitle(false);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleTitleSubmit();
    } else if (e.key === 'Escape') {
      setIsEditingTitle(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isGeneratingResponse || !currentModel) return;

    const userInput = input;
    setInput('');
    setStreamingResponse('');

    // Pick random loading message
    const randomLoadingMsg = loadingMessages[Math.floor(Math.random() * loadingMessages.length)];
    setLoadingMessage(randomLoadingMsg);
    setIsGeneratingResponse(true);

    try {
      // Create new chat if none active
      let chatId = activeChatId;
      if (!chatId) {
        const newChat = await createNewChat(currentModel);
        chatId = newChat.id;
        onChatChange(chatId);
        isFirstMessage.current = true;
      }

      // Create user message
      const userMessage: ChatMessage = {
        id: `msg-${Date.now()}-user`,
        role: 'user',
        content: userInput,
        timestamp: new Date(),
        model: currentModel,
      };

      // Add user message to chat
      await chatService.addMessage(chatId, userMessage);
      
      // Refresh chat to show user message immediately
      await refreshChats();

      // Build conversation context from existing messages
      const conversationMessages = [
        ...messages.map(msg => ({ role: msg.role, content: msg.content })),
        { role: 'user' as const, content: userInput }
      ];

      // Start streaming through the app-level service
      streamingChatService.startStreaming(chatId);

      // Generate AI response using /api/chat endpoint with per-chat parameters
      let fullResponse = '';
      const response = await fetch('http://localhost:11434/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: currentModel,
          messages: conversationMessages,
          stream: true,
          options: {
            temperature: effectiveParameters.temperature,
            top_p: effectiveParameters.topP,
            top_k: effectiveParameters.topK,
            repeat_penalty: effectiveParameters.repeatPenalty,
            num_predict: effectiveParameters.maxTokens,
          },
        }),
        signal: streamingChatService.getAbortSignal() || undefined,
      });

      if (!response.ok || !response.body) {
        throw new Error('Failed to get response from Ollama');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        
        // Keep the last incomplete line in the buffer
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.trim()) {
            try {
              const json = JSON.parse(line);
              if (json.message?.content) {
                fullResponse += json.message.content;
                streamingChatService.appendResponse(json.message.content);
              }
            } catch (e) {
              console.error('Error parsing chunk:', e);
            }
          }
        }
      }

      // Create assistant message
      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now()}-assistant`,
        role: 'assistant',
        content: fullResponse,
        timestamp: new Date(),
        model: currentModel,
      };

      // Add assistant message to chat
      await chatService.addMessage(chatId, assistantMessage);
      
      // END GENERATION IMMEDIATELY (before refreshing to avoid loading indicator flash)
      setIsGeneratingResponse(false);
      setLoadingMessage('');
      
      // Refresh chat to update sidebar with new message (loads from storage)
      await refreshChats();
      
      // NOW end streaming and clear the streaming response
      streamingChatService.endStreaming();
      setStreamingResponse('');

      // Generate title if this was the first message
      if (isFirstMessage.current) {
        isFirstMessage.current = false;
        await chatService.generateTitle(chatId, userInput, currentModel);
        await refreshChats(); // Refresh again to show updated title
      }
    } catch (error) {
      // Handle abort error gracefully (user cancelled manually)
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('Chat streaming cancelled by user');
      } else {
        console.error('Chat error:', error);
        toast.error('Chat Error', 'Failed to send message. Please try again.');
      }
      setIsGeneratingResponse(false);
      setLoadingMessage('');
      streamingChatService.reset();
    } finally {
      // Already handled above to prevent loading indicator flash
    }
  };

  const handleStopGenerating = async () => {
    streamingChatService.cancelStreaming();
    setIsGeneratingResponse(false);
    setLoadingMessage('');
    
    // Save the partial response that was streamed so far
    if (streamingResponse && activeChatId) {
      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now()}-assistant`,
        role: 'assistant',
        content: streamingResponse,
        timestamp: new Date(),
        model: currentModel,
      };
      
      try {
        await chatService.addMessage(activeChatId, assistantMessage);
        await refreshChats();
        streamingChatService.endStreaming();
        setStreamingResponse('');
      } catch (error) {
        console.error('Error saving partial response:', error);
        toast.error('Save Failed', 'Could not save partial response');
      }
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
      toast.warning('Desktop App Required', 'Please start Ollama manually with: ollama serve');
      return;
    }

    setIsStartingOllama(true);
    try {
      const result = await window.electronAPI.ollama.start();
      
      if (!result.success) {
        // Show detailed error message
        let errorMsg = result.error || 'Unknown error';
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
        
        toast.error('Failed to Start Ollama', errorMsg);
        setIsStartingOllama(false);
        return;
      }

      console.log('Ollama started successfully:', result.path, 'PID:', result.pid);
      toast.success('Ollama Started', 'Service is starting up...');

      // Wait 4 seconds for Ollama to fully start up
      await new Promise(resolve => setTimeout(resolve, 4000));
      
      // Try checking connection multiple times
      for (let i = 0; i < 3; i++) {
        setIsCheckingConnection(true);
        await checkConnection();
        setIsCheckingConnection(false);
        
        if (isConnected) {
          await loadModels();
          toast.success('Connected!', 'Ollama is ready to use');
          return; // Success!
        }
        
        // Wait before retrying
        if (i < 2) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
      
      // If we get here, connection failed after retries
      toast.warning('Connection Timeout', 'Ollama started but needs more time. Try "Check Connection" in a few seconds.');
    } catch (error) {
      console.error('Error starting Ollama:', error);
      toast.error('Start Failed', 'Please start Ollama manually with: ollama serve');
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
          <p>Weenus is initializing</p>
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
          <h2>Weenus Needs Fuel</h2>
          <p>Ollama service is not running. Let's start it up!</p>
          
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
            <p style={{ marginTop: '16px', fontSize: '14px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Lightbulb size={16} /> Tip: If the "Start Ollama" button doesn't work, Ollama may not be installed or not in your system PATH.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Main chat interface
  return (
    <div className="chat-page">
      <div className="page-header" style={{ padding: '8px 2px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
        <div style={{ flex: 1, paddingLeft: '10px' }}>
          {isEditingTitle ? (
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onBlur={handleTitleSubmit}
              onKeyDown={handleTitleKeyDown}
              autoFocus
              style={{
                fontSize: '18px',
                margin: '0',
                padding: '4px 8px',
                background: 'var(--bg-tertiary)',
                border: '2px solid var(--accent-primary)',
                borderRadius: '8px',
                color: 'var(--text-primary)',
                fontWeight: '600',
                width: '100%',
                maxWidth: '400px',
              }}
            />
          ) : (
            <h1 
              onClick={handleTitleClick}
              style={{ 
                fontSize: '18px', 
                margin: '0', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                cursor: activeChat ? 'pointer' : 'default',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (activeChat) e.currentTarget.style.color = 'var(--accent-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--text-primary)';
              }}
            >
              <Bot size={20} />
              {activeChat?.title || 'AI Chat'}
            </h1>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="messages-container" style={{
        flex: 1,
        overflowY: 'auto',
        padding: '12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}>
        {messages.length === 0 ? (
          <div className="coming-soon">
            <div className="coming-soon-icon"><MessageCircle size={48} /></div>
            <h2>Start a Conversation</h2>
            <p>Select a model and type your message to begin</p>
          </div>
        ) : (
          <>
            {messages.map((message, index) => (
              <div
                key={index}
                className="fade-in"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  padding: '12px',
                  borderRadius: '12px',
                  background: message.role === 'user' ? 'var(--surface)' : 'var(--background)',
                  border: '1px solid var(--border)',
                  animation: 'fadeIn 0.3s ease',
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

            {/* Loading Indicator */}
            {isGeneratingResponse && !streamingResponse && (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                padding: '12px',
                borderRadius: '12px',
                background: 'var(--background)',
                border: '1px solid var(--pink)',
                opacity: 0.8,
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
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  color: 'var(--text-secondary)',
                  fontSize: '14px',
                  fontStyle: 'italic',
                }}>
                  <Loader size={14} style={{ animation: 'spin 1s linear infinite' }} />
                  {loadingMessage}...
                </div>
              </div>
            )}

            {/* Streaming Response */}
            {streamingResponse && (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                padding: '12px',
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
        padding: '12px 16px 12px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}>
        {/* Message Input Bar */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '12px' }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={currentModel ? "Type your message..." : "Select a model first..."}
            disabled={!currentModel || isGeneratingResponse}
            style={{
              flex: 1,
              padding: '14px 18px',
              borderRadius: '16px',
              border: '2px solid var(--border-primary)',
              background: 'transparent',
              color: 'var(--text-primary)',
              fontSize: '14px',
              transition: 'all 0.2s ease',
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--accent-primary)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--border-primary)'}
          />
          {isGeneratingResponse ? (
            <button
              type="button"
              onClick={handleStopGenerating}
              style={{
                padding: '14px 28px',
                borderRadius: '16px',
                border: 'none',
                background: 'var(--error)',
                color: 'white',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#c73030';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--error)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <Lightbulb size={16} />
              Stop
            </button>
          ) : (
            <button
              type="submit"
              disabled={!input.trim() || !currentModel}
              style={{
                padding: '14px 28px',
                borderRadius: '16px',
                border: 'none',
                background: !input.trim() || !currentModel ? 'var(--border-primary)' : 'var(--accent-primary)',
                color: 'white',
                cursor: !input.trim() || !currentModel ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (!(!input.trim() || !currentModel)) {
                  e.currentTarget.style.background = 'var(--accent-hover)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }
              }}
              onMouseLeave={(e) => {
                if (!(!input.trim() || !currentModel)) {
                  e.currentTarget.style.background = 'var(--accent-primary)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }
              }}
            >
              <Send size={16} />
              Send
            </button>
          )}
        </form>

        {/* Tool Bar - Model Selector and Parameter Adjuster */}
        <div style={{
          display: 'flex',
          gap: '12px',
          alignItems: 'center',
        }}>
          <div 
            style={{
              padding: '8px 12px',
              borderRadius: '12px',
              border: '2px solid var(--border-primary)',
              background: 'transparent',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s ease',
              cursor: 'pointer',
              minWidth: 'auto',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent-primary)';
              e.currentTarget.style.background = 'rgba(255, 107, 157, 0.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-primary)';
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <Bot size={16} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
            <select
              value={currentModel}
              onChange={(e) => setCurrentModel(e.target.value)}
              disabled={isGeneratingResponse}
              className="model-selector"
              style={{
                padding: '0',
                border: 'none',
                background: 'transparent',
                color: 'var(--text-primary)',
                fontSize: '13px',
                cursor: 'pointer',
                outline: 'none',
                minWidth: '120px',
                maxWidth: '200px',
              }}
            >
              <option value="" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
                Select a model...
              </option>
              {models.map((model) => (
                <option 
                  key={model.name} 
                  value={model.name}
                  style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                >
                  {model.name}
                </option>
              ))}
            </select>
          </div>
          
          {/* Parameter Adjuster Toggle */}
          <button
            onClick={() => setShowParameterPanel(!showParameterPanel)}
            style={{
              padding: '8px 12px',
              borderRadius: '12px',
              border: '2px solid var(--border-primary)',
              background: showParameterPanel ? 'rgba(255, 107, 157, 0.1)' : 'transparent',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '500',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent-primary)';
              e.currentTarget.style.background = 'rgba(255, 107, 157, 0.05)';
            }}
            onMouseLeave={(e) => {
              if (!showParameterPanel) {
                e.currentTarget.style.borderColor = 'var(--border-primary)';
                e.currentTarget.style.background = 'transparent';
              }
            }}
          >
            <Sliders size={16} />
            Parameters
          </button>
        </div>

        {/* Parameter Adjustment Panel */}
        {showParameterPanel && (
          <div style={{
            padding: '12px 16px',
            borderRadius: '12px',
            border: '2px solid var(--border-primary)',
            background: 'rgba(255, 107, 157, 0.02)',
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '12px',
            animation: 'slideDown 0.2s ease',
            alignItems: 'end',
          }}>
            {/* Temperature Slider */}
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '500' }}>
                Temperature: {chatParameters.temperature.toFixed(2)}
              </label>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={chatParameters.temperature}
                onChange={(e) => setChatParameters(prev => ({ ...prev, temperature: parseFloat(e.target.value) }))}
                style={{
                  width: '100%',
                  cursor: 'pointer',
                  marginTop: '6px',
                }}
              />
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                Creativity
              </p>
            </div>

            {/* Top-P Slider */}
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '500' }}>
                Top-P: {chatParameters.topP.toFixed(2)}
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={chatParameters.topP}
                onChange={(e) => setChatParameters(prev => ({ ...prev, topP: parseFloat(e.target.value) }))}
                style={{
                  width: '100%',
                  cursor: 'pointer',
                  marginTop: '6px',
                }}
              />
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                Diversity
              </p>
            </div>

            {/* Top-K Slider */}
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '500' }}>
                Top-K: {chatParameters.topK}
              </label>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={chatParameters.topK}
                onChange={(e) => setChatParameters(prev => ({ ...prev, topK: parseInt(e.target.value) }))}
                style={{
                  width: '100%',
                  cursor: 'pointer',
                  marginTop: '6px',
                }}
              />
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                Top candidates
              </p>
            </div>

            {/* Repeat Penalty Slider */}
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '500' }}>
                Repeat Penalty: {chatParameters.repeatPenalty.toFixed(2)}
              </label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={chatParameters.repeatPenalty}
                onChange={(e) => setChatParameters(prev => ({ ...prev, repeatPenalty: parseFloat(e.target.value) }))}
                style={{
                  width: '100%',
                  cursor: 'pointer',
                  marginTop: '6px',
                }}
              />
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                Avoid repetition
              </p>
            </div>

            {/* Max Tokens Slider */}
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '500' }}>
                Max Tokens: {chatParameters.maxTokens}
              </label>
              <input
                type="range"
                min="100"
                max="4096"
                step="100"
                value={chatParameters.maxTokens}
                onChange={(e) => setChatParameters(prev => ({ ...prev, maxTokens: parseInt(e.target.value) }))}
                style={{
                  width: '100%',
                  cursor: 'pointer',
                  marginTop: '6px',
                }}
              />
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                Response length
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}