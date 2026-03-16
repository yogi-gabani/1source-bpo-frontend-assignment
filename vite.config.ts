import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    watch: {
      // Ignore json-server's db file so PATCH updates don't trigger a full reload
      ignored: ['**/db.json'],
    },
  },
})
