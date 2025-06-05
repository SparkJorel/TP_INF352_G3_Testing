# Test info

- Name: Interface de connexion - MyApp >> TC-L2 - Empêche la connexion avec champs vides
- Location: /home/leniorju/Documents/school/INFO_L3/INF352/TP final/TP_INF352_G3_Testing/tests/login.spec.js:11:3

# Error details

```
Error: page.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('#login-btn')
    - locator resolved to <button disabled type="submit" id="login-btn" class="login-btn">…</button>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is not enabled
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is not enabled
    - retrying click action
      - waiting 100ms
    44 × waiting for element to be visible, enabled and stable
       - element is not enabled
     - retrying click action
       - waiting 500ms

    at /home/leniorju/Documents/school/INFO_L3/INF352/TP final/TP_INF352_G3_Testing/tests/login.spec.js:13:16
```

# Page snapshot

```yaml
- img "Vague décorative"
- img "Illustration de connexion"
- heading "Bienvenue sur MyApp" [level=2]
- paragraph: La solution tout-en-un pour votre productivité
- img "Logo"
- heading "Connectez-vous" [level=1]
- text: 
- textbox "Nom d'utilisateur"
- text: Nom d'utilisateur Le nom d'utilisateur doit contenir au moins 4 caractères 
- textbox "Mot de passe"
- text: Mot de passe  8 caractères minimum  1 majuscule  1 chiffre  1 caractère spécial Le mot de passe ne respecte pas toutes les règles
- checkbox "Afficher le mot de passe"
- text: Afficher le mot de passe
- link "Mot de passe oublié ?":
  - /url: "#"
- button "Se connecter " [disabled]
- text: ou
- button " Continuer avec Google"
- button " Continuer avec Microsoft"
- paragraph:
  - text: Pas encore de compte ?
  - link "S'inscrire":
    - /url: "#"
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 |
   3 | test.describe('Interface de connexion - MyApp', () => {
   4 |
   5 |   test('TC-L1 - Affiche la page de login', async ({ page }) => {
   6 |     await page.goto('http://localhost:3000/login/login.html');
   7 |     await expect(page).toHaveTitle(/Connexion Sécurisée/);
   8 |     await expect(page.getByText('Connectez-vous')).toBeVisible();
   9 |   });
  10 |
  11 |   test('TC-L2 - Empêche la connexion avec champs vides', async ({ page }) => {
  12 |     await page.goto('http://localhost:3000/login/login.html');
> 13 |     await page.click('#login-btn');
     |                ^ Error: page.click: Test timeout of 30000ms exceeded.
  14 |     await expect(page).toHaveURL(/login\.html/); // Pas de redirection
  15 |   });
  16 |
  17 |   test('TC-L3 - Affiche une erreur si username < 4 caractères', async ({ page }) => {
  18 |     await page.goto('http://localhost:3000/login/login.html');
  19 |     await page.fill('#username', 'ab');
  20 |     await page.fill('#password', 'Valid123!');
  21 |     await page.click('#login-btn');
  22 |
  23 |     await expect(page.locator('#username-error')).toBeVisible();
  24 |     await expect(page.locator('#username-error')).toContainText("au moins 4 caractères");
  25 |   });
  26 |
  27 |   test('TC-L4 - Affiche une erreur si mot de passe invalide', async ({ page }) => {
  28 |     await page.goto('http://localhost:3000/login/login.html');
  29 |     await page.fill('#username', 'adminuser');
  30 |     await page.fill('#password', 'pass'); // trop court
  31 |     await page.click('#login-btn');
  32 |
  33 |     await expect(page.locator('#password-error')).toBeVisible();
  34 |     await expect(page.locator('#password-error')).toContainText("ne respecte pas toutes les règles");
  35 |   });
  36 |
  37 |   test('TC-L5 - Active le bouton quand les champs sont valides', async ({ page }) => {
  38 |     await page.goto('http://localhost:3000/login/login.html');
  39 |     await page.fill('#username', 'adminuser');
  40 |     await page.fill('#password', 'Password123!');
  41 |
  42 |     // Le bouton doit maintenant être activé
  43 |     const button = page.locator('#login-btn');
  44 |     await expect(button).toBeEnabled();
  45 |   });
  46 |
  47 |   test('TC-L6 - Simule une connexion réussie (sans back-end)', async ({ page }) => {
  48 |     await page.goto('http://localhost:3000/login/login.html');
  49 |     await page.fill('#username', 'testuser');
  50 |     await page.fill('#password', 'Password123!');
  51 |
  52 |     const [newPage] = await Promise.all([
  53 |       page.waitForNavigation({ timeout: 3000 }),
  54 |       page.click('#login-btn')
  55 |     ]);
  56 |
  57 |     await expect(newPage.url()).toContain('page_utilisateur');
  58 |   });
  59 |
  60 | });
  61 |
```