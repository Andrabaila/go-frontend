// vite.config.ts
/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { configDefaults } from 'vitest/config';
import tailwindcss from '@tailwindcss/vite';
import fs from 'fs';

export default defineConfig({
  base: '/go/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: '0.0.0.0',
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'localhost+1-key.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, 'localhost+1.pem')),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    exclude: [...configDefaults.exclude, 'e2e/*'],
    coverage: {
      reporter: ['text', 'lcov'],
      exclude: [
        'src/types/**',
        'src/constants/**',
        'dist/**',
        'src/vite-env.d.ts',
        'eslint.config.js',
        'vite.config.ts',
      ],
    },
  },
});
