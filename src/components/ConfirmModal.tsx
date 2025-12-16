import React from 'react';

interface Props {
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  single?: boolean;
}

export default function ConfirmModal({ title = 'Confirmar', description = '¿Estás seguro?', confirmText = 'Sí, eliminar', cancelText = 'Cancelar', onConfirm, onCancel, single = false }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative w-[90%] max-w-sm rounded-xl bg-white dark:bg-slate-900 p-6 shadow-lg border border-slate-200 dark:border-slate-800">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">{title}</h3>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{description}</p>
        <div className="mt-6 flex justify-end gap-3">
          {single ? (
            <div className="mx-auto">
              <button onClick={onConfirm} className="px-4 py-2 rounded-lg bg-teal-500 text-white">{confirmText}</button>
            </div>
          ) : (
            <>
              <button onClick={onCancel} className="px-3 py-2 rounded-lg border bg-white text-slate-700 dark:bg-slate-800 dark:text-slate-200">{cancelText}</button>
              <button onClick={onConfirm} className="px-3 py-2 rounded-lg bg-red-600 text-white">{confirmText}</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
