import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import api from '../utils/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || 'null');
    } catch {
      return null;
    }
  });

  const login = useCallback((token, nextUser) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(nextUser));
    setUser(nextUser);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }, []);

  // Every visitor gets a silent guest session — no signup walls anywhere.
  useEffect(() => {
    if (user) return;
    let cancelled = false;
    api
      .post('/auth/guest')
      .then((res) => {
        if (!cancelled) login(res.data.token, res.data.user);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [user, login]);

  const value = useMemo(() => ({ user, login, logout }), [user, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
