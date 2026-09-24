import { useState } from 'react';
import type { Task, TaskSummary, TaskCategory, TaskStatus } from '../types/task';
import { 
  LayoutGrid, 
  SlidersHorizontal, 
  BarChart2, 
  Calendar, 
  Settings, 
  Trash2, 
  BookOpen, 
  User, 
  X,
  Plus,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  ListTodo
} from 'lucide-react';

interface TimelineViewProps {
  tasks: Task[];
  summary: TaskSummary | null;
  selectedCategory: TaskCategory | 'ALL';
  selectedStatus: TaskStatus | 'ALL';
  onCategoryChange: (category: TaskCategory | 'ALL') => void;
  onStatusFilterChange: (status: TaskStatus | 'ALL') => void;
  onStatusChange: (id: string, status: TaskStatus) => void;
  onDelete: (id: string) => void;
  onOpenModal: () => void;
}

// Função para agrupar as tarefas dinamicamente de acordo com a data limite (dueDate) ou criação (createdAt)
function groupTasksByDate(tasks: Task[]) {
  const groups: Record<string, Task[]> = {};

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  tasks.forEach((task) => {
    // Utiliza dueDate se existir, senão usa createdAt
    const dateValue = task.dueDate || task.createdAt;
    if (!dateValue) {
      const label = 'Sem Data';
      if (!groups[label]) groups[label] = [];
      groups[label].push(task);
      return;
    }

    const taskDate = new Date(dateValue);
    taskDate.setHours(0, 0, 0, 0);

    let label = '';
    if (taskDate.getTime() === today.getTime()) {
      label = 'Hoje';
    } else if (taskDate.getTime() === tomorrow.getTime()) {
      label = 'Amanhã';
    } else if (taskDate.getTime() === yesterday.getTime()) {
      label = 'Ontem';
    } else {
      label = taskDate.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    }

    if (!groups[label]) {
      groups[label] = [];
    }
    groups[label].push(task);
  });

  return Object.entries(groups).map(([title, items]) => ({ title, items }));
}

export function TimelineView({
  tasks,
  summary,
  selectedCategory,
  selectedStatus,
  onCategoryChange,
  onStatusFilterChange,
  onStatusChange,
  onDelete,
  onOpenModal,
}: TimelineViewProps) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Agrupamento dinâmico baseado na data real
  const activeGroups = groupTasksByDate(tasks);

  const activeTask = tasks.find((t) => t.id === selectedTask?.id) || selectedTask;

  const summaryCards = [
    { title: 'Total', value: summary?.total ?? 0, icon: ListTodo, color: 'text-stone-700' },
    { title: 'A Fazer', value: summary?.byStatus.todo ?? 0, icon: AlertCircle, color: 'text-amber-600' },
    { title: 'Em Progresso', value: summary?.byStatus.inProgress ?? 0, icon: Clock, color: 'text-blue-600' },
    { title: 'Concluídas', value: summary?.byStatus.done ?? 0, icon: CheckCircle2, color: 'text-emerald-600' },
  ];

  return (
    <div className="flex h-screen w-full bg-[#e3e3e0] p-4 text-[#2c2c2c] font-sans antialiased select-none">
      {/* Container Principal */}
      <div className="flex w-full h-full bg-[#f6f6f4] rounded-[28px] shadow-sm overflow-hidden border border-[#e8e8e5] relative">
        
        {/* Sidebar Esquerda Minimalista */}
        <aside className="w-16 flex flex-col items-center py-6 border-r border-[#eaeaea] bg-[#f9f9f8] justify-between hidden sm:flex">
          <div className="flex flex-col items-center gap-6">
            <button className="w-9 h-9 rounded-xl flex items-center justify-center text-stone-400 hover:text-stone-700 transition-all cursor-pointer">
              <LayoutGrid className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 rounded-xl bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] flex items-center justify-center text-stone-900 font-medium cursor-pointer">
              <SlidersHorizontal className="w-5 h-5" />
            </button>
            <button className="w-9 h-9 rounded-xl flex items-center justify-center text-stone-400 hover:text-stone-700 transition-all cursor-pointer">
              <BarChart2 className="w-5 h-5" />
            </button>
            <button className="w-9 h-9 rounded-xl flex items-center justify-center text-stone-400 hover:text-stone-700 transition-all cursor-pointer">
              <Calendar className="w-5 h-5" />
            </button>
          </div>

          <button className="w-9 h-9 rounded-xl flex items-center justify-center text-stone-400 hover:text-stone-700 transition-all cursor-pointer">
            <Settings className="w-5 h-5" />
          </button>
        </aside>

        {/* Área Principal de Conteúdo */}
        <div className="flex-1 flex flex-col overflow-y-auto relative">
          {/* Header Superior */}
          <header className="px-8 py-5 border-b border-[#ececec] flex items-center justify-between sticky top-0 bg-[#f6f6f4]/90 backdrop-blur-md z-30">
            <div className="flex items-center gap-3">
              <div className="bg-stone-900 text-white w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm shadow-xs">
                T
              </div>
              <h1 className="text-xl font-bold tracking-tight text-stone-800">
                Painel de Tarefas
              </h1>
            </div>

            <button
              onClick={onOpenModal}
              className="flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold px-4 py-2.5 rounded-2xl transition-all shadow-xs active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Nova Tarefa
            </button>
          </header>

          <main className="p-8 space-y-8 max-w-5xl w-full mx-auto">
            {/* Cartões de Métricas */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {summaryCards.map((card) => {
                const Icon = card.icon;
                return (
                  <div
                    key={card.title}
                    className="bg-white/80 border border-stone-200/80 rounded-2xl p-4 flex items-center justify-between shadow-xs"
                  >
                    <div>
                      <p className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">{card.title}</p>
                      <p className="text-xl font-bold text-stone-800 mt-0.5">{card.value}</p>
                    </div>
                    <Icon className={`w-5 h-5 ${card.color}`} />
                  </div>
                );
              })}
            </div>

            {/* Filtros da Lista */}
            <div className="flex items-center justify-between border-t border-[#ececec] pt-4">
              <h2 className="text-sm font-semibold text-stone-700">Linha do Tempo</h2>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 bg-white border border-stone-200 rounded-xl px-2.5 py-1 text-xs text-stone-400">
                  <Filter className="w-3 h-3" />
                </div>

                <select
                  value={selectedCategory}
                  onChange={(e) => onCategoryChange(e.target.value as TaskCategory | 'ALL')}
                  className="bg-white border border-stone-200 text-stone-700 text-xs rounded-xl px-2.5 py-1 focus:outline-none focus:border-stone-400 cursor-pointer"
                >
                  <option value="ALL">Todas as Categorias</option>
                  <option value="ACADEMIC">Académico</option>
                  <option value="PERSONAL">Pessoal</option>
                </select>

                <select
                  value={selectedStatus}
                  onChange={(e) => onStatusFilterChange(e.target.value as TaskStatus | 'ALL')}
                  className="bg-white border border-stone-200 text-stone-700 text-xs rounded-xl px-2.5 py-1 focus:outline-none focus:border-stone-400 cursor-pointer"
                >
                  <option value="ALL">Todos os Status</option>
                  <option value="TODO">A Fazer</option>
                  <option value="IN_PROGRESS">Em Progresso</option>
                  <option value="DONE">Concluído</option>
                </select>
              </div>
            </div>

            {/* Lista da Linha do Tempo Dinâmica */}
            <div className="space-y-8 max-w-2xl relative pl-2">
              {activeGroups.length > 0 && (
                <div className="absolute left-[13px] top-4 bottom-4 w-[1.5px] bg-stone-200/70 pointer-events-none" />
              )}

              {activeGroups.length === 0 ? (
                <div className="py-12 text-center text-stone-400 text-sm">
                  Nenhuma tarefa registrada até o momento.
                </div>
              ) : (
                activeGroups.map((group) => (
                  <div key={group.title} className="space-y-3 relative">
                    <div className="flex items-center gap-4">
                      <div className="w-2.5 h-2.5 rounded-full bg-stone-300 z-10 border-2 border-[#f6f6f4]" />
                      <h3 className="text-sm font-semibold text-stone-800">{group.title}</h3>
                    </div>

                    <div className="pl-6 space-y-1">
                      {group.items.map((task) => {
                        const isSelected = selectedTask?.id === task.id;
                        return (
                          <div
                            key={task.id}
                            onClick={() => setSelectedTask(isSelected ? null : task)}
                            className={`group relative flex items-center gap-3 px-3.5 py-2.5 rounded-2xl transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-[#eaeaea]/80 text-stone-900 font-medium shadow-xs'
                                : 'text-stone-500 hover:text-stone-800 hover:bg-[#eaeaea]/40'
                            }`}
                          >
                            <div
                              className={`w-2 h-2 rounded-full transition-all ${
                                isSelected
                                  ? 'bg-[#ff007f] scale-125 shadow-[0_0_8px_#ff007f]'
                                  : 'bg-stone-300 group-hover:bg-stone-400'
                              }`}
                            />
                            <span className={`text-sm tracking-tight ${task.status === 'DONE' ? 'line-through text-stone-400' : ''}`}>
                              {task.title}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>
          </main>
        </div>

        {/* Caixa Flutuante do Canto Direito ao Clicar */}
        {activeTask && (
          <aside className="absolute right-8 top-24 z-40 w-80 animate-in fade-in slide-in-from-right-4 duration-200">
            <div className="bg-white border border-stone-200/80 rounded-3xl p-5 shadow-xl relative border-l-4 border-l-emerald-500">
              <button
                onClick={() => setSelectedTask(null)}
                className="absolute top-3 right-3 text-stone-300 hover:text-stone-600 p-1 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-between pr-6">
                <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full bg-purple-50 text-purple-600 border border-purple-100">
                  {activeTask.category === 'ACADEMIC' ? (
                    <>
                      <BookOpen className="w-3 h-3" /> Acadêmico
                    </>
                  ) : (
                    <>
                      <User className="w-3 h-3" /> Pessoal
                    </>
                  )}
                </span>

                <button
                  onClick={() => {
                    onDelete(activeTask.id);
                    setSelectedTask(null);
                  }}
                  className="text-stone-300 hover:text-red-500 transition-colors p-1 cursor-pointer"
                  title="Eliminar Tarefa"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <h3 className={`font-semibold text-stone-800 text-base mt-3 ${activeTask.status === 'DONE' ? 'line-through text-stone-400' : ''}`}>
                {activeTask.title}
              </h3>

              {activeTask.description && (
                <p className="text-xs text-stone-400 mt-1 line-clamp-3">
                  {activeTask.description}
                </p>
              )}

              <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between">
                <span className="text-xs text-stone-400 font-medium">Status:</span>
                <select
                  value={activeTask.status}
                  onChange={(e) => onStatusChange(activeTask.id, e.target.value as TaskStatus)}
                  className="bg-stone-50 border border-stone-200 text-stone-700 text-xs font-medium rounded-xl px-3 py-1.5 focus:outline-none focus:border-stone-400 cursor-pointer"
                >
                  <option value="TODO">A Fazer</option>
                  <option value="IN_PROGRESS">Em Progresso</option>
                  <option value="DONE">Concluído</option>
                </select>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}