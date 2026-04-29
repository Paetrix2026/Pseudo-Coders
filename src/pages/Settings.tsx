import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppProvider';
import { useProfileContext } from '../context/ProfileContext';
import { Pencil, Check, X } from 'lucide-react';

export const Settings: React.FC = () => {
  const { theme, setTheme, mode, setMode, user, setUser } = useAppContext();
  const { profile, updateProfile } = useProfileContext();
  const navigate = useNavigate();

  // Profile edit state
  const [editingUsername, setEditingUsername] = useState(false);
  const [draftUsername, setDraftUsername] = useState('');
  const [editingPrefs, setEditingPrefs] = useState(false);

  const handleClearData = () => {
    if (confirm("Are you sure you want to clear all local data? You will be logged out.")) {
      localStorage.clear();
      setUser(null);
    }
  };

  const handleRetakeQuiz = () => {
    if (confirm("Retake the assessment? This will reset your current accessibility mode.")) {
      if (user?.email) {
        localStorage.removeItem(`onboarding_${user.email}`);
        localStorage.removeItem(`mode_${user.email}`);
      }
      setMode('None');
      navigate('/onboarding');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400">Manage your preferences and data.</p>
      </div>

      <div className="space-y-6">

        {/* ── Profile ── */}
        <div className="bg-card-light dark:bg-card-dark p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-semibold mb-5">Profile</h2>
          <div className="space-y-4">

            {/* Username */}
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Username</div>
                {editingUsername ? (
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="text"
                      value={draftUsername}
                      onChange={e => setDraftUsername(e.target.value)}
                      className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-primary transition-colors"
                      autoFocus
                    />
                    <button
                      onClick={() => { updateProfile({ username: draftUsername.trim() || profile.username }); setEditingUsername(false); }}
                      className="p-1.5 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
                    ><Check size={16} /></button>
                    <button
                      onClick={() => setEditingUsername(false)}
                      className="p-1.5 bg-gray-100 dark:bg-gray-800 text-gray-500 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    ><X size={16} /></button>
                  </div>
                ) : (
                  <div className="font-semibold text-lg mt-0.5">{profile.username || user?.name}</div>
                )}
              </div>
              {!editingUsername && (
                <button
                  onClick={() => { setDraftUsername(profile.username || user?.name || ''); setEditingUsername(true); }}
                  className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                ><Pencil size={16} /></button>
              )}
            </div>

            <div className="h-px bg-gray-100 dark:bg-gray-800" />

            {/* Study Preferences */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="font-medium text-gray-700 dark:text-gray-300">Study Preferences</div>
                <button
                  onClick={() => setEditingPrefs(p => !p)}
                  className="text-xs text-primary font-semibold hover:underline"
                >{editingPrefs ? 'Done' : 'Edit'}</button>
              </div>
              {editingPrefs ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Preferred study time</label>
                    <select
                      value={profile.studyTime}
                      onChange={e => updateProfile({ studyTime: e.target.value as any })}
                      className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary transition-colors"
                    >
                      <option value="">Not set</option>
                      <option value="morning">Morning</option>
                      <option value="afternoon">Afternoon</option>
                      <option value="evening">Evening</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Preferred focus duration (minutes)</label>
                    <select
                      value={profile.focusDuration}
                      onChange={e => updateProfile({ focusDuration: e.target.value as any })}
                      className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary transition-colors"
                    >
                      <option value="15">15 min</option>
                      <option value="25">25 min (Pomodoro)</option>
                      <option value="45">45 min</option>
                      <option value="60">60 min</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Study goal</label>
                    <input
                      type="text"
                      value={profile.studyGoal}
                      onChange={e => updateProfile({ studyGoal: e.target.value })}
                      placeholder="e.g. Pass my final exams"
                      className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary transition-colors"
                    />
                  </div>
                </div>
              ) : (
                <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <div>Study time: <span className="font-medium capitalize">{profile.studyTime || '—'}</span></div>
                  <div>Focus duration: <span className="font-medium">{profile.focusDuration ? `${profile.focusDuration} min` : '—'}</span></div>
                  <div>Goal: <span className="font-medium">{profile.studyGoal || '—'}</span></div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Anonymity ── */}
        <div className="bg-card-light dark:bg-card-dark p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-semibold mb-2">Community Identity</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-5">
            Control how you appear in Shoutouts and Forum posts.
          </p>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-gray-800 dark:text-gray-200">Stay Anonymous</div>
              <div className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
                Show as "Anonymous" instead of <span className="font-medium text-primary">{profile.username || user?.name}</span>
              </div>
            </div>
            <button
              role="switch"
              aria-checked={profile.isAnonymous}
              onClick={() => updateProfile({ isAnonymous: !profile.isAnonymous })}
              className={`relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none ${
                profile.isAnonymous ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
                  profile.isAnonymous ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* ── Preferences ── */}
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

        {/* Assessment */}
        <div className="bg-card-light dark:bg-card-dark p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-semibold mb-2">Thinking Style Assessment</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-5">
            Current mode: <span className="font-bold text-primary">{mode}</span>
          </p>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-gray-800 dark:text-gray-200">Retake Assessment</div>
              <div className="text-gray-500 dark:text-gray-400 mt-1 text-sm">Recalibrate your accessibility mode</div>
            </div>
            <button
              onClick={handleRetakeQuiz}
              className="px-5 py-2.5 bg-primary/10 text-primary rounded-xl font-semibold hover:bg-primary/20 transition-colors"
            >
              Retake Quiz
            </button>
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
