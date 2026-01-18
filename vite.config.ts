import path from 'node:path'
import { fileURLToPath } from 'node:url'

import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

const DEFAULT_API_BASE_URL = 'http://35.237.12.130/api'
//const DEFAULT_API_BASE_URL = 'http://localhost:3000/api'

function normalizeBaseUrl(value: string): string {
  return value.replace(/\/+$/, '')
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiBaseUrl = normalizeBaseUrl(
    env.API_BASE_URL || env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL,
  )
  // `apiBaseUrl` includes `/api` and is used as the proxy target for endpoints below.

  return {
    plugins: [react()],
    /**
     * Vite exposes only `VITE_*` env vars by default.
     * This project also allows `API_*` to match the repo plan (`API_BASE_URL`).
     */
    envPrefix: ['VITE_', 'API_'],
    resolve: {
      alias: {
        app: path.resolve(path.dirname(fileURLToPath(import.meta.url)), './src/app'),
        pages: path.resolve(path.dirname(fileURLToPath(import.meta.url)), './src/pages'),
        widgets: path.resolve(path.dirname(fileURLToPath(import.meta.url)), './src/widgets'),
        features: path.resolve(path.dirname(fileURLToPath(import.meta.url)), './src/features'),
        entities: path.resolve(path.dirname(fileURLToPath(import.meta.url)), './src/entities'),
        shared: path.resolve(path.dirname(fileURLToPath(import.meta.url)), './src/shared'),
      },
    },
    server: {
      /**
       * Dev-only proxy to avoid CORS while working locally.
       * The client can fetch `/digests` from the Vite origin, and Vite forwards it to the API.
       */
      proxy: {
        '/digests': {
          target: apiBaseUrl,
          changeOrigin: true,
          secure: false,
        },
        '/news-items': {
          target: apiBaseUrl,
          changeOrigin: true,
          secure: false,
        },
        '/llm-config': {
          target: apiBaseUrl,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  }
})
