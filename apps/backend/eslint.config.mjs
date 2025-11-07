// apps/backend/eslint.config.mjs
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default [
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: join(__dirname, "tsconfig.eslint.json"),
        tsconfigRootDir: __dirname,
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
    },
    rules: {
      "@typescript-eslint/no-unused-vars": ["warn"],
    },
  },
];
