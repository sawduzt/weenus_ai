import { useState, useEffect } from 'react';

interface UseOnboardingReturn {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  hasSeenOnboarding: boolean;
  resetOnboarding: () => void;
  showOnboarding: () => void;
}

/**
 * Hook to manage onboarding state
 * 
 * Tracks if user has seen onboarding and provides controls to show/hide it
 * Persists state using electron-store via IPC
 */
export function useOnboarding(): UseOnboardingReturn {
  const [isOpen, setIsOpen] = useState(false);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);

  // Check if onboarding has been seen on mount
  useEffect(() => {
    const checkOnboardingState = async (): Promise<void> => {
      try {
        // Try to use electron IPC first
        if (window.electronAPI && window.electronAPI.store) {
          const seen = await window.electronAPI.store.get('hasSeenOnboarding');
          setHasSeenOnboarding(seen || false);
          if (!seen) {
            setIsOpen(true);
          }
        } else {
          // Fallback: assume first time if no electron API
          console.warn('Electron API not available, showing onboarding');
          setIsOpen(true);
        }
      } catch (error) {
        console.error('Failed to read onboarding state:', error);
        // If we can't read the store, assume first time
        setIsOpen(true);
      }
    };

    checkOnboardingState();
  }, []);

  const handleClose = (): void => {
    setIsOpen(false);
    setHasSeenOnboarding(true);
    try {
      if (window.electronAPI && window.electronAPI.store) {
        window.electronAPI.store.set('hasSeenOnboarding', true);
      }
    } catch (error) {
      console.error('Failed to save onboarding state:', error);
    }
  };

  const resetOnboarding = (): void => {
    setHasSeenOnboarding(false);
    setIsOpen(true);
    try {
      if (window.electronAPI && window.electronAPI.store) {
        window.electronAPI.store.set('hasSeenOnboarding', false);
      }
    } catch (error) {
      console.error('Failed to reset onboarding state:', error);
    }
  };

  const showOnboarding = (): void => {
    setIsOpen(true);
  };

  return {
    isOpen,
    setIsOpen: (open: boolean) => {
      setIsOpen(open);
      if (!open) {
        handleClose();
      }
    },
    hasSeenOnboarding,
    resetOnboarding,
    showOnboarding,
  };
}
