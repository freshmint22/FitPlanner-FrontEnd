// src/components/modals/CreateMemberModal.tsx
import { useState } from 'react';
import { Modal } from '../ui/Modal';
import axiosClient from '@/api/axiosClient';

interface CreateMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateMemberModal({ isOpen, onClose, onSuccess }: CreateMemberModalProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    rol: 'user',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await axiosClient.post('/members', formData);
      onSuccess();
      onClose();
      // Resetear formulario
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        rol: 'user',
      });
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Error al crear el miembro');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Crear Nuevo Miembro">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Nombre
            </label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Apellido
            </label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
            Email
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
            Contraseña
          </label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            required
            minLength={6}
            placeholder="Mínimo 6 caracteres"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
            Rol
          </label>
          <select
            value={formData.rol}
            onChange={(e) => setFormData({ ...formData, rol: e.target.value })}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          >
            <option value="user">Usuario</option>
            <option value="admin">Administrador</option>
          </select>
        </div>

        <div className="flex gap-2 pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 rounded-lg bg-gradient-to-r from-green-600 to-emerald-400 px-4 py-2 text-sm font-semibold text-white shadow disabled:opacity-50"
          >
            {isLoading ? 'Creando...' : 'Crear Miembro'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
