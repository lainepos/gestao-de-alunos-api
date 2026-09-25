import request from 'supertest';
import app from '../../src/app.js';

export async function loginAdmin(overrides = {}) {
  const resposta = await request(app)
    .post('/api/auth/login')
    .send({
      email: process.env.ADMIN_EMAIL,
      senha: process.env.ADMIN_PASSWORD,
      ...overrides,
    });

  return resposta;
}

export async function loginUsuario(overrides = {}) {
  const resposta = await request(app)
    .post('/api/auth/login')
    .send({
      email: process.env.USER_EMAIL,
      senha: process.env.STUDENT_PASSWORD,
      ...overrides,
    });

  return resposta;
}
