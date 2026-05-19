'use client';

import Link from 'next/link';
import { useContent } from './ContentProvider';

export function Hero() {
  const { content } = useContent();
  const { about, site } = content;

  return (
    <section className="relative">
      <div className="grid-bg absolute inset-0 opacity-50 pointer-events-none" />
      <div className="container-x relative pt-12 pb-24 md:pt-20 md:pb-32">
        <div className="flex items-center gap-3 mb-8 animate-fade-up">
          <span className="h-px w-10 bg-paper-3/40" />
          <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-paper-3">
            {about.role}
            {about.location ? ` · ${about.location}` : ''}
          </span>
        </div>

        <h1 className="font-display font-bold text-mega text-balance">
          <span className="block text-paper-0">{firstName(about.name)}</span>
          <span className="block text-paper-0">
            {lastName(about.name)}
            <span className="text-accent">.</span>
          </span>
        </h1>

        <p className="mt-10 max-w-2xl text-xl md:text-2xl text-paper-1 text-pretty leading-snug">
          {site.tagline}
        </p>

        <div className="mt-12 flex flex-wrap items-center gap-3">
          <Link href="/projects/" className="btn-primary">
            See the work →
          </Link>
          <Link href="/papers/" className="btn-ghost">
            Read the papers
          </Link>
          {about.email && (
            <a href={`mailto:${about.email}`} className="btn-ghost">
              Say hello
            </a>
          )}
        </div>

        <div className="mt-20 flex items-end justify-between gap-8 font-mono text-xs uppercase tracking-[0.2em] text-paper-3">
          <div>
            <span className="block text-paper-2 text-2xl font-display font-medium normal-case tracking-tight">
              {content.projects.length}
            </span>
            projects
          </div>
          <div>
            <span className="block text-paper-2 text-2xl font-display font-medium normal-case tracking-tight">
              {content.papers.length}
            </span>
            papers
          </div>
          <div>
            <span className="block text-paper-2 text-2xl font-display font-medium normal-case tracking-tight">
              {content.projects.filter((p) => p.kind === 'hardware').length}/
              {content.projects.filter((p) => p.kind === 'software').length}
            </span>
            hw / sw
          </div>
          <div className="hidden sm:block text-right">
            <span className="block text-paper-2 text-2xl font-display font-medium normal-case tracking-tight">
              ↓
            </span>
            scroll
          </div>
        </div>
      </div>
    </section>
  );
}

function firstName(full: string) {
  return full.split(' ')[0];
}
function lastName(full: string) {
  const parts = full.split(' ');
  return parts.length > 1 ? parts.slice(1).join(' ') : '';
}
