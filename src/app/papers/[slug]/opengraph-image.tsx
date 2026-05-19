import { OG_CONTENT_TYPE, OG_SIZE, renderOg } from '@/lib/og-template';
import { bakedContent, getPaperBySlug } from '@/lib/content';

export const dynamic = 'force-static';
export const dynamicParams = false;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = 'Paper cover';

export async function generateStaticParams() {
  const params = bakedContent.papers.map((p) => ({ slug: p.slug }));
  return params.length > 0 ? params : [{ slug: '_empty' }];
}

export default async function OgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const paper = getPaperBySlug(slug);
  if (!paper) {
    return renderOg({ title: 'Paper', subtitle: '' });
  }
  return renderOg({
    title: paper.title,
    subtitle: paper.authors.join(' · '),
    eyebrow: `paper · ${paper.year}${paper.venue ? ` · ${paper.venue}` : ''}`,
  });
}
