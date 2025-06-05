import { test, expect } from '@playwright/test';

test('page charge correctement', async ({ page }) => {
  await page.goto('http://localhost:3000/vehicules/index.html');
  await expect(page).toHaveTitle(/Gestion des véhicules/i);
});
