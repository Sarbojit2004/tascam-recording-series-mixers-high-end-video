/** Pre-render gate for the three reels — same checks as the long-form. */
import { REELS } from "../reels/src/schedules.ts";
import { PLANS } from "../reels/src/plans.ts";
import { totalFrames } from "../shared/beat.ts";
import { runAudit } from "./audit_brand.mjs";
import { IMAGES, VIDEOS, CLIP_COUNT } from "../shared/assets.ts";
import { specValue } from "../shared/spec.ts";
import { FORBIDDEN } from "../shared/brand.ts";
import { SAFE } from "../shared/theme.ts";

let ok = true;
const imgIds = new Set(IMAGES.map((i) => i.id));
const vidIds = new Set(VIDEOS.map((v) => v.id));

for (const [id, beats] of Object.entries(REELS)) {
  const fail = (m) => { console.error(`  FAIL [${id}] ${m}`); ok = false; };
  const total = totalFrames(beats, 30);
  console.log(`${id}: ${total} frames = ${total / 30}s (target 178s)`);
  if (total !== 178 * 30) fail(`runtime is ${total / 30}s, not 178s`);

  for (const b of beats) {
    for (const i of b.images ?? []) if (!imgIds.has(i)) fail(`${b.id}: no image "${i}"`);
    if (b.video && !vidIds.has(b.video)) fail(`${b.id}: no video "${b.video}"`);
    if (b.clip && (b.clip < 1 || b.clip > CLIP_COUNT)) fail(`${b.id}: clip ${b.clip} out of range`);
    for (const k of b.specKeys ?? []) {
      for (const u of b.units ?? (b.unit ? [b.unit] : [])) {
        try { specValue(u, k); } catch { fail(`${b.id}: ${u} has no verified "${k}"`); }
      }
    }
    // A montage cell in portrait is one column; more than three rows makes each
    // cell shorter than the plate shadow it carries.
    if (b.kind === "montage" && (b.images?.length ?? 0) > 3) {
      fail(`${b.id}: ${b.images.length} montage images is too many for portrait`);
    }
  }

  const text = beats.flatMap((b) => [b.hero, b.sub, b.label, ...(b.body ?? [])])
    .filter(Boolean).join(" ").toLowerCase();
  for (const w of FORBIDDEN.pricing) {
    if (new RegExp(`\\b${w.replace(/[.$]/g, "\\$&")}`, "i").test(text)) fail(`pricing term "${w}"`);
  }
  for (const w of FORBIDDEN.competitors) if (text.includes(w)) fail(`competitor "${w}"`);

  if (!runAudit(`  ${id} brand`, beats, PLANS[id], total)) ok = false;
}

// The four deliverables must not repeat one another's opening.
const opens = Object.values(REELS).map((b) => b[0].hero);
if (new Set(opens).size !== opens.length) {
  console.error("  FAIL two reels open with the same headline");
  ok = false;
}

console.log(`caption-safe band: top ${SAFE.top}px / bottom ${SAFE.bottom}px`);
console.log(ok ? "AUDIT PASS" : "AUDIT FAIL");
process.exit(ok ? 0 : 1);
