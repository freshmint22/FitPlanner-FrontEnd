// src/pages/UserDashboard.tsx
import { StatCard } from "@/components/ui/StatCard";
import { SectionCard } from "@/components/ui/SectionCard";
import { StatusBadge } from "@/components/ui/StatusBadge";

const upcomingClasses = [
  {
    id: 1,
    name: "Functional Full Body",
    time: "Hoy · 6:00 p.m.",
    room: "Sala 2",
    coach: "Laura Gómez",
    intensity: "Alta",
  },
  {
    id: 2,
    name: "Spinning",
    time: "Mañana · 7:00 a.m.",
    room: "Sala Cardio",
    coach: "Carlos Ruiz",
    intensity: "Media",
  },
  {
    id: 3,
    name: "Yoga Relax",
    time: "Jueves · 8:00 p.m.",
    room: "Sala 3",
    coach: "Ana Torres",
    intensity: "Baja",
  },
];

const todayRoutine = [
  {
    id: 1,
    name: "Sentadillas con barra",
    area: "Piernas",
    sets: "4 x 10",
  },
  {
    id: 2,
    name: "Press banca",
    area: "Pecho",
    sets: "4 x 8",
  },
  {
    id: 3,
    name: "Remo con barra",
    area: "Espalda",
    sets: "3 x 10",
  },
  {
    id: 4,
    name: "Plancha",
    area: "Core",
    sets: "3 x 45s",
  },
];

const UserDashboard = () => {
  return (
    <div className="min-h-screen bg-fp-bg text-fp-text-main">
      {/* HEADER / HERO */}
      <header className="relative overflow-hidden rounded-b-[2.5rem] bg-gradient-to-r from-indigo-600 via-sky-500 to-emerald-500 px-6 pb-10 pt-6 shadow-fp-card">
        <div className="absolute inset-0 opacity-30 mix-blend-soft-light bg-[radial-gradient(circle_at_top,_#ffffff33,_transparent_60%)]" />
        <div className="relative mx-auto flex max-w-6xl flex-col gap-6">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-100/80">
                Panel de usuario
              </p>
              <h1 className="mt-2 text-3xl font-semibold text-white md:text-4xl">
                Hola, <span className="font-bold">Administrador</span>
              </h1>
              <p className="mt-2 text-sm text-indigo-100/80 max-w-xl">
                Tu progreso, clases y rutinas en un solo lugar. Revisa tu
                actividad, organiza tus entrenos y mantén tu racha activa.
              </p>
            </div>

            <div className="inline-flex flex-col items-end gap-2 rounded-2xl bg-slate-950/20 px-4 py-3 text-right backdrop-blur-sm">
              <p className="text-xs text-indigo-50/80">Hoy es</p>
              <p className="text-sm font-semibold text-white">
                Miércoles, 26 Nov
              </p>
              <p className="text-xs text-indigo-100/80">
                Mantén tu constancia, vas muy bien 💪
              </p>
            </div>
          </div>

          {/* Acciones rápidas */}
          <div className="grid gap-3 md:grid-cols-3">
            <button className="inline-flex items-center justify-center rounded-2xl bg-slate-950/20 px-4 py-3 text-sm font-medium text-white shadow-fp-soft backdrop-blur-sm hover:bg-slate-950/30 transition">
              Reservar nueva clase
            </button>
            <button className="inline-flex items-center justify-center rounded-2xl bg-slate-950/20 px-4 py-3 text-sm font-medium text-white shadow-fp-soft backdrop-blur-sm hover:bg-slate-950/30 transition">
              🏋️ Ver rutina completa
            </button>
            <button className="inline-flex items-center justify-center rounded-2xl bg-slate-950/20 px-4 py-3 text-sm font-medium text-white shadow-fp-soft backdrop-blur-sm hover:bg-slate-950/30 transition">
              📊 Progreso de este mes
            </button>
          </div>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 md:px-6 md:py-8">
        {/* Métricas superiores */}
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard
            label="Membresía activa"
            value="Plan Mensual Premium"
            subtitle="Vigente hasta el 30 / 12 / 2025"
            accentColor="purple"
          />
          <StatCard
            label="Clases esta semana"
            value="3 reservadas"
            subtitle="Próxima clase hoy a las 6:00 p.m."
            accentColor="blue"
          />
          <StatCard
            label="Progreso de objetivo"
            value="Definición y resistencia"
            subtitle="Sesiones completadas 3 / 4"
            accentColor="green"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Columna izquierda: membresía + próximas clases */}
          <div className="space-y-6 lg:col-span-2">
            <SectionCard
              title="Membresía activa"
              description="Revisa tu plan actual y seguimiento de asistencias."
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-100">
                    Plan Mensual Premium
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Vigente hasta el <span className="font-medium">30 / 12 / 2025</span>
                  </p>
                  <p className="mt-2 text-xs text-slate-400">
                    Acceso completo a salas, clases grupales y rutinas
                    personalizadas.
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <StatusBadge label="Premium" status="active" />
                  <div className="w-40">
                    <div className="mt-2 h-1.5 w-full rounded-full bg-slate-800">
                      <div className="h-1.5 w-3/4 rounded-full bg-emerald-400" />
                    </div>
                    <p className="mt-1 text-xs text-slate-400 text-right">
                      Asistencias este mes:{" "}
                      <span className="font-semibold text-slate-100">
                        12 / 16
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </SectionCard>

            <SectionCard
              title="Próximas clases"
              description="Revisa las próximas sesiones que tienes agendadas."
              rightContent={
                <button className="text-xs font-medium text-sky-400 hover:text-sky-300">
                  Ver todas las clases
                </button>
              }
            >
              <div className="space-y-3">
                {upcomingClasses.map((cls) => (
                  <div
                    key={cls.id}
                    className="flex flex-col justify-between gap-3 rounded-xl bg-slate-900/70 px-4 py-3 md:flex-row md:items-center"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-100">
                        {cls.name}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        {cls.time} · {cls.room}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        Entrenador:{" "}
                        <span className="text-slate-300">{cls.coach}</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge
                        label={cls.intensity}
                        status={
                          cls.intensity === "Alta"
                            ? "danger"
                            : cls.intensity === "Media"
                            ? "warning"
                            : "active"
                        }
                      />
                      <button className="text-xs font-medium text-sky-400 hover:text-sky-300">
                        Ver detalle
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>

          {/* Columna derecha: rutina del día */}
          <div className="space-y-6">
            <SectionCard
              title="Rutina de hoy"
              description="Enfocada en fuerza y core. Recuerda registrar tus pesos."
              rightContent={
                <button className="text-xs font-medium text-sky-400 hover:text-sky-300">
                  Ver rutina completa
                </button>
              }
            >
              <div className="space-y-2">
                {todayRoutine.map((ex) => (
                  <div
                    key={ex.id}
                    className="flex items-center justify-between rounded-xl bg-slate-900/70 px-4 py-2"
                  >
                    <div>
                      <p className="text-sm text-slate-100">{ex.name}</p>
                      <p className="mt-0.5 text-xs text-slate-400">
                        {ex.area}
                      </p>
                    </div>
                    <p className="text-xs font-medium text-slate-200">
                      {ex.sets}
                    </p>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
