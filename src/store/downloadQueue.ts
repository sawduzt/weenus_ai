/**
 * Download Queue Store
 * Manages a queue of model downloads with progress tracking
 */

export interface QueuedDownload {
  id: string;
  modelName: string;
  status: 'pending' | 'downloading' | 'processing' | 'completed' | 'failed' | 'cancelled';
  progress: number; // 0-100
  progressText: string;
  eta: number; // seconds remaining
  error?: string;
  createdAt: number;
  startedAt?: number;
  abortController?: AbortController;
}

type DownloadQueueListener = (queue: QueuedDownload[]) => void;
type CancelHandler = (id: string) => void;

class DownloadQueueStore {
  private queue: QueuedDownload[] = [];
  private listeners: Set<DownloadQueueListener> = new Set();
  private currentDownloadId: string | null = null;
  private cancelHandler: CancelHandler | null = null;

  subscribe(listener: DownloadQueueListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  setCancelHandler(handler: CancelHandler): void {
    this.cancelHandler = handler;
  }

  private notify(): void {
    this.listeners.forEach(listener => listener([...this.queue]));
  }

  addToQueue(modelName: string): string {
    const id = `${modelName}-${Date.now()}-${Math.random()}`;
    const download: QueuedDownload = {
      id,
      modelName,
      status: 'pending',
      progress: 0,
      progressText: 'Queued',
      eta: 0,
      createdAt: Date.now(),
      abortController: new AbortController(),
    };
    this.queue.push(download);
    this.notify();
    return id;
  }

  updateProgress(id: string, progress: number, statusText: string, eta: number = 0): void {
    const item = this.queue.find(q => q.id === id);
    if (item) {
      item.progress = Math.min(100, Math.max(0, progress));
      item.progressText = statusText;
      item.eta = eta;
      
      // Auto-detect status from text
      if (statusText.toLowerCase().includes('downloading')) {
        if (item.status === 'pending') {
          item.status = 'downloading';
          item.startedAt = Date.now();
          this.currentDownloadId = id;
        }
      } else if (statusText.toLowerCase().includes('creating') || statusText.toLowerCase().includes('processing')) {
        item.status = 'processing';
      }
      
      this.notify();
    }
  }

  setStatus(id: string, status: QueuedDownload['status'], error?: string): void {
    const item = this.queue.find(q => q.id === id);
    if (item) {
      item.status = status;
      if (error) item.error = error;
      
      if (status === 'completed' || status === 'failed' || status === 'cancelled') {
        if (this.currentDownloadId === id) {
          this.currentDownloadId = null;
        }
      }
      
      this.notify();
    }
  }

  getQueue(): QueuedDownload[] {
    return [...this.queue];
  }

  cancelDownload(id: string): void {
    const item = this.queue.find(q => q.id === id);
    if (item) {
      // Abort the fetch request if it's in progress
      if (item.abortController) {
        item.abortController.abort();
      }
      
      // Call the cancel handler to stop processing
      if (this.cancelHandler) {
        this.cancelHandler(id);
      }
      
      // Mark as cancelled if still downloading
      if (item.status === 'downloading' || item.status === 'processing') {
        this.setStatus(id, 'cancelled', 'Cancelled by user');
      } else if (item.status === 'pending') {
        this.removeFromQueue(id);
      }
    }
  }

  removeFromQueue(id: string): void {
    this.queue = this.queue.filter(q => q.id !== id);
    if (this.currentDownloadId === id) {
      this.currentDownloadId = null;
    }
    this.notify();
  }

  clearCompleted(): void {
    this.queue = this.queue.filter(q => q.status !== 'completed');
    this.notify();
  }

  isDownloading(): boolean {
    return this.currentDownloadId !== null;
  }

  getCurrentDownload(): string | null {
    return this.currentDownloadId;
  }

  // Get the next download to process
  getNextPending(): string | null {
    const pending = this.queue.find(q => q.status === 'pending');
    return pending ? pending.id : null;
  }
}

export const downloadQueueStore = new DownloadQueueStore();
