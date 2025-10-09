// vite.config.ts
/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { configDefaults } from 'vitest/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  base: '/go/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
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
