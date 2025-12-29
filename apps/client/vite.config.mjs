import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
    sourcemap: process.env.NODE_ENV === 'production' ? 'hidden' : true,
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
  },
  plugins: [react()],
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
  },
})
