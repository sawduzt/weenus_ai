/**
 * Chat Service
 * 
 * Handles chat persistence, CRUD operations, and storage management.
 */

import { ChatSession, ChatMessage, ChatStorage } from '../types/chat.types';

class ChatService {
  private storageKey = 'chats';

  /**
   * Get all chat sessions
   */
  async getAllChats(): Promise<ChatSession[]> {
    try {
      if (window.electronAPI?.store) {
        const storage: ChatStorage = await window.electronAPI.store.get(this.storageKey) || { chats: [] };
        // Convert date strings back to Date objects
        return storage.chats.map(chat => ({
          ...chat,
          createdAt: new Date(chat.createdAt),
          updatedAt: new Date(chat.updatedAt),
          messages: chat.messages.map(msg => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          })),
        }));
      }
      return [];
    } catch (error) {
      console.error('Error loading chats:', error);
      return [];
    }
  }

  /**
   * Get a specific chat by ID
   */
  async getChatById(id: string): Promise<ChatSession | null> {
    const chats = await this.getAllChats();
    return chats.find(chat => chat.id === id) || null;
  }

  /**
   * Create a new chat session
   */
  async createChat(model: string, initialMessage?: ChatMessage): Promise<ChatSession> {
    const newChat: ChatSession = {
      id: `chat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: 'New Chat',
      model,
      messages: initialMessage ? [initialMessage] : [],
      createdAt: new Date(),
      updatedAt: new Date(),
      isPinned: false,
    };

    const chats = await this.getAllChats();
    chats.unshift(newChat); // Add to beginning
    await this.saveChats(chats);
    await this.setActiveChat(newChat.id);
    
    return newChat;
  }

  /**
   * Update an existing chat
   */
  async updateChat(chatId: string, updates: Partial<ChatSession>): Promise<ChatSession | null> {
    const chats = await this.getAllChats();
    const chatIndex = chats.findIndex(chat => chat.id === chatId);
    
    if (chatIndex === -1) return null;

    chats[chatIndex] = {
      ...chats[chatIndex],
      ...updates,
      updatedAt: new Date(),
    };

    await this.saveChats(chats);
    return chats[chatIndex];
  }

  /**
   * Add a message to a chat
   */
  async addMessage(chatId: string, message: Omit<ChatMessage, 'id' | 'timestamp'>): Promise<ChatMessage> {
    const newMessage: ChatMessage = {
      ...message,
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
    };

    const chats = await this.getAllChats();
    const chatIndex = chats.findIndex(chat => chat.id === chatId);
    
    if (chatIndex !== -1) {
      chats[chatIndex].messages.push(newMessage);
      chats[chatIndex].updatedAt = new Date();
      await this.saveChats(chats);
    }

    return newMessage;
  }

  /**
   * Delete a chat
   */
  async deleteChat(chatId: string): Promise<boolean> {
    const chats = await this.getAllChats();
    const filteredChats = chats.filter(chat => chat.id !== chatId);
    
    if (filteredChats.length === chats.length) return false; // Chat not found

    await this.saveChats(filteredChats);
    
    // If deleted chat was active, clear active chat
    const activeId = await this.getActiveChatId();
    if (activeId === chatId) {
      await this.setActiveChat(filteredChats[0]?.id || null);
    }

    return true;
  }

  /**
   * Clear all messages from a chat
   */
  async clearChat(chatId: string): Promise<boolean> {
    return (await this.updateChat(chatId, { messages: [] })) !== null;
  }

  /**
   * Get active chat ID
   */
  async getActiveChatId(): Promise<string | null> {
    try {
      if (window.electronAPI?.store) {
        const storage: ChatStorage = await window.electronAPI.store.get(this.storageKey) || { chats: [] };
        return storage.activeChatId || null;
      }
      return null;
    } catch (error) {
      console.error('Error getting active chat ID:', error);
      return null;
    }
  }

  /**
   * Set active chat
   */
  async setActiveChat(chatId: string | null): Promise<void> {
    try {
      if (window.electronAPI?.store) {
        const storage: ChatStorage = await window.electronAPI.store.get(this.storageKey) || { chats: [] };
        storage.activeChatId = chatId || undefined;
        await window.electronAPI.store.set(this.storageKey, storage);
      }
    } catch (error) {
      console.error('Error setting active chat:', error);
    }
  }

  /**
   * Generate chat title using AI
   */
  async generateTitle(chatId: string, firstMessage: string, model: string): Promise<string> {
    try {
      // Use Ollama to generate a short title
      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
          prompt: `Generate a very short (3-5 words max) title for a conversation that starts with: "${firstMessage.substring(0, 100)}..."\n\nTitle:`,
          stream: false,
          options: {
            temperature: 0.7,
            num_predict: 20,
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const title = data.response.trim().replace(/["']/g, '').substring(0, 50);
        await this.updateChat(chatId, { title });
        return title;
      }
    } catch (error) {
      console.error('Error generating title:', error);
    }

    // Fallback: use first few words
    const fallbackTitle = firstMessage.substring(0, 30).trim();
    await this.updateChat(chatId, { title: fallbackTitle + (firstMessage.length > 30 ? '...' : '') });
    return fallbackTitle;
  }

  /**
   * Search chats
   */
  async searchChats(query: string): Promise<ChatSession[]> {
    const chats = await this.getAllChats();
    const lowerQuery = query.toLowerCase();

    return chats.filter(chat => {
      // Search in title
      if (chat.title.toLowerCase().includes(lowerQuery)) return true;

      // Search in messages
      return chat.messages.some(msg => 
        msg.content.toLowerCase().includes(lowerQuery)
      );
    });
  }

  /**
   * Save all chats to storage
   */
  private async saveChats(chats: ChatSession[]): Promise<void> {
    try {
      if (window.electronAPI?.store) {
        const storage: ChatStorage = await window.electronAPI.store.get(this.storageKey) || { chats: [] };
        storage.chats = chats;
        await window.electronAPI.store.set(this.storageKey, storage);
      }
    } catch (error) {
      console.error('Error saving chats:', error);
      throw error;
    }
  }

  /**
   * Group chats by date
   */
  groupChatsByDate(chats: ChatSession[]): Map<string, ChatSession[]> {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    const monthAgo = new Date(today);
    monthAgo.setMonth(monthAgo.getMonth() - 1);

    const groups = new Map<string, ChatSession[]>([
      ['Today', []],
      ['Yesterday', []],
      ['This Week', []],
      ['This Month', []],
      ['Older', []],
    ]);

    chats.forEach(chat => {
      const chatDate = new Date(chat.updatedAt);
      
      if (chatDate >= today) {
        groups.get('Today')!.push(chat);
      } else if (chatDate >= yesterday) {
        groups.get('Yesterday')!.push(chat);
      } else if (chatDate >= weekAgo) {
        groups.get('This Week')!.push(chat);
      } else if (chatDate >= monthAgo) {
        groups.get('This Month')!.push(chat);
      } else {
        groups.get('Older')!.push(chat);
      }
    });

    // Remove empty groups
    for (const [key, value] of groups.entries()) {
      if (value.length === 0) {
        groups.delete(key);
      }
    }

    return groups;
  }
}

// Export singleton instance
export const chatService = new ChatService();
