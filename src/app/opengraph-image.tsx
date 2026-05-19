import { OG_CONTENT_TYPE, OG_SIZE, renderOg } from '@/lib/og-template';
import { bakedContent } from '@/lib/content';

export const dynamic = 'force-static';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = 'Portfolio cover';

export default function OgImage() {
  return renderOg({
    title: bakedContent.about.name,
    subtitle: bakedContent.site.tagline,
    eyebrow: 'portfolio',
  });
}
