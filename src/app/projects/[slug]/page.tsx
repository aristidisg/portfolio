import { ProjectDetail } from '@/components/ProjectDetail';
import { bakedContent, getProjectBySlug } from '@/lib/content';

export function generateStaticParams() {
  return bakedContent.projects.map((p) => ({ slug: p.slug }));
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
