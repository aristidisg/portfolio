export type ProjectKind = 'hardware' | 'software';

export interface ProjectLink {
  label: string;
  url: string;
}

export interface Project {
  slug: string;
  title: string;
  kind: ProjectKind;
  year: string;
  tagline: string;
  summary: string;
  body?: string;
  tags: string[];
  links?: ProjectLink[];
  cover?: string;
  /** Path or URL to a 3D model file. Best format: .glb (binary glTF). */
  model3d?: string;
  status?: 'shipped' | 'wip' | 'archived' | 'concept';
  featured?: boolean;
}

export interface Paper {
  slug: string;
  title: string;
  year: string;
  venue?: string;
  authors: string[];
  abstract: string;
  body?: string;
  tags: string[];
  links?: ProjectLink[];
  pdf?: string;
  featured?: boolean;
}

export interface About {
  name: string;
  pronouns?: string;
  role: string;
  location?: string;
  bio: string;
  email?: string;
  socials: ProjectLink[];
  resume?: string;
}

export interface SiteConfig {
  title: string;
  description: string;
  tagline: string;
  baseUrl?: string;
}

export interface ContentBundle {
  site: SiteConfig;
  about: About;
  projects: Project[];
  papers: Paper[];
}
