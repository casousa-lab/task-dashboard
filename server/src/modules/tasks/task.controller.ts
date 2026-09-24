import { Request, Response } from 'express';
import { TaskService } from './task.service';
import { createTaskSchema, updateTaskSchema, queryTaskSchema } from './task.schemas';

const taskService = new TaskService();

export class TaskController {
  async create(req: Request, res: Response) {
    const data = createTaskSchema.parse(req.body);
    const task = await taskService.create(data);
    return res.status(201).json(task);
  }

  async findAll(req: Request, res: Response) {
    const filters = queryTaskSchema.parse(req.query);
    const tasks = await taskService.findAll(filters);
    return res.status(200).json(tasks);
  }

  async findById(req: Request, res: Response) {
    const { id } = req.params;
    const task = await taskService.findById(id);

    if (!task) {
      return res.status(404).json({ error: 'Tarefa não encontrada' });
    }

    return res.status(200).json(task);
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const data = updateTaskSchema.parse(req.body);

    const exists = await taskService.findById(id);
    if (!exists) {
      return res.status(404).json({ error: 'Tarefa não encontrada' });
    }

    const updatedTask = await taskService.update(id, data);
    return res.status(200).json(updatedTask);
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;

    const exists = await taskService.findById(id);
    if (!exists) {
      return res.status(404).json({ error: 'Tarefa não encontrada' });
    }

    await taskService.delete(id);
    return res.status(204).send();
  }

  async getSummary(_req: Request, res: Response) {
    const summary = await taskService.getSummary();
    return res.status(200).json(summary);
  }
}