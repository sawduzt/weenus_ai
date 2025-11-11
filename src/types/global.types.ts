// Global type definitions for the Weenus AI application

// Electron API types
export interface ElectronAPI {
  store: {
    get: (key: string) => Promise<any>
    set: (key: string, value: any) => Promise<boolean>
  }
  fileSystem: {
    showOpenDialog: (options: any) => Promise<any>
    showSaveDialog: (options: any) => Promise<any>
    saveFile: (targetDir: string, filename: string, data: ArrayBuffer) => Promise<string>
    getDefaultModelPath: () => Promise<string>
  }
  window: {
    minimize: () => Promise<void>
    maximize: () => Promise<void>
    close: () => Promise<void>
  }
  app: {
    getVersion: () => Promise<string>
    getPlatform: () => Promise<string>
  }
  ollama: {
    start: () => Promise<{ success: boolean; error?: string; details?: string; path?: string; pid?: number; paths?: string[] }>;
    stop: () => Promise<{ success: boolean; error?: string }>;
    restart: (modelPath?: string) => Promise<{ success: boolean; error?: string; details?: string; path?: string; pid?: number }>;
  }
}

// Global window interface extension
declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}

// Connection status (generic, not tied to specific backend)
export interface ConnectionStatus {
  connected: boolean
  lastChecked: Date
  error?: string
  url: string
}

// Chat system types
export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  metadata?: {
    model?: string
    tokens?: number
    duration?: number
    attachments?: FileAttachment[]
  }
}

export interface ChatSession {
  id: string
  title: string
  messages: ChatMessage[]
  createdAt: Date
  updatedAt: Date
  model: string
  settings: ModelSettings
}

export interface FileAttachment {
  id: string
  name: string
  type: string
  size: number
  path: string
  content?: string | ArrayBuffer
}

// Model management types
export interface ModelSettings {
  temperature: number
  top_p: number
  top_k: number
  repeat_penalty: number
  seed?: number
  num_predict?: number
  stop?: string[]
}

export interface AIModel {
  id: string
  name: string
  displayName: string
  description: string
  size: number
  type: 'chat' | 'image' | 'video' | 'embedding'
  capabilities: ModelCapability[]
  parameters: ModelParameter[]
  isDownloaded: boolean
  downloadProgress?: number
  settings: ModelSettings
}

export interface ModelCapability {
  name: string
  description: string
  enabled: boolean
}

export interface ModelParameter {
  name: string
  type: 'number' | 'string' | 'boolean' | 'array'
  value: any
  min?: number
  max?: number
  step?: number
  options?: string[]
  description: string
}

// Application state types
export interface AppSettings {
  theme: 'light' | 'dark' | 'system'
  modelPath: string
  autoSave: boolean
  notifications: boolean
  performance: PerformanceSettings
  ui: UISettings
}

export interface PerformanceSettings {
  maxConcurrentRequests: number
  requestTimeout: number
  enableGpuAcceleration: boolean
  memoryLimit: number
}

export interface UISettings {
  fontSize: 'small' | 'medium' | 'large'
  compactMode: boolean
  showTimestamps: boolean
  enableAnimations: boolean
  accentColor: string
}

// Statistics and monitoring types
export interface AIStatistics {
  gpuUsage: number
  vramUsage: number
  tokensPerSecond: number
  timeToFirstToken: number
  totalTokens: number
  requestCount: number
  errorCount: number
  uptime: number
}

export interface PerformanceMetrics {
  timestamp: Date
  cpuUsage: number
  memoryUsage: number
  gpuUsage: number
  vramUsage: number
  tokensPerSecond: number
  activeRequests: number
}

// Media generation types
export interface ImageGenerationRequest {
  prompt: string
  model: string
  width: number
  height: number
  steps: number
  guidance: number
  seed?: number
  negativePrompt?: string
}

export interface ImageGenerationResult {
  id: string
  imageUrl: string
  prompt: string
  model: string
  parameters: ImageGenerationRequest
  createdAt: Date
  metadata: {
    seed: number
    duration: number
    steps: number
  }
}

export interface VideoGenerationRequest {
  prompt: string
  model: string
  duration: number
  fps: number
  width: number
  height: number
  seed?: number
  frames?: number
}

export interface VideoGenerationResult {
  id: string
  videoUrl: string
  thumbnailUrl?: string
  prompt: string
  model: string
  parameters: VideoGenerationRequest
  createdAt: Date
  progress: number
  status: 'pending' | 'processing' | 'completed' | 'failed'
}

// Widget system types
export interface Widget {
  id: string
  name: string
  component: string
  enabled: boolean
  position: WidgetPosition
  settings: Record<string, any>
}

export interface WidgetPosition {
  x: number
  y: number
  width: number
  height: number
  zIndex: number
}

// Theme system types
export interface Theme {
  id: string
  name: string
  description: string
  author: string
  version: string
  colors: ThemeColors
  fonts: ThemeFonts
  effects: ThemeEffects
}

export interface ThemeColors {
  primary: string
  secondary: string
  accent: string
  background: string
  surface: string
  text: string
  textSecondary: string
  border: string
  error: string
  warning: string
  success: string
  info: string
}

export interface ThemeFonts {
  primary: string
  mono: string
  sizes: {
    xs: string
    sm: string
    base: string
    lg: string
    xl: string
    '2xl': string
  }
}

export interface ThemeEffects {
  borderRadius: string
  shadows: boolean
  animations: boolean
  blur: boolean
  transparency: number
}

// Error types
export interface AppError {
  code: string
  message: string
  details?: any
  timestamp: Date
  stack?: string
}

// Utility types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

export type AsyncState<T> = {
  data: T | null
  loading: boolean
  error: AppError | null
}

export type EventCallback<T = any> = (data: T) => void

export type Subscription = {
  unsubscribe: () => void
}