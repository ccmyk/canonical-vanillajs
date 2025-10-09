import { defineConfig } from 'vite';
import path from 'node:path';
import { prettierFormat } from 'vite-plugin-prettier-format';

export default defineConfig({
  root: '.',
  server: { port: 3000, open: true },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: { main: './index.html' },
    },
  },
  optimizeDeps: {
    include: ['gsap', 'split-type', 'lenis', 'ogl'],
  },
  assetsInclude: ['**/*.glsl', '**/*.vert', '**/*.frag'],
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') },
  },
  plugins: [
    prettierFormat(),
    {
      name: 'glsl-loader',
      transform(code, id) {
        if (id.endsWith('.glsl') || id.endsWith('.vert') || id.endsWith('.frag')) {
          const cleanId = id.split('?')[0];
          console.log(`Loading GLSL: ${cleanId}`);
          return {
            code: `export default ${JSON.stringify(code)};`,
            map: null,
          };
        }
      },
    },
  ],
});