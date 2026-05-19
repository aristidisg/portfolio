import { OG_CONTENT_TYPE, OG_SIZE, renderOg } from '@/lib/og-template';
import { bakedContent, getProjectBySlug } from '@/lib/content';

export const dynamic = 'force-static';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = 'Project cover';

export function generateStaticParams() {
  return bakedContent.projects.map((p) => ({ slug: p.slug }));
}

export default async function OgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) {
    return renderOg({ title: 'Project', subtitle: 'Not found' });
  }
  return renderOg({
    title: project.title,
    subtitle: project.tagline,
    eyebrow: `${project.kind} · ${project.year}`,
  });
}
