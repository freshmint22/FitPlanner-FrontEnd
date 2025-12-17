// src/pages/UserDashboard.tsx
import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { PageSection } from '@/components/ui/PageSection';
import { KpiCard } from '@/components/ui/KpiCard';
import { useAuth } from '@/context/useAuth';
import axiosClient from '@/api/axiosClient';
import { extractCompletedDates, daysTrainedInMonth, currentStreak } from '@/utils/routineStats';
import { parseHourStringToDate } from '@/utils/dateUtil';
import ClassDetailsModal from '@/components/modals/ClassDetailsModal';
import RotatingTips from '@/components/ui/RotatingTips';

interface UserStats {
  attendanceThisMonth: number;
  streak: number;
  nextClass?: any;
}

export default function UserDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats>({ attendanceThisMonth: 0, streak: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDetails, setSelectedDetails] = useState<any | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [reservations, setReservations] = useState<any[]>([]);
  const [nextClassRaw, setNextClassRaw] = useState<any | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [recentPayments, setRecentPayments] = useState<any[]>([]);
  const [notifConfig, setNotifConfig] = useState<any | null>(null);
  const [currentPlan, setCurrentPlan] = useState<any>({ name: 'Sin membresía', price: '$0', daysLeft: 0, totalDays: 0, nextPayment: 'N/A', paymentMethod: 'N/A', status: 'Inactivo' });
  const [todayRoutine, setTodayRoutine] = useState<any[]>([]);
  const [myRoutines, setMyRoutines] = useState<any[]>([]);

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);

    const fetchUserStats = async () => {
      try {
        const results = await Promise.allSettled([
          axiosClient.get('/routines/assigned/me'),
          axiosClient.get('/classes'),
          axiosClient.get('/classes/reservations/me')
        ]);

        const assignRes = results[0].status === 'fulfilled' ? (results[0] as PromiseFulfilledResult<any>).value : null;
        const classesRes = results[1].status === 'fulfilled' ? (results[1] as PromiseFulfilledResult<any>).value : null;
        const myRes = results[2].status === 'fulfilled' ? (results[2] as PromiseFulfilledResult<any>).value : null;

        const assignments = assignRes && assignRes.data ? (Array.isArray(assignRes.data) ? assignRes.data : (assignRes.data.items || [])) : [];
        const completedDates = extractCompletedDates(assignments);

        const now = new Date();
        const thisMonth = now.getMonth();
        const thisYear = now.getFullYear();
        const monthDays = daysTrainedInMonth(completedDates, thisYear, thisMonth);
        const streakCount = currentStreak(completedDates);

        // normalize classes
        let items: any[] = classesRes && classesRes.data ? (Array.isArray(classesRes.data) ? classesRes.data : classesRes.data.items || []) : [];
        const future = items
          .map((c) => {
            let date: Date | null = null;
            if (c.scheduleISO) date = new Date(c.scheduleISO);
            if (date && date.getTime() < now.getTime()) {
              const r = new Date(date);
              while (r.getTime() < now.getTime()) r.setDate(r.getDate() + 7);
              date = r;
            }
            if (!date && c.hour) date = parseHourStringToDate(String(c.hour));
            return { ...c, date };
          })
          .filter((c) => c.date && c.date.getTime() >= now.getTime())
          .sort((a, b) => a.date.getTime() - b.date.getTime());

        const nextClass = future[0] || null;

        let myReservations = myRes && myRes.data ? (Array.isArray(myRes.data) ? myRes.data : myRes.data.items || []) : [];
        setReservations(myReservations || []);
        setNextClassRaw(nextClass || null);
        setStats({ attendanceThisMonth: monthDays, streak: streakCount, nextClass: nextClass || undefined });

        // derive currentPlan from user.membership if available
        try {
          const m = (user as any)?.membership;
          if (m) {
            const daysLeft = m.endDate
              ? Math.max(0, Math.ceil((new Date(m.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
              : m.duration || 0;
            setCurrentPlan({
              name: m.name || 'Plan',
              price: (m.price ? (typeof m.price === 'number' ? `$${Number(m.price).toLocaleString()}` : m.price) : '$0'),
              daysLeft,
              totalDays: m.duration || 30,
              nextPayment: m.endDate ? new Date(m.endDate).toLocaleDateString() : 'N/A',
              paymentMethod: m.paymentMethod || '•••• ****',
              status: 'Activo',
            });
          } else {
            setCurrentPlan({ name: 'Sin membresía', price: '$0', daysLeft: 0, totalDays: 0, nextPayment: 'N/A', paymentMethod: 'N/A', status: 'Inactivo' });
          }
        } catch (e) {
          // ignore
        }

        // build today's routine from assigned routines (first assignment with today's date or weekly routine)
        try {
          let assignedList: any[] = assignments || [];
          // If routines contain exercises, pick the most recent assigned routine
          if (Array.isArray(assignedList) && assignedList.length) {
            const first = assignedList[0];
            const exercises = first.exercises || first.items || [];
            setTodayRoutine(exercises.slice(0, 6));
          } else {
            setTodayRoutine([]);
          }
        } catch (e) {
          setTodayRoutine([]);
        }

        // Load recent payments from server; fallback to localStorage if server unavailable
        try {
          const paymentsRes = await axiosClient.get('/pagos').catch(() => null);
          const paymentsRaw = paymentsRes?.data?.data || paymentsRes?.data || [];
          if (Array.isArray(paymentsRaw) && paymentsRaw.length) {
            const mapped = (paymentsRaw || []).slice(0, 5).map((p: any, idx: number) => ({
              planName: p.planName || p.planName || 'Membresía',
              invoice: p.invoice || `#INV-${new Date(p.date || p.createdAt || Date.now()).getFullYear()}-${String(idx + 1).padStart(3, '0')}`,
              date: new Date(p.date || p.createdAt || Date.now()).toLocaleDateString(),
              amount: p.amount ? `$${Number(p.amount).toLocaleString()}` : '$0',
              method: p.method || '',
            }));
            setRecentPayments(mapped);
          } else {
            // fallback to localStorage (for older persisted receipts)
            let paymentsArr: any[] = [];
            try {
              if (typeof window !== 'undefined') {
                const stored = localStorage.getItem('fitplanner.pagos');
                if (stored) {
                  const parsed = JSON.parse(stored);
                  if (Array.isArray(parsed)) {
                    paymentsArr = parsed.slice(0, 5);
                    setRecentPayments(paymentsArr);
                  }
                }
              }
            } catch (e) {
              // ignore
            }
          }
        } catch (e) {
          // final fallback: localStorage
          try {
            if (typeof window !== 'undefined') {
              const stored = localStorage.getItem('fitplanner.pagos');
              if (stored) {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed)) setRecentPayments(parsed.slice(0, 5));
              }
            }
          } catch {}
        }

        // Build simple notifications list from receipts and upcoming class
        try {
          const notifs: any[] = [];
          if (nextClass) notifs.push({ type: 'class', title: `Próxima clase: ${nextClass.name || 'Clase'}`, body: nextClass.time || nextClass.hour || 'Horario disponible', when: nextClass.date ? new Date(nextClass.date).toISOString() : null });
          if (Array.isArray(assignments) && assignments.length) notifs.push({ type: 'routine', title: `Rutina asignada`, body: `${assignments.length} ejercicios asignados`, when: new Date().toISOString() });
          if (paymentsArr.length) paymentsArr.forEach((p: any) => notifs.push({ type: 'payment', title: `Pago recibido ${p.amount}`, body: `${p.planName || ''} • ${p.invoice || ''}`, when: p.date }));
          setNotifications(notifs.slice(0, 6));
        } catch (e) {
          // ignore
        }

        // If admin, load notifications configuration from backend (admin-only)
        try {
          if ((user as any)?.role === 'ADMIN' || (user as any)?.rol === 'ADMIN') {
            const cfg = await axiosClient.get('/notifications/configuracion/notificaciones').catch(() => null);
            if (cfg && cfg.data) setNotifConfig(cfg.data.data || cfg.data);
          }
        } catch (e) {
          // ignore
        }

        // Load user's routines (created routines) - try backend then localStorage
        try {
          const rres = await axiosClient.get('/routines').catch(() => null);
          let items: any[] = [];
          if (rres && rres.data) {
            const d = rres.data;
            if (Array.isArray(d)) items = d;
            else if (d.items) items = d.items;
            else if (d.data) items = d.data;
          }
          if (!items || items.length === 0) {
            // try localStorage fallback
            try {
              const stored = localStorage.getItem('fitplanner.rutinas');
              const arr = stored ? JSON.parse(stored) : [];
              items = Array.isArray(arr) ? arr : [];
            } catch { items = []; }
          }

          const simple = (items || []).map((r: any) => ({ _id: r._id || r.id, name: r.name || r.nombre || r.nombreRutina || 'Rutina', frequency: r.frequency || (r.diasPorSemana ? `${r.diasPorSemana} días/semana` : r.frequency || ''), focus: r.focus || r.enfoque || (r.dias ? (Array.isArray(r.dias) ? r.dias.map((d: any) => d.nombre || d).join(', ') : String(r.dias)) : '') }));
          setMyRoutines(simple.slice(0, 6));
        } catch (e) {
          // ignore
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserStats();
  }, [user]);

  const topNextClass = nextClassRaw || stats.nextClass || null;

  return (
    <div className="min-h-full bg-slate-50 pb-10 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-6xl px-4 pt-3 space-y-4 page-fade-in">
        <PageHeader
          pill="Home"
          title={`Hola, ${user?.name?.split(' ')[0] || 'bienvenido'}`}
          subtitle="Resumen rápido: progreso, recibos, clases y recordatorios."
          actions={(
            <>
              <button onClick={() => (window.location.href = '/classes/calendar')} className="btn-raise rounded-2xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-800 shadow hover:bg-slate-100 dark:border-slate-700/80 dark:bg-slate-950/70 dark:text-slate-100 dark:hover:bg-slate-900">
                Ver calendario de clases
              </button>
            </>
          )} />

        <section className="grid gap-3 md:grid-cols-3 items-stretch">
          <div className="md:col-span-2 grid gap-3 md:grid-cols-2 items-stretch">
            <PageSection title="Eventos recientes" description="Notificaciones relevantes para ti" className="h-full">
              <div className="rounded-2xl border border-slate-200 bg-white p-3 text-sm text-slate-900 shadow-sm dark:border-slate-800/60 dark:bg-slate-950/60 h-full flex flex-col">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-600">Notificaciones</p>
                    <p className="text-sm font-semibold text-slate-900 mt-1">Eventos recientes</p>
                  </div>
                  <div className="text-xs text-slate-400">{notifications.length} nuevas</div>
                </div>

                <ul className="mt-3 space-y-2 max-h-44 overflow-auto flex-1">
                  {notifications.length === 0 && <li className="text-xs text-slate-500">No hay notificaciones recientes</li>}
                  {notifications.map((n, idx) => {
                    const displayDate = n.type === 'payment' ? (n.when || '') : (n.when ? new Date(n.when).toLocaleDateString() : '');
                    return (
                      <li key={idx} className="flex items-start justify-between rounded-md border border-slate-100 p-2">
                        <div className="flex-1">
                          <div className="text-[13px] font-semibold text-slate-800">{n.title}</div>
                          <div className="text-[12px] text-slate-500">{n.body}</div>
                        </div>
                        <div className="ml-3 text-[11px] text-slate-400">{displayDate}</div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </PageSection>

            <PageSection title="Recibos recientes" description="Tus últimos pagos registrados" className="h-full">
              <div className="rounded-2xl border border-slate-200 bg-white p-3 text-sm text-slate-900 shadow-sm dark:border-slate-800/60 dark:bg-slate-950/60 h-full flex flex-col">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-600">Recibos</p>
                    <p className="text-sm font-semibold text-slate-900 mt-1">Últimos pagos</p>
                  </div>
                  <div className="text-xs text-slate-400">{recentPayments.length} registros</div>
                </div>

                <div className="mt-3 space-y-2 overflow-auto flex-1">
                  {recentPayments.length === 0 && <div className="text-xs text-slate-500">No hay recibos aún</div>}
                  {recentPayments.map((p: any, i: number) => (
                    <div key={i} className="flex items-center justify-between rounded-md border border-slate-100 p-2">
                      <div>
                        <div className="text-sm font-semibold">{p.planName || 'Membresía'}</div>
                        <div className="text-xs text-slate-500">{p.invoice} • {p.date}</div>
                      </div>
                      <div className="text-sm font-semibold text-slate-900">{p.amount}</div>
                    </div>
                  ))}
                </div>
              </div>
            </PageSection>
          </div>

          <div className="h-full space-y-3">
            <PageSection title="Tu próxima clase" description="Llega 10 minutos antes para calentar y asegurar tu puesto." className="flex flex-col">
              {topNextClass ? (
                <div className="rounded-2xl border border-slate-200 bg-white/90 px-3 py-2 shadow-sm dark:border-slate-800/60 dark:bg-slate-950/60">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{topNextClass.name || 'Sin nombre'}</p>
                  <p className="mt-1 text-xs text-slate-500">{topNextClass.time || topNextClass.hour || 'Horario no especificado'} · {topNextClass.room || 'Sala no especificada'}</p>
                  {topNextClass.trainer && <p className="mt-1 text-[12px] text-slate-500">Entrenador: <span className="font-medium text-slate-700 dark:text-slate-200">{topNextClass.trainer}</span></p>}
                  <div className="mt-3">
                    <button onClick={() => { setSelectedDetails(topNextClass); setIsDetailsOpen(true); }} className="inline-flex w-full items-center justify-center rounded-full bg-sky-500 px-3 py-2 text-xs font-semibold text-white shadow-md hover:bg-sky-400">Ver detalles de la clase</button>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-2 text-sm text-slate-600">No hay clases próximas</div>
              )}
            </PageSection>

            <PageSection title="Recordatorios rápidos" description="Pequeños detalles que mantienen tu progreso en marcha." className="">
              <RotatingTips
                intervalMs={3500}
                compact
                tips={[
                  '💧 Intenta tomar al menos 2 litros de agua durante el día.',
                  '😴 Procura dormir entre 7 y 8 horas para una mejor recuperación.',
                  '🏃‍♂️ Realiza 10 minutos de cardio ligero antes de tu entrenamiento.',
                  '🍎 Incorpora una porción de proteína en cada comida para recuperación.',
                  '🧘‍♀️ Añade 5 minutos de estiramiento al finalizar tu rutina.',
                ]}
              />
            </PageSection>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-3 items-start">
          <div className="space-y-5 lg:col-span-2">
            <PageSection title="Membresía activa" description="Plan actual, vigencia y asistencia del mes." className="card-pop">
              <div className="relative overflow-hidden rounded-2xl bg-white px-4 py-6 text-sm text-slate-900 shadow-sm dark:bg-slate-900/80 dark:text-slate-100">
                {/* Plan card (compact) - adapts to active membership */}
                <div className="grid md:grid-cols-2 gap-4 items-center">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wide text-emerald-600">{(user?.membership?.name || '').toUpperCase() || 'SIN MEMBRESÍA'}</div>
                    <h3 className="mt-1 text-lg font-semibold text-slate-900">{user?.membership?.name ? user.membership.name : 'Sin membresía activa'}</h3>
                    <p className="mt-1 text-xs text-slate-600">Vigente hasta <span className="font-semibold text-slate-900">{user?.membership?.endDate ? new Date(user.membership.endDate).toLocaleDateString() : 'No definido'}</span></p>
                    <div className="mt-4">
                      <p className="text-[11px] text-slate-600 mb-2">Asistencias este mes: <span className="font-semibold text-slate-900">{stats.attendanceThisMonth} / 16</span></p>
                      <div className="h-2 w-full rounded-full bg-slate-100"><div className="h-2 rounded-full bg-gradient-to-r from-emerald-400 to-sky-500" style={{ width: `${Math.min((stats.attendanceThisMonth / 16) * 100, 100)}%` }} /></div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end justify-center">
                    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm w-48 text-center">
                      <div className="text-sm font-semibold text-slate-700">{user?.membership?.name || 'Plan'}</div>
                      <div className="mt-2 text-2xl font-extrabold text-slate-900">{user?.membership?.price || currentPlan.price}</div>
                      <p className="mt-2 text-xs text-slate-500">{user?.membership?.description || ''}</p>
                      <div className="mt-4">
                        <button onClick={() => (window.location.href = '/my-membership')} className="rounded-full bg-gradient-to-r from-blue-500 to-emerald-400 px-4 py-2 text-sm font-semibold text-white">Ver membresía</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </PageSection>

            <PageSection title="Rutina de hoy" description="Tus rutinas creadas — vista rápida.">
              <div className="space-y-3">
                {isLoading ? (
                  <p className="text-sm text-slate-500">Cargando...</p>
                ) : myRoutines.length === 0 ? (
                  <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-800 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-200">No tienes rutinas creadas aún</div>
                ) : (
                  myRoutines.slice(0, 3).map((r: any) => (
                    <div key={r._id || r.name} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-800 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-200">
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{r.name}</p>
                      <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">{r.frequency || ''} {r.focus ? `· ${r.focus}` : ''}</p>
                    </div>
                  ))
                )}
              </div>
            </PageSection>
          </div>

          
        </div>

        <ClassDetailsModal
          isOpen={isDetailsOpen}
          onClose={() => { setIsDetailsOpen(false); setSelectedDetails(null); }}
          classData={selectedDetails}
          reserved={selectedDetails ? reservations.some((r) => String(r.classId) === String(selectedDetails._id || selectedDetails.id)) : false}
          onReserve={async (id) => {
            try {
              await axiosClient.post(`/classes/${id}/reservations`);
              const resp = await axiosClient.get('/classes/reservations/me');
              let d = resp.data;
              if (d && d.items) d = d.items;
              if (!Array.isArray(d)) d = [];
              setReservations(d || []);
            } catch (e) {
              console.error('Reserve error', e);
            } finally {
              setIsDetailsOpen(false);
              setSelectedDetails(null);
            }
          }}
          onCancelReserve={async (id) => {
            try {
              await axiosClient.delete(`/classes/${id}/reservations`);
              const resp = await axiosClient.get('/classes/reservations/me');
              let d = resp.data;
              if (d && d.items) d = d.items;
              if (!Array.isArray(d)) d = [];
              setReservations(d || []);
            } catch (e) {
              console.error('Cancel reserve error', e);
            } finally {
              setIsDetailsOpen(false);
              setSelectedDetails(null);
            }
          }}
        />
      </div>
    </div>
  );
}
