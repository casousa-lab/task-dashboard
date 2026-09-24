import { Router } from 'express';
import { TaskController } from './task.controller';

export const taskRoutes = Router();
const controller = new TaskController();

taskRoutes.get('/summary', (req, res, next) => controller.getSummary(req, res).catch(next));
taskRoutes.post('/', (req, res, next) => controller.create(req, res).catch(next));
taskRoutes.get('/', (req, res, next) => controller.findAll(req, res).catch(next));
taskRoutes.get('/:id', (req, res, next) => controller.findById(req, res).catch(next));
taskRoutes.patch('/:id', (req, res, next) => controller.update(req, res).catch(next));
taskRoutes.delete('/:id', (req, res, next) => controller.delete(req, res).catch(next));