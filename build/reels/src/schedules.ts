/**
 * THE THREE REEL SCHEDULES — 178 seconds each, portrait.
 *
 * NOT EXCERPTS. Section 2 asks for three reels, and the cheap way to make them
 * is to cut three windows out of the long-form. That produces three videos that
 * each begin mid-argument. Instead each reel takes ONE of the long-form's
 * claims and runs it to a conclusion of its own, so a viewer who sees only one
 * reel still gets a complete thought — and a viewer who sees all four never
 * sees the same sequence twice.
 *
 *   REEL 1  THE TRI-PATH SURVEY      the mechanism, across all four consoles
 *   REEL 2  THE FLAGSHIP AND THE SPECIALIST   Model 2400 against Model 12:
 *                                     the same control surface at two scales
 *   REEL 3  THE TRANSPARENT BRIDGE   the unit with no preamp, and why that is
 *                                     the interesting one
 *
 * PORTRAIT IS NOT A CROP. Every beat here is laid out for 1080x1920 by the
 * shared scene library's portrait branch, and everything sits inside the
 * 180/220 caption-safe band. The B-roll draws from the pre-cropped portrait
 * masters, never from a landscape master squeezed to fit.
 */
import type { Beat } from "./shared/beat.ts";

// ---------------------------------------------------------------------------
// REEL 1 — THE TRI-PATH SURVEY
// ---------------------------------------------------------------------------
export const REEL1: Beat[] = [
  { id: "r1-cold", kind: "cold", sec: 10, phase: "OPEN",
    hero: "One preamp.\nThree destinations.",
    sub: "How the TASCAM Model series moves a signal." },
  { id: "r1-broll", kind: "broll", sec: 8, phase: "OPEN", clip: 1, clipFrom: 0.6,
    label: "TASCAM MODEL SERIES", hero: "Mixed, recorded and streamed at once." },
  { id: "r1-claim", kind: "statement", sec: 13, phase: "CLAIM",
    label: "THE MECHANISM", hero: "Amplified once.\nUsed three times.",
    body: [
      "One Ultra-HDDA stage amplifies the channel.",
      "That signal reaches the mix bus, the SD recorder and USB together.",
      "Nothing is re-amplified and nothing is converted twice.",
    ] },
  { id: "r1-concept", kind: "tripath", sec: 18, phase: "CLAIM", unit: "model12",
    label: "TRI-PATH ARCHITECTURE", hero: "Where one becomes three." },
  { id: "r1-m12", kind: "hero", sec: 14, phase: "SURVEY", unit: "model12",
    images: ["model-12-0"], sub: "The smallest chassis, with the most control.",
    specKeys: ["Input Channels", "Multitrack SD Recorder"] },
  { id: "r1-m16", kind: "hero", sec: 14, phase: "SURVEY", unit: "model16",
    images: ["model-16-0"], sub: "Analog-forward, sixteen tracks.",
    specKeys: ["Input Channels", "Multitrack SD Recorder"] },
  { id: "r1-m24", kind: "hero", sec: 14, phase: "SURVEY", unit: "model24",
    images: ["model-24-1"], sub: "The same design, at twenty-four tracks.",
    specKeys: ["Input Channels", "Multitrack SD Recorder"] },
  { id: "r1-m2400", kind: "hero", sec: 14, phase: "SURVEY", unit: "model2400",
    images: ["model-2400"], sub: "Every path at full width.",
    specKeys: ["Input Channels", "Multitrack SD Recorder"] },
  { id: "r1-ein", kind: "compare", sec: 15, phase: "PROOF",
    label: "EQUIVALENT INPUT NOISE", hero: "Identical at the input.",
    units: ["model12", "model16", "model24", "model2400"],
    specKeys: ["Equivalent Input Noise (EIN)"] },
  { id: "r1-usb", kind: "compare", sec: 15, phase: "PROOF",
    label: "USB INTERFACE", hero: "Different in what follows.",
    units: ["model12", "model16", "model24", "model2400"],
    specKeys: ["USB Audio Interface"] },
  { id: "r1-editorial", kind: "editorial", sec: 9, phase: "CLOSE", clip: 3,
    hero: "Choose by the destinations.",
    sub: "The preamp is the same. Count what it has to feed." },
  { id: "r1-close", kind: "statement", sec: 11, phase: "CLOSE",
    label: "TASCAM MODEL SERIES", hero: "One architecture.\nFour answers." },
  { id: "r1-end", kind: "outro", sec: 23, phase: "CLOSE" },
];

// ---------------------------------------------------------------------------
// REEL 2 — THE FLAGSHIP AND THE SPECIALIST
// ---------------------------------------------------------------------------
export const REEL2: Beat[] = [
  { id: "r2-cold", kind: "cold", sec: 10, phase: "OPEN",
    hero: "The biggest desk\nand the smallest\nshare a trick.",
    sub: "Model 2400 and Model 12." },
  { id: "r2-broll", kind: "broll", sec: 8, phase: "OPEN", clip: 9, clipFrom: 0.4,
    label: "TASCAM", hero: "Both of them control the DAW they feed." },
  { id: "r2-m2400", kind: "hero", sec: 15, phase: "FLAGSHIP", unit: "model2400",
    images: ["model-2400"], sub: "Twenty-two inputs, twenty-four tracks.",
    specKeys: ["Input Channels", "DAW Control"] },
  { id: "r2-2400macro", kind: "macro", sec: 13, phase: "FLAGSHIP", unit: "model2400",
    images: ["model-2400-4"], label: "100 MM FADERS",
    hero: "Full-size travel.", sub: "Resolution you can feel under the finger.",
    specKeys: ["Fader Travel"] },
  { id: "r2-m12", kind: "hero", sec: 15, phase: "SPECIALIST", unit: "model12",
    images: ["model-12-0"], sub: "Ten inputs, twelve tracks, on a desk.",
    specKeys: ["Input Channels", "DAW Control"] },
  { id: "r2-12macro", kind: "macro", sec: 13, phase: "SPECIALIST", unit: "model12",
    images: ["model-12-11"], label: "60 MM FADERS",
    hero: "The same job, smaller.", sub: "HUI and MCU emulation, in this chassis.",
    specKeys: ["Fader Travel"] },
  { id: "r2-timecode", kind: "timecode", sec: 17, phase: "SHARED", unit: "model2400",
    label: "MIDI TIMECODE", hero: "Both lock to the room." },
  { id: "r2-compare", kind: "compare", sec: 15, phase: "SHARED",
    label: "INPUT CHANNELS", hero: "What actually separates them.",
    units: ["model12", "model2400"], specKeys: ["Input Channels"] },
  { id: "r2-statement", kind: "statement", sec: 13, phase: "SHARED",
    label: "THE REAL DIFFERENCE", hero: "Not capability.\nCapacity.",
    body: [
      "Both emulate HUI and MCU. Both carry MIDI timecode.",
      "Both put the same Ultra-HDDA preamp in front of the same three paths.",
      "One does it for ten channels. One does it for twenty-two.",
    ] },
  { id: "r2-montage", kind: "montage", sec: 16, phase: "SHARED",
    label: "TWO SURFACES", hero: "Same controls, two scales.",
    images: ["model-2400-11", "model-12-16"] },
  { id: "r2-editorial", kind: "editorial", sec: 9, phase: "CLOSE", clip: 5,
    hero: "Pick the size of the room.",
    sub: "The architecture comes with either one." },
  { id: "r2-close", kind: "statement", sec: 11, phase: "CLOSE",
    label: "MODEL 2400 · MODEL 12", hero: "Same architecture.\nTwo scales." },
  { id: "r2-end", kind: "outro", sec: 23, phase: "CLOSE" },
];

// ---------------------------------------------------------------------------
// REEL 3 — THE TRANSPARENT BRIDGE
// ---------------------------------------------------------------------------
export const REEL3: Beat[] = [
  { id: "r3-cold", kind: "cold", sec: 10, phase: "OPEN",
    hero: "This one has\nno preamps\nat all.",
    sub: "The TASCAM Studio Bridge." },
  { id: "r3-broll", kind: "broll", sec: 8, phase: "OPEN", clip: 11, clipFrom: 0.5,
    label: "STUDIO BRIDGE", hero: "Line level in. Line level out." },
  { id: "r3-hero", kind: "hero", sec: 15, phase: "UNIT", unit: "studiobridge",
    images: ["studio-bridge-1"],
    sub: "Twenty-four channels each way, and nothing amplifying them.",
    specKeys: ["Preamp Topology", "Input/Output Topology"] },
  { id: "r3-db25", kind: "db25", sec: 20, phase: "UNIT", unit: "studiobridge",
    label: "DB25 INJECTION", hero: "Twenty-four in, twenty-four out." },
  { id: "r3-statement", kind: "statement", sec: 14, phase: "WHY", hero: "That is the feature.",
    label: "WHY NO PREAMP", body: [
      "Your console already has preamps you chose deliberately.",
      "The Studio Bridge does not put a second stage in front of them.",
      "It converts, records and streams what you already have.",
    ] },
  { id: "r3-macro", kind: "macro", sec: 13, phase: "WHY", unit: "studiobridge",
    images: ["studio-bridge-8"], label: "RACK FORMAT",
    hero: "It disappears into the rack.",
    sub: "Six rack units with the optional kit.",
    specKeys: ["Mounting", "Weight"] },
  { id: "r3-specs", kind: "specs", sec: 16, phase: "PROOF", unit: "studiobridge",
    images: ["studio-bridge-13"],
    specKeys: ["Dynamic Range", "Total Harmonic Distortion (THD+N)",
               "Multitrack SD Recorder", "USB Audio Interface"] },
  { id: "r3-compare", kind: "compare", sec: 15, phase: "PROOF",
    label: "USB INTERFACE", hero: "Widest path in the range.",
    units: ["model12", "model24", "studiobridge"],
    specKeys: ["USB Audio Interface"] },
  { id: "r3-montage", kind: "montage", sec: 12, phase: "PROOF",
    label: "STUDIO BRIDGE", hero: "Connector-dense, by design.",
    images: ["studio-bridge-16", "studio-bridge-18"] },
  { id: "r3-sweep", kind: "sweep", sec: 12, phase: "PROOF", unit: "studiobridge",
    images: ["studio-bridge-4"], label: "TWO PAIRS EACH WAY",
    hero: "Two DB25 in, two DB25 out.",
    specKeys: ["Input/Output Topology"] },
  { id: "r3-editorial", kind: "editorial", sec: 9, phase: "CLOSE", clip: 12,
    hero: "The link, not the source.",
    sub: "Between the console you have and the system you need." },
  { id: "r3-close", kind: "statement", sec: 11, phase: "CLOSE",
    label: "TASCAM STUDIO BRIDGE", hero: "The link.\nNot the source." },
  { id: "r3-end", kind: "outro", sec: 23, phase: "CLOSE" },
];

export const REELS = { reel1: REEL1, reel2: REEL2, reel3: REEL3 } as const;
export type ReelId = keyof typeof REELS;
