import type { TaskSummary } from '../types/task';
import { CheckCircle2, Clock, AlertCircle, ListTodo } from 'lucide-react';

interface SummaryCardsProps {
  summary: TaskSummary | null;
}

export function SummaryCards({ summary }: SummaryCardsProps) {
  const cards = [
    {
      title: 'Total de Tarefas',
      value: summary?.total ?? 0,
      icon: ListTodo,
      color: 'text-stone-700',
      bg: 'bg-stone-200/50',
    },
    {
      title: 'A Fazer',
      value: summary?.byStatus.todo ?? 0,
      icon: AlertCircle,
      color: 'text-amber-600',
      bg: 'bg-amber-100/60',
    },
    {
      title: 'Em Progresso',
      value: summary?.byStatus.inProgress ?? 0,
      icon: Clock,
      color: 'text-blue-600',
      bg: 'bg-blue-100/60',
    },
    {
      title: 'Concluídas',
      value: summary?.byStatus.done ?? 0,
      icon: CheckCircle2,
      color: 'text-emerald-600',
      bg: 'bg-emerald-100/60',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="bg-white/80 border border-stone-200/80 rounded-2xl p-5 flex items-center justify-between shadow-xs transition-all hover:shadow-md"
          >
            <div>
              <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider">{card.title}</p>
              <p className="text-2xl font-bold text-stone-800 mt-1">{card.value}</p>
            </div>
            <div className={`p-3 rounded-2xl ${card.bg}`}>
              <Icon className={`w-5 h-5 ${card.color}`} />
            </div>
          </div>
        );
      })}
    </div>
  );
}