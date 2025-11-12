# Weenus AI Documentation

Welcome to the Weenus AI documentation. This folder contains comprehensive guides for both users and developers.

## User Documentation

For end users of the application:

- **[Getting Started Guide](user/GETTING_STARTED.md)** - Installation, features, and troubleshooting

## Developer Documentation

For developers working on the codebase:

### Setup & Configuration
- **[Development Guide](DEVELOPMENT.md)** - Setup, workflow, and common issues
- **[Build System](developer/build-system.md)** - Vite, TypeScript, and build configuration
- **[Dependencies](developer/dependencies.md)** - Package overview and rationale
- **[Project Structure](developer/project-structure.md)** - File organization and architecture

### Features & Components
- **[UI Framework](UI_FRAMEWORK.md)** - Design system, theming, and components
- **[Multi-Chat System](CHAT_SYSTEM.md)** - Chat sessions, history, and search
- **[Model Library](MODEL_LIBRARY_IMPLEMENTATION.md)** - Model browsing and downloads
- **[Model Parameters](MODEL_PARAMETERS.md)** - Per-model parameter configuration

## Quick Links

### Getting Started
1. Read the [User Guide](user/GETTING_STARTED.md) for installation
2. Check [Development Guide](DEVELOPMENT.md) for contributing
3. Review [Project Structure](developer/project-structure.md) to understand the codebase

### Working on Features
- UI changes? See [UI Framework](UI_FRAMEWORK.md)
- Chat features? See [Multi-Chat System](CHAT_SYSTEM.md)
- Model management? See [Model Library](MODEL_LIBRARY_IMPLEMENTATION.md)
- Parameters? See [Model Parameters](MODEL_PARAMETERS.md)

## Architecture Overview

```
Weenus AI
├── Electron Desktop App
│   ├── React UI (TypeScript)
│   ├── Vite Build System
│   └── electron-store (Local Storage)
├── Ollama Integration
│   ├── Real-time Streaming Chat
│   ├── Model Management
│   └── Parameter Configuration
└── Features
    ├── Multi-Chat Sessions
    ├── Model Library (Ollama + HuggingFace)
    ├── Per-Model Parameters
    └── Full-Text Search
```

## Contributing

1. Fork the repository
2. Read the [Development Guide](DEVELOPMENT.md)
3. Make your changes
4. Submit a pull request

## Support

- Check [Getting Started](user/GETTING_STARTED.md) for common issues
- Review feature-specific documentation for detailed troubleshooting
- File issues on GitHub for bugs or feature requests

---

*Documentation is maintained as the project evolves.*
