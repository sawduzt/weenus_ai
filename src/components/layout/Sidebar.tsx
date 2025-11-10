/**
 * Sidebar Navigation Component
 * 
 * Provides navigation between different pages and features of the application.
 * Includes chat history, quick actions, and main navigation items.
 */

import React, { useState } from 'react';
import { 
  MessageCircle, 
  Image, 
  Video, 
  Bot, 
  Settings, 
  ChevronLeft,
  Plus,
  Zap,
  HelpCircle,
  Rabbit,
  type LucideIcon
} from 'lucide-react';
import { AppPage } from '../../App';
import './Sidebar.css';

export interface SidebarProps {
  currentPage: AppPage;
  collapsed: boolean;
  onPageChange: (page: AppPage) => void;
  onToggle: () => void;
}

interface NavigationItem {
  id: AppPage;
  label: string;
  icon: LucideIcon;
  description: string;
}

const navigationItems: NavigationItem[] = [
  {
    id: 'chat',
    label: 'Chat',
    icon: MessageCircle,
    description: 'AI Chat Interface',
  },
  {
    id: 'image-gen',
    label: 'Image Generation',
    icon: Image,
    description: 'Generate Images with AI',
  },
  {
    id: 'video-gen',
    label: 'Video Generation',
    icon: Video,
    description: 'Generate Videos with AI',
  },
  {
    id: 'models',
    label: 'Model Library',
    icon: Bot,
    description: 'Manage AI Models',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    description: 'Application Settings',
  },
];

export function Sidebar({
  currentPage,
  collapsed,
  onPageChange,
  onToggle,
}: SidebarProps): JSX.Element {
  const [chatHistory] = useState([
    { id: '1', title: 'Getting started with AI', timestamp: new Date() },
    { id: '2', title: 'Image generation tips', timestamp: new Date() },
    { id: '3', title: 'Model comparison', timestamp: new Date() },
  ]);

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      {/* Sidebar Header */}
      <div className="sidebar-header" style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}>
        <div 
          className={`app-logo ${collapsed ? 'clickable' : ''}`}
          onClick={collapsed ? onToggle : undefined}
          title={collapsed ? 'Expand sidebar' : undefined}
          style={collapsed ? { WebkitAppRegion: 'no-drag', cursor: 'pointer' } as React.CSSProperties : {}}
        >
          <Rabbit size={24} className="logo-icon" />
          {!collapsed && <span className="app-name">Weenus AI</span>}
        </div>
        {!collapsed && (
          <button
            className="sidebar-toggle"
            onClick={onToggle}
            title="Collapse sidebar"
            style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
          >
            <ChevronLeft size={16} />
          </button>
        )}
      </div>

      {/* Navigation Items */}
      <nav className="sidebar-nav">
        <div className="nav-section">
          {!collapsed && <h3 className="nav-section-title">Navigation</h3>}
          <ul className="nav-items">
            {navigationItems.map((item) => (
              <li key={item.id}>
                <button
                  className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
                  onClick={() => onPageChange(item.id)}
                  title={collapsed ? item.description : ''}
                >
                  <span className="nav-icon">
                    <item.icon size={20} />
                  </span>
                  {!collapsed && (
                    <div className="nav-content">
                      <span className="nav-label">{item.label}</span>
                      <span className="nav-description">{item.description}</span>
                    </div>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Chat History Section */}
        {!collapsed && currentPage === 'chat' && (
          <div className="nav-section chat-history">
            <h3 className="nav-section-title">Recent Chats</h3>
            <ul className="chat-history-list">
              {chatHistory.map((chat) => (
                <li key={chat.id}>
                  <button className="chat-history-item">
                    <span className="chat-title">{chat.title}</span>
                    <span className="chat-timestamp">
                      {chat.timestamp.toLocaleDateString()}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            <button className="new-chat-button">
              <Plus size={16} className="new-chat-icon" />
              New Chat
            </button>
          </div>
        )}
      </nav>

      {/* Quick Actions */}
      {!collapsed && (
        <div className="sidebar-footer">
          <div className="quick-actions">
            <button className="quick-action" title="New Chat">
              <MessageCircle size={16} />
            </button>
            <button className="quick-action" title="Quick Settings">
              <Zap size={16} />
            </button>
            <button className="quick-action" title="Help">
              <HelpCircle size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}