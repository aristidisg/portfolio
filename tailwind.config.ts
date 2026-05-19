import type { Config } from 'tailwindcss';

const withAlpha = (variable: string) => `rgb(var(${variable}) / <alpha-value>)`;

const config: Config = {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        ink: {
          0: withAlpha('--ink-0'),
          1: withAlpha('--ink-1'),
          2: withAlpha('--ink-2'),
          3: withAlpha('--ink-3'),
        },
        paper: {
          0: withAlpha('--paper-0'),
          1: withAlpha('--paper-1'),
          2: withAlpha('--paper-2'),
          3: withAlpha('--paper-3'),
        },
        accent: {
          DEFAULT: withAlpha('--accent'),
          warm: withAlpha('--accent-warm'),
          cool: withAlpha('--accent-cool'),
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'ui-sans-serif', 'system-ui'],
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui'],
        mono: ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular'],
      },
      fontSize: {
        mega: ['clamp(3rem, 12vw, 11rem)', { lineHeight: '0.9', letterSpacing: '-0.04em' }],
        giant: ['clamp(2rem, 7vw, 5.5rem)', { lineHeight: '0.95', letterSpacing: '-0.03em' }],
      },
      animation: {
        'fade-up': 'fade-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        blink: 'blink 1s steps(2) infinite',
        'spin-slow': 'spin 18s linear infinite',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
