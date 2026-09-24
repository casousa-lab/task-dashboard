import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors'; // <--- Adicione esta importação
import { ZodError } from 'zod';
import { prisma } from './lib/prisma';
import { taskRoutes } from './modules/tasks/task.routes';

export const app = express();

app.use(express.json());
app.use(cors()); // <--- Habilite o CORS para todas as origens locais

// Rota de Health Check
app.get('/health', async (_req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return res.status(200).json({ status: 'ok', database: 'connected' });
  } catch (error) {
    return res.status(500).json({ status: 'error', database: 'disconnected' });
  }
});

// Rotas de Tarefas
app.use('/tasks', taskRoutes);

// Middleware global de erros
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: 'Erro de validação',
      issues: err.errors.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      })),
    });
  }

  console.error(err);
  return res.status(500).json({ error: 'Erro interno do servidor' });
});