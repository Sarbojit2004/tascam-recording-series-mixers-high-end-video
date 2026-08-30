/**
 * WHERE AND WHEN THE CONTACT STRIPS APPEAR — declared as data, then audited.
 *
 * THE TWO RULES THIS EXISTS TO KEEP. Contact details must be marketed
 * frequently, and they must never land on the content. Those pull against each
 * other: the easy way to be frequent is to pin a strip somewhere permanent, and
 * the easy way to avoid collisions is to show almost nothing. Declaring every
 * appearance here lets scripts/audit_contact.mjs compute the real absolute
 * timeline and fail the build on a gap that is too long, a slot that is used
 * too often, or a channel that never gets a turn.
 *
 * THE TWO CANVASES GET DIFFERENT TREATMENT, because they have different empty
 * space:
 *
 *   PORTRAIT (the reels) has 180 px above the content and 220 px below it,
 *   reserved as a caption-safe band and otherwise completely empty. Strips live
 *   there and nowhere else, so a collision with the content is not merely
 *   avoided but impossible — the bands are outside the content box by
 *   construction.
 *
 *   LANDSCAPE (the long-form) has no such band; its margin is 52 px, too thin
 *   to hold legible type. So each beat kind declares the corners its own layout
 *   actually leaves free, exactly as the logo placement used to, and strips go
 *   there.
 *
 * NOTHING IS PINNED. Consecutive strips never share a slot, slots are chosen
 * least-used-first so the whole set gets exercised, and every strip slides in
 * and out rather than cutting. That is the "constantly transitioning" the brief
 * asks for, enforced rather than intended.
 */
import type { Beat } from "./beat.ts";
import { CHANNELS, isWide, type ChannelKey } from "./brand.ts";
import { frames } from "./beat.ts";

/** Where a strip sits. Portrait uses the two bands; landscape the corners. */
export type Slot =
  | "band-top-left" | "band-top-center" | "band-top-right"
  | "band-bottom-left" | "band-bottom-center" | "band-bottom-right"
  | "tl" | "tc" | "tr" | "cl" | "cr" | "bl" | "bc" | "br";

export interface StripAppearance {
  beat: string;
  at: number;
  dur: number;
  channel: ChannelKey;
  slot: Slot;
}

/** The portrait bands. Every slot here is outside the content box. */
const PORTRAIT_SLOTS: Slot[] = [
  "band-top-left", "band-bottom-right", "band-top-center", "band-bottom-left",
  "band-top-right", "band-bottom-center",
];

/**
 * A wide strip (the three WhatsApp numbers) needs the full width of a band, so
 * it only ever takes a centred slot; left- and right-anchored slots would run
 * it off the frame.
 */
const PORTRAIT_WIDE: Slot[] = ["band-top-center", "band-bottom-center"];

/**
 * LANDSCAPE FREE CORNERS, per beat kind — what each layout genuinely leaves
 * open, established by rendering each kind and looking at it.
 */
const LANDSCAPE_SLOTS: Record<string, Slot[]> = {
  cold:      ["tr", "br", "cr", "bc"],
  statement: ["br", "tr", "bc", "cr"],
  editorial: ["tl", "br", "tr", "bl"],
  macro:     ["bl", "tl", "bc"],
  sweep:     ["tr", "tl"],
  hero:      ["tr", "cr"],
  montage:   ["tr", "cr"],
  specs:     ["bl", "bc"],
  compare:   ["tr", "br"],
  broll:     ["tr", "tl", "tc"],
  realvideo: ["bl", "br", "bc"],
  tripath:   ["br", "bl", "tr"],
  db25:      ["br", "bl", "tr"],
  timecode:  ["br", "bl", "tr"],
};

/** A wide strip needs a slot with room; the centre-anchored ones have it. */
const LANDSCAPE_WIDE: Slot[] = ["bc", "tc", "bl", "br", "tl", "tr"];

export interface ContactPlanOptions {
  portrait?: boolean;
  /** Strips per beat. Long beats carry two so the cadence stays up. */
  perBeat?: number;
  /** Where this deliverable enters the channel rotation. */
  channelFrom?: number;
}

export function buildContactPlan(
  beats: Beat[],
  { portrait = false, perBeat = 1, channelFrom = 0 }: ContactPlanOptions = {},
): StripAppearance[] {
  const plan: StripAppearance[] = [];
  const used = new Map<Slot, number>();
  let last: Slot | null = null;
  let ch = channelFrom;

  const pick = (kind: string, channel: ChannelKey): Slot => {
    const all = portrait
      ? (isWide(channel) ? PORTRAIT_WIDE : PORTRAIT_SLOTS)
      : (LANDSCAPE_SLOTS[kind] ?? ["tr", "br"]).filter(
          (s) => !isWide(channel) || LANDSCAPE_WIDE.includes(s));
    const pool = all.filter((s) => s !== last);
    const opts = pool.length ? pool : all;
    let best = opts[0];
    for (const s of opts) {
      if ((used.get(s) ?? 0) < (used.get(best) ?? 0)) best = s;
    }
    used.set(best, (used.get(best) ?? 0) + 1);
    last = best;
    return best;
  };

  for (const b of beats) {
    // The end screen composes its own contact block; a strip on top of it would
    // be the same information twice.
    if (b.kind === "outro") continue;

    const dur = frames(b.sec);
    // Two strips on a beat long enough to hold them without either feeling
    // rushed; one otherwise. A 9-second beat showing two channels reads as a
    // ticker, which is the opposite of deliberate.
    const n = b.sec >= 14 ? Math.max(perBeat, 2) : perBeat;

    for (let i = 0; i < n; i++) {
      const channel = CHANNELS[ch++ % CHANNELS.length];
      // Strips fill the beat between its own transitions, split evenly when
      // there are two, with a beat of clear air between them.
      const window = Math.floor((dur - 24) / n);
      const at = 12 + i * window;
      const hold = Math.max(46, window - 14);
      plan.push({ beat: b.id, at, dur: hold, channel, slot: pick(b.kind, channel) });
    }
  }

  return plan;
}

export interface ContactReport {
  strips: number;
  channels: ChannelKey[];
  maxGapSec: number;
  slots: number;
  consecutiveRepeats: number;
  slotOveruse: string[];
  perChannel: Record<string, number>;
}

/** Audits a finished plan. `starts` maps beat id -> absolute start frame. */
export function auditContact(
  plan: StripAppearance[],
  starts: Record<string, number>,
  total: number,
  fps = 30,
): ContactReport {
  const abs = plan
    .map((a) => ({ ...a, absAt: (starts[a.beat] ?? 0) + a.at }))
    .sort((x, y) => x.absAt - y.absAt);

  let maxGap = 0;
  let cursor = 0;
  for (const a of abs) {
    maxGap = Math.max(maxGap, a.absAt - cursor);
    cursor = Math.max(cursor, a.absAt + a.dur);
  }
  maxGap = Math.max(maxGap, total - cursor);

  const slotCount: Record<string, number> = {};
  let consecutiveRepeats = 0;
  abs.forEach((a, i) => {
    slotCount[a.slot] = (slotCount[a.slot] ?? 0) + 1;
    if (i > 0 && abs[i - 1].slot === a.slot) consecutiveRepeats++;
  });

  const cap = Math.max(3, Math.ceil(abs.length / 3));
  const slotOveruse = Object.entries(slotCount)
    .filter(([, c]) => c > cap)
    .map(([s, c]) => `slot "${s}" used ${c}x (cap ${cap})`);

  const perChannel: Record<string, number> = {};
  for (const a of abs) perChannel[a.channel] = (perChannel[a.channel] ?? 0) + 1;

  return {
    strips: abs.length,
    channels: [...new Set(abs.map((a) => a.channel))],
    maxGapSec: +(maxGap / fps).toFixed(1),
    slots: Object.keys(slotCount).length,
    consecutiveRepeats,
    slotOveruse,
    perChannel,
  };
}
