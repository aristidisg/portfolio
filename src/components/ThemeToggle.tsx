'use client';

import { useTheme } from './ThemeProvider';

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { theme, toggle } = useTheme();
  const next = theme === 'dark' ? 'light' : 'dark';
  return (
    <button
      onClick={toggle}
      title={`Switch to ${next} mode`}
      aria-label={`Switch to ${next} mode`}
      className={`group inline-flex items-center gap-1.5 rounded-full border border-paper-3/20 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-paper-2 transition hover:border-accent hover:text-accent ${compact ? '' : ''}`}
    >
      <span aria-hidden className="text-sm leading-none">{theme === 'dark' ? '◑' : '◐'}</span>
      <span className="hidden sm:inline">{theme}</span>
    </button>
  );
}
