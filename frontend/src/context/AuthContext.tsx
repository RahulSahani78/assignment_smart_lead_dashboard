import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  getStoredToken,
  setStoredToken,
  setUnauthorizedHandler,
} from '../api/axios';
import {
  loginRequest,
  meRequest,
  registerRequest,
  type RegisterPayload,
} from '../api/auth.api';
import type { User } from '../types';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  loading: boolean;
  initializing: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => getStoredToken());
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState<boolean>(() => !!getStoredToken());

  const logout = useCallback(() => {
    setStoredToken(null);
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(() => logout());
  }, [logout]);

  // hydrate user on first mount when token exists
  useEffect(() => {
    let active = true;
    const bootstrap = async () => {
      const stored = getStoredToken();
      if (!stored) {
        setInitializing(false);
        return;
      }
      try {
        const u = await meRequest();
        if (active) setUser(u);
      } catch {
        if (active) logout();
      } finally {
        if (active) setInitializing(false);
      }
    };
    void bootstrap();
    return () => {
      active = false;
    };
  }, [logout]);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      const result = await loginRequest(email, password);
      setStoredToken(result.token);
      setToken(result.token);
      setUser(result.user);
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    setLoading(true);
    try {
      const result = await registerRequest(payload);
      setStoredToken(result.token);
      setToken(result.token);
      setUser(result.user);
    } finally {
      setLoading(false);
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      loading,
      initializing,
      login,
      register,
      logout,
      isAuthenticated: !!user && !!token,
      isAdmin: user?.role === 'admin',
    }),
    [user, token, loading, initializing, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
