'use client';

import { useState } from 'react';
import { useAuth } from './AuthProvider';
import { useSync } from './SyncProvider';
import { REPO_CONFIG } from '@/lib/repo-config';

export function GitHubTab() {
  const { status, user, mode, setMode, lock, forgetCredentials } = useAuth();
  const { saving, error, lastCommitSha, lastSavedAt, refreshFromRepo, shas } = useSync();
  const [refreshing, setRefreshing] = useState(false);

  const repoUrl = `https://github.com/${REPO_CONFIG.owner}/${REPO_CONFIG.repo}`;

  const doRefresh = async () => {
    setRefreshing(true);
    await refreshFromRepo();
    setRefreshing(false);
  };

  return (
    <div className="space-y-6">
      <section className="rounded-md border border-paper-3/15 bg-ink-0/40 p-4 space-y-2">
        <p className="field-label">Repository</p>
        <a href={repoUrl} target="_blank" rel="noreferrer" className="font-mono text-paper-1 hover:text-accent link-underline">
          {REPO_CONFIG.owner}/{REPO_CONFIG.repo}
        </a>
        <p className="font-mono text-[11px] text-paper-3">
          Branch: <code className="text-accent">{REPO_CONFIG.branch}</code>
        </p>
      </section>

      <section className="rounded-md border border-paper-3/15 bg-ink-0/40 p-4 space-y-3">
        <p className="field-label">Account</p>
        <p className="font-mono text-sm text-paper-1">
          {status === 'unlocked' ? (
            <>Signed in as <span className="text-accent">@{user}</span></>
          ) : status === 'locked' ? (
            <>Locked{user ? <> · last user <span className="text-paper-2">@{user}</span></> : null}</>
          ) : (
            'Not connected'
          )}
        </p>

        <div className="flex flex-wrap gap-2 pt-2">
          {status === 'unlocked' && (
            <button onClick={lock} className="btn-ghost !py-1.5 !px-3 !text-[10px]">
              Lock token
            </button>
          )}
          <button
            onClick={() => {
              if (window.confirm('Remove encrypted credentials from this device? You\'ll need a new token to re-authenticate.')) {
                forgetCredentials();
              }
            }}
            className="btn-danger !py-1.5 !px-3 !text-[10px]"
          >
            Forget credentials
          </button>
        </div>
      </section>

      <section className="rounded-md border border-paper-3/15 bg-ink-0/40 p-4 space-y-3">
        <p className="field-label">Mode</p>
        <div className="flex gap-2">
          <button
            onClick={() => setMode('draft')}
            className={`flex-1 text-left p-3 rounded border transition ${
              mode === 'draft'
                ? 'border-paper-0 bg-ink-1'
                : 'border-paper-3/20 hover:border-paper-2/40'
            }`}
          >
            <p className="font-display font-medium text-paper-0">Draft</p>
            <p className="text-xs text-paper-3 mt-1">Changes stay in this browser only. Nothing publishes.</p>
          </button>
          <button
            onClick={() => {
              if (status !== 'unlocked') {
                window.alert('Connect to GitHub first.');
                return;
              }
              setMode('live');
            }}
            disabled={status !== 'unlocked'}
            className={`flex-1 text-left p-3 rounded border transition disabled:opacity-40 disabled:cursor-not-allowed ${
              mode === 'live'
                ? 'border-accent bg-accent/10'
                : 'border-paper-3/20 hover:border-paper-2/40'
            }`}
          >
            <p className="font-display font-medium text-paper-0">Live</p>
            <p className="text-xs text-paper-3 mt-1">Each save commits to GitHub and triggers a deploy (~2 min).</p>
          </button>
        </div>
      </section>

      <section className="rounded-md border border-paper-3/15 bg-ink-0/40 p-4 space-y-3">
        <p className="field-label">Sync</p>
        {error ? (
          <p className="text-accent-warm font-mono text-sm">{error}</p>
        ) : saving ? (
          <p className="text-accent-cool font-mono text-sm">Saving to GitHub…</p>
        ) : lastCommitSha ? (
          <p className="font-mono text-sm text-paper-1">
            Last save: <code className="text-accent">{lastCommitSha.slice(0, 7)}</code>
            {lastSavedAt && <> · {new Date(lastSavedAt).toLocaleTimeString()}</>}
            <br />
            <a
              href={`${repoUrl}/actions`}
              target="_blank"
              rel="noreferrer"
              className="text-paper-3 hover:text-accent link-underline"
            >
              → view deploy status
            </a>
          </p>
        ) : (
          <p className="font-mono text-sm text-paper-3">No saves this session.</p>
        )}

        <button
          onClick={doRefresh}
          disabled={status !== 'unlocked' || refreshing}
          className="btn-ghost !py-1.5 !px-3 !text-[10px] disabled:opacity-40"
        >
          {refreshing ? 'Refreshing…' : '↻ Pull latest from GitHub'}
        </button>

        {Object.keys(shas).length > 0 && (
          <details className="text-xs">
            <summary className="cursor-pointer font-mono text-[10px] uppercase tracking-[0.2em] text-paper-3">
              File SHAs →
            </summary>
            <ul className="mt-2 space-y-0.5 font-mono text-paper-2">
              {Object.entries(shas).map(([k, v]) => (
                <li key={k}>
                  {k}: <code className="text-paper-3">{(v as string).slice(0, 12)}</code>
                </li>
              ))}
            </ul>
          </details>
        )}
      </section>

      <p className="text-xs text-paper-3 leading-relaxed">
        💡 If something looks broken on the live site, you can always revert at{' '}
        <a href={`${repoUrl}/commits/${REPO_CONFIG.branch}`} target="_blank" rel="noreferrer" className="link-underline">
          {REPO_CONFIG.owner}/{REPO_CONFIG.repo}/commits
        </a>{' '}
        — every save here creates a commit you can roll back.
      </p>
    </div>
  );
}
