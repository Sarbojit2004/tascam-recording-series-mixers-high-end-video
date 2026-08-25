/**
 * Emits a deliverable's Layer 2 cue list from its own beat schedule, then
 * renders it to a single continuous WAV spanning the exact runtime.
 *
 * The rendered file is BOTH the standalone transition-SFX deliverable and the
 * audio the composition mounts, so the two can never disagree.
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { buildCues } from "../shared/sfxcues.ts";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const [, , which] = process.argv;

const MAP = {
  longform: { schedule: "longform/src/schedule.ts", out: "longform", sec: 898 },
  reel1: { schedule: "reels/src/schedule1.ts", out: "reel1", sec: 178 },
  reel2: { schedule: "reels/src/schedule2.ts", out: "reel2", sec: 178 },
  reel3: { schedule: "reels/src/schedule3.ts", out: "reel3", sec: 178 },
};
const cfg = MAP[which];
if (!cfg) throw new Error(`usage: make-sfx-timeline.mjs ${Object.keys(MAP).join("|")}`);

const { BEATS } = await import(resolve(ROOT, cfg.schedule));
const cues = buildCues(BEATS);

mkdirSync(resolve(ROOT, "assets/audio"), { recursive: true });
const cuePath = resolve(ROOT, `assets/audio/${cfg.out}-sfx-cues.json`);
writeFileSync(cuePath, JSON.stringify(cues, null, 1));

const outPath = resolve(ROOT, `assets/audio/${cfg.out}-sfx-timeline.wav`);
execFileSync(
  "python3",
  [resolve(ROOT, "scripts/render_sfx_timeline.py"), cuePath, outPath, String(cfg.sec)],
  { stdio: "inherit" },
);
