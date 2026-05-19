'use client';

import { useState } from 'react';
import type { Paper } from '@/lib/types';
import { Checkbox, CSVField, LinksField, TextArea, TextField } from './fields';

export function PaperForm({
  paper,
  onSave,
  onDone,
  onDelete,
}: {
  paper: Paper;
  onSave: (next: Paper) => void;
  onDone: () => void;
  onDelete: () => void;
}) {
  const [draft, setDraft] = useState<Paper>(paper);
  const update = <K extends keyof Paper>(key: K, value: Paper[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <button onClick={onDone} className="btn-ghost !py-1.5 !px-3 !text-[10px]">
          ← All papers
        </button>
        <span className="font-mono text-[10px] text-paper-3">{draft.slug}</span>
      </div>

      <TextField label="Title" value={draft.title} onChange={(v) => update('title', v)} required />

      <div className="grid grid-cols-2 gap-3">
        <TextField label="Year" value={draft.year} onChange={(v) => update('year', v)} />
        <TextField
          label="Venue"
          value={draft.venue ?? ''}
          onChange={(v) => update('venue', v || undefined)}
          placeholder="Conference / journal"
        />
      </div>

      <CSVField
        label="Authors"
        value={draft.authors}
        onChange={(v) => update('authors', v)}
        placeholder="Your Name, Co-author"
      />

      <TextArea
        label="Abstract"
        value={draft.abstract}
        onChange={(v) => update('abstract', v)}
        rows={6}
      />

      <TextArea
        label="Body (markdown-ish)"
        value={draft.body ?? ''}
        onChange={(v) => update('body', v)}
        rows={8}
        placeholder="Optional longer notes, links to related work, etc."
      />

      <CSVField
        label="Tags"
        value={draft.tags}
        onChange={(v) => update('tags', v)}
      />

      <TextField
        label="PDF URL"
        value={draft.pdf ?? ''}
        onChange={(v) => update('pdf', v || undefined)}
        placeholder="https://... or /papers/yours.pdf"
      />

      <LinksField
        label="Additional links"
        value={draft.links ?? []}
        onChange={(v) => update('links', v)}
      />

      <Checkbox
        label="Featured on home"
        checked={!!draft.featured}
        onChange={(v) => update('featured', v)}
      />

      <div className="flex items-center gap-2 pt-4 border-t border-paper-3/15">
        <button onClick={() => onSave(draft)} className="btn-primary">Save</button>
        <button onClick={onDone} className="btn-ghost">Cancel</button>
        <span className="flex-1" />
        <button onClick={onDelete} className="btn-danger">Delete</button>
      </div>
    </div>
  );
}
