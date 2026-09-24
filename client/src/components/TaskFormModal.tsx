import { useState } from 'react';
import type { CreateTaskInput, TaskCategory } from '../types/task';
import { X, PlusCircle } from 'lucide-react';

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTaskInput) => Promise<void>;
}

export function TaskFormModal({ isOpen, onClose, onSubmit }: TaskFormModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<TaskCategory>('ACADEMIC');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    try {
      await onSubmit({
        title,
        description: description.trim() || undefined,
        category,
        dueDate: dueDate || undefined,
      });
      setTitle('');
      setDescription('');
      setCategory('ACADEMIC');
      setDueDate('');
      onClose();
    } catch {
      alert('Erro ao salvar a tarefa. Verifique os dados fornecidos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/30 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-stone-200 w-full max-w-md rounded-3xl p-6 shadow-xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold text-stone-800 flex items-center gap-2">
          <PlusCircle className="w-5 h-5 text-stone-900" />
          Nova Tarefa
        </h2>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">
              Título *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Entregar trabalho da FATEC"
              className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-3.5 py-2.5 text-stone-800 placeholder-stone-400 focus:outline-none focus:border-stone-400 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">
              Descrição (opcional)
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Adicione observações ou detalhes..."
              className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-3.5 py-2.5 text-stone-800 placeholder-stone-400 focus:outline-none focus:border-stone-400 text-sm resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">
                Categoria
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TaskCategory)}
                className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-3.5 py-2.5 text-stone-800 focus:outline-none focus:border-stone-400 text-sm cursor-pointer"
              >
                <option value="ACADEMIC">Acadêmico</option>
                <option value="PERSONAL">Pessoal</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">
                Data Limite
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-3.5 py-2.5 text-stone-800 focus:outline-none focus:border-stone-400 text-sm"
              />
            </div>
          </div>

          <div className="pt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-2xl text-sm text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white font-medium text-sm rounded-2xl transition-all shadow-xs disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Salvando...' : 'Criar Tarefa'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}