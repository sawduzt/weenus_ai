import { useState, useEffect } from 'react';
import Store from 'electron-store';

// Initialize electron-store for persistence
const store = new Store({
  defaults: {
    hasSeenOnboarding: false,
  },
});

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
 * Persists state using electron-store so it survives app restarts
 */
export function useOnboarding(): UseOnboardingReturn {
  const [isOpen, setIsOpen] = useState(false);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);

  // Check if onboarding has been seen on mount
  useEffect(() => {
    try {
      const seen = store.get('hasSeenOnboarding') as boolean;
      setHasSeenOnboarding(seen);
      // Show onboarding if user hasn't seen it yet
      if (!seen) {
        setIsOpen(true);
      }
    } catch (error) {
      console.error('Failed to read onboarding state:', error);
      // If we can't read the store, assume first time
      setIsOpen(true);
    }
  }, []);

  const handleClose = (): void => {
    setIsOpen(false);
    setHasSeenOnboarding(true);
    try {
      store.set('hasSeenOnboarding', true);
    } catch (error) {
      console.error('Failed to save onboarding state:', error);
    }
  };

  const resetOnboarding = (): void => {
    setHasSeenOnboarding(false);
    setIsOpen(true);
    try {
      store.set('hasSeenOnboarding', false);
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
