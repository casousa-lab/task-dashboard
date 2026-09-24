import { useEffect, useState } from 'react';
import type { Task, TaskSummary, TaskCategory, TaskStatus, CreateTaskInput } from './types/task';
import { fetchTasks, fetchTaskSummary, createTask, updateTaskStatus, deleteTask } from './services/api';
import { SummaryCards } from './components/SummaryCards';
import { TaskCard } from './components/TaskCard';
import { TaskFormModal } from './components/TaskFormModal';
import { Plus, Filter } from 'lucide-react';

export function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [summary, setSummary] = useState<TaskSummary | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<TaskCategory | 'ALL'>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<TaskStatus | 'ALL'>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Função auxiliar para recarregar dados após ações do utilizador (criar/atualizar/apagar)
  const refreshData = async () => {
    try {
      const categoryFilter = selectedCategory === 'ALL' ? undefined : selectedCategory;
      const statusFilter = selectedStatus === 'ALL' ? undefined : selectedStatus;

      const [tasksData, summaryData] = await Promise.all([
        fetchTasks(categoryFilter, statusFilter),
        fetchTaskSummary(),
      ]);

      setTasks(tasksData);
      setSummary(summaryData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    async function loadInitialData() {
      try {
        const categoryFilter = selectedCategory === 'ALL' ? undefined : selectedCategory;
        const statusFilter = selectedStatus === 'ALL' ? undefined : selectedStatus;

        const [tasksData, summaryData] = await Promise.all([
          fetchTasks(categoryFilter, statusFilter),
          fetchTaskSummary(),
        ]);

        if (isMounted) {
          setTasks(tasksData);
          setSummary(summaryData);
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadInitialData();

    return () => {
      isMounted = false;
    };
  }, [selectedCategory, selectedStatus]);

  const handleCreateTask = async (data: CreateTaskInput) => {
    await createTask(data);
    await refreshData();
  };

  const handleStatusChange = async (id: string, status: TaskStatus) => {
    await updateTaskStatus(id, status);
    await refreshData();
  };

  const handleDeleteTask = async (id: string) => {
    if (confirm('Tem certeza de que deseja excluir esta tarefa?')) {
      await deleteTask(id);
      await refreshData();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased pb-12">
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/30">
              T
            </div>
            <h1 className="text-lg font-bold tracking-tight text-slate-100">
              Task Dashboard
            </h1>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-all shadow-md shadow-indigo-600/20 active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Nova Tarefa
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        <SummaryCards summary={summary} />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-800">
          <h2 className="text-xl font-bold text-slate-100">Minhas Tarefas</h2>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-400">
              <Filter className="w-3.5 h-3.5" />
              <span>Filtros:</span>
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as TaskCategory | 'ALL')}
              className="bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="ALL">Todas Categorias</option>
              <option value="ACADEMIC">Acadêmico</option>
              <option value="PERSONAL">Pessoal</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as TaskStatus | 'ALL')}
              className="bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="ALL">Todos Status</option>
              <option value="TODO">A Fazer</option>
              <option value="IN_PROGRESS">Em Progresso</option>
              <option value="DONE">Concluído</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-500">Carregando tarefas...</div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/40 border border-slate-800 rounded-2xl">
            <p className="text-slate-400 font-medium">Nenhuma tarefa encontrada.</p>
            <p className="text-xs text-slate-600 mt-1">Crie uma nova tarefa ou altere os filtros selecionados.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onStatusChange={handleStatusChange}
                onDelete={handleDeleteTask}
              />
            ))}
          </div>
        )}
      </main>

      <TaskFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateTask}
      />
    </div>
  );
}

export default App;