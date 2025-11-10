/**
 * Custom Window Controls Component
 * 
 * Provides custom minimize, maximize, and close buttons for the Electron window
 */

import { useState, useEffect } from 'react';
import { Minus, Square, X } from 'lucide-react';
import './WindowControls.css';

export function WindowControls(): JSX.Element {
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    // Debug: Check if electronAPI is available
    console.log('🔍 WindowControls mounted, checking electronAPI:', {
      electronAPIExists: !!window.electronAPI,
      windowMethods: window.electronAPI?.window ? Object.keys(window.electronAPI.window) : 'No window methods',
      fullAPI: window.electronAPI,
      contextIsolated: 'contextIsolated' in process ? process.contextIsolated : 'unknown'
    });
    
    // Test API availability after a delay
    setTimeout(() => {
      console.log('🔍 WindowControls delayed check:', {
        electronAPI: !!window.electronAPI,
        windowAPI: !!window.electronAPI?.window,
        minimizeMethod: typeof window.electronAPI?.window?.minimize,
        maximizeMethod: typeof window.electronAPI?.window?.maximize,
        closeMethod: typeof window.electronAPI?.window?.close
      });
    }, 1000);
  }, []);

  const handleMinimize = () => {
    console.log('Minimize clicked, electronAPI available:', !!window.electronAPI);
    if (window.electronAPI?.window?.minimize) {
      window.electronAPI.window.minimize().catch(console.error);
    } else {
      console.error('electronAPI.window.minimize not available');
    }
  };

  const handleMaximize = () => {
    console.log('Maximize clicked, electronAPI available:', !!window.electronAPI);
    if (window.electronAPI?.window?.maximize) {
      window.electronAPI.window.maximize().then(() => {
        setIsMaximized(!isMaximized);
      }).catch(console.error);
    } else {
      console.error('electronAPI.window.maximize not available');
    }
  };

  const handleClose = () => {
    console.log('Close clicked, electronAPI available:', !!window.electronAPI);
    if (window.electronAPI?.window?.close) {
      window.electronAPI.window.close().catch(console.error);
    } else {
      console.error('electronAPI.window.close not available');
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