'use client';

import { useState } from 'react';
import type { Project } from '@/lib/types';
import { Checkbox, CSVField, LinksField, Select, TextArea, TextField } from './fields';

export function ProjectForm({
  project,
  onSave,
  onDone,
  onDelete,
}: {
  project: Project;
  onSave: (next: Project) => void;
  onDone: () => void;
  onDelete: () => void;
}) {
  const [draft, setDraft] = useState<Project>(project);
  const update = <K extends keyof Project>(key: K, value: Project[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  const save = () => {
    onSave(draft);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <button onClick={onDone} className="btn-ghost !py-1.5 !px-3 !text-[10px]">
          ← All projects
        </button>
        <span className="font-mono text-[10px] text-paper-3">{draft.slug}</span>
      </div>

      <TextField label="Title" value={draft.title} onChange={(v) => update('title', v)} required />

      <div className="grid grid-cols-2 gap-3">
        <Select
          label="Kind"
          value={draft.kind}
          onChange={(v) => update('kind', v)}
          options={[
            { value: 'hardware', label: 'Hardware' },
            { value: 'software', label: 'Software' },
          ]}
        />
        <TextField label="Year" value={draft.year} onChange={(v) => update('year', v)} />
      </div>

      <Select
        label="Status"
        value={draft.status ?? 'wip'}
        onChange={(v) => update('status', v as Project['status'])}
        options={[
          { value: 'shipped', label: 'Shipped' },
          { value: 'wip', label: 'Work in progress' },
          { value: 'concept', label: 'Concept' },
          { value: 'archived', label: 'Archived' },
        ]}
      />

      <TextArea
        label="Tagline"
        value={draft.tagline}
        onChange={(v) => update('tagline', v)}
        rows={2}
        placeholder="One-line elevator pitch"
      />

      <TextArea
        label="Summary"
        value={draft.summary}
        onChange={(v) => update('summary', v)}
        rows={4}
        placeholder="2–3 sentences. What, why, how."
      />

      <TextArea
        label="Body (markdown-ish)"
        value={draft.body ?? ''}
        onChange={(v) => update('body', v)}
        rows={10}
        placeholder="## Why&#10;...&#10;&#10;## How&#10;..."
      />

      <CSVField
        label="Tags"
        value={draft.tags}
        onChange={(v) => update('tags', v)}
        placeholder="React, Rust, STM32"
      />

      <LinksField
        label="Links"
        value={draft.links ?? []}
        onChange={(v) => update('links', v)}
      />

      <TextField
        label="Cover image URL"
        value={draft.cover ?? ''}
        onChange={(v) => update('cover', v || undefined)}
        placeholder="https://..."
      />

      <Checkbox
        label="Featured on home"
        checked={!!draft.featured}
        onChange={(v) => update('featured', v)}
      />

      <div className="flex items-center gap-2 pt-4 border-t border-paper-3/15">
        <button onClick={save} className="btn-primary">Save</button>
        <button onClick={onDone} className="btn-ghost">Cancel</button>
        <span className="flex-1" />
        <button onClick={onDelete} className="btn-danger">Delete</button>
      </div>
    </div>
  );
}
