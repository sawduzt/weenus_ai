import { app, BrowserWindow, ipcMain, shell, dialog } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import Store from 'electron-store'

// Initialize electron store for persistent settings
const store = new Store({
  defaults: {
    windowBounds: { width: 1200, height: 800 },
    theme: 'system',
    ollamaApiUrl: 'http://localhost:11434',
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
      titleBarStyle: 'hidden',
      titleBarOverlay: {
        color: '#1a1a1a',
        symbolColor: '#e4e4e7'
      },
      webPreferences: {
        preload: join(__dirname, '../preload/index.js'),
        sandbox: false,
        contextIsolation: true,
        enableRemoteModule: false,
        nodeIntegration: false,
      },
      // Windows-specific styling for Mica effect
      ...(process.platform === 'win32' && {
        backgroundColor: '#00000000',
        vibrancy: 'under-window',
      }),
    })

    this.mainWindow.on('ready-to-show', () => {
      this.mainWindow?.show()
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
    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
      this.mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
    } else {
      this.mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
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
  }
}

// Initialize the application
new WeenusAI()