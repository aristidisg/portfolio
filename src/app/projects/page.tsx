import { ProjectsList } from '@/components/ProjectsList';

export const metadata = { title: 'Projects' };

export default function ProjectsPage() {
  return (
    <section className="container-x py-10">
      <header className="mb-14">
        <p className="field-label">§ Projects</p>
        <h1 className="font-display font-bold text-mega text-paper-0 text-balance">
          What I've built<span className="text-accent">.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-xl text-paper-2 text-pretty">
          Things I made, in hardware and software. Some shipped, some are works in progress,
          some are abandoned but worth showing for what they taught me.
        </p>
      </header>
      <ProjectsList />
    </section>
  );
}
