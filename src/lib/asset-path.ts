/**
 * Resolve a content-supplied path/URL to something the browser can fetch.
 *
 * - Absolute URLs (https://...) pass through.
 * - data: URIs pass through.
 * - Site-relative paths like `/img/foo.jpg` get the GitHub Pages basePath prefix
 *   in production. In dev the basePath is empty and they stay as-is.
 */
const BASE = (process.env.NEXT_PUBLIC_BASE_PATH || '').replace(/\/$/, '');

export function assetPath(src?: string | null): string {
  if (!src) return '';
  if (/^(https?:|data:)/i.test(src)) return src;
  if (!src.startsWith('/')) return `${BASE}/${src}`;
  return `${BASE}${src}`;
}

/** Deterministic 0..360 hue from a string (for placeholder gradients) */
export function hueFromString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i += 1) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h % 360;
}

export function gradientFor(slug: string): string {
  const h = hueFromString(slug);
  return `linear-gradient(135deg, hsl(${h} 60% 22%) 0%, hsl(${(h + 60) % 360} 70% 12%) 60%, hsl(${(h + 180) % 360} 55% 18%) 100%)`;
}
