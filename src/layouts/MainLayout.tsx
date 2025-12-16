// src/layouts/MainLayout.tsx
import { useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/context/useAuth";
import { GlobalAnimations } from "@/components/ui/GlobalAnimations";
import ThemeToggle from "@/components/ThemeToggle";

interface NavItem {
  label: string;
  to: string;
  icon?: string;
}

const userNav: NavItem[] = [
  { label: "Dashboard", to: "/dashboard", icon: "" },
  { label: "Mi Membresía", to: "/my-membership", icon: "" },
  { label: "Clases", to: "/classes", icon: "" },
  { label: "Rutinas", to: "/routines", icon: "" },
];

const adminNav: NavItem[] = [
  { label: "Dashboard admin", to: "/admin", icon: "" },
  { label: "Miembros", to: "/members", icon: "" },
  { label: "Membresías", to: "/memberships", icon: "" },
  { label: "Reportes", to: "/reports", icon: "" },
];

const accountNav: NavItem[] = [
  { label: "Perfil", to: "/settings", icon: "" },
];

function BurgerButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center justify-center rounded-[1.75rem] border border-slate-300 bg-white p-3 text-slate-800 shadow-sm backdrop-blur lg:hidden dark:border-slate-700/70 dark:bg-slate-900/80 dark:text-slate-100"
    >
      <span className="sr-only">Abrir menú</span>
      <span className="flex flex-col gap-1.5">
        <span className="h-1 w-6 rounded-full bg-slate-800 dark:bg-slate-100" />
        <span className="h-1 w-6 rounded-full bg-slate-800 dark:bg-slate-100" />
        <span className="h-1 w-6 rounded-full bg-slate-800 dark:bg-slate-100" />
      </span>
    </button>
  );
}

interface SidebarProps {
  onClose?: () => void;
  isMobile?: boolean;
  className?: string;
  isCollapsed?: boolean;
}

function Sidebar({ onClose, isMobile = false, className = "", isCollapsed = false }: SidebarProps) {
  const { user, logout } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  const handleLogout = () => {
    logout();
    if (onClose) onClose();
  };

  const baseClasses = isMobile
    ? "flex h-full w-72 flex-col overflow-y-auto bg-gradient-to-b from-cyan-100 to-emerald-100 text-slate-900 shadow-2xl backdrop-blur dark:bg-[#020617]/95 dark:text-slate-100"
    : `hidden ${isCollapsed ? "w-20" : "w-72"} flex-col overflow-y-auto border-r border-slate-200 bg-gradient-to-b from-cyan-100 to-emerald-100 text-slate-900 lg:flex lg:h-screen lg:sticky lg:top-0 transition-all duration-300 dark:border-slate-800/70 dark:bg-[#020617] dark:text-slate-100`;

  return (
    <aside className={`${baseClasses} ${className}`}>
      <div className="flex flex-1 flex-col">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800/60">
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-emerald-500 text-sm font-semibold text-white shadow-lg dark:text-slate-950">
                FP
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">FITPLANNER MANAGER</span>
                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">Gym Management</span>
              </div>
            </div>
          )}
          {isCollapsed && (
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-emerald-500 text-sm font-semibold text-white shadow-lg dark:text-slate-950">
              FP
            </div>
          )}

          {isMobile && (
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-800 shadow dark:border-slate-700/70 dark:bg-slate-900/80 dark:text-slate-100"
            >
              Cerrar
            </button>
          )}
        </div>

        <nav className={`flex-1 space-y-8 ${!isCollapsed ? "px-4 py-6" : "px-2 py-4"}`}>
          {!isAdmin && (
            <div>
            {!isCollapsed && <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-500">General</p>}
            <div className="space-y-1">
                {userNav.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  title={isCollapsed ? item.label : ""}
                  className={({ isActive }) =>
                    [
                      `flex items-center ${isCollapsed ? "justify-center" : "gap-3"} rounded-2xl px-3 py-2 text-sm font-medium transition`,
                      isActive
                        ? "bg-gradient-to-r from-sky-100 to-emerald-50 text-slate-900 shadow-[0_0_25px_rgba(59,130,246,0.15)] dark:from-fuchsia-500/20 dark:via-indigo-500/20 dark:to-cyan-500/20 dark:text-slate-50 dark:shadow-[0_0_25px_rgba(59,130,246,0.35)]"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/80 dark:hover:text-slate-50",
                    ].join(" ")
                  }
                >
                  <span className="text-lg">{item.icon}</span>
                  {!isCollapsed && <span>{item.label}</span>}
                </NavLink>
                ))}
            </div>
            </div>
          )}

          {isAdmin && (
            <div>
              {!isCollapsed && <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-500">Administración</p>}
              <div className="space-y-1">
                {adminNav.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={onClose}
                    title={isCollapsed ? item.label : ""}
                    className={({ isActive }) =>
                      [
                        `flex items-center ${isCollapsed ? "justify-center" : "gap-3"} rounded-2xl px-3 py-2 text-sm font-medium transition`,
                        isActive
                          ? "bg-gradient-to-r from-sky-100 to-emerald-50 text-slate-900 shadow-[0_0_25px_rgba(59,130,246,0.15)] dark:from-fuchsia-500/20 dark:via-indigo-500/20 dark:to-cyan-500/20 dark:text-slate-50 dark:shadow-[0_0_25px_rgba(59,130,246,0.35)]"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/80 dark:hover:text-slate-50",
                      ].join(" ")
                    }
                  >
                    <span className="text-lg">{item.icon}</span>
                    {!isCollapsed && <span>{item.label}</span>}
                  </NavLink>
                ))}
              </div>
            </div>
          )}

          <div>
            {!isCollapsed && <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-500">Cuenta</p>}
            <div className="space-y-1">
              {accountNav.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  title={isCollapsed ? item.label : ""}
                  className={({ isActive }) =>
                    [
                      `flex items-center ${isCollapsed ? "justify-center" : "gap-3"} rounded-2xl px-3 py-2 text-sm font-medium transition`,
                      isActive
                        ? "bg-gradient-to-r from-sky-100 to-emerald-50 text-slate-900 shadow-[0_0_25px_rgba(59,130,246,0.15)] dark:from-fuchsia-500/20 dark:via-indigo-500/20 dark:to-cyan-500/20 dark:text-slate-50 dark:shadow-[0_0_25px_rgba(59,130,246,0.35)]"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/80 dark:hover:text-slate-50",
                    ].join(" ")
                  }
                >
                  <span className="text-lg">{item.icon}</span>
                  {!isCollapsed && <span>{item.label}</span>}
                </NavLink>
              ))}
            </div>
          </div>
        </nav>

        {!isCollapsed && (
          <div className="border-t border-slate-200 px-4 py-4 dark:border-slate-800/70">
            <div className="rounded-2xl bg-slate-100 px-4 py-3 shadow-inner shadow-slate-200/60 dark:bg-slate-900/80 dark:shadow-inner">
              <div className="mb-2 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 text-sm font-semibold text-white dark:text-slate-50">
                  {user?.name?.[0]?.toUpperCase() ?? "U"}
                </div>
                <div className="leading-tight">
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
                    {user?.role === "ADMIN" ? "Administrador" : "Usuario"}
                  </p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {user?.name ?? "Sesión activa"}
                  </p>
                  {user?.email && (
                    <p className="truncate text-[11px] text-slate-500 dark:text-slate-500">{user.email}</p>
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
        )}
      </div>
    </aside>
  );
}

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarClosing, setSidebarClosing] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
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

  const allNav = [...userNav, ...adminNav, ...accountNav];
  const currentPage = allNav.find((item) => item.to === location.pathname);
  const pageTitle = currentPage?.label || "Panel de usuario";

  return (
    <div className="min-h-screen bg-white text-slate-800 dark:bg-[#020617] dark:text-slate-100">
      <GlobalAnimations />

      <div className="flex min-h-screen">
        <Sidebar className="sidebar-animate-in" isCollapsed={sidebarCollapsed} />

        {(sidebarOpen || sidebarClosing) && (
          <div
            className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden ${
              sidebarClosing ? "overlay-animate-out" : "overlay-animate-in"
            }`}
          >
            <div className="absolute inset-0" onClick={startCloseSidebar} />
            <div className="absolute inset-y-0 left-0 max-w-[18rem]">
              <Sidebar
                isMobile
                onClose={startCloseSidebar}
                className={sidebarClosing ? "sidebar-animate-out" : "sidebar-animate-in"}
              />
            </div>
          </div>
        )}

        <main className="flex-1">
          <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 lg:px-8 lg:py-8">
            <header className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <BurgerButton onClick={openSidebar} />
                <button
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="hidden rounded-2xl border border-slate-300 bg-white p-3 text-slate-800 shadow-sm backdrop-blur lg:inline-flex dark:border-slate-700/70 dark:bg-slate-900/80 dark:text-slate-100"
                  title={sidebarCollapsed ? "Expandir" : "Contraer"}
                >
                  {sidebarCollapsed ? (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  ) : (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  )}
                </button>
              </div>

              <div className="flex-1 text-right lg:text-left">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-600 dark:text-slate-500">
                  FitPlanner Manager
                </p>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {pageTitle}
                </p>
              </div>

              <ThemeToggle />
            </header>

            <div className="relative min-h-[60vh] rounded-3xl bg-white overflow-hidden dark:bg-[#020617]">
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
