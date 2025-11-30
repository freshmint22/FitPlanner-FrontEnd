import { Routes, Route, Navigate } from 'react-router-dom';

import MainLayout from '@/layouts/MainLayout';
import PublicLayout from '@/layouts/PublicLayout';
import PrivateRoute from './PrivateRoute';

import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';

// Recuperar contraseña
import ForgotPasswordPage from '@/pages/ForgotPasswordPage';
import EmailSentPage from '@/pages/EmailSentPage';
import ResetPasswordPage from '@/pages/ResetPasswordPage';


// Páginas de usuario
import UserDashboardPage from '@/pages/UserDashboard';
import ClassesPage from '@/pages/ClassesPage';
import RoutinesPage from '@/pages/RoutinesPage';
import SettingsPage from '@/pages/SettingsPage';

// Páginas de admin
import AdminDashboardPage from '@/pages/AdminDashboard';
import MembersPage from '@/pages/MembersPage';
import MembershipsPage from '@/pages/MembershipsPage';
import ReportsPage from '@/pages/ReportsPage';

export default function AppRouter() {
  return (
    <Routes>
      {/* ================== RUTAS PÚBLICAS (con PublicLayout) ================== */}
      <Route element={<PublicLayout />}>
        {/* Home landing */}
        <Route path="/" element={<HomePage />} />

        {/* Auth públicas */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Flujo de recuperación de contraseña */}
        <Route path="/forgot" element={<ForgotPasswordPage />} />
        <Route path="/forgot/sent" element={<EmailSentPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Route>

      {/* =============== RUTAS PROTEGIDAS (requieren login) =============== */}
      <Route element={<PrivateRoute />}>
        <Route element={<MainLayout />}>
          {/* Rutas generales (USER y ADMIN) */}
          <Route path="/dashboard" element={<UserDashboardPage />} />
          <Route path="/classes" element={<ClassesPage />} />
          <Route path="/routines" element={<RoutinesPage />} />
          <Route path="/settings" element={<SettingsPage />} />

          {/* Rutas solo ADMIN */}
          <Route element={<PrivateRoute allowedRoles={['ADMIN']} />}>
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/members" element={<MembersPage />} />
            <Route path="/memberships" element={<MembershipsPage />} />
            <Route path="/reports" element={<ReportsPage />} />
          </Route>
        </Route>
      </Route>

      {/* Cualquier otra ruta → ir al home público */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
