import { defineConfig } from 'vitest/config'
import path from 'node:path'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/setupTests.ts'],
    coverage: {
      reporter: ['text', 'html'],
      exclude: [
        'postcss.config.js',
        'tailwind.config.js',
        'eslint.config.js',
        'vitest.config.ts',
        'dist/**',
        'src/**/*.d.ts',
        'vite.config.*',
        'src/main.tsx',
        'src/App.tsx',
        'src/components/dashboard/**',
        'src/api/**',
        'src/utils/**',
        'src/config/**',
        'src/services/**',
      ],
    },
  },
})
