import request from 'supertest';
import { expect } from 'chai';
import mongoose from 'mongoose';
import app from '../src/app.js';
import Aluno from '../src/models/aluno.model.js';
import { loginAdmin } from './helpers/auth.helpers.js';
import testData from './data/test-data.json' with { type: 'json' };

const dadosAluno = {
  ...testData.novoAluno,
  senha: process.env[testData.novoAluno.senhaEnv],
};

describe('cadastro de aluno', () => {
  afterEach(async () => {
    await Aluno.deleteOne({ email: dadosAluno.email });
  });

  it('deve retornar 201 quando o admin cadastrar um aluno', async () => {
    await Aluno.deleteOne({ email: dadosAluno.email });
    const login = await loginAdmin();

    const resposta = await request(app)
      .post('/api/admin/alunos')
      .set('Authorization', `Bearer ${login.body.token}`)
      .send({
        nome: dadosAluno.nome,
        email: dadosAluno.email,
        matricula: dadosAluno.matricula,
        senha: dadosAluno.senha,
      });

    expect(resposta.status).to.equal(201);
    expect(resposta.body).to.include({
      nome: dadosAluno.nome,
      email: dadosAluno.email,
      matricula: dadosAluno.matricula,
    });
    expect(resposta.body).to.not.have.property('senha');
  });

  it('deve retornar 401 quando o cadastro não tiver token de administrador', async () => {
    const resposta = await request(app)
      .post('/api/admin/alunos')
      .send({
        nome: dadosAluno.nome,
        email: dadosAluno.email,
        matricula: dadosAluno.matricula,
        senha: dadosAluno.senha,
      });

    expect(resposta.status).to.equal(401);
    expect(resposta.body.error).to.equal('Token de autenticação não informado.');
  });

  it('deve retornar 400 quando faltar um campo obrigatório', async () => {
    const login = await loginAdmin();
    const resposta = await request(app)
      .post('/api/admin/alunos')
      .set('Authorization', `Bearer ${login.body.token}`)
      .send({ nome: dadosAluno.nome, email: dadosAluno.email });

    expect(resposta.status).to.equal(400);
    expect(resposta.body.error).to.include('matricula');
  });

  it('deve retornar 409 quando o e-mail já estiver cadastrado', async () => {
    await Aluno.deleteOne({ email: dadosAluno.email });
    const login = await loginAdmin();
    const cadastro = {
      nome: dadosAluno.nome,
      email: dadosAluno.email,
      matricula: dadosAluno.matricula,
      senha: dadosAluno.senha,
    };

    await request(app)
      .post('/api/admin/alunos')
      .set('Authorization', `Bearer ${login.body.token}`)
      .send(cadastro);

    const resposta = await request(app)
      .post('/api/admin/alunos')
      .set('Authorization', `Bearer ${login.body.token}`)
      .send({ ...cadastro, matricula: '9999002' });

    expect(resposta.status).to.equal(409);
    expect(resposta.body.error).to.equal('Já existe um aluno cadastrado com essa matrícula ou e-mail.');
  });
});
