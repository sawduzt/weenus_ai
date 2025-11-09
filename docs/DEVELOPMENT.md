# Development Environment Setup

This document provides comprehensive setup instructions for the Weenus AI development environment.

## 📋 Prerequisites

Before setting up the development environment, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Git** for version control
- **VS Code** (recommended) with the following extensions:
  - ESLint
  - Prettier - Code formatter
  - TypeScript and JavaScript Language Features

## 🚀 Initial Setup

1. **Clone the repository** (or extract if from archive):
   ```bash
   cd "d:\ai if it sucked\weenus-ai"
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
│   ├── pages/              # Main application pages
│   ├── services/           # API and external services
│   ├── store/              # State management
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Helper functions
│   └── assets/             # Static assets
├── electron/
│   ├── main.ts             # Electron main process
│   └── preload.ts          # Preload script
├── tests/                  # Test files
├── docs/                   # Documentation
└── build/                  # Build outputs
```

## ⚙️ Configuration Files

### ESLint (`.eslintrc.json`)
- Enforces code quality and consistency
- Configured for TypeScript and React
- Includes recommended rules for modern development

### Prettier (`.prettierrc.json`)
- Handles code formatting automatically
- Configured for consistent style across the project
- Integrates with VS Code for format-on-save

### TypeScript (`tsconfig.json`)
- Strict type checking enabled
- Modern ES features supported
- Configured for React JSX

### Vite (`vite.config.ts`)
- Fast development server
- Hot module replacement
- Optimized production builds

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
- Use CSS modules or styled-components
- Follow BEM methodology for CSS classes
- Maintain consistent spacing and naming

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
# Rebuild native dependencies
npm run rebuild
```

## 📊 Performance Monitoring

Monitor development performance using:
- Vite dev server metrics
- TypeScript compilation time
- ESLint execution time
- Test execution time

Keep build times under:
- Development: < 3 seconds
- Type checking: < 10 seconds
- Full build: < 30 seconds

---

*This documentation is updated as the development environment evolves.*