import type { Task, TaskStatus } from '../types/task';
import { Trash2, Calendar, BookOpen, User } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onStatusChange: (id: string, status: TaskStatus) => void;
  onDelete: (id: string) => void;
}

export function TaskCard({ task, onStatusChange, onDelete }: TaskCardProps) {
  const statusColors = {
    TODO: 'border-l-amber-500 bg-amber-500/5',
    IN_PROGRESS: 'border-l-blue-500 bg-blue-500/5',
    DONE: 'border-l-emerald-500 bg-emerald-500/5 opacity-75',
  };

  const formattedDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
      })
    : null;

  return (
    <div
      className={`bg-slate-800/60 border border-slate-700/60 border-l-4 ${statusColors[task.status]} rounded-xl p-4 shadow-md transition-all hover:border-slate-600`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                task.category === 'ACADEMIC'
                  ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                  : 'bg-teal-500/10 text-teal-400 border border-teal-500/20'
              }`}
            >
              {task.category === 'ACADEMIC' ? (
                <>
                  <BookOpen className="w-3 h-3" /> Acadêmico
                </>
              ) : (
                <>
                  <User className="w-3 h-3" /> Pessoal
                </>
              )}
            </span>

            {formattedDate && (
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <Calendar className="w-3 h-3" /> {formattedDate}
              </span>
            )}
          </div>

          <h3
            className={`font-semibold text-slate-100 text-base ${
              task.status === 'DONE' ? 'line-through text-slate-400' : ''
            }`}
          >
            {task.title}
          </h3>

          {task.description && (
            <p className="text-xs text-slate-400 line-clamp-2 mt-1">{task.description}</p>
          )}
        </div>

        <button
          onClick={() => onDelete(task.id)}
          className="text-slate-500 hover:text-red-400 p-1 rounded transition-colors"
          title="Excluir Tarefa"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-700/40 flex items-center justify-between">
        <label className="text-xs text-slate-400 font-medium">Status:</label>
        <select
          value={task.status}
          onChange={(e) => onStatusChange(task.id, e.target.value as TaskStatus)}
          className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-2 py-1 focus:outline-none focus:border-indigo-500 cursor-pointer"
        >
          <option value="TODO">A Fazer</option>
          <option value="IN_PROGRESS">Em Progresso</option>
          <option value="DONE">Concluído</option>
        </select>
      </div>
    </div>
  );
}