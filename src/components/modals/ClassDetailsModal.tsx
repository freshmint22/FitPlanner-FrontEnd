import React from 'react';
import { createPortal } from 'react-dom';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  classData: {
    _id?: string;
    name: string;
    trainer?: string;
    room?: string | null;
    hour?: string | null;
    scheduleISO?: string | null;
    capacity?: number;
    reservations?: number;
    description?: string | null;
  } | null;
  reserved?: boolean;
  onReserve?: (id?: string) => Promise<void> | void;
  onCancelReserve?: (id?: string) => Promise<void> | void;
}

const weekdays = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];

export default function ClassDetailsModal({ isOpen, onClose, classData, reserved, onReserve, onCancelReserve }: Props) {
  if (!isOpen || !classData) return null;

  const { name, trainer, room, hour, scheduleISO, capacity, reservations, description } = classData;
  const dayLabel = scheduleISO ? weekdays[new Date(scheduleISO).getDay()] : '—';
  const hourLabel = hour || (scheduleISO ? new Date(scheduleISO).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '—');

  const content = (
    <div className="fixed inset-0 z-[9999] pointer-events-auto">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[10000] w-[720px] max-w-full rounded-2xl bg-white p-6 shadow-lg dark:bg-slate-900 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{name}</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Instructor: {trainer || 'No asignado'}</p>
          </div>
          <div className="ml-4 flex items-center gap-2">
            {reserved ? (
              <span className="rounded-full bg-blue-600 px-3 py-1 text-sm font-medium text-white">Reservado</span>
            ) : (
              <span className="rounded-full bg-emerald-500 px-3 py-1 text-sm font-medium text-white">Disponible</span>
            )}
            <button onClick={onClose} className="text-slate-500 hover:text-slate-700">✕</button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
            <p className="text-xs text-slate-500">Día</p>
            <p className="mt-1 font-medium text-slate-700 dark:text-slate-100">{dayLabel}</p>
          </div>
          <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
            <p className="text-xs text-slate-500">Hora</p>
            <p className="mt-1 font-medium text-slate-700 dark:text-slate-100">{hourLabel}</p>
          </div>
          <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
            <p className="text-xs text-slate-500">Ubicación</p>
            <p className="mt-1 font-medium text-slate-700 dark:text-slate-100">{room || 'Sala no especificada'}</p>
          </div>
          <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
            <p className="text-xs text-slate-500">Capacidad</p>
            <p className="mt-1 font-medium text-slate-700 dark:text-slate-100">{(reservations || 0)}/{capacity || 0}</p>
          </div>
        </div>

        <div className="mt-4 rounded-lg bg-slate-50 p-4 dark:bg-slate-800">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-100">Descripción</p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{description || 'Sin descripción disponible.'}</p>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Cerrar</button>
          {reserved ? (
            <button onClick={() => onCancelReserve && onCancelReserve(classData._id)} className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white">Cancelar Reserva</button>
          ) : (
            <button onClick={() => onReserve && onReserve(classData._id)} className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white">Reservar</button>
          )}
        </div>
      </div>
    </div>
  );

  // Render via portal to avoid clipping/stacking context issues
  if (typeof document !== 'undefined') return createPortal(content, document.body);
  return null;
}
