/**
 * REEL 1 — "THE TRI-PATH SURVEY"  ·  178 s  ·  1080 x 1920
 *
 * All four consoles, compressed: the reel-length equivalent of the long-form's
 * Phase 1 + Phase 2 arc. Its subject is the shared signal-splitting mechanism
 * that unifies the Model 12, 16, 24 and 2400 despite their genuine tier
 * differences — so the Tri-Path Splitter carries the centre of the reel, and
 * each console is introduced by its tier rather than by size alone.
 *
 * The Model 16 and Model 24 get their dedicated depth here and in the
 * long-form's Phase 2 rather than in a standalone reel, which reflects their
 * Stage 4 narrative weight (one ranked priority feature each, against two for
 * the Model 2400 and two for the Model 12) rather than an oversight.
 */
import type { Beat } from "./shared/beat.ts";

export const BEATS: Beat[] = [
  {
    id: "hook", kind: "cold", sec: 8, clip: 14, phase: "R1",
    label: "TASCAM Model Series",
    hero: "ONE SIGNAL. THREE DESTINATIONS.",
  },
  {
    id: "problem", kind: "statement", sec: 10,
    label: "The Bottleneck",
    hero: "CHOOSE ONE",
    body: [
      "Mix live, record standalone, or track into a DAW. Historically, one at a time.",
    ],
  },
  {
    id: "tripath", kind: "tripath", sec: 20, unit: "model2400",
    label: "The Tri-Path Architecture",
  },
  {
    id: "tactile", kind: "repr", sec: 10, clip: 2,
    label: "Path 1 — Analog",
    hero: "ZERO LATENCY",
    sub: "Straight to the summing bus, with no conversion in the monitor path.",
  },
  {
    id: "sdpath", kind: "repr", sec: 10, clip: 5,
    label: "Path 2 — SDXC",
    hero: "24-BIT / 48 kHz",
    sub: "Written to solid-state media with no host computer involved.",
  },

  {
    id: "m12-card", kind: "unit", sec: 9, unit: "model12", images: ["model-12-6"],
    label: "Tier 1",
    hero: "MODEL 12",
    sub: "10 inputs · 12 tracks · 60 mm faders",
  },
  {
    id: "m12-set", kind: "montage", sec: 10, unit: "model12",
    images: ["model-12-4", "model-12-7", "model-12-9", "model-12-17"],
    hero: "12-IN / 10-OUT",
  },

  {
    id: "m16-card", kind: "unit", sec: 9, unit: "model16", images: ["model-16-6"],
    label: "Tier 2",
    hero: "MODEL 16",
    sub: "14 inputs · 16 tracks · no MIDI, no DAW transport",
  },
  {
    id: "m16-pure", kind: "repr", sec: 10, clip: 12,
    label: "Computer-Independent",
    hero: "NO HOST REQUIRED",
    sub: "Tier 2 is a traditional analog desk with integrated digital capture — by design.",
  },
  {
    id: "m16-set", kind: "montage", sec: 10, unit: "model16",
    images: ["model-16-1", "model-16-10", "model-16-11", "model-16-12"],
    hero: "16-IN / 14-OUT",
  },
  {
    id: "m16-set2", kind: "montage", sec: 9, unit: "model16",
    images: ["model-16-14", "model-16-2", "model-16-3", "model-16-5", "model-16-8", "model-16-9"],
    label: "Model 16 — In Service",
  },

  {
    id: "m24-card", kind: "unit", sec: 9, unit: "model24", images: ["model-24-6"],
    label: "Tier 2",
    hero: "MODEL 24",
    sub: "22 inputs · 24 tracks · 100 mm faders",
  },
  {
    id: "m24-set", kind: "montage", sec: 10, unit: "model24",
    images: ["model-24-10", "model-24-12", "model-24-5", "model-24-7"],
    hero: "24-IN / 22-OUT",
  },
  {
    id: "m24-set2", kind: "montage", sec: 9, unit: "model24",
    images: ["model-24-8", "model-24-case-study-2", "model-24-case-study-3"],
    label: "Model 24 — In Service",
  },

  {
    id: "m2400-card", kind: "unit", sec: 9, unit: "model2400", images: ["model-2400-6"],
    label: "Tier 3",
    hero: "MODEL 2400",
    sub: "22 inputs · 4 subgroups · 5 aux · HUI/MCU + MIDI",
  },
  {
    id: "m2400-set", kind: "macro", sec: 10, unit: "model2400", images: ["model-2400-7"],
    focus: [0.5, 0.5],
    hero: "24 TRACKS",
  },

  {
    id: "recap", kind: "statement", sec: 8,
    label: "Four Tiers, One Architecture",
    hero: "-128 dBu EIN",
    body: ["Ultra-HDDA across the range, split three ways at the preamp stage."],
  },
  { id: "outro", kind: "outro", sec: 8 },
];
