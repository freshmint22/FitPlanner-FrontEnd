import type { FormEvent } from "react";
import { useEffect, useState } from "react";
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

  // Role is explicitly selected by the user via the role dropdown.

  const validateForm = () => {
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      return "Todos los campos son obligatorios.";
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      return "Ingresa un correo electrónico válido.";
    }

    // No special email marker required for ADMIN — role selection controls it.

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

      setError(
        "Ocurrió un error al crear la cuenta. Verifica los datos o intenta más tarde."
      );
    } finally {
      setLoading(false);
    }
  };

  const onLoginPage = location.pathname === "/login";
  const onRegisterPage = location.pathname === "/register";

  return (
    <div className="page-fade-in min-h-screen flex items-center justify-center bg-slate-50 px-4 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-500 via-indigo-500 to-emerald-400 text-white text-3xl font-bold shadow-lg shadow-emerald-500/40">FP</div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">FitPlanner Manager</h1>
          <p className="text-sm text-slate-600 text-center mt-1 dark:text-slate-400">Crea tu cuenta para empezar a registrar tus entrenos y clases.</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-xl p-6 sm:p-8">
          <div className="mb-4">
            <Link to="/" className="inline-flex items-center text-xs font-semibold text-sky-600">← Volver al inicio</Link>
          </div>

          <div className="mb-4">
            <h2 className="text-lg font-semibold">Crear nueva cuenta</h2>
            <p className="text-sm text-slate-600">Completa tus datos para registrarte en FitPlanner.</p>
          </div>

          {error && <div className="mb-4 rounded-lg border border-red-500/30 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}
          {success && <div className="mb-4 rounded-lg border border-emerald-500/30 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{success}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium mb-1">Nombres</label>
                <input id="firstName" type="text" placeholder="Juan" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="block w-full rounded-lg border px-3 py-2" />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium mb-1">Apellidos</label>
                <input id="lastName" type="text" placeholder="Pérez" value={lastName} onChange={(e) => setLastName(e.target.value)} className="block w-full rounded-lg border px-3 py-2" />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">Correo electrónico</label>
              <input id="email" type="email" autoComplete="email" placeholder="tu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="block w-full rounded-lg border px-3 py-2" />
            </div>

            <div>
              <p className="mt-1 text-[11px] text-slate-500">Selecciona el rol apropiado para tu cuenta.</p>
              <label htmlFor="role" className="block text-sm font-medium mb-1">Rol</label>
              <select id="role" value={role} onChange={(e) => setRole(e.target.value as Role)} className="block w-full rounded-lg border px-3 py-2">
                <option value="USER">Usuario</option>
                <option value="ADMIN">Administrador</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-1">Contraseña</label>
                <input id="password" type={showPassword ? "text" : "password"} autoComplete="new-password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="block w-full rounded-lg border px-3 py-2" />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">Confirmar contraseña</label>
                <input id="confirmPassword" type={showConfirmPassword ? "text" : "password"} autoComplete="new-password" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="block w-full rounded-lg border px-3 py-2" />
              </div>
            </div>

            <button type="submit" disabled={loading} className="mt-2 w-full rounded-lg bg-blue-500 px-4 py-2 text-white">{loading ? "Creando cuenta..." : "Crear cuenta"}</button>
          </form>

          <p className="mt-4 text-[11px] text-center text-slate-500">¿Ya tienes una cuenta? <Link to="/login" className="font-semibold text-blue-600">Inicia sesión aquí.</Link></p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

