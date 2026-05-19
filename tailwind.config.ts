import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          0: '#0a0a0a',
          1: '#111111',
          2: '#1a1a1a',
          3: '#262626',
        },
        paper: {
          0: '#f5f3ef',
          1: '#e8e4dc',
          2: '#bfbab0',
          3: '#8b8680',
        },
        accent: {
          DEFAULT: '#d4ff3a',
          warm: '#ff6b4a',
          cool: '#7df9ff',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'ui-sans-serif', 'system-ui'],
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui'],
        mono: ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular'],
      },
      fontSize: {
        'mega': ['clamp(3rem, 12vw, 11rem)', { lineHeight: '0.9', letterSpacing: '-0.04em' }],
        'giant': ['clamp(2rem, 7vw, 5.5rem)', { lineHeight: '0.95', letterSpacing: '-0.03em' }],
      },
      animation: {
        'marquee': 'marquee 40s linear infinite',
        'marquee-slow': 'marquee 80s linear infinite',
        'fade-up': 'fade-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'blink': 'blink 1s steps(2) infinite',
        'spin-slow': 'spin 18s linear infinite',
      },
      keyframes: {
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
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
