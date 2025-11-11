# 🚀 Getting Started with Weenus AI

> **Welcome to Weenus AI!** A beautiful, modern desktop application for chatting with local AI models, powered by Ollama.

## 📋 What is Weenus AI?

Weenus AI is a desktop application that provides:
- **💬 AI Chat Interface**: Real-time conversations with local AI models through Ollama with per-model parameter customization
- **🤖 Model Management**: View and manage your installed Ollama models
- **⚙️ Settings**: Customize AI parameters (temperature, response length, creativity) per model
- **🎨 Beautiful Design**: Cute, modern interface with pink bunny theme and smooth animations

## 🎨 Beautiful Design

Weenus AI features a cute, modern interface with:
- **Pink Bunny Theme**: Friendly, approachable design with professional polish
- **Custom Window Controls**: Frameless desktop window with minimize, maximize, close buttons
- **Collapsible Sidebar**: Clean navigation with cute Weenus-themed descriptions
- **Smooth Animations**: Delightful micro-interactions and transitions throughout

## 🏃‍♂️ Quick Start

### Prerequisites
1. **Ollama**: Download and install from [ollama.ai](https://ollama.ai)
2. **AI Model**: Download at least one model (e.g., `ollama pull llama2`)

### First Launch
1. **Start Ollama**: Ensure Ollama is running on your system (`ollama serve`)
2. **Launch Weenus AI**: Double-click the application icon (bunny emoji 🐰)
3. **Connection Check**: The app will attempt to connect to Ollama automatically
   - 🟢 **Connected**: Ready to chat with AI models
   - 🔴 **Disconnected**: Click "Start Ollama" button or check your installation

### Basic Navigation
- **Chat**: Talk to your Weenus - main chat interface
- **Model Library**: Your Weenus collection - view installed models
- **Settings**: Personalize Your Weenus - configure app and model parameters

## 🎯 Key Features

### Chat Interface
- **Real-time Streaming**: Watch AI responses appear as they're generated
- **Model Selection**: Choose which AI model to chat with
- **Parameter Adjustment**: Quick tweak parameters for each conversation
- **Message History**: All messages are saved and persistent
- **Loading Messages**: Fun "Weenus is thinking" messages while waiting for responses

### Model Parameters
**Configure per-model settings for fine-grained control:**
- **Temperature** (0.0-2.0): How creative/random the AI is
  - Low (0.1): Predictable, focused responses
  - High (1.8): Creative, varied responses
- **Top P** (0.0-1.0): Diversity of word choices
- **Top K** (1-100): How many candidate words to consider
- **Repeat Penalty** (0.5-2.0): Avoid repetitive responses
- **Max Tokens** (100-8192): Maximum response length in tokens

**How to customize:**
1. Go to **Settings > Parameters**
2. Select a model from dropdown
3. Adjust sliders to your preference
4. Click **Save** to persist settings
5. Settings apply automatically to all future chats with that model

### Sidebar Navigation
- **Expanded**: Full labels with cute Weenus descriptions
- **Collapsed**: Icon-only compact mode
- **Toggle**: Click the bunny icon to expand/collapse

### Window Controls
- **Minimize**: Reduce to taskbar
- **Maximize**: Toggle full screen
- **Close**: Exit application
- **Draggable**: Click and drag the header to move window

## 🧪 Testing Parameters (Advanced)

Want to verify your parameter settings are working? Try this:

1. Set **Temperature to 0.1**, Save, ask "Count to 10" → Should be identical each time
2. Set **Temperature to 1.8**, Save, ask same question → Should vary wildly each time
3. Set **Max Tokens to 50**, Save, ask a long question → Response cuts off early
4. Set **Max Tokens to 2000**, Save, ask same question → Full response appears

## 🆘 Troubleshooting

### Connection Issues
- **"Ollama Not Running"**: Start Ollama manually with `ollama serve` in terminal
- **"No models available"**: Download a model with `ollama pull llama2`
- **Port Conflicts**: Check if port 11434 is available (default Ollama port)

### Chat Issues
- **Streaming Stops**: Refresh connection or switch models
- **Slow Responses**: Check system resources (CPU/RAM) and model size
- **Parameters Not Changing Results**: Make sure parameters are saved (green Save button)

### Performance
- **High Memory**: Smaller models like `mistral` use less RAM than `llama2`
- **Fast GPU**: Enable GPU acceleration in Ollama settings
- **Slow Chat**: Check if Ollama is running smoothly (monitor terminal output)

## 💡 Tips & Tricks

### Productivity Tips
- **Quick Parameter Tweaks**: Use per-chat parameter selector to adjust mid-conversation
- **Model Switching**: Switch between models to compare responses on same question
- **Temperature Experiments**: Low temp for facts, high temp for creative writing

### Best Practices
- **Save Parameters**: Save your favorite setups in Settings for consistency
- **Monitor Resources**: Watch system usage if running large models
- **Multiple Models**: Keep smaller models for quick responses, large ones for quality

## 🔮 Coming Soon

### Planned Features
- **Model Download**: Download new models directly from Ollama registry or Hugging Face
- **More Bunny Theme**: Additional cute Weenus-themed messaging and UI elements
- **Chat Management**: Better organization and search of past conversations
- **Export Options**: Save conversations in various formats

## 📞 Support

### Getting Help
- **Ollama Docs**: https://ollama.ai for model information and help
- **Issue Tracker**: Report bugs through the issue tracker
- **Settings Reset**: Clear app data by deleting the Weenus AI config folder

---

*Enjoy chatting with your Weenus AI! Have fun exploring what local AI can do.* ✨