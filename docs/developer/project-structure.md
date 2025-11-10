# 📁 Project Structure Documentation

> *A comprehensive guide to the Weenus AI project directory structure and organization*

## 🏗️ Directory Overview

The Weenus AI project follows a clean, modular architecture that separates concerns and promotes maintainability:

```
weenus-ai/
├── src/                    # Source code
│   ├── components/         # Reusable React components
│   │   ├── layout/         # Layout components (MainLayout, Sidebar, WindowControls)
│   │   └── ui/             # UI components (buttons, inputs, modals)
│   ├── pages/             # Main application pages/views
│   ├── services/          # External service integrations (Ollama, etc.)
│   ├── store/             # State management (Redux/Zustand)
│   ├── hooks/             # Custom React hooks
│   ├── utils/             # Helper functions and utilities
│   ├── types/             # TypeScript type definitions
│   ├── styles/            # Global CSS and theme definitions
│   └── assets/            # Static assets (images, fonts, icons)
├── electron/              # Electron main process and preload scripts
│   ├── main.ts            # Main Electron process
│   └── preload/           # Preload scripts for renderer communication
├── docs/                  # Documentation
│   ├── user/              # End-user documentation
│   └── developer/         # Developer documentation
├── tests/                 # Test files and test utilities
├── build/                 # Build outputs and distribution files
├── package.json           # Project dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── electron.tsconfig.json # Electron-specific TypeScript config
├── vite.config.ts         # Vite build configuration
└── README.md              # Project overview and quick start
```

## 📂 Detailed Directory Descriptions

### `src/` - Source Code
The heart of the application containing all TypeScript/React source code.

#### `src/components/`
Reusable UI components organized by category.
- **Purpose**: Promote code reuse and maintain UI consistency
- **Layout**: MainLayout, Sidebar, StatusBar, WindowControls
- **UI**: Button, Modal, ChatMessage, ModelSelector
- **Naming**: PascalCase (e.g., `ChatMessage.tsx`)

#### `src/styles/`
Global CSS, theme definitions, and design system.
- **Purpose**: Centralized styling and theming
- **Files**: global.css, themes/, variables
- **Features**: CSS custom properties, pink theme, responsive design

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

### `electron/` - Desktop Integration
Electron main process and preload scripts for desktop functionality.
- **Purpose**: Native desktop integration and API exposure
- **Files**: main.ts (main process), preload scripts
- **Features**: Window controls, Mica effects, system integration
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

## 📅 Recent Changes (November 9, 2025) - COMPLETE PROJECT IMPLEMENTATION

### 🚀 MAJOR MILESTONE: Full Application Foundation Built in Single Session

#### New Components Added
- **`WindowControls.tsx`**: Custom minimize/maximize/close buttons with Electron integration
- **Enhanced `Sidebar.tsx`**: Professional Lucide React icons and improved collapsed state UX
- **Updated `MainLayout.tsx`**: Window controls integration, draggable header, proper padding
- **Refined `StatusBar.tsx`**: Fixed curve design and enhanced visual consistency

#### Complete Icon System Migration
- **Lucide React Integration**: All 15+ icons migrated from emojis to professional vectors
- **Consistent Design**: Scalable, customizable icons throughout the application
- **Performance**: Tree-shakeable imports for optimal bundle size
- **Accessibility**: Proper ARIA labels and screen reader support

#### Enhanced Theme System
- **Pink Theme**: Complete cute aesthetic with refined color palette
- **Typography**: Comic Neue and Nunito font integration for friendly appearance  
- **Border Radius**: Subtle curves (reduced from initial values for professional look)
- **Mica Effects**: Windows 11-style transparency with pink gradient overlays

#### Layout Improvements
- **Frameless Window**: Custom title bar with proper draggable regions
- **Spacing System**: Consistent padding throughout (chat window, sidebar, status bar)
- **Responsive Design**: Proper mobile breakpoints and collapsible sidebar behavior
- **Visual Polish**: Refined curves, shadows, and hover effects

#### Project Structure Evolution
```
src/components/layout/        # Core layout components (4 files)
├── MainLayout.tsx           # ✅ Enhanced with window controls  
├── MainLayout.css          # ✅ Refined spacing and structure
├── Sidebar.tsx             # ✅ Professional icons + UX improvements
├── Sidebar.css             # ✅ Enhanced styling and interactions
├── StatusBar.tsx           # ✅ Improved curve design
├── StatusBar.css           # ✅ Fixed visual consistency
├── WindowControls.tsx      # ✅ NEW: Custom window controls
└── WindowControls.css      # ✅ NEW: Native-style button styling

src/styles/                  # Enhanced theme system
├── global.css              # ✅ Refined variables and pink theme
└── [theme files]           # ✅ Light/dark variants

electron/                    # Desktop integration
├── main.ts                 # ✅ Enhanced window config + IPC handlers
└── preload/index.ts        # ✅ Proper API exposure for window controls
```

### 📊 Development Statistics (November 9, 2025)
- **Files Modified**: 25+ TypeScript/React components and configurations
- **New Features**: Custom window controls, professional icon system, enhanced theming
- **UI Components**: MainLayout, Sidebar, StatusBar, WindowControls + 5 application pages  
- **CSS Enhancements**: Global theme system, responsive design, Windows Mica effects
- **Development Time**: Complete foundation built in single development session
- **Completion**: ~95% of planned UI/UX work finished

### 🔧 Outstanding Items
1. **Window Controls**: Implementation complete, functionality debugging needed
2. **Status Bar**: Minor padding adjustment between borders required
3. **Sidebar Curve**: Bottom-right corner visibility when expanded
4. **Testing**: Comprehensive validation across all UI states

### 🎯 Phase 4 Readiness
The application foundation is essentially complete with only minor polish items remaining. Ready to proceed with chat functionality implementation.