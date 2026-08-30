// ESLint v9+ Flat Config for src/web
// See: https://eslint.org/docs/latest/use/configure/configuration-files-new

const js = require('@eslint/js');
const pluginVue = require('eslint-plugin-vue');
const { withVueTs, vueTsConfigs } = require('@vue/eslint-config-typescript');
const vuePrettierConfig = require('@vue/eslint-config-prettier');

module.exports = (async () => [
  js.configs.recommended,
  ...(await withVueTs(
    { rootDir: __dirname },
    pluginVue.configs['flat/essential'],
    vueTsConfigs.recommendedTypeChecked,
  )),
  vuePrettierConfig,
  {
    ignores: [
      'dist',
      '*.js',
      'vite.config.mts',
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
    },
    plugins: {
      import: require('eslint-plugin-import-x'),
    },
  },
])();
