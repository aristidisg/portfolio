import Link from 'next/link';
import type { Project } from '@/lib/types';

const statusColors: Record<NonNullable<Project['status']>, string> = {
  shipped: 'text-accent',
  wip: 'text-accent-warm',
  archived: 'text-paper-3',
  concept: 'text-accent-cool',
};

export function ProjectCard({
  project,
  index = 0,
  isDraft = false,
}: {
  project: Project;
  index?: number;
  isDraft?: boolean;
}) {
  const kindIcon = project.kind === 'hardware' ? '⏣' : '⌘';

  return (
    <Link
      href={`/projects/${project.slug}/`}
      className="group relative block border-t border-paper-3/15 py-6 transition-colors hover:border-paper-0"
    >
      <div className="grid grid-cols-12 gap-6 items-start">
        <div className="col-span-12 md:col-span-1">
          <span className="font-mono text-xs text-paper-3">
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>

        <div className="col-span-12 md:col-span-7">
          <div className="flex items-center gap-3 mb-2">
            <span className="badge-kind text-paper-3">
              <span className="text-accent text-base leading-none">{kindIcon}</span>
              {project.kind}
            </span>
            {project.status && (
              <span className={`badge-kind ${statusColors[project.status]}`}>
                ● {project.status}
              </span>
            )}
            {isDraft && (
              <span className="badge-kind text-accent-warm">
                ◌ draft (local)
              </span>
            )}
          </div>

          <h3 className="font-display font-semibold text-3xl md:text-4xl tracking-tight text-paper-0 leading-tight group-hover:text-accent transition-colors">
            {project.title}
          </h3>
          <p className="mt-2 text-paper-2 text-pretty max-w-xl">{project.tagline}</p>

          {project.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {project.tags.slice(0, 5).map((t) => (
                <span key={t} className="tag">
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="col-span-12 md:col-span-3 md:text-right">
          <span className="font-mono text-xs text-paper-3 uppercase tracking-[0.2em]">
            {project.year}
          </span>
        </div>

        <div className="col-span-12 md:col-span-1 md:text-right">
          <span className="inline-block font-mono text-paper-3 group-hover:text-accent group-hover:translate-x-1 transition-all">
            →
          </span>
        </div>
      </div>
    </Link>
  );
}
