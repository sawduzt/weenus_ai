/**
 * Ollama API Client Service
 * 
 * This service handles all communication with the Ollama API, including:
 * - Model discovery and management
 * - Chat completions and streaming
 * - Connection status monitoring
 * - Error handling and reconnection logic
 */

export interface OllamaModel {
  name: string;
  model: string;
  size: number;
  digest: string;
  details: {
    format: string;
    family: string;
    families: string[] | null;
    parameter_size: string;
    quantization_level: string;
  };
  expires_at: string;
  modified_at: string;
}

export interface OllamaMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
  images?: string[]; // Base64 encoded images for multimodal models
}

export interface OllamaChatRequest {
  model: string;
  messages: OllamaMessage[];
  stream?: boolean;
  options?: {
    temperature?: number;
    top_p?: number;
    top_k?: number;
    repeat_penalty?: number;
    seed?: number;
    num_predict?: number;
    stop?: string[];
  };
}

export interface OllamaChatResponse {
  model: string;
  created_at: string;
  message: OllamaMessage;
  done: boolean;
  total_duration?: number;
  load_duration?: number;
  prompt_eval_count?: number;
  prompt_eval_duration?: number;
  eval_count?: number;
  eval_duration?: number;
}

export interface OllamaConnectionStatus {
  connected: boolean;
  version?: string;
  lastChecked: Date;
  error?: string;
}

export class OllamaApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'OllamaApiError';
  }
}

export class OllamaService {
  private baseUrl: string;
  private connectionStatus: OllamaConnectionStatus;
  private connectionCheckInterval: number | null = null;
  private eventListeners: Map<string, Set<Function>> = new Map();

  constructor(baseUrl: string = 'http://localhost:11434') {
    this.baseUrl = baseUrl.replace(/\/$/, ''); // Remove trailing slash
    this.connectionStatus = {
      connected: false,
      lastChecked: new Date(),
    };
    
    // Start connection monitoring
    this.startConnectionMonitoring();
  }

  /**
   * Start monitoring the connection to Ollama
   */
  private startConnectionMonitoring(): void {
    this.checkConnection();
    this.connectionCheckInterval = setInterval(() => {
      this.checkConnection();
    }, 10000); // Check every 10 seconds
  }

  /**
   * Stop connection monitoring
   */
  public stopConnectionMonitoring(): void {
    if (this.connectionCheckInterval) {
      clearInterval(this.connectionCheckInterval);
      this.connectionCheckInterval = null;
    }
  }

  /**
   * Check if Ollama is running and accessible
   */
  public async checkConnection(): Promise<OllamaConnectionStatus> {
    try {
      const response = await fetch(`${this.baseUrl}/api/version`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000), // 5 second timeout
      });

      if (!response.ok) {
        throw new OllamaApiError(
          `HTTP ${response.status}: ${response.statusText}`,
          response.status
        );
      }

      const data = await response.json();
      this.connectionStatus = {
        connected: true,
        version: data.version,
        lastChecked: new Date(),
      };
    } catch (error) {
      this.connectionStatus = {
        connected: false,
        lastChecked: new Date(),
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }

    this.emit('connectionStatusChanged', this.connectionStatus);
    return this.connectionStatus;
  }

  /**
   * Get current connection status
   */
  public getConnectionStatus(): OllamaConnectionStatus {
    return { ...this.connectionStatus };
  }

  /**
   * Get list of available models
   */
  public async getModels(): Promise<OllamaModel[]> {
    if (!this.connectionStatus.connected) {
      throw new OllamaApiError('Not connected to Ollama');
    }

    try {
      const response = await fetch(`${this.baseUrl}/api/tags`);
      
      if (!response.ok) {
        throw new OllamaApiError(
          `Failed to fetch models: ${response.statusText}`,
          response.status
        );
      }

      const data = await response.json();
      return data.models || [];
    } catch (error) {
      if (error instanceof OllamaApiError) throw error;
      throw new OllamaApiError(
        `Failed to fetch models: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Send a chat message and get response
   */
  public async chat(request: OllamaChatRequest): Promise<OllamaChatResponse> {
    if (!this.connectionStatus.connected) {
      throw new OllamaApiError('Not connected to Ollama');
    }

    try {
      const response = await fetch(`${this.baseUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...request, stream: false }),
      });

      if (!response.ok) {
        throw new OllamaApiError(
          `Chat request failed: ${response.statusText}`,
          response.status
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof OllamaApiError) throw error;
      throw new OllamaApiError(
        `Chat request failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Send a chat message with streaming response
   */
  public async *chatStream(request: OllamaChatRequest): AsyncGenerator<OllamaChatResponse> {
    if (!this.connectionStatus.connected) {
      throw new OllamaApiError('Not connected to Ollama');
    }

    try {
      const response = await fetch(`${this.baseUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...request, stream: true }),
      });

      if (!response.ok) {
        throw new OllamaApiError(
          `Chat stream request failed: ${response.statusText}`,
          response.status
        );
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new OllamaApiError('Failed to get response stream reader');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || ''; // Keep incomplete line in buffer

          for (const line of lines) {
            if (line.trim()) {
              try {
                const chunk: OllamaChatResponse = JSON.parse(line);
                yield chunk;
                if (chunk.done) return;
              } catch (parseError) {
                console.warn('Failed to parse streaming response chunk:', line);
              }
            }
          }
        }
      } finally {
        reader.releaseLock();
      }
    } catch (error) {
      if (error instanceof OllamaApiError) throw error;
      throw new OllamaApiError(
        `Chat stream request failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Pull/download a model from Ollama registry
   */
  public async pullModel(modelName: string): Promise<void> {
    if (!this.connectionStatus.connected) {
      throw new OllamaApiError('Not connected to Ollama');
    }

    try {
      const response = await fetch(`${this.baseUrl}/api/pull`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: modelName }),
      });

      if (!response.ok) {
        throw new OllamaApiError(
          `Model pull failed: ${response.statusText}`,
          response.status
        );
      }

      // This endpoint streams progress, but for now we'll just wait for completion
      await response.text();
    } catch (error) {
      if (error instanceof OllamaApiError) throw error;
      throw new OllamaApiError(
        `Model pull failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Delete a model
   */
  public async deleteModel(modelName: string): Promise<void> {
    if (!this.connectionStatus.connected) {
      throw new OllamaApiError('Not connected to Ollama');
    }

    try {
      const response = await fetch(`${this.baseUrl}/api/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: modelName }),
      });

      if (!response.ok) {
        throw new OllamaApiError(
          `Model deletion failed: ${response.statusText}`,
          response.status
        );
      }
    } catch (error) {
      if (error instanceof OllamaApiError) throw error;
      throw new OllamaApiError(
        `Model deletion failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Event system for connection status changes
   */
  public on(event: string, callback: Function): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }
    this.eventListeners.get(event)!.add(callback);
  }

  public off(event: string, callback: Function): void {
    this.eventListeners.get(event)?.delete(callback);
  }

  private emit(event: string, data: any): void {
    this.eventListeners.get(event)?.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Error in event listener for ${event}:`, error);
      }
    });
  }

  /**
   * Cleanup resources
   */
  public destroy(): void {
    this.stopConnectionMonitoring();
    this.eventListeners.clear();
  }
}

// Singleton instance for global use
export const ollamaService = new OllamaService();