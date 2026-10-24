import { apiClient } from '../../../config/api.config';

export interface LoginPayload {
  email: string;
  passwordHash?: string;
  password?: string;
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  phoneNumber?: string;
}

export interface AuthApiResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    user: {
      id: number;
      email: string;
      firstName: string;
      lastName: string;
      roles: string[];
    };
  };
}

export const authService = {
  login: async (
    credentials: LoginPayload
  ): Promise<AuthApiResponse> => {
    const response = await apiClient.post<AuthApiResponse>(
      '/auth/login',
      credentials
    );

    return response.data;
  },

  register: async (
    payload: RegisterPayload
  ): Promise<AuthApiResponse> => {
    const response = await apiClient.post<AuthApiResponse>(
      '/auth/register',
      payload
    );

    return response.data;
  },

  logout: async (): Promise<void> => {
    try {
      await apiClient.post('/auth/logout');
    } catch {
      // Local clean-up even if network request fails
    }
  },

  getCurrentUser: async () => {
    const response = await apiClient.get('/users/me');
    return response.data;
  },
};