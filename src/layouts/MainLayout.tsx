// src/layouts/MainLayout.tsx
import { ReactNode, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface MainLayoutProps {
  children: ReactNode;
}

const navClasses =
  "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors";
const navInactive =
  "text-slate-400 hover:text-slate-100 hover:bg-slate-800/70";
const navActive =
  "bg-slate-800 text-slate-100 shadow-fp-soft border border-slate-700";

const MainLayout = ({ children }: MainLayoutProps) => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const isAdmin = user?.role === "ADMIN";

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="min-h-screen bg-fp-bg text-fp-text-main">
      {/* TOPBAR MOBILE */}
      <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/95 px-4 py-3 lg:hidden">
        {/* Botón hamburguesa (izquierda) */}
        <button
          onClick={() => setSidebarOpen((prev) => !prev)}
          className="
            flex flex-col items-center justify-center
            gap-[6px]
            h-11 w-11
            rounded-2xl
            bg-white/5
            border border-white/10
            shadow-lg
            backdrop-blur-sm
            active:scale-95
            transition
          "
        >
          <span className="w-6 h-[3px] bg-white rounded-full"></span>
          <span className="w-6 h-[3px] bg-white rounded-full"></span>
          <span className="w-6 h-[3px] bg-white rounded-full"></span>
        </button>


        {/* Logo / título centro */}
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-indigo-500 text-sm font-bold text-white">
            FP
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-200">
              FitPlanner Manager
            </p>
            <p className="text-[10px] text-slate-500">
              {user?.role === "ADMIN" ? "Administrador" : "Usuario"}
            </p>
          </div>
        </div>

        {/* Espacio de la derecha (podrías poner avatar en el futuro) */}
        <div className="h-10 w-10" />
      </div>

      {/* CONTENEDOR PRINCIPAL */}
      <div className="flex">
        {/* SIDEBAR DESKTOP (columna izquierda fija) */}
        <aside className="hidden h-[calc(100vh-0px)] w-64 flex-shrink-0 border-r border-slate-800 bg-slate-950/95 px-4 py-5 lg:flex lg:flex-col lg:sticky lg:top-0">
          {/* Logo */}
          <div className="flex items-center gap-3 px-1">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-500 text-sm font-bold text-white">
              FP
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-200">
                FitPlanner
              </p>
              <p className="text-[10px] text-slate-500">Gym Management</p>
            </div>
          </div>

          {/* Navegación */}
          <nav className="mt-6 flex-1 space-y-6 text-xs">
            <div>
              <p className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                General
              </p>
              <div className="space-y-1">
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    `${navClasses} ${isActive ? navActive : navInactive}`
                  }
                >
                  <span>🏠</span>
                  <span>Dashboard usuario</span>
                </NavLink>
                <NavLink
                  to="/classes"
                  className={({ isActive }) =>
                    `${navClasses} ${isActive ? navActive : navInactive}`
                  }
                >
                  <span>📅</span>
                  <span>Clases</span>
                </NavLink>
                <NavLink
                  to="/routines"
                  className={({ isActive }) =>
                    `${navClasses} ${isActive ? navActive : navInactive}`
                  }
                >
                  <span>🏋️‍♂️</span>
                  <span>Rutinas</span>
                </NavLink>
              </div>
            </div>

            {isAdmin && (
              <div>
                <p className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Administración
                </p>
                <div className="space-y-1">
                  <NavLink
                    to="/admin"
                    className={({ isActive }) =>
                      `${navClasses} ${isActive ? navActive : navInactive}`
                    }
                  >
                    <span>📊</span>
                    <span>Dashboard admin</span>
                  </NavLink>
                  <NavLink
                    to="/members"
                    className={({ isActive }) =>
                      `${navClasses} ${isActive ? navActive : navInactive}`
                    }
                  >
                    <span>👤</span>
                    <span>Miembros</span>
                  </NavLink>
                  <NavLink
                    to="/memberships"
                    className={({ isActive }) =>
                      `${navClasses} ${isActive ? navActive : navInactive}`
                    }
                  >
                    <span>💳</span>
                    <span>Membresías</span>
                  </NavLink>
                  <NavLink
                    to="/reports"
                    className={({ isActive }) =>
                      `${navClasses} ${isActive ? navActive : navInactive}`
                    }
                  >
                    <span>📈</span>
                    <span>Reportes</span>
                  </NavLink>
                </div>
              </div>
            )}

            <div>
              <p className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                Cuenta
              </p>
              <div className="space-y-1">
                <NavLink
                  to="/settings"
                  className={({ isActive }) =>
                    `${navClasses} ${isActive ? navActive : navInactive}`
                  }
                >
                  <span>⚙️</span>
                  <span>Configuración</span>
                </NavLink>
              </div>
            </div>
          </nav>

          {/* Footer usuario (desktop) */}
          <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900/70 px-3 py-3 text-xs">
            <p className="text-[10px] text-slate-500">Administrador</p>
            <p className="text-xs font-medium text-slate-100 truncate">
              {user?.email ?? "usuario@fitplanner.com"}
            </p>
            <p className="mt-1 text-[11px] text-slate-500">
              ROL: {user?.role ?? "USER"}
            </p>
            <button
              onClick={handleLogout}
              className="mt-2 w-full rounded-full bg-slate-800 px-2 py-1 text-[11px] font-medium text-slate-100 hover:bg-slate-700"
            >
              Cerrar sesión
            </button>
          </div>
        </aside>

        {/* OVERLAY + SIDEBAR MOBILE (se desliza desde la izquierda) */}
        {sidebarOpen && (
          <>
            {/* Fondo oscuro */}
            <div
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
              onClick={closeSidebar}
            />
            {/* Panel lateral */}
            <aside
              className={`
                fixed inset-y-0 left-0 z-50 w-64 border-r border-slate-800
                bg-slate-950/95 px-4 py-5 shadow-fp-card transform
                transition-transform duration-300 ease-out lg:hidden
                flex flex-col h-full
                ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
              `}
            >
              {/* Encabezado del panel */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 px-1">
                  <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-500 text-sm font-bold text-white">
                    FP
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-200">
                      FitPlanner
                    </p>
                    <p className="text-[10px] text-slate-500">
                      Gym Management
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeSidebar}
                  className="rounded-full border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-300"
                >
                  Cerrar
                </button>
              </div>

              {/* Navegación móvil */}
              <nav className="mt-6 flex-1 space-y-6 text-xs overflow-y-auto">
                <div>
                  <p className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                    General
                  </p>
                  <div className="space-y-1">
                    <NavLink
                      to="/dashboard"
                      onClick={closeSidebar}
                      className={({ isActive }) =>
                        `${navClasses} ${
                          isActive ? navActive : navInactive
                        }`
                      }
                    >
                      <span>🏠</span>
                      <span>Dashboard usuario</span>
                    </NavLink>
                    <NavLink
                      to="/classes"
                      onClick={closeSidebar}
                      className={({ isActive }) =>
                        `${navClasses} ${
                          isActive ? navActive : navInactive
                        }`
                      }
                    >
                      <span>📅</span>
                      <span>Clases</span>
                    </NavLink>
                    <NavLink
                      to="/routines"
                      onClick={closeSidebar}
                      className={({ isActive }) =>
                        `${navClasses} ${
                          isActive ? navActive : navInactive
                        }`
                      }
                    >
                      <span>🏋️‍♂️</span>
                      <span>Rutinas</span>
                    </NavLink>
                  </div>
                </div>

                {isAdmin && (
                  <div>
                    <p className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                      Administración
                    </p>
                    <div className="space-y-1">
                      <NavLink
                        to="/admin"
                        onClick={closeSidebar}
                        className={({ isActive }) =>
                          `${navClasses} ${
                            isActive ? navActive : navInactive
                          }`
                        }
                      >
                        <span>📊</span>
                        <span>Dashboard admin</span>
                      </NavLink>
                      <NavLink
                        to="/members"
                        onClick={closeSidebar}
                        className={({ isActive }) =>
                          `${navClasses} ${
                            isActive ? navActive : navInactive
                          }`
                        }
                      >
                        <span>👤</span>
                        <span>Miembros</span>
                      </NavLink>
                      <NavLink
                        to="/memberships"
                        onClick={closeSidebar}
                        className={({ isActive }) =>
                          `${navClasses} ${
                            isActive ? navActive : navInactive
                          }`
                        }
                      >
                        <span>💳</span>
                        <span>Membresías</span>
                      </NavLink>
                      <NavLink
                        to="/reports"
                        onClick={closeSidebar}
                        className={({ isActive }) =>
                          `${navClasses} ${
                            isActive ? navActive : navInactive
                          }`
                        }
                      >
                        <span>📈</span>
                        <span>Reportes</span>
                      </NavLink>
                    </div>
                  </div>
                )}

                <div>
                  <p className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Cuenta
                  </p>
                  <div className="space-y-1">
                    <NavLink
                      to="/settings"
                      onClick={closeSidebar}
                      className={({ isActive }) =>
                        `${navClasses} ${
                          isActive ? navActive : navInactive
                        }`
                      }
                    >
                      <span>⚙️</span>
                      <span>Configuración</span>
                    </NavLink>
                  </div>
                </div>
              </nav>

              {/* Footer usuario (mobile) */}
              <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900/80 px-3 py-3 text-xs">
                <p className="text-[10px] text-slate-500">Administrador</p>
                <p className="text-xs font-medium text-slate-100 truncate">
                  {user?.email ?? "usuario@fitplanner.com"}
                </p>
                <p className="mt-1 text-[11px] text-slate-500">
                  ROL: {user?.role ?? "USER"}
                </p>
                <button
                  onClick={handleLogout}
                  className="mt-2 w-full rounded-full bg-slate-800 px-2 py-1 text-[11px] font-medium text-slate-100 hover:bg-slate-700"
                >
                  Cerrar sesión
                </button>
              </div>
            </aside>
          </>
        )}

        {/* CONTENIDO PRINCIPAL */}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;
