// src/context/AuthContext.tsx
import { useState } from 'react';
import type { ReactNode } from 'react';
import { loginRequest } from '@/api/authService';
import { AuthContext } from './authContextCore';
import type { AuthState } from './types';

// ⚠️ Pon esto en false cuando conectes el backend real
const DESIGN_MODE = false;

// Enforce role by email domain: @gym.com => ADMIN, otherwise USER
function deriveRoleFromEmail(email?: string, hintedRole?: 'ADMIN' | 'USER' | string | null): 'ADMIN' | 'USER' {
  const e = (email || '').toLowerCase().trim();
  if (e.endsWith('@gym.com')) return 'ADMIN';
  return 'USER';
}

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
        const userStr = localStorage.getItem('user');
        if (token && userStr) {
          const parsed = JSON.parse(userStr);
          return {
            token,
            user: parsed
              ? {
                  id: parsed.id,
                  name: parsed.name || parsed.email || 'Usuario',
                  email: parsed.email || '',
                  role: deriveRoleFromEmail(parsed.email, parsed.role),
                }
              : null,
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
    // Guardar sólo si vienen valores válidos
    if (data.accessToken) {
      localStorage.setItem('accessToken', data.accessToken);
    }
    if (data.user) {
      localStorage.setItem('user', JSON.stringify(data.user));
    }

    setState({
      token: data.accessToken ?? null,
      user: data.user
        ? {
            id: data.user.id,
            name: data.user.name || data.user.email || 'Usuario',
            email: data.user.email || '',
            role: deriveRoleFromEmail(data.user.email, (data.user.role as any) ?? null),
          }
        : null,
      isAuthenticated: Boolean(data.accessToken || data.user),
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
