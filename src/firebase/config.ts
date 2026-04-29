/**
 * firebase/config.ts
 *
 * Single Firebase initialisation point.
 * Import `auth` and `db` from here — never call initializeApp elsewhere.
 */

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDowva-yjTvQMJD01iPAqRUZy_4D4tYftQ',
  authDomain: 'clearmind-e3fb7.firebaseapp.com',
  projectId: 'clearmind-e3fb7',
  storageBucket: 'clearmind-e3fb7.firebasestorage.app',
  messagingSenderId: '339226279554',
  appId: '1:339226279554:web:816892e50038274c9abe9b',
  measurementId: 'G-T96PLXMLC6',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db   = getFirestore(app);
