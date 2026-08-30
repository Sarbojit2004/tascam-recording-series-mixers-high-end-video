/**
 * CONTACT MARKETING AUDIT — the rules that replaced the logo cadence.
 *
 * Four things must hold, and all four are easy to break by accident:
 *
 *  1. NO LOGO OUTSIDE AN END SCREEN. Checked structurally: the marks are only
 *     reachable through EndScreen, so a strip plan that somehow carried one
 *     would be a plan for a beat that is not an outro. Any such entry fails.
 *  2. CONTACT IS NEVER ABSENT FOR LONG. A viewer joining mid-way should not
 *     have to wait to learn how to get in touch.
 *  3. NOTHING IS PINNED. No two consecutive strips share a slot, and no slot
 *     takes more than a third of the appearances.
 *  4. EVERY CHANNEL CIRCULATES, including WhatsApp — which must always carry
 *     all three numbers, so the value string is checked for both separators.
 */
import { auditContact } from "../shared/contactplan.ts";
import { CHANNEL_VALUE, BRAND } from "../shared/brand.ts";

const MAX_GAP_SEC = 26;

export function runContactAudit(name, beats, plan, totalFrames, fps = 30) {
  const starts = {};
  let acc = 0;
  for (const b of beats) { starts[b.id] = acc; acc += Math.round(b.sec * fps); }

  const r = auditContact(plan, starts, totalFrames, fps);
  const errs = [];

  const outros = new Set(beats.filter((b) => b.kind === "outro").map((b) => b.id));
  for (const a of plan) {
    if (outros.has(a.beat)) errs.push(`strip on end screen "${a.beat}" duplicates its own block`);
    const b = beats.find((x) => x.id === a.beat);
    if (!b) errs.push(`strip references unknown beat "${a.beat}"`);
    else if (a.at + a.dur > Math.round(b.sec * fps)) {
      errs.push(`strip on "${a.beat}" outlives its beat`);
    }
  }
  if (!beats.some((b) => b.kind === "outro")) errs.push("no end screen");

  if (r.maxGapSec > MAX_GAP_SEC) {
    errs.push(`contact absent for ${r.maxGapSec}s (ceiling ${MAX_GAP_SEC}s)`);
  }
  if (r.consecutiveRepeats > 0) errs.push(`${r.consecutiveRepeats} consecutive same-slot repeat(s)`);
  if (r.slotOveruse.length) errs.push(...r.slotOveruse);
  if (r.slots < 4) errs.push(`only ${r.slots} slots used — not "constantly transitioning"`);
  if (r.channels.length < 5) {
    errs.push(`only ${r.channels.length}/5 channels circulate: ${r.channels.join(", ")}`);
  }

  // WhatsApp must always carry all three numbers on one line.
  const wa = CHANNEL_VALUE.whatsapp;
  for (const n of BRAND.phones) {
    if (!wa.includes(n)) errs.push(`WhatsApp line is missing ${n}`);
  }
  if ((wa.match(/,/g) ?? []).length !== 2) {
    errs.push(`WhatsApp line should join three numbers with two commas: "${wa}"`);
  }

  const per = Object.entries(r.perChannel).map(([k, v]) => `${k}:${v}`).join(" ");
  console.log(
    `${name}: strips=${r.strips} maxGap=${r.maxGapSec}s slots=${r.slots} ` +
    `repeats=${r.consecutiveRepeats} [${per}]`,
  );
  if (errs.length) { for (const e of errs) console.error(`  FAIL ${e}`); return false; }
  return true;
}
