// src/router/PrivateRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

type Role = 'ADMIN' | 'USER';

interface PrivateRouteProps {
  allowedRoles?: Role[];
}

export default function PrivateRoute({ allowedRoles }: PrivateRouteProps) {
  const { isAuthenticated, user } = useAuth();

  // No autenticado → login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Autenticado pero sin permiso de rol
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    const fallback = user.role === 'ADMIN' ? '/admin' : '/dashboard';
    return <Navigate to={fallback} replace />;
  }

  // OK → renderizar las rutas hijas
  return <Outlet />;
}
