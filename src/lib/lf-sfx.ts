import {staticFile} from 'remotion';
import type {SfxName} from './sfx';
import {LFSceneId, LF_SCENES, lfSceneStart} from './lf-theme';

// The long-form video reuses the reel's own validated 35-clip SFX palette —
// same files, same folder (public/audio/sfx/) — since they are generic
// transition sounds, not reel-specific, and re-synthesising an identical
// palette twice would be pure waste. Four additional sounds unique to this
// video's own beat vocabulary (chapter transitions, gallery sweeps, dedicated
// branding beats) are added alongside them by the same synthesis pipeline.

export type LfSfxName = SfxName | 'chapter-swell' | 'gallery-tick' | 'brand-chime' | 'chapter-out';

export const lfSfxFile = (n: LfSfxName): string => staticFile(`audio/sfx/${n}.mp3`);

export type LfCue = {at: number; n: LfSfxName; v: number};

const at = (s: LFSceneId, off = 0) => lfSceneStart(s) + off;

/** Every chapter opens with a swell + one distinct impact, never repeating
 *  the immediately preceding choice. */
const OPENERS: Partial<Record<LFSceneId, {n: LfSfxName; v: number; pre?: LfSfxName}>> = {
  CO1: {n: 'impact-deep', v: 0.85},
  FO1: {n: 'chapter-swell', v: 0.6, pre: 'riser-short'},
  M12_1: {n: 'impact-mid', v: 0.8, pre: 'chapter-swell'},
  M12_2: {n: 'whoosh-metal', v: 0.62},
  M12_3: {n: 'whoosh-air', v: 0.6},
  M12_4: {n: 'whoosh-low', v: 0.58},
  M12_5: {n: 'brand-chime', v: 0.55},
  M16_1: {n: 'impact-mid', v: 0.8, pre: 'chapter-swell'},
  M16_2: {n: 'whoosh-swoop', v: 0.6},
  M16_3: {n: 'whoosh-air', v: 0.58},
  M16_4: {n: 'whoosh-low', v: 0.56},
  M16_5: {n: 'brand-chime', v: 0.55},
  M24_1: {n: 'impact-hollow', v: 0.82, pre: 'riser'},
  M24_2: {n: 'whoosh-metal', v: 0.62},
  M24_3: {n: 'whoosh-air', v: 0.58},
  M24_4: {n: 'whoosh-low', v: 0.56},
  M24_5: {n: 'whoosh-soft', v: 0.54},
  M24_6: {n: 'brand-chime', v: 0.55},
  M2400_1: {n: 'impact-deep', v: 0.88, pre: 'riser-long'},
  M2400_2: {n: 'whoosh-swoop', v: 0.62},
  M2400_3: {n: 'whoosh-air', v: 0.58},
  M2400_4: {n: 'shimmer', v: 0.5},
  M2400_5: {n: 'whoosh-low', v: 0.56},
  M2400_6: {n: 'whoosh-bright', v: 0.55},
  M2400_7: {n: 'brand-chime', v: 0.55},
  WF1: {n: 'chapter-swell', v: 0.58, pre: 'sub-drop'},
  WF2: {n: 'whoosh-air', v: 0.56},
  SB_1: {n: 'sub-drop', v: 0.82, pre: 'glitch'},
  SB_2: {n: 'whoosh-bright', v: 0.6},
  SB_3: {n: 'whoosh-air', v: 0.56},
  SB_4: {n: 'whoosh-rev', v: 0.56},
  SB_5: {n: 'whoosh-low', v: 0.54},
  SB_6: {n: 'brand-chime', v: 0.55},
  RT1: {n: 'impact-mid', v: 0.78, pre: 'riser-short'},
  PR1: {n: 'impact-deep', v: 0.84, pre: 'riser'},
  PR2: {n: 'whoosh-air', v: 0.6},
  PR3: {n: 'chapter-out', v: 0.7, pre: 'shimmer-bright'},
};

const build = (): LfCue[] => {
  const c: LfCue[] = [];

  for (const s of LF_SCENES) {
    const o = OPENERS[s.id];
    if (!o) continue;
    if (o.pre) c.push({at: at(s.id, -14), n: o.pre, v: 0.42});
    c.push({at: at(s.id), n: o.n, v: o.v});
  }

  // Gallery-sweep group changes get their own soft tick, computed from each
  // GallerySweep's own group count (mirrors the component's own chunking).
  const gallery: {s: LFSceneId; n: number; groupSize: number}[] = [
    {s: 'M12_4', n: 18, groupSize: 4},
    {s: 'M16_4', n: 11, groupSize: 4},
    {s: 'M24_4', n: 16, groupSize: 4},
    {s: 'M2400_5', n: 8, groupSize: 4},
    {s: 'SB_4', n: 4, groupSize: 4},
    {s: 'SB_5', n: 5, groupSize: 4},
  ];
  for (const g of gallery) {
    const dur = LF_SCENES.find((x) => x.id === g.s)!.dur;
    const groups = Math.ceil(g.n / g.groupSize);
    const per = Math.floor(dur / groups);
    for (let i = 1; i < groups; i++) c.push({at: at(g.s, i * per), n: 'gallery-tick', v: 0.36});
  }

  // Feature beat-cycle chip entrances — a soft click per beat change.
  const beatCycles: {s: LFSceneId; n: number}[] = [
    {s: 'M12_3', n: 4}, {s: 'M16_3', n: 3}, {s: 'M24_3', n: 3},
    {s: 'M2400_3', n: 4}, {s: 'SB_3', n: 3},
  ];
  for (const b of beatCycles) {
    const dur = LF_SCENES.find((x) => x.id === b.s)!.dur;
    const per = Math.floor(dur / b.n);
    for (let i = 1; i < b.n; i++) c.push({at: at(b.s, i * per), n: 'click-ui', v: 0.4});
  }

  // Clip-motion beats: a mechanical accent synced to the featured gesture.
  c.push({at: at('M12_2', 20), n: 'fader-slide', v: 0.8});
  c.push({at: at('M12_2', 70), n: 'meter-ripple', v: 0.5});
  c.push({at: at('M16_2', 18), n: 'knob-detent', v: 0.72});
  c.push({at: at('M16_2', 60), n: 'relay-click', v: 0.55});
  c.push({at: at('M24_2', 16), n: 'fader-slide', v: 0.84});
  c.push({at: at('M24_2', 76), n: 'tick-double', v: 0.5});
  c.push({at: at('M2400_2', 14), n: 'knob-detent', v: 0.74});
  c.push({at: at('M2400_2', 90), n: 'fader-slide', v: 0.72});

  // Studio Bridge: DB-25 lock + rack context.
  c.push({at: at('SB_2', 30), n: 'db25-lock', v: 0.86});
  c.push({at: at('SB_5', 140), n: 'impact-light', v: 0.55});

  // Pricing rows landing.
  for (let i = 0; i < 5; i++) c.push({at: at('PR1', 30 + i * 34), n: 'transition-blip', v: 0.5});

  return c.filter((x) => x.at >= 0).sort((a, b) => a.at - b.at);
};

export const LF_CUES: LfCue[] = build();
