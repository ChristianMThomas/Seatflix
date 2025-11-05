import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(),],
  server: {
    host: "0.0.0.0",
    port: 5173,
  },
  build: {
    outDir: 'dist',
    // Generate sourcemaps for debugging production issues
    sourcemap: false,
  },
  // Ensure SPA routing works with history mode
  preview: {
    port: 4173,
    strictPort: true,
  },
})



