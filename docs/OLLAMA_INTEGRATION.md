# Ollama Integration Documentation

This document provides comprehensive documentation for the Ollama integration in Weenus AI, including the service layer, React hooks, and usage examples.

## 📋 Overview

The Ollama integration consists of three main components:

1. **OllamaService** (`src/services/ollama.ts`) - Core API client
2. **useOllama Hook** (`src/hooks/useOllama.ts`) - React integration
3. **useOllamaChat Hook** - Simplified chat interface

## 🔌 OllamaService

The `OllamaService` class provides a comprehensive interface to the Ollama API with automatic connection monitoring, error handling, and event system.

### Core Features

- **Connection Management**: Automatic connection monitoring with configurable intervals
- **Model Management**: List, download, and delete models
- **Chat Interface**: Both streaming and non-streaming chat completions
- **Error Handling**: Comprehensive error types and recovery mechanisms
- **Event System**: Real-time connection status updates

### Basic Usage

```typescript
import { ollamaService } from '../services/ollama';

// Check connection
const status = await ollamaService.checkConnection();
console.log('Connected:', status.connected);

// Get available models
const models = await ollamaService.getModels();
console.log('Available models:', models.map(m => m.name));

// Send a chat message
const response = await ollamaService.chat({
  model: 'llama2',
  messages: [
    { role: 'user', content: 'Hello, how are you?' }
  ]
});
console.log('Response:', response.message.content);
```

### Streaming Chat

```typescript
// Stream chat responses for real-time UI updates
for await (const chunk of ollamaService.chatStream({
  model: 'llama2',
  messages: [{ role: 'user', content: 'Tell me a story' }]
})) {
  console.log('Chunk:', chunk.message.content);
  if (chunk.done) break;
}
```

### Connection Monitoring

```typescript
// Listen for connection status changes
ollamaService.on('connectionStatusChanged', (status) => {
  console.log('Connection status:', status);
  if (!status.connected) {
    console.error('Connection error:', status.error);
  }
});
```

## ⚛️ useOllama Hook

The `useOllama` hook provides React integration with automatic state management and lifecycle handling.

### Features

- **State Management**: Automatic connection status, models, and error state
- **Lifecycle Integration**: Proper cleanup and mount/unmount handling
- **Loading States**: Comprehensive loading indicators for all operations
- **Error Handling**: Granular error states for different operations

### Basic Usage

```tsx
import React from 'react';
import { useOllama } from '../hooks/useOllama';

function ModelList() {
  const {
    models,
    isLoadingModels,
    modelsError,
    isConnected,
    loadModels,
    pullModel,
    deleteModel
  } = useOllama();

  useEffect(() => {
    if (isConnected) {
      loadModels();
    }
  }, [isConnected, loadModels]);

  if (!isConnected) {
    return <div>Not connected to Ollama</div>;
  }

  if (isLoadingModels) {
    return <div>Loading models...</div>;
  }

  if (modelsError) {
    return <div>Error: {modelsError}</div>;
  }

  return (
    <div>
      <h3>Available Models</h3>
      {models.map(model => (
        <div key={model.name}>
          <span>{model.name}</span>
          <button onClick={() => deleteModel(model.name)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
```

### Chat Integration

```tsx
import React, { useState } from 'react';
import { useOllama } from '../hooks/useOllama';

function ChatInterface() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const { sendMessage, isGenerating, chatError } = useOllama();

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const result = await sendMessage({
      model: 'llama2',
      messages: [{ role: 'user', content: input }]
    });
    
    if (result) {
      setResponse(result.message.content);
    }
    setInput('');
  };

  return (
    <div>
      <div>Response: {response}</div>
      {chatError && <div>Error: {chatError}</div>}
      <input 
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={isGenerating}
      />
      <button onClick={handleSend} disabled={isGenerating}>
        {isGenerating ? 'Generating...' : 'Send'}
      </button>
    </div>
  );
}
```

## 💬 useOllamaChat Hook

The `useOllamaChat` hook provides a simplified interface specifically for chat applications with automatic message management.

### Features

- **Message History**: Automatic message state management
- **Model Selection**: Easy model switching
- **Streaming Support**: Built-in streaming with chunk handling
- **Message Types**: Full support for system, user, and assistant messages

### Usage Example

```tsx
import React, { useState } from 'react';
import { useOllamaChat } from '../hooks/useOllama';

function SimpleChatApp() {
  const [input, setInput] = useState('');
  const [streamedResponse, setStreamedResponse] = useState('');
  
  const {
    messages,
    currentModel,
    setCurrentModel,
    models,
    isConnected,
    isGenerating,
    sendMessageStream,
    clearMessages
  } = useOllamaChat('llama2');

  const handleSend = async () => {
    if (!input.trim()) return;
    
    setStreamedResponse('');
    await sendMessageStream(
      input,
      (chunk) => {
        setStreamedResponse(prev => prev + chunk);
      }
    );
    setInput('');
  };

  return (
    <div>
      <select 
        value={currentModel} 
        onChange={(e) => setCurrentModel(e.target.value)}
      >
        {models.map(model => (
          <option key={model.name} value={model.name}>
            {model.name}
          </option>
        ))}
      </select>
      
      <div className="messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.role}`}>
            <strong>{msg.role}:</strong> {msg.content}
          </div>
        ))}
        {streamedResponse && (
          <div className="message assistant streaming">
            <strong>assistant:</strong> {streamedResponse}
          </div>
        )}
      </div>
      
      <input 
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        disabled={isGenerating}
      />
      <button onClick={handleSend} disabled={isGenerating}>
        Send
      </button>
      <button onClick={clearMessages}>Clear</button>
    </div>
  );
}
```

## 🔧 Configuration

### Default Configuration

```typescript
// Default Ollama service configuration
const ollamaService = new OllamaService('http://localhost:11434');
```

### Custom Configuration

```typescript
// Custom Ollama service with different endpoint
const customOllama = new OllamaService('http://192.168.1.100:11434');

// Update connection check interval (default: 10 seconds)
// This would require modifying the service constructor
```

## 🎛️ Model Parameters

The Ollama integration supports comprehensive model parameter customization:

```typescript
const chatRequest = {
  model: 'llama2',
  messages: [{ role: 'user', content: 'Hello' }],
  options: {
    temperature: 0.7,        // Creativity level (0.0-1.0)
    top_p: 0.9,              // Nucleus sampling
    top_k: 40,               // Top-k sampling
    repeat_penalty: 1.1,     // Repetition penalty
    seed: 42,                // Reproducible outputs
    num_predict: 100,        // Max tokens to generate
    stop: ['\n', '###']      // Stop sequences
  }
};
```

## 🚨 Error Handling

### Error Types

The integration provides specific error types for different scenarios:

```typescript
import { OllamaApiError } from '../services/ollama';

try {
  await ollamaService.chat(request);
} catch (error) {
  if (error instanceof OllamaApiError) {
    console.error('Ollama API Error:', {
      message: error.message,
      status: error.status,
      code: error.code
    });
  } else {
    console.error('Unexpected error:', error);
  }
}
```

### Common Error Scenarios

1. **Connection Failed**: Ollama service not running
2. **Model Not Found**: Requested model not available
3. **Network Timeout**: Request timeout (5 seconds)
4. **Invalid Parameters**: Malformed request parameters
5. **Rate Limiting**: Too many concurrent requests

## 🔍 Debugging

### Connection Issues

```typescript
// Check detailed connection status
const status = ollamaService.getConnectionStatus();
console.log('Connection details:', {
  connected: status.connected,
  version: status.version,
  lastChecked: status.lastChecked,
  error: status.error
});
```

### Model Information

```typescript
// Get detailed model information
const models = await ollamaService.getModels();
models.forEach(model => {
  console.log('Model details:', {
    name: model.name,
    size: `${(model.size / 1024 / 1024 / 1024).toFixed(2)} GB`,
    family: model.details.family,
    parameters: model.details.parameter_size,
    quantization: model.details.quantization_level
  });
});
```

## 🚀 Performance Considerations

### Connection Monitoring

- Connection checks run every 10 seconds by default
- Checks timeout after 5 seconds
- Failed connections trigger automatic retry

### Memory Management

- Streaming responses use minimal memory buffering
- Event listeners are automatically cleaned up
- React hooks handle proper component unmounting

### Network Optimization

- Requests include appropriate timeouts
- Streaming reduces perceived latency
- Error recovery prevents request cascading

## 🔐 Security Notes

- All communication with Ollama uses HTTP (local network)
- No API keys or authentication required for local Ollama
- Model downloads are handled securely through Ollama
- Sensitive data stays on local machine

---

*This documentation is updated as new features are added to the Ollama integration.*