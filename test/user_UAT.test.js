import express from 'express';
import sqlite3 from 'sqlite3';
import userR from '../routes/userRoute.js';
import { describe, it,expect, beforeAll } from 'vitest';
import app from '../app.js';


import request from 'supertest';


const sqlite3 = require ('sqlite3').verbose();


app.use(express.json());
app.use('/users', userR);

describe("\u{1F4BC} UAT - Tests d'acceptation utilisateur", () => {
  const user = { name: `uat_${Date.now()}`, password: 'uatpass' };

  it("doit me retourner un code 200 après un cycle complet : création puis connexion", async () => {
    await request(app).post('/users').send(user);
    const res = await request(app).post('/users/login').send(user);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Login successful!');
  });

  it("doit me retourner une erreur 500 si l'on tente d'enregistrer un nom déjà utilisé", async () => {
    const user = { name: 'dupUser', password: '1234' };
    await request(app).post('/users').send(user);
    const duplicate = await request(app).post('/users').send(user);
    expect(duplicate.statusCode).toBe(500);
    expect(duplicate.body.error).toMatch(/Duplicate username/i);
  });
});
