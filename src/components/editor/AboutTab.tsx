'use client';

import { useState } from 'react';
import { useContent } from '../ContentProvider';
import { LinksField, TextArea, TextField } from './fields';
import { useSync } from './SyncProvider';

export function AboutTab() {
  const { content } = useContent();
  const { publishAbout: updateAbout } = useSync();
  const [draft, setDraft] = useState(content.about);

  const update = <K extends keyof typeof draft>(key: K, value: (typeof draft)[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  return (
    <div className="space-y-5">
      <TextField label="Name" value={draft.name} onChange={(v) => update('name', v)} required />
      <div className="grid grid-cols-2 gap-3">
        <TextField
          label="Pronouns"
          value={draft.pronouns ?? ''}
          onChange={(v) => update('pronouns', v || undefined)}
        />
        <TextField
          label="Location"
          value={draft.location ?? ''}
          onChange={(v) => update('location', v || undefined)}
        />
      </div>
      <TextField label="Role" value={draft.role} onChange={(v) => update('role', v)} />
      <TextArea
        label="Bio (markdown-ish)"
        value={draft.bio}
        onChange={(v) => update('bio', v)}
        rows={8}
      />
      <TextField
        label="Email"
        value={draft.email ?? ''}
        onChange={(v) => update('email', v || undefined)}
      />
      <TextField
        label="Resume URL"
        value={draft.resume ?? ''}
        onChange={(v) => update('resume', v || undefined)}
        placeholder="https://... or /resume.pdf"
      />
      <LinksField
        label="Social links"
        value={draft.socials}
        onChange={(v) => update('socials', v)}
      />

      <div className="pt-4 border-t border-paper-3/15">
        <button onClick={() => updateAbout(draft)} className="btn-primary">
          Save about
        </button>
      </div>
    </div>
  );
}
