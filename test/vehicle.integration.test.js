import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../app';

describe('Tests d\'intégration - API Véhicules', () => {
  // Réinitialiser la base de données avant chaque test
  beforeEach(async () => {
    // Supprimer les véhicules pour garantir un état propre
    await request(app).delete('/api/vehicles/ABC123');
    await request(app).delete('/api/vehicles/INT100');
  });

  it('TI-001 - Devrait retourner tous les véhicules (GET /api/vehicles)', async () => {
    // Arrange
    // Aucun arrangement nécessaire, on teste l'état initial
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
    await request(app).post('/api/vehicles').send({
      registrationNumber: 'INT100',
      make: 'Mazda',
      model: 'CX-5',
      year: 2021,
      rentalPrice: 55
    });
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
    // Arrange
    const vehicule = {
      registrationNumber: 'ABC123',
      make: 'Toyota', // Corrigé : brand -> make
      model: 'Yaris',
      year: 2020,
      rentalPrice: 50
    };
    await request(app).post('/api/vehicles').send(vehicule);
    // Act
    const response = await request(app).get('/api/vehicles/search?rentalPrice=50');
    // Assert
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('TI-005 - Devrait supprimer un véhicule et ne plus le retrouver', async () => {
    // Arrange
    await request(app).post('/api/vehicles').send({
      registrationNumber: 'INT100',
      make: 'Mazda',
      model: 'CX-5',
      year: 2021,
      rentalPrice: 55
    });
    // Act
    const delResponse = await request(app).delete('/api/vehicles/INT100');
    const checkResponse = await request(app).get('/api/vehicles/INT100');
    // Assert
    expect(delResponse.status).toBe(200);
    expect(delResponse.body.message).toBe('Vehicle deleted successfully.');
    expect(checkResponse.status).toBe(404);
  });

  it('TI-006 - Devrait retourner 404 si aucun véhicule ne correspond à la recherche', async () => {
    // Arrange
    // Aucun véhicule n'existe avec rentalPrice=999999
    // Act
    const response = await request(app).get('/api/vehicles/search?rentalPrice=999999');
    // Assert
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('No vehicles found.');
  });

  it('TI-007 - Devrait retourner 400 si aucun critère n\'est fourni à la recherche', async () => {
    // Arrange
    // Pas de paramètres fournis
    // Act
    const response = await request(app).get('/api/vehicles/search');
    // Assert
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Provide at least registrationNumber or rentalPrice.');
  });

  it('TI-008 - GET /api/vehicles/:registrationNumber - véhicule inexistant', async () => {
    // Arrange
    // Aucun véhicule avec registrationNumber=XXXX000
    // Act
    const response = await request(app).get('/api/vehicles/XXXX000');
    // Assert
    expect(response.status).toBe(404);
    expect(response.body.error).toMatch(/Vehicle not found/);
  });

  it('TI-009 - GET /api/vehicles/search - immatriculation inexistante', async () => {
    // Arrange
    // Aucun véhicule avec registrationNumber=FAKE123
    // Act
    const response = await request(app).get('/api/vehicles/search?registrationNumber=FAKE123');
    // Assert
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('No vehicles found.');
  });

  it('TI-010 - PUT /api/vehicles/:registrationNumber - update sur véhicule inexistant', async () => {
    // Arrange
    const update = {
      make: 'Ford',
      model: 'Focus',
      year: 2021,
      rentalPrice: 42
    };
    // Act
    const response = await request(app).put('/api/vehicles/FAKE123').send(update);
    // Assert
    expect(response.status).toBe(404);
    expect(response.body.error).toMatch(/Vehicle not found/);
  });

  it('TI-011 - DELETE /api/vehicles/:registrationNumber - suppression inexistante', async () => {
    // Arrange
    // Aucun véhicule avec registrationNumber=NONEXIST123
    // Act
    const response = await request(app).delete('/api/vehicles/NONEXIST123');
    // Assert
    expect(response.status).toBe(404);
    expect(response.body.error).toMatch(/Vehicle not found/);
  });

  it('TI-012 - GET avec base indisponible', async () => {
    // Arrange
    // Simulation d'une base indisponible (non implémentée ici)
    // Act
    // Assert
    expect(true).toBe(true); // À remplacer par un mock si nécessaire
  });
});