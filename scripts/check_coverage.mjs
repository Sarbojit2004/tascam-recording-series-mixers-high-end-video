#!/usr/bin/env node
/**
 * Compulsory-coverage audit.
 *
 * Asserts that every product/context asset on disk appears in PLACEMENTS
 * exactly once, and reports the primary/ambient split and the still/video
 * split. Run before every full render — a missing asset is a hard failure,
 * not a warning.
 *
 *   node scripts/check_coverage.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const IMG = path.join(ROOT, 'public', 'img');
const VID = path.join(ROOT, 'public', 'video');

const onDiskStills = fs.readdirSync(IMG).filter((f) => f.endsWith('.jpg'))
  .map((f) => f.replace(/\.jpg$/, '')).sort();
const onDiskClips = fs.readdirSync(VID).filter((f) => f.endsWith('.mp4'))
  .map((f) => f.replace(/\.mp4$/, '')).sort();
const onDisk = new Set([...onDiskStills, ...onDiskClips]);

// PLACEMENTS is plain data — parse it out of the TS source rather than adding
// a build step just to read one table.
const src = fs.readFileSync(path.join(ROOT, 'src', 'lib', 'assets.ts'), 'utf8');
const body = src.slice(
  src.indexOf('export const PLACEMENTS'),
  src.indexOf('/** Flattened views'),
);

const scenes = [];
const sceneRe = /(S\d\d):\s*\{([\s\S]*?)\},\n/g;
let m;
while ((m = sceneRe.exec(body)) !== null) {
  const id = m[1];
  const inner = m[2];
  const pick = (key) => {
    const mm = new RegExp(`${key}:\\s*\\[([\\s\\S]*?)\\]`).exec(inner);
    if (!mm) return [];
    return [...mm[1].matchAll(/'([^']+)'/g)].map((x) => x[1]);
  };
  scenes.push({id, primary: pick('primary'), ambient: pick('ambient')});
}

if (scenes.length !== 24) {
  console.error(`FAIL — parsed ${scenes.length} scenes, expected 24`);
  process.exit(1);
}

const seen = new Map(); // id -> [{scene, tier}]
for (const s of scenes) {
  for (const id of s.primary) {
    if (!seen.has(id)) seen.set(id, []);
    seen.get(id).push({scene: s.id, tier: 'primary'});
  }
  for (const id of s.ambient) {
    if (!seen.has(id)) seen.set(id, []);
    seen.get(id).push({scene: s.id, tier: 'ambient'});
  }
}

const missing = [...onDisk].filter((id) => !seen.has(id)).sort();
const unknown = [...seen.keys()].filter((id) => !onDisk.has(id)).sort();
const dupes = [...seen.entries()].filter(([, v]) => v.length > 1);

const primaryCount = scenes.reduce((a, s) => a + s.primary.length, 0);
const ambientCount = scenes.reduce((a, s) => a + s.ambient.length, 0);
const clipPlacements = [...seen.entries()].filter(([id]) => onDiskClips.includes(id));
const clipsAsMotion = clipPlacements.filter(([, v]) => v.some((p) => p.tier === 'primary'));

console.log('ASSET COVERAGE');
console.log(`  on disk        : ${onDiskStills.length} stills + ${onDiskClips.length} clips = ${onDisk.size}`);
console.log(`  placed         : ${seen.size}`);
console.log(`  primary tier   : ${primaryCount}`);
console.log(`  ambient tier   : ${ambientCount}`);
console.log(`  clips as motion: ${clipsAsMotion.length}/${onDiskClips.length}`);
console.log();

console.log('PER-SCENE LEDGER');
for (const s of scenes) {
  const p = s.primary.length ? `primary[${s.primary.length}] ${s.primary.join(' ')}` : 'primary[0]';
  const a = s.ambient.length ? `  ambient[${s.ambient.length}] ${s.ambient.join(' ')}` : '';
  console.log(`  ${s.id}  ${p}${a}`);
}
console.log();

let bad = false;
if (missing.length) {
  bad = true;
  console.error(`FAIL — ${missing.length} asset(s) never placed:`);
  for (const id of missing) console.error('   ', id);
}
if (unknown.length) {
  bad = true;
  console.error(`FAIL — ${unknown.length} placed id(s) not on disk:`);
  for (const id of unknown) console.error('   ', id);
}
if (dupes.length) {
  bad = true;
  console.error(`FAIL — ${dupes.length} asset(s) placed more than once:`);
  for (const [id, v] of dupes) {
    console.error('   ', id, v.map((x) => `${x.scene}/${x.tier}`).join(', '));
  }
}
if (clipsAsMotion.length !== onDiskClips.length) {
  bad = true;
  console.error('FAIL — a video clip is not placed in the primary tier, so its motion never plays.');
}

if (bad) process.exit(1);
console.log(`PASS — all ${onDisk.size} compulsory assets placed exactly once, all ${onDiskClips.length} clips play as motion.`);

// --md writes the human-readable ledger that ships with the repo.
if (process.argv.includes('--md')) {
  const map = JSON.parse(
    fs.readFileSync(path.join(ROOT, 'src', 'lib', 'asset-map.json'), 'utf8'),
  );
  const srcOf = new Map(map.map((m) => [m.id, m.src]));

  // Mirrors SCENES in src/lib/theme.ts.
  const META = {
    S01: [150, 'Philosophy hook — ten-cut tactile strobe'],
    S02: [150, 'The range as an ascending ladder'],
    S03: [120, 'Model 12 — hero'],
    S04: [75, 'Model 12 — CLIP, fader-bank glide'],
    S05: [105, 'Model 12 — HUI/MCU transport'],
    S06: [90, 'Model 12 — the rooms it works in'],
    S07: [110, 'Model 16 — hero'],
    S08: [70, 'Model 16 — CLIP, hand on the desk'],
    S09: [100, 'Model 16 — 16 tracks to SD'],
    S10: [80, 'Model 16 — live rig'],
    S11: [115, 'Model 24 — hero'],
    S12: [75, 'Model 24 — CLIP, lit console'],
    S13: [110, 'Model 24 — 100 mm fader travel'],
    S14: [120, 'Model 24 — case study'],
    S15: [120, 'Model 2400 — hero'],
    S16: [80, 'Model 2400 — CLIP, flagship surface'],
    S17: [130, 'Model 2400 — master bus and routing'],
    S18: [150, 'Model 2400 — in the room'],
    S19: [120, 'Studio Bridge — the pivot, stated as subtraction'],
    S20: [120, 'Studio Bridge — DB-25 fan-out'],
    S21: [150, 'Studio Bridge — system diagrams and 6U context'],
    S22: [90, 'The range together'],
    S23: [120, 'All five prices'],
    S24: [90, 'Call to action and contact'],
  };

  const L = [];
  L.push('# Asset Coverage Ledger');
  L.push('');
  L.push('Machine-generated by `node scripts/check_coverage.mjs --md`. Every');
  L.push('product/context asset in this repository must appear somewhere in the');
  L.push('finished reel; this file is the proof, and the check fails the build if any');
  L.push('asset is missing, duplicated, or if a clip is not placed as motion.');
  L.push('');
  L.push('| | |');
  L.push('|---|---|');
  L.push(`| Stills on disk | ${onDiskStills.length} |`);
  L.push(`| Video clips on disk | ${onDiskClips.length} |`);
  L.push(`| **Compulsory total** | **${onDisk.size}** |`);
  L.push(`| Placed | ${seen.size} |`);
  L.push(`| Primary tier | ${primaryCount} |`);
  L.push(`| Ambient tier | ${ambientCount} |`);
  L.push(`| Clips playing as motion | ${clipsAsMotion.length} / ${onDiskClips.length} |`);
  L.push('');
  L.push('> The two logo files referenced in the brief do not exist in this repository,');
  L.push('> so the no-logo rule is satisfied by construction: no logo file is added.');
  L.push('');

  let from = 0;
  for (const s of scenes) {
    const [dur, title] = META[s.id];
    const to = from + dur;
    L.push(`## ${s.id} · ${title}`);
    L.push('');
    L.push(`Frames ${from}–${to} · ${(from / 30).toFixed(2)}s – ${(to / 30).toFixed(2)}s`);
    L.push('');
    if (s.primary.length || s.ambient.length) {
      L.push('| Asset | Source file | Tier |');
      L.push('|---|---|---|');
      for (const id of s.primary) {
        const isClip = onDiskClips.includes(id);
        L.push(`| \`${id}\` | ${srcOf.get(id) ?? '—'} | primary${isClip ? ' · **plays as motion**' : ''} |`);
      }
      for (const id of s.ambient) L.push(`| \`${id}\` | ${srcOf.get(id) ?? '—'} | ambient |`);
    } else {
      L.push('_Typographic beat — no new assets introduced._');
    }
    L.push('');
    from = to;
  }
  L.push(`**Total runtime: ${from} frames = ${(from / 30).toFixed(3)} s.**`);
  L.push('');

  fs.writeFileSync(path.join(ROOT, 'ASSET_COVERAGE.md'), L.join('\n'));
  console.log('wrote ASSET_COVERAGE.md');
}
