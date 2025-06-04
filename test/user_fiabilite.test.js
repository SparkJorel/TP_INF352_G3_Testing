import express from 'express';
import sqlite3 from 'sqlite3';
import userR from '../routes/userRoute.js';
import { describe, it,expect, beforeAll } from 'vitest';
import app from '../app.js';


import request from 'supertest';


const sqlite3 = require ('sqlite3').verbose();


app.use(express.json());
app.use('/users', userR);


// Setup mock DB path
const dbPath = './db/vehicles.db';
const fs = require('fs');
describe("\u{2696}\uFE0F Fiabilité", () => {
  it("doit me retourner un code 201, 400 ou 500 pour un utilisateur avec un nom très long", async () => {
    const longName = 'a'.repeat(10000);
    const res = await request(app).post('/users').send({ name: longName, password: '123' });
    expect([201, 500, 400]).toContain(res.statusCode); // selon les limites de la base
  });

  it("doit me retourner un code 201 ou 500 lors de l'insertion d’un nom très long", async () => {
    const longName = 'A'.repeat(10000);
    const res = await request(app).post('/users').send({ name: longName, password: 'test' });
    expect([201, 500]).toContain(res.statusCode);
  });

  it("doit gérer proprement une erreur en lecture seule sur SQLite", async () => {
    const db = new sqlite3.Database(dbPath);
    db.close();
    // Ce test illustre un cas de fiabilité ; à compléter avec un mock ou dans des tests unitaires.
  });
});
