/**
 * useOllama Hook
 * 
 * React hook for managing Ollama connection state, models, and chat functionality
 */

import { useState, useCallback, useEffect } from 'react';
import { 
  ollamaService, 
  OllamaModel, 
  OllamaConnectionStatus,
  ChatMessage,
  ChatRequest 
} from '../services/ollama';

interface UseOllamaReturn {
  // Connection state
  isConnected: boolean;
  connectionStatus: OllamaConnectionStatus;
  checkConnection: () => Promise<void>;

  // Model management
  models: OllamaModel[];
  isLoadingModels: boolean;
  loadModels: () => Promise<void>;

  // Chat state
  messages: ChatMessage[];
  currentModel: string;
  setCurrentModel: (model: string) => void;
  isGenerating: boolean;

  // Chat actions
  sendMessage: (content: string) => Promise<void>;
  sendMessageStream: (content: string, onChunk: (chunk: string) => void) => Promise<void>;
  clearMessages: () => void;
}

export function useOllama(): UseOllamaReturn {
  const [connectionStatus, setConnectionStatus] = useState<OllamaConnectionStatus>({
    connected: false,
    lastChecked: new Date(),
    url: 'http://localhost:11434',
  });

  const [models, setModels] = useState<OllamaModel[]>([]);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentModel, setCurrentModel] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  /**
   * Check Ollama connection status
   */
  const checkConnection = useCallback(async () => {
    const status = await ollamaService.checkConnection();
    setConnectionStatus(status);
  }, []);

  /**
   * Load available models
   */
  const loadModels = useCallback(async () => {
    setIsLoadingModels(true);
    try {
      const modelList = await ollamaService.listModels();
      setModels(modelList);
      
      // Auto-select first model if none selected
      if (!currentModel && modelList.length > 0) {
        setCurrentModel(modelList[0].name);
      }
    } catch (error) {
      console.error('Failed to load models:', error);
      setModels([]);
    } finally {
      setIsLoadingModels(false);
    }
  }, [currentModel]);

  /**
   * Send a message without streaming
   */
  const sendMessage = useCallback(async (content: string) => {
    if (!currentModel || isGenerating) return;

    const userMessage: ChatMessage = { role: 'user', content };
    setMessages(prev => [...prev, userMessage]);
    setIsGenerating(true);

    try {
      const request: ChatRequest = {
        model: currentModel,
        messages: [...messages, userMessage],
        stream: false,
      };

      const response = await ollamaService.chat(request);
      
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.message.content,
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsGenerating(false);
    }
  }, [currentModel, messages, isGenerating]);

  /**
   * Send a message with streaming response
   */
  const sendMessageStream = useCallback(async (
    content: string, 
    onChunk: (chunk: string) => void
  ) => {
    if (!currentModel || isGenerating) return;

    const userMessage: ChatMessage = { role: 'user', content };
    setMessages(prev => [...prev, userMessage]);
    setIsGenerating(true);

    try {
      const request: ChatRequest = {
        model: currentModel,
        messages: [...messages, userMessage],
        stream: true,
      };

      let fullResponse = '';
      
      for await (const chunk of ollamaService.streamChat(request)) {
        fullResponse += chunk;
        onChunk(chunk);
      }

      // Add complete assistant message to history
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: fullResponse,
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error streaming message:', error);
    } finally {
      setIsGenerating(false);
    }
  }, [currentModel, messages, isGenerating]);

  /**
   * Clear chat history
   */
  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  /**
   * Auto-check connection on mount
   */
  useEffect(() => {
    checkConnection();
  }, [checkConnection]);

  return {
    // Connection
    isConnected: connectionStatus.connected,
    connectionStatus,
    checkConnection,

    // Models
    models,
    isLoadingModels,
    loadModels,

    // Chat
    messages,
    currentModel,
    setCurrentModel,
    isGenerating,
    sendMessage,
    sendMessageStream,
    clearMessages,
  };
}
