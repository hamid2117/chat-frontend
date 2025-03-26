import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['ms', 'extend'],
  },
  resolve: {
    alias: {
      ms: fileURLToPath(new URL('./node_modules/ms/index.js', import.meta.url)),
      extend: fileURLToPath(
        new URL('./node_modules/extend/index.js', import.meta.url)
      ),
    },
    extensions: ['.tsx', '.ts'],
  },
})
