'use client';

import { useState } from 'react';
import { useContent } from '../ContentProvider';
import { TextArea, TextField } from './fields';

export function SiteTab() {
  const { content, updateSite } = useContent();
  const [draft, setDraft] = useState(content.site);
  const update = <K extends keyof typeof draft>(key: K, value: (typeof draft)[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  return (
    <div className="space-y-5">
      <TextField
        label="Site title"
        value={draft.title}
        onChange={(v) => update('title', v)}
      />
      <TextArea
        label="Description"
        value={draft.description}
        onChange={(v) => update('description', v)}
        rows={2}
      />
      <TextArea
        label="Tagline (shown in hero)"
        value={draft.tagline}
        onChange={(v) => update('tagline', v)}
        rows={3}
      />

      <div className="pt-4 border-t border-paper-3/15">
        <button onClick={() => updateSite(draft)} className="btn-primary">
          Save site
        </button>
      </div>
    </div>
  );
}
