'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { decryptSecret, encryptSecret, type EncryptedBlob } from '@/lib/crypto';
import { whoAmI } from '@/lib/github-api';

const ENC_KEY = 'portfolio.editor.token.enc.v1';
const MODE_KEY = 'portfolio.editor.mode.v1';
const USER_KEY = 'portfolio.editor.user.v1';

export type EditorMode = 'draft' | 'live';

export type AuthStatus =
  | 'needs-setup'   // no encrypted token in storage
  | 'locked'        // encrypted token exists, awaiting passphrase
  | 'unlocked'      // PAT decrypted, available in memory
  | 'checking';     // briefly: reading storage on mount

interface AuthContextValue {
  status: AuthStatus;
  user: string | null;          // GitHub login if known
  token: string | null;         // decrypted PAT, present iff unlocked
  mode: EditorMode;
  error: string | null;
  setup: (token: string, passphrase: string) => Promise<void>;
  unlock: (passphrase: string) => Promise<void>;
  lock: () => void;
  setMode: (m: EditorMode) => void;
  forgetCredentials: () => void; // remove encrypted token entirely
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('checking');
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<string | null>(null);
  const [mode, setModeState] = useState<EditorMode>('draft');
  const [error, setError] = useState<string | null>(null);

  // Hydrate on mount
  useEffect(() => {
    try {
      const enc = window.localStorage.getItem(ENC_KEY);
      const m = window.localStorage.getItem(MODE_KEY);
      const u = window.localStorage.getItem(USER_KEY);
      if (m === 'live' || m === 'draft') setModeState(m);
      if (u) setUser(u);
      setStatus(enc ? 'locked' : 'needs-setup');
    } catch {
      setStatus('needs-setup');
    }
  }, []);

  const setMode = useCallback((m: EditorMode) => {
    setModeState(m);
    try {
      window.localStorage.setItem(MODE_KEY, m);
    } catch {}
  }, []);

  const setup = useCallback(async (rawToken: string, passphrase: string) => {
    setError(null);
    if (!rawToken.trim()) throw new Error('Token is required.');
    if (passphrase.length < 6) throw new Error('Passphrase must be at least 6 characters.');
    try {
      const login = await whoAmI(rawToken.trim());
      const blob = await encryptSecret(rawToken.trim(), passphrase);
      window.localStorage.setItem(ENC_KEY, JSON.stringify(blob));
      window.localStorage.setItem(USER_KEY, login);
      setToken(rawToken.trim());
      setUser(login);
      setStatus('unlocked');
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg);
      throw e;
    }
  }, []);

  const unlock = useCallback(async (passphrase: string) => {
    setError(null);
    const raw = window.localStorage.getItem(ENC_KEY);
    if (!raw) {
      setStatus('needs-setup');
      throw new Error('No stored credentials.');
    }
    try {
      const blob = JSON.parse(raw) as EncryptedBlob;
      const decrypted = await decryptSecret(blob, passphrase);
      // verify token still works
      const login = await whoAmI(decrypted);
      window.localStorage.setItem(USER_KEY, login);
      setToken(decrypted);
      setUser(login);
      setStatus('unlocked');
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg);
      throw e;
    }
  }, []);

  const lock = useCallback(() => {
    setToken(null);
    setStatus('locked');
  }, []);

  const forgetCredentials = useCallback(() => {
    window.localStorage.removeItem(ENC_KEY);
    window.localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
    setStatus('needs-setup');
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ status, user, token, mode, error, setup, unlock, lock, setMode, forgetCredentials }),
    [status, user, token, mode, error, setup, unlock, lock, setMode, forgetCredentials],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
