# Development Guide

This document provides comprehensive setup instructions for the Weenus AI development environment.

## 📋 Prerequisites

Before setting up the development environment, ensure you have:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** for version control
- **Ollama** (for testing) - [Download here](https://ollama.ai)
- **VS Code** (recommended) with extensions:
  - ESLint
  - Prettier - Code formatter
  - TypeScript and JavaScript Language Features
  - Auto Rename Tag (for React JSX)

## 🚀 Initial Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/sawduzt/weenus-ai.git
   cd weenus-ai
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Verify setup**:
   ```bash
   npm run type-check
   npm run lint
   npm run format:check
   ```

## 🛠️ Development Workflow

### Starting Development Server

```bash
# Start the development environment (Vite + Electron)
npm run dev

# Or start components separately:
npm run dev:vite    # Start Vite dev server
npm run dev:electron # Start Electron app
```

### Code Quality Commands

```bash
# Linting
npm run lint         # Check for linting errors
npm run lint:fix     # Auto-fix linting errors

# Formatting
npm run format       # Format all code files
npm run format:check # Check if files are properly formatted

# Type checking
npm run type-check   # Run TypeScript type checking
```

### Testing

```bash
npm test             # Run tests once
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
```

### Building

```bash
npm run build        # Build for production
npm run preview      # Preview production build
```

## 📁 Project Structure

```
weenus-ai/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── layout/         # Layout components (MainLayout, Sidebar, StatusBar, WindowControls)
│   │   ├── ui/             # UI components (Toast, ToggleSwitch)
│   │   └── theme/          # Theme provider
│   ├── pages/              # Application pages (Chat, Settings, ModelLibrary, etc.)
│   ├── services/           # API and external services (Ollama, chat, parameters)
│   ├── hooks/              # Custom React hooks (useOllama, useChat, etc.)
│   ├── types/              # TypeScript type definitions
│   └── styles/             # Global styles and CSS
├── electron/
│   ├── main.ts             # Electron main process
│   └── preload/            # Preload scripts
├── docs/                   # Documentation
│   ├── user/              # User-facing documentation
│   └── developer/         # Technical documentation
├── tests/                  # Test files
└── build/                  # Build outputs
```

For detailed project structure documentation, see [docs/developer/project-structure.md](developer/project-structure.md).

## ⚙️ Configuration Files

### ESLint (`.eslintrc.json`)
Enforces code quality and consistency for TypeScript and React.

### Prettier (`.prettierrc.json`)
Handles code formatting automatically with editor integration.

### TypeScript (`tsconfig.json`, `electron.tsconfig.json`)
- Strict type checking enabled
- Separate configs for renderer and main process
- Modern ES features supported

### Vite (`vite.config.ts`)
- Fast development server with hot module replacement
- Optimized production builds
- Electron integration

For detailed build system documentation, see [docs/developer/build-system.md](developer/build-system.md).

## 🔧 VS Code Integration

The project includes VS Code settings (`.vscode/settings.json`) that:
- Enable format-on-save with Prettier
- Auto-fix ESLint issues on save
- Configure TypeScript preferences
- Hide build directories from explorer

## 📝 Code Standards

### TypeScript Guidelines
- Use explicit return types for functions
- Avoid `any` type when possible
- Prefer interfaces over type aliases for object shapes
- Use strict null checks

### React Guidelines
- Use functional components with hooks
- Prefer named exports for components
- Use TypeScript interfaces for props
- Follow React Hooks rules

### Styling Guidelines
- Use CSS modules for component styles
- Follow consistent naming conventions
- Maintain spacing and design system tokens

## 🚨 Common Issues & Solutions

### Node Modules Issues
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors
```bash
# Clear TypeScript cache
npx tsc --build --clean
npm run type-check
```

### Electron Issues
```bash
# Rebuild native dependencies if needed
npm rebuild
```

## 📊 Performance Guidelines

Monitor development performance:
- Vite dev server metrics
- TypeScript compilation time
- ESLint execution time

Target build times:
- Development startup: < 5 seconds
- Type checking: < 10 seconds
- Full production build: < 30 seconds

---

*For more detailed documentation, see:*
- *[Build System](developer/build-system.md)*
- *[Project Structure](developer/project-structure.md)*
- *[Dependencies](developer/dependencies.md)*