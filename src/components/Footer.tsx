'use client';

import { useContent } from './ContentProvider';

export function Footer() {
  const { content } = useContent();
  const year = new Date().getFullYear();
  return (
    <footer className="relative z-10 mt-32 border-t border-paper-3/10">
      <div className="container-x py-12 grid gap-10 md:grid-cols-3">
        <div>
          <p className="font-display text-2xl font-semibold tracking-tight text-paper-0">
            {content.about.name}
          </p>
          <p className="mt-2 text-paper-3 text-sm max-w-sm">{content.site.tagline}</p>
        </div>
        <div>
          <p className="field-label">Elsewhere</p>
          <ul className="space-y-1.5">
            {content.about.socials.map((s) => (
              <li key={s.url}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-sm text-paper-1 hover:text-accent link-underline"
                >
                  → {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="field-label">Contact</p>
          {content.about.email && (
            <a
              href={`mailto:${content.about.email}`}
              className="font-mono text-sm text-paper-1 hover:text-accent link-underline"
            >
              {content.about.email}
            </a>
          )}
          <p className="mt-6 text-xs font-mono text-paper-3">
            © {year} — built without compromise.
          </p>
        </div>
      </div>
    </footer>
  );
}
