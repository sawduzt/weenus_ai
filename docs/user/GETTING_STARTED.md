# 🚀 Getting Started with Weenus AI

> **Welcome to Weenus AI!** A beautiful, modern desktop application for chatting with local AI models, powered by Ollama.

## 📋 What is Weenus AI?

Weenus AI is a local-first desktop application that provides:
- **💬 AI Chat Interface**: Real-time streaming conversations with local AI models via Ollama
- **🤖 Model Management**: Browse, download, and manage AI models from Ollama Registry and HuggingFace
- **⚙️ Parameter Customization**: Fine-tune AI behavior with per-model parameter configurations
- **💾 Multi-Chat Sessions**: Manage multiple conversations with auto-generated titles and full-text search
- **🎨 Beautiful Design**: Modern interface with pink bunny theme and smooth animations
- **🔒 Privacy-First**: 100% local - no cloud, no tracking, all data stays on your machine

## 🏃‍♂️ Quick Start

### Prerequisites
1. **Ollama**: Download and install from [ollama.ai](https://ollama.ai)
2. **AI Model**: Download at least one model (e.g., `ollama pull llama2`)

### Installation
```bash
git clone https://github.com/sawduzt/weenus-ai.git
cd weenus-ai
npm install
npm run dev
```

### First Launch
1. **Start Ollama**: Ensure Ollama is running (`ollama serve` in terminal)
2. **Launch Weenus AI**: The app will open automatically in development mode
3. **Connection Check**: Status bar shows connection status
   - 🟢 **Connected**: Ready to chat with AI models
   - 🔴 **Disconnected**: Ollama needs to be started

### Navigation
- **Chat**: Main chat interface with multiple conversation support
- **Model Library**: Browse, download, and manage AI models (Ollama Registry + HuggingFace)
- **Settings**: Configure model parameters and application preferences
- **Image/Video Generation**: Placeholder pages for future multimodal features

## 🎯 Key Features

### Multi-Chat Sessions
- **Multiple Conversations**: Create and manage separate chat sessions
- **Auto-Generated Titles**: AI automatically creates descriptive titles after first exchange
- **Date Grouping**: Chats organized by Today, Yesterday, This Week, This Month, Older
- **Full-Text Search**: Search across all chat titles and message content
- **Persistent History**: All conversations saved locally and reload on app restart

### Chat Interface
- **Real-time Streaming**: Watch AI responses appear as they're generated
- **Model Selection**: Choose which AI model to use for each conversation
- **Message History**: All messages are saved and persistent across sessions
- **Loading Indicators**: Visual feedback while AI is thinking

### Model Library
Browse and download AI models from multiple sources:

**Ollama Registry Tab:**
- 16+ curated popular models (Llama, Mistral, Gemma, CodeLlama, etc.)
- Model size ranges and variant tags
- One-click download with real-time progress tracking
- Capability badges (Vision, Tools)

**HuggingFace Tab:**
- Search HuggingFace Hub for GGUF models
- Model type detection (text, image, video, multimodal)
- Download individual quantization variants
- Download statistics and metadata

**Installed Models Tab:**
- View all locally installed models
- Model metadata (size, format, parameters, last modified)
- Badge system showing family and quantization
- Delete models (UI ready)

### Model Parameters
Configure AI behavior with per-model settings:

- **Temperature** (0.0-2.0): Controls randomness and creativity
  - Low (0.1): Deterministic, focused responses
  - High (1.8): Creative, varied responses
  
- **Top P** (0.0-1.0): Nucleus sampling for response diversity
  
- **Top K** (1-100): Limits token selection to top K choices
  
- **Repeat Penalty** (0.5-2.0): Prevents repetitive text
  
- **Max Tokens** (100-8192): Maximum response length

**How to customize:**
1. Go to **Settings > Parameters**
2. Select a model from dropdown
3. Adjust sliders to your preference
4. Click **Save** to persist settings
5. Settings automatically apply to all chats with that model

## 🧪 Testing Parameters

Want to verify your parameter settings work? Try these tests:

1. **Temperature Test**:
   - Set Temperature to 0.1, Save
   - Ask "Count to 10" multiple times → Should be nearly identical each time
   - Set Temperature to 1.8, Save
   - Ask same question → Should vary significantly each time

2. **Max Tokens Test**:
   - Set Max Tokens to 50, Save
   - Ask a question requiring a long answer → Response cuts off early
   - Set Max Tokens to 2000, Save
   - Ask same question → Full response appears

## 🆘 Troubleshooting

### Connection Issues
- **"Ollama Not Running"**: Start Ollama with `ollama serve` in terminal
- **"No models available"**: Download a model with `ollama pull llama2`
- **Port Conflicts**: Ensure port 11434 is available (default Ollama port)

### Chat Issues
- **Slow Responses**: Check system resources (CPU/RAM) and consider using smaller models
- **Parameters Not Working**: Ensure you clicked Save after adjusting parameters
- **Chat History Not Loading**: Check electron-store permissions in app config folder

### Model Download Issues
- **Download Fails**: Check internet connection and Ollama service status
- **HuggingFace Models**: Browser downloads GGUF files - import manually into Ollama

### Performance
- **High Memory Usage**: Try smaller models like `mistral` or `llama2:7b`
- **Slow Performance**: Enable GPU acceleration in Ollama settings
- **App Feels Sluggish**: Close unused chat sessions or restart the app

## 💡 Tips & Best Practices

### Productivity
- **Quick Parameters**: Adjust temperature mid-conversation for different response styles
- **Model Comparison**: Use multiple chat sessions with different models for the same question
- **Organize Chats**: Search feature helps find old conversations quickly

### Best Practices
- **Save Parameters**: Create presets for different use cases (creative, coding, factual)
- **Monitor Resources**: Watch system usage when running large models
- **Regular Cleanup**: Delete old chats you no longer need to keep things organized

## 📞 Getting Help

### Resources
- **Ollama Documentation**: [ollama.ai](https://ollama.ai) for model information and troubleshooting
- **Issue Tracker**: Report bugs or request features on GitHub
- **Configuration**: App data stored in OS-specific locations:
  - Windows: `%APPDATA%/weenus-ai/`
  - macOS: `~/Library/Application Support/weenus-ai/`
  - Linux: `~/.config/weenus-ai/`

### Common File Locations
- **Chat History**: Stored in `config.json` under `chats` key
- **Model Parameters**: Stored in `config.json` under `modelParameters` key
- **Settings**: Stored in `config.json` under `settings` key

---

*Enjoy chatting with Weenus AI! This is a local-first application - your privacy and data stay on your machine.* ✨