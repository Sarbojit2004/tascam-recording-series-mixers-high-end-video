/**
 * THE BRANDING PLAN BUILDER — generates a plan, which is then audited.
 *
 * WHY GENERATED. Section 10 asks for three things at once: constant Shivansh
 * presence, genuinely varying position, and a TASCAM mark that appears
 * noticeably less often. Hand-placing sixty appearances across seventy-one
 * beats and keeping all three true is exactly the kind of bookkeeping that
 * drifts on the first schedule edit — and it would have to be done four times,
 * once per deliverable. So the plan is DERIVED from each schedule by this one
 * builder, and scripts/audit_brand.mjs re-derives the absolute timeline and
 * fails the build if any of the three requirements has slipped.
 *
 * ONE BUILDER, FOUR DELIVERABLES. The reels run 178 seconds against the
 * long-form's 898, so they need a tighter cadence to hold the same ceiling on
 * Shivansh absence; `everyBeat` switches that on rather than forking the logic.
 *
 * POSITION DISCIPLINE, BY CONSTRUCTION. Slots advance by a stride of 3 over the
 * eight NON-CENTRE slots. Three and eight are coprime, so the walk visits all
 * eight before repeating any — which makes two consecutive appearances in the
 * same slot arithmetically impossible, and holds every slot to n/8 of the
 * appearances, comfortably under the audit's n/3 cap. The centre slot is
 * excluded on purpose: a mark parked mid-frame would sit on the subject.
 *
 * TASCAM CADENCE (Section 10.3). One TASCAM mark for every fifth Shivansh
 * appearance, and never in the same beat as one — so the brand is present at
 * deliberate moments rather than riding the same recurring rhythm.
 */
import type { BrandAppearance, Pos } from "./brandplan.ts";
import { CONTACT_ROTATION } from "./brandplan.ts";
import { frames, type Beat } from "./beat.ts";

/**
 * WHERE A MARK MAY LAND, PER BEAT KIND.
 *
 * A stride walk over all eight slots varies position perfectly and collides
 * constantly: a hero beat lays three spec callouts along the bottom, and a
 * bare mark in "br" lands on the third one — which is exactly what the first
 * render did to the Model 12's USB figure. So each kind declares the slots its
 * own layout actually leaves free, and the walk chooses within that set.
 *
 * Variety survives: the sets differ per kind, the walk advances through each
 * set, and pickSlot() additionally refuses whatever slot the previous
 * appearance used, so two consecutive marks can never share one. The audit
 * still checks all of it independently.
 */
const SAFE_SLOTS: Record<string, Pos[]> = {
  // text left, vertically centred — the whole right side and the bottom is free
  cold:      ["tr", "br", "cr", "bc"],
  statement: ["br", "tr", "cr", "bc"],
  // centred copy over a held-back clip — only the corners are quiet
  editorial: ["tl", "br", "tr", "bl"],
  // landscape puts the photograph right, copy left of it; bottom-left is open
  macro:     ["bl", "tl", "bc", "tr"],
  // wide plate on top, copy and one callout along the bottom
  sweep:     ["tr", "tl", "cr", "cl"],
  // chip and name top-left, plate centre, three callouts along the bottom
  hero:      ["tr", "cr", "cl"],
  // title top-left, grid below it
  montage:   ["tr", "cr", "cl"],
  // landscape: plate left, spec list right — the space under the plate is free
  specs:     ["bl", "bc", "tr"],
  // title top-left, bars stacked beneath spanning the width
  compare:   ["tr", "br", "cr"],
  // full-bleed clip, headline in the bottom gradient
  broll:     ["tr", "tl", "tc", "cr"],
  // title top, video centred and letterbox-free
  realvideo: ["bl", "br", "bc", "tr"],
  // title top-left, diagram filling the rest
  // Landscape leaves the top-right and the sides free; portrait leaves only the
  // band ConceptFrame reserves at the foot. Listing bottom slots first means
  // the walk starts where BOTH orientations are safe.
  tripath:   ["br", "bl", "tr", "cr"],
  db25:      ["br", "bl", "tr", "cr"],
  timecode:  ["br", "bl", "tr", "cr"],
};

/**
 * Chooses a slot from the kind's free set: the LEAST-USED option so far that is
 * not the previous appearance's slot.
 *
 * A plain rotation is not enough on its own. Several kinds list "tr" — it is
 * the one slot almost every landscape layout leaves open — so a short
 * deliverable whose beats happen to be hero-heavy can pile five of twelve marks
 * there while never repeating consecutively. Least-used-first spreads the load
 * across whatever each schedule actually contains, which is what "constantly
 * change position" has to mean for a thirteen-beat reel as much as for a
 * seventy-one-beat long-form. The tie-break keeps the kind's own preference
 * order, so the first choice on any beat is still the best-looking one.
 */
function pickSlot(
  kind: string, used: Map<Pos, number>, last: Pos | null,
): Pos {
  const opts = SAFE_SLOTS[kind] ?? ["tr", "br", "tl", "bl"];
  const eligible = opts.filter((o) => o !== last);
  const pool = eligible.length ? eligible : opts;
  let best = pool[0];
  for (const o of pool) {
    if ((used.get(o) ?? 0) < (used.get(best) ?? 0)) best = o;
  }
  used.set(best, (used.get(best) ?? 0) + 1);
  return best;
}

/**
 * A lower-third occupies the full bottom band whatever its slot says, so it is
 * only ever used on beats whose bottom band is genuinely empty. Everywhere else
 * the presence is carried as a bare mark.
 */
const THIRD_OK = new Set(["cold", "statement", "editorial"]);

export interface PlanOptions {
  /** Reels are short: every beat carries a mark, not every other one. */
  everyBeat?: boolean;
  /** How many Shivansh appearances pass between TASCAM marks. */
  tascamEvery?: number;
  /**
   * Where this deliverable enters the contact rotation.
   *
   * A 178-second reel has room for only three or four lower-thirds, so any one
   * reel can surface only a slice of the contact set. Starting each reel at a
   * different point in the rotation means the three of them TOGETHER circulate
   * all of it — rather than all three showing the website and the first number.
   */
  contactFrom?: number;
}

export function buildPlan(
  BEATS: Beat[],
  { everyBeat = false, tascamEvery = 5, contactFrom = 0 }: PlanOptions = {},
): BrandAppearance[] {
  const plan: BrandAppearance[] = [];
  let sh = 0;             // Shivansh counter — drives the slot and contact walks
  let ta = 0;             // TASCAM counter
  // Each brand tracks its own previous slot: the audit walks the two sequences
  // separately, so a TASCAM mark repeating the last TASCAM slot is a repeat
  // even when a Shivansh mark sat between them.
  let last: Pos | null = null;
  let lastTa: Pos | null = null;
  // Per-brand slot usage, so each mark spreads across its own free slots.
  const shUsed = new Map<Pos, number>();
  const taUsed = new Map<Pos, number>();
  // Advanced only when an appearance actually CARRIES a contact detail. Keying
  // it to the Shivansh counter instead would skip most of the rotation, since
  // bare marks outnumber lower-thirds — and the point of the rotation is that
  // every channel and every number circulates, not just the first few.
  let contactIdx = contactFrom;

  BEATS.forEach((b, i) => {
    const dur = frames(b.sec);

    if (b.kind === "outro") {
      // The Outro component draws the Shivansh and TASCAM marks itself, but
      // the plan must still DECLARE them: the cadence audit measures presence
      // from this list, and an undeclared closing block reads to it as a
      // twenty-six-second gap. Form "outro" renders nothing extra.
      plan.push({ beat: b.id, at: 0, dur, brand: "shivansh", pos: "center",
                  form: "outro", size: 100 });
      plan.push({ beat: b.id, at: 10, dur: dur - 10, brand: "tascam",
                  pos: "cr", form: "outro", size: 48 });
      return;
    }
    if (b.kind === "brandbeat") {
      plan.push({
        beat: b.id, at: 10, dur: dur - 20, brand: "shivansh",
        pos: "center", form: "beat", size: 116,
        contact: CONTACT_ROTATION[contactIdx++ % CONTACT_ROTATION.length],
      });
      sh++;
      return;
    }

    // Shivansh on roughly every other beat. Beats run 8-19 s, so the widest
    // possible gap is two skipped beats' worth — well inside the 28 s ceiling
    // the audit enforces, and the audit is what actually proves it.
    const carries = everyBeat || i % 2 === 0 || b.sec >= 14;
    if (!carries) return;

    const pos = pickSlot(b.kind, shUsed, last);
    last = pos;
    // The FORM varies as well as the coordinates: every beat whose bottom band
    // is free carries a lower-third, everything else a bare mark. Gating that
    // further on a parity check thinned the thirds so far that most of the
    // contact rotation never got a turn — and circulating the whole contact
    // set is the reason the rotation exists.
    const form = THIRD_OK.has(b.kind) ? "third" : "mark";

    plan.push({
      beat: b.id,
      at: Math.round(dur * 0.14),
      dur: Math.round(dur * 0.62),
      brand: "shivansh",
      pos,
      form,
      size: form === "third" ? 44 : 52,
      ...(form === "third"
        ? { contact: CONTACT_ROTATION[contactIdx++ % CONTACT_ROTATION.length] }
        : {}),
    });

    // TASCAM: one per five Shivansh appearances, offset into the second half
    // of the beat so the two marks are never on screen together.
    if (sh % tascamEvery === tascamEvery - 1) {
      // Excludes BOTH the Shivansh slot in this beat and the previous TASCAM
      // slot, so the two marks never share a frame position and the TASCAM
      // sequence never repeats itself.
      const avail = (SAFE_SLOTS[b.kind] ?? ["tr", "br", "tl", "bl"])
        .filter((o) => o !== pos && o !== lastTa);
      const pool = avail.length ? avail
        : (SAFE_SLOTS[b.kind] ?? ["tr"]).filter((o) => o !== pos);
      let tp = pool[0];
      for (const o of pool) if ((taUsed.get(o) ?? 0) < (taUsed.get(tp) ?? 0)) tp = o;
      taUsed.set(tp, (taUsed.get(tp) ?? 0) + 1);
      lastTa = tp;
      plan.push({
        beat: b.id,
        at: Math.round(dur * 0.80),
        dur: Math.round(dur * 0.18),
        brand: "tascam",
        pos: tp,
        form: "mark",
        size: 34,
      });
      ta++;
    }
    sh++;
  });

  return plan;
}

