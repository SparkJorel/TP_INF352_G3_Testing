import { test, expect } from '@playwright/test';

test.describe('Interface de connexion - MyApp', () => {

  test('TC-L1 - Affiche la page de login', async ({ page }) => {
    await page.goto('http://localhost:3000/login/login.html');
    await expect(page).toHaveTitle(/Connexion Sécurisée/);
    await expect(page.getByText('Connectez-vous')).toBeVisible();
  });

  test('TC-L2 - Empêche la connexion avec champs vides', async ({ page }) => {
    await page.goto('http://localhost:3000/login/login.html');
    await page.click('#login-btn');
    await expect(page).toHaveURL(/login\.html/); // Pas de redirection
  });

  test('TC-L3 - Affiche une erreur si username < 4 caractères', async ({ page }) => {
    await page.goto('http://localhost:3000/login/login.html');
    await page.fill('#username', 'ab');
    await page.fill('#password', 'Valid123!');
    await page.click('#login-btn');

    await expect(page.locator('#username-error')).toBeVisible();
    await expect(page.locator('#username-error')).toContainText("au moins 4 caractères");
  });

  test('TC-L4 - Affiche une erreur si mot de passe invalide', async ({ page }) => {
    await page.goto('http://localhost:3000/login/login.html');
    await page.fill('#username', 'adminuser');
    await page.fill('#password', 'pass'); // trop court
    await page.click('#login-btn');

    await expect(page.locator('#password-error')).toBeVisible();
    await expect(page.locator('#password-error')).toContainText("ne respecte pas toutes les règles");
  });

  test('TC-L5 - Active le bouton quand les champs sont valides', async ({ page }) => {
    await page.goto('http://localhost:3000/login/login.html');
    await page.fill('#username', 'adminuser');
    await page.fill('#password', 'Password123!');

    // Le bouton doit maintenant être activé
    const button = page.locator('#login-btn');
    await expect(button).toBeEnabled();
  });

  test('TC-L6 - Simule une connexion réussie (sans back-end)', async ({ page }) => {
    await page.goto('http://localhost:3000/login/login.html');
    await page.fill('#username', 'testuser');
    await page.fill('#password', 'Password123!');

    const [newPage] = await Promise.all([
      page.waitForNavigation({ timeout: 3000 }),
      page.click('#login-btn')
    ]);

    await expect(newPage.url()).toContain('page_utilisateur');
  });

});
