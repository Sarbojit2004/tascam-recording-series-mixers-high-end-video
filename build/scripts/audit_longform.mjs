/** Pre-render gate for the three long-form parts. */
import { PARTS, BEATS } from "../longform/src/schedule.ts";
import { PLANS } from "../longform/src/plans.ts";
import { totalFrames } from "../shared/beat.ts";
import { runContactAudit } from "./audit_contact.mjs";
import { IMAGES, VIDEOS, CLIP_COUNT } from "../shared/assets.ts";
import { UNITS, specValue } from "../shared/spec.ts";
import { FORBIDDEN } from "../shared/brand.ts";

let ok = true;
const fail = (m) => { console.error(`  FAIL ${m}`); ok = false; };

// 1. Each part is its declared length, and the three still sum to 898 s.
const EXPECT = { part1: 300, part2: 299, part3: 299 };
let series = 0;
for (const [k, beats] of Object.entries(PARTS)) {
  const n = totalFrames(beats, 30);
  series += n;
  console.log(`${k}: ${n} frames = ${n / 30}s (target ${EXPECT[k]}s)`);
  if (n !== EXPECT[k] * 30) fail(`${k} is ${n / 30}s, not ${EXPECT[k]}s`);
  if (beats[beats.length - 1].kind !== "outro") fail(`${k} does not end with an end screen`);
}
console.log(`series: ${series / 30}s (target 898s)`);
if (series !== 898 * 30) fail(`series is ${series / 30}s, not 898s`);

// 2. Assets and figures resolve.
const imgIds = new Set(IMAGES.map((i) => i.id));
const vidIds = new Set(VIDEOS.map((v) => v.id));
for (const b of BEATS) {
  for (const id of b.images ?? []) if (!imgIds.has(id)) fail(`${b.id}: no image "${id}"`);
  if (b.video && !vidIds.has(b.video)) fail(`${b.id}: no video "${b.video}"`);
  if (b.clip && (b.clip < 1 || b.clip > CLIP_COUNT)) fail(`${b.id}: clip ${b.clip} out of range`);
  for (const k of b.specKeys ?? []) {
    for (const u of b.units ?? (b.unit ? [b.unit] : [])) {
      try { specValue(u, k); } catch { fail(`${b.id}: ${u} has no verified "${k}"`); }
    }
  }
}

// 3. Nothing forbidden is typeset.
const text = BEATS.flatMap((b) => [b.hero, b.sub, b.label, ...(b.body ?? [])])
  .filter(Boolean).join(" ").toLowerCase();
for (const w of FORBIDDEN.pricing) {
  if (new RegExp(`\\b${w.replace(/[.$]/g, "\\$&")}`, "i").test(text)) fail(`pricing term "${w}" appears`);
}
for (const w of FORBIDDEN.competitors) if (text.includes(w)) fail(`competitor "${w}" appears`);

// 4. Every unit is covered.
for (const u of Object.keys(UNITS)) {
  const n = BEATS.filter((b) => b.unit === u || b.units?.includes(u)).length;
  if (n < 3) fail(`${u} appears in only ${n} beat(s)`);
}

// 5. Contact marketing, per part.
for (const [k, beats] of Object.entries(PARTS)) {
  if (!runContactAudit(`  ${k} contact`, beats, PLANS[k], totalFrames(beats, 30))) ok = false;
}

console.log(ok ? "AUDIT PASS" : "AUDIT FAIL");
process.exit(ok ? 0 : 1);
