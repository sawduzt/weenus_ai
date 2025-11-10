# 🧠 Weenus AI

> *A sleek, modern desktop AI application featuring chat, image generation, and comprehensive model management*

<div align="center">

![Weenus AI Logo](src/assets/images/logo.png)

[![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)](package.json)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/typescript-5.2.2-blue.svg)](https://www.typescriptlang.org/)
[![Electron](https://img.shields.io/badge/electron-27.0.0-purple.svg)](https://www.electronjs.org/)
[![React](https://img.shields.io/badge/react-18.2.0-cyan.svg)](https://reactjs.org/)

*Beautiful • Powerful • Simple*

</div>

## 🚀 Development Status

**Current Status: Ollama Integration Complete - Fully Functional Chat!** 

### ✅ **MILESTONE: Complete Ollama Integration (November 10, 2025)**

**🎯 Phase 1, 2, 3 & 4 - COMPLETE**
- ✅ **Project Foundation**: Complete TypeScript + Electron + React setup
- ✅ **Code Quality**: ESLint, Prettier, comprehensive linting configured  
- ✅ **Ollama Integration**: Full API client with connection monitoring, auto-start, auto-restart
- ✅ **React Hooks**: `useOllama` for connection, models, and streaming chat
- ✅ **UI Framework**: Modern layout with Windows Mica effects and pink theme
- ✅ **Theming System**: Cute pink theme with light/dark variants, green connection indicator
- ✅ **Professional Icons**: Complete Lucide React vector icon system (bunny logo!)
- ✅ **Custom Window Controls**: Minimize, maximize, close buttons (fully functional)
- ✅ **Navigation**: Responsive sidebar with enhanced collapse/expand UX
- ✅ **Application Pages**: Chat, Settings, Model Library, Image Gen, Video Gen
- ✅ **Frameless Design**: Custom title bar with draggable regions
- ✅ **Enhanced Spacing**: Proper padding and rounded corners throughout
- ✅ **UI Polish Complete**: No emojis, consistent iconography, rounded chat interface
- ✅ **Chat Interface**: Real-time streaming chat with message bubbles, model selector, clear button
- ✅ **Model Library**: Display installed models with metadata (name, size, modified date)
- ✅ **Auto-Start Ollama**: One-click button to launch Ollama service automatically
- ✅ **Connection Status**: Real-time connection indicator in status bar (red/green)
- ✅ **Settings**: Model path configuration with folder picker and auto-restart

### 🎉 **Working Features**
- 💬 **Streaming Chat**: Real-time responses from Ollama models
- 🤖 **Model Selection**: Switch between installed models on-the-fly
- 📦 **Model Library**: View all installed models with details
- 🟢 **Connection Monitor**: Live status indicator showing Ollama connection
- ▶️ **Auto-Start**: Click "Start Ollama" to launch service automatically
- 📁 **Custom Model Path**: Configure where models are stored
- 🔄 **Auto-Restart**: Save settings and restart Ollama with new configuration
- 🗑️ **Clear Chat**: Reset conversation history

### 📅 **Next Phase (Ready to Begin)**
- **Phase 5**: Chat History Persistence (save/load conversations)
- **Phase 6**: Media Generation Features (Image/Video)  
- **Phase 7**: Advanced Features (Statistics, Widgets)
- **Phase 8**: Polish & Enhancement
- **Phase 9**: Testing & Documentation

---

### 🎯 Core Capabilities
- **💬 Advanced Chat Interface**: Seamless conversations with local AI models
- **🖼️ Image Generation**: Create stunning visuals with AI-powered tools
- **🎥 Video Generation**: Generate videos with cutting-edge AI models
- **🤖 Model Management**: Download, configure, and switch between AI models effortlessly
- **📊 Real-time Statistics**: Monitor GPU usage, VRAM, tokens/second, and performance metrics
- **🎨 Beautiful UI**: Modern design with Windows Mica effects, rounded corners, and customizable themes
- **🐰 Bunny Logo**: Cute rabbit icon replacing generic sparkles for unique branding

### 🚀 Advanced Features
- **📁 File Upload Support**: Chat with documents, images, and other files
- **💾 Persistent Chat History**: Never lose your conversations
- **⚙️ Per-Model Parameters**: Fine-tune settings for each AI model
- **🔌 Widget System**: Customizable, toggleable UI components
- **🌐 Network Access**: Optional web interface for multi-device access
- **🎭 Theme Customization**: Multiple themes with custom theme creation
- **⌨️ Keyboard Shortcuts**: Efficient workflow with hotkeys

## 🖥️ Screenshots

*Screenshots will be added as the application develops*

## 📋 Requirements

### System Requirements
- **OS**: Windows 10/11, macOS 10.15+, or Linux (Ubuntu 18.04+)
- **RAM**: 8GB minimum, 16GB recommended
- **Storage**: 2GB for application, additional space for AI models
- **GPU**: Optional but recommended for enhanced performance

### Dependencies
- **Node.js**: 18.0.0 or later
- **npm**: 9.0.0 or later
- **Ollama**: For AI model backend (automatically detected)

## 🚀 Quick Start

### 1. Clone and Install
```bash
# Clone the repository
git clone <repository-url>
cd weenus-ai

# Install dependencies
npm install
```

### 2. Start Development
```bash
# Start the development environment
npm run dev
```

This will:
- Launch the Vite development server
- Start Electron with hot reload
- Open the Weenus AI application

### 3. First Time Setup
1. **Install Ollama**: Download from [ollama.ai](https://ollama.ai) if not already installed
2. **Start App**: Click "Start Ollama" button in the app, or manually run `ollama serve`
3. **Download Models**: Use Ollama CLI to pull models:
   ```bash
   ollama pull llama2
   ollama pull mistral
   ```
4. **Configure Settings**: Optionally set custom model path in Settings → Models
5. **Start Chatting**: Select a model and start your conversation!

## 📖 Documentation

### For Users
- **[Getting Started](docs/user/GETTING_STARTED.md)**: Complete user guide and feature overview
- **[Installation Guide](docs/user/installation.md)**: Detailed setup instructions (Coming Soon)
- **[User Manual](docs/user/manual.md)**: Complete feature walkthrough (Coming Soon)  
- **[Troubleshooting](docs/user/troubleshooting.md)**: Common issues and solutions (Coming Soon)

### For Developers
- **[Development Setup](docs/DEVELOPMENT.md)**: Environment configuration and workflow
- **[UI Framework](docs/UI_FRAMEWORK.md)**: Component documentation and design system
- **[Project Structure](docs/developer/project-structure.md)**: Codebase organization
- **[Build System](docs/developer/build-system.md)**: TypeScript and Vite configuration
- **[Dependencies](docs/developer/dependencies.md)**: Library choices and reasoning

## 🛠️ Development

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development environment (Vite + Electron) |
| `npm run build` | Build for production |
| `npm run test` | Run all tests |
| `npm run lint` | Check code quality |
| `npm run format` | Format code with Prettier |

### Development Workflow
1. **Feature Development**: Create feature branch from `main`
2. **Code Quality**: Run `npm run lint` and `npm run test`
3. **Documentation**: Update relevant docs as you build
4. **Testing**: Ensure all tests pass
5. **Commit**: Use descriptive commit messages

### Code Style
- **TypeScript**: Strict mode with comprehensive type checking
- **ESLint**: Enforced code standards and best practices
- **Prettier**: Consistent code formatting
- **Husky**: Pre-commit hooks for quality assurance

## 🏗️ Architecture

### Technology Stack
```
Frontend (Renderer Process)
├── React 18.2           # UI Framework
├── TypeScript 5.2       # Type Safety  
├── Lucide React 0.292   # Professional Vector Icons ✅
├── CSS Custom Props     # Pink Theme System ✅
├── Framer Motion        # Smooth Animations
└── Vite 4.5            # Fast Build Tool ✅

Desktop Integration
├── Electron 27          # Cross-platform Framework ✅
├── Custom Window        # Frameless Design ✅
├── Windows Mica         # Transparency Effects ✅
└── IPC Communication   # Process Communication ✅

External Services
├── Ollama API           # AI Model Backend ✅
├── Hugging Face         # Model Repository (Planned)
└── File System          # Local Storage ✅
```

### Key Design Principles
- **Modularity**: Clean separation of concerns
- **Type Safety**: Comprehensive TypeScript usage
- **Performance**: Optimized for smooth interactions
- **Accessibility**: Inclusive design practices
- **Documentation**: Self-documenting code and comprehensive guides

## 🎨 Customization

### Themes
Weenus AI supports multiple themes:
- **Light Mode**: Clean, modern light interface
- **Dark Mode**: Easy on the eyes dark interface
- **System**: Automatically matches your OS preference
- **Custom Themes**: Create your own color schemes

### Widgets
Toggleable UI components for personalized workflow:
- **Statistics Dashboard**: Real-time performance metrics
- **Quick Actions**: Frequently used operations
- **Model Selector**: Fast model switching
- **Chat Shortcuts**: Template responses and commands

## 🔧 Configuration

### Settings Location
- **Windows**: `%APPDATA%/Weenus AI/`
- **macOS**: `~/Library/Application Support/Weenus AI/`
- **Linux**: `~/.config/Weenus AI/`

### Key Configuration Files
- `settings.json`: Application preferences
- `chat-history.db`: Conversation storage
- `models.json`: Model configurations
- `themes/`: Custom theme definitions

## 🐛 Troubleshooting

### Common Issues

#### Installation Problems
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Ollama Connection Issues
1. Verify Ollama is running: `ollama list`
2. Check API URL in Settings (default: `http://localhost:11434`)
3. Ensure firewall allows local connections

#### Performance Issues
1. **High Memory Usage**: Restart application, check for memory leaks
2. **Slow Responses**: Verify GPU drivers, check model size
3. **UI Lag**: Disable animations in Settings

### Getting Help
- **[Issues](https://github.com/weenus-ai/issues)**: Report bugs and request features
- **[Discussions](https://github.com/weenus-ai/discussions)**: Community support
- **[Wiki](https://github.com/weenus-ai/wiki)**: Additional documentation

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](docs/developer/contributing.md) for details.

### Ways to Contribute
- 🐛 **Bug Reports**: Help us identify and fix issues
- 💡 **Feature Requests**: Suggest new capabilities
- 📖 **Documentation**: Improve guides and examples
- 🧪 **Testing**: Help test new features and releases
- 💻 **Code**: Implement features and fix bugs

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

### Technologies
- **[Ollama](https://ollama.ai)**: Local AI model runtime
- **[Electron](https://electronjs.org)**: Cross-platform desktop framework
- **[React](https://reactjs.org)**: UI component library
- **[Vite](https://vitejs.dev)**: Fast build tool
- **[Tailwind CSS](https://tailwindcss.com)**: Utility-first CSS framework

### Inspiration
- Modern AI interfaces and design patterns
- Open source desktop applications
- Developer-friendly tools and workflows

## 📈 Roadmap

### Version 0.2.0 - Enhanced Features
- [ ] Plugin system for extensibility
- [ ] Advanced model configuration
- [ ] Collaborative features
- [ ] Mobile companion app

### Version 0.3.0 - AI Agents
- [ ] Autonomous AI agents
- [ ] Workflow automation
- [ ] Advanced integrations
- [ ] Enterprise features

### Long-term Vision
- [ ] Marketplace for models and themes
- [ ] Cloud synchronization options
- [ ] Advanced analytics and insights
- [ ] Multi-modal AI capabilities

---

<div align="center">

**Built with ❤️ by the Weenus AI Development Team**

*Making AI accessible, beautiful, and powerful for everyone*

</div>