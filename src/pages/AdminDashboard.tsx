// src/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { PageSection } from '@/components/ui/PageSection';
import { KpiCard } from '@/components/ui/KpiCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Modal } from '@/components/ui/Modal';
import { axiosClient } from '@/api/axiosClient';

interface DashboardKPIs {
  totalMiembros: number;
  miembrosActivos: number;
  clasesHoy: number;
  ingresosMes: string;
}

export default function AdminDashboard() {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isLoadingKpis, setIsLoadingKpis] = useState(true);
  const [kpis, setKpis] = useState<DashboardKPIs>({
    totalMiembros: 0,
    miembrosActivos: 0,
    clasesHoy: 0,
    ingresosMes: '$0'
  });

  // Cargar KPIs reales del backend
  useEffect(() => {
    const fetchKPIs = async () => {
      try {
        const { data } = await axiosClient.get('/reports/dashboard-kpis');
        setKpis({
          totalMiembros: data.totalMiembros || 0,
          miembrosActivos: data.miembrosActivos || 0,
          clasesHoy: data.clasesHoy || 0,
          ingresosMes: data.ingresosMes || '$0'
        });
      } catch (error) {
        console.error('Error cargando KPIs:', error);
      } finally {
        setIsLoadingKpis(false);
      }
    };

    fetchKPIs();
  }, []);

  return (
    <>
      <div className="flex flex-col gap-6 page-fade-in">
        <PageHeader
          pill="Panel administrativo"
          title="Hola, Administrador"
          subtitle="Supervisa el rendimiento del gimnasio: miembros activos, clases, ocupación e ingresos."
          actions={
            <>
              <button
                className="btn-raise rounded-2xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-800 shadow hover:bg-slate-50 dark:border-slate-700/80 dark:bg-slate-950/70 dark:text-slate-100 dark:hover:bg-slate-900"
                onClick={() => setIsCalendarOpen(true)}
              >
                Ver calendario completo
              </button>
              <button className="btn-raise rounded-2xl bg-sky-500 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-sky-400">
                Exportar resumen
              </button>
            </>
          }
        />

        {/* KPIs con datos reales */}
        <section className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            label="Total de miembros"
            value={String(kpis.totalMiembros)}
            helperText="Miembros registrados en el sistema."
            icon="🧑‍🤝‍🧑"
            isLoading={isLoadingKpis}
          />
          <KpiCard
            label="Activos hoy"
            value={String(kpis.miembrosActivos)}
            helperText="Check-ins registrados en el día."
            icon="🏋️‍♂️"
            isLoading={isLoadingKpis}
          />
          <KpiCard
            label="Clases de hoy"
            value={String(kpis.clasesHoy)}
            helperText="Entre fuerza, cardio y funcional."
            icon="📅"
            isLoading={isLoadingKpis}
          />
          <KpiCard
            label="Ingresos del mes"
            value={kpis.ingresosMes}
            helperText="Basado en membresías activas."
            trend="+12% vs mes anterior"
            icon="💰"
            isLoading={isLoadingKpis}
          />
        </section>

        {/* Zona principal */}
        <div className="grid gap-5 lg:grid-cols-3">
          {/* Columna izquierda: operación diaria (clases + ingresos) */}
          <div className="space-y-5 lg:col-span-2">
            <PageSection
              title="Clases de hoy"
              description="Revisa la ocupación, horarios y entrenadores de las sesiones del día."
              rightSlot={
                <button className="text-xs font-semibold text-sky-400 hover:text-sky-300">
                  Ver todas las clases
                </button>
              }
            >
              <div className="space-y-3">
                {[
                  {
                    name: 'Functional Full Body',
                    time: '6:00 p.m. · Sala 2',
                    trainer: 'Laura Gómez',
                    occupancy: '18 / 20',
                    color: 'text-emerald-400',
                    tag: 'Funcional',
                  },
                  {
                    name: 'Spinning Cardio',
                    time: '7:30 a.m. · Sala Cardio',
                    trainer: 'Carlos Ruiz',
                    occupancy: '15 / 18',
                    color: 'text-amber-300',
                    tag: 'Cardio',
                  },
                  {
                    name: 'Cross Training',
                    time: '6:30 p.m. · Sala 1',
                    trainer: 'Miguel Rojas',
                    occupancy: '22 / 25',
                    color: 'text-emerald-400',
                    tag: 'Alta intensidad',
                  },
                ].map((cls) => (
                  <div
                    key={cls.name}
                    className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-100"
                  >
                    <div className="space-y-1">
                      <p className="font-semibold">{cls.name}</p>
                      <p className="text-xs text-slate-400">
                        {cls.time} · Entrenador:{' '}
                        <span className="font-medium text-slate-300">
                          {cls.trainer}
                        </span>
                      </p>
                      <span className="inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700 dark:bg-slate-800/90 dark:text-slate-300">
                        {cls.tag}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-[11px] text-slate-600 dark:text-slate-400">Ocupación</p>
                      <p className={`text-sm font-semibold ${cls.color}`}>
                        {cls.occupancy}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </PageSection>

            <PageSection
              title="Ingresos por tipo de membresía"
              description="Desglose de ventas por plan en el mes actual."
            >
              <div className="grid gap-3 md:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900/80">
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
                    Mensual Premium
                  </p>
                  <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-50">
                    $9.200.000
                  </p>
                  <p className="mt-1 text-[11px] text-emerald-400">
                    +6% vs mes anterior
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900/80">
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
                    Mensual
                  </p>
                  <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-50">
                    $5.800.000
                  </p>
                  <p className="mt-1 text-[11px] text-slate-400">
                    Estable respecto al mes pasado
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900/80">
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
                    Trimestral
                  </p>
                  <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-50">
                    $3.450.000
                  </p>
                  <p className="mt-1 text-[11px] text-emerald-400">
                    +14% por campaña promocional
                  </p>
                </div>
              </div>
            </PageSection>
          </div>

          {/* Columna derecha: renovaciones + alertas */}
          <div className="space-y-5">
            <PageSection
              title="Próximas renovaciones"
              description="Membresías que vencen en los próximos días."
            >
              <div className="space-y-3 text-sm text-slate-900 dark:text-slate-100">
                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900/80">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-slate-100">Ana Torres</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        Plan Mensual Premium · Vence el 30 / 11 / 2025
                      </p>
                    </div>
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
                      2 días
                    </span>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900/80">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-slate-100">Juan Pérez</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        Plan Trimestral · Vence el 05 / 12 / 2025
                      </p>
                    </div>
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                      1 semana
                    </span>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900/80">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-slate-100">Carlos López</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        Plan Mensual · Venció hoy
                      </p>
                    </div>
                    <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-semibold text-rose-700 dark:bg-rose-500/10 dark:text-rose-300">
                      Vencida
                    </span>
                  </div>
                </div>
              </div>
            </PageSection>

            <PageSection
              title="Alertas rápidas"
              description="Pendientes operativos para revisar hoy."
            >
              <EmptyState
                title="Sin alertas críticas"
                description="No hay incidencias importantes registradas para hoy. Revisa reportes o miembros inactivos para detectar oportunidades."
              />
            </PageSection>
          </div>
        </div>
      </div>

      {/* Modal de calendario */}
      <Modal
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        title="Calendario del día"
        description="Visualiza la programación de clases en un calendario completo."
      >
        <p className="text-xs text-slate-300">
          Aquí podrías integrar una vista mensual, semanal o de agenda del
          calendario del gimnasio. Por ahora es un ejemplo de contenido del
          modal para probar la animación.
        </p>

        <div className="mt-4 flex justify-end gap-2">
          <button
            className="btn-raise rounded-2xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 hover:bg-slate-50 dark:border-slate-700/80 dark:bg-slate-900/80 dark:text-slate-100"
            onClick={() => setIsCalendarOpen(false)}
          >
            Cerrar
          </button>
          <button className="btn-raise rounded-2xl bg-sky-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-sky-400">
            Ir al módulo de calendario
          </button>
        </div>
      </Modal>
    </>
  );
}
