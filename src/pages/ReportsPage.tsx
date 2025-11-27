// src/pages/ReportsPage.tsx
const ReportsPage = () => {
  return (
    <div className="min-h-full bg-slate-950 pb-10">
      <div className="mx-auto max-w-6xl px-4 pt-6 space-y-6">
        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 shadow-lg shadow-black/30">
            <p className="text-[11px] uppercase tracking-wide text-slate-400">
              Ingresos este mes
            </p>
            <p className="mt-2 text-2xl font-semibold text-emerald-400">
              $18.450.000
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Crecimiento del 12% vs mes anterior.
            </p>
          </div>
          <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 shadow-lg shadow-black/30">
            <p className="text-[11px] uppercase tracking-wide text-slate-400">
              Nuevos miembros
            </p>
            <p className="mt-2 text-2xl font-semibold text-blue-400">34</p>
            <p className="mt-1 text-xs text-slate-500">
              Registrados en los últimos 30 días.
            </p>
          </div>
          <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 shadow-lg shadow-black/30">
            <p className="text-[11px] uppercase tracking-wide text-slate-400">
              Retención
            </p>
            <p className="mt-2 text-2xl font-semibold text-slate-50">86%</p>
            <p className="mt-1 text-xs text-slate-500">
              Miembros que mantienen su plan.
            </p>
          </div>
        </section>

        <section className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 shadow-lg shadow-black/30">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-50">
                Reportes generales
              </h2>
              <p className="text-xs text-slate-400">
                Exporta información clave del gimnasio.
              </p>
            </div>
            <div className="flex gap-2">
              <button className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-slate-100 hover:bg-slate-900">
                Exportar CSV
              </button>
              <button className="rounded-lg bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400 px-3 py-1.5 text-xs font-semibold text-white shadow shadow-emerald-500/40">
                Descargar PDF
              </button>
            </div>
          </div>

          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-center justify-between rounded-xl bg-slate-950 border border-slate-800 px-3 py-2">
              <div>
                <p className="text-sm text-slate-100">
                  Ingresos por tipo de membresía
                </p>
                <p className="text-[11px] text-slate-500">
                  Desglose de ventas por plan y período.
                </p>
              </div>
              <span className="text-[11px] text-slate-400">Mensual</span>
            </li>
            <li className="flex items-center justify-between rounded-xl bg-slate-950 border border-slate-800 px-3 py-2">
              <div>
                <p className="text-sm text-slate-100">
                  Asistencia y ocupación de clases
                </p>
                <p className="text-[11px] text-slate-500">
                  Datos de check-in y uso de salas.
                </p>
              </div>
              <span className="text-[11px] text-slate-400">Semanal</span>
            </li>
            <li className="flex items-center justify-between rounded-xl bg-slate-950 border border-slate-800 px-3 py-2">
              <div>
                <p className="text-sm text-slate-100">
                  Retención y bajas de miembros
                </p>
                <p className="text-[11px] text-slate-500">
                  Renovaciones, cancelaciones y reactivaciones.
                </p>
              </div>
              <span className="text-[11px] text-slate-400">Trimestral</span>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default ReportsPage;
