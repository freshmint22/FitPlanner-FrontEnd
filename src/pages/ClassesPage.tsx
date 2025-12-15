// src/pages/ClassesPage.tsx
import AIChatbot from '@/components/AIChatbot';
const mockClasses = [
  {
    id: 1,
    name: "Funcional Full Body",
    level: "Intermedio",
    room: "Sala 2",
    hour: "6:00 a.m.",
    trainer: "Laura Gómez",
    spots: "18 / 20",
  },
  {
    id: 2,
    name: "Spinning Cardio",
    level: "Alta intensidad",
    room: "Sala Cardio",
    hour: "7:30 a.m.",
    trainer: "Carlos Ruiz",
    spots: "15 / 18",
  },
  {
    id: 3,
    name: "Cross Training",
    level: "Avanzado",
    room: "Sala 1",
    hour: "6:30 p.m.",
    trainer: "Miguel Rojas",
    spots: "22 / 25",
  },
];

const ClassesPage = () => {
  return (
    <div className="min-h-full bg-slate-950 pb-10">
      <div className="mx-auto max-w-6xl px-4 pt-6 space-y-6">
        {/* Resumen rápido */}
        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 shadow-lg shadow-black/30">
            <p className="text-[11px] uppercase tracking-wide text-slate-400">
              Clases de hoy
            </p>
            <p className="mt-2 text-2xl font-semibold text-slate-50">9</p>
            <p className="mt-1 text-xs text-slate-500">
              Entre fuerza, cardio y funcional.
            </p>
          </div>
          <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 shadow-lg shadow-black/30">
            <p className="text-[11px] uppercase tracking-wide text-slate-400">
              Ocupación promedio
            </p>
            <p className="mt-2 text-2xl font-semibold text-emerald-400">78%</p>
            <div className="mt-2 h-2 rounded-full bg-slate-800">
              <div className="h-2 w-4/5 rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400" />
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Basado en reservas vs cupos disponibles.
            </p>
          </div>
          <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 shadow-lg shadow-black/30">
            <p className="text-[11px] uppercase tracking-wide text-slate-400">
              Próxima clase
            </p>
            <p className="mt-2 text-base font-semibold text-slate-50">
              Funcional Full Body
            </p>
            <p className="text-xs text-slate-400">Hoy · 6:00 a.m. · Sala 2</p>
          </div>
        </section>

        {/* Listado de clases */}
        <section className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 shadow-lg shadow-black/30">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-50">
                Clases del día
              </h2>
              <p className="text-xs text-slate-400">
                Revisa y gestiona las clases programadas.
              </p>
            </div>
            <div className="flex gap-2">
              <button className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-slate-100 hover:bg-slate-900">
                Ver calendario
              </button>
              <button className="rounded-lg bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400 px-3 py-1.5 text-xs font-semibold text-white shadow shadow-emerald-500/40">
                Nueva clase
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {mockClasses.map((cls) => (
              <div
                key={cls.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 rounded-xl border border-slate-800 bg-slate-950 px-3 py-3"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-50">
                    {cls.name}
                  </p>
                  <p className="text-xs text-slate-400">
                    {cls.hour} · {cls.room}
                  </p>
                  <p className="mt-1 text-[11px] text-slate-500">
                    Entrenador:{" "}
                    <span className="font-medium text-slate-200">
                      {cls.trainer}
                    </span>{" "}
                    · Nivel: {cls.level}
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-300">
                  <div className="text-right">
                    <p className="text-[11px] text-slate-500">Cupos</p>
                    <p className="font-semibold">{cls.spots}</p>
                  </div>
                  <button className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-slate-100 hover:bg-slate-800">
                    Ver detalles
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Asistente IA */}
        <section className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 shadow-lg shadow-black/30">
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-slate-50">Asistente IA</h2>
            <p className="text-xs text-slate-400">Haz preguntas rápidas sobre clases, horarios y entrenadores.</p>
          </div>

          <div>
            <AIChatbot />
          </div>
        </section>
      </div>
    </div>
  );
};

export default ClassesPage;
