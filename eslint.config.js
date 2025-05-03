import globals from 'globals';
import pluginJs from '@eslint/js';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import eslintPluginImport from 'eslint-plugin-import';
import eslintPluginTypescript from '@typescript-eslint/eslint-plugin';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import typescriptParser from '@typescript-eslint/parser';
import prettierConfig from 'eslint-config-prettier';
export default [
  {
    files: ['src/**/*.{js,mjs,cjs,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      parser: typescriptParser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: process.cwd(),
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        es6: true,
      },
    },
    plugins: {
      '@typescript-eslint': eslintPluginTypescript,
      prettier: eslintPluginPrettier,
      import: eslintPluginImport,
      unicorn: eslintPluginUnicorn,
    },
    rules: {
      ...pluginJs.configs.recommended.rules,
      ...eslintPluginTypescript.configs.recommended.rules,
      ...eslintPluginUnicorn.configs.recommended.rules,
      ...prettierConfig.rules,
      'prettier/prettier': 'error',
      // 'eol-last': ['error', 'always'],
      'linebreak-style': ['error', 'unix'],
      quotes: ['error', 'single'],
      semi: ['error', 'always'],
      'import/no-default-export': 'off',
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-assertions': ['error', { assertionStyle: 'never' }],
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/explicit-member-accessibility': [
        'error',
        { accessibility: 'explicit', overrides: { constructors: 'off' } },
      ],
      '@typescript-eslint/member-ordering': 'error',
      'class-methods-use-this': 'error',
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      'unicorn/no-array-callback-reference': 'off',
      'unicorn/no-array-for-each': 'off',
      'unicorn/no-array-reduce': 'off',
      'unicorn/no-null': 'off',
      'unicorn/number-literal-case': 'off',
      'unicorn/numeric-separators-style': 'off',
      'unicorn/prevent-abbreviations': [
        'error',
        {
          allowList: {
            acc: true,
            env: true,
            i: true,
            j: true,
            props: true,
            Props: true,
          },
        },
      ],
    },
    linterOptions: {
      noInlineConfig: true,
      reportUnusedDisableDirectives: true,
    },
    ignores: [
      'eslint.config.js',
      'webpack.config.js',
      'dist/*',
      'commitlint.config.cjs',
      'jest.config.ts',
      ' tests/**/*',
    ],
  },
  {
    files: ['src/tests/**/*.ts'],
    plugins: {
      '@typescript-eslint': eslintPluginTypescript,
    },
    rules: {
      'no-undef': 'off',
    },
  },
];
