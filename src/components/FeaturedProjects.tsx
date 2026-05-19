'use client';

import Link from 'next/link';
import { useContent } from './ContentProvider';
import { ProjectCard } from './ProjectCard';

export function FeaturedProjects() {
  const { content, baked } = useContent();
  const featured = content.projects.filter((p) => p.featured).slice(0, 4);
  const list = featured.length > 0 ? featured : content.projects.slice(0, 4);
  const bakedSlugs = new Set(baked.projects.map((p) => p.slug));

  return (
    <section className="container-x py-24">
      <header className="flex items-end justify-between mb-10">
        <div>
          <p className="field-label">§ 01</p>
          <h2 className="font-display font-bold text-giant text-paper-0 text-balance">
            Selected work.
          </h2>
        </div>
        <Link href="/projects/" className="btn-ghost hidden sm:inline-flex">
          All projects →
        </Link>
      </header>

      <div className="border-b border-paper-3/15">
        {list.map((p, i) => (
          <ProjectCard key={p.slug} project={p} index={i} isDraft={!bakedSlugs.has(p.slug)} />
        ))}
      </div>

      <div className="sm:hidden mt-8">
        <Link href="/projects/" className="btn-ghost">
          All projects →
        </Link>
      </div>
    </section>
  );
}
