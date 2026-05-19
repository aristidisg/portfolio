/**
 * Editor mode configuration.
 *
 * To unlock editor mode:
 *   1) Visit the site with the URL hash:   #unlock-<SECRET>
 *      e.g. https://your-site/  →  https://your-site/#unlock-letmein-2026
 *   2) Or press the keyboard shortcut:     Ctrl + Shift + E   (then type the secret)
 *
 * Once unlocked, the editor toolbar appears at the bottom of the screen.
 * The unlock state is stored in localStorage and persists across reloads
 * (until you click "Lock" in the toolbar, or clear browser storage).
 *
 * Change SECRET below to anything you want. Keep it private.
 *
 * NOTE: This is *obscurity*, not security. The secret is shipped in the
 * client bundle. Anyone determined enough can find it. It's meant to keep
 * the editor UI out of view for casual visitors, not to protect data.
 */
export const EDITOR_SECRET = 'dbtGI1x19GsOPNdb_H3xOpJ-';

export const STORAGE_KEY = 'portfolio.editor.v1';
export const UNLOCK_FLAG_KEY = 'portfolio.editor.unlocked.v1';
