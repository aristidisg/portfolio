'use client';

import { useMemo } from 'react';
import { useContent } from './ContentProvider';
import { PaperCard } from './PaperCard';

export function PapersList() {
  const { content, baked } = useContent();
  const bakedSlugs = useMemo(() => new Set(baked.papers.map((p) => p.slug)), [baked]);

  if (content.papers.length === 0) {
    return <p className="font-mono text-paper-3 py-12">No papers yet.</p>;
  }

  return (
    <div className="border-b border-paper-3/15">
      {content.papers.map((p, i) => (
        <PaperCard
          key={p.slug}
          paper={p}
          index={i}
          isDraft={!bakedSlugs.has(p.slug)}
        />
      ))}
    </div>
  );
}
