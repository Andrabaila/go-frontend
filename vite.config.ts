/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { configDefaults } from 'vitest/config';
import tailwindcss from '@tailwindcss/vite';
import fs from 'fs';
import { execSync } from 'child_process';

const getPackageVersion = () => {
  const packageJsonPath = path.resolve(__dirname, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8')) as {
    version?: string;
  };

  return packageJson.version ?? '0.0.0';
};

const getCommitSha = () => {
  if (process.env.VITE_APP_COMMIT) {
    return process.env.VITE_APP_COMMIT.slice(0, 7);
  }

  try {
    return execSync('git rev-parse --short HEAD', {
      cwd: __dirname,
      encoding: 'utf-8',
    }).trim();
  } catch {
    return 'unknown';
  }
};

export default defineConfig(({ command }) => {
  const keyPath = path.resolve(__dirname, 'certs/localhost+1-key.pem');
  const certPath = path.resolve(__dirname, 'certs/localhost+1.pem');
  const hasLocalCerts = fs.existsSync(keyPath) && fs.existsSync(certPath);
  const deployedAt =
    process.env.VITE_APP_DEPLOYED_AT ?? new Date().toISOString();
  const appVersion = process.env.VITE_APP_VERSION ?? getPackageVersion();
  const appCommit = getCommitSha();

  return {
    base: '/',
    define: {
      __APP_VERSION__: JSON.stringify(appVersion),
      __APP_DEPLOYED_AT__: JSON.stringify(deployedAt),
      __APP_COMMIT__: JSON.stringify(appCommit),
    },
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
