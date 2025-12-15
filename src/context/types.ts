// src/context/types.ts
export type Role = 'ADMIN' | 'USER';

export type Membership = {
  id?: string;
  name?: string;
  price?: number | string;
  duration?: number; // duración en días
  startDate?: string;
  endDate?: string;
  status?: 'active' | 'expired' | 'pending' | string;
};

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  membership?: Membership | null;
}

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}
