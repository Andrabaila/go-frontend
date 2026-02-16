import axios from 'axios';
import type { LoginRequest, RegisterRequest } from '@shared/types/auth';

const API_URL = import.meta.env.VITE_API_URL ?? 'https://localhost:3000';

export const loginUser = async (
  data: LoginRequest
): Promise<{ access_token: string }> => {
  const response = await axios.post(`${API_URL}/auth/login`, data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  localStorage.setItem('token', response.data.access_token);
  return response.data;
};

export const registerUser = async (
  data: RegisterRequest
): Promise<{ id: number; email: string }> => {
  const response = await axios.post(`${API_URL}/auth/register`, data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};
