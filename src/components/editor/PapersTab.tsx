'use client';

import { useState } from 'react';
import { useContent } from '../ContentProvider';
import type { Paper } from '@/lib/types';
import { ensureUniqueSlug, slugify } from '@/lib/slug';
import { PaperForm } from './PaperForm';

export function PapersTab() {
  const { content, updatePapers } = useContent();
  const [editingSlug, setEditingSlug] = useState<string | null>(null);

  const editing = editingSlug
    ? content.papers.find((p) => p.slug === editingSlug) ?? null
    : null;

  if (editing) {
    return (
      <PaperForm
        paper={editing}
        onSave={(next) => {
          const others = content.papers.filter((p) => p.slug !== editing.slug);
          updatePapers([...others, next]);
          setEditingSlug(next.slug);
        }}
        onDone={() => setEditingSlug(null)}
        onDelete={() => {
          if (window.confirm(`Delete paper "${editing.title}"?`)) {
            updatePapers(content.papers.filter((p) => p.slug !== editing.slug));
            setEditingSlug(null);
          }
        }}
      />
    );
  }

  const addNew = () => {
    const slug = ensureUniqueSlug(
      slugify('untitled-paper'),
      content.papers.map((p) => p.slug),
    );
    const next: Paper = {
      slug,
      title: 'Untitled paper',
      year: String(new Date().getFullYear()),
      authors: [],
      abstract: '',
      tags: [],
    };
    updatePapers([...content.papers, next]);
    setEditingSlug(slug);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-paper-3 text-sm font-mono">
          {content.papers.length} paper{content.papers.length === 1 ? '' : 's'}
        </p>
        <button onClick={addNew} className="btn-primary !py-2 !px-4 !text-[10px]">
          + New paper
        </button>
      </div>

      <ul className="divide-y divide-paper-3/15 border-y border-paper-3/15">
        {content.papers.map((p) => (
          <li key={p.slug} className="py-3 flex items-center gap-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-paper-3 w-16 shrink-0">
              {p.year}
            </span>
            <div className="flex-1 min-w-0">
              <p className="font-display font-medium text-paper-0 truncate">{p.title}</p>
              <p className="text-xs font-mono text-paper-3 truncate">
                {p.venue || p.slug}
              </p>
            </div>
            <button
              onClick={() => setEditingSlug(p.slug)}
              className="btn-ghost !py-1.5 !px-3 !text-[10px]"
            >
              Edit
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
