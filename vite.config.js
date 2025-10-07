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
  assetsInclude: ['**/*.glsl', '**/*.vert', '**/*.frag'],
  plugins: [
    {
      name: 'glsl-loader',
      transform(code, id) {
        if (id.endsWith('.glsl') || id.endsWith('.vert') || id.endsWith('.frag')) {
          // Remove any query parameters from the id for cleaner logs
          const cleanId = id.split('?')[0];
          console.log(`Loading GLSL: ${cleanId}`);
          
          // Return the shader code as a string export
          return {
            code: `export default ${JSON.stringify(code)};`,
            map: null
          }
        }
      }
    }
  ]
})