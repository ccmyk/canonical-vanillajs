import { defineConfig } from 'vite'

export default defineConfig({
  root: '.',
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: './index.html'
      }
    }
  },
  optimizeDeps: {
    include: ['gsap', 'split-type', 'lenis', 'ogl']
  },
  assetsInclude: ['**/*.glsl'],
  plugins: [
    {
      name: 'glsl-loader',
      transform(code, id) {
        if (id.endsWith('.glsl')) {
          return `export default ${JSON.stringify(code)};`
        }
      }
    }
  ]
})