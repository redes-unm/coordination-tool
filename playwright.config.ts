import { PlaywrightTestConfig, defineConfig, devices } from '@playwright/test';

const ci = !!process.env['CI'];

const config: PlaywrightTestConfig = {
  testDir: './tests',
  forbidOnly: !!process.env['CI'],
  retries: ci ? 2 : 0,
  workers: 1,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
  ],
  webServer: {
    env: { TESTING: '1' },
    command: 'npm run build && npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: !ci,
  },
};

export default defineConfig(config);
