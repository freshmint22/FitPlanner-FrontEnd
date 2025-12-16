// src/pages/MembershipsPage.tsx
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/useAuth';
import axiosClient from '@/api/axiosClient';
import PaymentModal from '@/components/PaymentModal';
import ConfirmModal from '@/components/ConfirmModal';

type Membership = {
  name?: string;
  price?: number | string;
  duration?: number | string;
  endDate?: string;
  status?: string;
};

type Plan = {
  id: number;
  name: string;
  price: string;
  description: string;
  perks: string[];
  tag?: "Popular" | "Actual";
};

type Payment = {
  id: number;
  date: string;
  invoice: string;
  amount: string;
  status: "Pagado" | "Pendiente";
};

type CurrentPlan = {
  name: string;
  price: string;
  daysLeft: number;
  totalDays: number;
  nextPayment: string;
  paymentMethod: string;
  status: string;
};

const MembershipsPage = () => {
  const { user } = useAuth();
  const [currentPlan, setCurrentPlan] = useState<CurrentPlan>({
    name: "Sin membresía",
    price: "$0",
    daysLeft: 0,
    totalDays: 0,
    nextPayment: "N/A",
    paymentMethod: "N/A",
    status: "Inactivo",
  });

  const [availablePlans, setAvailablePlans] = useState<Plan[]>([]);
  const [paymentsHistory, setPaymentsHistory] = useState<Payment[]>([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlanToPurchase, setSelectedPlanToPurchase] = useState<any | null>(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showRequireCancelConfirm, setShowRequireCancelConfirm] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const memb = user?.membership as Membership | undefined | null;
        if (memb && (memb.endDate || memb.duration)) {
          const endDate = memb.endDate ? new Date(memb.endDate) : null;
          const today = new Date();
          const totalDays = Number(memb.duration) || 30;
          const daysLeft = endDate ? Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)) : Math.max(0, totalDays);
          const priceNumber = Number(memb.price) || 0;

          setCurrentPlan({
            name: memb.name || "Sin plan",
            price: `$${priceNumber.toLocaleString()} / mes`,
            daysLeft: Math.max(0, daysLeft),
            totalDays,
            nextPayment: endDate ? endDate.toLocaleDateString() : "N/A",
            paymentMethod: "•••• ****",
            status: (endDate && daysLeft > 0) || memb.status === 'active' ? "Activo" : "Vencido",
          });
        } else {
          setCurrentPlan({
            name: "Sin membresía",
            price: "$0",
            daysLeft: 0,
            totalDays: 0,
            nextPayment: "N/A",
            paymentMethod: "N/A",
            status: "Inactivo",
          });
        }

        const plansRes = await axiosClient.get('/plans/activos').catch(() => ({ data: [] }));
        if (plansRes.data && plansRes.data.length > 0) {
          setAvailablePlans(plansRes.data);
        } else {
          setAvailablePlans([
            {
              id: 1,
              name: "Plan Básico",
              price: "$50.000 / mes",
              description: "Acceso general al gimnasio por 30 días.",
              perks: [
                "Acceso a zona de pesas",
                "Acceso a máquinas cardiovasculares",
                "Horario de 6:00 a 22:00",
                "1 rutina personalizada al mes",
              ],
            },
            {
              id: 2,
              name: "Plan Premium",
              price: "$80.000 / mes",
              description: "Plan mensual más popular para usuarios frecuentes.",
              perks: [
                "Todo lo incluido en Básico",
                "Acceso a todas las clases grupales",
                "Acceso 24/7",
                "2 rutinas personalizadas al mes",
                "Evaluación física mensual",
              ],
              tag: user?.membership?.name === "Plan Premium" ? "Actual" : "Popular",
            },
            {
              id: 3,
              name: "Plan Semestral",
              price: "$150.000",
              description: "Paga 6 meses y ahorra (180 días de acceso).",
              perks: [
                "Todo lo incluido en Premium",
                "Ahorro considerable vs plan mensual",
                "Acceso por 6 meses completos",
                "Evaluaciones trimestrales",
              ],
              tag: user?.membership?.name === "Plan Semestral" ? "Actual" : undefined,
            },
          ]);
        }

        const paymentsRes = await axiosClient.get('/pagos').catch(() => ({ data: { data: [] } }));
        const payments = (paymentsRes.data && paymentsRes.data.data) || [];
        if (payments && payments.length > 0) {
          setPaymentsHistory(payments.map((p: any, idx: number) => {
            const dateStr = (p.date as string) || new Date().toISOString();
            const amountNum = Number(p.amount) || 0;
            return {
              id: idx + 1,
              date: new Date(dateStr).toLocaleDateString(),
              invoice: `#INV-${new Date(dateStr).getFullYear()}-${String(idx + 1).padStart(3, '0')}`,
              amount: `$${amountNum.toLocaleString()}`,
              status: "Pagado",
            } as Payment;
          }));
        }
      } catch (error) {
        console.error('Error fetching memberships data:', error);
      }
    };

    fetchData();
  }, [user]);

  const progressPercent =
    currentPlan.totalDays > 0 ? (currentPlan.daysLeft / currentPlan.totalDays) * 100 : 0;

  const handlePaymentConfirm = async (result: any) => {
    try {
      // if result comes from server (updated user), use it
      let userResult = result;
      if (result && result.purchaseResult) userResult = result.purchaseResult;

      if (userResult && userResult.membership) {
        const m = userResult.membership;
        const daysLeft = m.endDate ? Math.max(0, Math.ceil((new Date(m.endDate).getTime() - Date.now()) / (1000*60*60*24))) : (m.duration || 0);
        setCurrentPlan({
          name: m.name || selectedPlanToPurchase?.name || 'Plan',
          price: m.price ? `$${Number(m.price).toLocaleString()}` : (selectedPlanToPurchase?.price || '$0'),
          daysLeft,
          totalDays: m.duration || selectedPlanToPurchase?.durationDays || 30,
          nextPayment: m.endDate ? new Date(m.endDate).toLocaleDateString() : 'N/A',
          paymentMethod: m.paymentMethod || '•••• ****',
          status: 'Activo',
        });

        setAvailablePlans(prev => prev.map(p => ({ ...p, tag: (selectedPlanToPurchase && p.id === selectedPlanToPurchase.id) ? 'Actual' : undefined })));

        // Refresh payments from backend to ensure canonical history (persisted in Mongo)
        try {
          const paymentsRes = await axiosClient.get('/pagos').catch(() => ({ data: { data: [] } }));
          const payments = (paymentsRes.data && paymentsRes.data.data) || [];
          if (payments.length > 0) {
            setPaymentsHistory(payments.map((p: any, idx: number) => ({ id: idx + 1, date: new Date(p.date).toLocaleDateString(), invoice: `#INV-${new Date(p.date).getFullYear()}-${String(idx + 1).padStart(3, '0')}`, amount: `$${Number(p.amount).toLocaleString()}`, status: 'Pagado', planName: p.planName || m.name, method: p.method || 'Simulado' })));
          } else {
            const newPayment = { id: paymentsHistory.length + 1, date: new Date().toLocaleDateString(), invoice: `#INV-${new Date().getFullYear()}-${String(paymentsHistory.length + 1).padStart(3,'0')}`, amount: (m.price ? `$${Number(m.price).toLocaleString()}` : (selectedPlanToPurchase?.price || '$0')), status: 'Pagado', planName: m.name, method: m.paymentMethod || 'Simulado' };
            setPaymentsHistory(prev => [newPayment, ...prev]);
          }
        } catch (e) {
          const newPayment = { id: paymentsHistory.length + 1, date: new Date().toLocaleDateString(), invoice: `#INV-${new Date().getFullYear()}-${String(paymentsHistory.length + 1).padStart(3,'0')}`, amount: (m.price ? `$${Number(m.price).toLocaleString()}` : (selectedPlanToPurchase?.price || '$0')), status: 'Pagado', planName: m.name, method: m.paymentMethod || 'Simulado' };
          setPaymentsHistory(prev => [newPayment, ...prev]);
        }
        try {
          // persist updated user in localStorage so membership survives reload
          if (typeof window !== 'undefined' && userResult) {
            localStorage.setItem('user', JSON.stringify(userResult));
          }
        } catch (e) {
          console.warn('Failed to persist user to localStorage', e);
        }
      } else if (result && result.name) {
        // fallback local behavior
        const plan = result as any;
        const duration = plan.durationDays || (plan.id === 3 ? 180 : 30);
        const today = new Date();
        const end = new Date(today.getTime() + duration * 24 * 60 * 60 * 1000);
        const cp = { name: plan.name, price: plan.price, daysLeft: duration, totalDays: duration, nextPayment: end.toLocaleDateString(), paymentMethod: 'N/A', status: 'Activo' };
        setCurrentPlan(cp);
        const newPayment = { id: paymentsHistory.length + 1, date: new Date().toLocaleDateString(), invoice: `#INV-${new Date().getFullYear()}-${String(paymentsHistory.length + 1).padStart(3,'0')}`, amount: plan.price, status: 'Pagado', planName: plan.name, method: 'Simulado' };
        setPaymentsHistory(prev => [newPayment, ...prev]);
        try {
          if (typeof window !== 'undefined') {
            const fakeUser = Object.assign({}, user || {}, { membership: { name: plan.name, price: plan.price, duration: duration, endDate: end.toISOString() } });
            localStorage.setItem('user', JSON.stringify(fakeUser));
          }
        } catch (e) {
          console.warn('Failed to persist fake user to localStorage', e);
        }
      }
    } catch (err) {
      console.warn('Failed to confirm payment', err);
    } finally {
      setShowPaymentModal(false);
      setSelectedPlanToPurchase(null);
    }
  };

  const downloadReceipt = (payment: any) => {
    const html = `
      <html>
        <head>
          <title>Recibo ${payment.invoice}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; }
            .header { display:flex; justify-content:space-between; align-items:center; }
            .box { border:1px solid #e5e7eb; padding:16px; border-radius:8px; margin-top:12px; }
            .big { font-size:20px; font-weight:700; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h2>FitPlanner - Recibo de pago</h2>
              <div>${new Date(payment.date).toLocaleString()}</div>
            </div>
            <div>
              <strong>${payment.invoice}</strong>
            </div>
          </div>
          <div class="box">
            <div class="big">${payment.planName || 'Membresía'}</div>
            <div>Metodo: ${payment.method || ''}</div>
            <div>Monto: ${payment.amount}</div>
            <div>Estado: ${payment.status}</div>
          </div>
        </body>
      </html>
    `;

    const w = window.open('', '_blank');
    if (!w) return;
    w.document.write(html);
    w.document.close();
    // Give the window a moment to render, then trigger print (user can save as PDF)
    setTimeout(() => { w.focus(); w.print(); }, 300);
  };

  const cancelMembership = async () => {
    try {
      const res = await axiosClient.post('/plans/cancel');
      const user = res?.data?.data;
      if (user && !user.membership) {
        setCurrentPlan({ name: 'Sin membresía', price: '$0', daysLeft: 0, totalDays: 0, nextPayment: 'N/A', paymentMethod: 'N/A', status: 'Inactivo' });
        setAvailablePlans(prev => prev.map(p => ({ ...p, tag: undefined })));
        try {
          if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('user');
            if (stored) {
              const parsed = JSON.parse(stored);
              delete parsed.membership;
              localStorage.setItem('user', JSON.stringify(parsed));
            }
          }
        } catch (e) {
          console.warn('Failed to update localStorage after cancel', e);
        }
        // Refresh payments list from backend so history remains intact and canonical
        try {
          const paymentsRes = await axiosClient.get('/pagos').catch(() => ({ data: { data: [] } }));
          const payments = (paymentsRes.data && paymentsRes.data.data) || [];
          if (payments && payments.length > 0) {
            setPaymentsHistory(payments.map((p: any, idx: number) => ({ id: idx + 1, date: new Date(p.date).toLocaleDateString(), invoice: `#INV-${new Date(p.date).getFullYear()}-${String(idx + 1).padStart(3, '0')}`, amount: `$${Number(p.amount).toLocaleString()}`, status: 'Pagado', planName: p.planName || '', method: p.method || '' })));
          }
        } catch (e) {
          console.warn('Failed to refresh payments after cancel', e);
        }
      }
    } catch (e) {
      console.warn('Failed to cancel membership', e);
    } finally {
      setShowCancelConfirm(false);
      setShowRequireCancelConfirm(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 page-fade-in">
      {/* HEADER PRINCIPAL */}
      <header className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-500">
          Mi gimnasio
        </p>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
          Mi Membresía
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Gestiona tu plan actual, cambios de membresía y tu historial de pagos.
        </p>
      </header>

      

      {/* PLAN ACTUAL */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/40 dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-black/30">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
          Plan actual
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400">
          Detalles de tu membresía activa.
        </p>

        <div className="mt-4 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6 dark:border-slate-800 dark:bg-slate-950/80">
          {/* Lado izquierdo */}
          <div className="space-y-3">
            <div>
              <p className="text-xs font-semibold uppercase text-slate-600 dark:text-slate-500">
                Plan actual
              </p>
              <div className="mt-1 flex flex-wrap items-baseline gap-2">
                <p className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                  {currentPlan.name}
                </p>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {currentPlan.price}
                </p>
              </div>
            </div>

            {/* Barra de progreso */}
            <div>
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Días restantes</span>
                <span className="font-semibold text-slate-200">
                  {currentPlan.daysLeft} de {currentPlan.totalDays} días
                </span>
              </div>
              <div className="mt-1.5 h-1.5 w-full rounded-full bg-slate-800">
                <div
                  className="h-1.5 rounded-full bg-sky-500"
                  style={{ width: `${Math.max(0, Math.min(100, progressPercent))}%` }}
                />
              </div>
            </div>

            {/* Próximo pago */}
            <div className="grid gap-2 text-xs text-slate-300 sm:grid-cols-1">
              <div>
                <p className="text-[11px] text-slate-500">Próximo pago</p>
                <p className="font-semibold">{currentPlan.nextPayment}</p>
              </div>
            </div>
          </div>

          {/* Lado derecho */}
          <div className="flex flex-col items-end gap-3">
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${currentPlan.status === 'Activo' ? 'bg-emerald-500/10 text-emerald-300' : 'bg-red-500/10 text-red-400'}`}>
              <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${currentPlan.status === 'Activo' ? 'bg-emerald-400' : 'bg-red-400'}`} />
              {currentPlan.status}
            </span>
            <button onClick={() => setShowCancelConfirm(true)} className="w-full rounded-lg border border-red-300 bg-white px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 sm:w-auto dark:border-red-700/80 dark:bg-slate-900/80 dark:text-red-400 dark:hover:bg-slate-800">
              Cancelar plan
            </button>
          </div>
        </div>
      </section>

      

      {showCancelConfirm && (
        <ConfirmModal
          title="Cancelar membresía"
          description="¿Estás seguro que quieres cancelar tu membresía? Esto la desactivará inmediatamente."
          confirmText="Sí, cancelar"
          cancelText="Volver"
          onConfirm={cancelMembership}
          onCancel={() => setShowCancelConfirm(false)}
        />
      )}

      {showRequireCancelConfirm && (
        <ConfirmModal
          title="Debes cancelar tu membresía antes"
          description="Para comprar un nuevo plan debes primero cancelar tu membresía actual."
          confirmText="OK"
          single
          onConfirm={() => setShowRequireCancelConfirm(false)}
          onCancel={() => setShowRequireCancelConfirm(false)}
        />
      )}

      {/* PLANES DISPONIBLES */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/40 dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-black/30">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
              Planes disponibles
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Cambia tu membresía según tus necesidades.
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {availablePlans.map((plan) => {
            const isCurrent = plan.tag === "Actual";

            return (
              <div
                key={plan.id}
                className={`relative flex h-full flex-col rounded-2xl border bg-white p-4 shadow-md shadow-slate-200/50 dark:bg-slate-950 dark:shadow-black/30 ${
                  isCurrent
                    ? "border-sky-500/70 ring-1 ring-sky-500/40 dark:border-sky-500/70 dark:ring-1 dark:ring-sky-500/40"
                    : "border-slate-200 dark:border-slate-800"
                }`}
              >
                {/* Chips */}
                <div className="mb-2 flex gap-2 text-[11px]">
                  {plan.tag === "Popular" && (
                    <span className="rounded-full bg-teal-500/10 px-2 py-0.5 font-semibold text-teal-300">
                      Popular
                    </span>
                  )}
                  {plan.tag === "Actual" && (
                    <span className="rounded-full bg-slate-600/10 px-2 py-0.5 font-semibold text-slate-200">
                      Plan actual
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <p className="text-base font-semibold text-slate-900 dark:text-slate-50">
                    {plan.name}
                  </p>
                  <p className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                    {plan.price}
                  </p>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">
                    {plan.description}
                  </p>
                </div>

                <ul className="mt-3 space-y-1.5 text-[11px] text-slate-600 dark:text-slate-300">
                  {plan.perks.map((perk) => (
                    <li key={perk} className="flex items-start gap-2">
                      <span className="mt-[3px] h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      <span>{perk}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-4 flex-1" />

                <button
                  onClick={() => {
                    if (isCurrent) return;
                    const raw = plan as any;
                    if (!raw.durationDays && raw.id && typeof raw.id === 'number') raw.durationDays = raw.id === 3 ? 180 : 30;
                    // If user currently has an active membership, require cancellation first
                    if (currentPlan.status === 'Activo') {
                      setSelectedPlanToPurchase(raw);
                      setShowRequireCancelConfirm(true);
                      return;
                    }
                    // open payment modal - pass raw plan object so backend id (_id) is preserved when available
                    setSelectedPlanToPurchase(raw);
                    setShowPaymentModal(true);
                  }}
                  className={`mt-3 w-full ${
                    isCurrent
                      ? "rounded-2xl px-4 py-2 text-xs font-semibold bg-slate-700 text-slate-200"
                      : "rounded-2xl px-4 py-2 text-xs font-semibold bg-gradient-to-r from-blue-500 to-emerald-400 text-white shadow-md hover:from-blue-600 hover:to-emerald-500"
                  }`}
                >
                  {isCurrent ? "Plan actual" : plan.name}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {showPaymentModal && (
        <PaymentModal plan={selectedPlanToPurchase} onClose={() => { setShowPaymentModal(false); setSelectedPlanToPurchase(null); }} onConfirm={handlePaymentConfirm} />
      )}

      {/* HISTORIAL DE PAGOS */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/40 dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-black/30">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
          Historial de pagos
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400">
          Tus últimos pagos realizados por la membresía.
        </p>

        <div className="mt-4 space-y-3">
          {paymentsHistory.map((payment) => (
            <div
              key={payment.id}
              className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 dark:border-slate-800 dark:bg-slate-950/80 dark:text-slate-100"
            >
              <div className="space-y-0.5">
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {payment.date}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-500">
                  {payment.invoice}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                  {payment.amount}
                </span>
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                  {payment.status}
                </span>
                <button
                  onClick={() => downloadReceipt(payment)}
                  className="rounded-md bg-gradient-to-r from-blue-500 to-emerald-400 px-3 py-1.5 text-sm font-semibold text-white hover:from-blue-600 hover:to-emerald-500"
                  title="Descargar recibo"
                >
                  Descargar recibo
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default MembershipsPage;
