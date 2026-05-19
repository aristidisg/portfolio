'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useContent } from './ContentProvider';

const links = [
  { href: '/', label: 'Index' },
  { href: '/projects/', label: 'Projects' },
  { href: '/papers/', label: 'Papers' },
  { href: '/about/', label: 'About' },
];

export function Nav() {
  const { content } = useContent();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? 'backdrop-blur-md bg-ink-0/70 border-b border-paper-3/10' : 'bg-transparent'
      }`}
    >
      <nav className="container-x flex items-center justify-between h-16">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="relative inline-flex h-2.5 w-2.5">
            <span className="absolute inset-0 rounded-full bg-accent animate-blink" />
            <span className="absolute inset-0 rounded-full bg-accent/30 blur-md" />
          </span>
          <span className="font-display font-bold tracking-tight text-paper-0">
            {initials(content.about.name)}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-paper-3 hidden sm:inline">
            /portfolio
          </span>
        </Link>

        <button
          className="md:hidden btn-ghost"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Toggle menu"
        >
          {open ? 'Close' : 'Menu'}
        </button>

        <ul className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={`px-3 py-2 font-mono text-xs uppercase tracking-[0.2em] transition-colors ${
                  isActive(l.href) ? 'text-accent' : 'text-paper-2 hover:text-paper-0'
                }`}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {open && (
        <div className="md:hidden border-t border-paper-3/10 bg-ink-0/95 backdrop-blur-md">
          <ul className="container-x py-4 flex flex-col gap-1">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={`block py-3 font-mono text-sm uppercase tracking-[0.2em] ${
                    isActive(l.href) ? 'text-accent' : 'text-paper-1'
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}

function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .map((s) => s[0]?.toUpperCase() ?? '')
    .slice(0, 3)
    .join('');
}
