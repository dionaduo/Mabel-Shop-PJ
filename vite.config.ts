import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())

  const cleanEnv = {
    VITE_APP_PORT: env.VITE_APP_PORT?.trim(),
    VITE_APP_BASE_API: env.VITE_APP_BASE_API?.trim(),
    VITE_APP_TITLE: env.VITE_APP_TITLE?.trim(),
    NODE_ENV: env.NODE_ENV?.trim(),
  }

  const port = cleanEnv.VITE_APP_PORT ? parseInt(cleanEnv.VITE_APP_PORT, 10) : 8080

  return defineConfig({
    plugins: [vue()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      port: port,
      proxy:{
        '/api': {
          target: 'http://hmapp.net:8080/',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
      host: true,
      open: true
    },
  })
})