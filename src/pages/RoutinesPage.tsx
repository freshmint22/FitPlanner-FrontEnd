// src/pages/RoutinesPage.tsx
const mockRoutines = [
  {
    id: 1,
    name: "Definición y resistencia",
    frequency: "4 días / semana",
    focus: "Fuerza + core",
    status: "Activa",
  },
  {
    id: 2,
    name: "Hipertrofia tren superior",
    frequency: "3 días / semana",
    focus: "Pecho, espalda, brazos",
    status: "Activa",
  },
  {
    id: 3,
    name: "Inicio en el gym",
    frequency: "2 días / semana",
    focus: "Full body básico",
    status: "Borrador",
  },
];

const RoutinesPage = () => {
  return (
    <div className="min-h-full bg-slate-950 pb-10">
      <div className="mx-auto max-w-6xl px-4 pt-6 space-y-6">
        {/* Resumen rápido */}
        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 shadow-lg shadow-black/30">
            <p className="text-[11px] uppercase tracking-wide text-slate-400">
              Rutinas activas
            </p>
            <p className="mt-2 text-2xl font-semibold text-emerald-400">2</p>
            <p className="mt-1 text-xs text-slate-500">
              Rutinas actualmente en ejecución.
            </p>
          </div>
          <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 shadow-lg shadow-black/30">
            <p className="text-[11px] uppercase tracking-wide text-slate-400">
              Días planificados
            </p>
            <p className="mt-2 text-2xl font-semibold text-slate-50">4</p>
            <p className="mt-1 text-xs text-slate-500">
              Días totales de entrenamiento esta semana.
            </p>
          </div>
          <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 shadow-lg shadow-black/30">
            <p className="text-[11px] uppercase tracking-wide text-slate-400">
              Progreso semanal
            </p>
            <p className="mt-2 text-2xl font-semibold text-blue-400">3 / 4</p>
            <div className="mt-2 h-2 rounded-full bg-slate-800">
              <div className="h-2 w-3/4 rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400" />
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Sesiones completadas esta semana.
            </p>
          </div>
        </section>

        {/* Lista de rutinas */}
        <section className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 shadow-lg shadow-black/30">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-50">
                Tus rutinas
              </h2>
              <p className="text-xs text-slate-400">
                Gestiona y revisa tus planes de entrenamiento.
              </p>
            </div>
            <button className="rounded-lg bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400 px-3 py-1.5 text-xs font-semibold text-white shadow shadow-emerald-500/40">
              Crear rutina
            </button>
          </div>

          <div className="space-y-3">
            {mockRoutines.map((routine) => (
              <div
                key={routine.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 rounded-xl border border-slate-800 bg-slate-950 px-3 py-3"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-50">
                    {routine.name}
                  </p>
                  <p className="text-xs text-slate-400">
                    {routine.frequency} · {routine.focus}
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-300">
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                      routine.status === "Activa"
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-slate-600/20 text-slate-300"
                    }`}
                  >
                    {routine.status}
                  </span>
                  <button className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-slate-100 hover:bg-slate-800">
                    Ver detalles
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default RoutinesPage;
