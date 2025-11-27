// src/pages/AdminDashboard.tsx
import { StatCard } from "@/components/ui/StatCard";
import { SectionCard } from "@/components/ui/SectionCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { DataListItem } from "@/components/ui/DataListItem";

const classesToday = [
  {
    id: 1,
    name: "Functional Full Body",
    time: "6:00 a.m. · Sala 2",
    coach: "Laura Gómez",
    capacity: "18 / 20 cupos",
  },
  {
    id: 2,
    name: "Spinning Cardio",
    time: "7:30 a.m. · Sala Cardio",
    coach: "Carlos Ruiz",
    capacity: "15 / 18 cupos",
  },
  {
    id: 3,
    name: "Cross Training",
    time: "6:30 p.m. · Sala 1",
    coach: "Miguel Rojas",
    capacity: "22 / 25 cupos",
  },
];

const recentCheckins = [
  { id: 1, name: "María Fernández", plan: "Mensual Premium", time: "06:15 a. m." },
  { id: 2, name: "David Rodríguez", plan: "Mensual", time: "06:37 a. m." },
  { id: 3, name: "Laura Gómez", plan: "Staff", time: "07:05 a. m." },
  { id: 4, name: "Sofía Ramírez", plan: "Trimestral", time: "07:20 a. m." },
];

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-fp-bg text-fp-text-main">
      {/* HEADER */}
      <header className="relative overflow-hidden rounded-b-[2.5rem] bg-gradient-to-r from-slate-900 via-slate-950 to-slate-950 px-6 pb-8 pt-6 shadow-fp-card">
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_top,_#4f46e533,_transparent_60%)]" />
        <div className="relative mx-auto flex max-w-6xl flex-col gap-6">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                FitPlanner Manager
              </p>
              <h1 className="mt-2 text-3xl font-semibold text-white md:text-4xl">
                Panel administrativo
              </h1>
              <p className="mt-2 text-sm text-slate-300 max-w-xl">
                Visión general del gimnasio: miembros, clases y finanzas en
                tiempo real.
              </p>
            </div>

            <div className="inline-flex flex-col items-end gap-2 rounded-2xl bg-slate-900/60 px-4 py-3 text-right backdrop-blur-md border border-slate-700/60">
              <p className="text-xs text-slate-400">Hoy es</p>
              <p className="text-sm font-semibold text-slate-100">
                Miércoles, 26 Nov
              </p>
              <p className="text-xs text-emerald-300">
                Ingresos estimados este mes:{" "}
                <span className="font-semibold text-emerald-400">
                  $18.450.000
                </span>
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* CONTENIDO */}
      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 md:px-6 md:py-8">
        {/* Métricas principales */}
        <div className="grid gap-4 md:grid-cols-4">
          <StatCard
            label="Total de miembros"
            value="248"
            subtitle="Miembros registrados en el sistema."
            accentColor="blue"
          />
          <StatCard
            label="Activos hoy"
            value="63"
            subtitle="Check-ins registrados en el día."
            accentColor="green"
          />
          <StatCard
            label="Clases de hoy"
            value="9"
            subtitle="Entre fuerza, cardio y funcional."
            accentColor="purple"
          />
          <StatCard
            label="Ingresos del mes"
            value="$18.450.000"
            subtitle="Basado en membresías activas."
            accentColor="pink"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Clases del día */}
          <div className="lg:col-span-2 space-y-6">
            <SectionCard
              title="Clases de hoy"
              description="Revisa ocupación, entrenadores y salas asignadas."
              rightContent={
                <button className="text-xs font-medium text-sky-400 hover:text-sky-300">
                  Ver calendario completo
                </button>
              }
            >
              <div className="space-y-3">
                {classesToday.map((cls) => (
                  <DataListItem
                    key={cls.id}
                    title={cls.name}
                    subtitle={cls.time}
                    metaLeft={`Entrenador: ${cls.coach}`}
                    metaRight={cls.capacity}
                    rightContent={
                      <button className="text-xs font-medium text-sky-400 hover:text-sky-300">
                        Ver detalles
                      </button>
                    }
                  />
                ))}
              </div>
            </SectionCard>
          </div>

          {/* Check-in reciente */}
          <div className="space-y-6">
            <SectionCard
              title="Check-in reciente"
              description="Últimos miembros que ingresaron al gimnasio."
            >
              <div className="space-y-3">
                {recentCheckins.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-xl bg-slate-900/70 px-4 py-2"
                  >
                    <div>
                      <p className="text-sm text-slate-100">{item.name}</p>
                      <p className="mt-0.5 text-xs text-slate-400">
                        {item.plan}
                      </p>
                    </div>
                    <p className="text-xs text-slate-400">{item.time}</p>
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

export default AdminDashboard;
