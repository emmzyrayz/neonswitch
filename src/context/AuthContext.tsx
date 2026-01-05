"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  neonId: string;
  role: string;
  isEmailVerified: boolean;
}

interface AuthContextType {
  // State
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;

  // Auth Methods
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: (allDevices?: boolean) => Promise<void>;
  verifyEmail: (email: string, token?: string, code?: string) => Promise<void>;
  resendVerification: (email: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (email: string, newPassword: string, token?: string, code?: string) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  
  // Utility Methods
  refreshToken: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Get access token from localStorage
  const getAccessToken = useCallback(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('accessToken');
    }
    return null;
  }, []);

  // Set access token in localStorage
  const setAccessToken = useCallback((token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', token);
    }
  }, []);

  // Remove access token
  const removeAccessToken = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
    }
  }, []);

  // API call helper with token - wrapped in useCallback
  const apiCall = useCallback(async (endpoint: string, options: RequestInit = {}) => {
    const token = getAccessToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    const response = await fetch(`/api/auth${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Something went wrong');
    }

    return data;
  }, [getAccessToken]);

  // Check if user is authenticated
  const checkAuth = useCallback(async () => {
    const token = getAccessToken();
    
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const data = await apiCall('/me');
      setUser(data.user);
    } catch (error) {
      console.error('Auth check failed:', error);
      removeAccessToken();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [apiCall, getAccessToken, removeAccessToken]);

  // Refresh access token
  const refreshToken = useCallback(async () => {
    try {
      const data = await apiCall('/refresh', { method: 'POST' });
      setAccessToken(data.accessToken);
      setUser(data.user);
    } catch (error) {
      console.error('Token refresh failed:', error);
      removeAccessToken();
      setUser(null);
      router.push('/auth/login');
    }
  }, [apiCall, setAccessToken, removeAccessToken, router]);

  // Login
  const login = useCallback(async (email: string, password: string, rememberMe = false) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await apiCall('/login', {
        method: 'POST',
        body: JSON.stringify({ email, password, rememberMe }),
      });

      setAccessToken(data.accessToken);
      setUser(data.user);
      router.push('/dashboard');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [apiCall, setAccessToken, router]);

  // Register
  const register = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await apiCall('/register', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      router.push('/auth/verify-email?email=' + encodeURIComponent(email));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [apiCall, router]);

  // Logout
  const logout = useCallback(async (allDevices = false) => {
    setIsLoading(true);
    setError(null);

    try {
      if (allDevices) {
        await apiCall('/logout', { method: 'DELETE' });
      } else {
        await apiCall('/logout', { method: 'POST' });
      }

      removeAccessToken();
      setUser(null);
      router.push('/auth/login');
    } catch (err) {
      console.error('Logout error:', err);
      // Force logout even if API fails
      removeAccessToken();
      setUser(null);
      router.push('/auth/login');
    } finally {
      setIsLoading(false);
    }
  }, [apiCall, removeAccessToken, router]);

  // Verify Email
  const verifyEmail = useCallback(async (email: string, token?: string, code?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await apiCall('/verify', {
        method: 'POST',
        body: JSON.stringify({ email, token, code }),
      });

      router.push('/auth/login?verified=true');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Verification failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [apiCall, router]);

  // Resend Verification
  const resendVerification = useCallback(async (email: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await apiCall('/resend-verification', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to resend verification';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [apiCall]);

  // Forgot Password
  const forgotPassword = useCallback(async (email: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await apiCall('/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });

      router.push('/auth/reset-password?email=' + encodeURIComponent(email));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send reset email';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [apiCall, router]);

  // Reset Password
  const resetPassword = useCallback(async (
    email: string,
    newPassword: string,
    token?: string,
    code?: string
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      await apiCall('/reset-password', {
        method: 'POST',
        body: JSON.stringify({ email, newPassword, token, code }),
      });

      router.push('/auth/login?reset=true');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Password reset failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [apiCall, router]);

  // Change Password
  const changePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await apiCall('/change-password', {
        method: 'POST',
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      // Force re-login after password change
      await logout();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Password change failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [apiCall, logout]);

  // Clear error
  const clearError = useCallback(() => setError(null), []);

  // Check auth on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Auto-refresh token before expiry (55 minutes for 1 hour token)
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      refreshToken();
    }, 55 * 60 * 1000); // 55 minutes

    return () => clearInterval(interval);
  }, [user, refreshToken]);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    error,
    login,
    register,
    logout,
    verifyEmail,
    resendVerification,
    forgotPassword,
    resetPassword,
    changePassword,
    refreshToken,
    checkAuth,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}