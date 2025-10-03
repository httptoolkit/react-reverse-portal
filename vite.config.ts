/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    include: ['tests/**/*.test.{ts,tsx}'],
    browser: {
      enabled: true,
      headless: true,
      provider: 'playwright',
      screenshotFailures: false,
      instances: [{
        browser: 'chromium'
      }]
    },
    setupFiles: ['.storybook/vitest.setup.ts']
  }
});