"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import api from "@/lib/api";

interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  avatar_url: string | null;
  role: string;
  credits: number;
  max_endpoints: number;
  is_verified: boolean;
  created_at: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoaded: boolean;
  isSignedIn: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string; role?: string }>;
  signUp: (
    email: string,
    password: string,
    name?: string
  ) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoaded: false,
  isSignedIn: false,
  signIn: async () => ({}),
  signUp: async () => ({}),
  signOut: async () => {},
  refreshUser: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load user from token on mount
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setIsLoaded(true);
        return;
      }

      try {
        const res = await api.get("/api/v1/auth/me");
        setUser(res.data);
      } catch {
        // Token invalid — clear
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");
      } finally {
        setIsLoaded(true);
      }
    };

    loadUser();
  }, []);

  const signIn = useCallback(
    async (email: string, password: string): Promise<{ error?: string; role?: string }> => {
      try {
        const res = await api.post("/api/v1/auth/login", { email, password });
        const { access_token, refresh_token } = res.data;

        localStorage.setItem("access_token", access_token);
        localStorage.setItem("refresh_token", refresh_token);

        // Fetch user profile
        const userRes = await api.get("/api/v1/auth/me");
        setUser(userRes.data);
        localStorage.setItem("user", JSON.stringify(userRes.data));

        return { role: userRes.data.role };
      } catch (err: any) {
        return {
          error:
            err.response?.data?.detail || "Invalid email or password",
        };
      }
    },
    []
  );

  const signUp = useCallback(
    async (
      email: string,
      password: string,
      name?: string
    ): Promise<{ error?: string }> => {
      try {
        const res = await api.post("/api/v1/auth/register", {
          email,
          password,
          name,
        });
        const { access_token, refresh_token } = res.data;

        localStorage.setItem("access_token", access_token);
        localStorage.setItem("refresh_token", refresh_token);

        // Fetch user profile
        const userRes = await api.get("/api/v1/auth/me");
        setUser(userRes.data);
        localStorage.setItem("user", JSON.stringify(userRes.data));

        return {};
      } catch (err: any) {
        return {
          error: err.response?.data?.detail || "Registration failed",
        };
      }
    },
    []
  );

  const signOut = useCallback(async () => {
    try {
      await api.post("/api/v1/auth/logout");
    } catch {
      // Ignore errors on logout
    } finally {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");
      setUser(null);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const res = await api.get("/api/v1/auth/me");
      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
    } catch {
      // Ignore
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoaded,
        isSignedIn: !!user,
        signIn,
        signUp,
        signOut,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export function useUser() {
  const { user, isLoaded } = useContext(AuthContext);
  return { user, isLoaded };
}
