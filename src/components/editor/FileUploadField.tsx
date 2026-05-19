'use client';

import { useRef, useState } from 'react';
import { useSync } from './SyncProvider';
import { useAuth } from './AuthProvider';
import { assetPath } from '@/lib/asset-path';

export function FileUploadField({
  label,
  value,
  onChange,
  accept,
  destDir,
  hint,
}: {
  label: string;
  value: string;
  onChange: (path: string) => void;
  accept: string;
  destDir: 'img' | 'models' | 'papers';
  hint?: string;
}) {
  const { uploadAsset, saving } = useSync();
  const { mode, status } = useAuth();
  const fileInput = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canUpload = mode === 'live' && status === 'unlocked';

  const onPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setBusy(true);
    try {
      const path = await uploadAsset(file, destDir);
      onChange(path);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setBusy(false);
      if (fileInput.current) fileInput.current.value = '';
    }
  };

  const showImagePreview = value && accept.includes('image');

  return (
    <div>
      <p className="field-label">{label}</p>

      {showImagePreview && (
        <div className="mb-2 rounded-md overflow-hidden bg-ink-2 border border-paper-3/15 aspect-[16/9] relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={assetPath(value)}
            alt="preview"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      )}

      <div className="flex flex-wrap gap-2 items-center">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={hint || `/${destDir}/your-file`}
          className="field flex-1 min-w-[200px]"
        />
        <input
          ref={fileInput}
          type="file"
          accept={accept}
          onChange={onPick}
          hidden
        />
        <button
          type="button"
          onClick={() => fileInput.current?.click()}
          disabled={!canUpload || busy || saving}
          className="btn-ghost !py-2 !px-3 !text-[10px] disabled:opacity-40"
          title={canUpload ? 'Upload a file to the repo' : 'Go Live to enable uploads'}
        >
          {busy ? 'Uploading…' : '↑ Upload'}
        </button>
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="btn-ghost !py-2 !px-3 !text-[10px]"
            aria-label="Clear"
          >
            ✕
          </button>
        )}
      </div>

      {error && <p className="text-accent-warm text-xs mt-1 font-mono">{error}</p>}
      {!error && busy && (
        <p className="text-accent-cool text-xs mt-1 font-mono">
          Uploading via GitHub — large files may take a moment…
        </p>
      )}
      {!error && !busy && !canUpload && (
        <p className="text-paper-3 text-xs mt-1 font-mono">
          Sign in to GitHub and switch to Live mode to upload. Or paste an external URL.
        </p>
      )}
      {!error && !busy && value && canUpload && (
        <p className="text-paper-3 text-xs mt-1 font-mono">
          Uploaded files appear on the live site after the next deploy (~2 min).
        </p>
      )}
    </div>
  );
}
