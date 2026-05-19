import siteJson from '@content/site.json';
import aboutJson from '@content/about.json';
import projectsJson from '@content/projects.json';
import papersJson from '@content/papers.json';
import type { About, ContentBundle, Paper, Project, SiteConfig } from './types';

export const bakedContent: ContentBundle = {
  site: siteJson as SiteConfig,
  about: aboutJson as About,
  projects: projectsJson as Project[],
  papers: papersJson as Paper[],
};

export function getProjectBySlug(slug: string): Project | undefined {
  return bakedContent.projects.find((p) => p.slug === slug);
}

export function getPaperBySlug(slug: string): Paper | undefined {
  return bakedContent.papers.find((p) => p.slug === slug);
}

export function getAllProjectSlugs(): string[] {
  return bakedContent.projects.map((p) => p.slug);
}

export function getAllPaperSlugs(): string[] {
  return bakedContent.papers.map((p) => p.slug);
}
