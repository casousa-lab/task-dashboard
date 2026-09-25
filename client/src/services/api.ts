import type { Task, TaskSummary, CreateTaskInput, TaskCategory, TaskStatus } from '../types/task';

const API_BASE_URL = 'http://localhost:3000';

export async function fetchTasks(category?: TaskCategory, status?: TaskStatus): Promise<Task[]> {
  const params = new URLSearchParams();
  if (category) params.append('category', category);
  if (status) params.append('status', status);

  const response = await fetch(`${API_BASE_URL}/tasks?${params.toString()}`);
  if (!response.ok) throw new Error('Erro ao buscar tarefas');
  return response.json();
}

export async function fetchTaskSummary(): Promise<TaskSummary> {
  const response = await fetch(`${API_BASE_URL}/tasks/summary`);
  if (!response.ok) throw new Error('Erro ao buscar resumo das tarefas');
  return response.json();
}

export async function createTask(data: CreateTaskInput): Promise<Task> {
  const response = await fetch(`${API_BASE_URL}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Erro ao criar tarefa');
  return response.json();
}

export async function updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
  const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) throw new Error('Erro ao atualizar status da tarefa');
  return response.json();
}

export async function deleteTask(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Erro ao deletar tarefa');
}