import tseslint from 'typescript-eslint';
import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import prettierPlugin from 'eslint-plugin-prettier';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const backendRoot = path.join(__dirname, 'apps/backend');
const frontendRoot = path.join(__dirname, 'apps/frontend');
const sharedRoot = path.join(__dirname, 'packages/shared');

export default [
  {
    ignores: ['**/dist', '**/node_modules', '**/coverage', '**/*.d.ts'],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      'prettier/prettier': 'error',
    },
  },

  {
    files: ['apps/backend/**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        project: [path.join(backendRoot, 'tsconfig.json')],
        tsconfigRootDir: backendRoot,
      },
    },
    rules: {
      'no-restricted-imports': ['error', { patterns: ['@/types/*'] }],
    },
  },

  {
    files: ['apps/frontend/**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      parserOptions: {
        project: [path.join(frontendRoot, 'tsconfig.json')],
        tsconfigRootDir: frontendRoot,
      },
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      prettier: prettierPlugin,
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'no-restricted-imports': ['error', { patterns: ['@/types/*'] }],
      'prettier/prettier': 'error',
    },
  },

  {
    files: ['packages/shared/**/*.ts'],
    languageOptions: {
      parserOptions: {
        project: [path.join(sharedRoot, 'tsconfig.json')],
        tsconfigRootDir: sharedRoot,
      },
    },
    rules: {
      'prettier/prettier': 'error',
    },
  },
];
