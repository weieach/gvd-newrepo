import { fileURLToPath } from "node:url";
import path from "node:path";
// Ensure any additional imports are necessary and correctly referenced

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: ["eslint:recommended", "plugin:vue/vue3-essential"],
  ignorePatterns: ["**/node_modules/", "**/dist/", "static/lodash.min.js"],
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: "module"
  },
  rules: {
    "no-extra-semi": "error",
    "no-unused-vars": "error",
    "no-undef": "error",
    "vue/multi-word-component-names": "off"
  }
};
