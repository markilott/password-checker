// ESLint v9+ Flat Config for password-checker
// See: https://eslint.org/docs/latest/use/configure/configuration-files-new


const { FlatCompat } = require('@eslint/eslintrc');
const tseslint = require('typescript-eslint');
const compat = new FlatCompat({ baseDirectory: __dirname });

module.exports = [
  // Top-level ignore for cdk.out and JS files
  {
    ignores: [
      'cdk.out',
      '**/cdk.out/**',
      '*.js',
      '**/*.js',
      'dist',
      '*.d.ts',
    ],
  },
  ...compat.extends('plugin:@typescript-eslint/recommended'),
  ...compat.extends('plugin:@typescript-eslint/recommended-requiring-type-checking'),
  ...tseslint.configs.recommendedTypeChecked,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
      },
      parserOptions: {
        project: './tsconfig.json',
        projectService: true,
        tsconfigRootDir: __dirname,
      },
    },
    plugins: {
      '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
      import: require('eslint-plugin-import'),
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
