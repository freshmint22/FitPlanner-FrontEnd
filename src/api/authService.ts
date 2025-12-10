// src/api/authService.ts
import axiosClient from "./axiosClient";

export type Role = "ADMIN" | "USER";

export interface LoginResponse {
  accessToken?: string;
  token?: string;
  user?: {
    id: string;
    name?: string;
    email?: string;
    role?: Role;
  };
}

export const loginRequest = async (email: string, password: string) => {
  const { data } = await axiosClient.post<LoginResponse>("/auth/login", {
    email,
    password,
  });

  // Some backends return { token } or { accessToken }. Normalize to accessToken.
  const accessToken = (data as any).accessToken || (data as any).token;

  // If server returned user info, use it; otherwise try to fetch profile endpoint.
  let user = data.user;
  if (!user && accessToken) {
    try {
      const profile = await axiosClient.get('/users/profile');
      user = {
        id: profile.data?.id || profile.data?.email || 'unknown',
        name: profile.data?.name || profile.data?.email || 'Usuario',
        email: profile.data?.email,
        role: (profile.data?.role as Role) || 'USER',
      };
    } catch (err) {
      // ignore profile fetch errors
    }
  }

  return { accessToken, user } as { accessToken?: string; user?: LoginResponse['user'] };
};

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: Role;
}

export interface RegisterResponse {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export const registerRequest = async (
  payload: RegisterPayload
): Promise<RegisterResponse> => {
  // Ajusta la URL según tu backend
  const { data } = await axiosClient.post<RegisterResponse>(
    "/auth/register",
    payload
  );
  return data;
};
