import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import svgr from 'vite-plugin-svgr';
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), svgr()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  assetsInclude: ['**/*.svg'], // SVG 파일을 에셋으로 처리
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    cors: true,
    watch: {
      usePolling: true,
    },
    allowedHosts: [
      'q-generator.com',
      'localhost',
      'frontend',
      'frontend_green',
      'frontend_blue',
    ],
  },
  define: {
    global: 'window',
  },
});
