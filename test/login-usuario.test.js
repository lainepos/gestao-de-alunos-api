import request from 'supertest';
import { expect } from 'chai';
import mongoose from 'mongoose';
import app from '../src/app.js';
import { loginUsuario } from './helpers/auth.helpers.js';
import testData from './data/test-data.json' with { type: 'json' };

describe('login Usuário', () => {
  it('deve retornar 200 e um token quando o usuário informar e-mail e senha corretos', async () => {
    const resposta = await loginUsuario();

    expect(resposta.status).to.equal(200);
    expect(resposta.body).to.have.property('token');
    expect(resposta.body.usuario).to.include({
      id: testData.trabalho.alunoId,
      role: 'aluno',
    });
  });

  it('deve retornar 401 quando o usuário informar uma senha inválida', async () => {
    const resposta = await loginUsuario({ senha: testData.login.senhaInvalida });

    expect(resposta.status).to.equal(401);
    expect(resposta.body.error).to.equal('E-mail ou senha inválidos.');
  });

  it('deve retornar 400 quando o usuário não informar a senha', async () => {
    const resposta = await loginUsuario({ senha: undefined });

    expect(resposta.status).to.equal(400);
    expect(resposta.body.error).to.equal('Os campos "email" e "senha" são obrigatórios.');
  });
});
