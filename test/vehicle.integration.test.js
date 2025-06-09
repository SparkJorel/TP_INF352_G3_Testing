
import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from "../app";
import { im } from 'mathjs';

describe('Tests d\'intégration - API Véhicules', () => {

  it('TI-001 - Devrait retourner tous les véhicules (GET /api/vehicles)', async () => {
    // Act
    const response = await request(app).get('/api/vehicles');

    // Assert
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('TI-002 - Devrait créer puis retrouver un véhicule par immatriculation', async () => {
    // Arrange
    const vehicule = {
      registrationNumber: 'INT100',
      make: 'Mazda',
      model: 'CX-5',
      year: 2021,
      rentalPrice: 55
    };
    await request(app).post('/api/vehicles').send(vehicule);

    // Act
    const response = await request(app).get('/api/vehicles/INT100');

    // Assert
    expect(response.status).toBe(200);
    expect(response.body.registrationNumber).toBe('INT100');
  });

  it('TI-003 - Devrait mettre à jour un véhicule existant', async () => {
    // Arrange
    const update = {
      make: 'Mazda',
      model: 'CX-9',
      year: 2022,
      rentalPrice: 60
    };

    // Act
    const response = await request(app).put('/api/vehicles/INT100').send(update);

    // Assert
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Vehicle updated successfully.');
  });

  it('TI-004 - Devrait rechercher un véhicule par prix de location', async () => {
    // Act
    const response = await request(app).get('/api/vehicles/search?rentalPrice=60');

    // Assert
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('TI-005 - Devrait supprimer un véhicule et ne plus le retrouver', async () => {
    // Act 1 : Suppression
    const delResponse = await request(app).delete('/api/vehicles/INT100');

    // Assert
    expect(delResponse.status).toBe(200);
    expect(delResponse.body.message).toBe('Vehicle deleted successfully.');

    // Act 2 : Vérification
    const checkResponse = await request(app).get('/api/vehicles/INT100');
    expect(checkResponse.status).toBe(404);
  });

  it('TI-006 - Devrait retourner 404 si aucun véhicule ne correspond à la recherche', async () => {
    // Act
    const response = await request(app).get('/api/vehicles/search?rentalPrice=9999');

    // Assert
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('No vehicles found.');
  });

  it('TI-007 - Devrait retourner 400 si aucun critère n\'est fourni à la recherche', async () => {
    // Act
    const response = await request(app).get('/api/vehicles/search');

    // Assert
    expect(response.status).toBe(400);
    expect(response.body.error).toBeDefined();
  });
  it('TI-008 - GET /api/vehicles/:registrationNumber - véhicule inexistant', async () => {
    const response = await request(app).get('/api/vehicles/XXXX000');
    expect(response.status).toBe(404);
    expect(response.body.error).toMatch(/Vehicle not found/);
  });

  it('TI-009 - GET /api/vehicles/search - immatriculation inexistante', async () => {
    const response = await request(app).get('/api/vehicles/search?registrationNumber=FAKE123');
    expect(response.status).toBe(404);
    expect(response.body.message).toMatch(/No vehicles found/);
  });

  it('TI-010 - PUT /api/vehicles/:registrationNumber - update sur véhicule inexistant', async () => {
    const update = { make: "Ford", model: "Focus", year: 2021, rentalPrice: 42 };
    const response = await request(app)
      .put('/api/vehicles/FAKE123')
      .send(update);
    expect(response.status).toBe(404);
    expect(response.body.error).toMatch(/Vehicle not found/);
  });

  it('TI-011 - DELETE /api/vehicles/:registrationNumber - suppression inexistante', async () => {
    const response = await request(app).delete('/api/vehicles/NONEXIST123');
    expect(response.status).toBe(404);
    expect(response.body.error).toMatch(/Vehicle not found/);
  });

  it('TI-012 - GET avec base indisponible', async () => {
    // Simulation manuelle possible uniquement si on ferme la DB dans app.js
    // Ici on teste un GET sachant que la DB serait cassée (à simuler en vrai)
    // Exemple de comportement à mocker en pratique
    expect(true).toBe(true); // à remplacer si DB simulée down
  });
});
