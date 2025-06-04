

import express from 'express';
import sqlite3 from 'sqlite3';
import userR from '../routes/userRoute.js';
import { describe, it,expect, beforeAll } from 'vitest';
import app from '../app.js';


import request from 'supertest';


const sqlite3 = require ('sqlite3').verbose();


app.use(express.json());
app.use('/users', userR);



  describe("\u{1F310} Globalisation", () => {
    const exoticUser = { name: '李小龙😊', password: '安全123' };
  
    it("doit me retourner un code 201 pour un utilisateur avec un nom UTF-8", async () => {
      const res = await request(app).post('/users').send(exoticUser);
      expect(res.statusCode).toBe(201);
    });
  
    it("doit me retourner un code 201 pour un utilisateur avec un nom et mot de passe Unicode", async () => {
      const res = await request(app).post('/users').send({ name: '李小龙😊', password: 'p@ßw0rd🌍' });
      expect(res.statusCode).toBe(201);
    });
  });
  