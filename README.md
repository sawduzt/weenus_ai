# Weenus AI

A local-first desktop application for AI chat powered by Ollama.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Electron](https://img.shields.io/badge/Electron-27.0-purple?logo=electron)](https://www.electronjs.org/)
[![React](https://img.shields.io/badge/React-18.2-cyan?logo=react)](https://reactjs.org/)
[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-green.svg)](LICENSE)

## Features

- **Real-time Streaming Chat**: Conversational AI with local models via Ollama
- **Multi-Chat Sessions**: Manage multiple conversations with auto-generated titles and full-text search
- **Model Management**: Browse and download models from Ollama Registry and HuggingFace
- **Per-Model Parameters**: Fine-tune AI behavior with customizable temperature, top-p, top-k, repeat penalty, and max tokens
- **Model Switching**: Change models mid-conversation
- **Chat History**: Persistent local storage with date-based grouping
- **Custom Window Controls**: Native-style desktop window with pink bunny theme
- **100% Local**: No cloud, no tracking - all data stays on your machine

## Prerequisites

- **Node.js** 18 or higher
- **[Ollama](https://ollama.ai)** - Local AI model runtime
- At least one AI model: `ollama pull llama2`

## Installation

```bash
git clone https://github.com/sawduzt/weenus-ai.git
cd weenus-ai
npm install
```

## Development

```bash
npm run dev          # Start development mode
npm run build        # Build for production
npm run lint         # Check code quality
npm run format       # Format code
```

The app will connect to Ollama on `localhost:11434` and load your installed models.

## Tech Stack

- **Frontend**: React 18 + TypeScript 5.2
- **Desktop**: Electron 27
- **Build**: Vite 4.5
- **State**: Redux Toolkit
- **Storage**: electron-store (local JSON)
- **Icons**: Lucide React
- **AI Integration**: Ollama API

## Documentation

- **User Guide**: [docs/user/GETTING_STARTED.md](docs/user/GETTING_STARTED.md)
- **Development**: [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md)
- **UI Framework**: [docs/UI_FRAMEWORK.md](docs/UI_FRAMEWORK.md)
- **Features**:
  - [Multi-Chat System](docs/CHAT_SYSTEM.md)
  - [Model Library](docs/MODEL_LIBRARY_IMPLEMENTATION.md)
  - [Model Parameters](docs/MODEL_PARAMETERS.md)

## Project Structure

```
weenus-ai/
├── src/
│   ├── components/     # React components (layout, UI, theme)
│   ├── pages/          # Application pages
│   ├── services/       # Ollama, chat, and parameter services
│   ├── hooks/          # Custom React hooks
│   ├── types/          # TypeScript definitions
│   └── styles/         # Global CSS
├── electron/           # Electron main and preload
├── docs/               # Documentation
└── build/              # Production builds
```

## License

GNU Affero General Public License v3.0 - see [LICENSE](LICENSE)

## Built By

[Sawduzt](https://github.com/sawduzt) with help from [Claude](https://www.anthropic.com/claude) and [Copilot](https://github.com/copilot)
