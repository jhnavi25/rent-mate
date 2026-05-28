import React, { createContext, useContext, useEffect, useState } from 'react';
import { api, clearToken, loadToken, setToken } from '../api/client';

interface User {
  id: string;
  phone: string;
  name?: string;
  kycStatus: string;
  role: string;
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (phone: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const me = await api<User>('/users/me');
      setUser(me);
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    (async () => {
      await loadToken();
      await refreshUser();
      setLoading(false);
    })();
  }, []);

  const login = async (phone: string) => {
    const dev = await api<{ accessToken: string; user: User }>('/auth/dev/login', {
      method: 'POST',
      body: JSON.stringify({ phone }),
    });
    await setToken(dev.accessToken);
    setUser(dev.user);
  };

  const logout = async () => {
    await clearToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
