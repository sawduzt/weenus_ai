/**
 * Sidebar Navigation Component
 * 
 * Provides navigation between different pages and features of the application.
 * Includes chat history, quick actions, and main navigation items.
 */

import React from 'react';
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
  Search,
  Trash2,
  type LucideIcon
} from 'lucide-react';
import { AppPage } from '../../App';
import { useChat } from '../../hooks/useChat';
import { chatService } from '../../services/chat';
import { useToast } from '../ui/ToastProvider';
import './Sidebar.css';

export interface SidebarProps {
  currentPage: AppPage;
  collapsed: boolean;
  onPageChange: (page: AppPage) => void;
  onToggle: () => void;
  onNewChat?: () => void;
  onSelectChat?: (chatId: string | null) => void;
  activeChatId?: string | null;
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
    description: 'Talk to your Weenus',
  },
  {
    id: 'image-gen',
    label: 'Image Generation',
    icon: Image,
    description: 'Take some Weenus Pics',
  },
  {
    id: 'video-gen',
    label: 'Video Generation',
    icon: Video,
    description: 'Make some Weenus Vids',
  },
  {
    id: 'models',
    label: 'Model Library',
    icon: Bot,
    description: 'Your Weenus collection',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    description: 'Personalize Your Weenus',
  },
];

export function Sidebar({
  currentPage,
  collapsed,
  onPageChange,
  onToggle,
  onNewChat,
  onSelectChat,
  activeChatId,
}: SidebarProps): JSX.Element {
  const { groupedChats, searchQuery, setSearchQuery, searchResults, deleteChat, refreshChats } = useChat();
  const toast = useToast();

  // Refresh chats periodically to catch updates from ChatPage
  React.useEffect(() => {
    const interval = setInterval(() => {
      refreshChats();
    }, 1000); // Refresh every second

    return () => clearInterval(interval);
  }, [refreshChats]);

  const handleNewChat = async () => {
    // Call the parent's onNewChat to clear activeChatId
    onNewChat?.();
  };

  const handleDeleteChat = async (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const wasActive = chatId === activeChatId;
    await deleteChat(chatId);
    toast.success('Chat Deleted', 'The chat has been removed');
    
    // If we deleted the active chat, notify parent to refresh
    if (wasActive && onSelectChat) {
      // Get the new active chat ID from storage
      const newActiveId = await chatService.getActiveChatId();
      onSelectChat(newActiveId);
    }
  };

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
                  data-testid={`nav-${item.id}`}
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
            {/* New Chat Button - Moved above search */}
            <div style={{ padding: 'var(--spacing-sm)', paddingBottom: '8px' }}>
              <button 
                className="new-chat-button" 
                onClick={handleNewChat}
                style={{
                  padding: '8px 12px',
                  fontSize: '13px',
                  minHeight: 'auto',
                  height: '32px',
                }}
              >
                <Plus size={14} className="new-chat-icon" />
                New Chat
              </button>
            </div>

            {/* Search Bar */}
            <div style={{ padding: 'var(--spacing-sm)', borderBottom: '1px solid var(--border-primary)' }}>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Search size={14} style={{ position: 'absolute', left: '8px', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Search chats..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '6px 6px 6px 28px',
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-primary)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--text-primary)',
                    fontSize: '12px',
                  }}
                />
              </div>
            </div>

            {/* Chat Groups */}
            <div style={{ flex: 1, overflowY: 'auto', maxHeight: 'calc(100vh - 400px)' }}>
              {searchQuery ? (
                // Search Results
                <ul className="chat-history-list">
                  {searchResults.map((chat) => (
                    <li key={chat.id}>
                      <button
                        className={`chat-history-item ${activeChatId === chat.id ? 'active' : ''}`}
                        onClick={() => onSelectChat?.(chat.id)}
                      >
                        <span className="chat-title">{chat.title}</span>
                        <button
                          className="chat-delete"
                          onClick={(e) => handleDeleteChat(chat.id, e)}
                          title="Delete chat"
                        >
                          <Trash2 size={12} />
                        </button>
                      </button>
                    </li>
                  ))}
                  {searchResults.length === 0 && (
                    <li style={{ padding: 'var(--spacing-md)', textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px' }}>
                      No chats found
                    </li>
                  )}
                </ul>
              ) : (
                // Grouped by Date
                <>
                  {Array.from(groupedChats.entries()).map(([group, chats]) => (
                    <div key={group} style={{ marginBottom: 'var(--spacing-md)' }}>
                      <h4 style={{
                        padding: 'var(--spacing-xs) var(--spacing-sm)',
                        fontSize: '11px',
                        fontWeight: '600',
                        color: 'var(--text-muted)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}>
                        {group}
                      </h4>
                      <ul className="chat-history-list">
                        {chats.map((chat) => (
                          <li key={chat.id}>
                            <button
                              className={`chat-history-item ${activeChatId === chat.id ? 'active' : ''}`}
                              onClick={() => onSelectChat?.(chat.id)}
                            >
                              <span className="chat-title">{chat.title}</span>
                              <button
                                className="chat-delete"
                                onClick={(e) => handleDeleteChat(chat.id, e)}
                                title="Delete chat"
                              >
                                <Trash2 size={12} />
                              </button>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                  {groupedChats.size === 0 && (
                    <div style={{
                      padding: 'var(--spacing-lg)',
                      textAlign: 'center',
                      color: 'var(--text-muted)',
                      fontSize: '12px',
                    }}>
                      No chats yet. Start a new conversation!
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Quick Actions */}
      {!collapsed && (
        <div className="sidebar-footer">
          <div className="quick-actions">
            <button 
              className="quick-action" 
              title="Reserved for future features"
              disabled
              style={{ 
                color: 'var(--text-muted)',
                cursor: 'not-allowed',
                opacity: 0.5,
              }}
            >
              <MessageCircle size={16} />
            </button>
            <button 
              className="quick-action" 
              title="Clear current chat"
              onClick={() => {
                if (activeChatId) {
                  toast.info('Chat Cleared', 'Current conversation has been cleared. Messages remain in history.');
                } else {
                  toast.info('No Active Chat', 'Select or create a chat first');
                }
              }}
            >
              <Zap size={16} />
            </button>
            <button 
              className="quick-action" 
              title="Get Help"
              onClick={() => toast.info('Help', 'Documentation and support are coming soon! For now, check out the README.md for getting started.')}
            >
              <HelpCircle size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}