// src/pages/SettingsPage.tsx
import { PageHeader } from "@/components/ui/PageHeader";
import { PageSection } from "@/components/ui/PageSection";
import { useAuth } from "@/context/useAuth";

export default function SettingsPage() {
  // Por ahora todo es estático / maqueta. Luego lo conectas al backend.
  const { user } = useAuth();
  const memberSince = "Enero 2024";
  const fullName = user?.name?.trim() ?? "";
  const [firstName = "", ...restName] = fullName.split(/\s+/).filter(Boolean);
  const lastName = restName.join(" ");
  const email = user?.email ?? "";
  const phone = (user as { phone?: string })?.phone ?? "";
  const birthDate = (user as { birthDate?: string })?.birthDate ?? "";
  const gender = (user as { gender?: string })?.gender ?? "";
  const initials = fullName
    ? fullName
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? "")
        .join("")
    : "FP";

  return (
    <div className="flex flex-col gap-6 page-fade-in">
      {/* Encabezado principal del perfil */}
      <PageHeader
        pill="Mi gimnasio"
        title="Mi perfil"
        subtitle="Gestiona tu información personal y los detalles de tu membresía en FitPlanner."
      />

      {/* Bloque superior: foto + información personal */}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,2fr)]">
        {/* Foto de perfil */}
        <section className="rounded-3xl border border-slate-200 bg-white px-6 py-6 shadow-lg shadow-slate-200/60 dark:border-slate-800 dark:bg-slate-950/80 dark:shadow-[0_18px_45px_rgba(15,23,42,0.9)]">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Foto de perfil
          </h2>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
            Gestiona la foto asociada a tu cuenta de FitPlanner.
          </p>

          <div className="mt-6 flex flex-col items-center gap-4">
            <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 via-indigo-500 to-emerald-400 text-3xl font-semibold text-white shadow-lg shadow-emerald-500/40">
              {initials}
            </div>

            <div className="text-center">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {fullName || "Administrador"}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Miembro desde {memberSince}
              </p>
            </div>

            <button
              type="button"
              className="mt-2 text-xs font-semibold text-sky-600 hover:text-sky-500 dark:text-sky-400 dark:hover:text-sky-300"
            >
              Cambiar foto de perfil
            </button>
          </div>
        </section>

        {/* Información personal */}
        <section className="rounded-3xl border border-slate-200 bg-white px-6 py-6 shadow-lg shadow-slate-200/60 dark:border-slate-800 dark:bg-slate-950/80 dark:shadow-[0_18px_45px_rgba(15,23,42,0.9)]">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Información personal
          </h2>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
            Actualiza tus datos personales para mantener tu perfil al día.
          </p>

          <form className="mt-5 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label
                  htmlFor="firstName"
                  className="mb-1 block text-xs font-medium text-slate-300"
                >
                  Nombre
                </label>
                <input
                  id="firstName"
                  type="text"
                  defaultValue={firstName}
                  className="h-10 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-50"
                />
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="mb-1 block text-xs font-medium text-slate-300"
                >
                  Apellido
                </label>
                <input
                  id="lastName"
                  type="text"
                  defaultValue={lastName}
                  className="h-10 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-50"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-1 block text-xs font-medium text-slate-300"
              >
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                defaultValue={email}
                className="h-10 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-50"
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="mb-1 block text-xs font-medium text-slate-300"
              >
                Teléfono
              </label>
              <input
                id="phone"
                type="tel"
                defaultValue={phone}
                placeholder={phone ? undefined : "agregar numero"}
                className="h-10 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-50"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label
                  htmlFor="birthDate"
                  className="mb-1 block text-xs font-medium text-slate-300"
                >
                  Fecha de nacimiento
                </label>
                <input
                  id="birthDate"
                  type="date"
                  defaultValue={birthDate}
                  className="h-10 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-50"
                />
              </div>

              <div>
                <label
                  htmlFor="gender"
                  className="mb-1 block text-xs font-medium text-slate-300"
                >
                  Género
                </label>
                <select
                  id="gender"
                  defaultValue={gender || ""}
                  className="h-10 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-50 dark:focus:ring-sky-500/30"
                >
                  <option value="">Seleccionar</option>
                  <option value="masculino">Masculino</option>
                  <option value="femenino">Femenino</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                type="button"
                className="btn-raise inline-flex items-center justify-center rounded-2xl bg-sky-600 px-5 py-2 text-xs font-semibold text-white shadow hover:bg-sky-500 dark:bg-sky-500 dark:hover:bg-sky-400"
              >
                Guardar cambios
              </button>
            </div>
          </form>
        </section>
      </div>

      {/* Información de membresía */}
      <PageSection
        title="Información de membresía"
        description="Detalles de tu plan actual en el gimnasio."
      >
        <div className="rounded-3xl border border-slate-200 bg-white px-6 py-5 text-sm text-slate-900 dark:border-slate-800 dark:bg-slate-950/80 dark:text-slate-100">
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400">
              Plan actual
            </p>
            <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-50">
              Premium Mensual
            </p>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
              Acceso completo a todas las áreas del gimnasio y clases grupales.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-4 text-xs">
            <div>
              <p className="text-slate-600 dark:text-slate-400">Estado</p>
              <p className="mt-1 font-semibold text-emerald-400">Activo</p>
            </div>
            <div>
              <p className="text-slate-400">Fecha de inicio</p>
              <p className="mt-1 font-semibold text-slate-900 dark:text-slate-100">01 / 01 / 2024</p>
            </div>
            <div>
              <p className="text-slate-400">Renovación</p>
              <p className="mt-1 font-semibold text-slate-900 dark:text-slate-100">01 / 04 / 2024</p>
            </div>
            <div>
              <p className="text-slate-400">Próximo cobro</p>
              <p className="mt-1 font-semibold text-slate-900 dark:text-slate-100">
                $120.000 COP
              </p>
            </div>
          </div>
        </div>
      </PageSection>
    </div>
  );
}
