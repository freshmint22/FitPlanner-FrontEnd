// src/api/authService.ts
import axiosClient from "./axiosClient";

export type Role = "ADMIN" | "USER";

export interface LoginResponse {
  accessToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: Role;
  };
}

export const loginRequest = async (email: string, password: string) => {
  const { data } = await axiosClient.post<LoginResponse>("/auth/login", {
    email,
    password,
  });
  return data;
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
