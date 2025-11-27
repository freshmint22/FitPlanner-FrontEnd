// src/router/PrivateRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface PrivateRouteProps {
  children: JSX.Element;
  allowedRoles?: Array<"ADMIN" | "USER">;
}

const PrivateRoute = ({ children, allowedRoles }: PrivateRouteProps) => {
  const { isAuthenticated, user } = useAuth();

  // Si no hay sesión, manda al login
  if (!isAuthenticated || !user) {
    return <Navigate to="/" replace />;
  }

  // Si hay restricción de roles y el rol del usuario no está permitido
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Si es ADMIN pero intenta entrar a algo solo USER, lo mandamos al admin
    if (user.role === "ADMIN") {
      return <Navigate to="/admin" replace />;
    }
    // Si es USER y trata de entrar a algo solo ADMIN, lo mandamos a su dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PrivateRoute;
