/**
 * Chat Page Component
 * 
 * Main chat interface for interacting with AI models via Ollama.
 */

import { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, RefreshCw } from 'lucide-react';
import { useOllama } from '../hooks/useOllama';
import { useChat } from '../hooks/useChat';
import { useToast } from '../components/ui/ToastProvider';
import { chatService } from '../services/chat';
import type { ChatMessage } from '../types/chat.types';
import './ChatPage.css';

export interface ChatPageProps {
  activeChatId: string | null;
  onChatChange: (chatId: string | null) => void;
}

export function ChatPage({ activeChatId, onChatChange }: ChatPageProps): JSX.Element {
  const [input, setInput] = useState('');
  const [streamingResponse, setStreamingResponse] = useState('');
  const [isCheckingConnection, setIsCheckingConnection] = useState(true);
  const [isStartingOllama, setIsStartingOllama] = useState(false);
  const [isGeneratingResponse, setIsGeneratingResponse] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
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

      // Generate AI response using /api/chat endpoint
      let fullResponse = '';
      const response = await fetch('http://localhost:11434/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: currentModel,
          messages: conversationMessages,
          stream: true,
        }),
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
                setStreamingResponse(fullResponse);
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
      
      // Refresh chat to show assistant message
      await refreshChats();

      // Generate title if this was the first message
      if (isFirstMessage.current) {
        isFirstMessage.current = false;
        await chatService.generateTitle(chatId, userInput, currentModel);
        await refreshChats(); // Refresh again to show updated title
      }

      setStreamingResponse('');
    } catch (error) {
      console.error('Chat error:', error);
      toast.error('Chat Error', 'Failed to send message. Please try again.');
      setStreamingResponse('');
    } finally {
      setIsGeneratingResponse(false);
      setLoadingMessage('');
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
      <div className="page-header" style={{ padding: '12px 24px' }}>
        <div>
          <h1 style={{ fontSize: '18px', margin: '0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bot size={20} />
            AI Chat
          </h1>
          <p style={{ margin: '2px 0 0 0', fontSize: '12px' }}>Powered by Ollama</p>
        </div>
        
        {/* Model Selector */}
        <select
          value={currentModel}
          onChange={(e) => setCurrentModel(e.target.value)}
          disabled={isGeneratingResponse}
          className="model-selector"
          style={{
            padding: '8px 12px',
            borderRadius: '8px',
            border: '1px solid var(--border-primary)',
            background: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            fontSize: '14px',
            cursor: 'pointer',
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

            {/* Loading Indicator */}
            {isGeneratingResponse && !streamingResponse && (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                padding: '16px',
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
            disabled={!currentModel || isGeneratingResponse}
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
            disabled={!input.trim() || !currentModel || isGeneratingResponse}
            style={{
              padding: '12px 24px',
              borderRadius: '12px',
              border: 'none',
              background: !input.trim() || !currentModel || isGeneratingResponse ? 'var(--border)' : 'var(--pink)',
              color: 'white',
              cursor: !input.trim() || !currentModel || isGeneratingResponse ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Send size={16} />
            {isGeneratingResponse ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
}