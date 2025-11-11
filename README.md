<div align="center">

# 🐰 Weenus AI

### A beautiful, local-first desktop app for AI chat

Chat with AI models running on your machine. No cloud. No tracking. Just you and your AI.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Electron](https://img.shields.io/badge/Electron-27.0-purple?logo=electron)](https://www.electronjs.org/)
[![React](https://img.shields.io/badge/React-18.2-cyan?logo=react)](https://reactjs.org/)
[![License](https://img.shields.io/badge/License-AGPL%20v3-green.svg)](LICENSE)

[Features](#-features) • [Getting Started](#-getting-started) • [Screenshots](#-screenshots) • [Development](#-development)

</div>

---

##  Features

###  **Smart Chat Interface**
- Real-time streaming responses from local AI models
- Multiple chat sessions with auto-generated titles
- Full chat history with search across all conversations
- Beautiful message bubbles with smooth animations

###  **Granular Control**
- Per-model parameter configuration (Temperature, Top-P, Top-K, Repeat Penalty, Max Tokens)
- Switch models mid-conversation
- Save custom presets for each AI model
- Live connection status monitoring

###  **Beautiful Design**
- Cute pink bunny theme with professional UI
- Custom window controls (frameless design)
- Smooth 60fps interactions
- System font integration for native feel

###  **Privacy First**
- 100% local - all data stays on your machine
- No cloud services, no tracking, no telemetry
- Powered by [Ollama](https://ollama.ai) for local AI models
- Your conversations belong to you

---

##  Getting Started

### Prerequisites

1. **Node.js 18+** - [Download here](https://nodejs.org/)
2. **Ollama** - [Get it from ollama.ai](https://ollama.ai)
3. **At least one AI model** - Run `ollama pull llama2` to get started

### Installation

```bash
# Clone the repository
git clone https://github.com/sawduzt/weenus-ai.git
cd weenus-ai

# Install dependencies
npm install

# Start the app
npm run dev
```

The app will automatically:
1. Connect to Ollama (or show a "Start Ollama" button if it's not running)
2. Load your installed AI models
3. Open a beautiful chat interface ready to use

### First Time Setup

If Ollama isn't installed, the app will guide you through:
1. Download Ollama from [ollama.ai](https://ollama.ai)
2. Install at least one model: `ollama pull llama2`
3. Start chatting!

---

## 🖼️ Screenshots

> *Coming soon - Screenshots will be added as development progresses*

---

##  Current Status

**Version:** 0.1.0 (Alpha)  
**Last Updated:** November 11, 2025

### What's Working 
- Real-time streaming chat with Ollama models
- Multiple chat sessions with persistence
- AI-generated chat titles
- Model switching during conversations
- Per-model parameter configuration
- Custom window controls (minimize/maximize/close)
- Connection status monitoring
- Full-text search across chat history
- Beautiful toast notifications

### In Development 
- Loading animations and spinners
- Quick parameter adjustments during chat
- Model download from Ollama registry
- Message export (JSON/Markdown)
- Keyboard shortcuts

---

##  Development

### Available Commands

```bash
npm run dev          # Start development mode with hot reload
npm run build        # Build for production
npm run lint         # Check code quality
npm run format       # Format code with Prettier
npm run test         # Run tests
```

### Tech Stack

- **Frontend**: React 18 + TypeScript 5.2
- **Desktop**: Electron 27 (frameless windows)
- **Build**: Vite 4.5 (fast builds & HMR)
- **State**: React Context API + Custom Hooks
- **Storage**: electron-store (local JSON persistence)
- **Icons**: Lucide React (professional vector icons)
- **AI**: Ollama API (local model inference)

### Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── layout/       # MainLayout, Sidebar, StatusBar, WindowControls
│   ├── theme/        # ThemeProvider
│   └── ui/           # Toast, ToggleSwitch
├── pages/            # Full-page views
│   ├── ChatPage.tsx
│   ├── SettingsPage.tsx
│   └── ModelLibraryPage.tsx
├── services/         # Business logic
│   ├── chat.ts       # Chat CRUD & search
│   ├── ollama.ts     # Ollama API client
│   └── modelParameters.ts
├── hooks/            # Custom React hooks
│   ├── useChat.ts
│   ├── useOllama.ts
│   └── useModelParameters.ts
└── types/            # TypeScript definitions
```

---

##  Design Philosophy

### Local-First
All your data stays on your machine. No cloud services, no tracking, no subscriptions. You own your conversations.

### Beautiful Simplicity
Powerful AI features wrapped in an intuitive, cute interface. Professional design with a playful bunny theme.

### Performance Matters
Optimized for 60fps interactions with sub-3-second startup. Every animation is intentional and smooth.

### Privacy by Default
Your AI conversations are personal. Weenus AI never sends data to external servers.

---

##  Contributing

Contributions are welcome! Whether it's bug reports, feature requests, or code contributions.

### Ways to Contribute
- Report bugs via [GitHub Issues](https://github.com/sawduzt/weenus-ai/issues)
- Suggest features via [Discussions](https://github.com/sawduzt/weenus-ai/discussions)
- Submit pull requests (please read [CONTRIBUTING.md](CONTRIBUTING.md) first)
- Improve documentation
- Share your experience with Weenus AI

---

##  License

This project is licensed under the **GNU Affero General Public License v3.0** - see the [LICENSE](LICENSE) file for details.

This means:
- ✅ Free to use, modify, and distribute
- ✅ Source code must remain open
- ✅ Network use = distribution (must share modifications)

---

## 🙏 Acknowledgments

Built with amazing open source technologies:
- [Ollama](https://ollama.ai) - Local AI model runtime
- [Electron](https://electronjs.org) - Cross-platform desktop framework
- [React](https://reactjs.org) - UI framework
- [Vite](https://vitejs.dev) - Lightning-fast build tool
- [Lucide](https://lucide.dev) - Beautiful icon system

---

## 🗺️ Roadmap

### Near-term (Q4 2025)
- [ ] In-chat parameter quick-adjust panel
- [ ] Model download interface
- [ ] Message export (JSON/Markdown)
- [ ] Keyboard shortcuts
- [ ] Loading animations

### Mid-term (Q1 2026)
- [ ] Image generation interface
- [ ] Video generation interface
- [ ] Advanced model management
- [ ] Statistics dashboard
- [ ] Theme customization

### Long-term
- [ ] Plugin system
- [ ] Multi-language support
- [ ] Mobile companion app
- [ ] Advanced AI agent features

---

<div align="center">

**Built with ❤️ by [Sawduzt](https://github.com/sawduzt)**

*Making local AI accessible, beautiful, and powerful*

[⭐ Star this repo](https://github.com/sawduzt/weenus-ai) • [🐛 Report Bug](https://github.com/sawduzt/weenus-ai/issues) • [💡 Request Feature](https://github.com/sawduzt/weenus-ai/issues)

</div></div>



## Getting started## Status



### Prerequisites## 🚀 Development Status

- Node.js 18+

- Ollama (get it from [ollama.ai](https://ollama.ai))**Working** (November 11, 2025):

- At least one AI model installed (`ollama pull llama2`, etc.)

- ✅ Streaming chat with Ollama**Current Status: Ollama Integration Complete - Fully Functional Chat!** 

### Install & Run

- ✅ Model selection and switching

```bash

# Install dependencies- ✅ Per-model parameter configuration (temperature, top-p, top-k, repeat penalty, max tokens)### ✅ **MILESTONE: Complete Ollama Integration (November 10, 2025)**

npm install

- ✅ Custom window controls (minimize, maximize, close)

# Start dev environment (Vite + Electron)

npm run dev- ✅ Settings panel with Ollama path config**🎯 Phase 1, 2, 3 & 4 - COMPLETE**



# Build for production- ✅ Message persistence with electron-store- ✅ **Project Foundation**: Complete TypeScript + Electron + React setup

npm run build

```- ✅ Cute bunny theme throughout- ✅ **Code Quality**: ESLint, Prettier, comprehensive linting configured  



The app will:- ✅ **Ollama Integration**: Full API client with connection monitoring, auto-start, auto-restart

1. Try to connect to Ollama on `localhost:11434`

2. Load your installed models**In progress**:- ✅ **React Hooks**: `useOllama` for connection, models, and streaming chat

3. Let you start chatting

- 🔄 Fix streaming interruption when navigating pages- ✅ **UI Framework**: Modern layout with Windows Mica effects and pink theme

If Ollama isn't running, there's a "Start Ollama" button in the app.

- 🔄 Add loading spinner animations- ✅ **Theming System**: Cute pink theme with light/dark variants, green connection indicator

## Features explained

- 🔄 Quick parameter tweaks during chat- ✅ **Professional Icons**: Complete Lucide React vector icon system (bunny logo!)

### Per-model parameters

- 🔄 Model download feature from Ollama registry- ✅ **Custom Window Controls**: Minimize, maximize, close buttons (fully functional)

Go to Settings → Parameters to customize each model:

- **Temperature** (0.0-2.0): How creative/random responses are- ✅ **Navigation**: Responsive sidebar with enhanced collapse/expand UX

- **Top P** (0.0-1.0): Diversity in word choice

- **Top K** (1-100): How many candidate words to consider## Getting started- ✅ **Application Pages**: Chat, Settings, Model Library, Image Gen, Video Gen

- **Repeat Penalty** (0.5-2.0): Avoid repetitive responses

- **Max Tokens** (100-8192): Maximum response length- ✅ **Frameless Design**: Custom title bar with draggable regions



Settings are saved and used for every chat with that model.### Prerequisites- ✅ **Enhanced Spacing**: Proper padding and rounded corners throughout



### Window controls- Node.js 18+- ✅ **UI Polish Complete**: No emojis, consistent iconography, rounded chat interface



Custom minimize/maximize/close buttons in the title bar. Click and drag the header to move the window.- Ollama (get it from [ollama.ai](https://ollama.ai))- ✅ **Chat Interface**: Real-time streaming chat with message bubbles, model selector, clear button



### Model library- At least one AI model installed (`ollama pull llama2`, etc.)- ✅ **Model Library**: Display installed models with metadata (name, size, modified date)



View all your installed Ollama models with metadata. Download more models directly from the Ollama CLI.- ✅ **Auto-Start Ollama**: One-click button to launch Ollama service automatically



## Architecture### Install & Run- ✅ **Connection Status**: Real-time connection indicator in status bar (red/green)



- **Electron**: Desktop app framework with custom window chrome- ✅ **Settings**: Model path configuration with folder picker and auto-restart

- **React 18**: UI components and state management

- **TypeScript**: Full type safety, strict mode```bash

- **Vite**: Fast builds and hot reload development

- **electron-store**: Simple JSON storage for settings and chat history# Install dependencies### 🎉 **Working Features**

- **Lucide React**: Professional vector icons

npm install- 💬 **Streaming Chat**: Real-time responses from Ollama models

## Development

- 🤖 **Model Selection**: Switch between installed models on-the-fly

```bash

npm run dev          # Start with hot reload# Start dev environment (Vite + Electron)- 📦 **Model Library**: View all installed models with details

npm run build        # Production build

npm run lint         # Check code qualitynpm run dev- 🟢 **Connection Monitor**: Live status indicator showing Ollama connection

npm run format       # Format with Prettier

npm run test         # Run tests- ▶️ **Auto-Start**: Click "Start Ollama" to launch service automatically

```

# Build for production- 📁 **Custom Model Path**: Configure where models are stored

## Documentation

npm run build- 🔄 **Auto-Restart**: Save settings and restart Ollama with new configuration

- **[User Guide](docs/user/GETTING_STARTED.md)**: How to use the app

- **[Project Structure](docs/developer/project-structure.md)**: Code organization```- 🗑️ **Clear Chat**: Reset conversation history

- **[Build System](docs/developer/build-system.md)**: TypeScript & Vite setup

- **[Dependencies](docs/developer/dependencies.md)**: Why we use each package



## What's nextThe app will:### 📅 **Next Phase (Ready to Begin)**



- Model marketplace (download from Hugging Face, Ollama registry)1. Try to connect to Ollama on `localhost:11434`- **Phase 5**: Chat History Persistence (save/load conversations)

- Improved error handling and reconnection logic

- More themes and customization options2. Load your installed models- **Phase 6**: Media Generation Features (Image/Video)  

- Keyboard shortcuts

- Export conversations3. Let you start chatting- **Phase 7**: Advanced Features (Statistics, Widgets)



## License- **Phase 8**: Polish & Enhancement



GNU Affero General Public License v3.0 - see [LICENSE](LICENSE) fileIf Ollama isn't running, there's a "Start Ollama" button in the app.- **Phase 9**: Testing & Documentation



## Built by



Sawduzt, November 2025## Features explained---




### Per-model parameters### 🎯 Core Capabilities

- **💬 Advanced Chat Interface**: Seamless conversations with local AI models

Go to Settings → Parameters to customize each model:- **🖼️ Image Generation**: Create stunning visuals with AI-powered tools

- **Temperature** (0.0-2.0): How creative/random responses are- **🎥 Video Generation**: Generate videos with cutting-edge AI models

- **Top P** (0.0-1.0): Diversity in word choice- **🤖 Model Management**: Download, configure, and switch between AI models effortlessly

- **Top K** (1-100): How many candidate words to consider- **📊 Real-time Statistics**: Monitor GPU usage, VRAM, tokens/second, and performance metrics

- **Repeat Penalty** (0.5-2.0): Avoid repetitive responses- **🎨 Beautiful UI**: Modern design with Windows Mica effects, rounded corners, and customizable themes

- **Max Tokens** (100-8192): Maximum response length- **🐰 Bunny Logo**: Cute rabbit icon replacing generic sparkles for unique branding



Settings are saved and used for every chat with that model.### 🚀 Advanced Features

- **📁 File Upload Support**: Chat with documents, images, and other files

### Window controls- **💾 Persistent Chat History**: Never lose your conversations

- **⚙️ Per-Model Parameters**: Fine-tune settings for each AI model

Custom minimize/maximize/close buttons in the title bar. Click and drag the header to move the window.- **🔌 Widget System**: Customizable, toggleable UI components

- **🌐 Network Access**: Optional web interface for multi-device access

### Model library- **🎭 Theme Customization**: Multiple themes with custom theme creation

- **⌨️ Keyboard Shortcuts**: Efficient workflow with hotkeys

View all your installed Ollama models with metadata. Download more models directly from the Ollama CLI.

## 🖥️ Screenshots

## Architecture

*Screenshots will be added as the application develops*

- **Electron**: Desktop app framework with custom window chrome

- **React 18**: UI components and state management## 📋 Requirements

- **TypeScript**: Full type safety, strict mode

- **Vite**: Fast builds and hot reload development### System Requirements

- **electron-store**: Simple JSON storage for settings and chat history- **OS**: Windows 10/11, macOS 10.15+, or Linux (Ubuntu 18.04+)

- **Lucide React**: Professional vector icons- **RAM**: 8GB minimum, 16GB recommended

- **Storage**: 2GB for application, additional space for AI models

## Development- **GPU**: Optional but recommended for enhanced performance



```bash### Dependencies

npm run dev          # Start with hot reload- **Node.js**: 18.0.0 or later

npm run build        # Production build- **npm**: 9.0.0 or later

npm run lint         # Check code quality- **Ollama**: For AI model backend (automatically detected)

npm run format       # Format with Prettier

npm run test         # Run tests## 🚀 Quick Start

```

### 1. Clone and Install

## Documentation```bash

# Clone the repository

- **[User Guide](docs/user/GETTING_STARTED.md)**: How to use the appgit clone <repository-url>

- **[Project Structure](docs/developer/project-structure.md)**: Code organizationcd weenus-ai

- **[Build System](docs/developer/build-system.md)**: TypeScript & Vite setup

- **[Dependencies](docs/developer/dependencies.md)**: Why we use each package# Install dependencies

npm install

## What's next```



- Model marketplace (download from Hugging Face, Ollama registry)### 2. Start Development

- Improved error handling and reconnection logic```bash

- More themes and customization options# Start the development environment

- Keyboard shortcutsnpm run dev

- Export conversations```



## LicenseThis will:

- Launch the Vite development server

GNU Affero General Public License v3.0 - see [LICENSE](LICENSE) file- Start Electron with hot reload

- Open the Weenus AI application

## Built by

### 3. First Time Setup

Sawduzt, November 20251. **Install Ollama**: Download from [ollama.ai](https://ollama.ai) if not already installed

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