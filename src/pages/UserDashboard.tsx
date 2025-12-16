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

  useEffect(() => {
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
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserStats();
  }, []);

  const topNextClass = nextClassRaw || stats.nextClass || null;

  return (
    <div className="min-h-full bg-slate-50 pb-10 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-6xl px-4 pt-6 space-y-6 page-fade-in">
        <PageHeader
          pill="Panel de entrenamiento"
          title={`Hola, ${user?.name?.split(' ')[0] || 'bienvenido'}`}
          subtitle="Revisa tu progreso, tu racha de entrenos y las próximas clases reservadas."
          actions={(
            <>
              <button onClick={() => (window.location.href = '/classes/calendar')} className="btn-raise rounded-2xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-800 shadow hover:bg-slate-100 dark:border-slate-700/80 dark:bg-slate-950/70 dark:text-slate-100 dark:hover:bg-slate-900">
                Ver calendario de clases
              </button>
            </>
          )} />

        <section className="grid gap-5 md:grid-cols-3 items-start">
          <KpiCard
            label="Sesiones este mes"
            value={String(stats.attendanceThisMonth)}
            helperText="Objetivo: 16 entrenos mensuales."
            icon="🏋️‍♂️"
            isLoading={isLoading}
          />

          <KpiCard
            label="Racha activa"
            value={`${stats.streak} días`}
            helperText="Entrenaste los últimos días."
            icon="🔥"
            isLoading={isLoading}
          />

          <div>
            <PageSection title="Tu próxima clase" description="Llega 10 minutos antes para calentar y asegurar tu puesto." className="h-full">
              {topNextClass ? (
                <div className="rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 shadow-sm dark:border-slate-800/60 dark:bg-slate-950/60">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{topNextClass.name || 'Sin nombre'}</p>
                  <p className="mt-1 text-xs text-slate-500">{topNextClass.time || topNextClass.hour || 'Horario no especificado'} · {topNextClass.room || 'Sala no especificada'}</p>
                  {topNextClass.trainer && <p className="mt-2 text-[12px] text-slate-500">Entrenador: <span className="font-medium text-slate-700 dark:text-slate-200">{topNextClass.trainer}</span></p>}
                  <div className="mt-4">
                    <button onClick={() => { setSelectedDetails(topNextClass); setIsDetailsOpen(true); }} className="inline-flex w-full items-center justify-center rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-sky-400">Ver detalles de la clase</button>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">No hay clases próximas</div>
              )}
            </PageSection>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-3 items-start -mt-6 lg:-mt-8">
          <div className="space-y-5 lg:col-span-2">
            <PageSection title="Membresía activa" description="Plan actual, vigencia y asistencia del mes." className="card-pop">
              <div className="relative overflow-hidden rounded-2xl bg-white px-4 py-4 text-sm text-slate-900 shadow-sm dark:bg-slate-900/80 dark:text-slate-100">
                <div className="absolute -right-10 -top-8 h-44 w-44 rounded-full bg-gradient-to-br from-sky-300 to-emerald-200 opacity-60 blur-3xl" />
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">{user?.membership?.name || 'Sin membresía activa'}</p>
                <p className="mt-1 text-lg font-semibold text-slate-900">Acceso total al gimnasio</p>
                <p className="mt-1 text-xs text-slate-600">Vigente hasta el <span className="font-semibold text-slate-900">{user?.membership?.endDate ? new Date(user.membership.endDate).toLocaleDateString() : 'No definido'}</span></p>
                <div className="mt-4">
                  <p className="text-[11px] text-slate-600 mb-2">Asistencias este mes: <span className="font-semibold text-slate-900">{stats.attendanceThisMonth} / 16</span></p>
                  <div className="h-2 w-full rounded-full bg-slate-100"><div className="h-2 rounded-full bg-gradient-to-r from-emerald-400 to-sky-500" style={{ width: `${Math.min((stats.attendanceThisMonth / 16) * 100, 100)}%` }} /></div>
                </div>
              </div>
            </PageSection>

            <PageSection title="Rutina de hoy" description="Enfocada en fuerza y core. Mantén una técnica correcta y controla los descansos.">
              <div className="grid gap-4 md:grid-cols-2">
                <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-200">
                  <li className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-800 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-200"><p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Sentadillas con barra</p><p className="text-xs text-slate-500 dark:text-slate-400">Piernas · 4 × 10</p></li>
                  <li className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-800 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-200"><p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Press banca</p><p className="text-xs text-slate-500 dark:text-slate-400">Pecho · 4 × 8</p></li>
                </ul>
                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-800 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-100">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Grupos musculares</p>
                  <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">Balance semanal entre parte superior, inferior y core.</p>
                </div>
              </div>
            </PageSection>
          </div>

          <div className="space-y-5">
            <PageSection title="Recordatorios rápidos" description="Pequeños detalles que mantienen tu progreso en marcha.">
              <RotatingTips
                intervalMs={3500}
                tips={[
                  '💧 Intenta tomar al menos 2 litros de agua durante el día.',
                  '😴 Procura dormir entre 7 y 8 horas para una mejor recuperación.',
                  '🏃‍♂️ Realiza 10 minutos de cardio ligero antes de tu entrenamiento.',
                  '🍎 Incorpora una porción de proteína en cada comida para recuperación.',
                  '🧘‍♀️ Añade 5 minutos de estiramiento al finalizar tu rutina.',
                  '📆 Planifica una semana ligera cada 4 semanas para recuperación.',
                  '⚖️ Mantén una postura neutra al hacer sentadillas para proteger la espalda.',
                  '🔁 Varía el orden de los ejercicios cada 2 semanas para evitar estancamiento.',
                  '🫗 Hidrátate durante la sesión: pequeños sorbos cada 15 minutos.',
                  '📝 Lleva un registro de pesos y repeticiones para medir progreso.'
                ]}
              />
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
