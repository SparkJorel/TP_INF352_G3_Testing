# Test info

- Name: Modifier un utilisateur existant via sa carte
- Location: C:\Users\Scorpion\Desktop\TP_INF352_G3_Testing\tests_Interfaces\users.spec.js:3:1

# Error details

```
Error: Timed out 10000ms waiting for expect(locator).toContainText(expected)

Locator: locator('.swal2-popup')
- Expected string  - 1
+ Received string  + 5

- Succès
+ ×
+     
+     
+   
+ ❌ ErreurUser not found.OKNoCancel
Call log:
  - expect.toContainText with timeout 10000ms
  - waiting for locator('.swal2-popup')
    14 × locator resolved to <div tabindex="-1" role="dialog" aria-modal="true" aria-live="assertive" aria-labelledby="swal2-title" aria-describedby="swal2-html-container" class="swal2-popup swal2-modal swal2-icon-error swal2-show">…</div>
       - unexpected value "×
    
    
  
❌ ErreurUser not found.OKNoCancel"

    at C:\Users\Scorpion\Desktop\TP_INF352_G3_Testing\tests_Interfaces\users.spec.js:47:30
```

# Page snapshot

```yaml
- list:
  - listitem:
    - link "Propelize":
      - /url: ../Dashboard/dashboard.html
  - listitem:
    - link "Véhicules":
      - /url: ../Vehicules/vehicules.html
  - listitem:
    - link "Utilisateurs":
      - /url: utilisateur.html
- link "Liste des utilisateurs":
  - /url: "#users-list"
- link "Liste des vehicules":
  - /url: ../Vehicules/vehicules.html
- navigation:
  - search:
    - searchbox "Search"
    - button "Search"
- heading "Utilisateur" [level=4]
- img "John Doe"
- heading [level=5]
- button "Déconnexion"
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 |
   3 | test('Modifier un utilisateur existant via sa carte', async ({ page }) => {
   4 |   // Mock de la réponse API pour simuler une mise à jour réussie
   5 |   await page.route('**/api/users/**', async (route) => {
   6 |     await route.fulfill({
   7 |       status: 200,
   8 |       contentType: 'application/json',
   9 |       body: JSON.stringify({ message: 'Succès' })
  10 |     });
  11 |   });
  12 |
  13 |   // Injecter un utilisateur dans localStorage
  14 |   await page.addInitScript(() => {
  15 |     localStorage.setItem('user', JSON.stringify({
  16 |       id: 1,
  17 |       name: 'idriss'
  18 |     }));
  19 |   });
  20 |
  21 |   // Naviguer vers la page
  22 |   await page.goto('http://127.0.0.1:5500/interface/Pages/Utilisateur/utilisateur.html');
  23 |   await page.waitForLoadState('networkidle');
  24 |
  25 |   // Attendre que la carte utilisateur soit visible
  26 |   const userCard = page.locator('.user-card', { hasText: 'idriss' });
  27 |   await expect(userCard).toBeVisible();
  28 |
  29 |   // Cliquer sur la carte pour ouvrir le Swal
  30 |   await userCard.click();
  31 |
  32 |   // Attendre que le popup Swal soit visible
  33 |   await page.waitForSelector('.swal2-popup', { state: 'visible', timeout: 10000 });
  34 |
  35 |   // Remplir les champs Swal
  36 |   await page.fill('#swal-input-name', 'idriss');
  37 |   await page.fill('#swal-input-password', 'Lerich@236969');
  38 |
  39 |   // Cliquer sur le bouton "Mettre à jour"
  40 |   await page.click('.swal2-confirm');
  41 |
  42 |   // Attendre un nouveau popup
  43 |   const successPopup = page.locator('.swal2-popup');
  44 |   await successPopup.waitFor({ state: 'visible', timeout: 10000 });
  45 |
  46 |   // Vérifier le contenu du popup
> 47 |   await expect(successPopup).toContainText('Succès', { timeout: 10000 });
     |                              ^ Error: Timed out 10000ms waiting for expect(locator).toContainText(expected)
  48 |
  49 |   // Attente pour stabiliser
  50 |   await page.waitForTimeout(1000);
  51 | });
```