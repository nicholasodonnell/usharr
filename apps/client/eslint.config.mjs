import { fixupConfigRules, fixupPluginRules } from '@eslint/compat'
import baseConfig, {
  compat,
} from '@usharr/eslint-config-custom/eslint.config.mjs'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import { defineConfig } from 'eslint/config'
import globals from 'globals'

export default defineConfig([
  ...baseConfig,
  ...fixupConfigRules(
    compat.extends(
      'plugin:react/recommended',
      'plugin:react-hooks/recommended',
    ),
  ),
  {
    files: ['**/*.{js,jsx,ts,tsx,mjs}'],

    languageOptions: {
      ecmaVersion: 'latest',
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },

      sourceType: 'module',
    },

    plugins: {
      react: fixupPluginRules(react),
      'react-hooks': fixupPluginRules(reactHooks),
    },

    rules: {
      'react-hooks/exhaustive-deps': 'error',
      'react-hooks/rules-of-hooks': 'off',
      'react/display-name': 'off',

      'react/jsx-curly-spacing': [
        'error',
        {
          children: true,
        },
      ],

      'react/jsx-no-undef': 'error',
      'react/jsx-uses-react': 'error',
      'react/jsx-uses-vars': 'error',

      'react/no-unescaped-entities': [
        'error',
        {
          forbid: ['>', '"', '}'],
        },
      ],

      'react/prop-types': 'off',

      'react/self-closing-comp': [
        'error',
        {
          component: true,
          html: true,
        },
      ],
    },

    settings: {
      react: {
        version: 'detect',
      },
    },
  },
])
