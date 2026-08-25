/**
 * Copies the single source of truth (production/shared) plus the prepared
 * assets into a deliverable's own project tree.
 *
 * The two Remotion projects are deliberately self-contained rather than
 * importing across project roots: it keeps bundling trivially predictable and
 * lets each project ship as its own downloadable zip, while `shared/` remains
 * the only place any of this is actually edited.
 *
 * Only the assets a project actually uses are copied. The Gemini clips in
 * particular are partitioned by crop preset — the long-form takes the nine
 * landscape-cropped clips, the reels take the eight portrait-cropped ones —
 * which is the file-level expression of Section 0.3's hard no-reuse rule.
 */
import { cpSync, mkdirSync, readFileSync, rmSync, existsSync, writeFileSync, readdirSync } from "node:fs";
import { dirname, resolve, basename } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "..");
const target = process.argv[2];
if (!["longform", "reels"].includes(target)) throw new Error("usage: sync.mjs longform|reels");

const PUB = resolve(ROOT, target, "public");
const SRC = resolve(ROOT, target, "src", "shared");

rmSync(SRC, { recursive: true, force: true });
cpSync(resolve(ROOT, "shared"), SRC, { recursive: true });

const man = JSON.parse(readFileSync(resolve(ROOT, "assets/manifest.json"), "utf8"));
const crop = target === "longform" ? "land" : "port";

for (const d of ["img", "logo", "video", "clips", "audio", "fonts"]) mkdirSync(resolve(PUB, d), { recursive: true });

// Every real image and every real video reaches both projects: which of them a
// deliverable actually places is decided by its schedule, and the cross-set
// coverage audit is what proves all of them land somewhere.
for (const i of [...man.images, ...man.videos]) {
  cpSync(resolve(ROOT, "assets", i.path), resolve(PUB, i.path));
}
// Both logos are prepared by scripts/make_logos.py after the manifest is
// written, so copy the logo directory wholesale rather than by manifest entry.
for (const f of readdirSync(resolve(ROOT, "assets/logo"))) {
  cpSync(resolve(ROOT, "assets/logo", f), resolve(PUB, "logo", f));
}

// Clips are partitioned, not shared.
const clips = man.clips.filter((c) => c.crop === crop);
for (const c of clips) cpSync(resolve(ROOT, "assets", c.path), resolve(PUB, c.path));

// Audio: the music bed(s) and, once rendered, the SFX timeline(s) for this
// deliverable only.
const beds = target === "longform" ? ["longform"] : ["reel1", "reel2", "reel3"];
for (const b of beds) {
  for (const kind of ["music-bed", "sfx-timeline"]) {
    const f = `${b}-${kind}.wav`;
    const p = resolve(ROOT, "assets/audio", f);
    if (existsSync(p)) cpSync(p, resolve(PUB, "audio", f));
  }
}

for (const f of readdirSync(resolve(ROOT, "assets/fonts"))) {
  cpSync(resolve(ROOT, "assets/fonts", f), resolve(PUB, "fonts", f));
}

// Render-time tooling has to live inside the project so it resolves Remotion
// from that project's own node_modules — and so each deliverable ships as a
// self-contained zip.
const SCRIPTS = resolve(ROOT, target, "scripts");
mkdirSync(SCRIPTS, { recursive: true });
for (const f of readdirSync(resolve(ROOT, "scripts/render"))) {
  cpSync(resolve(ROOT, "scripts/render", f), resolve(SCRIPTS, f));
}

writeFileSync(
  resolve(SRC, "manifest.json"),
  JSON.stringify({ ...man, clips }, null, 1),
);

console.log(
  `${target}: ${man.images.length} images, ${man.videos.length} real videos, ` +
  `${clips.length} clips (${crop}), ${beds.length} bed(s) synced`,
);
