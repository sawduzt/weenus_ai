/**
 * Theme Provider Component
 * 
 * Provides theme context and management for the application.
 * Handles theme switching and persistence.
 */

import React, { createContext, useContext, useEffect } from 'react';

export interface ThemeContextType {
  theme: string;
  setTheme: (theme: string) => void;
  availableThemes: string[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export interface ThemeProviderProps {
  theme: string;
  children: React.ReactNode;
}

export function ThemeProvider({ theme, children }: ThemeProviderProps): JSX.Element {
  const availableThemes = ['dark', 'light'];

  const setTheme = (newTheme: string): void => {
    if (availableThemes.includes(newTheme)) {
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('weenus-theme', newTheme);
    }
  };

  // Apply theme on mount and when theme changes
  useEffect(() => {
    setTheme(theme);
  }, [theme]);

  // Load saved theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('weenus-theme');
    if (savedTheme && availableThemes.includes(savedTheme)) {
      setTheme(savedTheme);
    }
  }, []);

  const contextValue: ThemeContextType = {
    theme,
    setTheme,
    availableThemes,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}