/**
 * REEL 3 — "THE TRANSPARENT BRIDGE"  ·  178 s  ·  1080 x 1920
 *
 * The Studio Bridge, standalone. Stage 7 says it "earns its own phase" rather
 * than being folded into the console arc, and this reel is the short-form
 * equivalent of that phase: its DB25 / line-level identity, its zero-preamp
 * transparency claim, its role as a graft onto a legacy analog desk, and its
 * own distinct buyer (Stage 2's engineer who already owns a world-class desk
 * and a rack of boutique preamps).
 *
 * THIS REEL USES NONE OF THE 17 GEMINI CLIPS, deliberately. Not one of them
 * depicts a rack-mounted, preamp-less, multi-pin bridging unit — they were
 * written around consoles — and Section 0.3 is explicit that a clip should not
 * be forced into a Studio Bridge beat its content does not genuinely fit. The
 * reel draws instead on the unit's own photography, its four signal-flow
 * reference diagrams, and the DB25 Injection motion graphic, which is exactly
 * the fallback Section 0.3 anticipates.
 *
 * The Tri-Path Splitter never appears here: the Studio Bridge has no
 * preamplification stage to split a signal from (Stage 3).
 */
import type { Beat } from "./shared/beat.ts";

export const BEATS: Beat[] = [
  {
    id: "hook", kind: "macro", sec: 10, unit: "studiobridge", images: ["studio-bridge-7"],
    focus: [0.5, 0.52], phase: "R3",
    label: "TASCAM Studio Bridge",
    hero: "NO PREAMPS",
  },
  {
    id: "problem", kind: "statement", sec: 20,
    label: "A Different Bottleneck",
    hero: "YOU ALREADY OWN THE DESK",
    body: [
      "The console is world-class. The outboard preamps are chosen, matched and paid for.",
      "What is missing is 24-track capture and DAW transport — without buying another set of preamps to get them.",
    ],
  },
  {
    id: "declaration", kind: "unit", sec: 16, unit: "studiobridge", images: ["studio-bridge-5"],
    label: "Tier 4",
    hero: "NOT A CONSOLE",
    sub: "No preamplifiers, no faders, no channel strips, no summing bus. A 24-in / 24-out line-level bridge.",
  },
  {
    id: "db25", kind: "db25", sec: 32, unit: "studiobridge",
    label: "The DB25 Injection — AES59-2012",
  },
  {
    id: "detail", kind: "macro", sec: 12, unit: "studiobridge", images: ["studio-bridge-16"],
    focus: [0.5, 0.58],
    label: "Hardware Transport",
    hero: "HUI/MCU EMULATION",
    sub: "Rec, play, stop and record-arm, commanded from the rack.",
  },
  {
    id: "transparency", kind: "specs", sec: 16, unit: "studiobridge", images: ["studio-bridge-2"],
    label: "Verified Specification",
    hero: "THD+N <= 0.003 %",
    specKeys: ["Preamp Topology", "Input/Output Topology", "Impedance", "Dynamic Range"],
  },
  {
    id: "graft", kind: "schematic", sec: 18, unit: "studiobridge",
    images: ["studio-bridge-18", "studio-bridge-21"],
    label: "The Graft, In Practice",
    hero: "WITH OR WITHOUT A DAW",
    sub: "The same engine serves a hosted session, a computer-free capture, or an outboard preamp rack.",
  },
  {
    id: "rack", kind: "macro", sec: 12, unit: "studiobridge", images: ["studio-bridge-6"],
    focus: [0.5, 0.5],
    label: "6U Rack-Mountable",
    hero: "24 x 24 DB25",
    sub: "Six multi-pin connectors in place of forty-eight discrete cables.",
  },
  {
    id: "context", kind: "montage", sec: 16, unit: "studiobridge",
    images: ["studio-bridge-11", "studio-bridge-13", "studio-bridge-15", "studio-bridge-17"],
    label: "Studio Bridge — In Service",
    hero: "MIDI · MTC · SPP",
  },
  {
    id: "close", kind: "statement", sec: 14,
    label: "The Transparent Digital Graft",
    hero: "MODERNISED, NOT REPLACED",
    body: [
      "The desk keeps its signal path. The room gains 24-track capture, USB interfacing and transport control.",
    ],
  },
  { id: "outro", kind: "outro", sec: 12 },
];
