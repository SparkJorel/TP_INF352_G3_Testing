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
- PUT: http://localhost:3000/api/vehicles/XYZ789
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
curl -X PUT http://localhost:3000/api/vehicles/XYZ789 \
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

### 5. Technologies utilises
Node.js
Express.js
SQLite
