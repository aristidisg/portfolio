import { OG_CONTENT_TYPE, OG_SIZE, renderOg } from '@/lib/og-template';
import { bakedContent, getPaperBySlug } from '@/lib/content';

export const dynamic = 'force-static';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = 'Paper cover';

export function generateStaticParams() {
  return bakedContent.papers.map((p) => ({ slug: p.slug }));
}

export default async function OgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const paper = getPaperBySlug(slug);
  if (!paper) {
    return renderOg({ title: 'Paper', subtitle: 'Not found' });
  }
  return renderOg({
    title: paper.title,
    subtitle: paper.authors.join(' · '),
    eyebrow: `paper · ${paper.year}${paper.venue ? ` · ${paper.venue}` : ''}`,
  });
}
