#!/usr/bin/env node
/**
 * Renders one representative still per scene so every beat can be inspected
 * before the full render — checking for content crossing into the ambient
 * bands, text/image collisions, and low-contrast type on the light ground.
 *
 *   node scripts/stills.mjs            # all 24 scenes, clean
 *   node scripts/stills.mjs --guides   # with the safe-zone overlay
 *   node scripts/stills.mjs S13 S20    # just these scenes
 */
import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

// Mirrors SCENES in src/lib/theme.ts.
const SCENES = [
  ['S01', 150], ['S02', 150],
  ['S03', 120], ['S04', 75], ['S05', 105], ['S06', 90],
  ['S07', 110], ['S08', 70], ['S09', 100], ['S10', 80],
  ['S11', 115], ['S12', 75], ['S13', 110], ['S14', 120],
  ['S15', 120], ['S16', 80], ['S17', 130], ['S18', 150],
  ['S19', 120], ['S20', 120], ['S21', 150],
  ['S22', 90], ['S23', 120], ['S24', 90],
];

const args = process.argv.slice(2);
const guides = args.includes('--guides');
const only = args.filter((a) => /^S\d\d$/.test(a));

const comp = guides ? 'ReelGuides' : 'Reel';
const outDir = path.join(ROOT, 'out', guides ? 'stills-guides' : 'stills');
fs.mkdirSync(outDir, {recursive: true});

let from = 0;
const jobs = [];
for (const [id, dur] of SCENES) {
  // 70% into the scene: staggered entries have landed, exit fades have not.
  jobs.push({id, frame: from + Math.round(dur * 0.7), dur, start: from});
  from += dur;
}
if (from !== 2640) {
  console.error(`FAIL — scene durations sum to ${from}, expected 2640`);
  process.exit(1);
}

const todo = only.length ? jobs.filter((j) => only.includes(j.id)) : jobs;

for (const j of todo) {
  const out = path.join(outDir, `${j.id}-f${j.frame}.png`);
  process.stdout.write(`${j.id}  start=${j.start}  dur=${j.dur}  frame=${j.frame} ... `);
  execFileSync(
    'npx',
    ['remotion', 'still', 'src/index.ts', comp, out, `--frame=${j.frame}`, '--log=error'],
    {cwd: ROOT, stdio: ['ignore', 'ignore', 'inherit']},
  );
  console.log('ok');
}

console.log(`\n${todo.length} still(s) in ${path.relative(ROOT, outDir)}`);
