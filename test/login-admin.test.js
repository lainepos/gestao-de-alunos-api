import request from 'supertest';
import { expect } from 'chai';
import mongoose from 'mongoose';
import app from '../src/app.js';
import { loginAdmin, loginUsuario } from './helpers/auth.helpers.js';
import testData from './data/test-data.json' with { type: 'json' };

describe('login Admin', () => {
  it('deve retornar 200 e um token quando o admin informar e-mail e senha corretos', async () => {
    const resposta = await loginAdmin();

    expect(resposta.status).to.equal(200);
    expect(resposta.body).to.have.property('token');
  });

  it('deve retornar 200 e um token quando o usuário informar e-mail e senha corretos', async () => {
    const resposta = await loginUsuario();

    expect(resposta.status).to.equal(200);
    expect(resposta.body).to.have.property('token');
  });

  it('deve retornar 401 quando a senha informada for inválida', async () => {
    const resposta = await request(app)
      .post('/api/auth/login')
      .send({ email: process.env.ADMIN_EMAIL, senha: testData.login.senhaInvalida });

    expect(resposta.status).to.equal(401);
    expect(resposta.body.error).to.equal('E-mail ou senha inválidos.');
  });

  it('deve retornar 400 quando o e-mail não for informado', async () => {
    const resposta = await request(app)
      .post('/api/auth/login')
      .send({ senha: process.env.ADMIN_PASSWORD });

    expect(resposta.status).to.equal(400);
    expect(resposta.body.error).to.equal('Os campos "email" e "senha" são obrigatórios.');
  });

  it('deve retornar 401 quando o e-mail não estiver cadastrado', async () => {
    const resposta = await request(app)
      .post('/api/auth/login')
      .send({ email: testData.login.emailInexistente, senha: process.env.ADMIN_PASSWORD });

    expect(resposta.status).to.equal(401);
    expect(resposta.body.error).to.equal('E-mail ou senha inválidos.');
  });
});
