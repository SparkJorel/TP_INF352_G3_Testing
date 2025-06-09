// playwright.config.js
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests_Interfaces', // Répertoire où se trouvent vos fichiers de test (ajustez selon votre structure)
  testMatch: ['**/*.spec.js'], // Motif pour reconnaître les fichiers de test
  fullyParallel: true, // Exécuter les tests en parallèle
  retries: 1, // Nombre de tentatives en cas d'échec
  workers: 2, // Nombre de workers pour exécuter les tests
  reporter: 'html', // Générer un rapport HTML
  use: {
    baseURL: 'http://127.0.0.1:5500', // URL de base pour vos tests
    browserName: 'chromium', // Navigateur par défaut
    headless: true, // Exécuter sans interface graphique
    screenshot: 'only-on-failure', // Prendre des captures d'écran uniquement en cas d'échec
    trace: 'on-first-retry', // Activer le traçage en cas de nouvelle tentative
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' }, // Remplacer 'chrome' par 'chromium'
    }
  ],
});