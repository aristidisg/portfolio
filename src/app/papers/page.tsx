import { PapersList } from '@/components/PapersList';

export const metadata = { title: 'Papers' };

export default function PapersPage() {
  return (
    <section className="container-x py-10">
      <header className="mb-14">
        <p className="field-label">§ Papers</p>
        <h1 className="font-display font-bold text-mega text-paper-0 text-balance">
          What I've written<span className="text-accent">.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-xl text-paper-2 text-pretty">
          Papers, notes, and longer-form writing. Mostly about systems that have to talk to
          each other across hardware and software boundaries.
        </p>
      </header>
      <PapersList />
    </section>
  );
}
