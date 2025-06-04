import express from 'express';
import sqlite3 from 'sqlite3';
import userR from '../routes/userRoute.js';
import { describe, it,expect, beforeAll } from 'vitest';
import app from '../app.js';


import request from 'supertest';


const sqlite3 = require ('sqlite3').verbose();


app.use(express.json());
app.use('/users', userR);


describe("\u{1F3C3}\u200D Performance simple", () => {
  const perfUser = { name: `perf_${Date.now()}`, password: 'fast' };

  it("doit me retourner une réponse à la création en moins de 150ms", async () => {
    const start = Date.now();
    await request(app).post('/users').send(perfUser);
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(150);
  });

  it("doit me retourner une réponse à la connexion en moins de 150ms", async () => {
    const user = { name: 'speedUser', password: '1234' };
    await request(app).post('/users').send(user);

    const start = Date.now();
    const res = await request(app).post('/users/login').send(user);
    const duration = Date.now() - start;

    expect(res.statusCode).toBe(200);
    expect(duration).toBeLessThan(150);
  });
});
