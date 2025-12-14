// src/pages/SettingsPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/ui/PageHeader";
import { PageSection } from "@/components/ui/PageSection";
import { useAuth } from "@/context/useAuth";
import { changePasswordRequest, deleteAccountRequest } from "@/api/authService";

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
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

      {/* Seguridad */}
      <PageSection
        title="Seguridad"
        description="Administra tu contraseña y la seguridad de tu cuenta."
      >
        <div className="rounded-3xl border border-slate-200 bg-white px-6 py-6 shadow-lg shadow-slate-200/60 dark:border-slate-800 dark:bg-slate-950/80 dark:shadow-[0_18px_45px_rgba(15,23,42,0.9)]">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Cambiar contraseña
          </h2>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
            Actualiza tu contraseña para mantener tu cuenta segura.
          </p>

          <form className="mt-5 space-y-4" onSubmit={async (e) => {
            e.preventDefault();
            setPasswordError("");
            setPasswordSuccess("");

            if (!currentPassword || !newPassword || !confirmPassword) {
              setPasswordError("Todos los campos son requeridos");
              return;
            }

            if (newPassword !== confirmPassword) {
              setPasswordError("Las contraseñas nuevas no coinciden");
              return;
            }

            if (newPassword.length < 8) {
              setPasswordError("La nueva contraseña debe tener mínimo 8 caracteres");
              return;
            }

            try {
              setIsChangingPassword(true);
              await changePasswordRequest({ currentPassword, newPassword });
              setPasswordSuccess("Contraseña actualizada exitosamente");
              setCurrentPassword("");
              setNewPassword("");
              setConfirmPassword("");
            } catch (error: any) {
              setPasswordError(error.response?.data?.message || "Error al cambiar la contraseña");
            } finally {
              setIsChangingPassword(false);
            }
          }}>
            {passwordError && (
              <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-950/30 dark:text-red-400">
                {passwordError}
              </div>
            )}
            {passwordSuccess && (
              <div className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400">
                {passwordSuccess}
              </div>
            )}
            <div>
              <label
                htmlFor="currentPassword"
                className="mb-1 block text-xs font-medium text-slate-300"
              >
                Contraseña actual
              </label>
              <div className="relative">
                <input
                  id="currentPassword"
                  type={showPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Ingresa tu contraseña actual"
                  className="h-10 w-full rounded-xl border border-slate-300 bg-white px-3 pr-10 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="newPassword"
                className="mb-1 block text-xs font-medium text-slate-300"
              >
                Nueva contraseña
              </label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Ingresa tu nueva contraseña"
                className="h-10 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-50"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-1 block text-xs font-medium text-slate-300"
              >
                Confirmar nueva contraseña
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirma tu nueva contraseña"
                className="h-10 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-50"
              />
            </div>

            <div className="mt-4 flex justify-end">
              <button
                type="submit"
                disabled={isChangingPassword}
                className="btn-raise inline-flex items-center justify-center rounded-2xl bg-sky-600 px-5 py-2 text-xs font-semibold text-white shadow hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-sky-500 dark:hover:bg-sky-400"
              >
                {isChangingPassword ? "Actualizando..." : "Actualizar contraseña"}
              </button>
            </div>
          </form>
        </div>
      </PageSection>

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

      {/* Zona de peligro */}
      <PageSection
        title="Zona de peligro"
        description="Acciones irreversibles que afectarán permanentemente tu cuenta."
      >
        <div className="rounded-3xl border border-red-200 bg-red-50/50 px-6 py-5 dark:border-red-900/50 dark:bg-red-950/20">
          <h3 className="text-sm font-semibold text-red-900 dark:text-red-400">
            Eliminar cuenta
          </h3>
          <p className="mt-1 text-xs text-red-700 dark:text-red-400/80">
            Una vez que elimines tu cuenta, no hay vuelta atrás. Por favor, asegúrate de que esto es lo que deseas.
          </p>
          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="mt-4 inline-flex items-center justify-center rounded-2xl bg-red-600 px-5 py-2 text-xs font-semibold text-white shadow hover:bg-red-500 dark:bg-red-600 dark:hover:bg-red-500"
          >
            Eliminar cuenta
          </button>
        </div>
      </PageSection>

      {/* Modal de confirmación de eliminación */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-950">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              ¿Estás seguro?
            </h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Esta acción es irreversible. Para confirmar la eliminación de tu cuenta, escribe <strong>ELIMINAR</strong> en el campo a continuación.
            </p>

            {deleteError && (
              <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-950/30 dark:text-red-400">
                {deleteError}
              </div>
            )}

            <input
              type="text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="Escribe ELIMINAR"
              className="mt-4 h-10 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/30 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-50"
            />

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmText("");
                  setDeleteError("");
                }}
                disabled={isDeletingAccount}
                className="flex-1 rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={deleteConfirmText !== "ELIMINAR" || isDeletingAccount}
                onClick={async () => {
                  try {
                    setIsDeletingAccount(true);
                    setDeleteError("");
                    await deleteAccountRequest();
                    setShowDeleteModal(false);
                    setDeleteConfirmText("");
                    logout();
                    navigate("/login");
                  } catch (error: any) {
                    setDeleteError(error.response?.data?.message || "Error al eliminar la cuenta");
                  } finally {
                    setIsDeletingAccount(false);
                  }
                }}
                className="flex-1 rounded-2xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-red-600"
              >
                {isDeletingAccount ? "Eliminando..." : "Eliminar cuenta"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
