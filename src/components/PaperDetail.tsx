'use client';

import Link from 'next/link';
import { useContent } from './ContentProvider';
import { Prose } from './Prose';
import { PdfViewer } from './PdfViewer';

export function PaperDetail({ slug }: { slug: string }) {
  const { content } = useContent();
  const paper = content.papers.find((p) => p.slug === slug);

  if (!paper) {
    return (
      <section className="container-x py-32 text-center">
        <p className="field-label">No such paper</p>
        <h1 className="font-display font-bold text-giant text-paper-0">Not found.</h1>
        <p className="mt-4 text-paper-2">
          The paper <code className="font-mono">{slug}</code> doesn't exist — it may be a
          local draft that hasn't been exported yet.
        </p>
        <Link href="/papers/" className="btn-primary mt-8">← All papers</Link>
      </section>
    );
  }

  return (
    <article className="container-x py-10 max-w-4xl">
      <Link href="/papers/" className="font-mono text-xs uppercase tracking-[0.2em] text-paper-3 hover:text-accent">
        ← Back to papers
      </Link>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <span className="badge-kind text-paper-3">
          <span className="text-accent-cool text-base leading-none">¶</span> paper
        </span>
        <span className="badge-kind text-paper-3">{paper.year}</span>
        {paper.venue && (
          <span className="badge-kind text-paper-3 normal-case">{paper.venue}</span>
        )}
      </div>

      <h1 className="mt-4 font-display font-bold text-giant text-paper-0 text-balance">
        {paper.title}
      </h1>
      <p className="mt-6 font-mono text-paper-3">{paper.authors.join(' · ')}</p>

      {paper.tags.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {paper.tags.map((t) => (
            <span key={t} className="tag">{t}</span>
          ))}
        </div>
      )}

      <hr className="my-12" />

      <div className="border-l-2 border-accent pl-6">
        <p className="field-label">Abstract</p>
        <p className="text-lg text-paper-1 text-pretty leading-relaxed">{paper.abstract}</p>
      </div>

      {paper.body && (
        <div className="mt-10">
          <Prose text={paper.body} />
        </div>
      )}

      {paper.pdf && (
        <div className="mt-12">
          <p className="field-label">Full paper</p>
          <PdfViewer src={paper.pdf} title={paper.title} />
        </div>
      )}

      {paper.links && paper.links.length > 0 && (
        <div className="mt-10 border-t border-paper-3/15 pt-8 flex flex-wrap gap-3">
          {paper.links.map((l) => (
            <a key={l.url} href={l.url} target="_blank" rel="noreferrer" className="btn-ghost">
              {l.label} ↗
            </a>
          ))}
        </div>
      )}
    </article>
  );
}
