// src/context/AuthContext.tsx
import { useState, ReactNode } from 'react';
import { loginRequest } from '@/api/authService';
import { AuthContext } from './authContextCore';

// ⚠️ Pon esto en false cuando conectes el backend real
const DESIGN_MODE = true;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>(() => {
    if (DESIGN_MODE) {
      // Usuario “falso” ADMIN en modo diseño
      return {
        user: {
          id: 'demo-1',
          name: 'Administrador',
          email: 'admin@fitplanner.com',
          role: 'ADMIN', // ✔️ ADMIN por defecto
        },
        token: 'demo-token',
        isAuthenticated: true,
      };
    }

    // Intentamos rehidratar desde localStorage al inicializar el estado
    try {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('accessToken');
        const user = localStorage.getItem('user');
        if (token && user) {
          return {
            token,
            user: JSON.parse(user),
            isAuthenticated: true,
          };
        }
      }
    } catch {
      // Ignorar errores de acceso a localStorage
    }

    // Comportamiento real por defecto
    return {
      user: null,
      token: null,
      isAuthenticated: false,
    };
  });

  const login = async (email: string, password: string) => {
    if (DESIGN_MODE) {
      // ✔️ Login simulado como ADMIN también
      setState({
        user: {
          id: 'demo-admin',
          name: 'Administrador',
          email,
          role: 'ADMIN',
        },
        token: 'demo-token',
        isAuthenticated: true,
      });
      return;
    }

    // Región real cuando conectes backend
    const data = await loginRequest(email, password);
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('user', JSON.stringify(data.user));

    setState({
      token: data.accessToken,
      user: data.user,
      isAuthenticated: true,
    });
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');

    if (DESIGN_MODE) {
      setState({
        user: null,
        token: null,
        isAuthenticated: false,
      });
      return;
    }

    setState({ user: null, token: null, isAuthenticated: false });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// `useAuth` moved to `src/context/useAuth.ts` to keep this file exporting
// only components (improves Fast Refresh compatibility).
