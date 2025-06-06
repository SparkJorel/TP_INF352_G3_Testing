import express from 'express';
import sqlite3 from 'sqlite3';
import userR from '../routes/userRoute.js';
import { describe, test,expect, beforeAll } from 'vitest';
import app from '../app.js';


import request from 'supertest';


const sqlite3 = require ('sqlite3').verbose();


app.use(express.json());
app.use('/users', userR);





describe("\u{1F4C8} Tests d'intégration", () => {
  const user = { name: `user_${Date.now()}`, password: 'test123' };
  let userId;

  test("doit me retourner un code 201 lors de la création d'un utilisateur", async () => {
    const res = await request(app).post('/users').send(user);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    userId = res.body.id;
  });

  test("doit me retourner un code 200 lors de la connexion avec les bonnes informations", async () => {
    const res = await request(app).post('/users/login').send(user);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Login successful!');
  });

  test("doit me retourner un code 401 lors de la connexion avec un mauvais mot de passe", async () => {
    const res = await request(app).post('/users/login').send({ name: user.name, password: 'badpass' });
    expect(res.statusCode).toBe(401);
  });

  test("doit me retourner un code 200 lors de la mise à jour d'un utilisateur existant", async () => {
    const res = await request(app).put(`/users/${userId}`).send({ name: user.name, password: 'newpass' });
    expect(res.statusCode).toBe(200);
  });

  test("doit me retourner un code 404 lors de la mise à jour d'un utilisateur inexistant", async () => {
    const res = await request(app).put('/users/99999').send(user);
    expect(res.statusCode).toBe(404);
  });

  test("doit me retourner un code 400 si le nom est manquant lors de la création", async () => {
    const res = await request(app).post('/users').send({ password: 'secret' });
    expect(res.statusCode).toBe(400);
  });

  test("doit me retourner les codes 201, 200, 200 pour la création, la connexion et la mise à jour d’un utilisateur", async () => {
    const user = { name: 'user1', password: '1234' };
    const createRes = await request(app).post('/users').send(user);
    expect(createRes.statusCode).toBe(201);

    const loginRes = await request(app).post('/users/login').send(user);
    expect(loginRes.statusCode).toBe(200);

    const updateRes = await request(app).put(`/users/${createRes.body.id}`).send({ name: 'updatedUser1', password: '4321' });
    expect(updateRes.statusCode).toBe(200);
  });
});










