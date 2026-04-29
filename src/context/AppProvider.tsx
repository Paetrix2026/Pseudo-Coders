import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  saveSessionUser,
  clearSessionUser,
  getUserTheme,
  saveGlobalTheme,
  saveUserTheme,
  getUserMode,
  saveUserMode,
  getGlobalTheme,
} from '../services/userService';

type Theme = 'light' | 'dark';
type AccessibilityMode = 'ADHD' | 'Dyslexia' | 'Autism' | 'None';

interface User {
  name: string;
  email: string;
}

interface AppContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  user: User | null;
  setUser: (user: User | null) => void;
  mode: AccessibilityMode;
  setMode: (mode: AccessibilityMode) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    // 1. Check user-specific key first (synchronous init — service layer is a thin wrapper here)
    const savedUserStr = localStorage.getItem('user');
    const savedUser = savedUserStr ? JSON.parse(savedUserStr) : null;
    if (savedUser?.email) {
      const userTheme = localStorage.getItem(`theme_${savedUser.email}`);
      if (userTheme) return userTheme as Theme;
    }
    // 2. Fall back to global key (covers Landing/Login/Signup pages)
    const globalTheme = localStorage.getItem('theme');
    return (globalTheme as Theme) || 'light';
  });

  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const [mode, setMode] = useState<AccessibilityMode>(() => {
    const savedUserStr = localStorage.getItem('user');
    const savedUser = savedUserStr ? JSON.parse(savedUserStr) : null;
    if (savedUser?.email) {
      const saved = localStorage.getItem(`mode_${savedUser.email}`);
      return (saved as AccessibilityMode) || 'None';
    }
    return 'None';
  });

  // Persist theme via service
  useEffect(() => {
    saveGlobalTheme(theme);
    if (user?.email) {
      saveUserTheme(user.email, theme);
    }
    // Apply to DOM
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme, user]);

  // Restore user-specific theme on login
  useEffect(() => {
    if (user?.email) {
      Promise.all([getUserTheme(user.email), getGlobalTheme()]).then(([userTheme, globalTheme]) => {
        const resolved = userTheme || globalTheme;
        setTheme((resolved as Theme) || 'light');
      });
    }
  }, [user?.email]);

  // Persist session user via service
  useEffect(() => {
    if (user) {
      saveSessionUser(user);
    } else {
      clearSessionUser();
    }
  }, [user]);

  // Persist mode via service
  useEffect(() => {
    if (user?.email) {
      saveUserMode(user.email, mode);
    }
  }, [mode, user]);

  // Restore mode on login
  useEffect(() => {
    if (user?.email) {
      getUserMode(user.email).then(savedMode => {
        setMode(savedMode ? (savedMode as AccessibilityMode) : 'None');
      });
    } else {
      setMode('None');
    }
  }, [user?.email]);

  return (
    <AppContext.Provider value={{ theme, setTheme, user, setUser, mode, setMode }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
