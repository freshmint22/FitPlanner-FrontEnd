import type { FormEvent } from "react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { registerRequest, type Role } from "@/api/authService";

const RegisterPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("USER");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      return "Todos los campos son obligatorios.";
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      return "Ingresa un correo electrónico válido.";
    }

    if (role === "ADMIN" && !email.toLowerCase().endsWith("@gym.com")) {
      return "Los administradores deben registrarse con un correo @gym.com";
    }

    if (password.length < 8) {
      return "La contraseña debe tener al menos 8 caracteres.";
    }

    if (password !== confirmPassword) {
      return "Las contraseñas no coinciden.";
    }

    return null;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);

      await registerRequest({
        firstName,
        lastName,
        email,
        password,
        role,
      });

      setSuccess("Usuario registrado con éxito, ahora ingresa con tu nueva cuenta!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      console.error(err);
      const axiosErr = err as { response?: { data?: Record<string, unknown> } };
      const apiError = axiosErr?.response?.data;
      if (apiError?.error?.code === "email_exists") {
        setError("Este correo ya existe. Intenta con uno diferente.");
      } else if (!axiosErr?.response) {
        setError("No se pudo conectar al servidor. Intenta más tarde.");
      } else {
        setError(
          "Ocurrió un error al crear la cuenta. Verifica los datos o intenta más tarde."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const onLoginPage = location.pathname === "/login";
  const onRegisterPage = location.pathname === "/register";

  return (
    <div className="page-fade-in min-h-screen flex items-center justify-center bg-slate-50 px-4 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="w-full max-w-md">
        {/* LOGO + TITULO */}
        <div className="flex flex-col items-center mb-6">
          <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-500 via-indigo-500 to-emerald-400 text-white text-3xl font-bold shadow-lg shadow-emerald-500/40">
            FP
          </div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
            FitPlanner Manager
          </h1>
          <p className="text-sm text-slate-600 text-center mt-1 dark:text-slate-400">
            Crea tu cuenta para empezar a registrar tus entrenos y clases.
          </p>
        </div>

        {/* CARD PRINCIPAL */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/80 p-6 sm:p-8 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-black/40">
          {/* BOTÓN VOLVER AL INICIO */}
          <div className="mb-4">
            <Link
              to="/"
              className="inline-flex items-center text-xs font-semibold text-sky-600 hover:text-sky-500 dark:text-sky-400 dark:hover:text-sky-300"
            >
              <span className="mr-1">←</span>
              Volver al inicio
            </Link>
          </div>

          {/* TABS */}
          <div className="flex rounded-xl bg-slate-100 p-1 mb-6 dark:bg-slate-800">
            <Link
              to="/login"
              className={[
                "flex-1 rounded-lg text-center text-sm font-medium py-2 transition",
                onLoginPage
                  ? "bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-slate-50"
                  : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100",
              ].join(" ")}
            >
              Iniciar Sesión
            </Link>
            <Link
              to="/register"
              className={[
                "flex-1 rounded-lg text-center text-sm font-medium py-2 transition",
                onRegisterPage
                  ? "bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-slate-50"
                  : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100",
              ].join(" ")}
            >
              Registrarse
            </Link>
          </div>

          {/* TITULO */}
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
              Crear nueva cuenta
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Completa tus datos para registrarte en FitPlanner.
            </p>
          </div>

          {/* MENSAJES */}
          {error && (
            <div className="mb-4 rounded-lg border border-red-500/30 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-200">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 rounded-lg border border-emerald-500/30 bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-200">
              {success}
            </div>
          )}

          {/* FORMULARIO */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-slate-700 mb-1 dark:text-slate-200"
                >
                  Nombres
                </label>
                <input
                  id="firstName"
                  type="text"
                  className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50 dark:focus:ring-blue-500/30"
                  placeholder="Juan"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-slate-700 mb-1 dark:text-slate-200"
                >
                  Apellidos
                </label>
                <input
                  id="lastName"
                  type="text"
                  className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50 dark:focus:ring-blue-500/30"
                  placeholder="Pérez"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700 mb-1 dark:text-slate-200"
              >
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50 dark:focus:ring-blue-500/30"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-slate-700 mb-1 dark:text-slate-200"
              >
                Rol
              </label>
              <select
                id="role"
                className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50 dark:focus:ring-blue-500/30"
                value={role}
                onChange={(e) => setRole(e.target.value as Role)}
              >
                <option value="USER">Usuario</option>
                <option value="ADMIN">Administrador</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-slate-700 mb-1 dark:text-slate-200"
                >
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 pr-10 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50 dark:focus:ring-blue-500/30"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded px-2 py-1 text-[11px] font-semibold text-slate-500 hover:text-slate-800 focus:outline-none focus:ring-0 dark:text-slate-300 dark:hover:text-slate-100"
                  >
                    {showPassword ? "Ocultar" : "Mostrar"}
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-slate-700 mb-1 dark:text-slate-200"
                >
                  Confirmar contraseña
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 pr-10 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50 dark:focus:ring-blue-500/30"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded px-2 py-1 text-[11px] font-semibold text-slate-500 hover:text-slate-800 focus:outline-none focus:ring-0 dark:text-slate-300 dark:hover:text-slate-100"
                  >
                    {showConfirmPassword ? "Ocultar" : "Mostrar"}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 inline-flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/40 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Creando cuenta..." : "Crear cuenta"}
            </button>
          </form>

          <p className="mt-4 text-[11px] text-center text-slate-500 dark:text-slate-500">
            ¿Ya tienes una cuenta?{" "}
            <Link
              to="/login"
              className="font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Inicia sesión aquí.
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

