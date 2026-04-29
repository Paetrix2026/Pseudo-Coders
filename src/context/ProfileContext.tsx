import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAppContext } from './AppProvider';
import { getProfile, saveProfile } from '../services/assessmentService';
import { getUserRecord } from '../services/userService';

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

  const [profile, setProfile] = useState<UserProfile>({ ...DEFAULT_PROFILE });

  // Reload profile via service whenever the logged-in user changes
  useEffect(() => {
    if (!user?.email) return;

    getProfile(user.email).then(saved => {
      if (saved) {
        setProfile({ ...DEFAULT_PROFILE, ...saved });
      } else {
        // Seed username from auth record
        getUserRecord(user.email).then(record => {
          setProfile({
            ...DEFAULT_PROFILE,
            username: record?.username || user.email.split('@')[0],
          });
        });
      }
    });
  }, [user?.email]);

  // Persist profile via service on every change
  useEffect(() => {
    if (!user?.email) return;

    saveProfile(user.email, profile);

    // Also sync username + isAnonymous back into user_${email} auth record
    getUserRecord(user.email).then(record => {
      if (record) {
        const updated = {
          ...record,
          username: profile.username || record.username,
          isAnonymous: profile.isAnonymous,
        };
        // Re-use raw localStorage here only to avoid circular service deps;
        // this will be replaced cleanly when Firebase lands.
        localStorage.setItem(`user_${user.email}`, JSON.stringify(updated));
      }
    });
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
