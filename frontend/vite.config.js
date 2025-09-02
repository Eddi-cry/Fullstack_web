import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path';
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/igs-api': {
        target: 'https://files.igs.org',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/igs-api/, ''),
        secure: false,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@components': path.resolve(__dirname, './src/components'),
      '@constants': path.resolve(__dirname, './src/constants'),
      '@modules': path.resolve(__dirname, './src/modules'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@services': path.resolve(__dirname, './src/services'),
      '@styles': path.resolve(__dirname, './src/styles'),
    },
  },
})
