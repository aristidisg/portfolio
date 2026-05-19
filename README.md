# Portfolio

A creative portfolio for hardware, software, and writing. Built with Next.js 15 +
Tailwind, deployed as a fully static site to GitHub Pages. Includes a hidden in-browser
editor for adding and editing projects without touching the codebase.

## Quick start

```bash
npm install
npm run dev          # http://localhost:3000
```

Build a production export:

```bash
npm run build        # writes to ./out
```

## Project layout

```
content/             # source of truth for site data
  site.json          # site title, tagline
  about.json         # name, bio, social links
  projects.json      # all projects (hardware + software)
  papers.json        # papers / writing
src/
  app/               # Next.js app router pages
  components/        # UI components
  components/editor/ # in-browser editor mode
  lib/               # types, content loader, editor config
public/              # static assets (favicon, images, PDFs)
.github/workflows/   # GitHub Pages deploy
```

To replace the placeholder content, edit the JSON files in `content/`. Or use editor
mode (below) and click "Export" when you're done — it'll hand you back updated JSON
files to commit.

### Adding images and PDFs

Put image files and paper PDFs in `public/`. They'll be served from the root:

```
public/papers/my-paper.pdf  →  reference as  /papers/my-paper.pdf
public/img/cover.jpg        →  reference as  /img/cover.jpg
```

In project/paper entries, the `cover`, `pdf`, and link `url` fields all accept either
a relative path like `/papers/foo.pdf` (recommended for assets in `public/`) or a full
external URL.

## Editor mode

You can add and edit content directly in the browser, without rebuilding. Edits live
in your browser's localStorage and are immediately visible — they persist across page
loads on that browser.

### How to unlock

Two ways:

1. **URL hash** — visit the site with this hash on any page:

   ```
   https://your-site/#unlock-letmein-2026
   ```

   The hash is stripped from the URL after unlock; an "editor" bar appears at the
   bottom of the screen.

2. **Keyboard** — press `Ctrl + Shift + E` (or `Cmd + Shift + E` on Mac). A prompt
   appears asking for the secret. Type it, hit enter.

Once unlocked, the unlock state is stored in localStorage and persists until you
click "Lock" in the editor bar.

### Change the secret

The default secret is `letmein-2026`. **Change it immediately** by editing one line:

```ts
// src/lib/editor-config.ts
export const EDITOR_SECRET = 'your-new-secret-here';
```

⚠ **This is obscurity, not security.** The secret is shipped in the client JS bundle.
Anyone willing to dig through it can find it. The unlock gate exists to keep the
editor UI out of view for casual visitors — *not* to protect data, since there is no
server-side data to protect: edits live only in *your* browser until you export them.

### Publishing edits

Edits in editor mode are local to your browser. To make them part of the deployed
site (and for new projects/papers to have real detail pages):

1. Open the editor → **Export** tab
2. Click **Download all** (or download each JSON individually)
3. Replace the corresponding files in `content/` and commit
4. Push to `main` — GitHub Actions rebuilds and deploys
5. After deploy, click **Discard** in the editor to clear local overrides

The export tab shows the exact paths each file should go to.

## Deploying to GitHub Pages

The repo includes a workflow at `.github/workflows/deploy.yml` that builds and
deploys on every push to `main`.

### One-time setup

1. Push the repo to GitHub.
2. In the repo's **Settings → Pages**, set **Source** to **GitHub Actions**.
3. (Optional) **Settings → Environments → github-pages** — verify the environment exists.
4. Push to `main`. The workflow will run and deploy.

### Base path

The workflow uses `actions/configure-pages@v5` to detect whether you're deploying to:

- A **user/org page** (`https://<user>.github.io/`) → base path is `""`
- A **project page** (`https://<user>.github.io/<repo>/`) → base path is `"/<repo>"`

`next.config.mjs` reads `NEXT_PUBLIC_BASE_PATH` and applies it as both `basePath` and
`assetPrefix`. You don't need to set anything manually.

### Custom domain

If you use a custom domain via `CNAME` in the repo settings, the base path is `""`
and you don't need to change anything. Put a `CNAME` file in `public/` with your
domain on a single line.

## Customization

### Colors and type

Design tokens live in [`tailwind.config.ts`](tailwind.config.ts) under `theme.extend`:

- `colors.ink.*` — the dark backgrounds
- `colors.paper.*` — text on dark
- `colors.accent` — chartreuse `#d4ff3a`
- `colors.accent.warm` — coral `#ff6b4a`
- `colors.accent.cool` — cyan `#7df9ff`

Fonts come from Google Fonts (Space Grotesk for display, Inter for body, JetBrains
Mono for accents). Swap them in `src/app/layout.tsx` and `tailwind.config.ts`.

### Adding a new section

The site is built around two collections: projects and papers. To add a third (e.g.
"talks" or "labs"):

1. Add a new JSON file in `content/`
2. Add a type to `src/lib/types.ts`
3. Add a loader in `src/lib/content.ts`
4. Create a list page and detail page mirroring the projects/papers structure
5. Add a nav link in `src/components/Nav.tsx`
6. Add an editor tab in `src/components/editor/EditorDrawer.tsx`

## Notes

- The site is fully static. No server, no API. Everything is JSON in the repo.
- Editor mode persists to `localStorage` only. There's no sync between browsers.
- The `not-found.tsx` page handles unknown URLs (including drafts that haven't been
  exported yet).
- Animations respect `prefers-reduced-motion`.
