# Weenus AI

A local-first desktop app for AI chat powered by Ollama.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Electron](https://img.shields.io/badge/Electron-27.0-purple?logo=electron)](https://www.electronjs.org/)
[![React](https://img.shields.io/badge/React-18.2-cyan?logo=react)](https://reactjs.org/)
[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-green.svg)](LICENSE)

## Features

- Real-time streaming chat with local AI models
- Multiple chat sessions with auto-generated titles
- Per-model parameter configuration (temperature, top-p, top-k, repeat penalty, max tokens)
- Model switching mid-conversation
- Full chat history with search
- Custom window controls with pink bunny theme
- 100% local - no cloud, no tracking

## Prerequisites

- Node.js 18+
- [Ollama](https://ollama.ai)
- At least one AI model: `ollama pull llama2`

## Installation

```bash
git clone https://github.com/sawduzt/weenus-ai.git
cd weenus-ai
npm install
npm run dev
```

The app will connect to Ollama on `localhost:11434` and load your models.

## Development

```bash
npm run dev          # Start development
npm run build        # Build for production
npm run lint         # Check code quality
npm run format       # Format code
npm run test         # Run tests
```

## Tech Stack

- React 18 + TypeScript 5.2
- Electron 27
- Vite 4.5
- electron-store (local JSON storage)
- Lucide React (icons)
- Ollama API

## License

GNU Affero General Public License v3.0 - see [LICENSE](LICENSE)

## Built By

[Sawduzt](https://github.com/sawduzt)
