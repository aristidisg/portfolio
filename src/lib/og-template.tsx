/* eslint-disable react/no-unknown-property */
import { ImageResponse } from 'next/og';

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = 'image/png';

interface OgProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  footer?: string;
}

export function renderOg({ title, subtitle, eyebrow, footer }: OgProps) {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#0a0a0a',
          backgroundImage:
            'radial-gradient(circle at 25% 15%, rgba(212,255,58,0.18), transparent 55%), radial-gradient(circle at 80% 100%, rgba(255,107,74,0.18), transparent 60%)',
          color: '#f5f3ef',
          padding: '72px 80px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, color: '#bfbab0', fontSize: 22, letterSpacing: 4, textTransform: 'uppercase' }}>
          <span style={{ width: 14, height: 14, borderRadius: 999, background: '#d4ff3a' }} />
          {eyebrow || 'portfolio'}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          <div
            style={{
              fontSize: title.length > 60 ? 64 : 92,
              fontWeight: 700,
              letterSpacing: -2,
              lineHeight: 1,
              color: '#f5f3ef',
              display: 'flex',
            }}
          >
            {title}
            <span style={{ color: '#d4ff3a' }}>.</span>
          </div>
          {subtitle && (
            <div style={{ fontSize: 32, color: '#e8e4dc', maxWidth: 980, lineHeight: 1.25 }}>
              {subtitle}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#8b8680', fontSize: 22, letterSpacing: 3, textTransform: 'uppercase' }}>
          <span>{footer || 'aristidisg.github.io/portfolio'}</span>
          <span>↗</span>
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
