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
    const savedUserStr = localStorage.getItem('user');
    const savedUser = savedUserStr ? JSON.parse(savedUserStr) : null;
    if (savedUser?.email) {
      const saved = localStorage.getItem(`theme_${savedUser.email}`);
      return (saved as Theme) || 'light';
    }
    return 'light';
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
    if (user?.email) {
      localStorage.setItem(`theme_${user.email}`, theme);
    }
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme, user]);

  useEffect(() => {
    if (user?.email) {
      const savedTheme = localStorage.getItem(`theme_${user.email}`);
      if (savedTheme) {
        setTheme(savedTheme as Theme);
      } else {
        setTheme('light');
      }
    } else {
      setTheme('light');
    }
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
