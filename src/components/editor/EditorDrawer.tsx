'use client';

import { useState } from 'react';
import { useContent } from '../ContentProvider';
import { ProjectsTab } from './ProjectsTab';
import { PapersTab } from './PapersTab';
import { AboutTab } from './AboutTab';
import { SiteTab } from './SiteTab';
import { ExportTab } from './ExportTab';

type Tab = 'projects' | 'papers' | 'about' | 'site' | 'export';

const tabs: { key: Tab; label: string }[] = [
  { key: 'projects', label: 'Projects' },
  { key: 'papers', label: 'Papers' },
  { key: 'about', label: 'About' },
  { key: 'site', label: 'Site' },
  { key: 'export', label: 'Export ↓' },
];

export function EditorDrawer({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState<Tab>('projects');
  const { hasOverrides } = useContent();

  return (
    <div className="fixed inset-0 z-[70] flex" role="dialog" aria-modal>
      <button
        aria-label="Close editor"
        className="flex-1 bg-ink-0/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <aside className="w-full max-w-2xl bg-ink-1 border-l border-accent/30 flex flex-col h-full overflow-hidden">
        <header className="flex items-center justify-between px-6 py-4 border-b border-paper-3/15">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent">
              Editor {hasOverrides && '· unsaved changes'}
            </p>
            <h2 className="font-display text-2xl font-semibold text-paper-0 mt-1">
              Content
            </h2>
          </div>
          <button
            onClick={onClose}
            className="btn-ghost !py-1.5 !px-3 !text-[10px]"
            aria-label="Close"
          >
            Close ✕
          </button>
        </header>

        <nav className="px-6 pt-3 border-b border-paper-3/15 flex gap-1 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-3 py-2 font-mono text-[10px] uppercase tracking-[0.2em] border-b-2 -mb-px transition ${
                tab === t.key
                  ? 'text-accent border-accent'
                  : 'text-paper-3 border-transparent hover:text-paper-1'
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>

        <div className="flex-1 overflow-y-auto p-6">
          {tab === 'projects' && <ProjectsTab />}
          {tab === 'papers' && <PapersTab />}
          {tab === 'about' && <AboutTab />}
          {tab === 'site' && <SiteTab />}
          {tab === 'export' && <ExportTab />}
        </div>
      </aside>
    </div>
  );
}
