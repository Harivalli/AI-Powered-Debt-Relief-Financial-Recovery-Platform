import { createContext, useContext, useState, useCallback } from 'react';
import { authApi } from '../api/endpoints';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('finrelief_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('finrelief_token'));

  const persist = (accessToken, userData) => {
    localStorage.setItem('finrelief_token', accessToken);
    localStorage.setItem('finrelief_user', JSON.stringify(userData));
    setToken(accessToken);
    setUser(userData);
  };

  const login = useCallback(async (email, password) => {
    const res = await authApi.login(email, password);
    persist(res.data.access_token, res.data.user);
    return res.data.user;
  }, []);

  const register = useCallback(async (fullName, email, password) => {
    const res = await authApi.register({ full_name: fullName, email, password });
    persist(res.data.access_token, res.data.user);
    return res.data.user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('finrelief_token');
    localStorage.removeItem('finrelief_user');
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
