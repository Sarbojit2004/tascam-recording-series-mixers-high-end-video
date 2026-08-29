/**
 * DESIGN TOKENS — TASCAM Model Series & Studio Bridge.
 *
 * PROVENANCE (Section 1). Every neutral, structural, radius and spacing value
 * below is pulled UNCHANGED from the MOTU M-Series long-form build's committed
 * `longform/src/theme.ts`, which in turn carries the MOTU AVB ecosystem
 * long-form's values unchanged. Nothing here is re-derived, and nothing is
 * taken from this repository's own superseded TASCAM build.
 *
 * ONE DELIBERATE DEPARTURE, stated rather than hidden: the MOTU palette's
 * primary accent is `motuBlue #0B5FD0`, MOTU's own brand colour. Carrying a
 * competitor's brand blue through a TASCAM production would be odd on its face
 * and sits badly against the no-other-brand rule. The accent is re-pointed to a
 * burnt amber drawn from TASCAM's own panel hardware — their gold master
 * sections and amber indicators. Contrast re-checked on the near-white ground.
 * `signal` and `alert` stay exactly as MOTU had them: they are semantic (meter
 * green, problem-chapter red), not brand marks.
 */

export const LANDSCAPE = { width: 1920, height: 1080, fps: 30, seconds: 898 } as const;
export const PORTRAIT = { width: 1080, height: 1920, fps: 30, seconds: 178 } as const;

export const LONGFORM_FRAMES = LANDSCAPE.fps * LANDSCAPE.seconds; // 26940
export const REEL_FRAMES = PORTRAIT.fps * PORTRAIT.seconds; //  5340

export const COLORS = {
  // Light ground — every scene, whole runtime, no exceptions (Section 1).
  paper: "#F6F8FA",
  paperLift: "#FDFEFE",
  paperEdge: "#EFF2F6",
  paperWell: "#E7EBF1",

  // Type — contrast ratios measured against `paper`.
  ink: "#0E1116",      // 17.9:1
  inkSoft: "#20272F",  // 12.6:1
  slate: "#48525F",    //  7.6:1 — muted subheadline
  slateDim: "#6B7684", //  4.6:1 — micro-labels only, never body

  // Accents
  accent: "#8A3A12",      //  7.4:1 — TASCAM panel amber, deep enough for body-adjacent type
  accentSoft: "#B4610A",  //  4.9:1 — animated spec counters
  signal: "#00845F",      //  4.8:1 — the LCD meter green (semantic, from MOTU)
  signalBright: "#00A67E",// glow / decorative only
  alert: "#B32218",       //  6.1:1 — the Problem chapter only (semantic, from MOTU)

  // Signal-path coding for the Stage 6 demonstratives
  pathAnalog: "#8A3A12",
  pathSD: "#00845F",
  pathUSB: "#1F5FA8",

  // Structure
  line: "rgba(14,17,22,0.12)",
  lineStrong: "rgba(14,17,22,0.24)",
  shadow: "rgba(14,17,22,0.10)",
} as const;

export const RADII = { card: 28, plate: 20, chip: 999, sm: 12 } as const;

/**
 * LANDSCAPE EDGE PADDING — the AVB long-form's proven 56 / 52, reaching this
 * build through the M-Series long-form. Inboard padding that keeps critical
 * text alive through downstream cropping or re-encode. Ambient and background
 * imagery may still bleed to the true edge.
 */
export const SPACE = {
  marginX: 56,
  marginY: 52,
  contentW: LANDSCAPE.width - 56 * 2,  // 1808
  contentH: LANDSCAPE.height - 52 * 2, //  976
} as const;

/**
 * PORTRAIT CAPTION-SAFE ZONE — 180 / 220 / 64, the exact values proven across
 * the AVB portrait reels and carried unchanged into the M-Series portrait
 * build. Text, logos and callouts stay clear of the top 180px and bottom 220px
 * where platform UI sits. Background imagery MAY extend into those bands.
 */
export const SAFE = {
  top: 180,
  bottom: 220,
  marginX: 64,
  contentTop: 180,
  contentBottom: PORTRAIT.height - 220, // 1700
  contentH: PORTRAIT.height - 180 - 220, // 1520
  contentW: PORTRAIT.width - 64 * 2,     //  952
} as const;

export const TIMING = { transition: 14, in: 12, hold: 8, out: 10 } as const;
