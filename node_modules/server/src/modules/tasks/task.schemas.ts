import { z } from 'zod';
import { TaskCategory, TaskStatus } from '@prisma/client';

export const createTaskSchema = z.object({
  title: z
    .string({ required_error: 'O título é obrigatório' })
    .trim()
    .min(1, 'O título não pode ficar em branco')
    .max(120, 'O título deve ter no máximo 120 caracteres'),
  description: z.string().trim().optional(),
  category: z.nativeEnum(TaskCategory, {
    errorMap: () => ({ message: 'Categoria inválida. Use ACADEMIC ou PERSONAL' }),
  }),
  status: z.nativeEnum(TaskStatus).optional().default(TaskStatus.TODO),
  dueDate: z
    .string()
    .transform((val) => new Date(val))
    .refine((date) => !isNaN(date.getTime()), { message: 'Data de vencimento inválida' })
    .optional(),
});

export const updateTaskSchema = createTaskSchema.partial();

export const queryTaskSchema = z.object({
  category: z.nativeEnum(TaskCategory).optional(),
  status: z.nativeEnum(TaskStatus).optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type QueryTaskInput = z.infer<typeof queryTaskSchema>;