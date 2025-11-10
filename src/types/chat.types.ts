/**
 * Chat Types
 * 
 * Type definitions for the multi-chat system with persistent storage.
 */

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  model?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  model: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
  isPinned?: boolean;
}

export interface ChatGroup {
  label: string;
  chats: ChatSession[];
}

export type DateGroupKey = 'today' | 'yesterday' | 'thisWeek' | 'thisMonth' | 'older';

export interface ChatStorage {
  chats: ChatSession[];
  activeChatId?: string;
}
