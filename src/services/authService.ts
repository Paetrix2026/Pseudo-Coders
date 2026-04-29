/**
 * authService.ts
 *
 * Firebase Authentication + Firestore user-record operations.
 * This is the ONLY file that imports from firebase/auth or firebase/firestore
 * for authentication purposes. All other services remain localStorage-based
 * until a full Firestore migration is done.
 *
 * Firestore structure:
 *   users/{uid}  →  { uid, email, username, mode, isAnonymous, createdAt }
 */

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  type User as FirebaseUser,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db } from '../firebase/config';

// ── Types ─────────────────────────────────────

export interface FirebaseSignupResult {
  ok: boolean;
  uid?: string;
  username?: string;
  error?: string;
}

export interface FirebaseLoginResult {
  ok: boolean;
  uid?: string;
  email?: string;
  username?: string;
  error?: string;
}

// ── Signup ────────────────────────────────────

export async function firebaseSignup(
  email: string,
  password: string,
  username: string
): Promise<FirebaseSignupResult> {
  try {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    const { uid } = credential.user;

    // Write user profile to Firestore: users/{uid}
    await setDoc(doc(db, 'users', uid), {
      uid,
      email,
      username: username || email.split('@')[0],
      mode: 'None',
      isAnonymous: false,
      createdAt: serverTimestamp(),
    });

    // Also write to localStorage for backward compat (theme, mode, onboarding keys)
    const record = { email, password, username: username || email.split('@')[0], isAnonymous: false };
    localStorage.setItem(`user_${email}`, JSON.stringify(record));

    return { ok: true, uid, username: record.username };
  } catch (err: any) {
    const error = mapFirebaseError(err.code);
    return { ok: false, error };
  }
}

// ── Login ─────────────────────────────────────

export async function firebaseLogin(
  email: string,
  password: string
): Promise<FirebaseLoginResult> {
  try {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    const { uid } = credential.user;

    // Fetch username from Firestore
    let username: string | undefined;
    try {
      const snap = await getDoc(doc(db, 'users', uid));
      if (snap.exists()) {
        username = snap.data().username;
      }
    } catch {
      // Firestore read failed — fall back to localStorage
      const stored = localStorage.getItem(`user_${email}`);
      if (stored) username = JSON.parse(stored).username;
    }

    // Fallback chain: Firestore → localStorage → email prefix
    username = username || email.split('@')[0];

    return { ok: true, uid, email, username };
  } catch (err: any) {
    const error = mapFirebaseError(err.code);
    return { ok: false, error };
  }
}

// ── Google Sign-In ────────────────────────────

export async function loginWithGoogle(): Promise<FirebaseLoginResult> {
  try {
    const provider = new GoogleAuthProvider();
    const credential = await signInWithPopup(auth, provider);
    const { uid, email, displayName } = credential.user;

    const userRef = doc(db, 'users', uid);
    const snap = await getDoc(userRef);
    let username = displayName || email?.split('@')[0] || 'User';

    if (!snap.exists()) {
      await setDoc(userRef, {
        uid,
        email: email || '',
        username,
        mode: 'None',
        isAnonymous: false,
        createdAt: serverTimestamp(),
      });

      if (email) {
        const record = { email, password: '', username, isAnonymous: false };
        localStorage.setItem(`user_${email}`, JSON.stringify(record));
      }
    } else {
      username = snap.data().username || username;
    }

    return { ok: true, uid, email: email || '', username };
  } catch (err: any) {
    const error = mapFirebaseError(err.code);
    return { ok: false, error };
  }
}

// ── Logout ────────────────────────────────────

export async function firebaseLogout(): Promise<void> {
  await signOut(auth);
}

// ── Auth state listener ───────────────────────

export function onAuthChange(
  callback: (user: FirebaseUser | null) => void
): () => void {
  return onAuthStateChanged(auth, callback);
}

// ── Error mapping ─────────────────────────────

function mapFirebaseError(code: string): string {
  switch (code) {
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/weak-password':
      return 'Password must be at least 6 characters.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Invalid email or password.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later.';
    case 'auth/network-request-failed':
      return 'Network error. Check your connection.';
    default:
      return 'Something went wrong. Please try again.';
  }
}
