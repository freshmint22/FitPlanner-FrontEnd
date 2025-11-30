// src/pages/EmailSentPage.tsx
import { Link } from "react-router-dom";

function EmailSentPage() {
  return (
    <div className="page-fade-in min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md text-center">
        {/* LOGO / ICONO */}
        <div className="flex flex-col items-center mb-6">
          <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-500 via-indigo-500 to-emerald-400 text-white text-3xl font-bold shadow-lg">
            ✔
          </div>
          <h1 className="text-xl font-semibold text-slate-50">
            Correo enviado
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Si el correo existe en nuestro sistema, recibirás un enlace para
            restablecer tu contraseña.
          </p>
        </div>

        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 sm:p-8 shadow-xl backdrop-blur space-y-6">
          <p className="text-slate-300 text-sm">
            Revisa tu bandeja de entrada o la carpeta de spam.
          </p>

          <Link
            to="/reset-password"
            className="inline-flex items-center justify-center w-full rounded-lg bg-sky-500 hover:bg-sky-400 py-2.5 text-sm font-semibold text-white shadow-md"
          >
            Ir a restablecer contraseña
          </Link>

          <Link
            to="/login"
            className="block text-xs font-semibold text-sky-400 hover:text-sky-300"
          >
            ← Volver al inicio de sesión
          </Link>
        </div>
      </div>
    </div>
  );
}

export default EmailSentPage;
