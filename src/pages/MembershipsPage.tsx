// src/pages/MembershipsPage.tsx
const mockPlans = [
  {
    id: 1,
    name: "Mensual Premium",
    price: "$150.000",
    features: "Acceso total + clases ilimitadas",
    members: 120,
  },
  {
    id: 2,
    name: "Mensual",
    price: "$90.000",
    features: "Acceso general + 4 clases",
    members: 80,
  },
  {
    id: 3,
    name: "Trimestral",
    price: "$240.000",
    features: "Acceso general · 3 meses",
    members: 35,
  },
];

const MembershipsPage = () => {
  return (
    <div className="min-h-full bg-slate-950 pb-10">
      <div className="mx-auto max-w-6xl px-4 pt-6 space-y-6">
        <section className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 shadow-lg shadow-black/30">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-50">
                Planes de membresía
              </h2>
              <p className="text-xs text-slate-400">
                Define los planes disponibles para tus miembros.
              </p>
            </div>
            <button className="rounded-lg bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400 px-3 py-1.5 text-xs font-semibold text-white shadow shadow-emerald-500/40">
              Nuevo plan
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {mockPlans.map((plan) => (
              <div
                key={plan.id}
                className="rounded-2xl border border-slate-800 bg-slate-950 p-4 shadow-md shadow-black/30"
              >
                <p className="text-xs font-semibold text-slate-400 uppercase">
                  {plan.name}
                </p>
                <p className="mt-2 text-xl font-semibold text-emerald-400">
                  {plan.price}
                </p>
                <p className="mt-1 text-xs text-slate-400">{plan.features}</p>
                <p className="mt-3 text-[11px] text-slate-500">
                  Miembros activos:{" "}
                  <span className="font-semibold text-slate-200">
                    {plan.members}
                  </span>
                </p>
                <div className="mt-4 flex gap-2 text-xs">
                  <button className="flex-1 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-slate-100 hover:bg-slate-800">
                    Editar
                  </button>
                  <button className="flex-1 rounded-lg border border-red-500/60 bg-red-500/10 px-3 py-1.5 text-red-300 hover:bg-red-500/20">
                    Desactivar
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

export default MembershipsPage;
