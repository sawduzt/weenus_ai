/**
 * Streaming Chat Service
 * 
 * Manages ongoing streaming responses at the application level,
 * allowing streaming to continue even when navigating away from ChatPage.
 */

interface StreamingState {
  isStreaming: boolean;
  chatId: string | null;
  currentResponse: string;
  abortController: AbortController | null;
}

class StreamingChatService {
  private state: StreamingState = {
    isStreaming: false,
    chatId: null,
    currentResponse: '',
    abortController: null,
  };

  private listeners: Map<string, Set<(state: StreamingState) => void>> = new Map();

  /**
   * Subscribe to streaming state changes
   */
  subscribe(key: string, listener: (state: StreamingState) => void): () => void {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    this.listeners.get(key)!.add(listener);

    // Return unsubscribe function
    return () => {
      this.listeners.get(key)?.delete(listener);
    };
  }

  /**
   * Notify all listeners of state changes
   */
  private notifyListeners(): void {
    this.listeners.forEach((listeners) => {
      listeners.forEach((listener) => listener(this.state));
    });
  }

  /**
   * Start streaming
   */
  startStreaming(chatId: string): void {
    this.state.isStreaming = true;
    this.state.chatId = chatId;
    this.state.currentResponse = '';
    this.state.abortController = new AbortController();
    this.notifyListeners();
  }

  /**
   * Append to current response
   */
  appendResponse(chunk: string): void {
    this.state.currentResponse += chunk;
    this.notifyListeners();
  }

  /**
   * Get current streaming response
   */
  getResponse(): string {
    return this.state.currentResponse;
  }

  /**
   * Get abort controller for current stream
   */
  getAbortSignal(): AbortSignal | null {
    return this.state.abortController?.signal || null;
  }

  /**
   * End streaming
   */
  endStreaming(): void {
    this.state.isStreaming = false;
    this.state.currentResponse = '';
    this.state.abortController = null;
    this.notifyListeners();
  }

  /**
   * Cancel streaming
   */
  cancelStreaming(): void {
    this.state.abortController?.abort();
    this.endStreaming();
  }

  /**
   * Check if currently streaming
   */
  isStreaming(): boolean {
    return this.state.isStreaming;
  }

  /**
   * Get current state
   */
  getState(): StreamingState {
    return { ...this.state };
  }

  /**
   * Reset service
   */
  reset(): void {
    this.state.abortController?.abort();
    this.state = {
      isStreaming: false,
      chatId: null,
      currentResponse: '',
      abortController: null,
    };
    this.notifyListeners();
  }
}

export const streamingChatService = new StreamingChatService();
