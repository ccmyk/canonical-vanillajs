// eslint.config.js
import { defineConfig } from 'eslint/config';
import js from '@eslint/js';
import pluginPrettier from 'eslint-plugin-prettier';
import globals from 'globals';
import path from 'node:path';

export default defineConfig([
  {
    ignores: ['dist/', 'build/', 'reference-original/', 'scripts/', 'node_modules/', '.vite/'],
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
    },
    plugins: {
      prettier: pluginPrettier,
    },
    settings: {
      'import/resolver': {
        alias: {
          map: [['@', path.resolve('src')]],
          extensions: ['.js'],
        },
      },
    },
    extends: [js.configs.recommended, 'plugin:prettier/recommended'],
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'prettier/prettier': 'error',
    },
  },
]);
