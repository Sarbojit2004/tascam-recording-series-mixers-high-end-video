/** Pre-render gate for the long-form: runtime, assets, facts, branding. */
import { BEATS } from "../longform/src/schedule.ts";
import { PLAN } from "../longform/src/brand-longform.ts";
import { totalFrames } from "../shared/beat.ts";
import { runAudit } from "./audit_brand.mjs";
import { IMAGES, VIDEOS, CLIP_COUNT } from "../shared/assets.ts";
import { UNITS, specValue } from "../shared/spec.ts";
import { FORBIDDEN } from "../shared/brand.ts";

let ok = true;
const fail = (m) => { console.error(`  FAIL ${m}`); ok = false; };

// 1. Runtime is exact.
const total = totalFrames(BEATS, 30);
console.log(`runtime: ${total} frames = ${total / 30}s (target 898s)`);
if (total !== 898 * 30) fail(`runtime is ${total / 30}s, not 898s`);

// 2. Every referenced asset exists.
const imgIds = new Set(IMAGES.map((i) => i.id));
const vidIds = new Set(VIDEOS.map((v) => v.id));
for (const b of BEATS) {
  for (const id of b.images ?? []) if (!imgIds.has(id)) fail(`${b.id}: no image "${id}"`);
  if (b.video && !vidIds.has(b.video)) fail(`${b.id}: no video "${b.video}"`);
  if (b.clip && (b.clip < 1 || b.clip > CLIP_COUNT)) fail(`${b.id}: clip ${b.clip} out of range`);
  for (const k of b.specKeys ?? []) {
    const units = b.units ?? (b.unit ? [b.unit] : []);
    for (const u of units) {
      try { specValue(u, k); } catch { fail(`${b.id}: ${u} has no verified "${k}"`); }
    }
  }
}

// 3. Nothing forbidden is typeset. Section 5 fact 5 and the pricing ban.
const text = BEATS.flatMap((b) => [b.hero, b.sub, b.label, ...(b.body ?? [])])
  .filter(Boolean).join(" ").toLowerCase();
for (const w of FORBIDDEN.pricing) {
  if (new RegExp(`\\b${w.replace(/[.$]/g, "\\$&")}`, "i").test(text)) fail(`pricing term "${w}" appears`);
}
for (const w of FORBIDDEN.competitors) {
  if (text.includes(w)) fail(`competitor "${w}" appears`);
}

// 4. Every unit is actually covered.
for (const u of Object.keys(UNITS)) {
  const n = BEATS.filter((b) => b.unit === u || b.units?.includes(u)).length;
  if (n < 3) fail(`${u} appears in only ${n} beat(s)`);
}

// 5. Branding cadence.
if (!runAudit("brand", BEATS, PLAN, total)) ok = false;

console.log(ok ? "AUDIT PASS" : "AUDIT FAIL");
process.exit(ok ? 0 : 1);
