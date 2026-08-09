#!/usr/bin/env node
/**
 * Renders one representative still per long-form scene.
 *
 *   node scripts/stills_lf.mjs            # all 37 scenes, clean
 *   node scripts/stills_lf.mjs --guides   # with the edge-margin overlay
 *   node scripts/stills_lf.mjs M2400_3    # just this scene
 */
import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

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

const args = process.argv.slice(2);
const guides = args.includes('--guides');
const only = args.filter((a) => !a.startsWith('--'));

const comp = guides ? 'LongFormGuides' : 'LongForm';
const outDir = path.join(ROOT, 'out', guides ? 'lf-stills-guides' : 'lf-stills');
fs.mkdirSync(outDir, {recursive: true});

let from = 0;
const jobs = [];
for (const [id, dur] of SCENES) {
  jobs.push({id, frame: from + Math.round(dur * 0.6), dur, start: from});
  from += dur;
}
if (from !== 8940) {
  console.error(`FAIL — LF scene durations sum to ${from}, expected 8940`);
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
