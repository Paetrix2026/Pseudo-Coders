/**
 * AuthContext.tsx
 *
 * Drives authentication state from Firebase onAuthStateChanged.
 * login / signup / logout are now async and delegate to authService.
 *
 * authLoading = true until Firebase resolves the initial session —
 * prevents a flash to the login screen on page refresh.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  firebaseSignup,
  firebaseLogin,
  firebaseLogout,
  loginWithGoogle as authServiceLoginWithGoogle,
  onAuthChange,
} from '../services/authService';
import { saveIsAuthenticated } from '../services/userService';

// ── Types ─────────────────────────────────────

interface LoginResult {
  ok: boolean;
  username?: string;
  email?: string;
  error?: string;
}

interface SignupResult {
  ok: boolean;
  error?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  /** true while Firebase resolves the initial session — show a loading screen */
  authLoading: boolean;
  login: (email: string, pass: string) => Promise<LoginResult>;
  signup: (email: string, pass: string, username: string) => Promise<SignupResult>;
  loginWithGoogle: () => Promise<LoginResult>;
  logout: () => Promise<void>;
}

// ── Context ───────────────────────────────────

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ── Provider ──────────────────────────────────

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  // Start as true — Firebase will confirm (or deny) the session asynchronously
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  // Subscribe to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthChange((firebaseUser) => {
      const authed = firebaseUser !== null;
      setIsAuthenticated(authed);
      saveIsAuthenticated(authed); // keep localStorage flag in sync for legacy checks
      setAuthLoading(false);       // Firebase has resolved — safe to render routes
    });

    return unsubscribe; // clean up listener on unmount
  }, []);

  // ── Actions ───────────────────────────────────

  const login = async (email: string, pass: string): Promise<LoginResult> => {
    const result = await firebaseLogin(email, pass);
    return {
      ok: result.ok,
      username: result.username,
      email: result.email,
      error: result.error,
    };
  };

  const signup = async (
    email: string,
    pass: string,
    username: string
  ): Promise<SignupResult> => {
    const result = await firebaseSignup(email, pass, username);
    return {
      ok: result.ok,
      error: result.error,
    };
  };

  const loginWithGoogle = async (): Promise<LoginResult> => {
    const result = await authServiceLoginWithGoogle();
    return {
      ok: result.ok,
      username: result.username,
      email: result.email,
      error: result.error,
    };
  };

  const logout = async (): Promise<void> => {
    await firebaseLogout();
    // isAuthenticated will be set to false automatically via onAuthChange listener
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, authLoading, login, signup, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ── Hook ──────────────────────────────────────

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
