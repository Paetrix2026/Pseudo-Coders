import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, pass: string) => boolean;
  signup: (email: string, pass: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('isAuthenticated', String(isAuthenticated));
  }, [isAuthenticated]);

  const login = (email: string, pass: string) => {
    const usersStr = localStorage.getItem('dummy_users') || '[]';
    const users = JSON.parse(usersStr);
    const user = users.find((u: any) => u.email === email && u.password === pass);
    if (user) {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const signup = (email: string, pass: string) => {
    const usersStr = localStorage.getItem('dummy_users') || '[]';
    const users = JSON.parse(usersStr);
    if (users.find((u: any) => u.email === email)) {
      return false; // already exists
    }
    users.push({ email, password: pass });
    localStorage.setItem('dummy_users', JSON.stringify(users));
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
