// Design tokens for the 88-second TASCAM Model Series / Studio Bridge reel.
//
// FORMAT CONTRACT — this reel is composed FULL-FRAME across 1080x1920. There is
// no reserved dead centre square. Instead every beat respects the Instagram
// safe-zone geometry below: critical content lives in the primary band, and the
// top/bottom bands carry ambient, non-critical imagery only.

export const FPS = 30;
export const TOTAL_FRAMES = 2640; // 88.000s exactly
export const CANVAS = {w: 1080, h: 1920};

/**
 * Safe-zone geometry. Top 0..250 and bottom 1580..1920 are AMBIENT ONLY —
 * Instagram's profile row, caption, action icons and progress bar sit there.
 * Nothing a viewer must read may enter them.
 */
export const ZONE = {
  topAmbient: 250,
  bottomAmbient: 1580,
  side: 78,
} as const;

/** The box every scene lays its real content into. Biased upward: the bottom
 *  UI clutter is heavier than the top, so content sits high inside the band. */
export const SAFE = {
  x: ZONE.side,
  y: ZONE.topAmbient,
  w: CANVAS.w - ZONE.side * 2, // 924
  h: 1200, // 250 .. 1450, leaving 1450..1580 for the brand strip
} as const;

/** Persistent contact strip — inside the safe zone, above the bottom band. */
export const STRIP = {y: 1462, h: 92} as const;

// ---------------------------------------------------------------- palette
// Light ground throughout. Ink is dark and saturated for contrast; measured
// ratios against `paper` are in the comments (WCAG relative luminance).
export const C = {
  paper: '#F2F1ED',      // warm light neutral — the base ground, never flat white
  paperDeep: '#E6E4DD',  // recessed wash for ambient bands
  card: '#FFFFFF',
  cardEdge: '#DEDCD4',
  hair: '#CFCCC3',

  ink: '#141A22',        // 15.4:1 on paper — headlines, all primary copy
  inkSoft: '#3A4350',    // 8.7:1  — body copy
  inkDim: '#69727F',     // 4.6:1  — kickers, captions (never below 18px)

  // Per-product accents, taken from TASCAM's own colour-coded knob caps and
  // panel work. All ≥ 4.5:1 on paper so they stay legible as text.
  m12: '#1663C7',        // 5.6:1 — blue caps, the compact hybrid
  m16: '#0A6B5C',        // 5.4:1 — teal caps, the live tracker
  m24: '#B23C08',        // 5.5:1 — orange caps, large format
  m2400: '#A6143A',      // 7.2:1 — red, the flagship
  sb: '#54329C',         // 8.1:1 — indigo, the controller-less pivot
  gold: '#7E5F0E',       // 5.4:1 — pricing
  neutral: '#2B3440',    // 11.2:1 — the shared-philosophy hook

  glowWarm: 'rgba(255,214,150,0.55)',
} as const;

export const F = {
  display: '"BarlowCondensed", "Arial Narrow", sans-serif',
  ui: '"Inter", system-ui, sans-serif',
  mono: '"JetBrainsMono", ui-monospace, monospace',
} as const;

export type Accent = 'm12' | 'm16' | 'm24' | 'm2400' | 'sb' | 'gold' | 'neutral';

export const accentColor = (a: Accent): string => C[a];

/** Very light accent wash used for card tints and rules on the light ground. */
export const accentWash = (a: Accent, alpha = 0.10): string => {
  const hex = C[a].replace('#', '');
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// ------------------------------------------------------------ scene table
export type SceneId =
  | 'S01' | 'S02'
  | 'S03' | 'S04' | 'S05' | 'S06'
  | 'S07' | 'S08' | 'S09' | 'S10'
  | 'S11' | 'S12' | 'S13' | 'S14'
  | 'S15' | 'S16' | 'S17' | 'S18'
  | 'S19' | 'S20' | 'S21'
  | 'S22' | 'S23' | 'S24';

/** Single source of truth for timing. Durations sum to exactly 2640. */
export const SCENES: {id: SceneId; dur: number; accent: Accent}[] = [
  // ACT 0 — the philosophy hook (300f / 10.0s)
  {id: 'S01', dur: 150, accent: 'neutral'},
  {id: 'S02', dur: 150, accent: 'neutral'},
  // ACT 1 — Model 12, the compact desktop hybrid (390f / 13.0s)
  {id: 'S03', dur: 120, accent: 'm12'},
  {id: 'S04', dur: 75, accent: 'm12'},
  {id: 'S05', dur: 105, accent: 'm12'},
  {id: 'S06', dur: 90, accent: 'm12'},
  // ACT 2 — Model 16, the live ensemble tracker (360f / 12.0s)
  {id: 'S07', dur: 110, accent: 'm16'},
  {id: 'S08', dur: 70, accent: 'm16'},
  {id: 'S09', dur: 100, accent: 'm16'},
  {id: 'S10', dur: 80, accent: 'm16'},
  // ACT 3 — Model 24, the large-format console (420f / 14.0s)
  {id: 'S11', dur: 115, accent: 'm24'},
  {id: 'S12', dur: 75, accent: 'm24'},
  {id: 'S13', dur: 110, accent: 'm24'},
  {id: 'S14', dur: 120, accent: 'm24'},
  // ACT 4 — Model 2400, the flagship (480f / 16.0s)
  {id: 'S15', dur: 120, accent: 'm2400'},
  {id: 'S16', dur: 80, accent: 'm2400'},
  {id: 'S17', dur: 130, accent: 'm2400'},
  {id: 'S18', dur: 150, accent: 'm2400'},
  // ACT 5 — Studio Bridge, the controller-less engine (390f / 13.0s)
  {id: 'S19', dur: 120, accent: 'sb'},
  {id: 'S20', dur: 120, accent: 'sb'},
  {id: 'S21', dur: 150, accent: 'sb'},
  // ACT 6 — the range together, pricing, CTA (300f / 10.0s)
  {id: 'S22', dur: 90, accent: 'neutral'},
  {id: 'S23', dur: 120, accent: 'gold'},
  {id: 'S24', dur: 90, accent: 'gold'},
];

export const sceneStart = (id: SceneId): number => {
  let f = 0;
  for (const s of SCENES) {
    if (s.id === id) return f;
    f += s.dur;
  }
  return f;
};

export const sceneDur = (id: SceneId): number =>
  SCENES.find((s) => s.id === id)?.dur ?? 0;
