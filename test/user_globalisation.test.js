import express from 'express';
import sqlite3 from 'sqlite3';
import userR from '../routes/userRoute.js';
import { describe, it, expect, beforeEach } from 'vitest';
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

describe("🌐 Globalisation", () => {
  const exoticUser = { name: '李小龙😊', password: '安全123' };

  it("doit me retourner un code 201 pour un utilisateur avec un nom UTF-8", async () => {
    const res = await request(app).post('/users').send(exoticUser);
    expect(res.statusCode).toBe(201);
  });

  it("doit me retourner un code 201 pour un utilisateur avec un nom et mot de passe Unicode", async () => {
    const res = await request(app).post('/users').send({ name: '李小龙😊', password: 'p@ßw0rd🌍' });
    if (res.statusCode !== 201) {
      console.log('Erreur:', res.body.error);
    }
    expect(res.statusCode).toBe(201);
  });
});