'use client';

import { useEffect, useState } from 'react';
import { EDITOR_SECRET, UNLOCK_FLAG_KEY } from '@/lib/editor-config';
import { EditorBar } from './EditorBar';
import { EditorDrawer } from './EditorDrawer';

export function EditorRoot() {
  const [unlocked, setUnlocked] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);

    // Check existing unlock flag
    const flag = window.localStorage.getItem(UNLOCK_FLAG_KEY);
    if (flag === '1') setUnlocked(true);

    // Check URL hash for secret
    const hash = window.location.hash.replace(/^#/, '');
    if (hash === `unlock-${EDITOR_SECRET}`) {
      window.localStorage.setItem(UNLOCK_FLAG_KEY, '1');
      setUnlocked(true);
      // clean the hash from the URL without reload
      const url = window.location.pathname + window.location.search;
      window.history.replaceState(null, '', url);
    }

    // Keyboard shortcut: Ctrl/Cmd + Shift + E → prompt for secret
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

  const lock = () => {
    window.localStorage.removeItem(UNLOCK_FLAG_KEY);
    setUnlocked(false);
    setDrawerOpen(false);
  };

  if (!hydrated || !unlocked) return null;

  return (
    <>
      <EditorBar
        onOpen={() => setDrawerOpen(true)}
        onLock={lock}
      />
      {drawerOpen && <EditorDrawer onClose={() => setDrawerOpen(false)} />}
    </>
  );
}
