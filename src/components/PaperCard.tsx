import Link from 'next/link';
import type { Paper } from '@/lib/types';

export function PaperCard({
  paper,
  index = 0,
  isDraft = false,
}: {
  paper: Paper;
  index?: number;
  isDraft?: boolean;
}) {
  return (
    <Link
      href={`/papers/${paper.slug}/`}
      className="group block border-t border-paper-3/15 py-6 transition-colors hover:border-paper-0"
    >
      <div className="grid grid-cols-12 gap-6 items-start">
        <div className="col-span-12 md:col-span-1">
          <span className="font-mono text-xs text-paper-3">
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>
        <div className="col-span-12 md:col-span-8">
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <span className="badge-kind text-paper-3">
              <span className="text-accent-cool text-base leading-none">¶</span>
              paper
            </span>
            {paper.venue && (
              <span className="badge-kind text-paper-3 normal-case tracking-wider">
                {paper.venue}
              </span>
            )}
            {isDraft && (
              <span className="badge-kind text-accent-warm">◌ draft (local)</span>
            )}
          </div>
          <h3 className="font-display font-semibold text-2xl md:text-3xl tracking-tight text-paper-0 leading-tight group-hover:text-accent transition-colors text-balance">
            {paper.title}
          </h3>
          <p className="mt-2 text-sm text-paper-3 font-mono">
            {paper.authors.join(' · ')}
          </p>
          <p className="mt-3 text-paper-2 text-pretty line-clamp-3">{paper.abstract}</p>
        </div>
        <div className="col-span-12 md:col-span-2 md:text-right">
          <span className="font-mono text-xs text-paper-3 uppercase tracking-[0.2em]">
            {paper.year}
          </span>
        </div>
        <div className="col-span-12 md:col-span-1 md:text-right">
          <span className="inline-block font-mono text-paper-3 group-hover:text-accent group-hover:translate-x-1 transition-all">
            →
          </span>
        </div>
      </div>
    </Link>
  );
}
