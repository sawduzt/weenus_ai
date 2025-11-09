# 📁 Project Structure Documentation

> *A comprehensive guide to the Weenus AI project directory structure and organization*

## 🏗️ Directory Overview

The Weenus AI project follows a clean, modular architecture that separates concerns and promotes maintainability:

```
weenus-ai/
├── src/                    # Source code
│   ├── components/         # Reusable React components
│   ├── pages/             # Main application pages/views
│   ├── services/          # External service integrations (Ollama, etc.)
│   ├── store/             # State management (Redux/Zustand)
│   ├── utils/             # Helper functions and utilities
│   ├── types/             # TypeScript type definitions
│   └── assets/            # Static assets (images, fonts, icons)
├── docs/                  # Documentation
│   ├── user/              # End-user documentation
│   └── developer/         # Developer documentation
├── tests/                 # Test files and test utilities
├── build/                 # Build outputs and distribution files
├── package.json           # Project dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── vite.config.ts         # Vite build configuration
└── README.md              # Project overview and quick start
```

## 📂 Detailed Directory Descriptions

### `src/` - Source Code
The heart of the application containing all TypeScript/React source code.

#### `src/components/`
Reusable UI components that can be used across different pages.
- **Purpose**: Promote code reuse and maintain UI consistency
- **Examples**: Button, Modal, ChatMessage, ModelSelector
- **Naming**: PascalCase (e.g., `ChatMessage.tsx`)

#### `src/pages/`
Main application views and page-level components.
- **Purpose**: Top-level components that represent different app screens
- **Examples**: ChatPage, SettingsPage, ModelManager
- **Structure**: Each page may have its own folder with related components

#### `src/services/`
External service integrations and API clients.
- **Purpose**: Abstraction layer for external dependencies
- **Examples**: OllamaService, HuggingFaceAPI, FileSystem
- **Pattern**: Service classes with clear interfaces

#### `src/store/`
State management logic and global application state.
- **Purpose**: Centralized state management
- **Structure**: Separate slices for different domains (chat, models, settings)
- **Tools**: Redux Toolkit or Zustand stores

#### `src/utils/`
Helper functions, utilities, and shared logic.
- **Purpose**: Common functionality that doesn't belong to specific components
- **Examples**: Date formatting, file handling, validation
- **Organization**: Grouped by functionality

#### `src/types/`
TypeScript type definitions and interfaces.
- **Purpose**: Type safety and code documentation
- **Structure**: Domain-specific type files
- **Naming**: Descriptive names with `.types.ts` suffix

#### `src/assets/`
Static assets like images, fonts, and icons.
- **Purpose**: Centralized asset management
- **Organization**: Subfolders by asset type
- **Optimization**: Optimized for production builds

### `docs/` - Documentation
Comprehensive documentation for users and developers.

#### `docs/user/`
End-user facing documentation.
- **Target**: Application users
- **Content**: Installation guides, tutorials, troubleshooting
- **Format**: Markdown with screenshots and examples

#### `docs/developer/`
Technical documentation for developers.
- **Target**: Developers and maintainers
- **Content**: Architecture, APIs, contributing guidelines
- **Format**: Technical markdown with code examples

### `tests/` - Testing
All test files and testing utilities.
- **Structure**: Mirrors `src/` structure
- **Types**: Unit tests, integration tests, E2E tests
- **Tools**: Jest, React Testing Library

### `build/` - Build Outputs
Generated files and distribution packages.
- **Purpose**: Production-ready application files
- **Content**: Compiled code, assets, installers
- **Note**: Not version controlled (in .gitignore)

## 🎯 Design Principles

### Modularity
Each directory has a clear, single responsibility, making the codebase easy to navigate and maintain.

### Scalability
The structure supports growth - new features can be added without restructuring.

### Separation of Concerns
Business logic, UI components, and external integrations are clearly separated.

### Documentation-First
Every major component and service is documented as it's created.

## 🔄 File Naming Conventions

### Components
- **Format**: PascalCase
- **Example**: `ChatMessage.tsx`, `ModelSelector.tsx`
- **Structure**: One component per file

### Pages
- **Format**: PascalCase with "Page" suffix
- **Example**: `ChatPage.tsx`, `SettingsPage.tsx`

### Services
- **Format**: PascalCase with "Service" suffix
- **Example**: `OllamaService.ts`, `FileService.ts`

### Types
- **Format**: camelCase with ".types.ts" suffix
- **Example**: `chat.types.ts`, `model.types.ts`

### Utilities
- **Format**: camelCase
- **Example**: `dateUtils.ts`, `validation.ts`

## 📝 Development Workflow

1. **Feature Development**: Start in appropriate `src/` subdirectory
2. **Documentation**: Update relevant docs as you build
3. **Testing**: Add tests in `tests/` with matching structure
4. **Integration**: Ensure components work together properly

---

*This structure document is updated as the project evolves. Last updated: November 2025*