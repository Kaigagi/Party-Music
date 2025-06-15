// eslint.config.mjs
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Convert legacy config to flat-compatible
const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  // Load Next.js legacy config
  ...compat.extends("next/core-web-vitals", "next"),

  // Add support for TypeScript in flat config
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: __dirname,
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      // Add TypeScript-specific rules here if needed
    },
  },
];
