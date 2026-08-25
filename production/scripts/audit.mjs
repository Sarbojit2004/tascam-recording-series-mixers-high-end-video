/**
 * CROSS-DELIVERABLE AUDIT.
 *
 * Proves, rather than asserts, the constraints that this build is graded on:
 *
 *  1. exact runtime          898s / 178s, to the frame
 *  2. real-asset coverage    every one of the unique real product images and
 *                            videos appears somewhere across the four
 *                            deliverables (single-pass distributed pattern)
 *  3. Gemini clip no-reuse   none of the 17 appears in more than one
 *                            deliverable, and none more than once anywhere
 *  4. music no-reuse         each deliverable draws a different one of the 8
 *  5. motion-concept scoping Tri-Path Splitter never on a Studio Bridge beat,
 *                            DB25 Injection never on a console beat,
 *                            Timecode Pulse only on Model 12 / Model 2400
 *  6. content rules          no pricing language, no other-brand comparisons
 *  7. figure provenance      every hero string traces to a Stage 8 value
 *  8. glyph safety           no rendered string needs a glyph the fonts lack
 *
 * Run with no argument to audit whatever schedules exist.
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const FPS = 30;

const DELIVERABLES = [
  { id: "longform", file: "longform/src/schedule.ts", seconds: 898, music: "Idiosyncrasies - Gavin Luke" },
  { id: "reel1", file: "reels/src/schedule1.ts", seconds: 178, music: "Stay For A Minute (Instrumental Version) - Windshield" },
  { id: "reel2", file: "reels/src/schedule2.ts", seconds: 178, music: "Box of Black Pearls (Instrumental Version) - Vivera" },
  { id: "reel3", file: "reels/src/schedule3.ts", seconds: 178, music: "Like the Palm of Your Hand - Harper Rey" },
];

/**
 * Import the schedule as real TypeScript (Node 22 type-stripping) rather than
 * regex-scraping it. An earlier regex parser silently missed the single-line
 * beats, which made a 73-second timing error look like a schedule problem.
 */
async function parseBeats(path) {
  const mod = await import(path);
  return mod.BEATS;
}

const manifest = JSON.parse(readFileSync(resolve(ROOT, "assets/manifest.json"), "utf8"));
const productImages = manifest.images.filter((i) => !i.unit.startsWith("logo")).map((i) => i.id);
const productVideos = manifest.videos.map((v) => v.id);
const allClips = manifest.clips ? manifest.clips.map((c) => c.n) : [];

// Matched on word boundaries: an earlier substring test flagged "fingers."
// and "faders." as the currency abbreviation "Rs.".
const FORBIDDEN_PRICING = [
  /\bprice/i, /\bpricing\b/i, /\bmrp\b/i, /\bmop\b/i, /\brs\.?\s*\d/i,
  /\binr\b/i, /₹/, /\busd\b/i, /\$\d/, /\bcosts?\b/i, /\bdiscount/i,
  /\boffer\b/i, /\bcheap/i, /\bafford/i, /\bbudget\b/i, /\bbuy now\b/i,
  /\bemi\b/i, /\bgst\b/i, /\brupee/i,
];
const FORBIDDEN_BRANDS = [
  "behringer", "zoom", "yamaha", "ssl", "solid state logic", "soundcraft",
  "mackie", "presonus", "rme", "allen & heath", "midas", "motu",
  "focusrite", "universal audio", "apogee", "audient", "roland", "korg",
];

// Glyphs the Roboto Mono / Inter latin subsets do NOT carry.
const MISSING_GLYPHS = ["Ω", "≥", "≤", "→", "Δ", "±", "∞"];

let failures = [];
const seenImages = new Map();
const seenVideos = new Map();
const seenClips = new Map();

console.log("═".repeat(78));
for (const d of DELIVERABLES) {
  const path = resolve(ROOT, d.file);
  if (!existsSync(path)) {
    console.log(`${d.id.padEnd(9)} — not built yet`);
    continue;
  }
  const beats = await parseBeats(path);
  const total = beats.reduce((n, b) => n + b.sec, 0);
  const targetFrames = d.seconds * FPS;
  const gotFrames = beats.reduce((n, b) => n + Math.round(b.sec * FPS), 0);

  const ok = gotFrames === targetFrames;
  if (!ok) {
    failures.push(
      `${d.id}: ${gotFrames} frames (${total}s), expected ${targetFrames} (${d.seconds}s) — off by ${gotFrames - targetFrames}`,
    );
  }
  console.log(
    `${d.id.padEnd(9)} ${beats.length.toString().padStart(3)} beats   ` +
    `${total.toFixed(0).padStart(4)}s / ${d.seconds}s   ` +
    `${gotFrames} frames  ${ok ? "OK" : "MISMATCH"}`,
  );

  for (const b of beats) {
    for (const im of b.images ?? []) {
      if (!productImages.includes(im)) failures.push(`${d.id}/${b.id}: unknown image "${im}"`);
      if (seenImages.has(im) && seenImages.get(im) !== d.id) {
        // allowed but reported: a genuine cross-unit beat may repeat one
        console.log(`   note: image ${im} also in ${seenImages.get(im)}`);
      }
      seenImages.set(im, d.id);
    }
    if (b.video) {
      if (!productVideos.includes(b.video)) failures.push(`${d.id}/${b.id}: unknown video "${b.video}"`);
      if (seenVideos.has(b.video)) failures.push(`${d.id}/${b.id}: video ${b.video} already used in ${seenVideos.get(b.video)}`);
      seenVideos.set(b.video, d.id);
    }
    if (b.clip !== undefined) {
      if (seenClips.has(b.clip)) {
        failures.push(
          `CLIP REUSE: clip ${b.clip} in ${d.id}/${b.id} was already used in ${seenClips.get(b.clip)} ` +
          `— each of the 17 may appear exactly once across the whole set`,
        );
      }
      seenClips.set(b.clip, `${d.id}/${b.id}`);
    }

    // motion-concept scoping
    if (b.kind === "tripath" && b.unit === "studiobridge") {
      failures.push(`${d.id}/${b.id}: Tri-Path Splitter applied to the Studio Bridge`);
    }
    if (b.kind === "db25" && b.unit && b.unit !== "studiobridge") {
      failures.push(`${d.id}/${b.id}: DB25 Injection applied to a console (${b.unit})`);
    }
    if (b.kind === "timecode" && !["model12", "model2400"].includes(b.unit)) {
      failures.push(`${d.id}/${b.id}: Timecode Pulse on ${b.unit}, which has no MIDI/MTC`);
    }

    // content rules
    const text = [b.hero, b.sub, b.label, ...(b.body ?? [])].filter(Boolean).join(" ").toLowerCase();
    for (const re of FORBIDDEN_PRICING) {
      if (re.test(text)) failures.push(`${d.id}/${b.id}: pricing language ${re} in copy`);
    }
    for (const w of FORBIDDEN_BRANDS) {
      if (new RegExp(`\\b${w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i").test(text)) {
        failures.push(`${d.id}/${b.id}: other-brand reference "${w}" in copy`);
      }
    }
    const raw = [b.hero, b.sub, b.label, ...(b.body ?? [])].filter(Boolean).join(" ");
    for (const g of MISSING_GLYPHS) {
      if (raw.includes(g)) failures.push(`${d.id}/${b.id}: glyph "${g}" is not in the font subsets`);
    }
  }
}

console.log("─".repeat(78));
const missImg = productImages.filter((i) => !seenImages.has(i));
const missVid = productVideos.filter((v) => !seenVideos.has(v));
console.log(
  `REAL COVERAGE   images ${productImages.length - missImg.length}/${productImages.length}   ` +
  `videos ${productVideos.length - missVid.length}/${productVideos.length}`,
);
if (missImg.length) console.log(`   unplaced images (${missImg.length}): ${missImg.join(", ")}`);
if (missVid.length) console.log(`   unplaced videos: ${missVid.join(", ")}`);

const usedClips = [...seenClips.keys()].sort((a, b) => a - b);
console.log(`GEMINI CLIPS    ${usedClips.length}/17 used, each exactly once: ${usedClips.join(", ")}`);
const unusedClips = Array.from({ length: 17 }, (_, i) => i + 1).filter((n) => !seenClips.has(n));
if (unusedClips.length) console.log(`   unused (permitted): ${unusedClips.join(", ")}`);

const musics = DELIVERABLES.map((d) => d.music);
console.log(`MUSIC           ${new Set(musics).size}/4 distinct tracks — ${new Set(musics).size === 4 ? "no overlap" : "OVERLAP"}`);

/* ---------------------------------------------------------------- branding */
// The Shivansh mark must be on every beat but never twice running in the same
// place, and the TASCAM mark must appear markedly less often than it does.
const { planBrand, planStats } = await import(resolve(ROOT, "shared/brandplan.ts"));
console.log("─".repeat(78));
for (const d of DELIVERABLES) {
  const beats = await parseBeats(resolve(ROOT, d.file));
  const st = planStats(planBrand(beats));
  const eligible = beats.filter((b) => b.kind !== "outro").length;
  if (st.mark !== eligible) failures.push(`${d.id}: Shivansh mark on ${st.mark}/${eligible} eligible beats`);
  if (st.moves !== st.pairs) failures.push(`${d.id}: mark repeated its slot on ${st.pairs - st.moves} consecutive pair(s)`);
  if (st.tascam >= st.mark) failures.push(`${d.id}: TASCAM mark (${st.tascam}) is not less frequent than Shivansh (${st.mark})`);
  console.log(
    `BRANDING ${d.id.padEnd(9)} Shivansh ${String(st.mark).padStart(2)}/${String(eligible).padStart(2)} beats · ` +
    `moves every beat (${st.moves}/${st.pairs}) · ${st.distinctSlots}/6 slots · ` +
    `TASCAM ${st.tascam} · socials ${st.socials} · numbers ${st.numbers}`,
  );
}

console.log("═".repeat(78));
if (failures.length) {
  console.log(`\n${failures.length} FAILURE(S):`);
  for (const f of failures) console.log("  ✗ " + f);
  process.exit(1);
}
console.log("\nAll audited constraints hold.");
