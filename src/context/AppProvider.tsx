import React, { createContext, useContext, useState, useEffect } from 'react';

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
    // 1. Check user-specific key first
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

  useEffect(() => {
    // Always persist to global key so Landing/Login/Signup pages see it too
    localStorage.setItem('theme', theme);
    // Also persist to user-specific key if logged in
    if (user?.email) {
      localStorage.setItem(`theme_${user.email}`, theme);
    }
    // Apply to DOM
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme, user]);

  useEffect(() => {
    if (user?.email) {
      // Load user-specific theme, but fall back to global theme (not just 'light')
      const savedTheme = localStorage.getItem(`theme_${user.email}`) || localStorage.getItem('theme');
      setTheme((savedTheme as Theme) || 'light');
    }
    // Do NOT reset to 'light' when no user — keep the global theme
  }, [user?.email]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  useEffect(() => {
    if (user?.email) {
      localStorage.setItem(`mode_${user.email}`, mode);
    }
  }, [mode, user]);

  useEffect(() => {
    if (user?.email) {
      const savedMode = localStorage.getItem(`mode_${user.email}`);
      if (savedMode) {
        setMode(savedMode as AccessibilityMode);
      } else {
        setMode('None');
      }
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
