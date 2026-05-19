/**
 * Identifies the GitHub repository the editor commits to.
 *
 * Change these if you fork / rename the repo. The editor's "live mode" will
 * not work if these don't match the real repo (the PAT will return 404).
 */
export const REPO_CONFIG = {
  owner: 'aristidisg',
  repo: 'portfolio',
  branch: 'main',
  /** Map of "what to save" → path of the JSON file in the repo */
  paths: {
    site: 'content/site.json',
    about: 'content/about.json',
    projects: 'content/projects.json',
    papers: 'content/papers.json',
  } as const,
};

export type RepoFileKey = keyof typeof REPO_CONFIG.paths;
