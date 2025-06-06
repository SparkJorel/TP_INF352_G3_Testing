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


describe("\u{1F525} Smoke test", () => {
    it('POST /login retourne une r\u00e9ponse valide', async () => {
      const res = await request(app).post('/users/login').send({ name: 'x', password: 'x' });
      expect([200, 401]).toContain(res.statusCode);
    });
  });