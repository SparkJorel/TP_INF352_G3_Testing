import express from 'express';
import sqlite3 from 'sqlite3';
import userR from '../routes/userRoute.js';
import { describe, it, expect, beforeEach } from 'vitest';
import bodyParser from 'body-parser';
import request from 'supertest';
import app from '../app.js';

const dbPath = './db/vehicles.db';

beforeEach(async () => {
  const db = new sqlite3.Database(dbPath);
  await new Promise((resolve, reject) => {
    db.run('DELETE FROM user', (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
  db.close();
});

app.use(express.json());
app.use('/users', userR);
userR.use(bodyParser.urlencoded({ extended: true }));
userR.use(bodyParser.json());

describe("🚀 Interopérabilité", () => {
  it("doit me retourner un code 200, 400 ou 401 pour une requête en x-www-form-urlencoded", async () => {
    const user = { name: 'test', password: 'test' };
    await request(app).post('/users').send(user); // Créer un utilisateur
    const res = await request(app)
      .post('/users/login')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send('name=test&password=test');
    if (![200, 401, 400].includes(res.statusCode)) {
      console.log('Erreur:', res.body.error);
    }
    expect([200, 401, 400]).toContain(res.statusCode);
  });

  it("doit me retourner un code 200 pour une connexion via x-www-form-urlencoded", async () => {
    const user = { name: 'curlUser', password: 'curlPass' };
    await request(app).post('/users').send(user);
    const res = await request(app)
      .post('/users/login')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send(`name=${user.name}&password=${user.password}`);
    if (res.statusCode !== 200) {
      console.log('Erreur:', res.body.error);
    }
    expect(res.statusCode).toBe(200);
  });
});