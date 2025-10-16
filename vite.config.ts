/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import checker from 'vite-plugin-checker';

export default defineConfig({
  plugins: [
    react(),
    checker({ typescript: true })
  ],
  test: {
    include: ['tests/**/*.test.{ts,tsx}'],
    browser: {
      enabled: true,
      headless: true,
      provider: 'playwright',
      screenshotFailures: false,
      instances: [{
        browser: 'chromium',
        launch: {
          channel: 'chrome',
          args: [
            '--autoplay-policy=no-user-gesture-required',
            '--disable-web-security',
            '--disable-features=IsolateOrigins,site-per-process'
          ]
        }
      }]
    },
    setupFiles: ['.storybook/vitest.setup.ts'],
    typecheck: {
      enabled: true
    }
  }
});