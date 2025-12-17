import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import axiosClient from '@/api/axiosClient';

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

    const [loading, setLoading] = useState(false);
    const [method, setMethod] = useState<'Tarjeta' | 'PSE' | 'Nequi' | ''>('');
  const [step, setStep] = useState<1 | 2>(1);
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [bank, setBank] = useState('');
  const [docNumber, setDocNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const handleConfirm = async () => {
    setError('');
    // basic validation depending on method
    if (!method) {
      setError('Selecciona un método de pago antes de continuar.');
      return;
    }
    if (method === 'Tarjeta') {
      if (!cardName || !cardNumber || !expiry || !cvv) {
        setError('Por favor completa todos los datos de la tarjeta.');
        return;
      }
    }
    if (method === 'PSE') {
      if (!bank || !docNumber) {
        setError('Por favor selecciona tu banco y escribe tu número de documento.');
        return;
      }
    }
    if (method === 'Nequi') {
      if (!phone) {
        setError('Por favor ingresa tu número de celular Nequi.');
        return;
      }
    }
    try {
      setLoading(true);
        const planId = (plan as any)._id || (plan as any).id || undefined;
        const numericPrice = String(plan.price).replace(/[^0-9]/g, '');
        const body = { planId, planName: plan.name, price: numericPrice, durationDays: plan.durationDays || (plan.id === 3 ? 180 : 30), method };
        const res = await axiosClient.post('/plans/purchase', body);
      setLoading(false);
      const result = res?.data?.data;
      // pass server result (updated member) to parent
        onConfirm(result || { id: plan.id, name: plan.name, price: plan.price, durationDays: plan.durationDays });
    } catch (err) {
      console.warn('Payment failed', err);
      setLoading(false);
        // fallback: return local result so UI can update locally
        onConfirm({ id: plan.id, name: plan.name, price: plan.price, durationDays: plan.durationDays });
    }
  };

  const modal = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-lg overflow-hidden max-h-[85vh] overflow-y-auto">
        {/* Header: show different header when on card step */}
        {step === 2 && method === 'Tarjeta' ? (
          <div className="-mx-6 mb-4 flex items-center justify-between rounded-t-lg bg-white p-3">
            <div className="w-10" />
            <div className="text-center flex-1">
              <div className="text-lg font-semibold text-slate-900">Datos de la Tarjeta</div>
              <div className="text-xs text-slate-500">Total a pagar: {plan.price}</div>
            </div>
            <div className="w-10" />
          </div>
        ) : (
          <div className="-mx-6 -mt-6 mb-4 rounded-t-lg bg-gradient-to-r from-teal-400 to-cyan-500 p-4 text-white">
            <h3 className="text-lg font-semibold">Pago - {plan.name}</h3>
          </div>
        )}
        <p className="mt-2 text-sm text-slate-600">Vas a pagar <span className="font-semibold">{plan.price}</span> por <span className="font-semibold">{plan.name}</span>.</p>
        {error && <div className="mt-3 rounded-md bg-red-50 border border-red-100 px-3 py-2 text-sm text-red-700">{error}</div>}
        {step === 1 && (
          <div className="mt-4 space-y-3">
                        <div className={`rounded-lg border p-3 ${method==='Tarjeta' ? 'ring-2 ring-teal-300' : ''}`} onClick={() => setMethod('Tarjeta')}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">Tarjeta de Crédito/Débito</div>
                  <div className="text-xs text-slate-500">Visa, Mastercard, American Express</div>
                </div>
                <div className="text-xs text-slate-500">{method==='Tarjeta' ? 'Seleccionado' : ''}</div>
                <span className="ml-3 inline-flex items-center rounded-full bg-blue-500 px-2 py-0.5 text-xs text-white">VISA</span>
              </div>
            </div>

                        <div className={`rounded-lg border p-3 ${method==='PSE' ? 'ring-2 ring-teal-300' : ''}`} onClick={() => setMethod('PSE')}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">PSE - Débito Bancario</div>
                  <div className="text-xs text-slate-500">Paga directo desde tu cuenta bancaria</div>
                </div>
                <span className="ml-3 inline-flex items-center rounded-full bg-emerald-500 px-2 py-0.5 text-xs text-white">PSE</span>
              </div>
            </div>

                        <div className={`rounded-lg border p-3 ${method==='Nequi' ? 'ring-2 ring-teal-300' : ''}`} onClick={() => setMethod('Nequi')}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">Nequi</div>
                  <div className="text-xs text-slate-500">Paga con tu cuenta Nequi</div>
                </div>
                <span className="ml-3 inline-flex items-center rounded-full bg-pink-500 px-2 py-0.5 text-xs text-white">NEQUI</span>
              </div>
            </div>
                        
            <div className="flex justify-end gap-2">
              <button onClick={onClose} className="rounded-md border px-3 py-2">Cancelar</button>
              <button onClick={() => { setError(''); setStep(2); }} disabled={!method} className={`rounded-md bg-gradient-to-r from-blue-500 to-emerald-400 px-4 py-2 text-white ${!method ? 'opacity-60 cursor-not-allowed' : ''}`}>Continuar</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="mt-4 space-y-4">
            {method === 'Tarjeta' && (
              <div>
                {/* Card mockup */}
                <div className="rounded-xl bg-gradient-to-r from-teal-400 to-cyan-500 text-white p-4 shadow-lg">
                  <div className="flex justify-between items-start">
                    <div className="h-6 w-10 rounded bg-yellow-400" />
                    <div className="text-sm opacity-60">●●●●</div>
                  </div>
                  <div className="mt-6 text-[18px] tracking-widest">•••• •••• •••• ••••</div>
                  <div className="mt-6 flex justify-between items-end text-xs opacity-80">
                    <div>
                      <div className="text-[10px] uppercase">Titular</div>
                      <div className="font-semibold">{cardName || 'NOMBRE APELLIDO'}</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase">Expira</div>
                      <div className="font-semibold">{expiry || 'MM/AA'}</div>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-xs text-slate-600">Nombre en la Tarjeta</label>
                  <input className="mt-1 w-full rounded-md border px-3 py-2" value={cardName} onChange={e => setCardName(e.target.value)} />

                  <label className="block text-xs text-slate-600 mt-3">Número de Tarjeta</label>
                  <input className="mt-1 w-full rounded-md border px-3 py-2" value={cardNumber} onChange={e => setCardNumber(e.target.value)} placeholder="4242 4242 4242 4242" />

                  <div className="mt-3 grid grid-cols-3 gap-3">
                    <input className="col-span-2 rounded-md border px-3 py-2" placeholder="MM/AA" value={expiry} onChange={e => setExpiry(e.target.value)} />
                    <input className="rounded-md border px-3 py-2" placeholder="CVV" value={cvv} onChange={e => setCvv(e.target.value)} />
                  </div>
                </div>
              </div>
            )}

            {method === 'PSE' && (
              <div>
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-800 mb-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 h-6 w-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">🏦</div>
                    <div>
                      <div className="font-semibold">Débito Bancario PSE</div>
                      <div className="text-xs mt-1 text-emerald-700">Serás redirigido al portal de tu banco para completar el pago</div>
                    </div>
                  </div>
                </div>

                <label className="block text-xs text-slate-600">Banco</label>
                <select className="mt-1 w-full rounded-md border px-3 py-2" value={bank} onChange={e => setBank(e.target.value)}>
                  <option value="">Selecciona tu banco</option>
                  <option>Bancolombia</option>
                  <option>Davivienda</option>
                  <option>Banco de Bogotá</option>
                  <option>BBVA</option>
                  <option>Banco Popular</option>
                  <option>Banco de Occidente</option>
                  <option>Scotiabank Colpatria</option>
                  <option>Colombia - Bancamía</option>
                  <option>Banco AV Villas</option>
                </select>

                <div className="mt-3 grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs text-slate-600">Tipo Doc.</label>
                    <select className="mt-1 w-full rounded-md border px-3 py-2" value={''} onChange={() => {}}>
                      <option>CC</option>
                      <option>CE</option>
                      <option>NIT</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs text-slate-600">Número de Documento</label>
                    <input className="mt-1 w-full rounded-md border px-3 py-2" value={docNumber} onChange={e => setDocNumber(e.target.value)} />
                  </div>
                </div>

                <label className="block text-xs text-slate-600 mt-3">Correo Electrónico</label>
                <input className="mt-1 w-full rounded-md border px-3 py-2" value={''} onChange={() => {}} placeholder="correo@ejemplo.com" />
              </div>
            )}

            {method === 'Nequi' && (
              <div>
                <div className="rounded-xl bg-gradient-to-r from-teal-400 to-cyan-500 text-white p-4 shadow-lg mb-4">
                  <div className="flex items-start">
                    <div>
                      <div className="text-sm font-semibold">Pago con Nequi</div>
                      <div className="text-xs opacity-90">Recibirás una notificación en tu app Nequi para aprobar el pago</div>
                    </div>
                  </div>
                </div>

                <label className="block text-xs text-slate-600">Número de celular Nequi</label>
                <input className="mt-1 w-full rounded-md border px-3 py-2" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+57 300 123 4567" />

                <div className="mt-4 rounded-md bg-slate-50 border border-slate-100 p-3 text-sm text-slate-700">
                  <div className="font-semibold mb-2">Pasos para completar el pago:</div>
                  <ol className="list-decimal list-inside text-sm space-y-1">
                    <li>Ingresa tu número de celular Nequi</li>
                    <li>Abre la notificación en tu app Nequi</li>
                    <li>Confirma el pago con tu clave</li>
                    <li>¡Listo! Tu pago será confirmado</li>
                  </ol>
                </div>
              </div>
            )}

            <div>
              <button onClick={() => setStep(1)} className="mb-3 inline-flex items-center gap-2 rounded-md border px-3 py-2">← Volver</button>
              <button onClick={handleConfirm} disabled={loading} className="w-full rounded-full bg-gradient-to-r from-teal-400 to-cyan-500 px-4 py-3 text-white font-semibold shadow-md">{loading ? 'Procesando...' : `Pagar ${plan.price}`}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modal, document.body) : modal;
}
