# 🐰 Weenus AI# Weenus AI



A beautiful, modern desktop application for chatting with local AI models. Powered by **Ollama**, built with **Electron** and **React**.A local-first desktop app for AI chat powered by Ollama.



> Keep your AI conversations private. All processing happens on your machine—zero cloud dependencies, zero tracking.[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue?logo=typescript)](https://www.typescriptlang.org/)

[![Electron](https://img.shields.io/badge/Electron-27.0-purple?logo=electron)](https://www.electronjs.org/)

[![Version](https://img.shields.io/badge/Version-0.1.0-blue)](https://github.com/sawduzt/weenus-ai)[![React](https://img.shields.io/badge/React-18.2-cyan?logo=react)](https://reactjs.org/)

[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue?logo=typescript)](https://www.typescriptlang.org/)[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-green.svg)](LICENSE)

[![Electron](https://img.shields.io/badge/Electron-27.0-purple?logo=electron)](https://www.electronjs.org/)

[![React](https://img.shields.io/badge/React-18.2-cyan?logo=react)](https://reactjs.org/)## Features

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-green.svg)](LICENSE)

- Real-time streaming chat with local AI models

---- Multiple chat sessions with auto-generated titles

- Per-model parameter configuration (temperature, top-p, top-k, repeat penalty, max tokens)

## ✨ Features- Model switching mid-conversation

- Full chat history with search

- 💬 **Real-time AI Chat** - Stream responses from local models as they're generated- Custom window controls with pink bunny theme

- 🤖 **Model Library** - Browse, download, and manage AI models from Ollama and HuggingFace- 100% local - no cloud, no tracking

- ⚙️ **Smart Parameters** - Fine-tune temperature, creativity, and response length per model

- 📊 **Performance Metrics** - Real-time display of tokens/second, memory usage, and GPU status## Prerequisites

- 🎨 **Beautiful Design** - Modern interface with cute pink bunny theme and smooth animations

- 💾 **Full Chat History** - All conversations saved locally with quick access from the sidebar- Node.js 18+

- 🔄 **Model Switching** - Change AI models mid-conversation without losing context- [Ollama](https://ollama.ai)

- 🛡️ **100% Private** - Zero cloud services, all data stays on your computer- At least one AI model: `ollama pull llama2`



---## Installation



## 🚀 Quick Start```bash

git clone https://github.com/sawduzt/weenus-ai.git

### 1. Install Prerequisitescd weenus-ai

npm install

**Download Ollama:** Visit [ollama.com](https://ollama.com) and install it for your operating system.npm run dev

```

### 2. Launch Weenus AI

The app will connect to Ollama on `localhost:11434` and load your models.

Double-click the **Weenus AI** application icon.

## Development

Wait for it to connect to Ollama (green dot in status bar = ready).

```bash

### 3. Download Your First Modelnpm run dev          # Start development

npm run build        # Build for production

1. Go to **Model Library** tabnpm run lint         # Check code quality

2. Click **Ollama Registry**npm run format       # Format code

3. Choose a model and click **Download** (start with Mistral or Phi-3)npm run test         # Run tests

4. Return to **Chat** and select your model```



### 4. Start Chatting!## Tech Stack



Select your model from the dropdown and type your first message. 🎉- React 18 + TypeScript 5.2

- Electron 27

---- Vite 4.5

- electron-store (local JSON storage)

## 📖 Getting Started Guide- Lucide React (icons)

- Ollama API

For detailed usage instructions, parameter tuning, troubleshooting, and tips, see **[GETTING_STARTED.md](docs/user/GETTING_STARTED.md)**.

## License

**Quick links:**

- 💬 [Chat Interface Guide](docs/user/GETTING_STARTED.md#-chat-page)GNU Affero General Public License v3.0 - see [LICENSE](LICENSE)

- 🤖 [Model Library Guide](docs/user/GETTING_STARTED.md#-model-library)

- ⚙️ [Settings & Parameters](docs/user/GETTING_STARTED.md#-settings)## Built By

- ❓ [FAQs](docs/user/GETTING_STARTED.md#-frequently-asked-questions)

- 🆘 [Troubleshooting](docs/user/GETTING_STARTED.md#-troubleshooting)[Sawduzt](https://github.com/sawduzt)


---

## 📋 System Requirements

- **OS:** Windows 10+, macOS 10.13+, or Linux
- **RAM:** 8GB minimum (16GB+ recommended for large models)
- **Storage:** 20GB+ free space for models
- **Internet:** Required for first setup and model downloads

**Optional:**
- **GPU:** NVIDIA with CUDA support for GPU acceleration
- **Ollama Version:** Latest recommended

---

## 🔧 What's Inside

- **Electron** - Cross-platform desktop application
- **React 18** - Modern UI framework
- **TypeScript** - Type-safe code
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Beautiful styling
- **Ollama API** - Local AI model backend

---

## 🆘 Getting Help

**Having issues?**
1. Check [Troubleshooting](docs/user/GETTING_STARTED.md#-troubleshooting) in the Getting Started guide
2. Make sure Ollama is running and models are downloaded
3. Restart Weenus AI and Ollama
4. Check your system resources (RAM, disk space)

**Still stuck?**
- [Ollama Official Docs](https://ollama.com)
- [GitHub Issues](https://github.com/sawduzt/weenus-ai/issues)

---

## 📄 License

GNU Affero General Public License v3.0 - see [LICENSE](LICENSE)

---

## 🎉 Enjoy!

Have fun exploring the power of local AI. Start small with models like **Mistral** or **Phi-3**, then experiment with larger models as you learn what works best for you.

Happy chatting! 🐰✨
