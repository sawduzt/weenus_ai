/**
 * Custom Window Controls Component
 * 
 * Provides custom minimize, maximize, and close buttons for the Electron window
 */

import { useState } from 'react';
import { Minus, Square, X } from 'lucide-react';
import './WindowControls.css';

export function WindowControls(): JSX.Element {
  const [isMaximized, setIsMaximized] = useState(false);

  const handleMinimize = () => {
    if (window.electronAPI?.window?.minimize) {
      window.electronAPI.window.minimize().catch(console.error);
    }
  };

  const handleMaximize = () => {
    if (window.electronAPI?.window?.maximize) {
      window.electronAPI.window.maximize().then(() => {
        setIsMaximized(!isMaximized);
      }).catch(console.error);
    }
  };

  const handleClose = () => {
    if (window.electronAPI?.window?.close) {
      window.electronAPI.window.close().catch(console.error);
    }
  };

  return (
    <div className="window-controls">
      <button
        className="window-control minimize"
        onClick={handleMinimize}
        title="Minimize"
      >
        <Minus size={14} />
      </button>
      <button
        className="window-control maximize"
        onClick={handleMaximize}
        title={isMaximized ? "Restore" : "Maximize"}
      >
        <Square size={14} />
      </button>
      <button
        className="window-control close"
        onClick={handleClose}
        title="Close"
      >
        <X size={14} />
      </button>
    </div>
  );
}