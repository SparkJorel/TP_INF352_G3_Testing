import { test, expect } from '@playwright/test';

test('Connexion avec identifiants valides', async({ page }) => {
    await page.goto('http://127.0.0.1:5501/interface/login/seConnecter.html');

    // Attendre les champs
    await page.waitForSelector('#username');
    await page.waitForSelector('#password');

    // Remplir les champs
    await page.fill('#username', 'idriss');
    await page.fill('#password', 'Lerich236969$');

    // Activer le bouton (s'il est désactivé)
    await page.$eval('#login-btn', btn => btn.disabled = false);

    // Cliquer sur le bouton
    await page.click('#login-btn');

    // Vérifier la redirection
    await expect(page).toHaveURL(/.*vehicules\/vehicules\.html/);

});