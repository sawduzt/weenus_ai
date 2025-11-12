# UI Framework Documentation

This document provides comprehensive documentation for the Weenus AI user interface framework, including components, styling system, and theming.

## 📋 Overview

The Weenus AI UI framework is built with:

- **React** for component-based architecture
- **TypeScript** for type safety and developer experience  
- **Lucide React** for professional vector icons
- **CSS Custom Properties** for theming and design consistency
- **Windows Mica Effects** for modern aesthetics and transparency
- **Responsive Design** for various screen sizes and states
- **Custom Window Controls** for native desktop experience
- **Pink Theme System** with rounded corners and cute aesthetics

## 🎨 Design System

### Color Palette

The application uses a comprehensive color system with cute pink accents and support for light and dark themes:

```css
/* Cute Dark Theme (Default) */
--bg-primary: #1f1520;         /* Main background */
--bg-secondary: #2a1f2d;       /* Secondary surfaces */
--bg-tertiary: #3d2a42;        /* Elevated surfaces */
--text-primary: #f8e8f3;       /* Primary text */
--text-secondary: #d4a5c7;     /* Secondary text */
--accent-primary: #ff6b9d;     /* Pink accent */
--accent-secondary: #e55a87;   /* Secondary pink */
--accent-hover: #ff85b3;       /* Hover pink */
```

### Typography Scale

```css
/* Cute Font System */
--font-family-sans: 'Nunito', 'Comic Neue', 'Quicksand', 'Segoe UI', sans-serif;
--font-family-mono: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;

--font-size-xs: 0.75rem;     /* 12px */
--font-size-sm: 0.875rem;    /* 14px */
--font-size-base: 1rem;      /* 16px */
--font-size-lg: 1.125rem;    /* 18px */
--font-size-xl: 1.25rem;     /* 20px */
--font-size-2xl: 1.5rem;     /* 24px */
--font-size-3xl: 1.875rem;   /* 30px */
```

### Border Radius System

```css
/* Subtle Rounded Design Language */
--radius-sm: 6px;    /* Small elements */
--radius-md: 12px;   /* Medium elements */
--radius-lg: 16px;   /* Large elements */
--radius-xl: 20px;   /* Extra large elements */
```

**Design Philosophy**: Subtle curves for professional appearance while maintaining a friendly, approachable aesthetic.

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
├── WindowControls (Custom minimize/maximize/close)
├── Sidebar
│   ├── Header (Logo + Toggle) - Draggable
│   ├── Navigation Items (Vector Icons)
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
- Window controls integration
- Sidebar positioning and transitions
- Content area management
- Windows Mica backdrop effects
- Responsive behavior
- Draggable title bar functionality

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

### WindowControls Component

Custom window controls for frameless desktop experience:

**Features:**
- Custom minimize, maximize, close buttons
- Native Windows-style hover effects with color coding
- Electron IPC communication integration
- Hover state animations with color-coded feedback
- Platform-specific styling consistent with OS design
- Accessible keyboard navigation with proper focus management
- Non-draggable region handling to prevent conflicts

### Sidebar Component

Navigation sidebar with professional vector icons:

**Features:**
- Collapsible design with 80px collapsed width
- Dynamic navigation items with pink accent indicators
- Clickable logo when collapsed for expansion
- Smooth collapse/expand animations
- Active state indicators with pink accent glows
- Hover effects and micro-interactions
- Responsive mobile behavior with off-canvas design
- Professional vector icons:
  - `MessageCircle` - Chat interface
  - `Image` - Image generation
  - `Video` - Video generation  
  - `Bot` - Model library management
  - `Settings` - Application configuration
  - `Rabbit` - App logo (interactive)

### StatusBar Component

Bottom status bar with styling and curve design:

**Features:**
- Ollama connection status with real-time updates
- System performance metrics display
- Rounded top corners
- Application version information and build details

**Status Indicators:**
- 🟢 Connected to Ollama (with performance metrics)
- 🔴 Disconnected/Error (with error details)
- Real-time status updates and connection monitoring
- System information display (GPU, memory, etc.)

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

1. **Cute Dark Theme** (Default)
   - Purple-tinted dark backgrounds
   - Pink accent colors (#ff6b9d)
   - Optimized for extended use
   - Rounded corners and soft shadows

2. **Cute Light Theme**
   - Cream and pink backgrounds
   - Same pink accents for consistency
   - Better for bright environments
   - Maintains rounded design language

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

The application implements enhanced Windows 11-style Mica effects with pink gradients:

```css
.mica-backdrop {
  background: 
    radial-gradient(circle at 20% 20%, rgba(255, 107, 157, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(244, 114, 182, 0.12) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(168, 85, 247, 0.08) 0%, transparent 50%),
    radial-gradient(circle at 60% 20%, rgba(236, 72, 153, 0.1) 0%, transparent 50%);
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
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

### Icon System

The application uses Lucide React for professional vector icons:

```tsx
import { MessageCircle, Settings, Bot } from 'lucide-react';

// Usage in components
<MessageCircle size={20} className="nav-icon" />
<Settings size={16} />
```

**Available Icons:**
- `MessageCircle` - Chat functionality
- `Image` - Image generation
- `Video` - Video generation  
- `Bot` - Model library
- `Settings` - Application settings
- `Plus` - New chat/add actions
- `ChevronLeft/Right` - Navigation
- `Rabbit` - App logo
- `Minus/Square/X` - Window controls

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

*This UI Framework documentation is maintained as the design system evolves.*