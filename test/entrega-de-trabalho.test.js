import request from 'supertest';
import { expect } from 'chai';
import mongoose from 'mongoose';
import app from '../src/app.js';
import Trabalho from '../src/models/trabalho.model.js';
import { loginUsuario } from './helpers/auth.helpers.js';
import testData from './data/test-data.json' with { type: 'json' };

describe('entrega de trabalho', () => {
  afterEach(async () => {
    await Trabalho.deleteOne({ titulo: testData.trabalho.titulo });
  });

  it('deve retornar 201 quando o aluno registrar a entrega de um trabalho', async () => {
    await Trabalho.deleteOne({ titulo: testData.trabalho.titulo });
    const login = await loginUsuario();

    const resposta = await request(app)
      .post(`/api/alunos/${testData.trabalho.alunoId}/trabalhos`)
      .set('Authorization', `Bearer ${login.body.token}`)
      .send({
        disciplinaId: testData.trabalho.disciplinaId,
        titulo: testData.trabalho.titulo,
        descricao: testData.trabalho.descricao,
      });

    expect(resposta.status).to.equal(201);
    expect(resposta.body).to.include({
      alunoId: testData.trabalho.alunoId,
      disciplinaId: testData.trabalho.disciplinaId,
      titulo: testData.trabalho.titulo,
      status: 'entregue',
    });
  });

  it('deve retornar 401 quando a entrega não tiver token', async () => {
    const resposta = await request(app)
      .post(`/api/alunos/${testData.trabalho.alunoId}/trabalhos`)
      .send({
        disciplinaId: testData.trabalho.disciplinaId,
        titulo: testData.trabalho.titulo,
      });

    expect(resposta.status).to.equal(401);
    expect(resposta.body.error).to.equal('Token de autenticação não informado.');
  });

  it('deve retornar 400 quando o título não for informado', async () => {
    const login = await loginUsuario();
    const resposta = await request(app)
      .post(`/api/alunos/${testData.trabalho.alunoId}/trabalhos`)
      .set('Authorization', `Bearer ${login.body.token}`)
      .send({ disciplinaId: testData.trabalho.disciplinaId });

    expect(resposta.status).to.equal(400);
    expect(resposta.body.error).to.equal('Os campos "disciplinaId" e "titulo" são obrigatórios.');
  });

  it('deve retornar 409 quando o aluno não estiver matriculado na disciplina', async () => {
    const login = await loginUsuario();
    const resposta = await request(app)
      .post(`/api/alunos/${testData.trabalho.alunoId}/trabalhos`)
      .set('Authorization', `Bearer ${login.body.token}`)
      .send({
        disciplinaId: testData.trabalhoInvalido.disciplinaId,
        titulo: testData.trabalhoInvalido.titulo,
      });

    expect(resposta.status).to.equal(409);
    expect(resposta.body.error).to.equal('O aluno não está matriculado nesta disciplina.');
  });
});
