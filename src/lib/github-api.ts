/**
 * Thin GitHub REST client for the Contents API.
 *
 * The editor only ever reads/writes files inside the `content/` directory.
 * Authentication is a fine-grained PAT scoped to this repo's `contents: write`.
 */

import { REPO_CONFIG } from './repo-config';

const API = 'https://api.github.com';

export interface GhFile<T = unknown> {
  data: T;
  sha: string;
}

export class GitHubApiError extends Error {
  status: number;
  body: string;
  constructor(status: number, body: string, message?: string) {
    super(message || `GitHub API error ${status}`);
    this.status = status;
    this.body = body;
  }
}

function headers(token: string) {
  return {
    Accept: 'application/vnd.github+json',
    Authorization: `Bearer ${token}`,
    'X-GitHub-Api-Version': '2022-11-28',
  };
}

function contentsUrl(path: string) {
  const { owner, repo } = REPO_CONFIG;
  return `${API}/repos/${owner}/${repo}/contents/${path}`;
}

/** Get a single file at the configured branch. Returns parsed JSON + sha. */
export async function getFile<T = unknown>(
  token: string,
  path: string,
): Promise<GhFile<T>> {
  const url = `${contentsUrl(path)}?ref=${REPO_CONFIG.branch}`;
  const res = await fetch(url, { headers: headers(token), cache: 'no-store' });
  const text = await res.text();
  if (!res.ok) throw new GitHubApiError(res.status, text);
  const json = JSON.parse(text) as { content: string; encoding: string; sha: string };
  if (json.encoding !== 'base64') {
    throw new GitHubApiError(500, text, 'Unexpected file encoding');
  }
  const decoded = decodeBase64(json.content.replace(/\n/g, ''));
  let data: T;
  try {
    data = JSON.parse(decoded) as T;
  } catch (err) {
    throw new GitHubApiError(500, decoded, `Could not parse JSON at ${path}: ${(err as Error).message}`);
  }
  return { data, sha: json.sha };
}

/**
 * Write a file. Requires the current sha (returned from getFile) to safely
 * overwrite — GitHub will reject with 409 if the sha is stale (someone else
 * committed in the meantime).
 */
export async function putFile<T>(
  token: string,
  path: string,
  data: T,
  sha: string,
  message: string,
): Promise<{ sha: string; commitSha: string }> {
  const body = {
    message,
    content: encodeBase64(JSON.stringify(data, null, 2) + '\n'),
    sha,
    branch: REPO_CONFIG.branch,
  };
  const res = await fetch(contentsUrl(path), {
    method: 'PUT',
    headers: { ...headers(token), 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  if (!res.ok) throw new GitHubApiError(res.status, text);
  const json = JSON.parse(text) as {
    content: { sha: string };
    commit: { sha: string };
  };
  return { sha: json.content.sha, commitSha: json.commit.sha };
}

/** Validate a token by hitting /user. Returns the GitHub login on success. */
export async function whoAmI(token: string): Promise<string> {
  const res = await fetch(`${API}/user`, { headers: headers(token) });
  if (!res.ok) {
    const text = await res.text();
    throw new GitHubApiError(res.status, text);
  }
  const json = (await res.json()) as { login: string };
  return json.login;
}

/** Check the latest workflow run for context (deploy in progress / done). */
export async function latestWorkflowRun(token: string): Promise<{
  status: string | null;
  conclusion: string | null;
  htmlUrl: string;
  headSha: string;
} | null> {
  const { owner, repo } = REPO_CONFIG;
  const res = await fetch(
    `${API}/repos/${owner}/${repo}/actions/runs?per_page=1&branch=${REPO_CONFIG.branch}`,
    { headers: headers(token) },
  );
  if (!res.ok) return null;
  const json = (await res.json()) as {
    workflow_runs: { status: string | null; conclusion: string | null; html_url: string; head_sha: string }[];
  };
  const run = json.workflow_runs[0];
  if (!run) return null;
  return {
    status: run.status,
    conclusion: run.conclusion,
    htmlUrl: run.html_url,
    headSha: run.head_sha,
  };
}

function decodeBase64(s: string): string {
  return new TextDecoder().decode(
    Uint8Array.from(atob(s), (c) => c.charCodeAt(0)),
  );
}

function encodeBase64(s: string): string {
  const bytes = new TextEncoder().encode(s);
  let bin = '';
  for (let i = 0; i < bytes.length; i += 1) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}
