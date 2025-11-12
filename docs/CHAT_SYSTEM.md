# Multi-Chat System Documentation

## Overview

The Weenus AI multi-chat system allows users to manage multiple concurrent chat sessions with different AI models. Each chat has an AI-generated title, is automatically grouped by date, and supports full-text search.

## Architecture

### Type Definitions (`src/types/chat.types.ts`)

```typescript
interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  model?: string;
}

interface ChatSession {
  id: string;
  title: string;
  model: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
}

interface ChatStorage {
  chats: Record<string, ChatSession>;
  activeChatId: string | null;
}

interface ChatGroup {
  label: string;
  chats: ChatSession[];
}
```

### Service Layer (`src/services/chat.ts`)

The chat service handles all data persistence and business logic using `electron-store`.

**Key Functions:**

- `getAllChats()` - Retrieve all chat sessions
- `createChat(model)` - Create a new chat session
- `updateChat(chatId, updates)` - Update chat metadata
- `addMessage(chatId, message)` - Add message to chat
- `deleteChat(chatId)` - Delete a chat session
- `generateTitle(messages, model)` - Generate AI title from first exchange
- `searchChats(query)` - Full-text search across all chats
- `groupChatsByDate(chats)` - Group chats by date ranges

**Date Grouping:**
- Today
- Yesterday  
- This Week
- This Month
- Older

### React Hook (`src/hooks/useChat.ts`)

Provides React state management and lifecycle hooks.

**Exported Values:**
- `chats` - All chat sessions
- `groupedChats` - Chats grouped by date
- `activeChat` - Currently selected chat
- `createNewChat` - Create new chat function
- `switchChat` - Switch to different chat
- `deleteChat` - Delete chat with confirmation
- `searchQuery` - Current search text
- `setSearchQuery` - Update search text
- `searchResults` - Filtered chat results

**Features:**
- Auto-loads chats on mount
- Debounced search (300ms delay)
- Manages active chat state
- Triggers AI title generation after first message

## AI Title Generation

When a user sends the first message in a new chat:

1. Message is sent to the selected AI model
2. After receiving response, `generateTitle()` is called
3. Service sends both user message and AI response to the model
4. Prompt: "Generate a very short (2-5 words) title for this conversation based on the following exchange"
5. AI generates concise title
6. Title is automatically updated in the chat session

## UI Integration

### Sidebar (`src/components/layout/Sidebar.tsx`)

**Features:**
- New Chat button (Plus icon)
- Search bar with live filtering
- Date-grouped chat history
- Active chat highlighting (pink gradient)
- Delete button (hover to reveal, with confirmation)
- Click chat to switch

**Chat Item Display:**
```
┌─────────────────────────────┐
│ 🔍 Search chats...          │
├─────────────────────────────┤
│ Today                       │
│ • Python Help         🗑️    │
│ • Image Generator     🗑️    │
├─────────────────────────────┤
│ Yesterday                   │
│ • Debugging Tips      🗑️    │
└─────────────────────────────┘
```

### App Component (`src/App.tsx`)

**State Management:**
- `activeChatId` - Currently selected chat ID
- `handleNewChat()` - Sets active chat to null (creates new)
- `handleSelectChat(id)` - Sets active chat ID

**Data Flow:**
```
App (state)
 ├─> MainLayout (props)
 │    └─> Sidebar (callbacks)
 │         └─> useChat (hook)
 │              └─> chatService (persistence)
 └─> ChatPage (props)
      └─> useChat integration
```

### ChatPage Integration

**Props:**
- `activeChatId: string | null` - Current chat ID from App
- `onChatChange: (id) => void` - Callback to notify App of chat changes

**Implementation:**
- Uses `useChat` hook
- Loads chat messages when `activeChatId` changes
- Creates new chat if `activeChatId` is null
- Triggers title generation after first AI response
- Saves messages to active chat using `addMessage()`

## Search Functionality

The search feature performs full-text search across:
- Chat titles
- All message content (user and assistant)

**Implementation:**
- Debounced with 300ms delay
- Case-insensitive matching
- Returns chat sessions that contain matching text
- Updates in real-time as user types

**Usage:**
```tsx
const { searchQuery, setSearchQuery, searchResults } = useChat();

<input 
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
/>

{searchResults.map(chat => ...)}
```

## Data Persistence

All chats are stored using `electron-store` with the following structure:

```json
{
  "chats": {
    "chat-uuid-1": {
      "id": "chat-uuid-1",
      "title": "Python Help",
      "model": "llama2",
      "messages": [...],
      "createdAt": 1234567890,
      "updatedAt": 1234567890
    }
  },
  "activeChatId": "chat-uuid-1"
}
```

**Storage Location:**
- Windows: `%APPDATA%/weenus-ai/config.json`
- macOS: `~/Library/Application Support/weenus-ai/config.json`
- Linux: `~/.config/weenus-ai/config.json`

## Theme Integration

The chat system uses the existing pink bunny theme:

**CSS Variables:**
- `--pink-500` - Active chat background
- `--pink-600` - Active chat hover
- `--text-primary` - Chat titles
- `--text-secondary` - Timestamps, metadata

**Animations:**
- Fade-in on chat creation
- Slide-out on deletion
- Smooth transitions on hover states

## Testing

**Manual Test Plan:**

1. **Create New Chat:**
   - Click "New Chat" button
   - Verify new empty chat appears
   - Send first message
   - Verify AI generates title after response

2. **Search Chats:**
   - Type in search box
   - Verify results filter in real-time
   - Verify date groups remain intact
   - Clear search to see all chats

3. **Switch Chats:**
   - Click different chat
   - Verify active highlight moves
   - Verify messages load (once integrated)

4. **Delete Chat:**
   - Hover over chat item
   - Click delete icon
   - Confirm deletion
   - Verify chat disappears

5. **Date Grouping:**
   - Create chats over multiple days
   - Verify correct date groups appear
   - Verify correct chat ordering (newest first)

## Code Examples

### Creating a New Chat

```typescript
const { createNewChat } = useChat();

const handleNewChat = async () => {
  const newChat = await createNewChat('llama2');
  console.log('Created chat:', newChat.id);
};
```

### Switching Chats

```typescript
const { switchChat, activeChat } = useChat();

const handleSelectChat = (chatId: string) => {
  switchChat(chatId);
  console.log('Active chat:', activeChat);
};
```

### Adding Messages

```typescript
import { chatService } from '../services/chat';

const message: ChatMessage = {
  id: generateId(),
  role: 'user',
  content: 'Hello!',
  timestamp: Date.now(),
  model: 'llama2'
};

await chatService.addMessage(currentChatId, message);
```

### Generating Titles

```typescript
import { chatService } from '../services/chat';

// After first AI response
const firstUserMessage = chat.messages[0];
const firstAiResponse = chat.messages[1];

const title = await chatService.generateTitle(
  [firstUserMessage, firstAiResponse],
  chat.model
);

await chatService.updateChat(chat.id, { title });
```

## Troubleshooting

**Search not working:**
- Check console for errors
- Verify `searchQuery` is being set
- Check `searchResults` array length

**Chats not persisting:**
- Verify electron-store is installed
- Check file permissions on config directory
- Check console for storage errors

**Title generation fails:**
- Verify Ollama is running
- Check selected model is available
- Check network connectivity
- Review Ollama logs

**Active chat not highlighting:**
- Verify `activeChatId` prop is passed correctly
- Check CSS class application
- Verify pink theme colors are defined

## Related Files

- `src/types/chat.types.ts` - TypeScript interfaces
- `src/services/chat.ts` - Core chat service
- `src/hooks/useChat.ts` - React hook
- `src/components/layout/Sidebar.tsx` - Chat list UI
- `src/components/layout/Sidebar.css` - Chat styles
- `src/pages/ChatPage.tsx` - Main chat interface (in progress)
- `src/App.tsx` - State coordination
