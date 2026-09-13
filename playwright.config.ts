import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/browser',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : 3,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:4327',
    browserName: 'chromium',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: 'npm run preview -- --host 127.0.0.1 --port 4327 --ignore-lock',
    // Let Playwright own the process instead of Astro's agent-aware daemon.
    env: { ASTRO_PREVIEW_BACKGROUND: '1' },
    url: 'http://127.0.0.1:4327',
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
});
