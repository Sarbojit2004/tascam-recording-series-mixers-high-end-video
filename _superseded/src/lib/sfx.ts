import {staticFile} from 'remotion';
import {SceneId, SCENES, sceneStart} from './theme';

// Every sound in this reel is synthesised from scratch by scripts/gen_audio.py
// — no sampled library, no hosted generation service. Three layers run:
//
//   1. ambient-bed  a continuous sub-audible drone + room texture, present in
//                   every one of the 2640 frames.
//   2. music-bed    the six-zone arc from the brief's Section 10.
//   3. cues         a distinct transition sound on every visual cut, plus
//                   mechanical accents timed to what the footage is doing.
//
// Levels are deliberately forward. Final balancing happens in post, so the
// mix errs toward the effects being clearly present rather than buried.

export type SfxName =
  | 'whoosh-air' | 'whoosh-low' | 'whoosh-rev' | 'whoosh-soft' | 'whoosh-bright'
  | 'whoosh-metal' | 'whoosh-swoop'
  | 'impact-deep' | 'impact-mid' | 'impact-light' | 'impact-hollow'
  | 'tick' | 'tick-double' | 'click-ui' | 'click-soft' | 'click-deep'
  | 'riser' | 'riser-short' | 'riser-long' | 'sub-drop'
  | 'shimmer' | 'shimmer-bright' | 'glitch' | 'swell' | 'swell-dark'
  | 'transition-blip' | 'chime-final' | 'chime-soft'
  // TASCAM mechanical accents — cued to hardware motion, not to a generic cut
  | 'fader-slide' | 'knob-detent' | 'relay-click' | 'meter-ripple'
  | 'sd-insert' | 'db25-lock' | 'transport-arm';

export const sfxFile = (n: SfxName): string => staticFile(`audio/sfx/${n}.mp3`);

export type Cue = {at: number; n: SfxName; v: number};

const at = (s: SceneId, off = 0) => sceneStart(s) + off;

/**
 * Per-scene entry schedules, mirroring the stagger the visuals actually use.
 * Keeping them here means a cut and its sound cannot drift apart.
 */
const ENTRIES: {s: SceneId; delay: number; per: number; n: number; kind: 'strobe' | 'grid'}[] = [
  {s: 'S01', delay: 0, per: 15, n: 10, kind: 'strobe'},
  {s: 'S02', delay: 16, per: 12, n: 5, kind: 'grid'},
  {s: 'S05', delay: 6, per: 4, n: 6, kind: 'grid'},
  {s: 'S06', delay: 6, per: 4, n: 4, kind: 'grid'},
  {s: 'S09', delay: 6, per: 5, n: 4, kind: 'grid'},
  {s: 'S13', delay: 6, per: 5, n: 4, kind: 'grid'},
  {s: 'S14', delay: 6, per: 4, n: 6, kind: 'grid'},
  {s: 'S17', delay: 6, per: 5, n: 4, kind: 'grid'},
  {s: 'S20', delay: 6, per: 5, n: 4, kind: 'grid'},
  {s: 'S21', delay: 6, per: 4, n: 4, kind: 'grid'},
  {s: 'S21', delay: 26, per: 5, n: 3, kind: 'grid'},
  {s: 'S23', delay: 12, per: 8, n: 5, kind: 'grid'},
  {s: 'S24', delay: 10, per: 6, n: 3, kind: 'grid'},
];

/** Scene-opening gesture. Never the same whoosh twice in a row. */
const OPENERS: Partial<Record<SceneId, {n: SfxName; v: number; pre?: {n: SfxName; v: number; lead: number}}>> = {
  S01: {n: 'impact-deep', v: 0.85},
  S02: {n: 'whoosh-air', v: 0.72, pre: {n: 'riser-short', v: 0.5, lead: 14}},
  S03: {n: 'impact-mid', v: 0.78, pre: {n: 'riser-short', v: 0.52, lead: 12}},
  S04: {n: 'whoosh-metal', v: 0.66},
  S05: {n: 'whoosh-low', v: 0.70},
  S06: {n: 'whoosh-rev', v: 0.66},
  S07: {n: 'impact-mid', v: 0.78, pre: {n: 'riser-short', v: 0.52, lead: 12}},
  S08: {n: 'whoosh-swoop', v: 0.64},
  S09: {n: 'whoosh-air', v: 0.68},
  S10: {n: 'whoosh-bright', v: 0.64},
  S11: {n: 'impact-hollow', v: 0.80, pre: {n: 'riser', v: 0.52, lead: 18}},
  S12: {n: 'whoosh-metal', v: 0.66},
  S13: {n: 'whoosh-low', v: 0.70},
  S14: {n: 'whoosh-soft', v: 0.62},
  S15: {n: 'impact-deep', v: 0.86, pre: {n: 'riser-long', v: 0.55, lead: 30}},
  S16: {n: 'whoosh-swoop', v: 0.66},
  S17: {n: 'whoosh-air', v: 0.70},
  S18: {n: 'whoosh-low', v: 0.68},
  // The Studio Bridge pivot: the bed strips back, so the cut lands on a
  // sub-drop and a glitch rather than another whoosh.
  S19: {n: 'sub-drop', v: 0.82, pre: {n: 'glitch', v: 0.60, lead: 6}},
  S20: {n: 'whoosh-bright', v: 0.66},
  S21: {n: 'whoosh-rev', v: 0.64},
  S22: {n: 'impact-mid', v: 0.78, pre: {n: 'riser-short', v: 0.52, lead: 12}},
  S23: {n: 'impact-deep', v: 0.84, pre: {n: 'riser', v: 0.56, lead: 20}},
  S24: {n: 'whoosh-air', v: 0.70},
};

const build = (): Cue[] => {
  const c: Cue[] = [];

  for (const s of SCENES) {
    const o = OPENERS[s.id];
    if (!o) continue;
    if (o.pre) c.push({at: at(s.id, -o.pre.lead), n: o.pre.n, v: o.pre.v});
    c.push({at: at(s.id), n: o.n, v: o.v});
  }

  // A distinct sound on every asset entry, rotating so a fast montage never
  // hits the same click twice running.
  const strobePalette: SfxName[] = ['tick', 'click-ui', 'relay-click', 'tick-double', 'click-deep'];
  const gridPalette: SfxName[] = ['click-ui', 'tick', 'click-soft', 'transition-blip', 'click-deep', 'tick-double'];

  for (const e of ENTRIES) {
    const pal = e.kind === 'strobe' ? strobePalette : gridPalette;
    for (let i = 0; i < e.n; i++) {
      c.push({
        at: at(e.s, e.delay + i * e.per),
        n: pal[i % pal.length],
        v: e.kind === 'strobe' ? 0.62 : 0.5,
      });
    }
  }

  // --- mechanical accents, timed to what the hardware is doing on screen ---
  // S04 · Model 12 clip: the camera glides the fader bank, then the SD engine.
  c.push({at: at('S04', 10), n: 'fader-slide', v: 0.78});
  c.push({at: at('S04', 44), n: 'sd-insert', v: 0.66});
  c.push({at: at('S04', 62), n: 'meter-ripple', v: 0.55});

  // S05 · the HUI/MCU transport arms at frame 30 in the visual.
  c.push({at: at('S05', 30), n: 'transport-arm', v: 0.82});
  c.push({at: at('S05', 92), n: 'meter-ripple', v: 0.58});

  // S06 · the signal-flow line draws from frame 16.
  c.push({at: at('S06', 16), n: 'swell', v: 0.55});
  c.push({at: at('S06', 58), n: 'shimmer', v: 0.60});

  // S08 · Model 16 clip: a hand working the desk.
  c.push({at: at('S08', 12), n: 'knob-detent', v: 0.74});
  c.push({at: at('S08', 42), n: 'relay-click', v: 0.62});

  // S09 · the meter bank lights up under the montage.
  c.push({at: at('S09', 60), n: 'meter-ripple', v: 0.62});

  // S10 · the input ladder climbs.
  c.push({at: at('S10', 8), n: 'swell', v: 0.55});
  for (let i = 0; i < 4; i++) c.push({at: at('S10', 14 + i * 9), n: 'tick', v: 0.44});

  // S12 · Model 24 clip: hands across a lit console.
  c.push({at: at('S12', 8), n: 'fader-slide', v: 0.80});
  c.push({at: at('S12', 38), n: 'knob-detent', v: 0.68});
  c.push({at: at('S12', 60), n: 'relay-click', v: 0.58});

  // S13 · eleven 100 mm faders travelling.
  c.push({at: at('S13', 6), n: 'fader-slide', v: 0.86});
  for (let i = 0; i < 6; i++) c.push({at: at('S13', 16 + i * 7), n: 'tick', v: 0.40});

  // S16 · flagship clip: a hand travelling the surface.
  c.push({at: at('S16', 10), n: 'knob-detent', v: 0.74});
  c.push({at: at('S16', 46), n: 'fader-slide', v: 0.70});

  // S17 · routing matrix populating, master bus meters lighting.
  c.push({at: at('S17', 8), n: 'swell', v: 0.58});
  for (let i = 0; i < 6; i++) c.push({at: at('S17', 14 + i * 8), n: 'click-soft', v: 0.42});
  c.push({at: at('S17', 74), n: 'meter-ripple', v: 0.62});

  // S18 · three counters rolling up.
  for (let i = 0; i < 3; i++) c.push({at: at('S18', 8 + i * 8), n: 'transition-blip', v: 0.58});
  c.push({at: at('S18', 96), n: 'shimmer', v: 0.58});

  // S19 · the three struck-through controls being removed.
  for (let i = 0; i < 3; i++) c.push({at: at('S19', 14 + i * 7), n: 'glitch', v: 0.52});
  c.push({at: at('S19', 56), n: 'swell-dark', v: 0.62});

  // S20 · the DB-25 shell locking down, then eight lanes fanning out.
  c.push({at: at('S20', 6), n: 'db25-lock', v: 0.88});
  for (let i = 0; i < 8; i++) c.push({at: at('S20', 18 + i * 6), n: 'click-ui', v: 0.38});

  // S21 · the 6U rack slot resolving.
  c.push({at: at('S21', 40), n: 'impact-light', v: 0.60});
  c.push({at: at('S21', 92), n: 'chime-soft', v: 0.58});

  // S22 · the shared-engine ladder.
  c.push({at: at('S22', 8), n: 'swell', v: 0.58});
  for (let i = 0; i < 5; i++) c.push({at: at('S22', 12 + i * 8), n: 'tick', v: 0.44});

  // S23 · the five price rows landing, then the CTA rule.
  c.push({at: at('S23', 64), n: 'shimmer-bright', v: 0.66});
  c.push({at: at('S23', 104), n: 'impact-light', v: 0.58});

  // S24 · the close. The last two cues are placed so their natural decay
  // finishes inside the 2640-frame runtime rather than being cut off by it:
  // chime-final runs 2.14s (64f) and shimmer 1.08s (33f).
  for (let i = 0; i < 6; i++) c.push({at: at('S24', 12 + i * 3), n: 'click-soft', v: 0.34});
  c.push({at: at('S24', 24), n: 'chime-final', v: 0.80});
  c.push({at: at('S24', 50), n: 'shimmer', v: 0.55});

  return c.filter((x) => x.at >= 0).sort((a, b) => a.at - b.at);
};

export const CUES: Cue[] = build();
