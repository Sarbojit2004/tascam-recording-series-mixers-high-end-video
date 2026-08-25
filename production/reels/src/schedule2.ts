/**
 * REEL 2 — "THE FLAGSHIP & THE SPECIALIST"  ·  178 s  ·  1080 x 1920
 *
 * Dedicated depth on the Model 2400 and the Model 12 — the two units carrying
 * the most individually distinct narrative weight in Stage 4's priority table
 * (two ranked features each, against one each for the Model 16 and Model 24).
 *
 * These two share NO architectural tier: the Model 12 is Tier 1 (Sub-Compact
 * Digital-Forward Hybrid) and the Model 2400 is Tier 3 (Advanced Flagship
 * Hybrid). Pairing them is a narrative-weight decision, not an architectural
 * claim, and the reel says so out loud in its framing beat rather than letting
 * the pairing imply a matched set the way the Tier 2 consoles genuinely are.
 *
 * What they do share is the capability the Tier 2 consoles explicitly lack:
 * MIDI I/O with MTC, and DAW transport via HUI/MCU. That is why this is the
 * only reel that carries the Timecode Synchronization Pulse — twice.
 */
import type { Beat } from "./shared/beat.ts";

export const BEATS: Beat[] = [
  {
    id: "hook", kind: "cold", sec: 8, clip: 11, phase: "R2",
    label: "TASCAM Model Series",
    hero: "THE TWO THAT COMMAND",
  },
  {
    id: "framing", kind: "statement", sec: 12,
    label: "A Narrative Pairing, Not A Tier",
    hero: "TIER 1 AND TIER 3",
    body: [
      "The Model 12 and Model 2400 sit in different architectural tiers and are not a matched pair.",
      "They are paired here because they alone carry MIDI, MTC and HUI/MCU transport across the range.",
    ],
  },

  {
    id: "m2400-card", kind: "unit", sec: 10, unit: "model2400", images: ["model-2400-5"],
    label: "Tier 3 — Advanced Flagship Hybrid",
    hero: "MODEL 2400",
    sub: "22 analog inputs on 100 mm faders.",
  },
  {
    id: "m2400-sub", kind: "repr", sec: 13, unit: "model2400", clip: 13,
    label: "Stage 4 Priority 1",
    hero: "4 SUBGROUPS · 5 AUX",
    sub: "A discrete monitor mix built in parallel with the main one.",
  },
  {
    id: "m2400-set", kind: "montage", sec: 11, unit: "model2400",
    images: ["model-2400-11", "model-2400-8"],
    hero: "24-IN / 22-OUT",
  },
  {
    id: "m2400-timecode", kind: "timecode", sec: 15, unit: "model2400",
    label: "Stage 4 Priority 2 — MIDI · MTC · Click Tempo Control",
  },
  {
    id: "m2400-close", kind: "macro", sec: 10, unit: "model2400", images: ["model-2400-15"],
    focus: [0.5, 0.55],
    hero: "24 TRACKS",
    sub: "Twenty-two inputs plus the stereo mix, to SDXC.",
  },

  {
    id: "m12-card", kind: "unit", sec: 10, unit: "model12", images: ["model-12-11"],
    label: "Tier 1 — Sub-Compact Digital-Forward Hybrid",
    hero: "MODEL 12",
    sub: "10 analog inputs on 60 mm faders.",
  },
  {
    id: "m12-hui", kind: "repr", sec: 13, unit: "model12", clip: 7,
    label: "Stage 4 Priority 1",
    hero: "HUI/MCU EMULATION",
    sub: "Physical fader movement translated into digital automation data.",
  },
  { id: "m12-video", kind: "realvideo", sec: 19, unit: "model12", video: "model-12-video", hero: "12 TRACKS" },
  {
    id: "m12-mixminus", kind: "repr", sec: 13, unit: "model12", clip: 8,
    label: "Stage 4 Priority 2",
    hero: "TRRS MIX-MINUS",
    sub: "A 3.5 mm smartphone input that returns everything except the caller's own voice.",
  },
  {
    id: "m12-set", kind: "montage", sec: 11, unit: "model12",
    images: ["model-12-12", "model-12-14", "model-12-15", "model-12-20", "model-12-21"],
    label: "Model 12 — In Service",
  },
  {
    id: "m12-timecode", kind: "timecode", sec: 12, unit: "model12",
    label: "MIDI · MTC · SPP",
  },

  {
    id: "shared", kind: "statement", sec: 8,
    label: "What The Two Share",
    hero: "THE DESK DRIVES THE ROOM",
    body: ["Transport, record-arm and master clock, generated on the console rather than at the screen."],
  },
  { id: "outro", kind: "outro", sec: 13 },
];
