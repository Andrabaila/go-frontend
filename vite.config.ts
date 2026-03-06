/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { configDefaults } from 'vitest/config';
import tailwindcss from '@tailwindcss/vite';
import fs from 'fs';

export default defineConfig(({ command }) => {
  const keyPath = path.resolve(__dirname, 'certs/localhost+1-key.pem');
  const certPath = path.resolve(__dirname, 'certs/localhost+1.pem');
  const hasLocalCerts = fs.existsSync(keyPath) && fs.existsSync(certPath);

  return {
    base: '/',
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      host: '0.0.0.0',
      ...(command === 'serve' && hasLocalCerts
        ? {
            https: {
              key: fs.readFileSync(keyPath),
              cert: fs.readFileSync(certPath),
            },
          }
        : {}),
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
  };
});
