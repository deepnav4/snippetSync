import api from './axios';
import type { User, LoginCredentials, SignupData } from './types';

export const authService = {
  async signup(data: SignupData): Promise<{ user: User; accessToken: string }> {
    const response = await api.post('/auth/signup', data);
    localStorage.setItem('accessToken', response.data.data.accessToken);
    return response.data.data;
  },

  async login(credentials: LoginCredentials): Promise<{ user: User; accessToken: string }> {
    const response = await api.post('/auth/login', credentials);
    localStorage.setItem('accessToken', response.data.data.accessToken);
    return response.data.data;
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout');
    localStorage.removeItem('accessToken');
  },

  async getProfile(): Promise<User> {
    const response = await api.get('/auth/profile');
    return response.data.data;
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  },
};
