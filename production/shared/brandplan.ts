/**
 * THE BRANDING ROTATION.
 *
 * Every beat carries the Shivansh mark, and every beat carries it somewhere
 * DIFFERENT. Alongside it a secondary payload rotates through the social
 * handles, the three contact numbers and the TASCAM mark, so that all four
 * marketed assets — logo, website, socials, numbers — are in constant
 * circulation without any two ever landing in the same place at the same time.
 *
 * The geometry that makes this safe: every scene draws its TYPE inside the
 * `Safe` container, which is inset by the caption-safe padding. The band
 * OUTSIDE that padding is therefore free of type by construction, on every
 * beat kind, in both orientations. The rail lives in that band, so it can move
 * freely without ever needing to know what the scene beneath it is doing.
 *
 * Imagery does pass under the rail on full-bleed beats. That is intended and
 * is exactly what the MOTU productions do — the logo carries its own opaque
 * white ground, so it stays legible over anything.
 */
import type { Beat, BeatKind } from "./beat.ts";

export type Band = "top" | "bottom";
export type Align = "left" | "center" | "right";
export interface Slot { band: Band; align: Align }
export type Payload = "socials" | "numbers" | "tascam";

export interface BrandPlan {
  /** Shivansh logo + website. Present on every beat except the outro. */
  mark: Slot | null;
  /** The secondary asset in rotation, always in the opposite band. */
  second: { payload: Payload; slot: Slot } | null;
}

/**
 * Which band a kind's type is anchored to. The rail takes the other one so the
 * mark never crowds a hero line, even though it could not overlap it.
 *
 *   "top"    type sits high  -> rail prefers the bottom band
 *   "bottom" type sits low   -> rail prefers the top band
 *   "any"    type is centred -> rail alternates freely
 */
const TYPE_ANCHOR: Record<BeatKind, Band | "any"> = {
  // hero type is anchored low, so the rail takes the top band
  macro: "bottom", sweep: "bottom", realvideo: "bottom",
  // the concept label sits top-left, so the rail takes the bottom band
  tripath: "top", db25: "top", timecode: "top",
  // type is centred, or is inset far enough from both edges to leave the rail
  // free either way — these alternate so the mark keeps crossing the frame
  cold: "any", repr: "any", statement: "any", unit: "any",
  specs: "any", montage: "any", schematic: "any",
  outro: "any",
};

const ALIGN_CYCLE: Align[] = ["right", "left", "center", "left", "right", "center"];
const other = (b: Band): Band => (b === "top" ? "bottom" : "top");

/**
 * Deterministic: the same schedule always yields the same plan, so the plan a
 * QA still is checked against is the plan that renders.
 */
export function planBrand(beats: Beat[]): BrandPlan[] {
  let secondTick = 0;
  // Counted over free beats only, not over the beat index: a schedule where the
  // constrained kinds happen to fall on one parity would otherwise pin every
  // free beat to a single band.
  let freeTick = 0;
  return beats.map((b, i) => {
    if (b.kind === "outro") return { mark: null, second: null };

    const anchor = TYPE_ANCHOR[b.kind];
    // Alternating base band keeps the mark visibly moving top/bottom; where the
    // kind anchors its type, the opposite band wins.
    const band: Band = anchor === "any" ? (freeTick++ % 2 === 0 ? "top" : "bottom") : other(anchor);
    const mark: Slot = { band, align: ALIGN_CYCLE[i % ALIGN_CYCLE.length] };

    // One secondary asset every third beat, in the opposite band. The three
    // payloads cycle, so socials, numbers and the TASCAM mark each land at
    // roughly one beat in nine — TASCAM markedly less often than Shivansh,
    // which is on every beat.
    // The Stage 6 motion graphics draw their own labelling across the top of
    // the frame and fill the width at the bottom, so they carry the Shivansh
    // mark alone. Suppressing the second payload here shifts it to the next
    // eligible beat rather than dropping it, so the overall rate is unchanged.
    const graphic = b.kind === "tripath" || b.kind === "db25" || b.kind === "timecode";

    let second: BrandPlan["second"] = null;
    if (i % 3 === 2 && !graphic) {
      const payload: Payload = (["socials", "numbers", "tascam"] as const)[secondTick % 3];
      secondTick++;
      second = {
        payload,
        // Opposite band, and biased to the opposite end so the two never read
        // as one cluster.
        slot: { band: other(band), align: mark.align === "right" ? "left" : "right" },
      };
    }
    return { mark, second };
  });
}

/** Coverage report used by the audit. */
export function planStats(plan: BrandPlan[]) {
  const slots = new Set<string>();
  let mark = 0, tascam = 0, socials = 0, numbers = 0, maxGap = 0, gap = 0;
  for (const p of plan) {
    if (p.mark) { mark++; slots.add(`${p.mark.band}/${p.mark.align}`); gap = 0; }
    else { gap++; maxGap = Math.max(maxGap, gap); }
    if (p.second?.payload === "tascam") tascam++;
    if (p.second?.payload === "socials") socials++;
    if (p.second?.payload === "numbers") numbers++;
  }
  // How often the mark actually changes place between consecutive beats.
  let moves = 0, pairs = 0;
  for (let i = 1; i < plan.length; i++) {
    const a = plan[i - 1].mark, b = plan[i].mark;
    if (!a || !b) continue;
    pairs++;
    if (a.band !== b.band || a.align !== b.align) moves++;
  }
  return { mark, tascam, socials, numbers, distinctSlots: slots.size, maxGap, moves, pairs };
}
