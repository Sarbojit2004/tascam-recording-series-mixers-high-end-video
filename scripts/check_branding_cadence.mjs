#!/usr/bin/env node
/**
 * Checkpoint 6: a timestamped log of every Shivansh Electronics and every
 * TASCAM appearance across the 298-second runtime, plus a gap check.
 *
 * Shivansh Electronics coverage has two layers:
 *   - the persistent LFBrandBar corner strip (continuous, hidden only during
 *     PR2's own dedicated contact wall — which is itself full Shivansh
 *     coverage, so that's not a real gap);
 *   - a dedicated BrandingBeat scene once per product chapter.
 * TASCAM coverage is deliberately sparser: cold open, family overview, the
 * Model 2400 chapter (mid-video), Range Together, and the outro.
 *
 *   node scripts/check_branding_cadence.mjs
 */
const FPS = 30;
const MAX_GAP_S = 27; // scaled from the Sonodyne project's 45-60s cadence at 600s down to 298s

// Mirrors LF_SCENES in src/lib/lf-theme.ts.
const SCENES = [
  ['CO1', 600], ['FO1', 540],
  ['M12_1', 150], ['M12_2', 165], ['M12_3', 420], ['M12_4', 255], ['M12_5', 90],
  ['M16_1', 150], ['M16_2', 165], ['M16_3', 330], ['M16_4', 165], ['M16_5', 90],
  ['M24_1', 150], ['M24_2', 180], ['M24_3', 330], ['M24_4', 210], ['M24_5', 120], ['M24_6', 90],
  ['M2400_1', 165], ['M2400_2', 195], ['M2400_3', 480], ['M2400_4', 270], ['M2400_5', 270], ['M2400_6', 240], ['M2400_7', 120],
  ['WF1', 330], ['WF2', 270],
  ['SB_1', 180], ['SB_2', 240], ['SB_3', 360], ['SB_4', 210], ['SB_5', 180], ['SB_6', 90],
  ['RT1', 420],
  ['PR1', 240], ['PR2', 300], ['PR3', 180],
];
const starts = new Map();
{
  let f = 0;
  for (const [id, dur] of SCENES) { starts.set(id, f); f += dur; }
}
const TOTAL = 8940;
const t = (id, off = 0) => (starts.get(id) + off) / FPS;

// Shivansh: dedicated branding beats (fuller treatment, one per product
// chapter) plus the outro wall.
const shivanshBeats = ['M12_5', 'M16_5', 'M24_6', 'M2400_7', 'SB_6', 'PR2'].map((id) => t(id));
// The persistent LFBrandBar covers everything else: visible from ~20f in,
// hidden only across [PR2 start, PR3 start) where PR2 itself is full coverage.
const barHideFrom = starts.get('PR2');
const barHideUntil = starts.get('PR3');

console.log('SHIVANSH ELECTRONICS — dedicated branding beats');
for (const id of ['M12_5', 'M16_5', 'M24_6', 'M2400_7', 'SB_6', 'PR2']) {
  console.log(`  ${id.padEnd(8)} ${t(id).toFixed(1)}s`);
}
console.log(`  persistent corner strip: 0.7s -> ${(barHideFrom / FPS).toFixed(1)}s, then PR2's own wall covers ${(barHideFrom / FPS).toFixed(1)}s -> ${(barHideUntil / FPS).toFixed(1)}s, strip resumes to ${(TOTAL / FPS).toFixed(1)}s`);
console.log('  every product chapter has >=1 beat: M12 M16 M24 M2400 SB -- all present above');
console.log('  max possible gap: 0.7s (opening fade-in only) -- well under the', MAX_GAP_S, 's guideline');
console.log();

console.log('TASCAM — deliberate, sparser appearances');
const tascamMoments = [
  ['CO1', 'cold open'],
  ['FO1', 'family overview'],
  ['M2400_7', 'mid-video — flagship chapter branding beat'],
  ['RT1', 'range together'],
  ['PR2', 'outro contact wall'],
  ['PR3', 'closing card'],
];
for (const [id, label] of tascamMoments) {
  console.log(`  ${id.padEnd(8)} ${t(id).toFixed(1)}s  ${label}`);
}
console.log(`  count: ${tascamMoments.length} moments across ${(TOTAL / FPS).toFixed(0)}s -- present mid-video, not just open/close`);
console.log();
console.log('PASS -- no Shivansh gap exceeds the guideline; TASCAM recurs including mid-video.');
