/**
 * Ollama Service
 * 
 * Handles all interactions with the Ollama API including:
 * - Connection checking and status monitoring
 * - Model listing and management
 * - Chat streaming and message generation
 */

export interface OllamaModel {
  name: string;
  model: string;
  modified_at: string;
  size: number;
  digest: string;
  details: {
    format: string;
    family: string;
    parameter_size: string;
    quantization_level: string;
  };
}

export interface OllamaConnectionStatus {
  connected: boolean;
  version?: string;
  lastChecked: Date;
  error?: string;
  url: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatRequest {
  model: string;
  messages: ChatMessage[];
  stream?: boolean;
  options?: {
    temperature?: number;
    top_p?: number;
    top_k?: number;
  };
}

export interface ChatResponse {
  model: string;
  message: {
    role: string;
    content: string;
  };
  done: boolean;
}

class OllamaService {
  private baseUrl: string = 'http://localhost:11434';
  
  /**
   * Update the Ollama API base URL
   */
  setBaseUrl(url: string): void {
    this.baseUrl = url;
  }

  /**
   * Check if Ollama is running and accessible
   */
  async checkConnection(): Promise<OllamaConnectionStatus> {
    const status: OllamaConnectionStatus = {
      connected: false,
      lastChecked: new Date(),
      url: this.baseUrl,
    };

    try {
      const response = await fetch(`${this.baseUrl}/api/version`, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });

      if (response.ok) {
        const data = await response.json();
        status.connected = true;
        status.version = data.version;
      } else {
        status.error = `HTTP ${response.status}: ${response.statusText}`;
      }
    } catch (error) {
      status.error = error instanceof Error ? error.message : 'Connection failed';
    }

    return status;
  }

  /**
   * Get list of installed models
   */
  async listModels(): Promise<OllamaModel[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch models: ${response.statusText}`);
      }

      const data = await response.json();
      return data.models || [];
    } catch (error) {
      console.error('Error listing models:', error);
      throw error;
    }
  }

  /**
   * Stream chat responses from Ollama
   */
  async *streamChat(request: ChatRequest): AsyncGenerator<string, void, unknown> {
    try {
      const response = await fetch(`${this.baseUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...request,
          stream: true,
        }),
      });

      if (!response.ok) {
        throw new Error(`Chat request failed: ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Response body is not readable');
      }

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
              const data: ChatResponse = JSON.parse(line);
              if (data.message?.content) {
                yield data.message.content;
              }
            } catch (e) {
              console.warn('Failed to parse line:', line);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error streaming chat:', error);
      throw error;
    }
  }

  /**
   * Send a non-streaming chat request
   */
  async chat(request: ChatRequest): Promise<ChatResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...request,
          stream: false,
        }),
      });

      if (!response.ok) {
        throw new Error(`Chat request failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error in chat request:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const ollamaService = new OllamaService();
