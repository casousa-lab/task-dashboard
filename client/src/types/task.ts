export type TaskCategory = 'ACADEMIC' | 'PERSONAL';
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

export interface Task {
  id: string;
  title: string;
  description?: string;
  category: TaskCategory;
  status: TaskStatus;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskSummary {
  total: number;
  byStatus: {
    todo: number;
    inProgress: number;
    done: number;
  };
  byCategory: {
    academic: number;
    personal: number;
  };
}

export type CreateTaskInput = {
  title: string;
  description?: string;
  category: TaskCategory;
  status?: TaskStatus;
  dueDate?: string;
};