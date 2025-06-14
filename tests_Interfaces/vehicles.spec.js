import { test, expect } from '@playwright/test';

test(' Vehicles : Vérifier que la liste des véhicules est affichée après authentification', async({ page }) => {
    // Simuler un utilisateur authentifié
    await page.addInitScript(() => {
        localStorage.setItem('user', JSON.stringify({
            id: 1,
            name: 'idriss'
        }));
    });

    // Accéder à la page des véhicules
    // await page.goto('../interface/Pages/Vehicules/vehicules.html');
    await page.goto('http://127.0.0.1:5501/interface/Pages/Vehicules/vehicules.html');


    // Attendre que la liste des véhicules apparaisse (modifie le sélecteur selon ton HTML)
    const vehicleList = page.locator('.vehicle-card');

    // Vérifier qu'au moins un véhicule est affiché
    await expect(vehicleList.first()).toBeVisible();

    // Optionnel : vérifier le nom d’un véhicule attendu
    // await expect(vehicleList).toContainText('Toyota Yaris');
});