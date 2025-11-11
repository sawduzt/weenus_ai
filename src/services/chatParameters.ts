/**
 * Chat Parameters Service
 * 
 * Handles per-chat parameter overrides.
 * Stores which chats have custom parameters that differ from model defaults.
 * Uses electron-store via IPC bridge.
 */

import type { ChatParameterOverride, ParameterValues } from '../types/parameters.types';

const STORAGE_KEY = 'chatParameterOverrides';

class ChatParametersService {
  /**
   * Get parameter overrides for a specific chat
   */
  async getChatParameters(chatId: string): Promise<ChatParameterOverride | null> {
    try {
      if (!window.electronAPI?.store) {
        console.warn('electron-store not available');
        return null;
      }

      const allOverrides = await window.electronAPI.store.get(STORAGE_KEY);
      return allOverrides?.[chatId] || null;
    } catch (error) {
      console.error('Error getting chat parameters:', error);
      return null;
    }
  }

  /**
   * Get all parameter overrides
   */
  async getAllChatParameters(): Promise<{ [chatId: string]: ChatParameterOverride }> {
    try {
      if (!window.electronAPI?.store) {
        console.warn('electron-store not available');
        return {};
      }

      return (await window.electronAPI.store.get(STORAGE_KEY)) || {};
    } catch (error) {
      console.error('Error getting all chat parameters:', error);
      return {};
    }
  }

  /**
   * Save parameter overrides for a specific chat
   */
  async setChatParameters(chatId: string, parameters: ParameterValues): Promise<void> {
    try {
      if (!window.electronAPI?.store) {
        console.warn('electron-store not available');
        return;
      }

      const allOverrides = (await window.electronAPI.store.get(STORAGE_KEY)) || {};
      allOverrides[chatId] = {
        ...parameters,
        lastModified: Date.now(),
      };
      await window.electronAPI.store.set(STORAGE_KEY, allOverrides);
    } catch (error) {
      console.error('Error saving chat parameters:', error);
    }
  }

  /**
   * Clear parameter overrides for a specific chat (reset to model defaults)
   */
  async clearChatParameters(chatId: string): Promise<void> {
    try {
      if (!window.electronAPI?.store) {
        console.warn('electron-store not available');
        return;
      }

      const allOverrides = (await window.electronAPI.store.get(STORAGE_KEY)) || {};
      delete allOverrides[chatId];
      await window.electronAPI.store.set(STORAGE_KEY, allOverrides);
    } catch (error) {
      console.error('Error clearing chat parameters:', error);
    }
  }

  /**
   * Delete all parameter overrides for a chat when chat is deleted
   */
  async deleteChatParameterOverrides(chatId: string): Promise<void> {
    await this.clearChatParameters(chatId);
  }
}

export const chatParametersService = new ChatParametersService();
