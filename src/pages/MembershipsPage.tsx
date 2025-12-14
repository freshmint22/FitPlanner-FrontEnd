// src/pages/MembershipsPage.tsx
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { axiosClient } from '@/api/axiosClient';

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener membresía actual del usuario
        if (user?.membership) {
          const endDate = new Date(user.membership.endDate);
          const today = new Date();
          const daysLeft = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
          
          setCurrentPlan({
            name: user.membership.name || "Sin plan",
            price: `$${user.membership.price?.toLocaleString() || '0'} / mes`,
            daysLeft: Math.max(0, daysLeft),
            totalDays: user.membership.duration || 30,
            nextPayment: endDate.toLocaleDateString(),
            paymentMethod: "•••• ****",
            status: daysLeft > 0 ? "Activo" : "Vencido",
          });
        }

        // Obtener planes disponibles (desde API o usar defaults)
        const plansRes = await axiosClient.get('/plans').catch(() => ({ data: [] }));
        if (plansRes.data && plansRes.data.length > 0) {
          setAvailablePlans(plansRes.data);
        } else {
          // Planes por defecto (coinciden con seed.ts)
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
              price: "$270.000",
              description: "Paga 6 meses y ahorra (180 días de acceso).",
              perks: [
                "Todo lo incluido en Premium",
                "Ahorro considerable vs plan mensual",
                "Acceso por 6 meses completos",
                "Evaluaciones trimestrales",
              ],
              tag: user?.membership?.name === "Plan Semestral" ? "Actual" : undefined,
            },
            {
              id: 4,
              name: "Plan Anual",
              price: "$500.000",
              description: "Mejor valor - 365 días de acceso completo.",
              perks: [
                "Todo lo incluido en Premium",
                "Máximo ahorro anual",
                "Acceso por 1 año completo",
                "Plan nutricional personalizado",
                "Entrenador personal (1 sesión/mes)",
              ],
              tag: user?.membership?.name === "Plan Anual" ? "Actual" : undefined,
            },
          ]);
        }

        // Obtener historial de pagos
        const paymentsRes = await axiosClient.get('/payments').catch(() => ({ data: [] }));
        if (paymentsRes.data && paymentsRes.data.length > 0) {
          setPaymentsHistory(paymentsRes.data.map((p: Record<string, unknown>, idx: number) => ({
            id: idx + 1,
            date: new Date(p.date as string).toLocaleDateString(),
            invoice: `#INV-${new Date(p.date as string).getFullYear()}-${String(idx + 1).padStart(3, '0')}`,
            amount: `$${(p.amount as number)?.toLocaleString() || '0'}`,
            status: "Pagado",
          })));
        }
      } catch (error) {
        console.error('Error fetching memberships data:', error);
      } finally {
        // Loading complete
      }
    };

    fetchData();
  }, [user]);

  const progressPercent =
    (currentPlan.daysLeft / currentPlan.totalDays) * 100;

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
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Próximo pago */}
            <div className="grid gap-2 text-xs text-slate-300 sm:grid-cols-2">
              <div>
                <p className="text-[11px] text-slate-500">
                  Próximo pago
                </p>
                <p className="font-semibold">
                  {currentPlan.nextPayment}
                </p>
              </div>
              <div>
                <p className="text-[11px] text-slate-500">
                  Método de pago
                </p>
                <p className="font-semibold">
                  {currentPlan.paymentMethod}
                </p>
              </div>
            </div>
          </div>

          {/* Lado derecho */}
          <div className="flex flex-col items-end gap-3">
            <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
              <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-400" />
              {currentPlan.status}
            </span>

            <button className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 hover:bg-slate-50 sm:w-auto dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800">
              Cambiar método de pago
            </button>
            <button className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 sm:w-auto dark:border-slate-700/80 dark:bg-slate-900/80 dark:text-slate-300 dark:hover:bg-slate-800">
              Cancelar plan
            </button>
          </div>
        </div>
      </section>

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
                    <span className="rounded-full bg-sky-500/10 px-2 py-0.5 font-semibold text-sky-300">
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
                  className={`mt-3 w-full rounded-lg px-3 py-1.5 text-xs font-semibold ${
                    isCurrent
                      ? "bg-slate-700 text-slate-200"
                      : "bg-sky-500 text-white hover:bg-sky-400"
                  }`}
                >
                  {isCurrent ? "Plan actual" : `Cambiar a ${plan.name}`}
                </button>
              </div>
            );
          })}
        </div>
      </section>

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
                  className="rounded-full border border-slate-700/80 bg-slate-900/80 px-2 py-1 text-[11px] text-slate-200 hover:bg-slate-800"
                  title="Descargar comprobante"
                >
                  ⬇
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
