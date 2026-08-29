// Asset registry and the compulsory-coverage manifest.
//
// Every product/context asset in this repository — 105 stills and 4 video
// clips, 109 in total — must appear somewhere in the finished reel. This file
// is the contract. `scripts/check_coverage.mjs` asserts that the union of
// PLACEMENTS equals exactly the set of files on disk, with no asset missing
// and no asset claimed twice, before any render is allowed to proceed.
//
// Two placement tiers, per the safe-zone rules in theme.ts:
//   primary — hero / grid / clip content inside the 250..1580 band, composed
//             to be individually legible.
//   ambient — soft, blurred or textural fill inside the 0..250 and 1580..1920
//             bands, where a device crop losing the detail costs nothing.
//
// A video clip counts as covered only when its motion actually plays. All four
// clips are placed in the primary tier as trimmed segments at native speed.

import {staticFile} from 'remotion';
import type {SceneId} from './theme';

export const imgSrc = (id: string): string => staticFile(`img/${id}.jpg`);
export const clipSrc = (id: string): string => staticFile(`video/${id}.mp4`);

/**
 * The four source clips. Native 1600x500 @ 23.976fps, so each is placed as a
 * wide letterbox band with a blurred background extension filling the card —
 * never cropped into the subject to force a portrait fit.
 *
 * `trimBefore`/`durationInFrames` are in composition frames (30fps). Segments
 * were chosen by inspecting extracted frames: each one is a stretch where the
 * footage genuinely moves. Playback is 1x — the "fast forward" is achieved by
 * cutting away, never by speeding the footage up.
 */
export const CLIPS = {
  'm12-clip': {
    trimBefore: 228, // 7.60s — camera glides down the fader bank, light ground
    dur: 75, //         2.50s
    note: 'fader-bank glide',
  },
  'm16-clip': {
    trimBefore: 186, // 6.20s — engineer's hand working the desk mid-rehearsal
    dur: 70, //         2.33s
    note: 'hand on the desk',
  },
  'm24-clip': {
    trimBefore: 288, // 9.60s — hands across the lit console, LEDs burning
    dur: 75, //         2.50s
    note: 'hands across a lit console',
  },
  'm2400-clip': {
    trimBefore: 72, //  2.40s — hand travelling the flagship surface
    dur: 80, //         2.67s
    note: 'hand on the flagship surface',
  },
} as const;

export type ClipId = keyof typeof CLIPS;

export type Placement = {primary: string[]; ambient: string[]};

/**
 * Scene-by-scene asset ledger. Read this as the answer to "where does every
 * file appear?" — it is both the render's data source and the audit trail.
 */
export const PLACEMENTS: Record<SceneId, Placement> = {
  // ---- ACT 0 · the philosophy hook -------------------------------------
  // A ten-cut strobe of hands, faders and knob fields — every product's most
  // tactile frame, before any of them is named.
  S01: {
    primary: [
      'm12-10', 'm16-09', 'm24-15', 'm24-16', 'm2400-11',
      'sb-09', 'm24-12', 'm16-08', 'm2400-13', 'm24-02',
    ],
    ambient: ['m12-11', 'm12-12'],
  },
  // The range as an ascending ladder: five hero renders, smallest to largest,
  // then the one that deliberately breaks the pattern.
  S02: {
    primary: ['m12-06', 'm16-03', 'm24-08', 'm2400-08', 'sb-03'],
    ambient: ['m12-13', 'm16-01', 'm24-17', 'm2400-14', 'sb-13'],
  },

  // ---- ACT 1 · Model 12 · the compact desktop hybrid --------------------
  S03: {primary: ['m12-07', 'm12-00'], ambient: ['m12-01', 'm12-23']},
  S04: {primary: ['m12-clip'], ambient: ['m12-18', 'm12-22']},
  S05: {
    primary: ['m12-04', 'm12-19', 'm12-16', 'm12-21', 'm12-03', 'm12-05'],
    ambient: ['m12-17', 'm12-08'],
  },
  S06: {primary: ['m12-09', 'm12-14', 'm12-15', 'm12-20'], ambient: ['m12-02']},

  // ---- ACT 2 · Model 16 · the live ensemble tracker ---------------------
  S07: {primary: ['m16-04', 'm16-00'], ambient: ['m16-02', 'm16-06']},
  S08: {primary: ['m16-clip'], ambient: ['m16-07', 'm16-10']},
  S09: {primary: ['m16-11', 'm16-13', 'm16-14', 'm16-15'], ambient: ['m16-12']},
  S10: {primary: ['m16-05'], ambient: []},

  // ---- ACT 3 · Model 24 · the large-format console ----------------------
  S11: {primary: ['m24-06', 'm24-11'], ambient: ['m24-04', 'm24-05']},
  S12: {primary: ['m24-clip'], ambient: ['m24-01', 'm24-03']},
  S13: {
    primary: ['m24-10', 'm24-07', 'm24-09', 'm24-21'],
    ambient: ['m24-13', 'm24-14'],
  },
  S14: {
    primary: ['m24cs-01', 'm24cs-02', 'm24cs-03', 'm24cs-04', 'm24cs-xx', 'm24-18'],
    ambient: ['m24-19', 'm24-20'],
  },

  // ---- ACT 4 · Model 2400 · the flagship --------------------------------
  S15: {primary: ['m2400-07', 'm2400-06'], ambient: ['m2400-01', 'm2400-02']},
  S16: {primary: ['m2400-clip'], ambient: ['m2400-05', 'm2400-xx']},
  S17: {
    primary: ['m2400-09', 'm2400-10', 'm2400-04', 'm2400-03'],
    ambient: ['m2400-16'],
  },
  S18: {primary: ['m2400-12', 'm2400-15'], ambient: []},

  // ---- ACT 5 · Studio Bridge · the controller-less engine ---------------
  S19: {primary: ['sb-06', 'sb-01'], ambient: ['sb-05', 'sb-07']},
  S20: {primary: ['sb-04', 'sb-14', 'sb-12', 'sb-02'], ambient: ['sb-08', 'sb-15']},
  S21: {
    primary: ['sb-18', 'sb-19', 'sb-20', 'sb-21', 'sb-16', 'sb-17', 'sb-11'],
    ambient: ['sb-10'],
  },

  // ---- ACT 6 · the range together, pricing, CTA -------------------------
  S22: {primary: ['vs-xx'], ambient: []},
  S23: {primary: [], ambient: []},
  S24: {primary: [], ambient: []},
};

/** Flattened views used by the coverage checker and the SFX cue builder. */
export const allPrimary = (): string[] =>
  Object.values(PLACEMENTS).flatMap((p) => p.primary);

export const allAmbient = (): string[] =>
  Object.values(PLACEMENTS).flatMap((p) => p.ambient);

export const isClip = (id: string): id is ClipId => id in CLIPS;
