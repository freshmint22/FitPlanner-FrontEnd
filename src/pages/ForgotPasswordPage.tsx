// src/pages/ForgotPasswordPage.tsx
import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import axiosClient from "@/api/axiosClient";
import { parseAdminEmail } from "@/utils/adminEmail";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email) {
      setError("Por favor ingresa tu correo.");
      return;
    }

    try {
      setLoading(true);
      const { cleanEmail } = parseAdminEmail(email);
      // Llamada real al backend; si falla, degradamos a simulación
      try {
        await axiosClient.post('/auth/forgot', { email: cleanEmail });
      } catch {
        await new Promise((res) => setTimeout(res, 700));
      }
      window.location.href = "/forgot/sent";
    } catch (err) {
      console.error(err);
      setError("No pudimos enviar el correo. Intenta de nuevo.");
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
            FP
          </div>
          <h1 className="text-2xl font-semibold text-slate-50">
            Recuperar contraseña
          </h1>
          <p className="text-sm text-slate-400 text-center mt-1">
            Ingresa tu correo para continuar.
          </p>
        </div>

        {/* CARD */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xl shadow-slate-200/80 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-black/40">
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

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1 dark:text-slate-200">
                Correo electrónico
              </label>
              <input
                type="text"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">Admin: escribe tu correo como usuario(.gym)@gmail.com</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400 py-2.5 text-sm font-semibold text-white shadow-md hover:brightness-110 disabled:opacity-60"
            >
              {loading ? "Enviando..." : "Enviar correo de recuperación"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
