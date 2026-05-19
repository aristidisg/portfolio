import { ProjectDetail } from '@/components/ProjectDetail';
import { bakedContent, getProjectBySlug } from '@/lib/content';

export async function generateStaticParams() {
  const params = bakedContent.projects.map((p) => ({ slug: p.slug }));
  // Next.js with `output: export` errors on empty generateStaticParams.
  // Emit a sentinel so the build is stable even when the content is empty;
  // the detail page renders its "not found" UI for an unknown slug.
  return params.length > 0 ? params : [{ slug: '_empty' }];
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return { title: 'Project' };
  return { title: project.title, description: project.tagline };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ProjectDetail slug={slug} />;
}
