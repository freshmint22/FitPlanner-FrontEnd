// src/pages/ResetPasswordPage.tsx
import { useState, type FormEvent, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axiosClient from "@/api/axiosClient";

function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setError("Token de recuperación no válido o expirado.");
    }
  }, [token]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!password || !confirm) {
      return setError("Todos los campos son obligatorios.");
    }

    if (password.length < 8) {
      return setError("La contraseña debe tener al menos 8 caracteres.");
    }

    if (password !== confirm) {
      return setError("Las contraseñas no coinciden.");
    }

    if (!token) {
      return setError("Token de recuperación no válido.");
    }

    try {
      setLoading(true);
      const response = await axiosClient.post("/auth/reset-password", {
        token,
        password,
      });

      if (response.data?.ok) {
        setSuccess("Tu contraseña fue actualizada correctamente.");
        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
      } else {
        setError("Error al actualizar la contraseña. El token podría haber expirado.");
      }
    } catch (err) {
      console.error("Reset password error:", err);
      setError("Error al actualizar la contraseña. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-fade-in min-h-screen flex items-center justify-center bg-slate-50 px-4 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="w-full max-w-md">
        {/* LOGO */}
        <div className="flex flex-col items-center mb-6">
          <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-500 via-indigo-500 to-emerald-400 text-white text-3xl font-bold shadow-lg">
            🔐
          </div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
            Restablecer contraseña
          </h1>
          <p className="text-sm text-slate-600 text-center mt-1 dark:text-slate-400">
            Ingresa tu nueva contraseña para continuar.
          </p>
        </div>

        {/* CARD */}
        <div className="rounded-2xl bg-white border border-slate-200 shadow-xl p-6 sm:p-8 backdrop-blur dark:bg-slate-900/80 dark:border-slate-800">
          <div className="mb-4">
            <Link
              to="/login"
              className="text-xs font-semibold text-sky-400 hover:text-sky-300"
            >
              ← Volver al inicio de sesión
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                {error}
              </div>
            )}

            {success && (
              <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
                {success}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1 dark:text-slate-200">
                Nueva contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 pr-10 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded px-2 py-1 text-[11px] font-semibold text-slate-300 hover:text-slate-100"
                >
                  {showPassword ? "Ocultar" : "Mostrar"}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1 dark:text-slate-200">
                Confirmar contraseña
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 pr-10 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50"
                  placeholder="••••••••"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded px-2 py-1 text-[11px] font-semibold text-slate-300 hover:text-slate-100"
                >
                  {showConfirm ? "Ocultar" : "Mostrar"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400 py-2.5 text-sm font-semibold text-white shadow-md hover:brightness-110 disabled:opacity-60"
            >
              {loading ? "Guardando..." : "Guardar contraseña"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
