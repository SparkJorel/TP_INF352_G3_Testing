import { test, expect } from '@playwright/test';

test('Connexion avec identifiants valides', async ({ page }) => {
  // Naviguer vers la page de connexion
  await page.goto('/interface/login/seConnecter.html'); // Utiliser baseURL depuis playwright.config.js

  // Attendre que les champs soient visibles
  await page.waitForSelector('#username', { state: 'visible', timeout: 10000 });
  await page.waitForSelector('#password', { state: 'visible', timeout: 10000 });

  // Remplir les champs
  await page.fill('#username', 'idriss');
  await page.fill('#password', 'Lerich@236969');

  // Vérifier que le bouton est cliquable (non désactivé)
  await expect(page.locator('#login-btn')).toBeEnabled({ timeout: 10000 });

  // Cliquer sur le bouton de connexion
  await page.click('#login-btn');

  // Vérifier la redirection vers la page des véhicules
  await expect(page).toHaveURL(/vehicules\/vehicules\.html$/, { timeout: 10000 });

  // Optionnel : attendre que la page soit complètement chargée
  await page.waitForLoadState('networkidle');
});