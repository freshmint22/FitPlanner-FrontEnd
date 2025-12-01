// src/context/useAuth.ts
import { useContext } from 'react';
import { AuthContext } from './authContextCore';
import type { AuthContextValue } from './types';

export const useAuth = () => {
  const ctx = useContext(AuthContext) as AuthContextValue | undefined;
  if (!ctx) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return ctx;
};

export default useAuth;
