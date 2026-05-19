'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light';
const STORAGE_KEY = 'portfolio.theme.v1';

interface ThemeContextValue {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function applyTheme(t: Theme) {
  const root = document.documentElement;
  root.setAttribute('data-theme', t);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Default to light for SSR; the inline script in layout already set the real value
  const [theme, setThemeState] = useState<Theme>('light');

  // Sync state from DOM after mount (script already wrote the right attr)
  useEffect(() => {
    const current = (document.documentElement.getAttribute('data-theme') as Theme | null) || 'light';
    setThemeState(current);
  }, []);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    applyTheme(t);
    try {
      window.localStorage.setItem(STORAGE_KEY, t);
    } catch {}
  }, []);

  const toggle = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme, setTheme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be inside ThemeProvider');
  return ctx;
}

/**
 * Inline script that sets data-theme on <html> before React hydrates.
 * Avoids flash of wrong theme on first paint.
 */
export const THEME_INIT_SCRIPT = `
(function() {
  try {
    var stored = localStorage.getItem('${STORAGE_KEY}');
    // Light is the default; we only respect an explicitly stored preference.
    var t = stored === 'dark' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', t);
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'light');
  }
})();
`;
