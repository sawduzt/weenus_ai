/**
 * Main Layout Component
 * 
 * Provides the primary layout structure for the Weenus AI application,
 * including sidebar navigation, main content area, and status indicators.
 */

import React from 'react';
import { Sidebar } from './Sidebar';
import { StatusBar } from './StatusBar';
import { WindowControls } from './WindowControls';
import { AppPage } from '../../App';
import { ConnectionStatus } from '../../types/global.types';
import './MainLayout.css';

export interface MainLayoutProps {
  currentPage: AppPage;
  sidebarCollapsed: boolean;
  connectionStatus: ConnectionStatus;
  hardwareAcceleration?: boolean;
  onPageChange: (page: AppPage) => void;
  onSidebarToggle: () => void;
  onNewChat?: () => void;
  onSelectChat?: (chatId: string) => void;
  activeChatId?: string | null;
  onRefreshConnection?: () => Promise<void>;
  children: React.ReactNode;
}

export function MainLayout({
  currentPage,
  sidebarCollapsed,
  connectionStatus,
  hardwareAcceleration = true,
  onPageChange,
  onSidebarToggle,
  onNewChat,
  onSelectChat,
  activeChatId,
  onRefreshConnection,
  children,
}: MainLayoutProps): JSX.Element {
  return (
    <div className={`main-layout ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      {/* Sidebar Navigation */}
      <Sidebar
        currentPage={currentPage}
        collapsed={sidebarCollapsed}
        onPageChange={onPageChange}
        onToggle={onSidebarToggle}
        onNewChat={onNewChat}
        onSelectChat={onSelectChat}
        activeChatId={activeChatId}
      />

      {/* Main Content Area */}
      <div className="main-content">
        {/* Window Controls - Appears on all pages */}
        <div className="main-header">
          <WindowControls />
        </div>

        {/* Content */}
        <div 
          className={`content-area ${hardwareAcceleration ? 'hw-accelerated' : ''}`}
        >
          {children}
        </div>

        {/* Status Bar */}
        <StatusBar connectionStatus={connectionStatus} onRefresh={onRefreshConnection} />
      </div>

      {/* Windows Mica Effect Overlay */}
      <div className="mica-backdrop" />
    </div>
  );
}