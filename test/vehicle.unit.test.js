import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import { validerVehicule } from '../utils/validerVehicule';


// --- Partie 1 : mock de la base SQLite ---
const dbMock = {
  all: vi.fn((query, params, callback) => {
    callback(null, [{ registrationNumber: "MOCK123", make: "Test", model: "Z", year: 2020, rentalPrice: 40 }]);
  }),
  run: vi.fn((query, params, callback) => {
    callback(null);
  })
};

// --- Partie 2 : routeur simulé pour test ---
const app = express();
app.use(bodyParser.json());

app.get('/api/vehicles', (req, res) => {
  dbMock.all("SELECT * FROM vehicles;", [], (err, rows) => {
    if (err) return res.status(500).json({ error: "Erreur base" });
    res.json(rows);
  });
});

app.delete('/api/vehicles/:registrationNumber', (req, res) => {
  const { registrationNumber } = req.params;
  dbMock.run("DELETE FROM vehicles WHERE registrationNumber = ?;", [registrationNumber], function(err) {
    if (err) return res.status(500).json({ error: "Erreur base" });
    res.json({ message: "Véhicule supprimé avec succès" });
  });
});

//  tests ---
describe('Tests unitaires - API Véhicules (routes + logique)', () => {

  // TU-001 : GET /api/vehicles
  it('TU-001 - Devrait retourner une liste de véhicules (mock route GET)', async () => {
    const res = await request(app).get('/api/vehicles');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].registrationNumber).toBe("MOCK123");
  });

  // TU-002 : DELETE /api/vehicles/:registrationNumber
  it('TU-002 - Devrait supprimer un véhicule avec succès (mock route DELETE)', async () => {
    const res = await request(app).delete('/api/vehicles/MOCK123');
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Véhicule supprimé avec succès");
  });

  /*it('TU-003 - Véhicule complet : retour true', () => {
    const v = { registrationNumber: '123', make: 'Toyota', model: 'Yaris', year: 2018, rentalPrice: 50 };
    expect(validerVehicule(v)).toBe(true);
  });
*/
  it('TU-004 - Sans immatriculation : retour false', () => {
    const v = { make: 'Toyota', model: 'Yaris', year: 2018, rentalPrice: 50 };
    expect(validerVehicule(v)).toBe(false);
  });

  it('TU-005 - Sans prix : retour false', () => {
    const v = { registrationNumber: '123', make: 'Toyota', model: 'Yaris', year: 2018 };
    expect(validerVehicule(v)).toBe(false);
  });

  it('TU-006 - Aucun champ : retour false', () => {
    const v = {};
    expect(validerVehicule(v)).toBe(false);
  });

  it('TU-007 - Année texte : retour false', () => {
    const v = { registrationNumber: '123', make: 'Toyota', model: 'Yaris', year: 'deux mille', rentalPrice: 50 };
    expect(validerVehicule(v)).toBe(false);
  });

  it('TU-008 - Année négative : retour false', () => {
    const v = { registrationNumber: '123', make: 'Toyota', model: 'Yaris', year: -2000, rentalPrice: 50 };
    expect(validerVehicule(v)).toBe(false);
  });

  it('TU-009 - Année dans le futur : retour false', () => {
    const v = { registrationNumber: '123', make: 'Toyota', model: 'Yaris', year: 3000, rentalPrice: 50 };
    expect(validerVehicule(v)).toBe(false);
  });
  it('TU-010 - Devrait retourner false si rentalPrice est une chaîne', () => {
    const vehicule = {
      registrationNumber: 'X1', make: 'BMW', model: 'X5', year: 2022, rentalPrice: "50"
    };
    expect(validerVehicule(vehicule)).toBe(false);
  });

  it('TU-011 - Devrait retourner false si year est un float', () => {
    const vehicule = {
      registrationNumber: 'X1', make: 'BMW', model: 'X5', year: 2022.5, rentalPrice: 50
    };
    expect(validerVehicule(vehicule)).toBe(false);
  });

  it('TU-012 - Devrait retourner false si rentalPrice est négatif', () => {
    const vehicule = {
      registrationNumber: 'X1', make: 'BMW', model: 'X5', year: 2020, rentalPrice: -10
    };
    expect(validerVehicule(vehicule)).toBe(false);
  });
});

