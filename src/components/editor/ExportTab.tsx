'use client';

import { useState } from 'react';
import { useContent } from '../ContentProvider';

export function ExportTab() {
  const { content, hasOverrides, reset } = useContent();

  const files: { name: string; path: string; data: unknown }[] = [
    { name: 'site.json', path: 'content/site.json', data: content.site },
    { name: 'about.json', path: 'content/about.json', data: content.about },
    { name: 'projects.json', path: 'content/projects.json', data: content.projects },
    { name: 'papers.json', path: 'content/papers.json', data: content.papers },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-md border border-accent/30 bg-accent/5 p-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent mb-2">
          How publishing works
        </p>
        <p className="text-sm text-paper-1 leading-relaxed">
          Edits made here live in your browser's localStorage only. To publish them as part of the
          built site (and make detail pages work for new items), download each JSON below and
          commit it to the repo at the matching path. The next deploy will bake in your changes
          and you can safely click <em>Discard</em> to clear local overrides.
        </p>
      </div>

      <ul className="space-y-3">
        {files.map((f) => (
          <FileRow key={f.name} name={f.name} path={f.path} data={f.data} />
        ))}
      </ul>

      <div className="pt-4 border-t border-paper-3/15 flex items-center gap-2">
        <button
          onClick={downloadAll(files)}
          className="btn-primary"
        >
          Download all ↓
        </button>
        {hasOverrides && (
          <button
            onClick={() => {
              if (window.confirm('Discard local edits?')) reset();
            }}
            className="btn-danger"
          >
            Discard local edits
          </button>
        )}
      </div>
    </div>
  );
}

function FileRow({ name, path, data }: { name: string; path: string; data: unknown }) {
  const [copied, setCopied] = useState(false);
  const json = JSON.stringify(data, null, 2);

  const download = () => {
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(json);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      window.alert('Copy failed — your browser may block clipboard access on http.');
    }
  };

  return (
    <li className="rounded-md border border-paper-3/15 bg-ink-0/40 p-3">
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="font-display font-medium text-paper-0">{name}</p>
          <p className="font-mono text-[10px] text-paper-3">{path}</p>
        </div>
        <div className="flex items-center gap-1.5">
          <button onClick={copy} className="btn-ghost !py-1.5 !px-3 !text-[10px]">
            {copied ? 'Copied' : 'Copy'}
          </button>
          <button onClick={download} className="btn-ghost !py-1.5 !px-3 !text-[10px]">
            ↓ Download
          </button>
        </div>
      </div>
    </li>
  );
}

function downloadAll(files: { name: string; data: unknown }[]) {
  return () => {
    files.forEach((f) => {
      const json = JSON.stringify(f.data, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = f.name;
      a.click();
      URL.revokeObjectURL(url);
    });
  };
}
