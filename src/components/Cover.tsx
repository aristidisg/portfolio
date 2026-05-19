'use client';

import { assetPath, gradientFor } from '@/lib/asset-path';

/**
 * Cover image with a graceful fallback: deterministic gradient + monogram.
 * Sizing is controlled by parent — Cover fills its container.
 */
export function Cover({
  src,
  alt,
  slug,
  monogram,
  className = '',
  aspect = 'aspect-[16/9]',
  rounded = 'rounded-lg',
}: {
  src?: string;
  alt: string;
  slug: string;
  monogram?: string;
  className?: string;
  aspect?: string;
  rounded?: string;
}) {
  const url = assetPath(src);
  if (url) {
    return (
      <div className={`relative overflow-hidden bg-ink-2 ${aspect} ${rounded} ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={url}
          alt={alt}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    );
  }

  const initial = monogram || alt.charAt(0).toUpperCase();
  return (
    <div
      role="img"
      aria-label={alt}
      className={`relative overflow-hidden flex items-center justify-center ${aspect} ${rounded} ${className}`}
      style={{ background: gradientFor(slug) }}
    >
      <span className="font-display font-bold text-6xl md:text-8xl text-white/15 select-none">
        {initial}
      </span>
      <span className="absolute bottom-2 left-3 font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
        {slug}
      </span>
    </div>
  );
}
