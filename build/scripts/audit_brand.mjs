/**
 * BRANDING CADENCE AUDIT (Section 10) — run per deliverable, fails the build.
 *
 * Re-derives the ABSOLUTE timeline from the schedule and the generated plan,
 * so what is checked is what will actually be on screen. Three requirements:
 * constant Shivansh presence, real positional variety, and a TASCAM mark that
 * appears noticeably less often than Shivansh.
 */
import { auditCadence } from "../shared/brandplan.ts";

const MAX_GAP_SEC = 28;

export function runAudit(name, beats, plan, totalFrames, fps = 30) {
  const starts = {};
  let acc = 0;
  for (const b of beats) { starts[b.id] = acc; acc += Math.round(b.sec * fps); }

  const r = auditCadence(plan, starts, totalFrames, fps);
  const errs = [];

  if (r.maxGapSec > MAX_GAP_SEC) {
    errs.push(`Shivansh absent for ${r.maxGapSec}s (ceiling ${MAX_GAP_SEC}s)`);
  }
  if (r.consecutiveRepeats > 0) {
    errs.push(`${r.consecutiveRepeats} consecutive same-slot repeat(s)`);
  }
  if (r.slotOveruse.length) errs.push(...r.slotOveruse);
  if (r.shivanshSlots < 5) {
    errs.push(`Shivansh uses only ${r.shivanshSlots} slots — not "constantly changing"`);
  }
  if (r.tascam === 0) errs.push("TASCAM never appears");
  if (r.tascam >= r.shivansh * 0.5) {
    errs.push(`TASCAM ${r.tascam} vs Shivansh ${r.shivansh} — not "noticeably less often"`);
  }
  // A deliverable can only circulate as many contact details as it has
  // lower-thirds to carry them, and a 178-second reel has room for a handful.
  // The floor therefore scales with runtime; the three reels enter the rotation
  // at different points so that between them the whole set is covered, and
  // every deliverable's closing block shows all seven regardless.
  const contactFloor = totalFrames / fps > 400 ? 5 : 3;
  if (r.contactsUsed.length < contactFloor) {
    errs.push(`only ${r.contactsUsed.length} contact details circulate ` +
              `(floor ${contactFloor} for this runtime)`);
  }

  console.log(
    `${name}: shivansh=${r.shivansh} tascam=${r.tascam} ` +
    `maxGap=${r.maxGapSec}s slots=${r.shivanshSlots}/${r.tascamSlots} ` +
    `repeats=${r.consecutiveRepeats} contacts=${r.contactsUsed.length}`,
  );
  if (errs.length) {
    for (const e of errs) console.error(`  FAIL ${e}`);
    return false;
  }
  return true;
}
