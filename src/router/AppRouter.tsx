// src/router/AppRouter.tsx
import { Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import UserDashboard from "@/pages/UserDashboard";
import AdminDashboard from "@/pages/AdminDashboard";

import ClassesPage from "@/pages/ClassesPage";
import RoutinesPage from "@/pages/RoutinesPage";
import MembersPage from "@/pages/MembersPage";
import MembershipsPage from "@/pages/MembershipsPage";
import ReportsPage from "@/pages/ReportsPage";
import SettingsPage from "@/pages/SettingsPage";

import PrivateRoute from "./PrivateRoute";
import MainLayout from "@/layouts/MainLayout";

const AppRouter = () => {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Panel usuario (USER o ADMIN) */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute allowedRoles={["USER", "ADMIN"]}>
            <MainLayout>
              <UserDashboard />
            </MainLayout>
          </PrivateRoute>
        }
      />

      {/* Clases (ambos roles) */}
      <Route
        path="/classes"
        element={
          <PrivateRoute allowedRoles={["USER", "ADMIN"]}>
            <MainLayout>
              <ClassesPage />
            </MainLayout>
          </PrivateRoute>
        }
      />

      {/* Rutinas (ambos roles) */}
      <Route
        path="/routines"
        element={
          <PrivateRoute allowedRoles={["USER", "ADMIN"]}>
            <MainLayout>
              <RoutinesPage />
            </MainLayout>
          </PrivateRoute>
        }
      />

      {/* Admin dashboard (solo ADMIN) */}
      <Route
        path="/admin"
        element={
          <PrivateRoute allowedRoles={["ADMIN"]}>
            <MainLayout>
              <AdminDashboard />
            </MainLayout>
          </PrivateRoute>
        }
      />

      {/* Miembros (solo ADMIN) */}
      <Route
        path="/members"
        element={
          <PrivateRoute allowedRoles={["ADMIN"]}>
            <MainLayout>
              <MembersPage />
            </MainLayout>
          </PrivateRoute>
        }
      />

      {/* Membresías (solo ADMIN) */}
      <Route
        path="/memberships"
        element={
          <PrivateRoute allowedRoles={["ADMIN"]}>
            <MainLayout>
              <MembershipsPage />
            </MainLayout>
          </PrivateRoute>
        }
      />

      {/* Reportes (solo ADMIN) */}
      <Route
        path="/reports"
        element={
          <PrivateRoute allowedRoles={["ADMIN"]}>
            <MainLayout>
              <ReportsPage />
            </MainLayout>
          </PrivateRoute>
        }
      />

      {/* Configuración (ambos roles) */}
      <Route
        path="/settings"
        element={
          <PrivateRoute allowedRoles={["USER", "ADMIN"]}>
            <MainLayout>
              <SettingsPage />
            </MainLayout>
          </PrivateRoute>
        }
      />

      {/* Cualquier ruta rara → login */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;
