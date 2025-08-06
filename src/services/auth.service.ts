// Authentication Service
import { api } from '@/lib/api';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user_id: number;
  username: string;
  is_student: boolean;
  is_admin: boolean;
  is_security: boolean;
  is_lecturer?: boolean;
  student_id?: string;
  name: string;
  admission_number?: string;
  employee_id?: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'student' | 'lecturer' | 'admin' | 'security';
  employee_id?: string;
  department?: string;
  phone_number?: string;
  is_approved: boolean;
  is_active: boolean;
  date_joined: string;
  avatar?: string;
  avatar_url?: string;
}

export interface UpdateProfileData {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone_number?: string;
  department?: string;
  avatar?: File;
}

export class AuthService {
  private static instance: AuthService;

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await api.request<LoginResponse>('/auth/login/', {
      method: 'POST',
      body: credentials,
    });

    // Store tokens
    localStorage.setItem('access_token', response.access);
    localStorage.setItem('refresh_token', response.refresh);
    localStorage.setItem('user_role', this.getUserRole(response));

    return response;
  }

  async logout(): Promise<void> {
    const refreshToken = localStorage.getItem('refresh_token');
    
    try {
      await api.request('/auth/logout/', {
        method: 'POST',
        body: { refresh: refreshToken },
      });
    } catch (error) {
      console.warn('Logout request failed, clearing local storage anyway');
    }

    this.clearTokens();
  }

  async refreshToken(): Promise<string> {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await api.request<{ access: string }>('/auth/refresh/', {
      method: 'POST',
      body: { refresh: refreshToken },
    });

    localStorage.setItem('access_token', response.access);
    return response.access;
  }

  async getCurrentUser(): Promise<User> {
    return api.request<User>('/auth/user/');
  }

  async updateProfile(data: UpdateProfileData): Promise<User> {
    let body: FormData | object;

    if (data.avatar) {
      body = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined) {
          (body as FormData).append(key, value);
        }
      });
    } else {
      const { avatar, ...jsonData } = data;
      body = jsonData;
    }

    const response = await api.request<{ user: User }>('/auth/user/', {
      method: 'PUT',
      body,
    });

    return response.user;
  }

  async sendOTP(email: string, purpose: 'email_verification' | 'password_reset'): Promise<void> {
    await api.request('/auth/send-otp/', {
      method: 'POST',
      body: { email, purpose },
    });
  }

  getUserRole(loginResponse: LoginResponse): string {
    if (loginResponse.is_admin) return 'admin';
    if (loginResponse.is_lecturer) return 'lecturer';
    if (loginResponse.is_security) return 'security';
    if (loginResponse.is_student) return 'student';
    return 'unknown';
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  }

  getCurrentUserRole(): string | null {
    return localStorage.getItem('user_role');
  }

  clearTokens(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_role');
  }
}

export const authService = AuthService.getInstance();