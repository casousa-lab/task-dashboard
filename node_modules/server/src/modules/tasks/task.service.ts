import { prisma } from '../../lib/prisma';
import { CreateTaskInput, UpdateTaskInput, QueryTaskInput } from './task.schemas';

export class TaskService {
  async create(data: CreateTaskInput) {
    return prisma.task.create({ data });
  }

  async findAll(filters: QueryTaskInput) {
    return prisma.task.findMany({
      where: {
        category: filters.category,
        status: filters.status,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    return prisma.task.findUnique({ where: { id } });
  }

  async update(id: string, data: UpdateTaskInput) {
    return prisma.task.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.task.delete({ where: { id } });
  }

  async getSummary() {
    const [total, todo, inProgress, done, academic, personal] = await Promise.all([
      prisma.task.count(),
      prisma.task.count({ where: { status: 'TODO' } }),
      prisma.task.count({ where: { status: 'IN_PROGRESS' } }),
      prisma.task.count({ where: { status: 'DONE' } }),
      prisma.task.count({ where: { category: 'ACADEMIC' } }),
      prisma.task.count({ where: { category: 'PERSONAL' } }),
    ]);

    return {
      total,
      byStatus: { todo, inProgress, done },
      byCategory: { academic, personal },
    };
  }
}