/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import checker from 'vite-plugin-checker';
import { playwright } from '@vitest/browser-playwright'

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
      provider: playwright({
        launchOptions: {
          args: [
            '--autoplay-policy=no-user-gesture-required',
            '--disable-web-security',
            '--disable-features=IsolateOrigins,site-per-process'
          ]
        }
      }),
      screenshotFailures: false,
      instances: [{
        browser: 'chromium',
      }]
    },
    setupFiles: ['.storybook/vitest.setup.ts'],
    typecheck: {
      enabled: true
    }
  }
});