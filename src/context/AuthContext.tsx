// src/context/AuthContext.tsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { loginRequest } from '@/api/authService';

type Role = 'ADMIN' | 'USER';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

// ⚠️ Pon esto en false cuando conectes el backend real
const DESIGN_MODE = true;

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

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

    // Comportamiento real (sin modo diseño)
    return {
      user: null,
      token: null,
      isAuthenticated: false,
    };
  });

  // Rehidratar sesión desde localStorage al cargar la app
  useEffect(() => {
    if (DESIGN_MODE) return; // En modo diseño no rehidratamos nada

    const token = localStorage.getItem('accessToken');
    const user = localStorage.getItem('user');

    if (token && user) {
      setState({
        token,
        user: JSON.parse(user),
        isAuthenticated: true,
      });
    }
  }, []);

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

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return ctx;
};
