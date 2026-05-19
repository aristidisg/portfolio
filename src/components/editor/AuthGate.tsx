'use client';

import { useState } from 'react';
import { useAuth } from './AuthProvider';
import { REPO_CONFIG } from '@/lib/repo-config';

export function AuthGate({ onSkip }: { onSkip: () => void }) {
  const { status, setup, unlock, error, forgetCredentials, user } = useAuth();
  const [pat, setPat] = useState('');
  const [passphrase, setPassphrase] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  if (status === 'checking') return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setBusy(true);
    try {
      if (status === 'needs-setup') {
        if (passphrase !== confirm) {
          throw new Error("Passphrases don't match.");
        }
        await setup(pat, passphrase);
      } else {
        await unlock(passphrase);
      }
      setPat('');
      setPassphrase('');
      setConfirm('');
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-ink-0/85 backdrop-blur-md p-4">
      <form
        onSubmit={submit}
        className="w-full max-w-md rounded-lg border border-accent/30 bg-ink-1 p-6 space-y-5 shadow-2xl"
      >
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent">
            {status === 'needs-setup' ? 'First-time setup' : 'Editor sign-in'}
          </p>
          <h2 className="font-display text-2xl font-semibold text-paper-0 mt-1">
            {status === 'needs-setup' ? 'Connect to GitHub' : 'Unlock editor'}
          </h2>
          <p className="mt-2 text-sm text-paper-2">
            {status === 'needs-setup' ? (
              <>
                The editor commits your changes directly to{' '}
                <code className="font-mono text-accent">
                  {REPO_CONFIG.owner}/{REPO_CONFIG.repo}
                </code>
                . Paste a fine-grained Personal Access Token and choose a passphrase to
                encrypt it on this device.
              </>
            ) : (
              <>
                Enter your passphrase to decrypt the GitHub token stored on this device
                {user ? (
                  <>
                    {' '}as <span className="text-accent font-mono">{user}</span>
                  </>
                ) : null}
                .
              </>
            )}
          </p>
        </div>

        {status === 'needs-setup' && (
          <details className="rounded border border-paper-3/20 bg-ink-0 p-3 text-xs text-paper-2">
            <summary className="cursor-pointer font-mono text-[10px] uppercase tracking-[0.2em] text-paper-3">
              How to make a token →
            </summary>
            <ol className="mt-3 space-y-2 list-decimal list-inside text-paper-1 leading-relaxed">
              <li>
                Open{' '}
                <a
                  href="https://github.com/settings/personal-access-tokens/new"
                  target="_blank"
                  rel="noreferrer"
                  className="text-accent link-underline"
                >
                  github.com/settings/personal-access-tokens/new
                </a>
              </li>
              <li>
                <b>Token name:</b> "portfolio editor"
              </li>
              <li>
                <b>Expiration:</b> 90 days (recommended)
              </li>
              <li>
                <b>Repository access:</b> "Only select repositories" →{' '}
                <code className="font-mono text-accent">
                  {REPO_CONFIG.owner}/{REPO_CONFIG.repo}
                </code>
              </li>
              <li>
                <b>Repository permissions → Contents:</b> <b>Read and write</b>
              </li>
              <li>Generate, then copy the token and paste it below.</li>
            </ol>
          </details>
        )}

        {status === 'needs-setup' && (
          <label className="block">
            <span className="field-label">GitHub token (PAT)</span>
            <input
              type="password"
              autoComplete="new-password"
              value={pat}
              onChange={(e) => setPat(e.target.value)}
              placeholder="github_pat_… or ghp_…"
              className="field"
              required
            />
          </label>
        )}

        <label className="block">
          <span className="field-label">
            Passphrase
            <span className="text-paper-3 normal-case tracking-normal"> (used to decrypt locally)</span>
          </span>
          <input
            type="password"
            autoComplete={status === 'needs-setup' ? 'new-password' : 'current-password'}
            value={passphrase}
            onChange={(e) => setPassphrase(e.target.value)}
            placeholder="at least 6 characters"
            className="field"
            required
            minLength={6}
          />
        </label>

        {status === 'needs-setup' && (
          <label className="block">
            <span className="field-label">Confirm passphrase</span>
            <input
              type="password"
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="field"
              required
              minLength={6}
            />
          </label>
        )}

        {(localError || error) && (
          <div className="rounded border border-accent-warm/40 bg-accent-warm/10 text-accent-warm text-sm p-2.5 font-mono">
            {localError || error}
          </div>
        )}

        <div className="flex items-center gap-2 pt-2">
          <button type="submit" disabled={busy} className="btn-primary">
            {busy
              ? 'Working…'
              : status === 'needs-setup'
                ? 'Connect & save'
                : 'Unlock'}
          </button>
          <button type="button" onClick={onSkip} className="btn-ghost">
            Skip — draft mode
          </button>
          <span className="flex-1" />
          {status === 'locked' && (
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Remove encrypted credentials from this device?')) {
                  forgetCredentials();
                }
              }}
              className="btn-ghost !text-accent-warm"
            >
              Forget creds
            </button>
          )}
        </div>

        <p className="text-[11px] font-mono text-paper-3 leading-relaxed">
          {status === 'needs-setup'
            ? 'The token is encrypted with your passphrase (AES-GCM, PBKDF2-250k) and stored in localStorage on this device only. Nothing leaves the browser except authenticated requests to api.github.com.'
            : 'If you forget the passphrase, click "Forget creds" and start over with a new token.'}
        </p>
      </form>
    </div>
  );
}
