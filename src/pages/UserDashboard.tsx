// src/pages/UserDashboard.tsx
import { PageHeader } from '@/components/ui/PageHeader';
import { PageSection } from '@/components/ui/PageSection';
import { KpiCard } from '@/components/ui/KpiCard';

export default function UserDashboard() {
  return (
    <div className="flex flex-col gap-6 page-fade-in">
      <PageHeader
        pill="Panel de entrenamiento"
        title="Hola, bienvenido de nuevo"
        subtitle="Revisa tu progreso, tu racha de entrenos y las próximas clases reservadas."
        actions={
          <>
            <button className="btn-raise rounded-2xl border border-slate-700/80 bg-slate-950/70 px-4 py-2 text-xs font-semibold text-slate-100 shadow hover:bg-slate-900">
              Ver calendario de clases
            </button>
            <button className="btn-raise rounded-2xl bg-emerald-500 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-emerald-400">
              Actualizar objetivos
            </button>
          </>
        }
      />

      {/* KPIs orientados al usuario / entrenamiento */}
      <section className="grid gap-5 md:grid-cols-3">
        <KpiCard
          label="Sesiones este mes"
          value="12"
          helperText="Objetivo: 16 entrenos mensuales."
          icon="🏋️‍♂️"
        />
        <KpiCard
          label="Racha activa"
          value="5 días"
          helperText="Entrenaste los últimos 5 días."
          icon="🔥"
        />
        <KpiCard
          label="Próxima clase"
          value="Functional Full Body"
          helperText="Hoy · 6:00 p.m. · Sala 2"
          icon="📅"
        />
      </section>

      {/* Zona principal usuario: progreso + rutina + detalle de la próxima clase */}
      <div className="grid gap-5 lg:grid-cols-3">
        {/* Columna izquierda: membresía + semana de entrenos */}
        <div className="space-y-5 lg:col-span-2">
          {/* Membresía activa, pero más “fitness” */}
          <PageSection
            title="Membresía activa"
            description="Plan actual, vigencia y asistencia del mes."
            className="card-pop"
          >
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-50 via-sky-50 to-emerald-50 px-4 py-4 text-sm text-slate-900 dark:from-slate-900/95 dark:via-slate-900/90 dark:to-emerald-900/40 dark:text-slate-100">
              <div className="absolute right-[-40px] top-[-40px] h-40 w-40 rounded-full bg-emerald-400/15 blur-2xl dark:bg-emerald-500/10" />
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-300">
                Plan Mensual Premium
              </p>
              <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-50">
                Acceso total al gimnasio
              </p>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                Vigente hasta el{' '}
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  30 / 12 / 2025
                </span>
              </p>

              {/* Barra de progreso de asistencia */}
              <div className="mt-4">
                <p className="text-[11px] text-slate-600 mb-1 dark:text-slate-400">
                  Asistencias este mes:{' '}
                  <span className="font-semibold text-slate-900 dark:text-slate-100">12 / 16</span>
                </p>
                <div className="h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-800/80">
                  <div className="h-1.5 w-3/4 rounded-full bg-emerald-500 dark:bg-emerald-400" />
                </div>
              </div>

              {/* Mini semana de entrenos */}
              <div className="mt-4 flex items-center justify-between gap-2 text-[11px] text-slate-600 dark:text-slate-300">
                <span className="text-slate-500 dark:text-slate-400">Semana de entreno</span>
                <div className="flex gap-1">
                  {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((day, idx) => (
                    <div
                      key={day}
                      className={[
                        'flex h-6 w-6 items-center justify-center rounded-full border text-[10px]',
                        idx < 5
                          ? 'border-emerald-400/70 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200'
                          : 'border-slate-200 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400',
                      ].join(' ')}
                    >
                      {day}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </PageSection>

          {/* Rutina de hoy + grupos musculares */}
          <PageSection
            title="Rutina de hoy"
            description="Enfocada en fuerza y core. Mantén una técnica correcta y controla los descansos."
          >
            <div className="grid gap-4 md:grid-cols-2">
              {/* Lista de ejercicios */}
              <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-200">
                <li className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-800 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-200">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Sentadillas con barra
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Piernas · 4 × 10</p>
                </li>
                <li className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-800 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-200">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Press banca
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Pecho · 4 × 8</p>
                </li>
                <li className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-800 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-200">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Remo con barra
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Espalda · 3 × 10</p>
                </li>
                <li className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-800 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-200">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Plancha abdominal
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Core · 3 × 40s</p>
                </li>
              </ul>

              {/* Progreso por grupo muscular */}
              <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-800 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-100">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Grupos musculares</p>
                <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                  Balance semanal entre parte superior, inferior y core.
                </p>

                {[
                  { label: 'Parte inferior', value: '80%', bar: 'w-4/5' },
                  { label: 'Parte superior', value: '65%', bar: 'w-2/3' },
                  { label: 'Core', value: '50%', bar: 'w-1/2' },
                ].map((item) => (
                  <div key={item.label} className="mt-3">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-600 dark:text-slate-300">{item.label}</span>
                      <span className="text-slate-500 dark:text-slate-400">{item.value}</span>
                    </div>
                    <div className="mt-1 h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-800/80">
                      <div className={`h-1.5 rounded-full bg-sky-500 dark:bg-sky-400 ${item.bar}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </PageSection>
        </div>

        {/* Columna derecha: próxima clase + recordatorios */}
        <div className="space-y-5">
          {/* Próxima clase reservada (tarjeta tipo “gym promo”) */}
          <PageSection
            title="Tu próxima clase"
            description="Llega 10 minutos antes para calentar y asegurar tu puesto."
          >
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-sky-100 via-slate-50 to-emerald-50 px-4 py-4 text-sm text-slate-900 dark:from-sky-500/20 dark:via-slate-900 dark:to-slate-950 dark:text-slate-100">
              <div className="absolute right-[-30px] top-[-30px] h-32 w-32 rounded-full bg-sky-300/30 blur-2xl dark:bg-sky-500/20" />
              <p className="text-xs font-semibold uppercase tracking-wide text-sky-700 dark:text-sky-300">
                Functional Full Body
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
                Hoy · 6:00 p.m. · Sala 2
              </p>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                Entrenador:{' '}
                <span className="font-semibold text-slate-900 dark:text-slate-50">
                  Laura Gómez
                </span>
              </p>

              <div className="mt-3 flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-300">
                <span>Ocupación actual</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-300">
                  18 / 20 cupos
                </span>
              </div>

              <button className="btn-raise mt-4 inline-flex w-full items-center justify-center rounded-2xl bg-sky-500 px-3 py-2 text-xs font-semibold text-white shadow-md hover:bg-sky-400">
                Ver detalles de la clase
              </button>
            </div>
          </PageSection>

          {/* Recordatorios rápidos */}
          <PageSection
            title="Recordatorios rápidos"
            description="Pequeños detalles que mantienen tu progreso en marcha."
          >
            <ul className="space-y-2 text-[11px] text-slate-300">
              <li className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-700 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300">
                💧 Intenta tomar al menos{' '}
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  2 litros de agua
                </span>{' '}
                durante el día.
              </li>
              <li className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-700 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300">
                😴 Procura dormir entre{' '}
                <span className="font-semibold text-slate-900 dark:text-slate-100">7 y 8 horas</span>{' '}
                para mejorar tu recuperación.
              </li>
              <li className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-700 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300">
                📆 Revisa tu{' '}
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  rutina semanal
                </span>{' '}
                y ajusta los días en que no vas a poder entrenar.
              </li>
            </ul>
          </PageSection>
        </div>
      </div>
    </div>
  );
}
