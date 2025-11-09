/**
 * React Hook for Ollama Integration
 * 
 * This hook provides a convenient way to interact with the Ollama service
 * from React components, handling state management and lifecycle automatically.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  ollamaService, 
  OllamaModel, 
  OllamaConnectionStatus, 
  OllamaChatRequest,
  OllamaChatResponse,
  OllamaMessage,
  OllamaApiError 
} from '../services/ollama';

export interface UseOllamaState {
  // Connection state
  connectionStatus: OllamaConnectionStatus;
  isConnected: boolean;
  
  // Models state
  models: OllamaModel[];
  isLoadingModels: boolean;
  modelsError: string | null;
  
  // Chat state
  isGenerating: boolean;
  chatError: string | null;
  
  // General loading state
  isLoading: boolean;
  error: string | null;
}

export interface UseOllamaActions {
  // Connection actions
  checkConnection: () => Promise<void>;
  
  // Model actions
  loadModels: () => Promise<void>;
  pullModel: (modelName: string) => Promise<void>;
  deleteModel: (modelName: string) => Promise<void>;
  
  // Chat actions
  sendMessage: (request: OllamaChatRequest) => Promise<OllamaChatResponse | null>;
  sendMessageStream: (
    request: OllamaChatRequest, 
    onChunk: (chunk: OllamaChatResponse) => void
  ) => Promise<void>;
  
  // Utility actions
  clearError: () => void;
  clearChatError: () => void;
}

export interface UseOllamaReturn extends UseOllamaState, UseOllamaActions {}

/**
 * Custom hook for Ollama integration
 */
export function useOllama(): UseOllamaReturn {
  // State management
  const [connectionStatus, setConnectionStatus] = useState<OllamaConnectionStatus>(
    ollamaService.getConnectionStatus()
  );
  
  const [models, setModels] = useState<OllamaModel[]>([]);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [modelsError, setModelsError] = useState<string | null>(null);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Track if component is mounted to prevent state updates after unmount
  const isMounted = useRef(true);
  
  // Connection status listener
  useEffect(() => {
    const handleConnectionStatusChange = (status: OllamaConnectionStatus) => {
      if (isMounted.current) {
        setConnectionStatus(status);
        
        // Clear errors if connection is restored
        if (status.connected && error) {
          setError(null);
        }
        
        // If connection is lost, clear models and set error
        if (!status.connected) {
          setModels([]);
          if (status.error) {
            setError(`Connection failed: ${status.error}`);
          }
        }
      }
    };
    
    ollamaService.on('connectionStatusChanged', handleConnectionStatusChange);
    
    return () => {
      ollamaService.off('connectionStatusChanged', handleConnectionStatusChange);
    };
  }, [error]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);
  
  // Actions
  const checkConnection = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      await ollamaService.checkConnection();
    } catch (err) {
      const errorMessage = err instanceof OllamaApiError ? err.message : 'Connection check failed';
      if (isMounted.current) {
        setError(errorMessage);
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  }, []);
  
  const loadModels = useCallback(async () => {
    try {
      setIsLoadingModels(true);
      setModelsError(null);
      const fetchedModels = await ollamaService.getModels();
      if (isMounted.current) {
        setModels(fetchedModels);
      }
    } catch (err) {
      const errorMessage = err instanceof OllamaApiError ? err.message : 'Failed to load models';
      if (isMounted.current) {
        setModelsError(errorMessage);
      }
    } finally {
      if (isMounted.current) {
        setIsLoadingModels(false);
      }
    }
  }, []);
  
  const pullModel = useCallback(async (modelName: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await ollamaService.pullModel(modelName);
      
      // Reload models after successful pull
      await loadModels();
    } catch (err) {
      const errorMessage = err instanceof OllamaApiError ? err.message : `Failed to pull model: ${modelName}`;
      if (isMounted.current) {
        setError(errorMessage);
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  }, [loadModels]);
  
  const deleteModel = useCallback(async (modelName: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await ollamaService.deleteModel(modelName);
      
      // Remove model from local state immediately
      if (isMounted.current) {
        setModels((prev: OllamaModel[]) => prev.filter((model: OllamaModel) => model.name !== modelName));
      }
    } catch (err) {
      const errorMessage = err instanceof OllamaApiError ? err.message : `Failed to delete model: ${modelName}`;
      if (isMounted.current) {
        setError(errorMessage);
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  }, []);
  
  const sendMessage = useCallback(async (request: OllamaChatRequest): Promise<OllamaChatResponse | null> => {
    try {
      setIsGenerating(true);
      setChatError(null);
      const response = await ollamaService.chat(request);
      return response;
    } catch (err) {
      const errorMessage = err instanceof OllamaApiError ? err.message : 'Chat request failed';
      if (isMounted.current) {
        setChatError(errorMessage);
      }
      return null;
    } finally {
      if (isMounted.current) {
        setIsGenerating(false);
      }
    }
  }, []);
  
  const sendMessageStream = useCallback(async (
    request: OllamaChatRequest,
    onChunk: (chunk: OllamaChatResponse) => void
  ): Promise<void> => {
    try {
      setIsGenerating(true);
      setChatError(null);
      
      for await (const chunk of ollamaService.chatStream(request)) {
        if (isMounted.current) {
          onChunk(chunk);
        }
      }
    } catch (err) {
      const errorMessage = err instanceof OllamaApiError ? err.message : 'Streaming chat request failed';
      if (isMounted.current) {
        setChatError(errorMessage);
      }
    } finally {
      if (isMounted.current) {
        setIsGenerating(false);
      }
    }
  }, []);
  
  const clearError = useCallback(() => {
    setError(null);
  }, []);
  
  const clearChatError = useCallback(() => {
    setChatError(null);
  }, []);
  
  // Computed properties
  const isConnected = connectionStatus.connected;
  
  return {
    // State
    connectionStatus,
    isConnected,
    models,
    isLoadingModels,
    modelsError,
    isGenerating,
    chatError,
    isLoading,
    error,
    
    // Actions
    checkConnection,
    loadModels,
    pullModel,
    deleteModel,
    sendMessage,
    sendMessageStream,
    clearError,
    clearChatError,
  };
}

/**
 * Hook for simplified chat functionality
 */
export function useOllamaChat(modelName?: string) {
  const ollama = useOllama();
  const [messages, setMessages] = useState<OllamaMessage[]>([]);
  const [currentModel, setCurrentModel] = useState<string>(modelName || '');
  
  const addMessage = useCallback((message: OllamaMessage) => {
    setMessages((prev: OllamaMessage[]) => [...prev, message]);
  }, []);
  
  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);
  
  const sendMessage = useCallback(async (content: string, options?: OllamaChatRequest['options']) => {
    if (!currentModel) {
      throw new Error('No model selected');
    }
    
    const userMessage: OllamaMessage = { role: 'user', content };
    addMessage(userMessage);
    
    const request: OllamaChatRequest = {
      model: currentModel,
      messages: [...messages, userMessage],
      options,
    };
    
    const response = await ollama.sendMessage(request);
    if (response?.message) {
      addMessage(response.message);
    }
    
    return response;
  }, [currentModel, messages, addMessage, ollama]);
  
  const sendMessageStream = useCallback(async (
    content: string, 
    onChunk: (content: string) => void,
    options?: OllamaChatRequest['options']
  ) => {
    if (!currentModel) {
      throw new Error('No model selected');
    }
    
    const userMessage: OllamaMessage = { role: 'user', content };
    addMessage(userMessage);
    
    const request: OllamaChatRequest = {
      model: currentModel,
      messages: [...messages, userMessage],
      options,
    };
    
    let assistantContent = '';
    await ollama.sendMessageStream(request, (chunk) => {
      if (chunk.message?.content) {
        assistantContent += chunk.message.content;
        onChunk(chunk.message.content);
      }
    });
    
    // Add complete assistant message
    addMessage({ role: 'assistant', content: assistantContent });
  }, [currentModel, messages, addMessage, ollama]);
  
  return {
    ...ollama,
    messages,
    currentModel,
    setCurrentModel,
    addMessage,
    clearMessages,
    sendMessage,
    sendMessageStream,
  };
}