'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { About, ContentBundle, Paper, Project, SiteConfig } from '@/lib/types';
import { STORAGE_KEY } from '@/lib/editor-config';

type ContentPatch = Partial<{
  site: SiteConfig;
  about: About;
  projects: Project[];
  papers: Paper[];
}>;

interface ContentContextValue {
  content: ContentBundle;
  baked: ContentBundle;
  patch: ContentPatch;
  hasOverrides: boolean;
  setPatch: (next: ContentPatch) => void;
  updateProjects: (next: Project[]) => void;
  updatePapers: (next: Paper[]) => void;
  updateAbout: (next: About) => void;
  updateSite: (next: SiteConfig) => void;
  reset: () => void;
}

const ContentContext = createContext<ContentContextValue | null>(null);

function mergeContent(baked: ContentBundle, patch: ContentPatch): ContentBundle {
  return {
    site: patch.site ?? baked.site,
    about: patch.about ?? baked.about,
    projects: patch.projects ?? baked.projects,
    papers: patch.papers ?? baked.papers,
  };
}

export function ContentProvider({
  initial,
  children,
}: {
  initial: ContentBundle;
  children: React.ReactNode;
}) {
  const [patch, setPatchState] = useState<ContentPatch>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as ContentPatch;
        if (parsed && typeof parsed === 'object') setPatchState(parsed);
      }
    } catch {
      // ignore corrupt storage
    }
    setHydrated(true);
  }, []);

  const persist = useCallback((next: ContentPatch) => {
    setPatchState(next);
    try {
      if (Object.keys(next).length === 0) {
        window.localStorage.removeItem(STORAGE_KEY);
      } else {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      }
    } catch {
      // storage full / private mode — silently ignore
    }
  }, []);

  const setPatch = useCallback(
    (next: ContentPatch) => persist({ ...patch, ...next }),
    [patch, persist],
  );

  const updateProjects = useCallback(
    (next: Project[]) => persist({ ...patch, projects: next }),
    [patch, persist],
  );
  const updatePapers = useCallback(
    (next: Paper[]) => persist({ ...patch, papers: next }),
    [patch, persist],
  );
  const updateAbout = useCallback(
    (next: About) => persist({ ...patch, about: next }),
    [patch, persist],
  );
  const updateSite = useCallback(
    (next: SiteConfig) => persist({ ...patch, site: next }),
    [patch, persist],
  );

  const reset = useCallback(() => persist({}), [persist]);

  const value = useMemo<ContentContextValue>(() => {
    // Until hydration, render baked content so server and client match.
    const merged = hydrated ? mergeContent(initial, patch) : initial;
    return {
      content: merged,
      baked: initial,
      patch,
      hasOverrides: hydrated && Object.keys(patch).length > 0,
      setPatch,
      updateProjects,
      updatePapers,
      updateAbout,
      updateSite,
      reset,
    };
  }, [hydrated, initial, patch, setPatch, updateProjects, updatePapers, updateAbout, updateSite, reset]);

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error('useContent must be used within ContentProvider');
  return ctx;
}
