import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="container-x py-32 text-center">
      <p className="field-label">Error 404</p>
      <h1 className="font-display font-bold text-mega text-paper-0">
        Lost<span className="text-accent">.</span>
      </h1>
      <p className="mt-6 text-xl text-paper-2 max-w-md mx-auto">
        That page doesn't exist — or it was a draft that hasn't been exported yet.
      </p>
      <div className="mt-10 flex justify-center gap-3">
        <Link href="/" className="btn-primary">← Home</Link>
        <Link href="/projects/" className="btn-ghost">All projects</Link>
      </div>
    </section>
  );
}
