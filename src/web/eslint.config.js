// ESLint v9+ Flat Config for src/web
// See: https://eslint.org/docs/latest/use/configure/configuration-files-new

const { FlatCompat } = require('@eslint/eslintrc');
const tseslint = require('typescript-eslint');
const compat = new FlatCompat({ baseDirectory: __dirname });

module.exports = [
  ...compat.extends('plugin:@typescript-eslint/recommended'),
  ...compat.extends('plugin:@typescript-eslint/recommended-requiring-type-checking'),
  ...tseslint.configs.recommendedTypeChecked,
  {
    ignores: [
      'dist',
      '.parcel-cache',
      '*.js',
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
    },
    rules: {
      '@typescript-eslint/indent': 'off',
      'import/prefer-default-export': 'off',
      'linebreak-style': 'off',
      'no-console': 'off',
      'max-len': 'off',
      'no-restricted-syntax': 'warn',
      'import/no-relative-packages': 'off',
      'no-new': 'off',
      indent: ['error', 4, { SwitchCase: 1 }],
      'no-new': 'off',
    },
  },
];
