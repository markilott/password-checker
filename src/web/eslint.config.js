// ESLint v9+ Flat Config for src/web
// See: https://eslint.org/docs/latest/use/configure/configuration-files-new

const { FlatCompat } = require('@eslint/eslintrc');
const tseslint = require('typescript-eslint');
const compat = new FlatCompat({ baseDirectory: __dirname });

module.exports = [
  ...compat.extends('plugin:vue/vue3-essential'),
  ...compat.extends('eslint:recommended'),
  ...compat.extends('@vue/eslint-config-typescript'),
  ...compat.extends('@vue/eslint-config-prettier'),
  ...compat.extends('plugin:@typescript-eslint/recommended'),
  ...compat.extends('plugin:@typescript-eslint/recommended-requiring-type-checking'),
  ...tseslint.configs.recommendedTypeChecked,
  {
    ignores: [
      'dist',
      '*.js',
      'vite.config.ts',
    ],
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        window: 'readonly',
        document: 'readonly',
      },
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
      },
      env: {
        browser: true,
      },
    },
    plugins: {
      '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
      import: require('eslint-plugin-import'),
      html: require('eslint-plugin-html'),
      vue: require('eslint-plugin-vue'),
    },
  },
];
