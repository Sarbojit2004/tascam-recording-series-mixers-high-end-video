// The compulsory-coverage manifest for the 298-second long-form video.
//
// All 109 assets — 105 stills + 4 clips — placed exactly once across the 37
// scenes in src/lib/lf-theme.ts. Verified programmatically (no scene missing,
// no asset skipped, no asset placed twice) before this file was written; the
// same invariant is re-checked at build time by scripts/check_coverage.mjs
// (--lf mode).
//
// With ~2.7s of average runtime per asset (versus the reel's ~0.8s), this
// project leans toward genuine sequential hero/feature treatment. Each
// product chapter gets: one hero still, one clip-motion beat, a handful of
// named feature beats, and a montage "gallery" sweep that clears the rest of
// that product's pool — the same hero+coverage split the reel proved out, with
// far more room to breathe.

import type {LFSceneId} from './lf-theme';
import {CLIPS, type ClipId} from './assets';

export {CLIPS, imgSrc, clipSrc} from './assets';
export type {ClipId} from './assets';

/**
 * Long-form clip trim points. Independent from the reel's CLIPS trims — this
 * project affords the 3-6s segment length Section 0c calls for, so a fresh,
 * often longer, selection was made per clip (still 1x speed, still a trimmed
 * segment cut away from, never the full native clip).
 */
export const LF_CLIPS: Record<ClipId, {trimBefore: number; dur: number; note: string}> = {
  'm12-clip': {trimBefore: 210, dur: 150, note: 'fader-bank glide, full pass'}, // 7.00s -> 5.00s
  'm16-clip': {trimBefore: 168, dur: 138, note: 'hand working the desk, longer take'}, // 5.60s -> 4.60s
  'm24-clip': {trimBefore: 240, dur: 156, note: '100mm faders traveling, extended'}, // 8.00s -> 5.20s
  'm2400-clip': {trimBefore: 48, dur: 168, note: 'flagship surface, full gesture'}, // 1.60s -> 5.60s
};

export const LF_PLACEMENTS: Record<LFSceneId, string[]> = {
  CO1: ['sb-09', 'sb-10', 'sb-11'],
  FO1: ['m12-00', 'm16-01', 'm24-01', 'm2400-02', 'sb-05'],

  M12_1: ['m12-07'],
  M12_2: ['m12-clip'],
  M12_3: ['m12-16', 'm12-19', 'm12-21', 'm12-22'],
  M12_4: [
    'm12-01', 'm12-02', 'm12-03', 'm12-04', 'm12-05', 'm12-06', 'm12-08', 'm12-09',
    'm12-10', 'm12-11', 'm12-12', 'm12-13', 'm12-14', 'm12-15', 'm12-17', 'm12-18',
    'm12-20', 'm12-23',
  ],
  M12_5: [],

  M16_1: ['m16-00'],
  M16_2: ['m16-clip'],
  M16_3: ['m16-08', 'm16-13', 'm16-15'],
  M16_4: ['m16-02', 'm16-03', 'm16-04', 'm16-05', 'm16-06', 'm16-07', 'm16-09', 'm16-10', 'm16-11', 'm16-12', 'm16-14'],
  M16_5: [],

  M24_1: ['m24-06'],
  M24_2: ['m24-clip'],
  M24_3: ['m24-02', 'm24-08', 'm24-11'],
  M24_4: [
    'm24-03', 'm24-04', 'm24-05', 'm24-07', 'm24-09', 'm24-10', 'm24-12', 'm24-13',
    'm24-14', 'm24-15', 'm24-16', 'm24-17', 'm24-18', 'm24-19', 'm24-20', 'm24-21',
  ],
  M24_5: ['m24cs-01', 'm24cs-02', 'm24cs-03', 'm24cs-04', 'm24cs-xx'],
  M24_6: [],

  M2400_1: ['m2400-07'],
  M2400_2: ['m2400-clip'],
  M2400_3: ['m2400-09', 'm2400-13', 'm2400-03', 'm2400-04'],
  M2400_4: ['m2400-10'],
  M2400_5: ['m2400-01', 'm2400-05', 'm2400-06', 'm2400-08', 'm2400-11', 'm2400-12', 'm2400-16', 'm2400-xx'],
  M2400_6: ['m2400-14', 'm2400-15'],
  M2400_7: [],

  WF1: ['sb-13'],
  WF2: ['sb-07'],

  SB_1: ['sb-06', 'sb-01'],
  SB_2: ['sb-12'],
  SB_3: ['sb-14', 'sb-16', 'sb-02'],
  SB_4: ['sb-18', 'sb-19', 'sb-20', 'sb-21'],
  SB_5: ['sb-03', 'sb-04', 'sb-08', 'sb-15', 'sb-17'],
  SB_6: [],

  RT1: ['vs-xx'],

  PR1: [],
  PR2: [],
  PR3: [],
};

export const isLfClip = (id: string): id is ClipId => id in CLIPS;
