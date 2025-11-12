# 📦 Dependencies Documentation

> *Comprehensive guide to all dependencies used in Weenus AI and the reasoning behind each choice*

## 🏗️ Core Framework Dependencies

### React Ecosystem
- **`react`** & **`react-dom`** (^18.2.0): Core React library for building the user interface
  - *Why*: Industry standard for component-based UI development
  - *Benefits*: Large ecosystem, excellent TypeScript support, great tooling

- **`react-router-dom`** (^6.8.0): Client-side routing for navigation
  - *Why*: Standard routing solution for React applications
  - *Benefits*: Declarative routing, nested routes, programmatic navigation

### Desktop Framework
- **`electron`** (^27.0.0): Cross-platform desktop app framework
  - *Why*: Enables building native desktop apps with web technologies
  - *Benefits*: Access to native APIs, cross-platform compatibility, large community

## 🏪 State Management

### Redux Toolkit
- **`@reduxjs/toolkit`** (^1.9.1): Modern Redux with less boilerplate
  - *Why*: Predictable state management for complex app state
  - *Benefits*: DevTools integration, immutable updates, excellent TypeScript support

- **`react-redux`** (^8.0.5): React bindings for Redux
  - *Why*: Official React integration for Redux
  - *Benefits*: Optimized re-renders, hooks API, TypeScript support

## 🎨 UI & Styling

### Animation & Motion
- **`framer-motion`** (^10.16.0): Production-ready motion library
  - *Why*: Creates smooth, beautiful animations for better UX
  - *Benefits*: Declarative animations, gesture support, layout animations

### Icons & Visual Elements
- **`lucide-react`** (^0.292.0): Beautiful, customizable vector icons
  - *Why*: Professional icon set with React components, replacing emoji usage
  - *Benefits*: Tree-shakeable, customizable, consistent design, great TypeScript support
  - *Usage*: Navigation icons, window controls, action buttons

### Styling Utilities
- **`tailwindcss`** (^3.3.5): Utility-first CSS framework
  - *Why*: Rapid UI development with consistent design system
  - *Benefits*: Small bundle size, customizable, excellent IntelliSense

- **`clsx`** (^2.0.0): Utility for constructing className strings
  - *Why*: Clean conditional class name handling
  - *Benefits*: Lightweight, simple API, great for component variants

- **`tailwind-merge`** (^2.0.0): Merge Tailwind classes without conflicts
  - *Why*: Prevents conflicting Tailwind classes in dynamic scenarios
  - *Benefits*: Intelligent class merging, TypeScript support

## 🔧 Utility Libraries

### HTTP Client
- **`axios`** (^1.6.0): Promise-based HTTP client
  - *Why*: Robust HTTP requests for Ollama API integration
  - *Benefits*: Request/response interceptors, automatic JSON handling, timeout support

### Date Handling
- **`date-fns`** (^2.29.3): Modern date utility library
  - *Why*: Lightweight, modular date manipulation
  - *Benefits*: Tree-shakeable, immutable, excellent TypeScript support

### Storage
- **`electron-store`** (^8.1.0): Simple data persistence for Electron
  - *Why*: Easy settings and data storage in desktop app
  - *Benefits*: JSON schema validation, encryption support, cross-platform

## 📝 Content Rendering

### Markdown Support
- **`react-markdown`** (^9.0.0): Markdown component for React
  - *Why*: Render AI responses with rich formatting
  - *Benefits*: Pluggable, secure by default, excellent customization

- **`react-syntax-highlighter`** (^15.5.0): Syntax highlighting component
  - *Why*: Beautiful code block rendering in AI responses
  - *Benefits*: Many themes, language support, lightweight

## 🛠️ Development Tools

### Build System
- **`vite`** (^4.5.0): Next-generation build tool
  - *Why*: Fast development server and optimized production builds
  - *Benefits*: Hot module replacement, ES modules, plugin ecosystem

- **`@vitejs/plugin-react`** (^4.1.0): React plugin for Vite
  - *Why*: Official React integration for Vite
  - *Benefits*: Fast refresh, JSX support, optimized for React

### TypeScript
- **`typescript`** (^5.2.2): Static type checking
  - *Why*: Type safety, better developer experience, catch errors early
  - *Benefits*: IntelliSense, refactoring support, self-documenting code

### Code Quality

#### Linting
- **`eslint`** (^8.53.0): JavaScript/TypeScript linter
  - *Why*: Enforce coding standards and catch potential issues
  - *Benefits*: Customizable rules, IDE integration, team consistency

- **`@typescript-eslint/eslint-plugin`** & **`@typescript-eslint/parser`**: TypeScript-specific ESLint rules
  - *Why*: TypeScript-aware linting rules
  - *Benefits*: Type-aware rules, modern JavaScript features

- **`eslint-plugin-react`** & **`eslint-plugin-react-hooks`**: React-specific linting
  - *Why*: React best practices and hooks rules
  - *Benefits*: Catch React antipatterns, enforce hooks rules

- **`eslint-plugin-jsx-a11y`**: Accessibility linting
  - *Why*: Ensure the app is accessible to all users
  - *Benefits*: Catch accessibility issues early, inclusive design

#### Formatting
- **`prettier`** (^3.0.3): Code formatter
  - *Why*: Consistent code formatting across the team
  - *Benefits*: Zero-config, editor integration, saves time

#### Git Hooks
- **`husky`** (^8.0.3): Git hooks made easy
  - *Why*: Run linting/formatting before commits
  - *Benefits*: Prevent bad commits, enforce quality standards

- **`lint-staged`** (^15.0.2): Run commands on staged files
  - *Why*: Only lint/format changed files for speed
  - *Benefits*: Fast pre-commit checks, incremental quality

### Testing

#### Core Testing
- **`jest`** (^29.7.0): JavaScript testing framework
  - *Why*: Comprehensive testing solution with great TypeScript support
  - *Benefits*: Snapshot testing, mocking, coverage reports

- **`ts-jest`** (^29.1.1): TypeScript preprocessor for Jest
  - *Why*: Run TypeScript tests without compilation step
  - *Benefits*: Type checking in tests, source maps

#### React Testing
- **`@testing-library/react`** (^13.4.0): React testing utilities
  - *Why*: Test React components the way users interact with them
  - *Benefits*: Best practices, accessibility-focused, simple API

- **`@testing-library/jest-dom`** (^6.1.4): Custom Jest matchers
  - *Why*: DOM-specific assertions for cleaner tests
  - *Benefits*: Readable assertions, better error messages

- **`@testing-library/user-event`** (^14.5.1): User interaction simulation
  - *Why*: Simulate realistic user interactions in tests
  - *Benefits*: More realistic than fireEvent, better test coverage

### Development Workflow
- **`concurrently`** (^8.2.2): Run multiple commands concurrently
  - *Why*: Start Vite dev server and Electron simultaneously
  - *Benefits*: Simplified development workflow, single command

- **`wait-on`** (^7.2.0): Wait for files/ports/URLs to become available
  - *Why*: Ensure Vite server is ready before starting Electron
  - *Benefits*: Reliable development startup, prevents race conditions

### Build & Distribution
- **`electron-builder`** (^24.6.4): Package and distribute Electron apps
  - *Why*: Create installers for Windows, macOS, and Linux
  - *Benefits*: Auto-updater support, code signing, multiple formats

## 🎯 Dependency Strategy

### Version Management
- **Pinned Major Versions**: Using `^` to allow patch and minor updates while preventing breaking changes
- **Regular Updates**: Dependencies will be updated monthly to stay secure and current
- **Security Monitoring**: Automated dependency vulnerability scanning

### Bundle Size Optimization
- **Tree Shaking**: All libraries chosen support tree shaking to minimize bundle size
- **Code Splitting**: React components and routes will be lazy-loaded where appropriate
- **Asset Optimization**: Images and other assets will be optimized during build

### Development Experience
- **TypeScript First**: All dependencies chosen have excellent TypeScript support
- **Hot Reload**: Fast development iteration with hot module replacement
- **Error Handling**: Clear error messages and debugging support

---

*This dependency documentation is maintained as packages are updated.*