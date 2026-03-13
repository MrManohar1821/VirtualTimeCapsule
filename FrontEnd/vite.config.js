import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const backendUrl = env.VITE_BACKEND_URL;

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      proxy: {
        '/api': {
          target: backendUrl,
          changeOrigin: true,
          secure: false,
          headers: {
            'ngrok-skip-browser-warning': 'true'
          }
        },
        '/uploads': {
          target: backendUrl,
          changeOrigin: true,
          secure: false,
          headers: {
            'ngrok-skip-browser-warning': 'true'
          }
        },
      }
    }
  };
})
