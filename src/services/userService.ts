/**
 * userService.ts
 *
 * Abstracts all user-record localStorage access.
 * Every function is async so Firebase can be swapped in
 * without changing callers.
 *
 * Keys owned by this service:
 *   user_${userId}      – full auth record  { email, password, username, isAnonymous }
 *   dummy_users         – legacy list kept for backward compat
 *   user                – currently logged-in user session object
 *   isAuthenticated     – auth flag
 *   theme               – global theme key
 *   theme_${userId}     – per-user theme
 *   mode_${userId}      – accessibility mode
 *   onboarding_${userId}– onboarding completion flag
 *   secondary_${userId} – secondary mode from quiz
 */

export interface UserRecord {
  email: string;
  password: string;
  username: string;
  isAnonymous: boolean;
}

export interface SessionUser {
  name: string;
  email: string;
}

// ── Auth records ──────────────────────────────

export async function getUserRecord(userId: string): Promise<UserRecord | null> {
  const raw = localStorage.getItem(`user_${userId}`);
  return raw ? JSON.parse(raw) : null;
}

export async function saveUserRecord(userId: string, data: UserRecord): Promise<void> {
  localStorage.setItem(`user_${userId}`, JSON.stringify(data));
}

/** Legacy list — kept in sync for backward compat */
export async function getLegacyUsers(): Promise<any[]> {
  const raw = localStorage.getItem('dummy_users') || '[]';
  return JSON.parse(raw);
}

export async function saveLegacyUsers(users: any[]): Promise<void> {
  localStorage.setItem('dummy_users', JSON.stringify(users));
}

// ── Session ────────────────────────────────────

export async function getSessionUser(): Promise<SessionUser | null> {
  const raw = localStorage.getItem('user');
  return raw ? JSON.parse(raw) : null;
}

export async function saveSessionUser(user: SessionUser): Promise<void> {
  localStorage.setItem('user', JSON.stringify(user));
}

export async function clearSessionUser(): Promise<void> {
  localStorage.removeItem('user');
}

export async function getIsAuthenticated(): Promise<boolean> {
  return localStorage.getItem('isAuthenticated') === 'true';
}

export async function saveIsAuthenticated(value: boolean): Promise<void> {
  localStorage.setItem('isAuthenticated', String(value));
}

// ── Theme ──────────────────────────────────────

export async function getGlobalTheme(): Promise<string | null> {
  return localStorage.getItem('theme');
}

export async function saveGlobalTheme(theme: string): Promise<void> {
  localStorage.setItem('theme', theme);
}

export async function getUserTheme(userId: string): Promise<string | null> {
  return localStorage.getItem(`theme_${userId}`);
}

export async function saveUserTheme(userId: string, theme: string): Promise<void> {
  localStorage.setItem(`theme_${userId}`, theme);
}

// ── Accessibility mode ─────────────────────────

export async function getUserMode(userId: string): Promise<string | null> {
  return localStorage.getItem(`mode_${userId}`);
}

export async function saveUserMode(userId: string, mode: string): Promise<void> {
  localStorage.setItem(`mode_${userId}`, mode);
}

export async function removeUserMode(userId: string): Promise<void> {
  localStorage.removeItem(`mode_${userId}`);
}

// ── Onboarding ─────────────────────────────────

export async function getOnboardingComplete(userId: string): Promise<boolean> {
  return localStorage.getItem(`onboarding_${userId}`) === 'true';
}

export async function saveOnboardingComplete(userId: string): Promise<void> {
  localStorage.setItem(`onboarding_${userId}`, 'true');
}

export async function removeOnboardingComplete(userId: string): Promise<void> {
  localStorage.removeItem(`onboarding_${userId}`);
}

// ── Misc / danger ──────────────────────────────

export async function clearAllData(): Promise<void> {
  localStorage.clear();
}
