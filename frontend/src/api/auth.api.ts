import { apiClient } from './axios';
import type { ApiSuccess, AuthResponse, User } from '../types';

export const loginRequest = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const { data } = await apiClient.post<ApiSuccess<AuthResponse>>('/auth/login', {
    email,
    password,
  });
  return data.data;
};

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role?: 'admin' | 'sales';
}

export const registerRequest = async (
  payload: RegisterPayload
): Promise<AuthResponse> => {
  const { data } = await apiClient.post<ApiSuccess<AuthResponse>>(
    '/auth/register',
    payload
  );
  return data.data;
};

export const meRequest = async (): Promise<User> => {
  const { data } = await apiClient.get<ApiSuccess<User>>('/auth/me');
  return data.data;
};
