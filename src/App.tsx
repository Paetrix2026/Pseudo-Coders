import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAppContext } from './context/AppProvider';
import { useAuthContext } from './context/AuthContext';
import { useState, useEffect } from 'react';
import { getOnboardingComplete } from './services/userService';
import { Layout } from './components/Layout';

import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Onboarding } from './pages/Onboarding';
import { Dashboard } from './pages/Dashboard';
import { Tasks } from './pages/Tasks';
import { Focus } from './pages/Focus';
import { Community } from './pages/Community';
import { Settings } from './pages/Settings';
import { Landing } from './pages/Landing';

function App() {
  const { user } = useAppContext();
  const { isAuthenticated, authLoading } = useAuthContext();
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  useEffect(() => {
    if (user?.email) {
      getOnboardingComplete(user.email).then(setHasCompletedOnboarding);
    } else {
      setHasCompletedOnboarding(false);
    }
  }, [user?.email]);

  // ── Loading screen while Firebase resolves the session ──────────────
  // Prevents a flash to the Landing/Login page on refresh for logged-in users.
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-light dark:bg-bg-dark">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-primary/30 animate-pulse">
            C
          </div>
          <p className="text-gray-400 text-sm tracking-wide">Loading ClearMind…</p>
        </div>
      </div>
    );
  }

  // ── Public routes (unauthenticated) ─────────────────────────────────
  if (!isAuthenticated) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    );
  }

  // ── Private routes (authenticated) ──────────────────────────────────
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/onboarding" element={hasCompletedOnboarding ? <Navigate to="/dashboard" replace /> : <Onboarding />} />
        <Route path="/" element={hasCompletedOnboarding ? <Layout /> : <Navigate to="/onboarding" replace />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="focus" element={<Focus />} />
          <Route path="community" element={<Community />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
