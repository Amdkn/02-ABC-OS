import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 60_000,
  expect: { timeout: 5_000 },
  fullyParallel: false, // run sequentially to keep the prod server polite
  workers: 1,
  reporter: [['list'], ['html', { open: 'never', outputFolder: '../../scratch/playwright-report' }]],
  use: {
    baseURL: process.env.BASE_URL ?? 'https://abc-os.kalybana.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'desktop-chrome',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
