import { test, expect } from '@playwright/test';

test('Modifier un utilisateur existant via sa carte', async({ page }) => {
    // Injecter un utilisateur dans localStorage AVANT de charger la page
    await page.addInitScript(() => {
        localStorage.setItem('user', JSON.stringify({
            id: 59,
            name: 'idriss'
        }));
    });

    // Mocker la requête PUT
    await page.route('http://localhost:3000/users/59', route => {
        route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ success: true })
        });
    });

    await page.goto('http://127.0.0.1:5501/interface/Pages/Utilisateur/utilisateur.html');

    // Attendre que la carte utilisateur affiche le nom "idriss"
    const userCard = page.locator('.user-card', { hasText: 'idriss' });
    await expect(userCard).toBeVisible();

    // Cliquer sur la carte pour ouvrir le Swal
    await userCard.click();

    // Remplir les champs Swal
    await page.fill('#swal-input-name', 'idriss_modifié');
    await page.fill('#swal-input-password', 'nouveauMotDePasse123');

    // Cliquer sur le bouton "Mettre à jour"
    await page.click('.swal2-confirm');

    // Vérifier succès Swal (optionnel)
    const successPopup = page.locator('.swal2-popup');
    await expect(successPopup).toContainText('Succès');

    // Petite attente pour stabiliser (optionnel)
    await page.waitForTimeout(1000);
});