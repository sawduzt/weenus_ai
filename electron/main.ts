import { app, BrowserWindow, ipcMain, shell, dialog } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import Store from 'electron-store'
import { spawn, exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

// Initialize electron store for persistent settings
const store = new Store({
  defaults: {
    windowBounds: { width: 1200, height: 800 },
    theme: 'system',
    modelPath: '',
    lastChatId: null,
  }
})

class WeenusAI {
  private mainWindow: BrowserWindow | null = null

  constructor() {
    this.initialize()
  }

  private async initialize(): Promise<void> {
    // Disable hardware acceleration to fix GPU issues
    app.disableHardwareAcceleration();
    
    // This method will be called when Electron has finished initialization
    app.whenReady().then(() => {
      // Set app user model id for windows
      electronApp.setAppUserModelId('com.weenus.ai')

      // Default open or close DevTools by F12 in development
      // and ignore CommandOrControl + R in production.
      app.on('browser-window-created', (_, window) => {
        optimizer.watchWindowShortcuts(window)
      })

      this.createWindow()

      app.on('activate', () => {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) {
          this.createWindow()
        }
      })
    })

    // Quit when all windows are closed, except on macOS
    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit()
      }
    })

    // Security: Prevent navigation to external URLs
    app.on('web-contents-created', (_, contents) => {
      contents.on('will-navigate', (event, navigationUrl) => {
        const parsedUrl = new URL(navigationUrl)

        if (parsedUrl.origin !== 'http://localhost:5173' && parsedUrl.origin !== 'file://') {
          event.preventDefault()
        }
      })
    })

    this.setupIpcHandlers()
  }

  private createWindow(): void {
    const savedBounds = store.get('windowBounds') as { width: number; height: number }

    // Create the browser window
    this.mainWindow = new BrowserWindow({
      width: savedBounds.width,
      height: savedBounds.height,
      minWidth: 800,
      minHeight: 600,
      show: false,
      autoHideMenuBar: true,
      frame: false, // Remove default window frame entirely
      webPreferences: {
        preload: join(__dirname, './preload/index.js'),
        sandbox: false,
        contextIsolation: true,
        nodeIntegration: false,
        webSecurity: false,
        allowRunningInsecureContent: true,
        experimentalFeatures: true,
      },
      backgroundColor: '#1f1520',
    })

    this.mainWindow.on('ready-to-show', () => {
      this.mainWindow?.show()
      
      // Clear cache in development mode
      if (is.dev) {
        this.mainWindow?.webContents.session.clearCache()
      }
      
      // Temporarily open DevTools in production for debugging
      if (!is.dev || process.env.NODE_ENV === 'production') {
        this.mainWindow?.webContents.openDevTools()
      }
    })

    this.mainWindow.webContents.setWindowOpenHandler((details) => {
      shell.openExternal(details.url)
      return { action: 'deny' }
    })

    // Save window bounds when closing
    this.mainWindow.on('close', () => {
      if (this.mainWindow) {
        store.set('windowBounds', this.mainWindow.getBounds())
      }
    })

    // Load the appropriate URL based on environment
    if (is.dev && process.env.NODE_ENV !== 'production') {
      // Development mode - try to connect to Vite dev server
      const tryUrls = ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175']
      
      const loadDevUrl = async () => {
        for (const url of tryUrls) {
          try {
            console.log('Development: Attempting to load from:', url)
            const response = await fetch(url, { method: 'HEAD' })
            if (response.ok) {
              console.log('Development: Successfully connected to:', url)
              await this.mainWindow!.loadURL(url)
              return true
            }
          } catch (err) {
            console.warn(`Development: ${url} not available:`, err)
          }
        }
        
        console.log('Development: No dev server found, loading built files')
        this.mainWindow!.loadFile(join(__dirname, '../renderer/index.html'))
        return false
      }
      
      // Add a small delay to ensure Vite server is ready
      setTimeout(loadDevUrl, 1000)
    } else {
      // Production mode - load built files
      const htmlPath = join(__dirname, '../renderer/index.html')
      console.log('Production: Loading built file from:', htmlPath)
      
      // Make sure to set the correct working directory
      process.chdir(join(__dirname, '../renderer'))
      this.mainWindow.loadFile('index.html')
    }
  }

  private setupIpcHandlers(): void {
    // Store operations
    ipcMain.handle('store-get', (_, key: string) => {
      return store.get(key)
    })

    ipcMain.handle('store-set', (_, key: string, value: any) => {
      store.set(key, value)
      return true
    })

    // File system operations
    ipcMain.handle('show-open-dialog', async (_, options) => {
      const result = await dialog.showOpenDialog(this.mainWindow!, options)
      return result
    })

    ipcMain.handle('show-save-dialog', async (_, options) => {
      const result = await dialog.showSaveDialog(this.mainWindow!, options)
      return result
    })

    // Window operations
    ipcMain.handle('window-minimize', () => {
      this.mainWindow?.minimize()
    })

    ipcMain.handle('window-maximize', () => {
      if (this.mainWindow?.isMaximized()) {
        this.mainWindow.unmaximize()
      } else {
        this.mainWindow?.maximize()
      }
    })

    ipcMain.handle('window-close', () => {
      this.mainWindow?.close()
    })

    // App info
    ipcMain.handle('get-app-version', () => {
      return app.getVersion()
    })

    ipcMain.handle('get-platform', () => {
      return process.platform
    })

    // Ollama operations
    ipcMain.handle('ollama-start', async () => {
      try {
        console.log('Attempting to start Ollama service...')
        
        // Get user's local app data path
        const localAppData = process.env.LOCALAPPDATA || process.env.APPDATA || '';
        
        // Try common Windows paths for Ollama
        const possiblePaths = [
          'ollama', // Try PATH first
          join(localAppData, 'Programs', 'Ollama', 'ollama.exe'),
          'C:\\Program Files\\Ollama\\ollama.exe',
          'C:\\Users\\' + (process.env.USERNAME || '') + '\\AppData\\Local\\Programs\\Ollama\\ollama.exe',
        ]

        let lastError: any = null

        for (const ollamaPath of possiblePaths) {
          try {
            console.log(`Trying to start Ollama from: ${ollamaPath}`)
            
            const ollamaProcess = spawn(ollamaPath, ['serve'], {
              detached: true,
              stdio: 'ignore',
              shell: false,
              windowsHide: true,
            })

            // Wait to see if process starts
            await new Promise(resolve => setTimeout(resolve, 500))

            // Check if process is still running
            if (ollamaProcess.pid) {
              ollamaProcess.unref()
              console.log(`✅ Ollama service started successfully (PID: ${ollamaProcess.pid}) from path: ${ollamaPath}`)
              return { success: true, path: ollamaPath, pid: ollamaProcess.pid }
            }
          } catch (error: any) {
            console.log(`Failed with path ${ollamaPath}:`, error.message)
            lastError = error
            continue
          }
        }

        // If we get here, all paths failed
        console.error('❌ Could not start Ollama from any known path')
        return {
          success: false,
          error: 'Could not find Ollama executable',
          details: lastError ? lastError.message : 'Ollama not found in common installation paths',
          paths: possiblePaths
        }
      } catch (error: any) {
        console.error('❌ Failed to start Ollama:', error)
        return {
          success: false,
          error: 'Unexpected error starting Ollama',
          details: error.message
        }
      }
    })

    // Stop Ollama
    ipcMain.handle('ollama-stop', async () => {
      try {
        console.log('Killing Ollama service...')
        
        if (process.platform === 'win32') {
          // Windows: Force kill all ollama processes
          await execAsync('taskkill /F /IM ollama.exe /T')
          console.log('✅ Ollama service killed')
        } else {
          // Unix-like: Force kill all ollama processes
          await execAsync('pkill -9 ollama')
          console.log('✅ Ollama service killed')
        }
        return { success: true }
      } catch (error: any) {
        // Process not found is fine
        if (error.message.includes('not found') || error.message.includes('No tasks')) {
          console.log('ℹ️ Ollama was not running')
          return { success: true }
        }
        console.log('⚠️ Ollama kill returned error (probably wasn\'t running):', error.message)
        return { success: true } // Return success anyway
      }
    })

    // Restart Ollama with environment variable for model path
    ipcMain.handle('ollama-restart', async (_, modelPath?: string) => {
      try {
        console.log('Restarting Ollama service...')
        
        // First, kill Ollama
        try {
          if (process.platform === 'win32') {
            await execAsync('taskkill /F /IM ollama.exe /T')
          } else {
            await execAsync('pkill -9 ollama')
          }
          console.log('Killed existing Ollama processes')
        } catch (error) {
          console.log('No Ollama processes to kill (or already dead)')
        }

        // Wait a bit for process to fully die
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Now start Ollama again
        const localAppData = process.env.LOCALAPPDATA || process.env.APPDATA || '';
        
        const possiblePaths = [
          'ollama',
          join(localAppData, 'Programs', 'Ollama', 'ollama.exe'),
          'C:\\Program Files\\Ollama\\ollama.exe',
          'C:\\Users\\' + (process.env.USERNAME || '') + '\\AppData\\Local\\Programs\\Ollama\\ollama.exe',
        ]

        let lastError: any = null

        for (const ollamaPath of possiblePaths) {
          try {
            console.log(`Trying to restart Ollama from: ${ollamaPath}`)
            
            // Prepare environment variables
            const env = { ...process.env }
            if (modelPath) {
              env.OLLAMA_MODELS = modelPath
              console.log(`Setting OLLAMA_MODELS to: ${modelPath}`)
            }
            
            const ollamaProcess = spawn(ollamaPath, ['serve'], {
              detached: true,
              stdio: 'ignore',
              shell: false,
              windowsHide: true,
              env: env,
            })

            await new Promise(resolve => setTimeout(resolve, 500))

            if (ollamaProcess.pid) {
              ollamaProcess.unref()
              console.log(`✅ Ollama service restarted successfully (PID: ${ollamaProcess.pid})`)
              return { success: true, path: ollamaPath, pid: ollamaProcess.pid }
            }
          } catch (error: any) {
            console.log(`Failed with path ${ollamaPath}:`, error.message)
            lastError = error
            continue
          }
        }

        return {
          success: false,
          error: 'Could not restart Ollama',
          details: lastError ? lastError.message : 'Ollama not found'
        }
      } catch (error: any) {
        console.error('❌ Failed to restart Ollama:', error)
        return { success: false, error: error.message }
      }
    })

  }
}

// Initialize the application
new WeenusAI()
