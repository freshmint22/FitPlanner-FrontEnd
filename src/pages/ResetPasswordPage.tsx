// src/pages/ResetPasswordPage.tsx
import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";

function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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

    try {
      setLoading(true);
      // aquí llamarías al backend para guardar la nueva contraseña
      await new Promise((res) => setTimeout(res, 1000));

      setSuccess("Tu contraseña fue actualizada correctamente.");
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    } catch (err) {
      console.error(err);
      setError("Error al actualizar la contraseña.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-fade-in min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md">
        {/* LOGO */}
        <div className="flex flex-col items-center mb-6">
          <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-500 via-indigo-500 to-emerald-400 text-white text-3xl font-bold shadow-lg">
            🔐
          </div>
          <h1 className="text-2xl font-semibold text-slate-50">
            Restablecer contraseña
          </h1>
          <p className="text-sm text-slate-400 text-center mt-1">
            Ingresa tu nueva contraseña para continuar.
          </p>
        </div>

        {/* CARD */}
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl p-6 sm:p-8 backdrop-blur">
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
              <label className="block text-sm font-medium text-slate-200 mb-1">
                Nueva contraseña
              </label>
              <input
                type="password"
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 outline-none focus:ring-2 focus:ring-blue-500/30"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-1">
                Confirmar contraseña
              </label>
              <input
                type="password"
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 outline-none focus:ring-2 focus:ring-blue-500/30"
                placeholder="••••••••"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
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
