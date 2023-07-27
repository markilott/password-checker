
module.exports = {
    root: true,
    env: {
        es6: true,
        node: true,
    },
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
    },
    extends: [
        'airbnb-base',
        'airbnb-typescript/base',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
    ],
    parserOptions: {
        ecmaVersion: 'latest',
        project: 'tsconfig.json',
        tsconfigRootDir: __dirname,
    },
    plugins: [
        '@typescript-eslint',
        'import',
    ],
    rules: {
        '@typescript-eslint/indent': 'off',
        'import/prefer-default-export': 'off',
        'linebreak-style': 'off',
        'no-console': 'off',
        'max-len': 'off',
        'no-restricted-syntax': 'warn',
        'import/no-relative-packages': 'off',
        'no-new': 'off',
        indent: [
            'error', 4, { "SwitchCase": 1 },
        ],
        'no-new': 'off',
    },
    ignorePatterns: [
        'dist',
        '*.js',
    ],
};
