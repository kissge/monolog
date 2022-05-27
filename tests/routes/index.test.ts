import { expect, test } from '@playwright/test';

test('Global nav', async ({ page }) => {
  await page.goto('/');
  expect(await page.$('nav')).not.toBeNull();
});

test('List of notes', async ({ page }) => {
  await page.goto('/');
  expect(await page.$('li a')).not.toBeNull();
});
