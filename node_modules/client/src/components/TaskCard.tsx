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
    DONE: 'border-l-emerald-500 bg-emerald-500/5 opacity-80',
  };

  const formattedDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
      })
    : null;

  return (
    <div
      className={`bg-white border border-stone-200/80 border-l-4 ${statusColors[task.status]} rounded-2xl p-4 shadow-xs transition-all hover:shadow-md flex flex-col justify-between`}
    >
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                task.category === 'ACADEMIC'
                  ? 'bg-purple-100 text-purple-700 border border-purple-200/60'
                  : 'bg-teal-100 text-teal-700 border border-teal-200/60'
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
              <span className="text-[11px] text-stone-400 flex items-center gap-1">
                <Calendar className="w-3 h-3" /> {formattedDate}
              </span>
            )}
          </div>

          <button
            onClick={() => onDelete(task.id)}
            className="text-stone-400 hover:text-red-500 p-1 rounded-lg transition-colors cursor-pointer"
            title="Excluir Tarefa"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <h3
          className={`font-semibold text-stone-800 text-base ${
            task.status === 'DONE' ? 'line-through text-stone-400' : ''
          }`}
        >
          {task.title}
        </h3>

        {task.description && (
          <p className="text-xs text-stone-500 line-clamp-2">{task.description}</p>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
        <label className="text-xs text-stone-400 font-medium">Status:</label>
        <select
          value={task.status}
          onChange={(e) => onStatusChange(task.id, e.target.value as TaskStatus)}
          className="bg-stone-100/80 border border-stone-200 text-stone-700 text-xs rounded-xl px-2.5 py-1 focus:outline-none focus:border-stone-400 cursor-pointer"
        >
          <option value="TODO">A Fazer</option>
          <option value="IN_PROGRESS">Em Progresso</option>
          <option value="DONE">Concluído</option>
        </select>
      </div>
    </div>
  );
}