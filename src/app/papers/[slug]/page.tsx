import { PaperDetail } from '@/components/PaperDetail';
import { bakedContent, getPaperBySlug } from '@/lib/content';

export async function generateStaticParams() {
  const params = bakedContent.papers.map((p) => ({ slug: p.slug }));
  return params.length > 0 ? params : [{ slug: '_empty' }];
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
