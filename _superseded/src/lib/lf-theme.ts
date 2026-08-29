// Design tokens for the 298-second TASCAM Model Series / Studio Bridge
// long-form video.
//
// FORMAT CONTRACT — landscape 1920x1080. Unlike the reel, there is NO
// Instagram-style top/bottom exclusion band and no reserved caption box (this
// project has neither platform-UI overlap risk nor a caption placeholder
// requirement — see Section 2 of the brief). The full frame is usable canvas.
// The only margin rule: critical text/callouts stay EDGE_PAD inboard of the
// true left/right edges so nothing risks clipping on a downstream re-encode.
//
// Palette, fonts and per-product accent colors are the reel's own — imported
// directly, not re-derived, for visual continuity within this project.

import {C, F} from './theme';

export const LF_FPS = 30;
export const LF_TOTAL_FRAMES = 8940; // 298.000s exactly
export const LF_CANVAS = {w: 1920, h: 1080};
export const EDGE_PAD = 56;

/** The box ordinary chapter content composes into. Full height is usable —
 *  there is no reserved band — this is just the horizontal text margin. */
export const LF_SAFE = {
  x: EDGE_PAD,
  y: 0,
  w: LF_CANVAS.w - EDGE_PAD * 2, // 1808
  h: LF_CANVAS.h,
} as const;

export {C, F};

export type LFAccent = 'm12' | 'm16' | 'm24' | 'm2400' | 'sb' | 'gold' | 'neutral';
export const lfAccentColor = (a: LFAccent): string => C[a];

/**
 * The chapter/scene table — single source of truth for timing. Durations
 * sum to exactly 8940. Chapter comments mark the ten acts from the confirmed
 * plan (scaled from the creative brief's Section 12 ratio to this project's
 * real 298s runtime, with two additional chapters — Workflows and Range
 * Together — the brief's own 180s breakdown did not need to budget for).
 */
export type LFSceneId =
  | 'CO1'
  | 'FO1'
  | 'M12_1' | 'M12_2' | 'M12_3' | 'M12_4' | 'M12_5'
  | 'M16_1' | 'M16_2' | 'M16_3' | 'M16_4' | 'M16_5'
  | 'M24_1' | 'M24_2' | 'M24_3' | 'M24_4' | 'M24_5' | 'M24_6'
  | 'M2400_1' | 'M2400_2' | 'M2400_3' | 'M2400_4' | 'M2400_5' | 'M2400_6' | 'M2400_7'
  | 'WF1' | 'WF2'
  | 'SB_1' | 'SB_2' | 'SB_3' | 'SB_4' | 'SB_5' | 'SB_6'
  | 'RT1'
  | 'PR1' | 'PR2' | 'PR3';

export const LF_SCENES: {id: LFSceneId; dur: number; accent: LFAccent}[] = [
  // Cold Open — 600f / 20s
  {id: 'CO1', dur: 600, accent: 'neutral'},

  // Family Overview — 540f / 18s
  {id: 'FO1', dur: 540, accent: 'neutral'},

  // Model 12 — 1080f / 36s (24 stills + 1 clip)
  {id: 'M12_1', dur: 150, accent: 'm12'}, // hero
  {id: 'M12_2', dur: 165, accent: 'm12'}, // clip motion
  {id: 'M12_3', dur: 420, accent: 'm12'}, // feature beat-cycle (4 beats)
  {id: 'M12_4', dur: 255, accent: 'm12'}, // gallery montage sweep
  {id: 'M12_5', dur: 90, accent: 'm12'},  // branding beat

  // Model 16 — 900f / 30s (16 stills + 1 clip)
  {id: 'M16_1', dur: 150, accent: 'm16'},
  {id: 'M16_2', dur: 165, accent: 'm16'},
  {id: 'M16_3', dur: 330, accent: 'm16'}, // 3 beats
  {id: 'M16_4', dur: 165, accent: 'm16'},
  {id: 'M16_5', dur: 90, accent: 'm16'},

  // Model 24 — 1080f / 36s (27 stills incl. case study + 1 clip)
  {id: 'M24_1', dur: 150, accent: 'm24'},
  {id: 'M24_2', dur: 180, accent: 'm24'}, // clip motion — longer fader-travel beat
  {id: 'M24_3', dur: 330, accent: 'm24'}, // 3 feature beats
  {id: 'M24_4', dur: 210, accent: 'm24'}, // gallery montage
  {id: 'M24_5', dur: 120, accent: 'm24'}, // case-study block
  {id: 'M24_6', dur: 90, accent: 'm24'},  // branding beat

  // Model 2400 — 1740f / 58s (17 stills + 1 clip) — flagship, largest share
  {id: 'M2400_1', dur: 165, accent: 'm2400'},
  {id: 'M2400_2', dur: 195, accent: 'm2400'}, // clip motion
  {id: 'M2400_3', dur: 480, accent: 'm2400'}, // 4 feature beats — master bus depth
  {id: 'M2400_4', dur: 270, accent: 'm2400'}, // routing/subgroup diagram beat
  {id: 'M2400_5', dur: 270, accent: 'm2400'}, // gallery montage
  {id: 'M2400_6', dur: 240, accent: 'm2400'}, // in-the-room / talkback beat
  {id: 'M2400_7', dur: 120, accent: 'm2400'}, // branding beat

  // Real-World Workflows — 600f / 20s
  {id: 'WF1', dur: 330, accent: 'neutral'},
  {id: 'WF2', dur: 270, accent: 'neutral'},

  // Studio Bridge — 1260f / 42s (21 stills, no clip) — musical/tonal pivot
  {id: 'SB_1', dur: 180, accent: 'sb'}, // the pivot, stated as subtraction
  {id: 'SB_2', dur: 240, accent: 'sb'}, // DB-25 fan-out diagram
  {id: 'SB_3', dur: 360, accent: 'sb'}, // 3 feature beats
  {id: 'SB_4', dur: 210, accent: 'sb'}, // system-diagram gallery
  {id: 'SB_5', dur: 180, accent: 'sb'}, // 6U rack context + remaining gallery
  {id: 'SB_6', dur: 90, accent: 'sb'},  // branding beat

  // Range Together — 420f / 14s
  {id: 'RT1', dur: 420, accent: 'neutral'},

  // Pricing + Outro — 720f / 24s
  {id: 'PR1', dur: 240, accent: 'gold'}, // five-price recap
  {id: 'PR2', dur: 300, accent: 'gold'}, // full contact/social outro wall
  {id: 'PR3', dur: 180, accent: 'gold'}, // closing card, both wordmarks
];

export const lfSceneStart = (id: LFSceneId): number => {
  let f = 0;
  for (const s of LF_SCENES) {
    if (s.id === id) return f;
    f += s.dur;
  }
  return f;
};

export const lfSceneDur = (id: LFSceneId): number =>
  LF_SCENES.find((s) => s.id === id)?.dur ?? 0;
