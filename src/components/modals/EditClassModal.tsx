// src/components/modals/EditClassModal.tsx
import { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import axiosClient from '@/api/axiosClient';

interface Class {
  _id: string;
  name: string;
  level?: string;
  room?: string;
  hour?: string;
  trainer?: string;
  capacity?: number;
}

interface EditClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  classData: Class | null;
  onSuccess: () => void;
}

export function EditClassModal({ isOpen, onClose, classData, onSuccess }: EditClassModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    level: '',
    room: '',
    hour: '',
    trainer: '',
    capacity: 20,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (classData) {
      setFormData({
        name: classData.name || '',
        level: classData.level || '',
        room: classData.room || '',
        hour: classData.hour || '',
        trainer: classData.trainer || '',
        capacity: classData.capacity || 20,
      });
    }
  }, [classData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!classData) return;

    setIsLoading(true);
    setError('');

    try {
      await axiosClient.put(`/classes/${classData._id}`, formData);
      onSuccess();
      onClose();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Error al actualizar la clase');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!classData) return;
    if (!confirm('¿Estás seguro de eliminar esta clase?')) return;

    setIsLoading(true);
    setError('');

    try {
      await axiosClient.delete(`/classes/${classData._id}`);
      onSuccess();
      onClose();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Error al eliminar la clase');
    } finally {
      setIsLoading(false);
    }
  };

  if (!classData) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Editar Clase">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
            Nombre de la clase
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Nivel
            </label>
            <select
              value={formData.level}
              onChange={(e) => setFormData({ ...formData, level: e.target.value })}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            >
              <option value="">Seleccionar nivel</option>
              <option value="Principiante">Principiante</option>
              <option value="Intermedio">Intermedio</option>
              <option value="Avanzado">Avanzado</option>
              <option value="Todos los niveles">Todos los niveles</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Capacidad
            </label>
            <input
              type="number"
              min="1"
              max="50"
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Sala
            </label>
            <input
              type="text"
              value={formData.room}
              onChange={(e) => setFormData({ ...formData, room: e.target.value })}
              placeholder="Ej: Sala A, Spinning, etc."
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Horario
            </label>
            <input
              type="text"
              value={formData.hour}
              onChange={(e) => setFormData({ ...formData, hour: e.target.value })}
              placeholder="Ej: 10:00 - 11:00"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
            Entrenador
          </label>
          <input
            type="text"
            value={formData.trainer}
            onChange={(e) => setFormData({ ...formData, trainer: e.target.value })}
            placeholder="Nombre del entrenador"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          />
        </div>

        <div className="flex gap-2 pt-4">
          <button
            type="button"
            onClick={handleDelete}
            disabled={isLoading}
            className="flex-1 rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50 dark:border-red-800 dark:bg-slate-950 dark:text-red-400 dark:hover:bg-red-900/20"
          >
            Eliminar
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 rounded-lg bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400 px-4 py-2 text-sm font-semibold text-white shadow disabled:opacity-50"
          >
            {isLoading ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
