'use client';

import { useState } from 'react';
import { assetPath } from '@/lib/asset-path';

/**
 * Inline PDF viewer using the browser's native PDF rendering (iframe).
 *
 * Works in Chrome/Edge/Firefox/Safari desktop. Mobile browsers vary —
 * iOS Safari will sometimes refuse to render embedded PDFs and show a
 * blank iframe. The "Open in new tab" button is always present as a
 * deterministic fallback.
 */
export function PdfViewer({ src, title }: { src: string; title: string }) {
  const url = assetPath(src);
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-lg border border-paper-3/15 bg-ink-1 overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 border-b border-paper-3/15">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-paper-3 truncate pr-2">
          {title}
        </span>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setExpanded((v) => !v)}
            className="btn-ghost !py-1 !px-2.5 !text-[10px]"
          >
            {expanded ? 'Shrink' : 'Expand'}
          </button>
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="btn-ghost !py-1 !px-2.5 !text-[10px]"
          >
            Open ↗
          </a>
          <a href={url} download className="btn-ghost !py-1 !px-2.5 !text-[10px]">
            ↓ PDF
          </a>
        </div>
      </div>
      <div className={expanded ? 'h-[90vh]' : 'h-[70vh] min-h-[420px]'}>
        <iframe
          src={`${url}#view=FitH&toolbar=1`}
          title={title}
          className="w-full h-full bg-paper-0"
          loading="lazy"
        />
      </div>
    </div>
  );
}
