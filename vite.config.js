// vite.config.js
import { defineConfig } from 'vite';
import glsl from 'vite-plugin-glsl';
import { prettierFormat } from 'vite-plugin-prettier-format';

export default defineConfig({
  root: '.',
  server: {
    port: 3000,
    host: true,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false, // Disable source maps in production
    rollupOptions: {
      input: { main: './index.html' },
    },
  },
  optimizeDeps: {
    include: ['gsap', 'split-type', 'lenis', 'ogl'],
  },
  resolve: {
    alias: {
      '@': new URL('./src', import.meta.url).pathname,
    },
  },
  assetsInclude: ['**/*.glsl'],
  // Disable CSS source maps to prevent duplicate file listings
  css: {
    devSourcemap: false,
  },
  plugins: [
    glsl({
      include: /\.(glsl|vs|fs)$/i,
      warnDuplicatedImports: false,
      compress: false,
    }),
    prettierFormat(),
  ],
});