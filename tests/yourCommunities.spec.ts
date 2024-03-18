import { seedServer } from '@/db/mockDB';
import { test, expect } from '@playwright/test';

test.describe('Your Communities page', () => {
  test.beforeEach(async ({ baseURL }) => {
    await seedServer(baseURL || 'http://localhost:3000', {
      communities: [
        {
          id: 'c1',
          name: 'Test Community 1',
          description: 'This is the first test community.',
          defaultCampaignId: '',
        },
        {
          id: 'c2',
          name: 'Test Community 2',
          description: 'This is the second test community.',
          defaultCampaignId: '',
        },
        {
          id: 'c3',
          name: 'Test Community 3',
          description: 'This is the third test community, which has a very long description that cannot possibly fit within the small space provided for the description on the Your Communities page.',
          defaultCampaignId: '',
        },
      ],
      users: [
        { id: 'u1', name: 'Test User 1', email: 'u1@example.com' },
        { id: 'u2', name: 'Test User 2', email: 'u2@example.com' },
        { id: 'u3', name: 'Test User 3', email: 'u3@example.com' },
        { id: 'u4', name: 'Test User 4', email: 'u4@example.com' },
        { id: 'u5', name: 'Test User 5', email: 'u5@example.com' },
      ],
      collaborators: [
        { userId: 'u1', communityId: 'c1' },
        { userId: 'u2', communityId: 'c1' },
        { userId: 'u3', communityId: 'c1' },
        { userId: 'u5', communityId: 'c2' },
      ],
    });
  });

  test('shows the correct breadcrumb', async ({ page }) => {
    await page.goto('/communities');
    await expect(page.getByTestId('breadcrumb')).toHaveText('Your Communities');
  });

  test('shows all communities', async ({ page }) => {
    await page.goto('/communities');
    await expect(page.getByRole('heading', { name: 'Test Community 1' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Test Community 2' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Test Community 3' })).toBeVisible();
  });

  test('shows collaborator count', async ({ page }) => {
    await page.goto('/communities');

    await expect(page
      .getByTestId('community-card')
      .filter({ has: page.getByRole('heading', { name: 'Test Community 1' }) })
      .getByText('3 collaborators'))
      .toHaveCount(1);

    await expect(page
      .getByTestId('community-card')
      .filter({ has: page.getByRole('heading', { name: 'Test Community 2' }) })
      .getByText('1 collaborator'))
      .toHaveCount(1);

    await expect(page
      .getByTestId('community-card')
      .filter({ has: page.getByRole('heading', { name: 'Test Community 3' }) })
      .getByText('0 collaborators'))
      .toHaveCount(1);
  });

  test('community name links to Community Overview page', async ({ page, baseURL }) => {
    await page.goto('/communities');
    await page.getByRole('heading', { name: 'Test Community 2' }).click();
    await expect(page).toHaveURL(`${baseURL}/communities/c2`);
  });

  test('read more links to Community Overview page', async ({ page, baseURL }) => {
    await page.goto('/communities');
    await page.getByRole('link', { name: 'Read More about Test Community 1' }).click();
    await expect(page).toHaveURL(`${baseURL}/communities/c1`);
  });

  test('links to collaborators', async ({ page, baseURL }) => {
    await page.goto('/communities');
    await page
      .getByTestId('community-card')
      .filter({ has: page.getByRole('heading', { name: 'Test Community 2' }) })
      .getByRole('link', { name: '1 collaborator' })
      .click();

    await expect(page).toHaveURL(`${baseURL}/communities/c2/collaborators`);
  });

  test('links to campaigns', async ({ page, baseURL }) => {
    await page.goto('/communities');
    await page
      .getByTestId('community-card')
      .filter({ has: page.getByRole('heading', { name: 'Test Community 2' }) })
      .getByRole('link', { name: 'Campaigns' })
      .click();

    await expect(page).toHaveURL(`${baseURL}/communities/c2/campaigns`);
  });

  test('links to annotations', async ({ page, baseURL }) => {
    await page.goto('/communities');
    await page
      .getByTestId('community-card')
      .filter({ has: page.getByRole('heading', { name: 'Test Community 2' }) })
      .getByRole('link', { name: 'Annotations' })
      .click();

    await expect(page).toHaveURL(`${baseURL}/communities/c2/annotations`);
  });

  test('links to tasks', async ({ page, baseURL }) => {
    await page.goto('/communities');
    await page
      .getByTestId('community-card')
      .filter({ has: page.getByRole('heading', { name: 'Test Community 2' }) })
      .getByRole('link', { name: 'Tasks' })
      .click();

    await expect(page).toHaveURL(`${baseURL}/communities/c2/tasks`);
  });

  test('links to join or create new community', async ({ page, baseURL }) => {
    await page.goto('/communities');
    await page.getByRole('link', { name: 'Join or Create' }).click();
    await expect(page).toHaveURL(`${baseURL}/communities/add`);
  });

  test('shows descriptions', async ({ page }) => {
    await page.goto('/communities');
    await expect(page.getByText('This is the first test community.', { exact: true })).toBeVisible();
    await expect(page.getByText(
      'This is the third test community, which has a very long description that cannot…',
      { exact: true },
    )).toBeVisible();
  });
});
