import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { readFileSync } from 'fs'
import { resolve } from 'path'

// Get version from package.json
const packageJson = JSON.parse(readFileSync(resolve(__dirname, 'package.json'), 'utf-8'))
const appVersion = packageJson.version

export default defineConfig({
  base: '/svelte-solitaire/',
  plugins: [svelte()],
  define: {
    'global.BUILD_VERSION': JSON.stringify(appVersion)
  },
  server: {
    port: 5173
  }
})
