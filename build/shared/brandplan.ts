/**
 * THE BRANDING PLAN — declared as data, so it can be audited.
 *
 * ARCHITECTURE PULLED FROM the MOTU M-Series build's `src/lib/lf-brand-plan.ts`
 * (Section 1 / Section 10). That build solved the same problem this one has:
 * three requirements that are easy to satisfy by accident and easy to break by
 * accident. Declaring every appearance here — rather than scattering logo
 * placements through dozens of scene files — lets scripts/branding_cadence.mjs
 * compute the real absolute timeline and FAIL the build on a gap, a missing
 * chapter, or a mark that never moves. The scenes render FROM this list, so the
 * audit and the picture cannot drift apart.
 *
 * The three requirements, per Section 10:
 *
 *   1. Shivansh presence is CONSTANT — no stretch longer than ~28 s passes
 *      without it, across the whole runtime.
 *   2. Position genuinely VARIES — neither mark may sit pinned in one slot.
 *      No two consecutive appearances of the same mark share a slot, and no
 *      mark uses one slot more than a third of its appearances.
 *   3. TASCAM appears NOTICEABLY LESS OFTEN than Shivansh (Section 10.3) —
 *      deliberate moments, not the same recurring cadence.
 *
 * `form` records how the presence is carried, because Section 10.2 asks the
 * form to vary too, not just the coordinates:
 *   mark    a bare logo placed in the frame
 *   third   a lower-third carrying a rotating contact detail
 *   beat    a dedicated full branding moment between segments
 *   outro   the closing block
 */
import type { ContactKey } from "./brand.ts";

export type BrandKey = "shivansh" | "tascam";

export type Pos =
  | "tl" | "tc" | "tr"
  | "cl" | "center" | "cr"
  | "bl" | "bc" | "br";

export type BrandForm = "mark" | "third" | "beat" | "outro";

export interface BrandAppearance {
  /** Beat id this appearance lives in. */
  beat: string;
  /** Local frame inside that beat where the mark starts appearing. */
  at: number;
  /** How long it stays, in frames. */
  dur: number;
  brand: BrandKey;
  pos: Pos;
  form: BrandForm;
  /** Rotating contact detail — for `third` / `beat` / `outro` forms. */
  contact?: ContactKey;
  /** Logo height in px. */
  size?: number;
}

export const ALL_POS: Pos[] = ["tl", "tc", "tr", "cl", "center", "cr", "bl", "bc", "br"];

/** The rotation the plan builder walks so every contact detail circulates. */
export const CONTACT_ROTATION: ContactKey[] = [
  "website", "instagram", "website", "phone0",
  "website", "youtube", "website", "phone1",
  "website", "facebook", "website", "phone2",
];

export interface CadenceReport {
  shivansh: number;
  tascam: number;
  maxGapSec: number;
  shivanshSlots: number;
  tascamSlots: number;
  consecutiveRepeats: number;
  slotOveruse: string[];
  contactsUsed: ContactKey[];
}

/**
 * Audits a finished plan against Section 10. `starts` maps beat id -> absolute
 * start frame; `total` is the deliverable's frame count.
 */
export function auditCadence(
  plan: BrandAppearance[],
  starts: Record<string, number>,
  total: number,
  fps = 30,
): CadenceReport {
  const abs = plan
    .map((a) => ({ ...a, absAt: (starts[a.beat] ?? 0) + a.at }))
    .sort((x, y) => x.absAt - y.absAt);

  // Largest stretch with no Shivansh mark on screen.
  const sh = abs.filter((a) => a.brand === "shivansh");
  let maxGap = 0;
  let cursor = 0;
  for (const a of sh) {
    maxGap = Math.max(maxGap, a.absAt - cursor);
    cursor = Math.max(cursor, a.absAt + a.dur);
  }
  maxGap = Math.max(maxGap, total - cursor);

  // POSITION DISCIPLINE, PER MARK — measured over PLACED forms only.
  //
  // Section 10.2 is about marks that sit pinned in one slot. The "beat" and
  // "outro" forms are full-frame composed moments whose mark is centred by
  // layout, not by a placement choice — so counting them here would report a
  // brand beat running into the closing block as a mark that "failed to move",
  // which is the opposite of what happened. They still count as PRESENCE for
  // the gap check above; they just are not placements.
  const placed = abs.filter((a) => a.form === "mark" || a.form === "third");
  const slotCount: Record<BrandKey, Record<string, number>> = {
    shivansh: {}, tascam: {},
  };
  let consecutiveRepeats = 0;
  for (const key of ["shivansh", "tascam"] as BrandKey[]) {
    const seq = placed.filter((a) => a.brand === key);
    seq.forEach((a, i) => {
      slotCount[key][a.pos] = (slotCount[key][a.pos] ?? 0) + 1;
      if (i > 0 && seq[i - 1].pos === a.pos) consecutiveRepeats++;
    });
  }
  const slotOveruse: string[] = [];
  for (const key of ["shivansh", "tascam"] as BrandKey[]) {
    const n = placed.filter((a) => a.brand === key).length;
    const cap = Math.max(2, Math.ceil(n / 3));
    for (const [pos, c] of Object.entries(slotCount[key])) {
      if (c > cap) slotOveruse.push(`${key} uses "${pos}" ${c}x (cap ${cap})`);
    }
  }

  return {
    shivansh: sh.length,
    tascam: abs.filter((a) => a.brand === "tascam").length,
    maxGapSec: +(maxGap / fps).toFixed(1),
    shivanshSlots: Object.keys(slotCount.shivansh).length,
    tascamSlots: Object.keys(slotCount.tascam).length,
    consecutiveRepeats,
    slotOveruse,
    contactsUsed: [...new Set(abs.map((a) => a.contact).filter(Boolean))] as ContactKey[],
  };
}
