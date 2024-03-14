import { test, expect } from '@playwright/test';

test.describe('sanity checks', () => {
  test('loads the main page', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle('CellWatch Community Coordination Tool');
  });
});
