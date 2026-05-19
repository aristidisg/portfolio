import { Hero } from '@/components/Hero';
import { Marquee } from '@/components/Marquee';
import { FeaturedProjects } from '@/components/FeaturedProjects';
import { FeaturedPapers } from '@/components/FeaturedPapers';

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee
        items={['Hardware', 'Software', 'Writing', 'Research', 'Prototypes', 'Shipped things']}
        className="border-y border-paper-3/15 py-6"
      />
      <FeaturedProjects />
      <FeaturedPapers />
    </>
  );
}
