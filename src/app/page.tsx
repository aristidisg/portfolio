import { Hero } from '@/components/Hero';
import { FeaturedProjects } from '@/components/FeaturedProjects';
import { FeaturedPapers } from '@/components/FeaturedPapers';

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedProjects />
      <FeaturedPapers />
    </>
  );
}
