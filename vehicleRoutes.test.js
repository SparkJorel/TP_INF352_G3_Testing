import request from 'supertest';
import app from './app'
import { response } from 'express';
import { beforeAll, describe, expect, it } from 'vitest';
import db from './db/database';


// Ajout d’un véhicule test avant les tests
beforeAll(() => {
    db.run(`
      INSERT OR REPLACE INTO vehicles 
      (registrationNumber, make, model, year, rentalPrice)
      VALUES ('TEST123', 'Peugeot', '308', 2021, 55)
    `);
});

describe('API /vehicles', () => {

    // cas de test pour Le Endpoint Get Vehicle

    it('Doit me retourner une liste de vehicules', async() => {
        const response = await request(app).get('/api/vehicles');


        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true); // Attend une liste
    });


    //Get by registration

    it('Doit me retourner un vehicule a partir de son numero d imatriculation', async() => {
        const responses = await request(app)
            .get('/api/vehicles/TEST123')

        expect(responses.status).toBe(200)
        expect(responses.body).toHaveProperty('registrationNumber', 'TEST123')
    });

    //===========================================================================

    // cas de test pour Le Endpoint Put Vehicle

    it('doit metre a jour un vehicule', async() => {
        const response = await request(app)
            .put('/api/vehicles/TEST123')
            .send({
                make: 'Toyota',
                model: 'Yaris',
                year: 2020,
                rentalPrice: 60,
            })
        expect(response.status).toBe(200)
        expect(response.body.message).toBe('Vehicle updated successfully.')
    });

    //===========================================================================

    // cas de test pour Le Endpoint Delete Vehicle

    it('Doit supprimer un enregistrement ', async() => {
        const responses = await request(app)
            .delete('/api/vehicles/TEST123')

        expect(responses.status).toBe(200)
        expect(responses.body.message).toMatch(/deleted/i)
    });

    //===========================================================================

    // cas de test pour Le Endpoint Post Vehicle

    describe('POST /api/vehicles', () => {
        it('Doit me creer un nouvel Enregistrement ', async() => {
            const newVehicle = {
                registrationNumber: 'AASE123',
                make: 'Renault',
                model: 'Clio',
                year: 2020,
                rentalPrice: 45
            };

            const response = await request(app)
                .post('/api/vehicles/')
                .send(newVehicle);

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('message');
            expect(response.body.message).toContain('created');
        });
    });

});