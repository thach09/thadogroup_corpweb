import { defineConfig } from '@playwright/test';

const baseURL = 'http://127.0.0.1:4325';

export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.ts',
  timeout: 45_000,
  retries: process.env.CI ? 1 : 0,
  workers: 3,
  reporter: 'list',
  use: {
    baseURL,
    reducedMotion: 'reduce',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium-desktop', use: { browserName: 'chromium', viewport: { width: 1440, height: 960 } } },
    { name: 'chromium-mobile', use: { browserName: 'chromium', viewport: { width: 360, height: 800 }, isMobile: true, hasTouch: true } },
    { name: 'chromium-narrow', use: { browserName: 'chromium', viewport: { width: 320, height: 640 }, isMobile: true, hasTouch: true } },
    { name: 'webkit-tablet', use: { browserName: 'webkit', viewport: { width: 768, height: 1024 }, hasTouch: true } },
    { name: 'webkit-mobile', use: { browserName: 'webkit', viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } },
  ],
  webServer: {
    command: 'npm run preview -- --ignore-lock --host 127.0.0.1 --port 4325',
    url: baseURL,
    reuseExistingServer: false,
    timeout: 45_000,
  },
});
