import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  saveIsAuthenticated,
  saveUserRecord,
  saveLegacyUsers,
} from '../services/userService';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, pass: string) => { ok: boolean; username?: string };
  signup: (email: string, pass: string, username: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });

  useEffect(() => {
    saveIsAuthenticated(isAuthenticated);
  }, [isAuthenticated]);

  const login = (email: string, pass: string) => {
    // Synchronous read for instant UX — will become an async service call with Firebase
    const storedRaw = localStorage.getItem(`user_${email}`);
    if (storedRaw) {
      const record = JSON.parse(storedRaw);
      if (record.password === pass) {
        setIsAuthenticated(true);
        return { ok: true, username: record.username };
      }
      return { ok: false };
    }
    // Legacy fallback: check dummy_users list
    const usersStr = localStorage.getItem('dummy_users') || '[]';
    const users = JSON.parse(usersStr);
    const user = users.find((u: any) => u.email === email && u.password === pass);
    if (user) {
      setIsAuthenticated(true);
      return { ok: true, username: user.username };
    }
    return { ok: false };
  };

  const signup = (email: string, pass: string, username: string) => {
    const existing = localStorage.getItem(`user_${email}`);
    if (existing) return false;

    const usersStr = localStorage.getItem('dummy_users') || '[]';
    const users = JSON.parse(usersStr);
    if (users.find((u: any) => u.email === email)) return false;

    const record = { email, password: pass, username, isAnonymous: false };
    saveUserRecord(email, record); // via service

    users.push({ email, password: pass, username });
    saveLegacyUsers(users); // via service

    setIsAuthenticated(true);
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
