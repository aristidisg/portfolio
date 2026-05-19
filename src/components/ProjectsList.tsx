'use client';

import { useMemo, useState } from 'react';
import { useContent } from './ContentProvider';
import { ProjectCard } from './ProjectCard';
import type { ProjectKind } from '@/lib/types';

type Filter = 'all' | ProjectKind;

const filters: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'hardware', label: 'Hardware' },
  { key: 'software', label: 'Software' },
];

export function ProjectsList() {
  const { content, baked } = useContent();
  const [filter, setFilter] = useState<Filter>('all');

  const bakedSlugs = useMemo(() => new Set(baked.projects.map((p) => p.slug)), [baked]);

  const filtered = useMemo(() => {
    if (filter === 'all') return content.projects;
    return content.projects.filter((p) => p.kind === filter);
  }, [content.projects, filter]);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 mb-8">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`btn ${
              filter === f.key
                ? 'border-accent bg-accent text-ink-0'
                : 'border-paper-3/30 text-paper-2 hover:border-paper-0 hover:text-paper-0'
            }`}
          >
            {f.label}
            <span className="font-mono text-[10px] opacity-60">
              {f.key === 'all'
                ? content.projects.length
                : content.projects.filter((p) => p.kind === f.key).length}
            </span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="font-mono text-paper-3 py-12">No projects in this filter yet.</p>
      ) : (
        <div className="border-b border-paper-3/15">
          {filtered.map((p, i) => (
            <ProjectCard
              key={p.slug}
              project={p}
              index={i}
              isDraft={!bakedSlugs.has(p.slug)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
