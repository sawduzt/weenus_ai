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
  onPageChange: (page: AppPage) => void;
  onSidebarToggle: () => void;
  children: React.ReactNode;
}

export function MainLayout({
  currentPage,
  sidebarCollapsed,
  connectionStatus,
  onPageChange,
  onSidebarToggle,
  children,
}: MainLayoutProps): JSX.Element {
  return (
    <div className={`main-layout ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      {/* Custom Window Controls */}
      <WindowControls />
      
      {/* Sidebar Navigation */}
      <Sidebar
        currentPage={currentPage}
        collapsed={sidebarCollapsed}
        onPageChange={onPageChange}
        onToggle={onSidebarToggle}
      />

      {/* Main Content Area */}
      <div className="main-content">
        {/* Content */}
        <div className="content-area">
          {children}
        </div>

        {/* Status Bar */}
        <StatusBar connectionStatus={connectionStatus} />
      </div>

      {/* Windows Mica Effect Overlay */}
      <div className="mica-backdrop" />
    </div>
  );
}