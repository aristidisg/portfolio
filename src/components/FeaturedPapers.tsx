'use client';

import Link from 'next/link';
import { useContent } from './ContentProvider';
import { PaperCard } from './PaperCard';

export function FeaturedPapers() {
  const { content, baked } = useContent();
  const featured = content.papers.filter((p) => p.featured).slice(0, 3);
  const list = featured.length > 0 ? featured : content.papers.slice(0, 3);
  const bakedSlugs = new Set(baked.papers.map((p) => p.slug));

  if (list.length === 0) return null;

  return (
    <section className="container-x py-24">
      <header className="flex items-end justify-between mb-10">
        <div>
          <p className="field-label">§ 02</p>
          <h2 className="font-display font-bold text-giant text-paper-0 text-balance">
            Recent writing.
          </h2>
        </div>
        <Link href="/papers/" className="btn-ghost hidden sm:inline-flex">
          All papers →
        </Link>
      </header>

      <div className="border-b border-paper-3/15">
        {list.map((p, i) => (
          <PaperCard key={p.slug} paper={p} index={i} isDraft={!bakedSlugs.has(p.slug)} />
        ))}
      </div>

      <div className="sm:hidden mt-8">
        <Link href="/papers/" className="btn-ghost">
          All papers →
        </Link>
      </div>
    </section>
  );
}
