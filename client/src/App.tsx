import { useEffect, useState } from 'react';
import type { Task, TaskSummary, TaskCategory, TaskStatus, CreateTaskInput } from './types/task';
import { fetchTasks, fetchTaskSummary, createTask, updateTaskStatus, deleteTask } from './services/api';
import { TimelineView } from './components/TimelineView';
import { TaskFormModal } from './components/TaskFormModal';

export function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [summary, setSummary] = useState<TaskSummary | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<TaskCategory | 'ALL'>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<TaskStatus | 'ALL'>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Função para recarregar dados manualmente após interações do utilizador (criar/atualizar/apagar)
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
      console.error('Erro ao recarregar dados:', error);
    }
  };

  useEffect(() => {
    let isMounted = true;

    async function loadDataOnMount() {
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

    loadDataOnMount();

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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#e3e3e0] flex items-center justify-center text-stone-500 text-sm">
        Carregando Timeline...
      </div>
    );
  }

  return (
    <>
      <TimelineView
        tasks={tasks}
        summary={summary}
        selectedCategory={selectedCategory}
        selectedStatus={selectedStatus}
        onCategoryChange={setSelectedCategory}
        onStatusFilterChange={setSelectedStatus}
        onStatusChange={handleStatusChange}
        onDelete={handleDeleteTask}
        onOpenModal={() => setIsModalOpen(true)}
      />

      <TaskFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateTask}
      />
    </>
  );
}

export default App;