import type { FormEvent } from "react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/useAuth";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Por favor ingresa tu correo y contraseña.");
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Credenciales inválidas o error en el servidor.");
    } finally {
      setLoading(false);
    }
  };

  const onLoginPage = location.pathname === "/login";
  const onRegisterPage = location.pathname === "/register";

  return (
    <div className="page-fade-in min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md">
        {/* LOGO + TITULO */}
        <div className="flex flex-col items-center mb-6">
          <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-500 via-indigo-500 to-emerald-400 text-white text-3xl font-bold shadow-lg shadow-emerald-500/40">
            FP
          </div>
          <h1 className="text-2xl font-semibold text-slate-50">
            FitPlanner Manager
          </h1>
          <p className="text-sm text-slate-400 text-center mt-1">
            Gestiona tu gimnasio, tus clases y tus miembros en un solo lugar.
          </p>
        </div>

        {/* CARD PRINCIPAL */}
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl shadow-black/40 p-6 sm:p-8 backdrop-blur">
          {/* BOTÓN VOLVER AL INICIO */}
          <div className="mb-4">
            <Link
              to="/"
              className="inline-flex items-center text-xs font-semibold text-sky-400 hover:text-sky-300"
            >
              <span className="mr-1">←</span>
              Volver al inicio
            </Link>
          </div>

          {/* TABS */}
          <div className="flex rounded-xl bg-slate-800 p-1 mb-6">
            <Link
              to="/login"
              className={[
                "flex-1 rounded-lg text-center text-sm font-medium py-2 transition",
                onLoginPage
                  ? "bg-slate-900 text-slate-50 shadow-sm"
                  : "text-slate-400 hover:text-slate-100",
              ].join(" ")}
            >
              Iniciar Sesión
            </Link>

            <Link
              to="/register"
              className={[
                "flex-1 rounded-lg text-center text-sm font-medium py-2 transition",
                onRegisterPage
                  ? "bg-slate-900 text-slate-50 shadow-sm"
                  : "text-slate-400 hover:text-slate-100",
              ].join(" ")}
            >
              Registrarse
            </Link>
          </div>

          {/* TEXTO BIENVENIDA (centrado) */}
          <div className="mb-4 text-center">
            <h2 className="text-lg font-semibold text-slate-50">Bienvenido</h2>
            <p className="text-sm text-slate-400">
              Ingresa a tu cuenta para gestionar membresías, clases y rutinas.
            </p>
          </div>

          {/* ERROR */}
          {error && (
            <div className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
              {error}
            </div>
          )}

          {/* FORMULARIO */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-200 mb-1"
              >
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                className="block w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-200 mb-1"
              >
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  className="block w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 pr-10 text-sm text-slate-50 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded px-2 py-1 text-[11px] font-semibold text-slate-300 hover:text-slate-100"
                >
                  {showPassword ? "Ocultar" : "Mostrar"}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <input
                  id="remember"
                  type="checkbox"
                  className="h-3.5 w-3.5 rounded border-slate-600 bg-slate-900 text-blue-500 focus:ring-blue-500"
                />
                <label htmlFor="remember">Recordar sesión</label>
              </div>

              {/* LINK A FORGOT PASSWORD */}
              <Link
                to="/forgot"
                className="text-blue-400 hover:text-blue-300 font-medium"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 inline-flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/40 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Ingresando..." : "Ingresar"}
            </button>
          </form>

          <p className="mt-4 text-[11px] text-center text-slate-500">
            Tip: usa "admin@gym.com" para acceso de administrador
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
