/**
 * assessmentService.ts
 *
 * Abstracts quiz / assessment localStorage access.
 * Async-ready for Firebase migration.
 *
 * Keys:
 *   onboarding_${userId}  – completion flag (delegated to userService)
 *   mode_${userId}        – primary mode    (delegated to userService)
 *   secondary_${userId}   – secondary mode from quiz result
 *   profile_${userId}     – extended user profile (study prefs, anonymity)
 */

export interface AssessmentResult {
  mode: string;
  secondaryMode: string | null;
}

export interface UserProfile {
  username: string;
  studyTime: 'morning' | 'afternoon' | 'evening' | '';
  focusDuration: '15' | '25' | '45' | '60' | '';
  studyGoal: string;
  isAnonymous: boolean;
}

// ── Secondary mode ─────────────────────────────

export async function getSecondaryMode(userId: string): Promise<string | null> {
  return localStorage.getItem(`secondary_${userId}`);
}

export async function saveSecondaryMode(userId: string, mode: string): Promise<void> {
  localStorage.setItem(`secondary_${userId}`, mode);
}

export async function removeSecondaryMode(userId: string): Promise<void> {
  localStorage.removeItem(`secondary_${userId}`);
}

// ── Full assessment result ──────────────────────

export async function saveAssessment(
  userId: string,
  result: AssessmentResult
): Promise<void> {
  localStorage.setItem(`mode_${userId}`, result.mode);
  if (result.secondaryMode) {
    localStorage.setItem(`secondary_${userId}`, result.secondaryMode);
  } else {
    localStorage.removeItem(`secondary_${userId}`);
  }
  localStorage.setItem(`onboarding_${userId}`, 'true');
}

export async function getAssessment(userId: string): Promise<AssessmentResult | null> {
  const mode = localStorage.getItem(`mode_${userId}`);
  if (!mode) return null;
  return {
    mode,
    secondaryMode: localStorage.getItem(`secondary_${userId}`),
  };
}

// ── Profile (study prefs + anonymity) ──────────

export async function getProfile(userId: string): Promise<UserProfile | null> {
  const raw = localStorage.getItem(`profile_${userId}`);
  return raw ? JSON.parse(raw) : null;
}

export async function saveProfile(userId: string, profile: UserProfile): Promise<void> {
  localStorage.setItem(`profile_${userId}`, JSON.stringify(profile));
}

// ── Timer preferences (owned by TimerProvider) ─

export async function getTimerState(userId: string): Promise<{ duration: number; timeLeft: number } | null> {
  const raw = localStorage.getItem(`timer_${userId}`);
  return raw ? JSON.parse(raw) : null;
}

export async function saveTimerState(
  userId: string,
  state: { duration: number; timeLeft: number }
): Promise<void> {
  localStorage.setItem(`timer_${userId}`, JSON.stringify(state));
}
