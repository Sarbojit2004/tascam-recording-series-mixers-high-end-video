/**
 * CHECKPOINT 9 — voiceover sync, verified rather than asserted.
 *
 * Every timestamped cue in each script must land exactly on a beat boundary in
 * that deliverable's schedule, and every beat must be scored. A cue that starts
 * mid-beat, or a beat with no cue, is a sync error regardless of how the script
 * reads on the page.
 */
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const PROD = resolve(ROOT, "production");

const MAP = [
  ["VO_SCRIPT_TASCAM_LONGFORM_898S.md", "longform/src/schedule.ts", 898],
  ["VO_SCRIPT_TASCAM_REEL1_TRIPATH_SURVEY.md", "reels/src/schedule1.ts", 178],
  ["VO_SCRIPT_TASCAM_REEL2_FLAGSHIP_SPECIALIST.md", "reels/src/schedule2.ts", 178],
  ["VO_SCRIPT_TASCAM_REEL3_TRANSPARENT_BRIDGE.md", "reels/src/schedule3.ts", 178],
];

const secs = (t) => {
  const [m, s] = t.split(":").map(Number);
  return m * 60 + s;
};

let fail = 0;
for (const [md, sched, total] of MAP) {
  const { BEATS } = await import(resolve(PROD, sched));
  const starts = [];
  let t = 0;
  for (const b of BEATS) { starts.push(t); t += b.sec; }

  const src = readFileSync(resolve(ROOT, md), "utf8");
  const cues = [...src.matchAll(/\*\*\[(\d\d:\d\d)\s*[–-]\s*(\d\d:\d\d)\]/g)]
    .map((m) => [secs(m[1]), secs(m[2])]);

  const problems = [];
  for (const [a, b] of cues) {
    const i = starts.indexOf(a);
    if (i === -1) { problems.push(`cue at ${a}s is not a beat start`); continue; }
    const want = starts[i] + BEATS[i].sec;
    if (b !== want) problems.push(`cue ${a}-${b}s should end at ${want}s (beat "${BEATS[i].id}")`);
  }
  const unscored = starts.filter((s) => !cues.some(([a]) => a === s));

  const ok = problems.length === 0 && unscored.length === 0 && cues.length === BEATS.length && t === total;
  console.log(
    `${md.replace("VO_SCRIPT_TASCAM_", "").replace(".md", "").padEnd(30)} ` +
    `${String(cues.length).padStart(2)} cues / ${String(BEATS.length).padStart(2)} beats  ` +
    `${t}s  ${ok ? "SYNCED" : "PROBLEM"}`,
  );
  for (const p of problems.slice(0, 6)) console.log("     -", p);
  if (unscored.length) console.log(`     - ${unscored.length} beat(s) with no cue: ${unscored.slice(0, 6).join(", ")}s`);
  if (!ok) fail++;
}
process.exit(fail ? 1 : 0);
