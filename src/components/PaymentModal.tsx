import React from 'react';
import { createPortal } from 'react-dom';

interface PlanSelection {
  id: number;
  name: string;
  price: string;
  durationDays?: number;
}

interface Props {
  plan: PlanSelection | null;
  onClose: () => void;
  onConfirm: (plan: PlanSelection) => void;
}

export default function PaymentModal({ plan, onClose, onConfirm }: Props) {
  if (!plan) return null;

  const [loading, setLoading] = React.useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    // simulate network/payment latency
    await new Promise((res) => setTimeout(res, 1200));
    setLoading(false);
    onConfirm(plan);
  };

  const modal = (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <h3 className="text-lg font-semibold">Simular pago</h3>
        <p className="mt-2 text-sm text-slate-600">Vas a pagar <span className="font-semibold">{plan.price}</span> por <span className="font-semibold">{plan.name}</span>.</p>
        <div className="mt-4">
          <label className="block text-xs text-slate-600">Número de tarjeta (simulado)</label>
          <input className="mt-1 w-full rounded-md border px-3 py-2" placeholder="4242 4242 4242 4242" />
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-md border px-3 py-2">Cancelar</button>
          <button onClick={handleConfirm} disabled={loading} className="rounded-md bg-sky-500 px-3 py-2 text-white">
            {loading ? 'Procesando...' : 'Pagar'}
          </button>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modal, document.body) : modal;
}
