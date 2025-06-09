import { test, expect } from '@playwright/test';

test('Modifier un utilisateur existant via sa carte', async ({ page }) => {
  // Injecter un utilisateur dans localStorage
  await page.addInitScript(() => {
    localStorage.setItem('user', JSON.stringify({
      id: 1,
      name: 'idriss'
    }));
  });

  // Naviguer vers la page
  await page.goto('http://127.0.0.1:5500/interface/Pages/Utilisateur/utilisateur.html');
  await page.waitForLoadState('networkidle');

  // Attendre que la carte utilisateur soit visible
  const userCard = page.locator('.user-card', { hasText: 'idriss' });
  await expect(userCard).toBeVisible();

  // Cliquer sur la carte pour ouvrir le Swal
  await userCard.click();

  // Attendre que le popup Swal soit visible
  await page.waitForSelector('.swal2-popup', { state: 'visible', timeout: 10000 });

  // Remplir les champs Swal
  await page.fill('#swal-input-name', 'idriss');
  await page.fill('#swal-input-password', 'Lerich@236969');

  // Cliquer sur le bouton "Mettre à jour"
  await page.click('.swal2-confirm');

  // Attendre un nouveau popup
  const successPopup = page.locator('.swal2-popup');
  await successPopup.waitFor({ state: 'visible', timeout: 10000 });

  // Vérifier le contenu du popup avec gestion des erreurs
  try {
    await expect(successPopup).toContainText('Succès', { timeout: 10000 });
  } catch (error) {
    const popupText = await successPopup.textContent();
    throw new Error(`Échec de la mise à jour : ${popupText}`);
  }

  // Attente pour stabiliser
  await page.waitForTimeout(1000);
});