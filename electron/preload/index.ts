import { contextBridge, ipcRenderer } from 'electron'

// Custom APIs for renderer
const electronAPI = {
  // Store operations
  store: {
    get: (key: string) => ipcRenderer.invoke('store-get', key),
    set: (key: string, value: any) => ipcRenderer.invoke('store-set', key, value),
  },

  // File system operations
  fileSystem: {
    showOpenDialog: (options: any) => ipcRenderer.invoke('show-open-dialog', options),
    showSaveDialog: (options: any) => ipcRenderer.invoke('show-save-dialog', options),
    saveFile: (targetDir: string, filename: string, data: ArrayBuffer) => 
      ipcRenderer.invoke('save-file', targetDir, filename, data),
    getDefaultModelPath: () => ipcRenderer.invoke('get-default-model-path'),
  },

  // Window operations
  window: {
    minimize: () => ipcRenderer.invoke('window-minimize'),
    maximize: () => ipcRenderer.invoke('window-maximize'),
    close: () => ipcRenderer.invoke('window-close'),
  },

  // App info
  app: {
    getVersion: () => ipcRenderer.invoke('get-app-version'),
    getPlatform: () => ipcRenderer.invoke('get-platform'),
  },

  // Ollama operations
  ollama: {
    start: () => ipcRenderer.invoke('ollama-start'),
    stop: () => ipcRenderer.invoke('ollama-stop'),
    restart: (modelPath?: string) => ipcRenderer.invoke('ollama-restart', modelPath),
  },

}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electronAPI', electronAPI)
    console.log('✅ Preload: electronAPI exposed successfully via contextBridge')
    
    // Verify the exposure worked
    setTimeout(() => {
      contextBridge.exposeInMainWorld('__electronAPITest', { test: 'working' })
      console.log('✅ Preload: Test API exposed')
    }, 100)
  } catch (error) {
    console.error('❌ Preload: Failed to expose electronAPI:', error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electronAPI = electronAPI
  console.log('✅ Preload: electronAPI exposed directly to window')
}

// Debug: Log API structure
console.log('🔍 Preload: electronAPI structure:', {
  store: !!electronAPI.store,
  fileSystem: !!electronAPI.fileSystem,
  window: !!electronAPI.window,
  app: !!electronAPI.app,
  windowMethods: electronAPI.window ? Object.keys(electronAPI.window) : 'No window methods',
  contextIsolated: process.contextIsolated
})

// Additional debug: Test if IPC is working at all
console.log('🔍 Preload: Testing ipcRenderer availability:', !!ipcRenderer)

// Type definitions for the exposed API
export type ElectronAPI = typeof electronAPI