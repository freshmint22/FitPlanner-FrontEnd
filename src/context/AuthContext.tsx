// src/context/AuthContext.tsx
import { useState } from 'react';
import type { ReactNode } from 'react';
import { loginRequest } from '@/api/authService';
import { parseAdminEmail, roleFromInputEmail } from '@/utils/adminEmail';
import { AuthContext } from './authContextCore';
import type { AuthState } from './types';

// ⚠️ Pon esto en false cuando conectes el backend real
const DESIGN_MODE = false;

// Role derivation now based on the input marker (.gym). Fallback USER.
function deriveRoleFromEmail(email?: string): 'ADMIN' | 'USER' {
  if (!email) return 'USER';
  return roleFromInputEmail(email);
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>(() => {
    if (DESIGN_MODE) {
      // Usuario “falso” ADMIN en modo diseño
      return {
        user: {
          id: 'demo-1',
          name: 'Administrador',
          email: 'admin(.gym)@gmail.com',
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
                role: (parsed.role as any) || deriveRoleFromEmail(parsed.email),
                phone: parsed.phone || undefined,
                birthDate: parsed.birthDate || undefined,
                gender: parsed.gender || undefined,
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

    // Región real — sanitiza email y detecta rol por marcador
    const { cleanEmail, isAdmin } = parseAdminEmail(email);
    const data = await loginRequest(cleanEmail, password);
    // Guardar sólo si vienen valores válidos
    if (data.accessToken) {
      localStorage.setItem('accessToken', data.accessToken);
    }
    if (data.user) {
      // Persist full user object returned by backend (may include phone, birthDate, gender)
      const storedUser = { ...data.user, email: data.user.email || cleanEmail, role: isAdmin ? 'ADMIN' : 'USER' };
      localStorage.setItem('user', JSON.stringify(storedUser));
    }

    // Normalize user object and include membership if present
    const normalized = data.user
      ? {
          id: String(data.user.id || data.user._id || ''),
          name: data.user.name || data.user.email || 'Usuario',
          email: data.user.email || cleanEmail,
          role: isAdmin ? 'ADMIN' : 'USER',
          membership: (data.user as any).membership || null,
        }
      : null;

    setState({
      token: data.accessToken ?? null,
      user: data.user
        ? {
            id: data.user.id,
            name: data.user.name || data.user.email || 'Usuario',
            email: data.user.email || cleanEmail,
            role: isAdmin ? 'ADMIN' : 'USER',
            phone: (data.user as any).phone || undefined,
            birthDate: (data.user as any).birthDate || undefined,
            gender: (data.user as any).gender || undefined,
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
