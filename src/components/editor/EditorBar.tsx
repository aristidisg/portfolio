'use client';

import { useContent } from '../ContentProvider';

export function EditorBar({
  onOpen,
  onLock,
}: {
  onOpen: () => void;
  onLock: () => void;
}) {
  const { hasOverrides, reset } = useContent();

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60]">
      <div className="flex items-center gap-2 rounded-full border border-accent/40 bg-ink-0/90 backdrop-blur-md p-1.5 shadow-2xl shadow-accent/10">
        <span className="flex items-center gap-2 pl-3 pr-2 font-mono text-[10px] uppercase tracking-[0.25em] text-accent">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent animate-blink" />
          editor
        </span>
        <button onClick={onOpen} className="btn-primary !py-1.5 !px-3 !text-[10px]">
          Edit content
        </button>
        {hasOverrides && (
          <button
            onClick={() => {
              if (window.confirm('Discard all local edits and revert to baked content?')) reset();
            }}
            className="btn-ghost !py-1.5 !px-3 !text-[10px]"
            title="Discard local changes"
          >
            Discard
          </button>
        )}
        <button onClick={onLock} className="btn-ghost !py-1.5 !px-3 !text-[10px]">
          Lock
        </button>
      </div>
    </div>
  );
}
