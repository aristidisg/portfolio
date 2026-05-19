import { OG_CONTENT_TYPE, OG_SIZE, renderOg } from '@/lib/og-template';
import { bakedContent, getProjectBySlug } from '@/lib/content';

export const dynamic = 'force-static';
export const dynamicParams = false;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = 'Project cover';

export async function generateStaticParams() {
  const params = bakedContent.projects.map((p) => ({ slug: p.slug }));
  return params.length > 0 ? params : [{ slug: '_empty' }];
}

export default async function OgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) {
    return renderOg({ title: 'Project', subtitle: '' });
  }
  return renderOg({
    title: project.title,
    subtitle: project.tagline,
    eyebrow: `${project.kind} · ${project.year}`,
  });
}
