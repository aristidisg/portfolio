'use client';

import { useEffect, useRef, useState } from 'react';
import { assetPath } from '@/lib/asset-path';

/**
 * 3D model viewer using Google's <model-viewer> web component.
 *
 * Loaded from a CDN on first mount so the ~150KB JS only ships when a page
 * actually uses 3D. Accepts GLB (binary glTF). For Fusion 360 / SolidWorks /
 * CAD users: export STL or OBJ, convert to GLB with Blender (or an online
 * converter), drop into public/models/.
 */
const SCRIPT_URL = 'https://cdn.jsdelivr.net/npm/@google/model-viewer@4.0.0/dist/model-viewer.min.js';
const SCRIPT_TYPE = 'module';

let scriptPromise: Promise<void> | null = null;
function loadModelViewer(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise((resolve, reject) => {
    if (customElements.get('model-viewer')) {
      resolve();
      return;
    }
    const existing = document.querySelector<HTMLScriptElement>(`script[data-mv-loader="1"]`);
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('Failed to load model-viewer')));
      return;
    }
    const s = document.createElement('script');
    s.src = SCRIPT_URL;
    s.type = SCRIPT_TYPE;
    s.async = true;
    s.dataset.mvLoader = '1';
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('Failed to load model-viewer'));
    document.head.appendChild(s);
  });
  return scriptPromise;
}

export function ModelViewer({ src, alt }: { src: string; alt: string }) {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement | null>(null);
  const url = assetPath(src);
  const isLikelyGlb = /\.(glb|gltf)(\?|#|$)/i.test(url);

  useEffect(() => {
    let cancelled = false;
    loadModelViewer()
      .then(() => {
        if (!cancelled) setReady(true);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Loader failed');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return (
      <FallbackBox>
        Couldn't load the 3D viewer.{' '}
        <a href={url} className="text-accent link-underline" target="_blank" rel="noreferrer">
          Download the model
        </a>{' '}
        instead.
      </FallbackBox>
    );
  }

  if (!isLikelyGlb) {
    return (
      <FallbackBox>
        This model isn't a .glb file, which the viewer needs.{' '}
        <a href={url} className="text-accent link-underline" target="_blank" rel="noreferrer">
          Download it
        </a>{' '}
        — see the README on converting STL/STEP/OBJ to GLB.
      </FallbackBox>
    );
  }

  return (
    <div
      ref={ref}
      className="rounded-lg border border-paper-3/15 bg-ink-1 overflow-hidden aspect-[16/10]"
    >
      {ready ? (
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        <model-viewer
          {...({
            src: url,
            alt,
            'camera-controls': '',
            'auto-rotate': '',
            'rotation-per-second': '20deg',
            'shadow-intensity': '0.6',
            exposure: '0.9',
            'interaction-prompt': 'none',
            style: { width: '100%', height: '100%', backgroundColor: 'transparent' },
          } as any)}
        />
      ) : (
        <div className="h-full w-full flex items-center justify-center font-mono text-xs uppercase tracking-[0.2em] text-paper-3">
          Loading 3D viewer…
        </div>
      )}
    </div>
  );
}

function FallbackBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-paper-3/15 bg-ink-1 p-6 text-sm text-paper-2">
      {children}
    </div>
  );
}

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      // model-viewer is a custom element from @google/model-viewer.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      'model-viewer': any;
    }
  }
}
