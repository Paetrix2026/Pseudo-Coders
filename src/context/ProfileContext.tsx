import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAppContext } from './AppProvider';

// ─── Profile Data Shape ───────────────────────

export interface UserProfile {
  username: string;
  studyTime: 'morning' | 'afternoon' | 'evening' | '';
  focusDuration: '15' | '25' | '45' | '60' | '';
  studyGoal: string;
  isAnonymous: boolean;
}

const DEFAULT_PROFILE: UserProfile = {
  username: '',
  studyTime: '',
  focusDuration: '25',
  studyGoal: '',
  isAnonymous: false,
};

// ─── Context Type ─────────────────────────────

interface ProfileContextType {
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
  displayName: string; // resolved name for Community (Anonymous or username)
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

// ─── Provider ─────────────────────────────────

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAppContext();

  const loadProfile = (email: string): UserProfile => {
    const saved = localStorage.getItem(`profile_${email}`);
    if (saved) return { ...DEFAULT_PROFILE, ...JSON.parse(saved) };

    // Seed username from user record if available
    const userRecord = localStorage.getItem(`user_${email}`);
    const record = userRecord ? JSON.parse(userRecord) : null;
    return { ...DEFAULT_PROFILE, username: record?.username || email.split('@')[0] };
  };

  const [profile, setProfile] = useState<UserProfile>(() => {
    const email = (() => {
      const saved = localStorage.getItem('user');
      return saved ? JSON.parse(saved)?.email : null;
    })();
    return email ? loadProfile(email) : { ...DEFAULT_PROFILE };
  });

  // Reload profile whenever the logged-in user changes
  useEffect(() => {
    if (user?.email) {
      setProfile(loadProfile(user.email));
    }
  }, [user?.email]);

  // Persist on every change
  useEffect(() => {
    if (user?.email) {
      localStorage.setItem(`profile_${user.email}`, JSON.stringify(profile));

      // Also update the username in the user_${email} auth record
      const userRecord = localStorage.getItem(`user_${user.email}`);
      if (userRecord) {
        const record = JSON.parse(userRecord);
        record.username = profile.username || record.username;
        record.isAnonymous = profile.isAnonymous;
        localStorage.setItem(`user_${user.email}`, JSON.stringify(record));
      }
    }
  }, [profile, user?.email]);

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  // Resolved display name used in Community posts
  const displayName = profile.isAnonymous
    ? 'Anonymous'
    : profile.username || user?.name || 'User';

  return (
    <ProfileContext.Provider value={{ profile, updateProfile, displayName }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfileContext = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfileContext must be used within a ProfileProvider');
  }
  return context;
};
