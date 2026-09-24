import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '../../app';
import { prisma } from '../../lib/prisma';

describe('Suíte de Testes da API de Tarefas', () => {
  // Antes de rodar os testes, limpamos a tabela de tarefas
  beforeAll(async () => {
    await prisma.task.deleteMany();
  });

  // Ao finalizar todos os testes, desconectamos o cliente do Prisma
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('GET /health - Deve retornar status 200 e conexão com banco ok', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: 'ok',
      database: 'connected',
    });
  });

  it('POST /tasks - Deve criar uma nova tarefa com sucesso', async () => {
    const newTask = {
      title: 'Aprender a escrever testes com Vitest',
      description: 'Criar testes de integração para o CRUD de tarefas.',
      category: 'ACADEMIC',
      status: 'IN_PROGRESS',
    };

    const response = await request(app).post('/tasks').send(newTask);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.title).toBe(newTask.title);
    expect(response.body.category).toBe('ACADEMIC');
    expect(response.body.status).toBe('IN_PROGRESS');
  });

  it('POST /tasks - Deve rejeitar uma tarefa sem título (validação do Zod)', async () => {
    const invalidTask = {
      title: '   ', // Título composto apenas por espaços
      category: 'PERSONAL',
    };

    const response = await request(app).post('/tasks').send(invalidTask);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Erro de validação');
  });

  it('GET /tasks - Deve retornar a lista de tarefas cadastradas', async () => {
    const response = await request(app).get('/tasks');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('GET /tasks/summary - Deve calcular e retornar as métricas do dashboard', async () => {
    const response = await request(app).get('/tasks/summary');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('total');
    expect(response.body).toHaveProperty('byStatus');
    expect(response.body).toHaveProperty('byCategory');
    expect(response.body.total).toBeGreaterThan(0);
  });
});