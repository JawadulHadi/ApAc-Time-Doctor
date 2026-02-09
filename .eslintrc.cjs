const path = require('path');

module.exports = {
  parser: '@typescript-eslint/parser',

  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
    ecmaVersion: 'latest',
    sourceType: 'module',
  },

  ignorePatterns: ['dist/**', 'coverage/**', 'node_modules/**', '.eslintrc.cjs', 'webpack.config', '/src/scripts/'],

  plugins: ['@typescript-eslint', 'prettier', 'import', 'simple-import-sort', 'unused-imports'],

  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:import/typescript',
    'plugin:prettier/recommended',
  ],

  rules: {
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      },
    ],
    '@typescript-eslint/no-unsafe-assignment': 'warn',
    '@typescript-eslint/no-unsafe-member-access': 'warn',
    '@typescript-eslint/no-unsafe-return': 'warn',
    '@typescript-eslint/no-unsafe-call': 'warn',
    '@typescript-eslint/no-floating-promises': 'error',
    '@typescript-eslint/require-await': 'error',
    '@typescript-eslint/restrict-template-expressions': 'error',
    '@typescript-eslint/no-misused-promises': 'error',
    '@typescript-eslint/explicit-function-return-type': 'warn',
    '@typescript-eslint/explicit-module-boundary-types': 'warn',
    '@typescript-eslint/unbound-method': 'warn',

    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      },
    ],
    'import/no-duplicates': 'error',
    'import/no-unresolved': 'off',
    'import/order': ['error', { 'alphabetize': { 'order': 'asc' } }],

    'no-trailing-spaces': 'error',
    'no-multiple-empty-lines': ['error', { 'max': 1 }],
    'eol-last': 'error',
    'comma-dangle': ['error', 'always-multiline'],
    'semi': ['error', 'always'],
    'quotes': ['error', 'single', { 'avoidEscape': true }],

    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-debugger': 'error',

    'prettier/prettier': 'error',
  },

  overrides: [
    {
      files: ['**/*.spec.ts'],
      rules: {
        '@typescript-eslint/no-unsafe-assignment': 'warn',
        '@typescript-eslint/no-unsafe-member-access': 'warn',
        '@typescript-eslint/no-unsafe-call': 'warn',
        '@typescript-eslint/no-unsafe-return': 'warn',
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/require-await': 'warn',
        '@typescript-eslint/unbound-method': 'warn',
      },
    },
    {
      files: ['**/*'],
      rules: {
        '@typescript-eslint/no-var-requires': 'warn',
        '@typescript-eslint/explicit-function-return-type': 'warn',
      },
    },
  ],

  settings: {
    'import/resolver': {
      typescript: {
        project: './tsconfig.json',
      },
    },
  },

  env: {
    node: true,
    jest: true,
    es2021: true,
  },
};
