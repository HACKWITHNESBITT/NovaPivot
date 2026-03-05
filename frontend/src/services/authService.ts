// API base URL for auth server
const AUTH_API_URL = 'http://localhost:5002/api/auth';

// Types
export interface User {
  id: string;
  fullName: string;
  email: string;
  avatar?: string;
  isEmailVerified: boolean;
  provider: string;
  createdAt: string;
  lastLogin?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Auth service class
class AuthService {
  private token: string | null = null;
  private user: User | null = null;

  constructor() {
    // Initialize from localStorage
    this.token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (userStr) {
      this.user = JSON.parse(userStr);
    }
  }

  // Register new user
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await fetch(`${AUTH_API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Registration failed');
      }

      this.setAuthData(result.data.user, result.data.token);
      return result;
    } catch (error) {
      if (error instanceof TypeError) {
        // Network error — server unreachable
        throw new Error('Cannot connect to auth server. Please ensure the auth server is running on port 5002.');
      }
      // Server returned an error (e.g. email already exists)
      throw error;
    }
  }

  // Login user
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch(`${AUTH_API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Invalid email or password');
      }

      this.setAuthData(result.data.user, result.data.token);
      return result;
    } catch (error) {
      if (error instanceof TypeError) {
        // Network error — server unreachable
        throw new Error('Cannot connect to auth server. Please ensure the auth server is running on port 5002.');
      }
      // Server returned an error (e.g. wrong credentials)
      throw error;
    }
  }

  // Get current user
  async getCurrentUser(): Promise<User | null> {
    if (!this.token) return null;

    try {
      const response = await fetch(`${AUTH_API_URL}/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        this.user = result.data.user;
        localStorage.setItem('user', JSON.stringify(this.user));
        return this.user;
      } else {
        // Token invalid, clear auth data
        this.clearAuthData();
        return null;
      }
    } catch (error) {
      console.error('Get current user error:', error);
      this.clearAuthData();
      return null;
    }
  }

  // Logout user
  async logout(): Promise<void> {
    if (!this.token) return;

    try {
      await fetch(`${AUTH_API_URL}/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
        },
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearAuthData();
    }
  }

  // Forgot password
  async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${AUTH_API_URL}/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      return await response.json();
    } catch (error) {
      console.error('Forgot password error:', error);
      throw new Error('Network error during password reset request');
    }
  }

  // Reset password
  async resetPassword(token: string, password: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${AUTH_API_URL}/reset-password/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password, confirmPassword: password }),
      });

      const result = await response.json();

      if (result.success) {
        this.setAuthData(result.data.user, result.data.token);
      }

      return result;
    } catch (error) {
      console.error('Reset password error:', error);
      throw new Error('Network error during password reset');
    }
  }

  // Set auth data
  private setAuthData(user: User, token: string): void {
    this.user = user;
    this.token = token;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }

  // Clear auth data
  private clearAuthData(): void {
    this.user = null;
    this.token = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  // Getters
  get isAuthenticated(): boolean {
    return !!this.token;
  }

  get currentUser(): User | null {
    return this.user;
  }

  get authToken(): string | null {
    return this.token;
  }
}

// Create singleton instance
export const authService = new AuthService();
