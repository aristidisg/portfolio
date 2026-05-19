'use client';

import { useState } from 'react';
import { useContent } from '../ContentProvider';
import type { Project } from '@/lib/types';
import { ensureUniqueSlug, slugify } from '@/lib/slug';
import { ProjectForm } from './ProjectForm';
import { useSync } from './SyncProvider';
import { useReorder } from './useReorder';

export function ProjectsTab() {
  const { content } = useContent();
  const { publishProjects: updateProjects } = useSync();
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const { getItemProps, isDragging } = useReorder(content.projects, updateProjects);

  const editing = editingSlug
    ? content.projects.find((p) => p.slug === editingSlug) ?? null
    : null;

  if (editing) {
    return (
      <ProjectForm
        project={editing}
        onSave={(next) => {
          const others = content.projects.filter((p) => p.slug !== editing.slug);
          updateProjects([...others, next]);
          setEditingSlug(next.slug);
        }}
        onDone={() => setEditingSlug(null)}
        onDelete={() => {
          if (window.confirm(`Delete project "${editing.title}"?`)) {
            updateProjects(content.projects.filter((p) => p.slug !== editing.slug));
            setEditingSlug(null);
          }
        }}
      />
    );
  }

  const addNew = () => {
    const slug = ensureUniqueSlug(
      slugify('untitled-project'),
      content.projects.map((p) => p.slug),
    );
    const next: Project = {
      slug,
      title: 'Untitled project',
      kind: 'software',
      year: String(new Date().getFullYear()),
      tagline: '',
      summary: '',
      tags: [],
      status: 'wip',
    };
    updateProjects([...content.projects, next]);
    setEditingSlug(slug);
  };

  const duplicate = (p: Project) => {
    const baseSlug = slugify(`${p.title}-copy`);
    const slug = ensureUniqueSlug(baseSlug, content.projects.map((x) => x.slug));
    updateProjects([...content.projects, { ...p, slug, title: `${p.title} (copy)`, featured: false }]);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-paper-3 text-sm font-mono">
          {content.projects.length} project{content.projects.length === 1 ? '' : 's'} · drag to reorder
        </p>
        <button onClick={addNew} className="btn-primary !py-2 !px-4 !text-[10px]">
          + New project
        </button>
      </div>

      <ul className={`divide-y divide-paper-3/15 border-y border-paper-3/15 ${isDragging ? 'select-none' : ''}`}>
        {content.projects.map((p, i) => (
          <li
            key={p.slug}
            {...getItemProps(i)}
            className="py-3 flex items-center gap-3 cursor-grab active:cursor-grabbing data-[dragging=true]:opacity-30 data-[drop-target=true]:bg-accent/10 transition"
          >
            <span className="text-paper-3 select-none" aria-hidden>⋮⋮</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-paper-3 w-16 shrink-0">
              {p.kind}
            </span>
            <div className="flex-1 min-w-0">
              <p className="font-display font-medium text-paper-0 truncate">{p.title}</p>
              <p className="text-xs font-mono text-paper-3 truncate">{p.slug} · {p.year}</p>
            </div>
            <button
              onClick={() => setEditingSlug(p.slug)}
              className="btn-ghost !py-1.5 !px-3 !text-[10px]"
            >
              Edit
            </button>
            <button
              onClick={() => duplicate(p)}
              className="btn-ghost !py-1.5 !px-3 !text-[10px]"
              title="Duplicate"
            >
              Dup
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
