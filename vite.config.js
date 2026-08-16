import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // plotly.js/lib/core references the Node `global` global, which the browser
  // doesn't define — alias it to globalThis so the custom Plotly bundle loads.
  define: {
    global: 'globalThis',
  },
})
