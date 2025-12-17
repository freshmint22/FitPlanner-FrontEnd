// src/context/AuthContext.tsx
import { useState } from 'react';
import type { ReactNode } from 'react';
import { loginRequest } from '@/api/authService';
import { AuthContext } from './authContextCore';
import type { AuthState } from './types';

// ⚠️ Pon esto en false cuando conectes el backend real
const DESIGN_MODE = false;

// Role is provided by backend or explicitly selected by user; default USER.

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>(() => {
    if (DESIGN_MODE) {
      // Usuario “falso” ADMIN en modo diseño
      return {
        user: {
          id: 'demo-1',
          name: 'Administrador',
          email: 'admin@gmail.com',
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
          // Preserve additional user fields (phone, birthDate, gender, etc.)
          const preserved = parsed
            ? {
                id: parsed.id,
                name: parsed.name || parsed.email || 'Usuario',
                email: parsed.email || '',
                role: (parsed.role as any) || 'USER',
                phone: parsed.phone || undefined,
                birthDate: parsed.birthDate || undefined,
                gender: parsed.gender || undefined,
                membership: (parsed as any).membership || null,
              }
            : null;

          return {
            token,
            user: preserved,
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

    // Región real — login with provided credentials; backend returns role
    const data = await loginRequest(email, password);
    // Guardar sólo si vienen valores válidos
    if (data.accessToken) {
      localStorage.setItem('accessToken', data.accessToken);
    }
    if (data.user) {
      // Persist full user object returned by backend (may include phone, birthDate, gender)
      const storedUser = { ...data.user, email: data.user.email || email, role: (data.user.role as any) || 'USER' };
      localStorage.setItem('user', JSON.stringify(storedUser));
    }

    // Normalize user object and include membership if present
    const normalized = data.user
      ? {
          id: String(data.user.id || data.user._id || ''),
          name: data.user.name || data.user.email || 'Usuario',
          email: data.user.email || email,
          role: (data.user.role as any) || 'USER',
          membership: (data.user as any).membership || null,
        }
      : null;

    setState({
      token: data.accessToken ?? null,
          user: data.user
        ? {
            id: String((data.user as any).id || (data.user as any)._id || ''),
            name: data.user.name || data.user.email || 'Usuario',
            email: data.user.email || email,
            role: (data.user as any).role || 'USER',
            phone: (data.user as any).phone || undefined,
            birthDate: (data.user as any).birthDate || undefined,
            gender: (data.user as any).gender || undefined,
            membership: (data.user as any).membership || null,
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

  const refreshUser = () => {
    try {
      if (typeof window !== 'undefined') {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const parsed = JSON.parse(userStr);
          const normalized = parsed
              ? {
                  id: String(parsed.id || parsed._id || ''),
                  name: parsed.name || parsed.email || 'Usuario',
                  email: parsed.email || '',
                  role: (parsed.role as any) || 'USER',
                  phone: parsed.phone || undefined,
                  birthDate: parsed.birthDate || undefined,
                  gender: parsed.gender || undefined,
                  membership: (parsed as any).membership || null,
                }
              : null;

          setState((s) => ({ ...s, user: normalized }));
        }
      }
    } catch (e) {
      // ignore
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// `useAuth` moved to `src/context/useAuth.ts` to keep this file exporting
// only components (improves Fast Refresh compatibility).
