/**
 * Toast Notification Component
 * 
 * Beautiful, non-intrusive notifications with cute pink theme.
 * Replaces Windows alert() dialogs with styled toast messages.
 */

import { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import './Toast.css';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastData {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  dismissible?: boolean;
}

interface ToastProps extends ToastData {
  onClose: (id: string) => void;
}

const toastIcons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

function Toast({ id, type, title, message, duration = 5000, dismissible = true, onClose }: ToastProps) {
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(100);
  const Icon = toastIcons[type];

  useEffect(() => {
    if (duration > 0) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          const next = prev - (100 / (duration / 100));
          return next <= 0 ? 0 : next;
        });
      }, 100);

      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => {
        clearInterval(interval);
        clearTimeout(timer);
      };
    }
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose(id);
    }, 300);
  };

  return (
    <div className={`toast ${type} ${isExiting ? 'exiting' : ''}`}>
      <div className="toast-icon">
        <Icon size={16} />
      </div>
      
      <div className="toast-content">
        <div className="toast-title">{title}</div>
        {message && <div className="toast-message">{message}</div>}
      </div>

      {dismissible && (
        <button className="toast-close" onClick={handleClose}>
          <X size={16} />
        </button>
      )}

      {duration > 0 && (
        <div className="toast-progress" style={{ width: `${progress}%` }} />
      )}
    </div>
  );
}

export default Toast;
