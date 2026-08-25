/**
 * THE 898-SECOND LONG-FORM SCHEDULE.
 *
 * The backbone is Stage 7's storytelling arc, used literally as the segment
 * structure rather than paraphrased:
 *
 *   Phase 1  The Problem            0:00 - 2:00   120s  (13.4% of runtime)
 *   Phase 2  The Tri-Path Solution  2:00 - 11:20  560s
 *              2.0 architecture core        90s
 *              2.1 Model 12    Tier 1      120s
 *              2.2 Model 16    Tier 2a     100s
 *              2.3 Model 24    Tier 2b     105s
 *              2.4 Model 2400  Tier 3      145s   <- most depth, per Stage 4
 *   Phase 3  The Transparent Graft 11:20 - 13:50  150s  <- its own phase
 *   Phase 4  Resolution           13:50 - 14:58   68s
 *                                              total 898s
 *
 * Phase 2 escalates in the brief's own stated order — "from the sub-compact
 * telecommunications routing of the Model 12 up to the massive analog
 * subgrouping and insert capabilities of the flagship Model 2400" — not an
 * arbitrary sequence. Phase 3 is a dedicated phase because Stage 7 says the
 * Studio Bridge "earns its own phase" rather than being forced into the console
 * arc. Phase 4 pivots off hardware entirely onto engineering credibility.
 *
 * Every `hero` string traces to a Stage 8 master-table value.
 */
import type { Beat } from "./shared/beat.ts";

export const BEATS: Beat[] = [
  /* ==================================================== PHASE 1 — 120s ==== */
  {
    id: "cold", kind: "cold", sec: 12, clip: 9, phase: "P1",
    label: "Phase 01 — The Problem",
    hero: "THE ROUND TRIP",
  },
  {
    id: "p1-phase", kind: "statement", sec: 14,
    label: "Phase Coherence",
    hero: "LATENCY IS NOT AN INCONVENIENCE",
    body: [
      "It is a disruption of phase coherence — a monitor path that no longer agrees with the source it came from.",
    ],
  },
  {
    id: "p1-tactile", kind: "macro", sec: 16, images: ["model-24-13"], focus: [0.44, 0.52],
    label: "Tactile Deprivation",
    hero: "MIXED IN A BOX",
    sub: "A mouse resolves one parameter at a time. A console resolves as many as the engineer has fingers.",
  },
  {
    id: "p1-compromise", kind: "repr", sec: 18, clip: 10,
    label: "The Engineering Limitation",
    hero: "TWO ROOMS",
    sub: "Outboard analog on one side. A digital timeline on the other. Merging them has historically meant choosing one.",
  },
  {
    id: "p1-tworooms", kind: "montage", sec: 16, images: ["model-24-17", "model-24-19"],
    label: "The Structural Difficulty",
    hero: "ONE COMPROMISE",
  },
  {
    id: "p1-thesis", kind: "statement", sec: 18,
    label: "The Question",
    hero: "WHY CHOOSE AT ALL",
    body: [
      "A signal does not have to be spent on a single destination.",
      "It can be split — at the point of amplification, before conversion — and sent to every destination at once.",
    ],
  },
  {
    id: "p1-close", kind: "montage", sec: 26, images: ["model-24-2", "model-12-13"],
    label: "TASCAM Model Series",
    hero: "FOUR CONSOLES. ONE ARCHITECTURE.",
  },

  /* ================================================== PHASE 2.0 — 90s ===== */
  {
    id: "p2-title", kind: "statement", sec: 10, phase: "P2",
    label: "Phase 02 — The Tri-Path Solution",
    hero: "THE TRI-PATH ARCHITECTURE",
    body: ["Model 12  ·  Model 16  ·  Model 24  ·  Model 2400"],
  },
  {
    id: "p2-cable", kind: "repr", sec: 12, clip: 1,
    label: "The Input Stage",
    hero: "ONE SIGNAL",
    sub: "A single analog source, arriving at a single connector.",
  },
  {
    id: "p2-preamp", kind: "macro", sec: 14, images: ["model-2400-13"], focus: [0.5, 0.46],
    unit: "model2400",
    label: "The Amplification Stage",
    hero: "ULTRA-HDDA",
    sub: "High Definition Discrete Architecture — the point at which the incoming signal is split.",
  },
  {
    id: "p2-graphic", kind: "tripath", sec: 28, unit: "model2400",
    label: "Signal Path — Three Simultaneous Destinations",
  },
  {
    id: "p2-ein", kind: "montage", sec: 12, images: ["model-16-15", "model-24-3"],
    label: "Noise Floor",
    hero: "-128 dBu EIN",
    sub: "Equivalent Input Noise, measured Rs=150 ohm at maximum gain.",
  },
  {
    id: "p2-simultaneous", kind: "repr", sec: 14, clip: 15,
    label: "Simultaneous, Not Sequential",
    hero: "ANALOG · SD · USB",
    sub: "The engineer never chooses between a live mixer, a field recorder and a studio interface.",
  },

  /* ================================================= PHASE 2.1 — 120s ===== */
  {
    id: "m12-intro", kind: "unit", sec: 14, unit: "model12", images: ["model-12-0"], phase: "M12",
    label: "Tier 1",
    hero: "MODEL 12",
    sub: "Sub-compact, digital-forward: the only unit in the smaller tiers that commands a DAW.",
  },
  {
    id: "m12-hero", kind: "macro", sec: 16, unit: "model12", images: ["model-12-5"], focus: [0.46, 0.5],
    hero: "10 ANALOG INPUTS",
    sub: "Eight XLR/TRS mono channels plus one TRRS/Bluetooth stereo pair.",
  },
  {
    id: "m12-specs", kind: "specs", sec: 18, unit: "model12", images: ["model-12-1"],
    label: "Verified Specification",
    hero: "12 TRACKS",
    specKeys: ["Input Channels", "Fader Travel", "Multitrack SD Recorder", "USB Audio Interface"],
  },
  {
    id: "m12-io", kind: "sweep", sec: 14, unit: "model12", images: ["model-12-18"],
    label: "Rear Panel",
    hero: "USB TYPE-C",
    sub: "12-in / 10-out, USB 2.0 High-Speed.",
  },
  {
    id: "m12-hui", kind: "montage", sec: 12, unit: "model12", images: ["model-12-10", "model-12-16"],
    label: "Stage 4 Priority 1",
    hero: "HUI/MCU EMULATION",
    sub: "60 mm fader movement translated into digital automation data.",
  },
  {
    id: "m12-timecode", kind: "timecode", sec: 20, unit: "model12",
    label: "MIDI · MTC · SPP",
  },
  {
    id: "m12-mixminus", kind: "schematic", sec: 16, unit: "model12", images: ["model-12-8"],
    label: "Stage 4 Priority 2",
    hero: "TRRS MIX-MINUS",
    sub: "Bidirectional telecommunications routing without an acoustic feedback loop.",
  },
  {
    id: "m12-close", kind: "montage", sec: 10, unit: "model12",
    images: ["model-12-2", "model-12-22", "model-12-19"],
    label: "Model 12 — Workflow",
  },

  /* ================================================= PHASE 2.2 — 100s ===== */
  {
    id: "m16-intro", kind: "unit", sec: 14, unit: "model16", images: ["model-16-0"], phase: "M16",
    label: "Tier 2",
    hero: "MODEL 16",
    sub: "Classic analog-forward: a traditional desk with integrated digital capture.",
  },
  {
    id: "m16-hero", kind: "macro", sec: 16, unit: "model16", images: ["model-16-4"], focus: [0.5, 0.5],
    hero: "14 ANALOG INPUTS",
    sub: "Ten Ultra-HDDA mic preamps, twelve TRS line inputs, one stereo pair.",
  },
  { id: "m16-video", kind: "realvideo", sec: 16, unit: "model16", video: "model-16-video", hero: "16 TRACKS" },
  {
    id: "m16-specs", kind: "specs", sec: 16, unit: "model16", images: ["model-16-13"],
    label: "Verified Specification",
    hero: "16-IN / 14-OUT",
    specKeys: ["Input Channels", "Multitrack SD Recorder", "Frequency Response", "Power Consumption"],
  },
  {
    id: "m16-nodaw", kind: "statement", sec: 16, unit: "model16",
    label: "Tier 2 — A Deliberate Position",
    hero: "NO MIDI. NO HUI/MCU.",
    body: [
      "The Model 16 and Model 24 do not control a DAW, and are not intended to.",
      "They are traditional analog desks with integrated digital capture — computer-independent by design, not by omission.",
    ],
  },
  {
    id: "m16-live", kind: "repr", sec: 22, unit: "model16", clip: 17,
    label: "Zero-Latency Monitoring",
    hero: "NO COMPUTER IN THE ROOM",
    sub: "The monitor mix does not depend on a host, a driver, or a buffer setting.",
  },

  /* ================================================= PHASE 2.3 — 105s ===== */
  {
    id: "m24-intro", kind: "unit", sec: 14, unit: "model24", images: ["model-24-11"], phase: "M24",
    label: "Tier 2",
    hero: "MODEL 24",
    sub: "The same architecture and the same tier as the Model 16, at large-format scale.",
  },
  {
    id: "m24-hero", kind: "macro", sec: 16, unit: "model24", images: ["model-24-4"], focus: [0.46, 0.52],
    hero: "100 mm FADERS",
    sub: "Long-throw travel: finer resolution per millimetre of hand movement.",
  },
  { id: "m24-video", kind: "realvideo", sec: 13, unit: "model24", video: "model-24-video", hero: "22 ANALOG INPUTS" },
  {
    id: "m24-specs", kind: "specs", sec: 16, unit: "model24", images: ["model-24-1"],
    label: "Verified Specification",
    hero: "24 TRACKS",
    specKeys: ["Input Channels", "Fader Travel", "Multitrack SD Recorder", "USB Audio Interface", "Weight"],
  },
  {
    id: "m24-density", kind: "repr", sec: 16, unit: "model24", clip: 6,
    label: "Stage 4 Priority 1",
    hero: "24-TRACK SDXC",
    sub: "Twenty-two inputs plus the stereo mix, captured without a host computer.",
  },
  {
    id: "m24-io", kind: "sweep", sec: 14, unit: "model24", images: ["model-24-21"],
    label: "Rear Panel",
    hero: "24-IN / 22-OUT",
  },
  {
    id: "m24-context", kind: "montage", sec: 16, unit: "model24",
    images: ["model-24-15", "model-24-18", "model-24-case-study-1", "model-24-case-study"],
    label: "Model 24 — In Service",
  },

  /* ================================================= PHASE 2.4 — 145s ===== */
  {
    id: "m2400-escalation", kind: "repr", sec: 12, clip: 16, phase: "M2400",
    label: "The Range, To Scale",
    hero: "FOUR TIERS",
    sub: "Physical scale rises across the range; the underlying architecture does not change.",
  },
  {
    id: "m2400-bridge", kind: "macro", sec: 10, images: ["model-24-vs-model-2400"], focus: [0.5, 0.5],
    label: "Tier 2 to Tier 3",
    hero: "THE SYNTHESIS",
  },
  {
    id: "m2400-intro", kind: "unit", sec: 12, unit: "model2400", images: ["model-2400"],
    label: "Tier 3",
    hero: "MODEL 2400",
    sub: "The flagship: Model 24's analog scale combined with Model 12's DAW and MIDI integration.",
  },
  {
    id: "m2400-hero", kind: "macro", sec: 14, unit: "model2400", images: ["model-2400-1"], focus: [0.44, 0.5],
    hero: "22 ANALOG INPUTS",
    sub: "Twelve Ultra-HDDA preamps and four standard mic preamps on 100 mm faders.",
  },
  { id: "m2400-video", kind: "realvideo", sec: 22, unit: "model2400", video: "model-2400-video", hero: "24 TRACKS" },
  {
    id: "m2400-subgroups", kind: "macro", sec: 15, unit: "model2400",
    images: ["model-24-case-study-4"], focus: [0.28, 0.76],
    label: "Stage 4 Priority 1",
    hero: "4 SUBGROUPS · 5 AUX",
    sub: "Routing sophistication neither Tier 2 console carries: four stereo subgroups, five aux sends, a dedicated master bus insert loop.",
  },
  {
    id: "m2400-inserts", kind: "repr", sec: 12, unit: "model2400", clip: 3,
    label: "Hardware Insert Topology",
    hero: "THE INSERT BANK",
    sub: "Outboard processing committed in the analog domain, before conversion.",
  },
  {
    id: "m2400-masterbus", kind: "macro", sec: 12, unit: "model2400", images: ["model-2400-9"], focus: [0.32, 0.4],
    label: "Master Section",
    hero: "MASTER BUS",
  },
  {
    id: "m2400-io", kind: "sweep", sec: 12, unit: "model2400", images: ["model-2400-10"],
    label: "Rear Panel",
    hero: "24-IN / 22-OUT",
    sub: "Main output, main send/return, control room, five aux outputs, sub outputs, click, footswitch and 5-pin DIN MIDI.",
  },
  {
    id: "m2400-timecode", kind: "timecode", sec: 14, unit: "model2400",
    label: "Stage 4 Priority 2 — MIDI · MTC · Click Tempo Control",
  },
  {
    id: "m2400-close", kind: "montage", sec: 10, unit: "model2400",
    images: ["model-2400-3", "model-2400-16", "model-2400-12", "model-2400-4", "model-2400-14"],
    label: "Model 2400 — Flagship",
  },

  /* =================================================== PHASE 3 — 150s ===== */
  {
    id: "p3-pivot", kind: "statement", sec: 14, phase: "P3",
    label: "Phase 03 — The Transparent Graft",
    hero: "NOT A FIFTH CONSOLE",
    body: [
      "The Studio Bridge has no preamplifiers, no faders, no channel strips and no summing bus.",
      "It does not participate in the Tri-Path Architecture, because it has no amplification stage to split a signal from.",
    ],
  },
  {
    id: "p3-intro", kind: "unit", sec: 14, unit: "studiobridge", images: ["studio-bridge-1"],
    label: "Tier 4",
    hero: "STUDIO BRIDGE",
    sub: "A 24-in / 24-out line-level bridge for an analog desk that already exists.",
  },
  {
    id: "p3-rack", kind: "macro", sec: 16, unit: "studiobridge", images: ["studio-bridge-3"], focus: [0.5, 0.5],
    label: "6U Rack-Mountable",
    hero: "NO PREAMPS",
    sub: "Direct line-level A/D. The impedance and harmonic character of the engineer's existing front end reach conversion unaltered.",
  },
  {
    id: "p3-return", kind: "repr", sec: 12, unit: "studiobridge", clip: 4,
    label: "The Return Path",
    hero: "LINE LEVEL, BOTH WAYS",
    sub: "Twenty-four out to the desk, twenty-four back — the same level, the same standard.",
  },
  {
    id: "p3-db25", kind: "db25", sec: 28, unit: "studiobridge",
    label: "The DB25 Injection — 24 Lanes, AES59-2012",
  },
  {
    id: "p3-connectors", kind: "sweep", sec: 14, unit: "studiobridge", images: ["studio-bridge-4"],
    label: "Rear Panel",
    hero: "24 x 24 DB25",
    sub: "Six multi-pin connectors carrying twenty-four line-level inputs and twenty-four outputs.",
  },
  {
    id: "p3-transparency", kind: "specs", sec: 18, unit: "studiobridge", images: ["studio-bridge-14"],
    label: "Verified Specification",
    hero: "THD+N <= 0.003 %",
    specKeys: ["Preamp Topology", "Input/Output Topology", "Impedance", "Dynamic Range"],
  },
  {
    id: "p3-graft", kind: "schematic", sec: 18, unit: "studiobridge",
    images: ["studio-bridge-19", "studio-bridge-20"],
    label: "The Graft, In Practice",
    hero: "WITH OR WITHOUT A DAW",
    sub: "The same 24-track engine serves a hosted session and a computer-free one.",
  },
  {
    id: "p3-context", kind: "montage", sec: 16, unit: "studiobridge",
    images: ["studio-bridge-12", "studio-bridge-10", "studio-bridge-9"],
    label: "Studio Bridge — In Service",
    hero: "MIDI · MTC · SPP",
  },

  /* ==================================================== PHASE 4 — 68s ===== */
  {
    id: "p4-statement", kind: "statement", sec: 16, phase: "P4",
    label: "Phase 04 — Resolution",
    hero: "ARCHITECTURE, NOT INVENTORY",
    body: [
      "Deploying a hybrid room is a systems problem: gain structure, clocking, conversion, and the routing that holds them together.",
      "Shivansh Electronics architects, deploys and supports these systems.",
    ],
  },
  {
    id: "p4-family", kind: "montage", sec: 22,
    images: ["model-12-3", "model-16-7", "model-24-9", "model-2400-2", "studio-bridge-8"],
    label: "Four Consoles · One Bridge",
    hero: "THE COMPLETE RANGE",
  },
  { id: "p4-outro", kind: "outro", sec: 30 },
];
