import { seedServer } from '@/db/mockDB';
import { test, expect } from '@playwright/test';

test.describe('Community Overview page', () => {
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
          description: new Array(100).fill(1)
            .map(() => 'This is the second test community, which has a long description.')
            .join('\n'),
          defaultCampaignId: '',
        },
      ],
      campaigns: [
        {
          id: 'ca1', name: 'Campaign 1', communityId: 'c1', description: '',
        },
        {
          id: 'ca2', name: 'Campaign 2', communityId: 'c2', description: '',
        },
        {
          id: 'ca3', name: 'Campaign 3', communityId: 'c1', description: '',
        },
        {
          id: 'ca4', name: 'Campaign 4', communityId: 'c2', description: '',
        },
      ],
      tasks: [
        {
          id: 't1', name: 'Task 1', campaignId: 'ca1', priority: 'low', status: 'todo', description: '',
        },
        {
          id: 't2', name: 'Task 2', campaignId: 'ca1', priority: 'medium', status: 'in progress', description: '',
        },
        {
          id: 't3', name: 'Task 3', campaignId: 'ca3', priority: 'high', status: 'done', description: '',
        },
        {
          id: 't4', name: 'Task 4', campaignId: 'ca2', priority: 'medium', status: 'todo', description: '',
        },
      ],
      annotations: [
        {
          id: 'a1',
          name: 'Annotation 1',
          communityId: 'c1',
          type: 'poi',
          visible: true,
          geojson: { type: 'Point', coordinates: [-84.3963, 33.7772] },
          description: '',
        },
        {
          id: 'a2',
          name: 'Annotation 2',
          communityId: 'c2',
          type: 'poi',
          visible: true,
          geojson: { type: 'Point', coordinates: [-84.3963, 33.7772] },
          description: '',
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

  test('returns 404 for unknown community IDs', async ({ page }) => {
    const res = await page.goto('/communities/c3');
    expect(res?.status()).toBe(404);
  });

  test('shows community name in breadcrumb', async ({ page }) => {
    await page.goto('/communities/c1');
    await expect(page.getByTestId('breadcrumb')).toHaveText('Your Communities > Test Community 1');
  });

  test('links to Your Communities page in breadcrumb', async ({ page, baseURL }) => {
    await page.goto('/communities/c1');
    await page.getByTestId('breadcrumb').getByRole('link', { name: 'Your Communities' }).click();
    await expect(page).toHaveURL(`${baseURL}/communities`);
  });

  test('shows community name in header', async ({ page }) => {
    await page.goto('/communities/c1');
    await expect(page.getByRole('heading', { name: 'Test Community 1' })).toBeVisible();
  });

  test('shows collaborator count link', async ({ page, baseURL }) => {
    await page.goto('/communities/c1');
    await page.getByRole('link', { name: '3 collaborators' }).click();
    await expect(page).toHaveURL(`${baseURL}/communities/c1/collaborators`);
  });

  test('shows description', async ({ page }) => {
    await page.goto('/communities/c1');
    await expect(page.getByText('This is the first test community.')).toBeVisible();
  });

  test('scrolls long description', async ({ page }) => {
    await page.goto('/communities/c2');
    await expect(page.getByText('This is the second test community').first()).toBeInViewport();
    await expect(page.getByText('This is the second test community').last()).not.toBeInViewport();

    await page.getByText('This is the second test community').last().scrollIntoViewIfNeeded();
    await expect(page.getByText('This is the second test community').last()).toBeInViewport();
    await expect(page.getByText('This is the second test community').first()).not.toBeInViewport();
  });

  test('shows campaign count link', async ({ page, baseURL }) => {
    await page.goto('/communities/c1');
    await page.getByRole('link', { name: 'Campaigns 2 open' }).click();
    await expect(page).toHaveURL(`${baseURL}/communities/c1/campaigns`);
  });

  test('shows task count link', async ({ page, baseURL }) => {
    await page.goto('/communities/c1');
    await page.getByRole('link', { name: 'Tasks 3 pending' }).click();
    await expect(page).toHaveURL(`${baseURL}/communities/c1/tasks`);
  });

  test('shows annotation count link', async ({ page, baseURL }) => {
    await page.goto('/communities/c1');
    await page.getByRole('link', { name: 'Annotations 1 total' }).click();
    await expect(page).toHaveURL(`${baseURL}/communities/c1/annotations`);
  });
});
