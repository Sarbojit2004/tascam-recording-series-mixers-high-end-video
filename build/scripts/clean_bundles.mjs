/**
 * Removes stale Remotion webpack bundles from /tmp.
 *
 * Every `remotion render` or `remotion still` whose sources have changed leaves
 * a bundle behind, and each one carries a full copy of the project's public/
 * directory — roughly half a gigabyte here, because the music beds and the
 * B-roll masters live there. Forty accumulated during this build and filled the
 * session's disk allowance mid-render, which is a failure that looks like a
 * broken renderer and is really just uncollected garbage.
 *
 * Keeps the newest `keep` bundles, so a render currently in flight is never
 * pulled out from under itself. Run it before a long render, not during one.
 *
 *   node scripts/clean_bundles.mjs [keep=2]
 */
import { readdirSync, statSync, rmSync } from "node:fs";
import { join } from "node:path";

const keep = Number(process.argv[2] ?? 2);
const dirs = readdirSync("/tmp")
  .filter((d) => d.startsWith("remotion-webpack-bundle-"))
  .map((d) => {
    const p = join("/tmp", d);
    return { p, mtime: statSync(p).mtimeMs };
  })
  .sort((a, b) => b.mtime - a.mtime);

let freed = 0;
for (const { p } of dirs.slice(keep)) {
  rmSync(p, { recursive: true, force: true });
  freed++;
}
console.log(`bundles: ${dirs.length} found, kept ${Math.min(keep, dirs.length)}, removed ${freed}`);
