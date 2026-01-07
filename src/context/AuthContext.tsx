"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";

// ========== INTERFACES ==========

interface User {
  id: string;
  email: string;
  phone: string;
  neonId: string;
  role: "user" | "admin";
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  kycTier: 0 | 1 | 2;
  kycStatus: "pending" | "approved" | "rejected";
  profile?: {
    firstName?: string;
    lastName?: string;
    dateOfBirth?: Date;
    nationality?: string;
    gender?: "male" | "female" | "other";
  };
  address?: {
    country?: string;
    state?: string;
    city?: string;
    street?: string;
    postalCode?: string;
  };
  kyc?: {
    idType?: "nin" | "passport" | "drivers_license";
    idVerified?: boolean;
    submittedAt?: Date;
    verifiedAt?: Date;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

interface RegisterData {
  email: string;
  password: string;
  phone: string;
  nationality: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth: string;
  gender: "male" | "female" | "other";
}

interface AuthContextType {
  // State
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;

  // Auth Methods
  login: (
    email: string,
    password: string,
    rememberMe?: boolean
  ) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: (allDevices?: boolean) => Promise<void>;

  // Verification Methods
  verifyEmail: (email: string, token?: string, code?: string) => Promise<void>;
  verifyPhone: (email: string, code: string) => Promise<void>;
  resendVerification: (
    email: string,
    type?: "email" | "phone"
  ) => Promise<void>;

  // Password Methods
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (
    email: string,
    newPassword: string,
    token?: string,
    code?: string
  ) => Promise<void>;
  changePassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<void>;

  // Utility Methods
  refreshToken: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ========== AUTH PROVIDER ==========

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // ========== TOKEN MANAGEMENT ==========

  const getAccessToken = useCallback(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("accessToken");
    }
    return null;
  }, []);

  const setAccessToken = useCallback((token: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("accessToken", token);
    }
  }, []);

  const removeAccessToken = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
    }
  }, []);

  // ========== API HELPER ==========

  const apiCall = useCallback(
    async (endpoint: string, options: RequestInit = {}) => {
      const token = getAccessToken();
      const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      };
      const cleanEndpoint = endpoint.startsWith("/")
        ? endpoint
        : `/${endpoint}`;

      const response = await fetch(`/api/auth${cleanEndpoint}`, {
        ...options,
        headers,
        credentials: "include", // Include cookies for refresh token
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      return data;
    },
    [getAccessToken]
  );

  // ========== AUTHENTICATION METHODS ==========

  const checkAuth = useCallback(async () => {
    const token = getAccessToken();

    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const data = await apiCall("/me");
      setUser(data.user);
    } catch (error) {
      console.error("Auth check failed:", error);
      removeAccessToken();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [apiCall, getAccessToken, removeAccessToken]);

  const refreshToken = useCallback(async () => {
    try {
      const data = await apiCall("/refresh", { method: "POST" });
      setAccessToken(data.accessToken);
      setUser(data.user);
    } catch (error) {
      console.error("Token refresh failed:", error);
      removeAccessToken();
      setUser(null);
      router.push("/auth/signin");
    }
  }, [apiCall, setAccessToken, removeAccessToken, router]);

  const login = useCallback(
    async (email: string, password: string, rememberMe = false) => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await apiCall("/login", {
          method: "POST",
          body: JSON.stringify({ email, password, rememberMe }),
        });

        setAccessToken(data.accessToken);
        setUser(data.user);
        router.push("/dashboard");
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Login failed";
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [apiCall, setAccessToken, router]
  );

  const register = useCallback(
    async (data: RegisterData) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await apiCall("/register", {
          method: "POST",
          body: JSON.stringify(data),
        });

        router.push(
          "/auth/verify?email=" + encodeURIComponent(data.email)
        );
        return response;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Registration failed";
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [apiCall, router]
  );

  const logout = useCallback(
    async (allDevices = false) => {
      setIsLoading(true);
      setError(null);

      try {
        const headers: HeadersInit = {};
        if (allDevices) {
          headers["x-logout-all"] = "true";
        }

        await apiCall("/logout", {
          method: "POST",
          headers,
        });

        removeAccessToken();
        setUser(null);
        router.push("/auth/signin");
      } catch (err) {
        console.error("Logout error:", err);
        // Force logout even if API fails
        removeAccessToken();
        setUser(null);
        router.push("/auth/signin");
      } finally {
        setIsLoading(false);
      }
    },
    [apiCall, removeAccessToken, router]
  );

  // ========== VERIFICATION METHODS ==========

  const verifyEmail = useCallback(
    async (email: string, token?: string, code?: string) => {
      setIsLoading(true);
      setError(null);

      try {
        await apiCall("/verify", {
          method: "POST",
          body: JSON.stringify({ email, token, code, type: "email" }),
        });

        router.push("/auth/signin?verified=true");
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Email verification failed";
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [apiCall, router]
  );

  const verifyPhone = useCallback(
    async (email: string, code: string) => {
      setIsLoading(true);
      setError(null);

      try {
        await apiCall("/verify", {
          method: "POST",
          body: JSON.stringify({ email, code, type: "phone" }),
        });

        // Refresh user data to reflect phone verification
        await checkAuth();
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Phone verification failed";
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [apiCall, checkAuth]
  );

  const resendVerification = useCallback(
    async (email: string, type: "email" | "phone" = "email") => {
      setIsLoading(true);
      setError(null);

      try {
        await apiCall("/resend-verification", {
          method: "POST",
          body: JSON.stringify({ email, type }),
        });
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to resend verification";
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [apiCall]
  );

  // ========== PASSWORD METHODS ==========

  const forgotPassword = useCallback(
    async (email: string) => {
      setIsLoading(true);
      setError(null);

      try {
        await apiCall("/forgot-password", {
          method: "POST",
          body: JSON.stringify({ email }),
        });

        router.push("/auth/reset-password?email=" + encodeURIComponent(email));
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to send reset email";
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [apiCall, router]
  );

  const resetPassword = useCallback(
    async (
      email: string,
      newPassword: string,
      token?: string,
      code?: string
    ) => {
      setIsLoading(true);
      setError(null);

      try {
        await apiCall("/reset-password", {
          method: "POST",
          body: JSON.stringify({ email, newPassword, token, code }),
        });

        router.push("/auth/signin?reset=true");
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Password reset failed";
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [apiCall, router]
  );

  const changePassword = useCallback(
    async (currentPassword: string, newPassword: string) => {
      setIsLoading(true);
      setError(null);

      try {
        await apiCall("/change-password", {
          method: "POST",
          body: JSON.stringify({ currentPassword, newPassword }),
        });

        // Force re-login after password change
        await logout();
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Password change failed";
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [apiCall, logout]
  );

  // ========== UTILITY METHODS ==========

  const clearError = useCallback(() => setError(null), []);

  // ========== EFFECTS ==========

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

  // ========== CONTEXT VALUE ==========

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    error,
    login,
    register,
    logout,
    verifyEmail,
    verifyPhone,
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

// ========== CUSTOM HOOK ==========

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
