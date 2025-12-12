// src/layouts/MainLayout.tsx
import { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/useAuth';
import { GlobalAnimations } from '@/components/ui/GlobalAnimations'; // 👈 CAMBIO


// Tipado simple para los ítems del menú
interface NavItem {
  label: string;
  to: string;
  icon?: string;
}

const userNav: NavItem[] = [
  { label: 'Dashboard usuario', to: '/dashboard', icon: '🏠' },
  { label: 'Clases', to: '/classes', icon: '📅' },
  { label: 'Rutinas', to: '/routines', icon: '💪' },
];

const adminNav: NavItem[] = [
  { label: 'Dashboard admin', to: '/admin', icon: '📊' },
  { label: 'Miembros', to: '/members', icon: '🧑‍🤝‍🧑' },
  { label: 'Membresías', to: '/memberships', icon: '💳' },
  { label: 'Reportes', to: '/reports', icon: '📈' },
];

const accountNav: NavItem[] = [
  { label: 'Perfil', to: '/settings', icon: '🕴️' },
];

// Botón hamburguesa (solo móvil)
function BurgerButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center justify-center rounded-[1.75rem] border border-slate-700/70 bg-slate-900/80 p-3 text-slate-100 shadow-sm backdrop-blur lg:hidden"
    >
      <span className="sr-only">Abrir menú</span>
      <span className="flex flex-col gap-1.5">
        <span className="h-1 w-6 rounded-full bg-slate-100" />
        <span className="h-1 w-6 rounded-full bg-slate-100" />
        <span className="h-1 w-6 rounded-full bg-slate-100" />
      </span>
    </button>
  );
}

interface SidebarProps {
  onClose?: () => void;
  isMobile?: boolean;
  className?: string;
}

function Sidebar({ onClose, isMobile = false, className = '' }: SidebarProps) {
  const { user, logout } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const handleLogout = () => {
    logout();
    if (onClose) onClose();
  };

  const baseClasses = isMobile
    ? 'flex h-full w-72 flex-col overflow-y-auto bg-[#020617]/95 text-slate-100 shadow-2xl backdrop-blur'
    : 'hidden w-72 flex-col overflow-y-auto border-r border-slate-800/70 bg-[#020617] text-slate-100 lg:flex lg:h-screen lg:sticky lg:top-0';

  return (
    <aside className={`${baseClasses} ${className}`}>
      <div className="flex flex-1 flex-col">
        {/* Header del sidebar */}
        <div className="flex items-center justify-between border-b border-slate-800/60 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-emerald-500 text-sm font-semibold text-slate-950 shadow-lg">
              FP
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-xs font-medium text-slate-400">
                FITPLANNER MANAGER
              </span>
              <span className="text-sm font-semibold text-slate-100">
                Gym Management
              </span>
            </div>
          </div>

          {isMobile && (
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-slate-700/70 bg-slate-900/80 px-3 py-1 text-xs font-medium text-slate-100 shadow"
            >
              Cerrar
            </button>
          )}
        </div>

        {/* Navegación */}
        <nav className="flex-1 space-y-8 px-4 py-6">
          {/* Sección usuario */}
          <div>
            <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              General
            </p>
            <div className="space-y-1">
              {userNav.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    [
                      'flex items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium transition',
                      isActive
                        ? 'bg-gradient-to-r from-fuchsia-500/20 via-indigo-500/20 to-cyan-500/20 text-slate-50 shadow-[0_0_25px_rgba(59,130,246,0.35)]'
                        : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-50',
                    ].join(' ')
                  }
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
          </div>

          {/* Sección administración (solo ADMIN) */}
          {isAdmin && (
            <div>
              <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Administración
              </p>
              <div className="space-y-1">
                {adminNav.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={onClose}
                    className={({ isActive }) =>
                      [
                        'flex items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium transition',
                        isActive
                          ? 'bg-gradient-to-r from-fuchsia-500/20 via-indigo-500/20 to-cyan-500/20 text-slate-50 shadow-[0_0_25px_rgba(59,130,246,0.35)]'
                          : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-50',
                      ].join(' ')
                    }
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.label}</span>
                  </NavLink>
                ))}
              </div>
            </div>
          )}

          {/* Sección cuenta */}
          <div>
            <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Cuenta
            </p>
            <div className="space-y-1">
              {accountNav.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    [
                      'flex items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium transition',
                      isActive
                        ? 'bg-gradient-to-r from-fuchsia-500/20 via-indigo-500/20 to-cyan-500/20 text-slate-50 shadow-[0_0_25px_rgba(59,130,246,0.35)]'
                        : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-50',
                    ].join(' ')
                  }
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
          </div>
        </nav>

        {/* Bloque usuario + logout */}
        <div className="border-t border-slate-800/70 px-4 py-4">
          <div className="rounded-2xl bg-slate-900/80 px-4 py-3 shadow-inner">
            <div className="mb-2 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 text-sm font-semibold text-slate-50">
                {user?.name?.[0]?.toUpperCase() ?? 'U'}
              </div>
              <div className="leading-tight">
                <p className="text-xs font-medium text-slate-400">
                  {user?.role === 'ADMIN' ? 'Administrador' : 'Usuario'}
                </p>
                <p className="text-sm font-semibold text-slate-100">
                  {user?.name ?? 'Sesión activa'}
                </p>
                {user?.email && (
                  <p className="truncate text-[11px] text-slate-500">
                    {user.email}
                  </p>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="mt-2 inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-rose-500 to-red-500 px-3 py-2 text-xs font-semibold text-white shadow hover:from-rose-400 hover:to-red-400"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarClosing, setSidebarClosing] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  const openSidebar = () => {
    setSidebarClosing(false);
    setSidebarOpen(true);
  };

  const startCloseSidebar = () => {
    setSidebarClosing(true);
    setTimeout(() => {
      setSidebarOpen(false);
      setSidebarClosing(false);
    }, 280);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100">
      {/* 🔁 Animaciones globales (page-fade-in, card-pop, etc.) */}
      <GlobalAnimations />

      <div className="flex min-h-screen">
        {/* Sidebar escritorio con animación al montar */}
        <Sidebar className="sidebar-animate-in" />

        {/* Overlay + sidebar móvil */}
        {(sidebarOpen || sidebarClosing) && (
          <div
            className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden ${
              sidebarClosing ? 'overlay-animate-out' : 'overlay-animate-in'
            }`}
          >
            <div className="absolute inset-0" onClick={startCloseSidebar} />
            <div className="absolute inset-y-0 left-0 max-w-[18rem]">
              <Sidebar
                isMobile
                onClose={startCloseSidebar}
                className={
                  sidebarClosing ? 'sidebar-animate-out' : 'sidebar-animate-in'
                }
              />
            </div>
          </div>
        )}

        {/* Contenido principal */}
        <main className="flex-1">
          <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 lg:px-8 lg:py-8">
            <header className="flex items-center justify-between gap-4">
              <BurgerButton onClick={openSidebar} />

              <div className="flex-1 text-right lg:text-left">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  FitPlanner Manager
                </p>
                <p className="text-sm font-semibold text-slate-100">
                  {user?.role === 'ADMIN'
                    ? 'Panel administrativo'
                    : 'Panel de usuario'}
                </p>
              </div>

              <div className="hidden items-center gap-3 lg:flex">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 text-sm font-semibold text-slate-50">
                  {user?.name?.[0]?.toUpperCase() ?? 'U'}
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-slate-400">
                    {user?.role === 'ADMIN' ? 'Administrador' : 'Usuario'}
                  </p>
                  <p className="text-sm font-semibold text-slate-100">
                    {user?.name ?? 'Sesión activa'}
                  </p>
                </div>
              </div>
            </header>

            {/* Fade-in por ruta */}
            <div className="relative min-h-[60vh] rounded-3xl bg-[#020617] overflow-hidden">
              <div key={location.pathname} className="page-fade-in h-full">
                <Outlet />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
