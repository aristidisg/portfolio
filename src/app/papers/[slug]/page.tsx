import { PaperDetail } from '@/components/PaperDetail';
import { bakedContent, getPaperBySlug } from '@/lib/content';

export function generateStaticParams() {
  return bakedContent.papers.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const paper = getPaperBySlug(slug);
  if (!paper) return { title: 'Paper' };
  return { title: paper.title, description: paper.abstract.slice(0, 160) };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <PaperDetail slug={slug} />;
}
