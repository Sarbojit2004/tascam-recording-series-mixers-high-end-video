/**
 * Emits the four recording scripts as markdown, with real timecodes derived
 * from the schedules — so the read can be cued against the picture rather than
 * guessed at. Regenerate after any schedule change; vo_check.mjs guarantees
 * the two are in sync before this runs.
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { BEATS } from "../longform/src/schedule.ts";
import { REELS } from "../reels/src/schedules.ts";
import { VO_LONGFORM, VO_REEL1, VO_REEL2, VO_REEL3, wordBudget } from "../shared/vo.ts";

const tc = (sec) => {
  const m = Math.floor(sec / 60), s = Math.floor(sec % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};
const words = (t) => (t.trim() ? t.trim().split(/\s+/).length : 0);

function render(title, subtitle, beats, vo) {
  const total = beats.reduce((a, b) => a + b.sec, 0);
  const spoken = beats.reduce((a, b) => a + words(vo[b.id] ?? ""), 0);
  const out = [
    `# ${title}`, "",
    `${subtitle}`, "",
    `**Runtime** ${tc(total)} (${total}s) · **Word count** ${spoken} · ` +
    `**Average** ${(spoken / (total / 60)).toFixed(0)} wpm`, "",
    "Read at a comfortable 150 wpm. Every line is budgeted to 78% of the time",
    "its beat occupies, so the picture always has room to breathe around the",
    "read — do not fill the gaps. Beats marked *(silent)* carry no narration by",
    "design: the animation, the product video or the closing block is the point",
    "there, and talking over it would be the mistake.", "",
    "| In | Out | Beat | Narration |",
    "|---|---|---|---|",
  ];
  let acc = 0;
  for (const b of beats) {
    const t = (vo[b.id] ?? "").trim();
    const cell = t ? t.replace(/\|/g, "\\|") : `*(silent — ${b.kind})*`;
    out.push(`| ${tc(acc)} | ${tc(acc + b.sec)} | \`${b.id}\` | ${cell} |`);
    acc += b.sec;
  }
  out.push("", "## Per-beat budgets", "",
           "| Beat | Seconds | Words | Budget |", "|---|---|---|---|");
  acc = 0;
  for (const b of beats) {
    out.push(`| \`${b.id}\` | ${b.sec} | ${words(vo[b.id] ?? "")} | ${wordBudget(b.sec)} |`);
    acc += b.sec;
  }
  return out.join("\n") + "\n";
}

mkdirSync("../docs/voiceover", { recursive: true });
const files = [
  ["longform.md", "Voiceover — Long-form (898s, landscape)",
   "TASCAM Model series · Shivansh Electronics", BEATS, VO_LONGFORM],
  ["reel-1-tri-path-survey.md", "Voiceover — Reel 1: The Tri-Path Survey",
   "178s, portrait", REELS.reel1, VO_REEL1],
  ["reel-2-flagship-and-specialist.md", "Voiceover — Reel 2: The Flagship and the Specialist",
   "178s, portrait", REELS.reel2, VO_REEL2],
  ["reel-3-transparent-bridge.md", "Voiceover — Reel 3: The Transparent Bridge",
   "178s, portrait", REELS.reel3, VO_REEL3],
];
for (const [f, title, sub, beats, vo] of files) {
  writeFileSync(`../docs/voiceover/${f}`, render(title, sub, beats, vo));
  console.log(`wrote docs/voiceover/${f}`);
}
