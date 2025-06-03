# TP INF 352: Vehicle Rental API

API REST de gestion de véhicules (voitures et camionnettes) développée avec Node.js et SQLite. Cette API permet d’ajouter, consulter, modifier, supprimer et rechercher des véhicules.

---

##### Installation et configuration

### 1. Cloner le dépôt, installer les dependances puis lancer le serveur

```bash
git clone https://github.com/ton-utilisateur/vehicle-rental-api.git
cd vehicle-rental-api
npm install
node app.js

```
### 2. Tester l'API avec Postman

- Ouvre postman
- creer les requestes de type :
```bash
- GET: http://localhost:3000/api/vehicles
- GET: http://localhost:3000/api/vehicles/ABC123
- POST: http://localhost:3000/api/vehicles
- PUT: http://localhost:3000/api/vehicles/ABC123
- DELETE: http://localhost:3000/api/vehicles/XYZ789
- Recherche par immatriculation: http://localhost:3000/api/vehicles/search?registrationNumber=ABC123
- Recherche par prix: http://localhost:3000/api/vehicles/search?rentalPrice=50
```

### 3. Tester l'API avec Curl (terminal)
Ouvre le terminal
```bash
# GET tous les véhicules
curl http://localhost:3000/api/vehicles

# GET un véhicule
curl http://localhost:3000/api/vehicles/ABC123

# POST un nouveau véhicule
curl -X POST http://localhost:3000/api/vehicles \
     -H "Content-Type: application/json" \
     -d '{"registrationNumber":"XYZ789","make":"Kia","model":"Rio","year":2022,"rentalPrice":48}'

# PUT mise à jour
curl -X PUT http://localhost:3000/api/vehicles/ABC123 \
     -H "Content-Type: application/json" \
     -d '{"make":"Kia","model":"Sportage","year":2023,"rentalPrice":52}'

# DELETE un véhicule
curl -X DELETE http://localhost:3000/api/vehicles/XYZ789
```

### 4. Structure du projet
```pgsql
.
├── app.js
├── db/
│   └── database.js
├── routes/
│   └── vehicleRoutes.js
├── models/
│   └── vehicleModel.js
└── README.md
```


# Exécuter des tests JavaScript avec Vitest

Vitest est un framework de test rapide et moderne conçu pour fonctionner avec des projets basés sur Vite, y compris ceux utilisant React, Vue, ou d'autres bibliothèques modernes.

## 📦 Installation

### 1. Initialiser un projet (si ce n’est pas déjà fait)

```bash
npm create vite@latest
cd mon-projet
npm install

2. Installer Vitest

npm install -D vitest


✍️ Exemple de fichier de test

Créez un fichier math.test.js dans un dossier tests ou à la racine du projet :

// math.test.js
function sum(a, b) {
  return a + b
}

test('additionne correctement deux nombres', () => {
  expect(sum(2, 3)).toBe(5)
})

🧪 Lancer les tests

Ajoutez le script suivant dans votre package.json :

NB: CECI EST IMPORTANT SINON  LE TEST NE LANCERA PAS
"scripts": {
  "test": "vitest"
}

Puis exécutez :

npm run test

### 5. Technologies utilises
Node.js
Express.js
SQLite

dans votre cas, installer juste ces dependances et executez la commande npm run test.


📘 Guide de test des endpoints de l'API Utilisateur avec Postman
Ce projet est une API simple permettant de gérer des utilisateurs (création, modification et connexion) avec Express.js et SQLite3.

⚙️ Prérequis

Avant de tester l’API, tu dois :

    Avoir Node.js installé

    Avoir lancé le serveur Express (node server.js)

    Avoir installé Postman

    Avoir une base de données SQLite avec une table user

Exemple de création de la table user :

CREATE TABLE user (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  password TEXT NOT NULL
);

🚀 Démarrer le serveur

Si ton API est dans un fichier comme userRoutes.js, crée un fichier server.js :

const express = require('express');
const userRoutes = require('./userRoutes');

const app = express();
app.use('/', userRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}`);
});

Puis exécute :

node server.js

🧪 Tester les endpoints avec Postman
1. ✅ Créer un utilisateur

    Méthode : POST

    URL : http://localhost:3000/users

    Corps (Body) → onglet raw → JSON :

{
  "name": "alice",
  "password": "1234"
}

    Réponse attendue :

{
  "id": 1,
  "name": "alice"
}

2. ♻️ Mettre à jour un utilisateur

    Méthode : PUT

    URL : http://localhost:3000/users/1 (remplacer 1 par l’ID de l’utilisateur)

    Corps (Body) :

{
  "name": "alice_updated",
  "password": "5678"
}

    Réponse attendue :

{
  "message": "User updated successfully."
}

3. 🔐 Se connecter (Login)

    Méthode : POST

    URL : http://localhost:3000/login

    Corps (Body) :

{
  "name": "alice_updated",
  "password": "5678"
}

    Réponse attendue (succès) :

{
  "message": "Login successful!",
  "user": {
    "id": 1,
    "name": "alice_updated",
    "password": "5678"
  }
}

    Réponse attendue (échec) :

{
  "error": "Invalid credentials."
}

🧼 Conseils

    Vérifie que le chemin vers la base vehicles.db est correct (./db/vehicles.db)

    Tu peux utiliser SQLiteStudio ou DBeaver pour visualiser la base de données.

📌 Remarques

    Cette API est simple et ne chiffre pas les mots de passe.
