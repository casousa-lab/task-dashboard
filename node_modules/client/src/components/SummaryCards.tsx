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
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10',
    },
    {
      title: 'A Fazer',
      value: summary?.byStatus.todo ?? 0,
      icon: AlertCircle,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
    },
    {
      title: 'Em Progresso',
      value: summary?.byStatus.inProgress ?? 0,
      icon: Clock,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
    },
    {
      title: 'Concluídas',
      value: summary?.byStatus.done ?? 0,
      icon: CheckCircle2,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-5 flex items-center justify-between shadow-lg backdrop-blur-sm"
          >
            <div>
              <p className="text-sm font-medium text-slate-400">{card.title}</p>
              <p className="text-2xl font-bold text-slate-100 mt-1">{card.value}</p>
            </div>
            <div className={`p-3 rounded-xl ${card.bg}`}>
              <Icon className={`w-6 h-6 ${card.color}`} />
            </div>
          </div>
        );
      })}
    </div>
  );
}