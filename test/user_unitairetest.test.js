import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../app.js';

describe("📝 Tests unitaires simulés (extraits)", () => {
  function validateInput(name, password) {
    if (!name || !password) return false;
    return true;
  }

  it('Validation: nom ou mot de passe manquant', () => {
    expect(validateInput('', 'pass')).toBe(false);
    expect(validateInput('user', '')).toBe(false);
    expect(validateInput('user', 'pass')).toBe(true);
  });

  it('POST /users should return 400 if name is missing', async () => {
    const res = await request(app).post('/users').send({ password: 'abc' });
    expect(res.statusCode).toBe(400);
  });

  it('POST /users should return 400 if password is missing', async () => {
    const res = await request(app).post('/users').send({ name: 'Jean' });
    expect(res.statusCode).toBe(400);
  });
});
