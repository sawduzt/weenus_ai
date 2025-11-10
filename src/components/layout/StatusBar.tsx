/**
 * Status Bar Component
 * 
 * Displays connection status, system information, and quick status indicators
 * at the bottom of the application window.
 */

import { ConnectionStatus } from '../../types/global.types';
import './StatusBar.css';

export interface StatusBarProps {
  connectionStatus: ConnectionStatus;
}

export function StatusBar({ connectionStatus }: StatusBarProps): JSX.Element {
  const formatLastChecked = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    
    if (seconds < 60) {
      return `${seconds}s ago`;
    } else if (seconds < 3600) {
      return `${Math.floor(seconds / 60)}m ago`;
    } else {
      return `${Math.floor(seconds / 3600)}h ago`;
    }
  };

  const getConnectionStatusText = (): string => {
    if (connectionStatus.connected) {
      return `Connected to Ollama`;
    } else {
      return connectionStatus.error || 'Ollama Disconnected';
    }
  };

  return (
    <div className="status-bar">
      {/* Connection Status */}
      <div className="status-section connection-status">
        <span 
          className="status-icon" 
          style={{ 
            color: connectionStatus.connected ? '#22c55e' : '#ef4444',
            fontSize: '12px',
          }}
        >
          ●
        </span>
        <span className="status-text">{getConnectionStatusText()}</span>
        <span className="status-detail">
          Last checked: {formatLastChecked(connectionStatus.lastChecked)}
        </span>
      </div>

      {/* System Information */}
      <div className="status-section system-info">
        <span className="status-item">
          <span className="status-label">Memory:</span>
          <span className="status-value">--</span>
        </span>
        <span className="status-item">
          <span className="status-label">GPU:</span>
          <span className="status-value">--</span>
        </span>
        <span className="status-item">
          <span className="status-label">Tokens/s:</span>
          <span className="status-value">--</span>
        </span>
      </div>

      {/* Application Info */}
      <div className="status-section app-info">
        <span className="app-version">Weenus AI v0.1.0</span>
        <span className="build-info">Development Build</span>
      </div>
    </div>
  );
}