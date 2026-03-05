import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { User, authService } from '../services/authService';

// Types
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthContextType extends AuthState {
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  register: (fullName: string, email: string, password: string, confirmPassword: string) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
  clearError: () => void;
}

// Action types
type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: User }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'AUTH_CLEAR_ERROR' }
  | { type: 'AUTH_SET_LOADING'; payload: boolean };

// Initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case 'AUTH_LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case 'AUTH_CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    case 'AUTH_SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      if (authService.isAuthenticated) {
        try {
          const user = await authService.getCurrentUser();
          if (user) {
            dispatch({ type: 'AUTH_SUCCESS', payload: user });
          } else {
            dispatch({ type: 'AUTH_LOGOUT' });
          }
        } catch (error) {
          console.error('Auth initialization error:', error);
          dispatch({ type: 'AUTH_LOGOUT' });
        }
      } else {
        dispatch({ type: 'AUTH_SET_LOADING', payload: false });
      }
    };

    initializeAuth();
  }, []);

  // Login
  const login = async (email: string, password: string, rememberMe = false): Promise<void> => {
    dispatch({ type: 'AUTH_START' });
    
    try {
      const result = await authService.login({ email, password, rememberMe });
      dispatch({ type: 'AUTH_SUCCESS', payload: result.data.user });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      dispatch({ type: 'AUTH_FAILURE', payload: message });
      throw error;
    }
  };

  // Register
  const register = async (
    fullName: string,
    email: string,
    password: string,
    confirmPassword: string
  ): Promise<void> => {
    dispatch({ type: 'AUTH_START' });
    
    try {
      const result = await authService.register({
        fullName,
        email,
        password,
        confirmPassword,
      });
      dispatch({ type: 'AUTH_SUCCESS', payload: result.data.user });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Registration failed';
      dispatch({ type: 'AUTH_FAILURE', payload: message });
      throw error;
    }
  };

  // Logout
  const logout = async (): Promise<void> => {
    dispatch({ type: 'AUTH_START' });
    
    try {
      await authService.logout();
      dispatch({ type: 'AUTH_LOGOUT' });
    } catch (error) {
      console.error('Logout error:', error);
      // Still logout even if API call fails
      dispatch({ type: 'AUTH_LOGOUT' });
    }
  };

  // Forgot password
  const forgotPassword = async (email: string): Promise<void> => {
    dispatch({ type: 'AUTH_START' });
    
    try {
      await authService.forgotPassword(email);
      dispatch({ type: 'AUTH_SET_LOADING', payload: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Password reset failed';
      dispatch({ type: 'AUTH_FAILURE', payload: message });
      throw error;
    }
  };

  // Reset password
  const resetPassword = async (token: string, password: string): Promise<void> => {
    dispatch({ type: 'AUTH_START' });
    
    try {
      const result = await authService.resetPassword(token, password);
      dispatch({ type: 'AUTH_SUCCESS', payload: result.data.user });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Password reset failed';
      dispatch({ type: 'AUTH_FAILURE', payload: message });
      throw error;
    }
  };

  // Clear error
  const clearError = (): void => {
    dispatch({ type: 'AUTH_CLEAR_ERROR' });
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
