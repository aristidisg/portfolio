'use client';

import { useContent } from '../ContentProvider';
import { useAuth } from './AuthProvider';
import { useSync } from './SyncProvider';

export function EditorBar({
  onOpen,
  onLockEditor,
}: {
  onOpen: () => void;
  onLockEditor: () => void;
}) {
  const { hasOverrides, reset } = useContent();
  const { status, user, mode, setMode, lock } = useAuth();
  const { saving, error, lastCommitSha, lastSavedAt } = useSync();

  const canGoLive = status === 'unlocked';

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] max-w-[95vw]">
      <div className="flex items-center gap-1.5 rounded-full border border-accent/40 bg-ink-0/95 backdrop-blur-md p-1.5 shadow-2xl shadow-accent/10 flex-wrap justify-center">
        {/* Indicator */}
        <span className="flex items-center gap-2 pl-3 pr-2 font-mono text-[10px] uppercase tracking-[0.25em]">
          <SyncDot saving={saving} error={!!error} mode={mode} hasOverrides={hasOverrides} />
          <span className={error ? 'text-accent-warm' : saving ? 'text-accent-cool' : 'text-accent'}>
            {error ? 'error' : saving ? 'saving…' : mode === 'live' ? 'live' : 'draft'}
          </span>
          {user && (
            <span className="text-paper-3 normal-case tracking-normal">@{user}</span>
          )}
        </span>

        {/* Mode toggle */}
        <div className="flex rounded-full border border-paper-3/20 p-0.5">
          <button
            onClick={() => setMode('draft')}
            className={`px-2.5 py-1 rounded-full font-mono text-[10px] uppercase tracking-[0.2em] transition ${
              mode === 'draft' ? 'bg-paper-0 text-ink-0' : 'text-paper-3 hover:text-paper-0'
            }`}
            title="Draft mode: changes stay local"
          >
            Draft
          </button>
          <button
            onClick={() => {
              if (!canGoLive) {
                window.alert('Set up GitHub credentials first to enable live mode.');
                return;
              }
              setMode('live');
            }}
            className={`px-2.5 py-1 rounded-full font-mono text-[10px] uppercase tracking-[0.2em] transition ${
              mode === 'live' ? 'bg-accent text-ink-0' : 'text-paper-3 hover:text-paper-0'
            }`}
            disabled={!canGoLive}
            title={canGoLive ? 'Live mode: changes commit to GitHub' : 'Connect to GitHub first'}
          >
            Live
          </button>
        </div>

        <button onClick={onOpen} className="btn-primary !py-1.5 !px-3 !text-[10px]">
          Edit content
        </button>

        {hasOverrides && (
          <button
            onClick={() => {
              if (window.confirm('Discard local edits and revert to last loaded content?')) reset();
            }}
            className="btn-ghost !py-1.5 !px-3 !text-[10px]"
            title="Discard local changes"
          >
            Discard
          </button>
        )}

        {status === 'unlocked' && (
          <button
            onClick={lock}
            className="btn-ghost !py-1.5 !px-3 !text-[10px]"
            title="Lock GitHub credentials (passphrase will be required again)"
          >
            Lock GH
          </button>
        )}

        <button onClick={onLockEditor} className="btn-ghost !py-1.5 !px-3 !text-[10px]">
          Close editor
        </button>
      </div>

      {(error || lastCommitSha) && (
        <div className="mt-2 mx-auto text-center font-mono text-[10px]">
          {error ? (
            <span className="text-accent-warm">{error}</span>
          ) : lastCommitSha ? (
            <span className="text-paper-3">
              saved {lastSavedAt ? `${relativeTime(lastSavedAt)} · ` : ''}
              <code className="text-accent">{lastCommitSha.slice(0, 7)}</code> · building…
            </span>
          ) : null}
        </div>
      )}
    </div>
  );
}

function SyncDot({
  saving,
  error,
  mode,
  hasOverrides,
}: {
  saving: boolean;
  error: boolean;
  mode: string;
  hasOverrides: boolean;
}) {
  let color = 'bg-paper-3';
  if (error) color = 'bg-accent-warm';
  else if (saving) color = 'bg-accent-cool';
  else if (mode === 'live') color = 'bg-accent';
  else if (hasOverrides) color = 'bg-accent-warm';
  return (
    <span className="relative inline-flex h-1.5 w-1.5">
      <span className={`absolute inset-0 rounded-full ${color} ${saving ? 'animate-blink' : ''}`} />
      <span className={`absolute inset-0 rounded-full ${color} opacity-40 blur-sm`} />
    </span>
  );
}

function relativeTime(ts: number): string {
  const s = Math.round((Date.now() - ts) / 1000);
  if (s < 5) return 'just now';
  if (s < 60) return `${s}s ago`;
  const m = Math.round(s / 60);
  if (m < 60) return `${m}m ago`;
  return new Date(ts).toLocaleTimeString();
}
