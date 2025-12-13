import { Link, Outlet, useLocation } from 'react-router-dom';

export default function PublicLayout() {
  const location = useLocation();

  const authRoutes = [
    '/login',
    '/register',
    '/forgot',
    '/forgot/sent',
    '/reset-password',
  ];

  const isAuthRoute = authRoutes.some((path) =>
    location.pathname.startsWith(path),
  );

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col">
      {/* NAVBAR SOLO PARA RUTAS PÚBLICAS NORMALES (NO AUTH) */}
      {!isAuthRoute && (
        <header className="border-b border-slate-800/60 bg-[#020617]/85 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 lg:px-8">
            {/* Logo + nombre */}
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-emerald-500 text-sm font-semibold text-slate-950 shadow-lg">
                FP
              </div>
              <div className="leading-tight">
                <p className="text-xs font-medium text-slate-400">
                  FITPLANNER MANAGER
                </p>
                <p className="text-sm font-semibold text-slate-100">
                  Gym Management
                </p>
              </div>
            </div>

            {/* Acciones derecha */}
            <nav className="flex items-center gap-3 text-xs font-semibold">
              {/* Iniciar sesión */}
              <Link
                to="/login"
                className="btn-raise rounded-2xl px-4 py-2 border border-slate-700/80 bg-slate-950/60 text-slate-100 hover:bg-slate-900"
              >
                Iniciar sesión
              </Link>

              {/* Crear cuenta */}
              <Link
                to="/register"
                className="btn-raise rounded-2xl px-4 py-2 bg-sky-500 text-white hover:bg-sky-400"
              >
                Crear cuenta
              </Link>
            </nav>
          </div>
        </header>
      )}

      {/* CONTENIDO */}
      <main className="flex-1">
        {isAuthRoute ? (
          // Las vistas de auth ya manejan su propio layout (min-h-screen, centrado)
          <Outlet />
        ) : (
          <div className="mx-auto max-w-6xl px-4 py-10 lg:px-8 lg:py-16">
            <Outlet />
          </div>
        )}
      </main>

      {/* FOOTER SOLO PARA RUTAS PÚBLICAS NORMALES */}
      {!isAuthRoute && (
        <footer className="border-t border-slate-800/60 bg-[#020617]/95">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 text-[11px] text-slate-500 lg:px-8">
            <span>© 2025 FitPlanner Manager.</span>
            <span>
              Diseñado para administrar gimnasios, entrenadores y miembros.
            </span>
          </div>
        </footer>
      )}
    </div>
  );
}
