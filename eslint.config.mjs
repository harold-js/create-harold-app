import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  ...compat.extends('plugin:prettier/recommended', 'eslint:recommended'),
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        harold: 'readonly',
        lunr: 'readonly',
      },

      ecmaVersion: 2020,
      sourceType: 'module',
    },

    rules: {
      'no-var': 'error',
      'prefer-const': 'error',
      'no-use-before-define': 'error',
      'no-mixed-spaces-and-tabs': 'error',
      'no-nested-ternary': 'error',
      'no-unused-vars': 'error',

      'prettier/prettier': [
        'error',
        {
          endOfLine: 'auto',
        },
      ],
    },
  },
];
