/**
 * CHECKPOINT 5 — render a still from every beat before moving on.
 *
 * Two frames per beat: one at 55% (mid-beat, everything revealed) and, for the
 * beats that carry a camera move, the LAST frame — which is where the
 * whole-unit rule is actually decided. MacroReveal and ConnectorSweep both
 * scale above 1.0 during the move, so the only thing that matters is that they
 * have RESOLVED to <= 1.0 by the cut, leaving the complete unit on screen.
 */
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import { existsSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const PROJ = resolve(HERE, "..");           // the deliverable project
const ROOT = resolve(PROJ, "..");            // production/
const [, , target] = process.argv;

const CFG = {
  longform: { comp: "LongFormSilent", schedule: "src/schedule.ts" },
  reel1: { comp: "Reel1Silent", schedule: "src/schedule1.ts" },
  reel2: { comp: "Reel2Silent", schedule: "src/schedule2.ts" },
  reel3: { comp: "Reel3Silent", schedule: "src/schedule3.ts" },
}[target];
if (!CFG) throw new Error("usage: qa-stills.mjs longform|reel1|reel2|reel3");

const { BEATS } = await import(resolve(PROJ, CFG.schedule));
const { starts, frames } = await import(resolve(PROJ, "src/shared/beat.ts"));
const AT = starts(BEATS, 30);

const OUT = resolve(PROJ, `out/qa/${target}`);
mkdirSync(OUT, { recursive: true });

const CHROME = [
  "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell",
  "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
].find(existsSync);

console.log("bundling…");
const serveUrl = await bundle({ entryPoint: resolve(PROJ, "src/index.ts"), onProgress: () => {} });
const composition = await selectComposition({
  serveUrl, id: CFG.comp, inputProps: {}, browserExecutable: CHROME,
});

const MOVES = new Set(["macro", "sweep"]);
let n = 0;
for (let i = 0; i < BEATS.length; i++) {
  const b = BEATS[i];
  const d = frames(b.sec, 30);
  const shots = [["mid", AT[i] + Math.round(d * 0.55)]];
  // One frame before the beat's fade-out begins: the last frame at which the
  // resolved image is actually visible. Sampling d-1 lands inside the cross-fade
  // and would show a near-black frame regardless of whether the move resolved.
  if (MOVES.has(b.kind)) shots.push(["resolve", AT[i] + d - 14]);
  for (const [tag, frame] of shots) {
    const file = resolve(OUT, `${String(i).padStart(2, "0")}-${b.id}-${tag}.png`);
    await renderStill({ composition, serveUrl, output: file, frame, browserExecutable: CHROME, imageFormat: "png" });
    n++;
  }
  process.stdout.write(`\r${i + 1}/${BEATS.length} beats  (${n} stills)   `);
}
console.log(`\ndone -> ${OUT}`);
