/**
 * Mirrors build/shared/ into <project>/src/shared/ and the prepared assets into
 * <project>/public/, so each Remotion project is a self-contained bundle root
 * while a single copy of the shared library stays authoritative.
 *
 * Both mirrors are gitignored. Everything they contain is regenerable: the
 * shared library from build/shared/, the assets from build/scripts/*.py.
 *
 * ORIENTATION-SCOPED CLIP COPY. The landscape project takes only the *-land
 * masters and the reels project only the *-port masters, so neither bundle
 * carries 16 clips it will never reference.
 */
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const BUILD = join(HERE, "..");

const project = process.argv[2];
if (project !== "longform" && project !== "reels") {
  console.error("usage: node scripts/sync.mjs <longform|reels>");
  process.exit(1);
}
const orientation = project === "longform" ? "land" : "port";

const root = join(BUILD, project);
const srcShared = join(root, "src", "shared");
const pub = join(root, "public");

rmSync(srcShared, { recursive: true, force: true });
cpSync(join(BUILD, "shared"), srcShared, { recursive: true });

for (const d of ["img", "video", "logo", "fonts"]) {
  const from = join(BUILD, "assets", d);
  if (!existsSync(from)) { console.error(`missing prepared assets: ${from}`); process.exit(1); }
  rmSync(join(pub, d), { recursive: true, force: true });
  cpSync(from, join(pub, d), { recursive: true });
}

/**
 * DELIVERABLE-SCOPED AUDIO. The 898-second bed is ~172 MB of PCM and the three
 * reel beds ~34 MB each; copying all four into both bundles wastes a quarter of
 * a gigabyte on files neither project can reference. Each bundle takes only the
 * beds its own compositions name, plus the shared Layer 2 sound set.
 */
const audioFrom = join(BUILD, "assets", "audio");
const audioTo = join(pub, "audio");
rmSync(audioTo, { recursive: true, force: true });
mkdirSync(audioTo, { recursive: true });
const beds = project === "longform"
  ? ["longform-music-bed.wav"]
  : ["reel1-music-bed.wav", "reel2-music-bed.wav", "reel3-music-bed.wav"];
for (const b of beds) {
  const from = join(audioFrom, b);
  if (!existsSync(from)) { console.error(`sync: missing music bed ${b}`); process.exit(1); }
  cpSync(from, join(audioTo, b));
}
cpSync(join(audioFrom, "sfx"), join(audioTo, "sfx"), { recursive: true });

const clipsFrom = join(BUILD, "assets", "clips");
const clipsTo = join(pub, "clips");
rmSync(clipsTo, { recursive: true, force: true });
mkdirSync(clipsTo, { recursive: true });
let n = 0;
for (const f of readdirSync(clipsFrom)) {
  if (!f.endsWith(`-${orientation}.mp4`)) continue;
  cpSync(join(clipsFrom, f), join(clipsTo, f));
  n++;
}
if (n !== 16) {
  console.error(`sync: expected 16 ${orientation} B-roll masters, found ${n}.`);
  process.exit(1);
}

console.log(`sync ${project}: shared/ mirrored, assets copied, ${n} ${orientation} clips.`);
