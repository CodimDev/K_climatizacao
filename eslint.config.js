import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import react from 'eslint-plugin-react'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import security from 'eslint-plugin-security'
import noUnsanitized from 'eslint-plugin-no-unsanitized'

export default [
  { ignores: ['dist', 'node_modules'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: { parser: tseslint.parser },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      react,
      'jsx-a11y': jsxA11y,
      security,
      'no-unsanitized': noUnsanitized,
    },
    rules: {
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'security/detect-unsafe-regex': 'warn',
      'react/no-danger': 'warn',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      'no-empty': 'off',
    },
    settings: { react: { version: 'detect' } },
  },
  {
    files: ['vite.config.*'],
    rules: {
      'no-undef': 'off',
    },
  },
]
