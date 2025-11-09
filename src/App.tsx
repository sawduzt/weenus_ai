/**
 * Main Application Component
 * 
 * This is the root component of the Weenus AI application.
 * It handles the overall layout, theme management, and routing.
 */

import React, { useState, useEffect } from 'react';
import { MainLayout } from './components/layout/MainLayout';
import { ChatPage } from './pages/ChatPage';
import { SettingsPage } from './pages/SettingsPage';
import { ModelLibraryPage } from './pages/ModelLibraryPage';
import { ImageGenerationPage } from './pages/ImageGenerationPage';
import { VideoGenerationPage } from './pages/VideoGenerationPage';
import { ThemeProvider } from './components/theme/ThemeProvider';
import { useOllama } from './hooks/useOllama';
import './styles/global.css';

export type AppPage = 'chat' | 'settings' | 'models' | 'image-gen' | 'video-gen';

export interface AppState {
  currentPage: AppPage;
  sidebarCollapsed: boolean;
  currentTheme: string;
}

function App(): JSX.Element {
  // Application state
  const [appState, setAppState] = useState<AppState>({
    currentPage: 'chat',
    sidebarCollapsed: false,
    currentTheme: 'dark',
  });

  // Ollama connection monitoring
  const { isConnected, connectionStatus, checkConnection } = useOllama();

  // Initialize connection check on app start
  useEffect(() => {
    checkConnection();
  }, [checkConnection]);

  // Navigation handler
  const handlePageChange = (page: AppPage): void => {
    setAppState(prev => ({ ...prev, currentPage: page }));
  };

  // Sidebar toggle handler
  const handleSidebarToggle = (): void => {
    setAppState(prev => ({ ...prev, sidebarCollapsed: !prev.sidebarCollapsed }));
  };

  // Theme change handler
  const handleThemeChange = (theme: string): void => {
    setAppState(prev => ({ ...prev, currentTheme: theme }));
  };

  // Render current page
  const renderCurrentPage = (): JSX.Element => {
    switch (appState.currentPage) {
      case 'chat':
        return <ChatPage />;
      case 'settings':
        return <SettingsPage onThemeChange={handleThemeChange} />;
      case 'models':
        return <ModelLibraryPage />;
      case 'image-gen':
        return <ImageGenerationPage />;
      case 'video-gen':
        return <VideoGenerationPage />;
      default:
        return <ChatPage />;
    }
  };

  return (
    <ThemeProvider theme={appState.currentTheme}>
      <div className="app">
        <MainLayout
          currentPage={appState.currentPage}
          sidebarCollapsed={appState.sidebarCollapsed}
          connectionStatus={connectionStatus}
          onPageChange={handlePageChange}
          onSidebarToggle={handleSidebarToggle}
        >
          {renderCurrentPage()}
        </MainLayout>
      </div>
    </ThemeProvider>
  );
}

export default App;