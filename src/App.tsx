/**
 * Main Application Component
 * 
 * This is the root component of the Weenus AI application.
 * It handles the overall layout, theme management, and routing.
 */

import { useState } from 'react';
import { MainLayout } from './components/layout/MainLayout';
import { ChatPage } from './pages/ChatPage';
import { SettingsPage } from './pages/SettingsPage';
import { ModelLibraryPage } from './pages/ModelLibraryPage';
import { ImageGenerationPage } from './pages/ImageGenerationPage';
import { VideoGenerationPage } from './pages/VideoGenerationPage';
import { ThemeProvider } from './components/theme/ThemeProvider';
import { ToastProvider } from './components/ui/ToastProvider';
import { Onboarding } from './components/Onboarding';
import { useOllama } from './hooks/useOllama';
import { useOnboarding } from './hooks/useOnboarding';
import './styles/global.css';

export type AppPage = 'chat' | 'settings' | 'models' | 'image-gen' | 'video-gen';

export interface AppState {
  currentPage: AppPage;
  sidebarCollapsed: boolean;
  currentTheme: string;
  hardwareAcceleration: boolean;
}

function App(): JSX.Element {
  // Application state
  const [appState, setAppState] = useState<AppState>({
    currentPage: 'chat',
    sidebarCollapsed: false,
    currentTheme: 'dark',
    hardwareAcceleration: true,
  });

  // Chat state for cross-component communication
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [tokensPerSecond, setTokensPerSecond] = useState<number>(0);

  // Get Ollama connection status
  const { connectionStatus, checkConnection } = useOllama();
  
  // Onboarding management
  const { isOpen: onboardingOpen, setIsOpen: setOnboardingOpen } = useOnboarding();

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

  // Hardware acceleration handler
  const handleHardwareAccelerationChange = (enabled: boolean): void => {
    setAppState(prev => ({ ...prev, hardwareAcceleration: enabled }));
  };

  // Chat handlers
  const handleNewChat = (): void => {
    setActiveChatId(null);
  };

  const handleSelectChat = (chatId: string | null): void => {
    setActiveChatId(chatId);
  };

  // Render current page
  const renderCurrentPage = (): JSX.Element => {
    switch (appState.currentPage) {
      case 'chat':
        return <ChatPage activeChatId={activeChatId} onChatChange={setActiveChatId} onTokensPerSecond={setTokensPerSecond} />;
      case 'settings':
        return (
          <SettingsPage 
            onThemeChange={handleThemeChange} 
            onHardwareAccelerationChange={handleHardwareAccelerationChange}
            onShowOnboarding={() => setOnboardingOpen(true)}
          />
        );
      case 'models':
        return <ModelLibraryPage />;
      case 'image-gen':
        return <ImageGenerationPage />;
      case 'video-gen':
        return <VideoGenerationPage />;
      default:
        return <ChatPage activeChatId={activeChatId} onChatChange={setActiveChatId} onTokensPerSecond={setTokensPerSecond} />;
    }
  };

  return (
    <ThemeProvider theme={appState.currentTheme}>
      <ToastProvider>
        <div className="app">
          <MainLayout
            currentPage={appState.currentPage}
            sidebarCollapsed={appState.sidebarCollapsed}
            connectionStatus={connectionStatus}
            hardwareAcceleration={appState.hardwareAcceleration}
            onPageChange={handlePageChange}
            onSidebarToggle={handleSidebarToggle}
            onNewChat={handleNewChat}
            onSelectChat={handleSelectChat}
            activeChatId={activeChatId}
            onRefreshConnection={checkConnection}
            tokensPerSecond={tokensPerSecond}
          >
            {renderCurrentPage()}
          </MainLayout>
          <Onboarding 
            isOpen={onboardingOpen} 
            onClose={() => setOnboardingOpen(false)}
          />
        </div>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;