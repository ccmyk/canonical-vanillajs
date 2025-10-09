// eslint.config.js
import { defineConfig } from "eslint/config";
import js from "@eslint/js";
import pluginPrettier from "eslint-plugin-prettier";

export default defineConfig([
  globalIgnores(["reference-original/"]),
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
    plugins: {
      prettier: pluginPrettier,
    },
    extends: [
      js.configs.recommended,
      "plugin:prettier/recommended"
    ],
    rules: {
      "no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
      "prettier/prettier": "error"
    }
  }
]);