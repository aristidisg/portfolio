'use client';

import { useEffect, useState } from 'react';
import { EDITOR_SECRET, UNLOCK_FLAG_KEY } from '@/lib/editor-config';
import { EditorBar } from './EditorBar';
import { EditorDrawer } from './EditorDrawer';
import { AuthProvider, useAuth } from './AuthProvider';
import { SyncProvider } from './SyncProvider';
import { AuthGate } from './AuthGate';

export function EditorRoot() {
  const [unlocked, setUnlocked] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);

    const flag = window.localStorage.getItem(UNLOCK_FLAG_KEY);
    if (flag === '1') setUnlocked(true);

    const hash = window.location.hash.replace(/^#/, '');
    if (hash === `unlock-${EDITOR_SECRET}`) {
      window.localStorage.setItem(UNLOCK_FLAG_KEY, '1');
      setUnlocked(true);
      const url = window.location.pathname + window.location.search;
      window.history.replaceState(null, '', url);
    }

    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'E' || e.key === 'e')) {
        e.preventDefault();
        const input = window.prompt('Enter editor secret');
        if (input === EDITOR_SECRET) {
          window.localStorage.setItem(UNLOCK_FLAG_KEY, '1');
          setUnlocked(true);
        } else if (input) {
          window.alert('Wrong secret.');
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const lockEditor = () => {
    window.localStorage.removeItem(UNLOCK_FLAG_KEY);
    setUnlocked(false);
  };

  if (!hydrated || !unlocked) return null;

  return (
    <AuthProvider>
      <SyncProvider>
        <EditorUnlocked onLockEditor={lockEditor} />
      </SyncProvider>
    </AuthProvider>
  );
}

function EditorUnlocked({ onLockEditor }: { onLockEditor: () => void }) {
  const { status, setMode, mode } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [skippedAuth, setSkippedAuth] = useState(false);

  // If user hasn't set up or unlocked yet, show the auth gate (unless they skip)
  const showAuthGate = !skippedAuth && status !== 'unlocked' && status !== 'checking';

  // When auth status flips to unlocked, force-default mode to live (the whole point
  // of authenticating). User can flip back to draft in the EditorBar.
  useEffect(() => {
    if (status === 'unlocked' && mode === 'draft' && !skippedAuth) {
      setMode('live');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return (
    <>
      {showAuthGate && <AuthGate onSkip={() => { setSkippedAuth(true); setMode('draft'); }} />}
      <EditorBar
        onOpen={() => setDrawerOpen(true)}
        onLockEditor={onLockEditor}
      />
      {drawerOpen && <EditorDrawer onClose={() => setDrawerOpen(false)} />}
    </>
  );
}
