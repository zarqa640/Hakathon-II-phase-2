'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';

// Define types
export interface User {
  id: string;
  email: string;
  name: string;
  image?: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

interface AuthAction {
  type: string;
  payload?: any;
}

interface AuthContextType {
  state: AuthState;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: {
    email: string;
    password: string;
    password_confirm: string;
    first_name?: string;
    last_name?: string;
  }) => Promise<void>;
  logout: () => void;
}

// Initial state
const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  error: null,
};

// Auth reducer
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
        isLoading: false,
        user: action.payload.user,
        token: action.payload.token,
        error: null,
      };
    case 'AUTH_ERROR':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
      };
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const router = useRouter();

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await authClient.session();
        if (session?.data?.user) {
          dispatch({
            type: 'AUTH_SUCCESS',
            payload: {
              user: session.data.user,
              token: session.data.session?.id || null,
            },
          });
        }
      } catch (error) {
        console.error('Failed to get session:', error);
      }
    };
    checkSession();
  }, []);

  // Login function using Better Auth
  const login = async (email: string, password: string) => {
    dispatch({ type: 'AUTH_START' });

    try {
      const result = await authClient.signIn.email({
        email,
        password,
      });

      if (result.error) {
        throw new Error(result.error.message || 'Login failed');
      }

      if (result.data?.user) {
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: {
            user: result.data.user,
            token: result.data.session?.id || null,
          },
        });
        router.push('/dashboard');
      }
    } catch (error: any) {
      dispatch({
        type: 'AUTH_ERROR',
        payload: error.message || 'Login failed',
      });
      throw error;
    }
  };

  // Register function using Better Auth
  const register = async (userData: {
    email: string;
    password: string;
    password_confirm: string;
    first_name?: string;
    last_name?: string;
  }) => {
    dispatch({ type: 'AUTH_START' });

    try {
      const name = [userData.first_name, userData.last_name].filter(Boolean).join(' ') || userData.email;
      const result = await authClient.signUp.email({
        email: userData.email,
        password: userData.password,
        name,
      });

      if (result.error) {
        throw new Error(result.error.message || 'Registration failed');
      }

      if (result.data?.user) {
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: {
            user: result.data.user,
            token: result.data.session?.id || null,
          },
        });
        router.push('/dashboard');
      }
    } catch (error: any) {
      dispatch({
        type: 'AUTH_ERROR',
        payload: error.message || 'Registration failed',
      });
      throw error;
    }
  };

  // Logout function using Better Auth
  const logout = async () => {
    try {
      await authClient.signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }

    dispatch({ type: 'LOGOUT' });
    router.push('/login');
  };

  const value = {
    state,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
