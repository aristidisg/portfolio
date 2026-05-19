'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useContent } from '../ContentProvider';
import { useAuth } from './AuthProvider';
import { getFile, putBinaryFile, putFile, GitHubApiError } from '@/lib/github-api';
import { REPO_CONFIG, type RepoFileKey } from '@/lib/repo-config';
import type { About, Paper, Project, SiteConfig } from '@/lib/types';

interface SyncState {
  /** When `true`, save() commits to GitHub; when `false`, save() only updates localStorage. */
  live: boolean;
  /** Currently saving — disable buttons, show spinner */
  saving: boolean;
  error: string | null;
  /** SHA of the last commit produced by this client (for the build-status indicator) */
  lastCommitSha: string | null;
  lastSavedAt: number | null;
  /** SHAs of each remote file we know about (needed for the next PUT) */
  shas: Partial<Record<RepoFileKey, string>>;
}

interface SyncContextValue extends SyncState {
  publishProjects: (next: Project[]) => Promise<void>;
  publishPapers: (next: Paper[]) => Promise<void>;
  publishAbout: (next: About) => Promise<void>;
  publishSite: (next: SiteConfig) => Promise<void>;
  refreshFromRepo: () => Promise<void>;
  /** Upload a file to `public/<destDir>/<name>` and return the public path (`/destDir/name`). */
  uploadAsset: (file: File, destDir: 'img' | 'models' | 'papers') => Promise<string>;
}

const SyncContext = createContext<SyncContextValue | null>(null);

const initial: SyncState = {
  live: false,
  saving: false,
  error: null,
  lastCommitSha: null,
  lastSavedAt: null,
  shas: {},
};

export function SyncProvider({ children }: { children: React.ReactNode }) {
  const { mode, token } = useAuth();
  const { updateProjects, updatePapers, updateAbout, updateSite, reset, content } =
    useContent();
  const [state, setState] = useState<SyncState>({ ...initial, live: mode === 'live' });
  const refreshing = useRef(false);

  useEffect(() => {
    setState((s) => ({ ...s, live: mode === 'live' }));
  }, [mode]);

  // On unlock (token becomes available) in live mode, pull fresh content.
  // This is what makes cross-device sync work — newest device wins on load.
  useEffect(() => {
    if (token && mode === 'live' && !refreshing.current) {
      void doRefresh();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, mode]);

  const doRefresh = useCallback(async () => {
    if (!token) return;
    refreshing.current = true;
    setState((s) => ({ ...s, saving: true, error: null }));
    try {
      const [site, about, projects, papers] = await Promise.all([
        getFile<SiteConfig>(token, REPO_CONFIG.paths.site),
        getFile<About>(token, REPO_CONFIG.paths.about),
        getFile<Project[]>(token, REPO_CONFIG.paths.projects),
        getFile<Paper[]>(token, REPO_CONFIG.paths.papers),
      ]);

      // Push the live data into ContentProvider as a patch so the UI reflects it.
      updateSite(site.data);
      updateAbout(about.data);
      updateProjects(projects.data);
      updatePapers(papers.data);

      setState((s) => ({
        ...s,
        saving: false,
        error: null,
        shas: {
          site: site.sha,
          about: about.sha,
          projects: projects.sha,
          papers: papers.sha,
        },
      }));
    } catch (e) {
      setState((s) => ({
        ...s,
        saving: false,
        error: errMsg(e, 'Could not load latest content from GitHub'),
      }));
    } finally {
      refreshing.current = false;
    }
  }, [token, updateSite, updateAbout, updateProjects, updatePapers]);

  /**
   * Commit a single file and update its sha in state.
   * Re-fetches and retries once on stale-sha (409) conflicts.
   */
  const commit = useCallback(
    async <T,>(key: RepoFileKey, data: T, summary: string) => {
      if (!token) throw new Error('Not authenticated');
      const path = REPO_CONFIG.paths[key];
      let sha = state.shas[key];
      if (!sha) {
        // We don't have a known sha yet — fetch it.
        const current = await getFile<T>(token, path);
        sha = current.sha;
      }
      try {
        const r = await putFile(token, path, data, sha, summary);
        return r;
      } catch (e) {
        if (e instanceof GitHubApiError && (e.status === 409 || e.status === 422)) {
          // Stale sha — fetch and retry once.
          const current = await getFile<T>(token, path);
          const r = await putFile(token, path, data, current.sha, summary);
          return r;
        }
        throw e;
      }
    },
    [token, state.shas],
  );

  const wrap = useCallback(
    async <T,>(
      key: RepoFileKey,
      next: T,
      updateLocal: (v: T) => void,
      describe: string,
    ) => {
      // Always update local first for immediate feedback
      updateLocal(next);
      if (mode !== 'live' || !token) return;
      setState((s) => ({ ...s, saving: true, error: null }));
      try {
        const r = await commit(key, next, `edit: ${describe}`);
        setState((s) => ({
          ...s,
          saving: false,
          error: null,
          lastCommitSha: r.commitSha,
          lastSavedAt: Date.now(),
          shas: { ...s.shas, [key]: r.sha },
        }));
      } catch (e) {
        setState((s) => ({
          ...s,
          saving: false,
          error: errMsg(e, `Save failed for ${key}`),
        }));
        // Don't re-throw: errors surface via the sync context's `error` field,
        // which the EditorBar reads. Callers (forms) don't need to try/catch.
      }
    },
    [mode, token, commit],
  );

  const publishProjects = useCallback(
    (next: Project[]) => wrap('projects', next, updateProjects, `${next.length} project${next.length === 1 ? '' : 's'}`),
    [wrap, updateProjects],
  );
  const publishPapers = useCallback(
    (next: Paper[]) => wrap('papers', next, updatePapers, `${next.length} paper${next.length === 1 ? '' : 's'}`),
    [wrap, updatePapers],
  );
  const publishAbout = useCallback(
    (next: About) => wrap('about', next, updateAbout, 'about'),
    [wrap, updateAbout],
  );
  const publishSite = useCallback(
    (next: SiteConfig) => wrap('site', next, updateSite, 'site config'),
    [wrap, updateSite],
  );

  const uploadAsset = useCallback(
    async (file: File, destDir: 'img' | 'models' | 'papers'): Promise<string> => {
      if (!token) throw new Error('Not signed in to GitHub.');
      if (mode !== 'live') throw new Error('Switch to Live mode to upload.');
      const safe = sanitizeFilename(file.name);
      const stamp = Date.now().toString(36);
      const filename = `${stamp}-${safe}`;
      const repoPath = `public/${destDir}/${filename}`;
      const publicPath = `/${destDir}/${filename}`;
      setState((s) => ({ ...s, saving: true, error: null }));
      try {
        const bytes = await file.arrayBuffer();
        const r = await putBinaryFile(token, repoPath, bytes, `upload: ${destDir}/${filename}`);
        setState((s) => ({
          ...s,
          saving: false,
          lastCommitSha: r.commitSha,
          lastSavedAt: Date.now(),
        }));
        return publicPath;
      } catch (e) {
        const msg = errMsg(e, `Upload failed for ${file.name}`);
        setState((s) => ({ ...s, saving: false, error: msg }));
        throw new Error(msg);
      }
    },
    [token, mode],
  );

  const value = useMemo<SyncContextValue>(
    () => ({
      ...state,
      publishProjects,
      publishPapers,
      publishAbout,
      publishSite,
      refreshFromRepo: doRefresh,
      uploadAsset,
    }),
    [state, publishProjects, publishPapers, publishAbout, publishSite, doRefresh, uploadAsset],
  );

  // After a successful refresh, the localStorage patch is no longer needed —
  // it's now identical to the remote. But we keep the values in the patch so
  // the UI keeps working when the user temporarily goes offline. Clearing on
  // demand is handled by the editor's "discard local" button.
  // (Intentionally unused: kept as a note.)
  void reset;
  void content;

  return <SyncContext.Provider value={value}>{children}</SyncContext.Provider>;
}

export function useSync() {
  const ctx = useContext(SyncContext);
  if (!ctx) throw new Error('useSync must be used within SyncProvider');
  return ctx;
}

function sanitizeFilename(name: string): string {
  const trimmed = name.replace(/[^a-zA-Z0-9._-]+/g, '-').replace(/^-+|-+$/g, '');
  return trimmed.toLowerCase() || 'file';
}

function errMsg(e: unknown, fallback: string): string {
  if (e instanceof GitHubApiError) {
    try {
      const parsed = JSON.parse(e.body) as { message?: string };
      if (parsed.message) return `${fallback}: ${parsed.message} (HTTP ${e.status})`;
    } catch {}
    return `${fallback}: HTTP ${e.status}`;
  }
  if (e instanceof Error) return `${fallback}: ${e.message}`;
  return fallback;
}
