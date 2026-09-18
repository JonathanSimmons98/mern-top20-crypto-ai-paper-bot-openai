import globals from 'globals';
import js from '@eslint/js';
export default [
  { files: ['**/*.{js,jsx}'], ignores: ['node_modules/**','client/dist/**'],
    languageOptions: { ecmaVersion: 'latest', sourceType: 'module', globals: { ...globals.node, ...globals.browser } },
    rules: { ...js.configs.recommended.rules, 'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }] }
  }
];
