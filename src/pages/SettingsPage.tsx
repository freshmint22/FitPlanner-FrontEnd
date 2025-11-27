// src/pages/SettingsPage.tsx
import { useAuth } from "@/context/AuthContext";

const SettingsPage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-full bg-slate-950 pb-10">
      <div className="mx-auto max-w-4xl px-4 pt-6 space-y-6">
        <section className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 shadow-lg shadow-black/30">
          <h2 className="text-sm font-semibold text-slate-50">
            Perfil de usuario
          </h2>
          <p className="text-xs text-slate-400">
            Información básica de tu cuenta en FitPlanner.
          </p>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-[11px] text-slate-500 mb-1">Nombre</p>
              <div className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100">
                {user?.name || "Usuario"}
              </div>
            </div>
            <div>
              <p className="text-[11px] text-slate-500 mb-1">Correo</p>
              <div className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100">
                {user?.email || "—"}
              </div>
            </div>
            <div>
              <p className="text-[11px] text-slate-500 mb-1">Rol</p>
              <div className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100">
                {user?.role === "ADMIN" ? "Administrador" : "Usuario"}
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 shadow-lg shadow-black/30">
          <h2 className="text-sm font-semibold text-slate-50">
            Preferencias
          </h2>
          <p className="text-xs text-slate-400">
            Ajustes de notificaciones y apariencia (placeholder, luego se conecta).
          </p>

          <div className="mt-4 space-y-3 text-xs text-slate-300">
            <label className="flex items-center justify-between rounded-xl bg-slate-950 border border-slate-800 px-3 py-2">
              <div>
                <p className="text-sm text-slate-100">
                  Notificaciones por correo
                </p>
                <p className="text-[11px] text-slate-500">
                  Recordatorios de clases y vencimiento de membresía.
                </p>
              </div>
              <input type="checkbox" className="h-4 w-4" defaultChecked />
            </label>

            <label className="flex items-center justify-between rounded-xl bg-slate-950 border border-slate-800 px-3 py-2">
              <div>
                <p className="text-sm text-slate-100">
                  Tema oscuro
                </p>
                <p className="text-[11px] text-slate-500">
                  FitPlanner ya está en tema dark por defecto.
                </p>
              </div>
              <input type="checkbox" className="h-4 w-4" defaultChecked />
            </label>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SettingsPage;
