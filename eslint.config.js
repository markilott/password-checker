// ESLint v9+ Flat Config for password-checker
// See: https://eslint.org/docs/latest/use/configure/configuration-files-new

const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');

module.exports = tseslint.config(
  // Top-level ignore for cdk.out, JS files, and the web app (which has its own config)
  {
    ignores: [
      '**/cdk.out/**',
      '**/*.js',
      'dist',
      '*.d.ts',
      'src/web/**',
    ],
  },
  eslint.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
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
        projectService: true,
        tsconfigRootDir: __dirname,
      },
    },
    plugins: {
      import: require('eslint-plugin-import-x'),
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
    },
  },
);
