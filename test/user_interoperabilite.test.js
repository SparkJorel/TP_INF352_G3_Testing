
import express from 'express';
import sqlite3 from 'sqlite3';
import userR from '../routes/userRoute.js';
import { describe, it,expect, beforeAll } from 'vitest';
import app from '../app.js';
userR.use(bodyParser.urlencoded({ extended: true }));
userR.use(bodyParser.json());

import bodyParser from 'body-parser';
import request from 'supertest';


const sqlite3 = require ('sqlite3').verbose();


app.use(express.json());
app.use('/users', userR);

describe("\u{1F680} Interopérabilité", () => {
  it("doit me retourner un code 200, 400 ou 401 pour une requête en x-www-form-urlencoded", async () => {
    const res = await request(app)
      .post('/users/login')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send('name=test&password=test');
    expect([200, 401, 400]).toContain(res.statusCode);
  });

  it("doit me retourner un code 200 pour une connexion via x-www-form-urlencoded", async () => {
    const user = { name: 'curlUser', password: 'curlPass' };
    await request(app).post('/users').send(user);

    const res = await request(app)
      .post('/users/login')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send(`name=${user.name}&password=${user.password}`);

    expect(res.statusCode).toBe(200);
  });
});
