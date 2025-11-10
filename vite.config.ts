import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Path resolution for clean imports
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/pages': path.resolve(__dirname, './src/pages'),
      '@/services': path.resolve(__dirname, './src/services'),
      '@/store': path.resolve(__dirname, './src/store'),
      '@/utils': path.resolve(__dirname, './src/utils'),
      '@/types': path.resolve(__dirname, './src/types'),
      '@/assets': path.resolve(__dirname, './src/assets'),
    },
  },
  
  // Development server configuration
  server: {
    host: 'localhost',
    port: 5173,
    open: false, // Don't open browser since we're using Electron
    cors: true,
  },
  
  // Build configuration
  build: {
    outDir: 'build/renderer',
    emptyOutDir: true,
    rollupOptions: {
      // Optimize bundle splitting
      output: {
        format: 'es', // Ensure ES modules
        manualChunks: {
          vendor: ['react', 'react-dom'],
          redux: ['@reduxjs/toolkit', 'react-redux'],
          router: ['react-router-dom'],
          ui: ['framer-motion', 'lucide-react'],
        },
      },
    },
    // Generate source maps for debugging
    sourcemap: true,
    // Target for Electron compatibility
    target: 'es2020',
    // Ensure proper minification for Electron
    minify: 'esbuild',
  },
  
  // CSS configuration
  css: {
    postcss: './postcss.config.js',
    devSourcemap: true,
  },
  
  // Environment variables
  define: {
    // Make sure we can access process.env in the renderer
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
  },
  
  // Electron-specific configuration
  base: process.env.NODE_ENV === 'production' ? './' : '/', // Relative paths for Electron production
  
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@reduxjs/toolkit',
      'react-redux',
      'framer-motion',
      'react-markdown',
    ],
  },
})