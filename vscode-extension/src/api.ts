import axios, { AxiosInstance } from 'axios';
import * as vscode from 'vscode';
import { AuthResponse, LoginCredentials, Snippet, CreateSnippetData } from './types';

export class ApiService {
  private api: AxiosInstance;
  private context: vscode.ExtensionContext;

  constructor(context: vscode.ExtensionContext) {
    this.context = context;
    const config = vscode.workspace.getConfiguration('snippetSync');
    const apiUrl = config.get<string>('apiUrl') || 'http://localhost:5000/api';

    this.api = axios.create({
      baseURL: apiUrl,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });

    // Add request interceptor to include auth token
    this.api.interceptors.request.use(
      async (config) => {
        const token = await this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        // Don't retry on login or logout endpoints
        if (error.response?.status === 401 && 
            !originalRequest.url?.includes('/auth/login') &&
            !originalRequest.url?.includes('/auth/logout')) {
          await this.clearToken();
          vscode.window.showErrorMessage('Session expired. Please login again.');
        }
        return Promise.reject(error);
      }
    );
  }

  private async getToken(): Promise<string | undefined> {
    return await this.context.secrets.get('snippetSync.accessToken');
  }

  private async setToken(token: string): Promise<void> {
    await this.context.secrets.store('snippetSync.accessToken', token);
  }

  private async clearToken(): Promise<void> {
    await this.context.secrets.delete('snippetSync.accessToken');
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await this.api.post<{ success: boolean; data: { accessToken: string } }>(
      '/auth/login',
      credentials
    );
    const { accessToken } = response.data.data;
    
    // Store token BEFORE making profile request
    await this.setToken(accessToken);
    
    // Fetch user profile after login with explicit token
    const profileResponse = await this.api.get<{ success: boolean; data: any }>(
      '/auth/profile',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );
    
    return {
      user: profileResponse.data.data,
      accessToken
    };
  }

  async logout(): Promise<void> {
    try {
      await this.api.post('/auth/logout');
    } catch (error) {
      // Ignore errors on logout
    } finally {
      await this.clearToken();
    }
  }

  async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();
    return !!token;
  }

  async getMySnippets(): Promise<Snippet[]> {
    const response = await this.api.get<{ success: boolean; data: Snippet[] }>(
      '/snippets/my'
    );
    return response.data.data;
  }

  async getSnippetById(id: string): Promise<Snippet> {
    const response = await this.api.get<{ success: boolean; data: Snippet }>(
      `/snippets/${id}`
    );
    return response.data.data;
  }

  async getSnippetBySlug(slug: string): Promise<Snippet> {
    const response = await this.api.get<{ success: boolean; data: Snippet }>(
      `/snippets/import/${slug}`
    );
    return response.data.data;
  }

  async createSnippet(data: CreateSnippetData): Promise<Snippet> {
    const response = await this.api.post<{ success: boolean; data: Snippet }>(
      '/snippets',
      data
    );
    return response.data.data;
  }

  async deleteSnippet(id: string): Promise<void> {
    await this.api.delete(`/snippets/${id}`);
  }
}
