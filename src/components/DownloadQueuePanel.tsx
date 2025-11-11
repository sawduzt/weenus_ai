/**
 * Download Queue Panel Component
 * Displays active and pending model downloads
 */

import { useState, useEffect } from 'react';
import { X, ChevronDown, Check, AlertCircle, Clock } from 'lucide-react';
import { downloadQueueStore, QueuedDownload } from '../store/downloadQueue';
import './DownloadQueuePanel.css';

export function DownloadQueuePanel(): JSX.Element {
  const [queue, setQueue] = useState<QueuedDownload[]>([]);
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    const unsubscribe = downloadQueueStore.subscribe(setQueue);
    return unsubscribe;
  }, []);

  // Filter to only show active, pending, and failed downloads
  const activeItems = queue.filter(q => 
    q.status === 'downloading' || 
    q.status === 'processing' || 
    q.status === 'pending' || 
    q.status === 'failed'
  );

  if (activeItems.length === 0) {
    return <></>;
  }

  const activeDownload = activeItems.find(q => q.status === 'downloading' || q.status === 'processing');
  const pendingCount = activeItems.filter(q => q.status === 'pending').length;
  const completedCount = queue.filter(q => q.status === 'completed').length;

  return (
    <div className="download-queue-panel">
      <div className="queue-header" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="queue-title-section">
          <span className="queue-title">Downloads</span>
          <span className="queue-badge">
            {activeItems.length}
          </span>
        </div>
        <ChevronDown size={18} className={isExpanded ? 'chevron-open' : 'chevron-closed'} />
      </div>

      {isExpanded && (
        <div className="queue-content">
          {/* Active/Current Download */}
          {activeDownload && (
            <div className="queue-item active">
              <div className="queue-item-info">
                <div className="queue-item-name">{activeDownload.modelName}</div>
                <div className="queue-item-status">{activeDownload.progressText}</div>
              </div>

              <div className="queue-item-progress-section">
                <div className="queue-progress-bar">
                  <div
                    className="queue-progress-fill"
                    style={{ width: `${activeDownload.progress}%` }}
                  />
                </div>
                <div className="queue-item-meta">
                  <span className="queue-percentage">{Math.round(activeDownload.progress)}%</span>
                  {activeDownload.eta > 0 && (
                    <span className="queue-eta">
                      <Clock size={12} />
                      {formatETA(activeDownload.eta)}
                    </span>
                  )}
                </div>
              </div>

              <button
                className="queue-cancel-btn"
                title="Cancel download"
                onClick={() => handleCancelDownload(activeDownload.id)}
              >
                <X size={16} />
              </button>
            </div>
          )}

          {/* Pending Downloads */}
          {pendingCount > 0 && (
            <div className="queue-pending-section">
              <div className="queue-section-label">Queued ({pendingCount})</div>
              {queue
                .filter(q => q.status === 'pending')
                .map(item => (
                  <div key={item.id} className="queue-item pending">
                    <div className="queue-item-name">{item.modelName}</div>
                    <button
                      className="queue-cancel-btn"
                      title="Remove from queue"
                      onClick={() => handleCancelDownload(item.id)}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
            </div>
          )}

          {/* Completed Downloads */}
          {completedCount > 0 && (
            <div className="queue-completed-section">
              <div className="queue-section-label">Completed ({completedCount})</div>
              {queue
                .filter(q => q.status === 'completed')
                .map(item => (
                  <div key={item.id} className="queue-item completed">
                    <Check size={16} className="queue-check" />
                    <div className="queue-item-name">{item.modelName}</div>
                    <button
                      className="queue-close-btn"
                      title="Remove"
                      onClick={() => downloadQueueStore.removeFromQueue(item.id)}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
            </div>
          )}

          {/* Failed Downloads */}
          {activeItems.filter(q => q.status === 'failed').length > 0 && (
            <div className="queue-failed-section">
              {activeItems
                .filter(q => q.status === 'failed')
                .map(item => (
                  <div key={item.id} className="queue-item failed">
                    <AlertCircle size={16} className="queue-error" />
                    <div className="queue-item-name">{item.modelName}</div>
                    <button
                      className="queue-close-btn"
                      title="Remove"
                      onClick={() => downloadQueueStore.removeFromQueue(item.id)}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function formatETA(seconds: number): string {
  if (seconds < 60) {
    return `${Math.round(seconds)}s`;
  } else if (seconds < 3600) {
    const minutes = Math.round(seconds / 60);
    return `${minutes}m`;
  } else {
    const hours = Math.round(seconds / 3600);
    return `${hours}h`;
  }
}

function handleCancelDownload(id: string): void {
  downloadQueueStore.cancelDownload(id);
}
