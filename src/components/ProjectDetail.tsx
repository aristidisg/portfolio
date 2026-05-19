'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useContent } from './ContentProvider';
import { Prose } from './Prose';
import { Cover } from './Cover';

const ModelViewer = dynamic(() => import('./ModelViewer').then((m) => m.ModelViewer), {
  ssr: false,
  loading: () => (
    <div className="aspect-[16/10] rounded-lg bg-ink-2 flex items-center justify-center font-mono text-xs text-paper-3 uppercase tracking-[0.2em]">
      Loading 3D viewer…
    </div>
  ),
});

export function ProjectDetail({ slug }: { slug: string }) {
  const { content } = useContent();
  const project = content.projects.find((p) => p.slug === slug);

  if (!project) {
    return (
      <section className="container-x py-32 text-center">
        <p className="field-label">No such project</p>
        <h1 className="font-display font-bold text-giant text-paper-0">Not found.</h1>
        <p className="mt-4 text-paper-2">
          The project <code className="font-mono">{slug}</code> doesn't exist — it may be a
          local draft that hasn't been exported yet.
        </p>
        <Link href="/projects/" className="btn-primary mt-8">← All projects</Link>
      </section>
    );
  }

  return (
    <article className="container-x py-10 max-w-4xl">
      <Link href="/projects/" className="font-mono text-xs uppercase tracking-[0.2em] text-paper-3 hover:text-accent">
        ← Back to projects
      </Link>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <span className="badge-kind text-paper-3">
          <span className="text-accent text-base leading-none">
            {project.kind === 'hardware' ? '⏣' : '⌘'}
          </span>
          {project.kind}
        </span>
        <span className="badge-kind text-paper-3">{project.year}</span>
        {project.status && (
          <span className="badge-kind text-accent-warm">● {project.status}</span>
        )}
      </div>

      <h1 className="mt-4 font-display font-bold text-giant text-paper-0 text-balance">
        {project.title}
      </h1>
      <p className="mt-6 text-2xl text-paper-1 text-pretty max-w-3xl">{project.tagline}</p>

      {project.tags.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2">
          {project.tags.map((t) => (
            <span key={t} className="tag">{t}</span>
          ))}
        </div>
      )}

      <div className="mt-10">
        <Cover
          src={project.cover}
          alt={project.title}
          slug={project.slug}
          aspect="aspect-[21/9]"
        />
      </div>

      {project.model3d && (
        <div className="mt-8">
          <p className="field-label">3D model · drag to rotate · scroll to zoom</p>
          <ModelViewer src={project.model3d} alt={`${project.title} 3D model`} />
        </div>
      )}

      <hr className="my-12" />

      <p className="text-xl text-paper-1 text-pretty leading-relaxed">{project.summary}</p>

      {project.body && (
        <div className="mt-10">
          <Prose text={project.body} />
        </div>
      )}

      {project.links && project.links.length > 0 && (
        <div className="mt-12 border-t border-paper-3/15 pt-8">
          <p className="field-label">Links</p>
          <ul className="flex flex-wrap gap-3">
            {project.links.map((l) => (
              <li key={l.url}>
                <a href={l.url} target="_blank" rel="noreferrer" className="btn-ghost">
                  {l.label} ↗
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}
