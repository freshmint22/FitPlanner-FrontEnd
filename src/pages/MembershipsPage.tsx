// src/pages/MembershipsPage.tsx
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/useAuth';
import axiosClient from '@/api/axiosClient';
import PaymentModal from '@/components/PaymentModal';
import ConfirmModal from '@/components/ConfirmModal';
import { Modal } from '@/components/ui/Modal';

type Plan = {
  id: number;
  name: string;
  price: string;
  description: string;
  perks: string[];
  tag?: 'Popular' | 'Actual';
};

type Payment = {
  id: number;
  date: string;
  invoice: string;
  amount: string;
  status: 'Pagado' | 'Pendiente';
  planName?: string;
  method?: string;
};

type AdminPlan = {
  _id: string;
  nombre: string;
  precio: number;
  descripcion: string;
  beneficios: string[];
  estado: 'activo' | 'inactivo';
  popular?: boolean;
};

type AdminPayment = {
  _id: string;
  memberId: string;
  amount: number;
  date: string;
  planName?: string;
  method?: string;
  member?: {
    firstName?: string;
    lastName?: string;
    email?: string;
  } | null;
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
  const { user, refreshUser } = useAuth();
  const isAdmin = (user as any)?.role?.toUpperCase?.() === 'ADMIN' || (user as any)?.rol === 'ADMIN';

  const [currentPlan, setCurrentPlan] = useState<CurrentPlan>({
    name: 'Sin membresía',
    price: '$0',
    daysLeft: 0,
    totalDays: 0,
    nextPayment: 'N/A',
    paymentMethod: 'N/A',
    status: 'Inactivo',
  });

  const [availablePlans, setAvailablePlans] = useState<Plan[]>([]);
  const [paymentsHistory, setPaymentsHistory] = useState<Payment[]>([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlanToPurchase, setSelectedPlanToPurchase] = useState<any | null>(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showRequireCancelConfirm, setShowRequireCancelConfirm] = useState(false);

  const [adminPlans, setAdminPlans] = useState<AdminPlan[]>([]);
  const [adminPayments, setAdminPayments] = useState<AdminPayment[]>([]);
  const [editingPlan, setEditingPlan] = useState<AdminPlan | null>(null);
  const [planSaving, setPlanSaving] = useState(false);
  const [adminLoading, setAdminLoading] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<AdminPlan | null>(null);
  const [planDeleting, setPlanDeleting] = useState(false);
  const [planForm, setPlanForm] = useState({
    nombre: '',
    precio: 0,
    descripcion: '',
    beneficios: [''],
    estado: 'activo' as 'activo' | 'inactivo',
    popular: false,
  });

  const defaultAvailablePlans: Plan[] = [
    {
      id: 1,
      name: 'Plan mensual',
      price: '$50.000',
      description: 'Acceso ilimitado al gimnasio durante 30 días.',
      perks: ['Acceso total a zonas de cardio y fuerza', 'Clases grupales básicas', 'Soporte en recepción'],
      tag: 'Popular',
    },
    {
      id: 2,
      name: 'Plan bimensual',
      price: '$80.000',
      description: 'Dos meses de entrenamiento con precio preferencial.',
      perks: ['Acceso total', 'Clases grupales ilimitadas', 'Evaluación física inicial'],
    },
    {
      id: 3,
      name: 'Plan semestral',
      price: '$150.000',
      description: 'Seis meses con precio más conveniente.',
      perks: ['Acceso total', 'Clases premium', 'Asesoría personalizada mensual'],
    },
  ];

  const loadAdminData = async () => {
    if (!isAdmin) return;
    setAdminLoading(true);
    try {
      const [plansRes, paymentsRes] = await Promise.all([
        axiosClient.get('/plans').catch(() => ({ data: { data: [] } })),
        axiosClient.get('/pagos/admin').catch(() => ({ data: { data: [] } })),
      ]);

      const plans = plansRes?.data?.data || plansRes?.data || [];
      setAdminPlans(Array.isArray(plans) ? plans : []);

      const rawPayments =
        paymentsRes?.data?.data ?? paymentsRes?.data?.payments ?? paymentsRes?.data ?? [];
      setAdminPayments(Array.isArray(rawPayments) ? rawPayments : []);
    } catch (error) {
      console.error('Error cargando datos de admin', error);
    } finally {
      setAdminLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadAdminData();
      return;
    }

    const sortedDefaults = [...defaultAvailablePlans].sort((a, b) => {
      const toNumber = (p: Plan) => Number(String(p.price).replace(/[^0-9]/g, '')) || 0;
      return toNumber(a) - toNumber(b);
    });
    setAvailablePlans(sortedDefaults);

    if ((user as any)?.membership) {
      const m = (user as any).membership;
      const daysLeft = m.endDate
        ? Math.max(0, Math.ceil((new Date(m.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
        : m.duration || 0;
      setCurrentPlan({
        name: m.name || 'Plan',
        price: m.price ? `$${Number(m.price).toLocaleString()}` : '$0',
        daysLeft,
        totalDays: m.duration || 30,
        nextPayment: m.endDate ? new Date(m.endDate).toLocaleDateString() : 'N/A',
        paymentMethod: m.paymentMethod || '•••• ****',
        status: 'Activo',
      });
    } else {
      setCurrentPlan((prev) => ({ ...prev, name: 'Sin membresía', price: '$0', status: 'Inactivo' }));
    }

    axiosClient
      .get('/pagos')
      .then((paymentsRes) => {
        const payments = (paymentsRes?.data?.data || []).map((p: any, idx: number) => ({
          id: idx + 1,
          date: new Date(p.date).toLocaleDateString(),
          invoice: `#INV-${new Date(p.date).getFullYear()}-${String(idx + 1).padStart(3, '0')}`,
          amount: `$${Number(p.amount || 0).toLocaleString()}`,
          status: 'Pagado',
          planName: p.planName || '',
          method: p.method || '',
        }));
        if (payments.length) {
          setPaymentsHistory(payments);
        }
      })
      .catch(() => {});
  }, [isAdmin, user]);

  const renderAdminView = (): JSX.Element => {
    const sortedAdminPlans = [...adminPlans].sort((a, b) => (Number(a.precio) || 0) - (Number(b.precio) || 0));

    return (
      <div className="flex flex-col gap-6 page-fade-in">
        <header className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-500">
            Administración
          </p>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
            Membresías
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Edita precios, beneficios y consulta el historial de pagos global (Mongo).
          </p>
        </header>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/40 dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-black/30">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">Planes</h2>
              <p className="text-xs text-slate-600 dark:text-slate-400">Editar valores y características que ven los usuarios.</p>
            </div>
            {adminLoading && <span className="text-xs text-slate-500">Cargando...</span>}
          </div>

          {sortedAdminPlans.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 p-4 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-300">
              No hay planes en Mongo todavía.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-3">
              {sortedAdminPlans.map((plan) => (
                <div
                  key={plan._id}
                  className="flex h-full flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-base font-semibold text-slate-900 dark:text-slate-50">{plan.nombre}</p>
                      <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-300">
                        ${Number(plan.precio || 0).toLocaleString()} / mes
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">{plan.descripcion}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${plan.estado === 'activo' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300' : 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-300'}`}>
                        {plan.estado === 'activo' ? 'Activo' : 'Inactivo'}
                      </span>
                      {plan.popular && (
                        <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[11px] font-semibold text-sky-700 dark:bg-sky-500/10 dark:text-sky-300">
                          Popular
                        </span>
                      )}
                    </div>
                  </div>

                  <ul className="space-y-1.5 text-[11px] text-slate-600 dark:text-slate-300">
                    {plan.beneficios?.map((b) => (
                      <li key={b} className="flex items-start gap-2">
                        <span className="mt-[3px] h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto flex items-center justify-between gap-2 pt-2">
                    <button
                      onClick={() => openEditPlan(plan)}
                      className="flex-1 rounded-lg bg-gradient-to-r from-blue-500 to-emerald-400 px-3 py-1.5 text-xs font-semibold text-white shadow hover:from-blue-600 hover:to-emerald-500"
                    >
                      Editar plan
                    </button>
                    <button
                      onClick={() => requestDeletePlan(plan)}
                      className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 dark:border-red-500/40 dark:text-red-300 dark:hover:bg-red-500/10"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/40 dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-black/30">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
            Historial de pagos (todos)
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Pagos registrados en Mongo para cualquier miembro.
          </p>

          <div className="mt-4 space-y-3">
            {adminPayments.length === 0 && (
              <div className="rounded-xl border border-dashed border-slate-300 p-4 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-300">
                Aún no hay pagos registrados en la base de datos.
              </div>
            )}

            {adminPayments.map((payment) => (
              <div
                key={payment._id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 dark:border-slate-800 dark:bg-slate-950/80 dark:text-slate-100"
              >
                <div className="space-y-0.5">
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {new Date(payment.date).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-500">
                    {payment.member?.firstName || payment.member?.lastName ? `${payment.member?.firstName || ''} ${payment.member?.lastName || ''}`.trim() : 'Miembro' }
                    {payment.member?.email ? ` • ${payment.member.email}` : ''}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-500">
                    {payment.planName ? `Concepto: ${payment.planName}` : ''}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                    ${Number(payment.amount || 0).toLocaleString()}
                  </span>
                  <div className="flex flex-col items-end gap-1 text-[11px] text-slate-600 dark:text-slate-300">
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                      {payment.method || '—'}
                    </span>
                    {payment.member?.email && (
                      <span className="text-[11px] text-slate-500 dark:text-slate-500">Pago por: {payment.member.email}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  };

  const progressPercent =
    currentPlan.totalDays > 0 ? (currentPlan.daysLeft / currentPlan.totalDays) * 100 : 0;

  const handlePaymentConfirm = async (result: any) => {
    try {
      let userResult = result;
      if (result && result.purchaseResult) userResult = result.purchaseResult;

      if (userResult && userResult.membership) {
        const m = userResult.membership;
        const daysLeft = m.endDate ? Math.max(0, Math.ceil((new Date(m.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))) : (m.duration || 0);
        setCurrentPlan({
          name: m.name || selectedPlanToPurchase?.name || 'Plan',
          price: m.price ? `$${Number(m.price).toLocaleString()}` : (selectedPlanToPurchase?.price || '$0'),
          daysLeft,
          totalDays: m.duration || selectedPlanToPurchase?.durationDays || 30,
          nextPayment: m.endDate ? new Date(m.endDate).toLocaleDateString() : 'N/A',
          paymentMethod: m.paymentMethod || '•••• ****',
          status: 'Activo',
        });

        setAvailablePlans((prev) => prev.map((p) => ({ ...p, tag: (selectedPlanToPurchase && p.id === selectedPlanToPurchase.id) ? 'Actual' : undefined })));

        try {
          // Prefer authoritative server data: refresh payments and profile
          const [paymentsRes, profileRes] = await Promise.all([
            axiosClient.get('/pagos').catch(() => ({ data: { data: [] } })),
            axiosClient.get('/users/profile').catch(() => ({ data: null })),
          ]);

          const payments = (paymentsRes.data?.data || []) as any[];
          if (payments.length) {
            setPaymentsHistory(payments.map((p: any, idx: number) => ({ id: idx + 1, date: new Date(p.date).toLocaleDateString(), invoice: `#INV-${new Date(p.date).getFullYear()}-${String(idx + 1).padStart(3, '0')}`, amount: `$${Number(p.amount).toLocaleString()}`, status: 'Pagado', planName: p.planName || m.name, method: p.method || 'Simulado' })));
          } else {
            const newPayment: Payment = { id: paymentsHistory.length + 1, date: new Date().toLocaleDateString(), invoice: `#INV-${new Date().getFullYear()}-${String(paymentsHistory.length + 1).padStart(3,'0')}`, amount: (m.price ? `$${Number(m.price).toLocaleString()}` : (selectedPlanToPurchase?.price || '$0')), status: 'Pagado', planName: m.name, method: m.paymentMethod || 'Simulado' };
            setPaymentsHistory((prev) => [newPayment, ...prev]);
          }

          // If server returned a fresh profile, persist + update AuthContext via refreshUser
          if (profileRes?.data) {
            try {
              if (typeof window !== 'undefined') localStorage.setItem('user', JSON.stringify(profileRes.data.data || profileRes.data));
              refreshUser && refreshUser();
            } catch (e) {
              // ignore
            }
          }
        } catch (e) {
          const newPayment: Payment = { id: paymentsHistory.length + 1, date: new Date().toLocaleDateString(), invoice: `#INV-${new Date().getFullYear()}-${String(paymentsHistory.length + 1).padStart(3,'0')}`, amount: (m.price ? `$${Number(m.price).toLocaleString()}` : (selectedPlanToPurchase?.price || '$0')), status: 'Pagado', planName: m.name, method: m.paymentMethod || 'Simulado' };
          setPaymentsHistory((prev) => [newPayment, ...prev]);
        }
        try {
          if (typeof window !== 'undefined' && userResult) {
            localStorage.setItem('user', JSON.stringify(userResult));
            try {
              refreshUser && refreshUser();
            } catch {}
          }
        } catch (e) {
          console.warn('Failed to persist user to localStorage', e);
        }
      } else if (result && result.name) {
        const plan = result as any;
        const duration = plan.durationDays || (plan.id === 3 ? 180 : 30);
        const today = new Date();
        const end = new Date(today.getTime() + duration * 24 * 60 * 60 * 1000);
        const cp = { name: plan.name, price: plan.price, daysLeft: duration, totalDays: duration, nextPayment: end.toLocaleDateString(), paymentMethod: 'N/A', status: 'Activo' };
        setCurrentPlan(cp);
        const newPayment: Payment = { id: paymentsHistory.length + 1, date: new Date().toLocaleDateString(), invoice: `#INV-${new Date().getFullYear()}-${String(paymentsHistory.length + 1).padStart(3,'0')}`, amount: plan.price, status: 'Pagado', planName: plan.name, method: 'Simulado' };
        setPaymentsHistory((prev) => [newPayment, ...prev]);
        try {
          if (typeof window !== 'undefined') {
            const fakeUser = Object.assign({}, user || {}, { membership: { name: plan.name, price: plan.price, duration: duration, endDate: end.toISOString() } });
            localStorage.setItem('user', JSON.stringify(fakeUser));
            try {
              refreshUser && refreshUser();
            } catch {}
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
    setTimeout(() => { w.focus(); w.print(); }, 300);
  };

  const cancelMembership = async () => {
    try {
      const res = await axiosClient.post('/plans/cancel');
      const userResult = res?.data?.data;
      if (userResult && !userResult.membership) {
        setCurrentPlan({ name: 'Sin membresía', price: '$0', daysLeft: 0, totalDays: 0, nextPayment: 'N/A', paymentMethod: 'N/A', status: 'Inactivo' });
        setAvailablePlans((prev) => prev.map((p) => ({ ...p, tag: undefined })));
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

  const openEditPlan = (plan: AdminPlan) => {
    setEditingPlan(plan);
    setPlanForm({
      nombre: plan.nombre,
      precio: plan.precio,
      descripcion: plan.descripcion,
      beneficios: plan.beneficios?.length ? plan.beneficios : [''],
      estado: plan.estado,
      popular: Boolean(plan.popular),
    });
  };

  const handlePlanField = (field: keyof typeof planForm, value: any) => {
    setPlanForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleBeneficioChange = (idx: number, value: string) => {
    setPlanForm((prev) => {
      const next = [...prev.beneficios];
      next[idx] = value;
      return { ...prev, beneficios: next };
    });
  };

  const addBeneficio = () => {
    setPlanForm((prev) => ({ ...prev, beneficios: [...prev.beneficios, ''] }));
  };

  const removeBeneficio = (idx: number) => {
    setPlanForm((prev) => ({
      ...prev,
      beneficios: prev.beneficios.filter((_, i) => i !== idx),
    }));
  };

  const savePlanChanges = async () => {
    if (!editingPlan) return;

    const beneficios = planForm.beneficios.map((b) => b.trim()).filter(Boolean);
    if (!planForm.nombre.trim() || !planForm.descripcion.trim() || !beneficios.length) return;

    const payload = {
      nombre: planForm.nombre.trim(),
      descripcion: planForm.descripcion.trim(),
      precio: Number(planForm.precio) || 0,
      beneficios,
      estado: planForm.estado,
      popular: planForm.popular,
    };

    setPlanSaving(true);
    try {
      const res = await axiosClient.put(`/plans/${editingPlan._id}`, payload);
      const updated = res?.data?.data || res?.data || payload;
      setAdminPlans((prev) => prev.map((p) => (p._id === editingPlan._id ? { ...p, ...updated } : p)));
      setEditingPlan(null);
    } catch (error) {
      console.error('No se pudo actualizar el plan', error);
    } finally {
      setPlanSaving(false);
    }
  };

  const requestDeletePlan = (plan: AdminPlan) => {
    setPlanToDelete(plan);
  };

  const deletePlanConfirmed = async () => {
    if (!planToDelete) return;
    setPlanDeleting(true);
    try {
      await axiosClient.delete(`/plans/${planToDelete._id}`);
      setAdminPlans((prev) => prev.filter((p) => p._id !== planToDelete._id));
      setPlanToDelete(null);
    } catch (error) {
      console.error('No se pudo eliminar el plan', error);
    } finally {
      setPlanDeleting(false);
    }
  };

  if (isAdmin) {
    return (
      <>
        {renderAdminView()}

        {editingPlan && (
          <Modal isOpen={!!editingPlan} onClose={() => setEditingPlan(null)} title={`Editar plan: ${editingPlan?.nombre || ''}`}>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Nombre</label>
                  <input
                    value={planForm.nombre}
                    onChange={(e) => handlePlanField('nombre', e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/40"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Precio</label>
                  <input
                    type="number"
                    value={planForm.precio}
                    onChange={(e) => handlePlanField('precio', Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/40"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Descripción</label>
                <textarea
                  value={planForm.descripcion}
                  onChange={(e) => handlePlanField('descripcion', e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/40"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-slate-600">Beneficios</label>
                  <button type="button" onClick={addBeneficio} className="text-xs font-semibold text-emerald-600">+ Añadir</button>
                </div>
                <div className="space-y-2">
                  {planForm.beneficios.map((b, idx) => (
                    <div key={`${idx}-${b}`} className="flex items-center gap-2">
                      <input
                        value={b}
                        onChange={(e) => handleBeneficioChange(idx, e.target.value)}
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/40"
                      />
                      {planForm.beneficios.length > 1 && (
                        <button type="button" onClick={() => removeBeneficio(idx)} className="text-xs text-red-500 font-semibold">Eliminar</button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Estado</label>
                  <select
                    value={planForm.estado}
                    onChange={(e) => handlePlanField('estado', e.target.value as 'activo' | 'inactivo')}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/40"
                  >
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                  </select>
                </div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={planForm.popular}
                    onChange={(e) => handlePlanField('popular', e.target.checked)}
                  />
                  Marcar como popular
                </label>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingPlan(null)}
                  className="flex-1 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  disabled={planSaving}
                  onClick={savePlanChanges}
                  className="flex-1 rounded-lg bg-gradient-to-r from-emerald-500 to-sky-500 px-4 py-2 text-sm font-semibold text-white shadow disabled:opacity-60"
                >
                  {planSaving ? 'Guardando...' : 'Guardar cambios'}
                </button>
              </div>
            </div>
          </Modal>
        )}

        {planToDelete && (
          <ConfirmModal
            title="Eliminar plan"
            description={`¿Seguro que deseas eliminar el plan "${planToDelete.nombre}"? Esta acción no se puede deshacer.`}
            confirmText={planDeleting ? 'Eliminando...' : 'Sí, eliminar'}
            cancelText="Cancelar"
            onConfirm={deletePlanConfirmed}
            onCancel={() => setPlanToDelete(null)}
          />
        )}
      </>
    );
  }

  return (
    <div className="flex flex-col gap-6 page-fade-in">
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

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/40 dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-black/30">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
          Plan actual
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400">
          Detalles de tu membresía activa.
        </p>

        <div className="mt-4 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6 dark:border-slate-800 dark:bg-slate-950/80">
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

            <div className="grid gap-2 text-xs text-slate-300 sm:grid-cols-1">
              <div>
                <p className="text-[11px] text-slate-500">Próximo pago</p>
                <p className="font-semibold">{currentPlan.nextPayment}</p>
              </div>
            </div>
          </div>

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
            const isCurrent = plan.tag === 'Actual';

            return (
              <div
                key={plan.id}
                className={`relative flex h-full flex-col rounded-2xl border bg-white p-4 shadow-md shadow-slate-200/50 dark:bg-slate-950 dark:shadow-black/30 ${
                  isCurrent
                    ? 'border-sky-500/70 ring-1 ring-sky-500/40 dark:border-sky-500/70 dark:ring-1 dark:ring-sky-500/40'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="mb-2 flex gap-2 text-[11px]">
                  {plan.tag === 'Popular' && (
                    <span className="rounded-full bg-teal-500/10 px-2 py-0.5 font-semibold text-teal-300">
                      Popular
                    </span>
                  )}
                  {plan.tag === 'Actual' && (
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
                    if (currentPlan.status === 'Activo') {
                      setSelectedPlanToPurchase(raw);
                      setShowRequireCancelConfirm(true);
                      return;
                    }
                    setSelectedPlanToPurchase(raw);
                    setShowPaymentModal(true);
                  }}
                  className={`mt-3 w-full ${
                    isCurrent
                      ? 'rounded-2xl px-4 py-2 text-xs font-semibold bg-slate-700 text-slate-200'
                      : 'rounded-2xl px-4 py-2 text-xs font-semibold bg-gradient-to-r from-blue-500 to-emerald-400 text-white shadow-md hover:from-blue-600 hover:to-emerald-500'
                  }`}
                >
                  {isCurrent ? 'Plan actual' : plan.name}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {showPaymentModal && (
        <PaymentModal plan={selectedPlanToPurchase} onClose={() => { setShowPaymentModal(false); setSelectedPlanToPurchase(null); }} onConfirm={handlePaymentConfirm} />
      )}

      {planToDelete && (
        <ConfirmModal
          title="Eliminar plan"
          description={`¿Estás seguro de eliminar "${planToDelete?.nombre || ''}"?`}
          confirmText={planDeleting ? 'Eliminando...' : 'Sí, eliminar'}
          cancelText="Cancelar"
          onConfirm={deletePlanConfirmed}
          onCancel={() => setPlanToDelete(null)}
        />
      )}

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
