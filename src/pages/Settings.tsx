import React from 'react';
import { useAppContext } from '../context/AppProvider';

export const Settings: React.FC = () => {
  const { theme, setTheme, mode, setMode, user, setUser } = useAppContext();

  const handleClearData = () => {
    if (confirm("Are you sure you want to clear all local data? You will be logged out.")) {
      localStorage.clear();
      setUser(null);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400">Manage your preferences and data.</p>
      </div>

      <div className="space-y-6">
        {/* Profile */}
        <div className="bg-card-light dark:bg-card-dark p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-semibold mb-4">Profile</h2>
          <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
            <span className="text-gray-600 dark:text-gray-400 font-medium">Name</span>
            <span className="font-semibold text-lg">{user?.name}</span>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-card-light dark:bg-card-dark p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-semibold mb-6">Preferences</h2>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-lg">Theme</div>
                <div className="text-gray-500 dark:text-gray-400 mt-1">Choose your visual style</div>
              </div>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value as 'light' | 'dark')}
                className="bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 outline-none focus:border-primary font-medium transition-colors"
              >
                <option value="light">Light Mode</option>
                <option value="dark">Dark Mode</option>
              </select>
            </div>

            <div className="h-px bg-gray-100 dark:bg-gray-800 w-full" />

            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-lg">Accessibility Mode</div>
                <div className="text-gray-500 dark:text-gray-400 mt-1">Adapts tasks to your needs</div>
              </div>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value as any)}
                className="bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 outline-none focus:border-primary font-medium transition-colors"
              >
                <option value="None">Default</option>
                <option value="ADHD">ADHD Mode</option>
                <option value="Dyslexia">Dyslexia Mode</option>
                <option value="Autism">Autism Mode</option>
              </select>
            </div>
          </div>
        </div>

        {/* Data */}
        <div className="bg-card-light dark:bg-card-dark p-6 rounded-2xl shadow-sm border border-red-100 dark:border-red-900/30">
          <h2 className="text-xl font-semibold mb-6 text-red-500">Danger Zone</h2>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-gray-800 dark:text-gray-200">Clear Local Data</div>
              <div className="text-gray-500 dark:text-gray-400 mt-1">Removes all tasks, posts, and settings</div>
            </div>
            <button
              onClick={handleClearData}
              className="px-5 py-2.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl font-semibold hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
            >
              Clear Everything
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
