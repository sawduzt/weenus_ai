/**
 * useChat Hook
 * 
 * React hook for managing multi-chat functionality with persistence.
 */

import { useState, useEffect, useCallback } from 'react';
import { ChatSession } from '../types/chat.types';
import { chatService } from '../services/chat';

interface UseChatReturn {
  // Chat list
  chats: ChatSession[];
  groupedChats: Map<string, ChatSession[]>;
  isLoadingChats: boolean;

  // Active chat
  activeChat: ChatSession | null;
  activeChatId: string | null;

  // Chat operations
  createNewChat: (model: string) => Promise<ChatSession>;
  switchChat: (chatId: string) => Promise<void>;
  deleteChat: (chatId: string) => Promise<void>;
  clearActiveChat: () => Promise<void>;

  // Message operations
  addMessageToActiveChat: (role: 'user' | 'assistant', content: string, model?: string) => Promise<void>;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: ChatSession[];

  // Utilities
  refreshChats: () => Promise<void>;
}

export function useChat(): UseChatReturn {
  const [chats, setChats] = useState<ChatSession[]>([]);
  const [activeChat, setActiveChat] = useState<ChatSession | null>(null);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isLoadingChats, setIsLoadingChats] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ChatSession[]>([]);

  /**
   * Load all chats from storage
   */
  const refreshChats = useCallback(async () => {
    setIsLoadingChats(true);
    try {
      const loadedChats = await chatService.getAllChats();
      setChats(loadedChats);

      const activeId = await chatService.getActiveChatId();
      setActiveChatId(activeId);

      if (activeId) {
        const active = loadedChats.find(chat => chat.id === activeId);
        setActiveChat(active || null);
      } else {
        setActiveChat(null);
      }
    } catch (error) {
      console.error('Error refreshing chats:', error);
    } finally {
      setIsLoadingChats(false);
    }
  }, []);

  /**
   * Load chats on mount
   */
  useEffect(() => {
    refreshChats();
  }, [refreshChats]);

  /**
   * Handle search
   */
  useEffect(() => {
    const performSearch = async () => {
      if (searchQuery.trim()) {
        const results = await chatService.searchChats(searchQuery);
        setSearchResults(results);
      } else {
        setSearchResults([]);
      }
    };

    const debounce = setTimeout(performSearch, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  /**
   * Create a new chat
   */
  const createNewChat = useCallback(async (model: string): Promise<ChatSession> => {
    const newChat = await chatService.createChat(model);
    await refreshChats();
    return newChat;
  }, [refreshChats]);

  /**
   * Switch to a different chat
   */
  const switchChat = useCallback(async (chatId: string) => {
    await chatService.setActiveChat(chatId);
    await refreshChats();
  }, [refreshChats]);

  /**
   * Delete a chat
   */
  const deleteChat = useCallback(async (chatId: string) => {
    await chatService.deleteChat(chatId);
    await refreshChats();
  }, [refreshChats]);

  /**
   * Clear messages from active chat
   */
  const clearActiveChat = useCallback(async () => {
    if (activeChatId) {
      await chatService.clearChat(activeChatId);
      await refreshChats();
    }
  }, [activeChatId, refreshChats]);

  /**
   * Add message to active chat
   */
  const addMessageToActiveChat = useCallback(async (
    role: 'user' | 'assistant',
    content: string,
    model?: string
  ) => {
    if (!activeChatId) return;

    await chatService.addMessage(activeChatId, {
      role,
      content,
      model,
    });

    // Generate title for first user message
    if (role === 'user' && activeChat?.messages.length === 0 && model) {
      chatService.generateTitle(activeChatId, content, model);
    }

    await refreshChats();
  }, [activeChatId, activeChat, refreshChats]);

  /**
   * Group chats by date
   */
  const groupedChats = chatService.groupChatsByDate(chats);

  return {
    chats,
    groupedChats,
    isLoadingChats,
    activeChat,
    activeChatId,
    createNewChat,
    switchChat,
    deleteChat,
    clearActiveChat,
    addMessageToActiveChat,
    searchQuery,
    setSearchQuery,
    searchResults,
    refreshChats,
  };
}
