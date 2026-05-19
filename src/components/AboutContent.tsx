'use client';

import { useContent } from './ContentProvider';
import { Prose } from './Prose';

export function AboutContent() {
  const { content } = useContent();
  const { about } = content;

  return (
    <section className="container-x py-10 max-w-4xl">
      <p className="field-label">§ About</p>
      <h1 className="font-display font-bold text-mega text-paper-0 text-balance">
        {about.name}<span className="text-accent">.</span>
      </h1>
      <p className="mt-4 font-mono text-paper-3">
        {about.role}
        {about.pronouns ? ` · ${about.pronouns}` : ''}
        {about.location ? ` · ${about.location}` : ''}
      </p>

      <div className="mt-12 text-xl">
        <Prose text={about.bio} />
      </div>

      <div className="mt-16 grid sm:grid-cols-2 gap-10">
        <div>
          <p className="field-label">Contact</p>
          {about.email && (
            <a
              href={`mailto:${about.email}`}
              className="font-mono text-paper-1 hover:text-accent link-underline"
            >
              {about.email}
            </a>
          )}
        </div>
        <div>
          <p className="field-label">Elsewhere</p>
          <ul className="space-y-1.5">
            {about.socials.map((s) => (
              <li key={s.url}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-paper-1 hover:text-accent link-underline"
                >
                  → {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {about.resume && (
        <div className="mt-16">
          <a href={about.resume} target="_blank" rel="noreferrer" className="btn-primary">
            Download résumé ↓
          </a>
        </div>
      )}
    </section>
  );
}
