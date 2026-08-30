/**
 * VOICEOVER BUDGET CHECK — every line must be readable in the time the picture
 * gives it, and every beat must be accounted for.
 *
 * Two failure modes this catches. A line that is too long forces the read to
 * rush, which is what makes narration sound like a disclaimer. A beat missing
 * from the script is worse: it reaches the recording session as a surprise,
 * and gets filled with whatever comes to mind on the day.
 */
import { PARTS } from "../longform/src/schedule.ts";
import { REELS } from "../reels/src/schedules.ts";
import { VO_LONGFORM, VO_REEL1, VO_REEL2, VO_REEL3, wordBudget, WPS }
  from "../shared/vo.ts";

const count = (s) => (s.trim() ? s.trim().split(/\s+/).length : 0);
let ok = true;

function check(name, beats, vo, partial = false) {
  let words = 0, silent = 0, over = 0;
  for (const b of beats) {
    if (!(b.id in vo)) {
      console.error(`  FAIL [${name}] ${b.id}: no narration entry (write "" for a silent beat)`);
      ok = false;
      continue;
    }
    const n = count(vo[b.id]);
    const budget = wordBudget(b.sec);
    words += n;
    if (n === 0) silent++;
    if (n > budget) {
      console.error(`  FAIL [${name}] ${b.id}: ${n} words in ${b.sec}s (budget ${budget})`);
      ok = false; over++;
    }
  }
  // A part only carries its own beats, so the "orphan entry" check applies to
  // whole schedules; for a part it would flag every beat of the other two.
  if (!partial) {
    for (const id of Object.keys(vo)) {
      if (!beats.some((b) => b.id === id)) {
        console.error(`  FAIL [${name}] "${id}" is not a beat in this schedule`);
        ok = false;
      }
    }
  }
  const total = beats.reduce((a, b) => a + b.sec, 0);
  console.log(
    `${name}: ${words} words over ${total}s ` +
    `(${(words / (total / 60)).toFixed(0)} wpm average, ` +
    `${silent}/${beats.length} beats deliberately silent, ${over} over budget)`,
  );
}

// Checked per part, because a part is what gets recorded in one session.
for (const [k, beats] of Object.entries(PARTS)) {
  check(`longform ${k}`, beats, VO_LONGFORM, true);
}
check("reel1", REELS.reel1, VO_REEL1);
check("reel2", REELS.reel2, VO_REEL2);
check("reel3", REELS.reel3, VO_REEL3);
console.log(ok ? "VO PASS" : "VO FAIL");
process.exit(ok ? 0 : 1);
