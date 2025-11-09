# UI Framework Documentation

This document provides comprehensive documentation for the Weenus AI user interface framework, including components, styling system, and theming.

## 📋 Overview

The Weenus AI UI framework is built with:

- **React** for component-based architecture
- **TypeScript** for type safety
- **CSS Custom Properties** for theming
- **Windows Mica Effects** for modern aesthetics
- **Responsive Design** for various screen sizes

## 🎨 Design System

### Color Palette

The application uses a comprehensive color system with support for light and dark themes:

```css
/* Dark Theme (Default) */
--bg-primary: #1a1a1a;       /* Main background */
--bg-secondary: #2d2d2d;     /* Secondary surfaces */
--bg-tertiary: #404040;      /* Elevated surfaces */
--text-primary: #ffffff;     /* Primary text */
--text-secondary: #b3b3b3;   /* Secondary text */
--accent-primary: #0078d4;   /* Primary accent */
```

### Typography Scale

```css
--font-size-xs: 0.75rem;     /* 12px */
--font-size-sm: 0.875rem;    /* 14px */
--font-size-base: 1rem;      /* 16px */
--font-size-lg: 1.125rem;    /* 18px */
--font-size-xl: 1.25rem;     /* 20px */
--font-size-2xl: 1.5rem;     /* 24px */
--font-size-3xl: 1.875rem;   /* 30px */
```

### Spacing System

```css
--spacing-xs: 4px;
--spacing-sm: 8px;
--spacing-md: 16px;
--spacing-lg: 24px;
--spacing-xl: 32px;
--spacing-2xl: 48px;
```

## 🏗️ Layout Structure

### Main Layout Components

1. **MainLayout** - Root layout container
2. **Sidebar** - Navigation and chat history
3. **Content Area** - Main application content
4. **StatusBar** - System status and information

### Layout Hierarchy

```
MainLayout
├── Sidebar
│   ├── Header (Logo + Toggle)
│   ├── Navigation Items
│   ├── Chat History (conditional)
│   └── Quick Actions
├── Content Area
│   └── [Page Content]
└── StatusBar
    ├── Connection Status
    ├── System Information
    └── Application Info
```

## 🧩 Core Components

### MainLayout Component

The primary layout wrapper that handles:
- Sidebar positioning and transitions
- Content area management
- Windows Mica backdrop effects
- Responsive behavior

```tsx
<MainLayout
  currentPage="chat"
  sidebarCollapsed={false}
  connectionStatus={connectionStatus}
  onPageChange={handlePageChange}
  onSidebarToggle={handleSidebarToggle}
>
  {/* Page content */}
</MainLayout>
```

### Sidebar Component

Navigation sidebar with:
- Collapsible design
- Dynamic navigation items
- Chat history integration
- Quick action buttons

**Features:**
- Smooth collapse/expand animations
- Active state indicators
- Hover effects and interactions
- Responsive mobile behavior

### StatusBar Component

Bottom status bar displaying:
- Ollama connection status
- System performance metrics
- Application version information

**Status Indicators:**
- 🟢 Connected to Ollama
- 🔴 Disconnected/Error
- Real-time status updates

## 🎭 Theming System

### Theme Structure

The theming system uses CSS custom properties for easy theme switching:

```css
:root {
  /* Theme variables */
}

[data-theme="light"] {
  /* Light theme overrides */
}
```

### Available Themes

1. **Dark Theme** (Default)
   - Dark backgrounds with high contrast
   - Blue accent colors
   - Optimized for extended use

2. **Light Theme**
   - Light backgrounds with subtle contrast
   - Same accent colors for consistency
   - Better for bright environments

### Theme Implementation

```tsx
// Theme Provider usage
<ThemeProvider theme="dark">
  <App />
</ThemeProvider>

// Theme switching
const handleThemeChange = (theme: string) => {
  document.documentElement.setAttribute('data-theme', theme);
};
```

## ✨ Visual Effects

### Windows Mica Effect

The application implements Windows 11-style Mica effects:

```css
.mica-backdrop {
  background: 
    radial-gradient(...),  /* Multiple gradient layers */
    linear-gradient(...);
  backdrop-filter: blur(50px);
  -webkit-backdrop-filter: blur(50px);
}
```

### Glass Morphism

For elevated components:

```css
.glass {
  background: var(--bg-glass);
  backdrop-filter: blur(10px);
  border: 1px solid var(--border-primary);
}
```

### Animations

Built-in animation utilities:

```css
@keyframes fadeIn { /* ... */ }
@keyframes slideIn { /* ... */ }
@keyframes pulse { /* ... */ }
@keyframes spin { /* ... */ }
```

## 📱 Responsive Design

### Breakpoints

```css
/* Tablet */
@media (max-width: 768px) {
  --sidebar-width: 240px;
}

/* Mobile */
@media (max-width: 480px) {
  --sidebar-width: 200px;
  html { font-size: 14px; }
}
```

### Mobile Adaptations

- **Sidebar**: Off-canvas on mobile
- **Navigation**: Touch-optimized spacing
- **Typography**: Scaled font sizes
- **Spacing**: Reduced padding/margins

## 🎯 Accessibility

### Focus Management

```css
.focus-visible {
  outline: 2px solid var(--accent-primary);
  outline-offset: 2px;
}
```

### Screen Reader Support

```css
.sr-only {
  /* Screen reader only content */
  position: absolute;
  width: 1px;
  height: 1px;
  /* ... */
}
```

### Semantic HTML

- Proper heading hierarchy
- ARIA labels and roles
- Keyboard navigation support

## 🔧 Component API

### MainLayout Props

```typescript
interface MainLayoutProps {
  currentPage: AppPage;
  sidebarCollapsed: boolean;
  connectionStatus: OllamaConnectionStatus;
  onPageChange: (page: AppPage) => void;
  onSidebarToggle: () => void;
  children: React.ReactNode;
}
```

### Sidebar Props

```typescript
interface SidebarProps {
  currentPage: AppPage;
  collapsed: boolean;
  onPageChange: (page: AppPage) => void;
  onToggle: () => void;
}
```

### StatusBar Props

```typescript
interface StatusBarProps {
  connectionStatus: OllamaConnectionStatus;
}
```

## 🎨 Customization

### Adding New Themes

1. Define theme variables in CSS:
```css
[data-theme="custom"] {
  --bg-primary: #your-color;
  /* ... */
}
```

2. Update theme provider:
```tsx
const themes = ['dark', 'light', 'custom'];
```

### Custom Components

Follow the established patterns:

```tsx
// Component structure
interface ComponentProps {
  // Type definitions
}

export function Component(props: ComponentProps): JSX.Element {
  // Implementation
}
```

```css
/* Styling structure */
.component {
  /* Base styles */
}

.component.variant {
  /* Variant styles */
}

@media (max-width: 768px) {
  .component {
    /* Responsive styles */
  }
}
```

## 🚀 Performance Considerations

### CSS Optimization

- CSS custom properties for theming
- Minimal specificity conflicts
- Efficient selector usage
- Reduced redundancy

### Animation Performance

- GPU-accelerated transforms
- Will-change properties where needed
- Reduced motion for accessibility

### Bundle Size

- Component-level CSS imports
- Tree-shaking friendly structure
- Minimal dependencies

## 🔍 Development Guidelines

### File Organization

```
src/
├── components/
│   ├── layout/
│   │   ├── MainLayout.tsx
│   │   ├── MainLayout.css
│   │   ├── Sidebar.tsx
│   │   └── Sidebar.css
│   └── ui/
├── styles/
│   ├── global.css
│   └── themes/
└── types/
```

### Naming Conventions

- **Components**: PascalCase (`MainLayout`)
- **Files**: PascalCase for components, kebab-case for others
- **CSS Classes**: kebab-case (`.main-layout`)
- **CSS Variables**: kebab-case (`--bg-primary`)

### Code Standards

- TypeScript for all components
- Explicit return types
- Comprehensive prop interfaces
- Consistent spacing and formatting

---

*This documentation is updated as new UI components and features are added.*