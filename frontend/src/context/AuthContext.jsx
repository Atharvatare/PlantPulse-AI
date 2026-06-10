import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { login as loginApi, register as registerApi, getProfile } from '../services/authService';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      getProfile()
        .then((res) => {
          if (res.data?.success && res.data?.data) setUser(res.data.data);
          else if (res.data?.user) setUser(res.data.user);
          else if (res.data?.id) setUser(res.data);
        })
        .catch(() => { localStorage.removeItem('token'); setToken(null); setUser(null); })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = useCallback(async (email, password) => {
    const res = await loginApi(email, password);
    const payload = res.data?.data || res.data;
    const t = payload?.token;
    const u = payload?.user || payload;
    if (!t) throw new Error(payload?.message || 'Login failed');
    localStorage.setItem('token', t);
    setToken(t);
    setUser(u);
    toast.success('Logged in successfully');
    return u;
  }, []);

  const register = useCallback(async (data) => {
    const res = await registerApi(data);
    toast.success('Registration successful! Please log in.');
    return res.data?.data || res.data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    toast.success('Logged out');
  }, []);

  const isAuthenticated = !!token;
  const isAdmin = user?.role === 'Admin';

  const value = useMemo(() => ({
    user, token, loading, isAuthenticated, isAdmin,
    login, register, logout, setUser
  }), [user, token, loading, isAuthenticated, isAdmin, login, register, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
