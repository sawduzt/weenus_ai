/**
 * Chat Parameters Service
 * 
 * Handles per-chat parameter overrides.
 * Stores which chats have custom parameters that differ from model defaults.
 */

import Store from 'electron-store';
import type { ChatParameterOverride, ParameterValues } from '../types/parameters.types';

// Initialize electron store
const store = new Store<{
  chatParameterOverrides?: {
    [chatId: string]: ChatParameterOverride;
  };
}>();

export const chatParametersService = {
  /**
   * Get parameter overrides for a specific chat
   */
  getChatParameters(chatId: string): ChatParameterOverride | null {
    const overrides = store.get('chatParameterOverrides', {});
    return overrides[chatId] || null;
  },

  /**
   * Get all parameter overrides
   */
  getAllChatParameters(): { [chatId: string]: ChatParameterOverride } {
    return store.get('chatParameterOverrides', {});
  },

  /**
   * Save parameter overrides for a specific chat
   */
  setChatParameters(chatId: string, parameters: ParameterValues): void {
    const overrides = store.get('chatParameterOverrides', {});
    overrides[chatId] = {
      ...parameters,
      lastModified: Date.now(),
    };
    store.set('chatParameterOverrides', overrides);
  },

  /**
   * Clear parameter overrides for a specific chat (reset to model defaults)
   */
  clearChatParameters(chatId: string): void {
    const overrides = store.get('chatParameterOverrides', {});
    delete overrides[chatId];
    store.set('chatParameterOverrides', overrides);
  },

  /**
   * Delete all parameter overrides for a chat when chat is deleted
   */
  deleteChatParameterOverrides(chatId: string): void {
    this.clearChatParameters(chatId);
  },
};
