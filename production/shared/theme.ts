/**
 * VISUAL SYSTEM — Stage 5 (clinical, low-key, high-contrast).
 *
 * DELIBERATELY NOT PULLED FROM THE MOTU AVB REFERENCE: the palette and the
 * type-system colour values. AVB runs a light ground (#F2F1ED) with dark ink;
 * Stage 5 here mandates the inverse — "hardware subjects must be isolated
 * against deep, pure black voids" lit by "highly directional, cool-temperature
 * edge lighting (e.g. 5600K rim lights)". Every contrast ratio below is
 * re-derived against this dark ground rather than inherited.
 *
 * PULLED FROM THE AVB REFERENCE UNCHANGED: the caption-safe zone and landscape
 * edge-padding pixel values. Those are format-mechanical (they describe where
 * platform UI sits and where re-encodes crop), not palette, so they transfer
 * regardless of the colour treatment.
 */

export const FPS = 30;

export const LANDSCAPE = { width: 1920, height: 1080 } as const;
export const PORTRAIT = { width: 1080, height: 1920 } as const;

/** Exact runtimes. 898 s and 178 s at 30 fps. */
export const LONGFORM_FRAMES = 898 * FPS; // 26,940
export const REEL_FRAMES = 178 * FPS; //  5,340

export const COLOR = {
  /** Stage 5's "deep, pure black void". */
  void: "#08090B",
  /** One step up, for seated plates and panels. */
  panel: "#101317",
  panelEdge: "#1B2027",

  /** 5600K rim light, rendered as structure rather than as a light source. */
  rim: "#5C6672",
  rimBright: "#8A96A4",

  /** Primary text. 16.4:1 on `void`. */
  ink: "#F2F5F8",
  /** Secondary / Level 2. 8.1:1 on `void`. */
  inkDim: "#A8B2BE",
  /** Data Ribbon "medium-grey tone" per Stage 10. 5.2:1 on `void`. */
  ribbon: "#7E8894",

  /** Stage 10 "technical amber" for Level 1 hero metrics. 9.3:1 on `void`. */
  amber: "#E8A33D",
  /** Console practicals only — these exist on the real hardware. */
  signal: "#3DD68C",
  peak: "#E5484D",

  line: "rgba(242,245,248,0.10)",
  lineStrong: "rgba(242,245,248,0.22)",
} as const;

/**
 * The three Tri-Path stream colours (Stage 6). Fixed across every deliverable
 * so the analog / SD / USB streams read identically wherever they appear.
 */
export const PATH = {
  analog: COLOR.amber,
  sd: COLOR.signal,
  usb: "#4C9AFF",
} as const;

/**
 * CAPTION-SAFE ZONE — pulled directly from the approved MOTU AVB reel build
 * (`compressed-reel/src/theme.ts`), unchanged. Narrative typography, callouts
 * and Level 1/2 text stay inside these bounds.
 */
export const SAFE = {
  top: 180,
  bottom: 220,
  marginX: 64,
  contentTop: 180,
  contentBottom: PORTRAIT.height - 220, // 1700
  contentH: PORTRAIT.height - 180 - 220, // 1520
  contentW: PORTRAIT.width - 64 * 2, // 952
} as const;

/**
 * LANDSCAPE EDGE PADDING — pulled directly from the approved AVB long-form
 * build (`longform/src/theme.ts`), unchanged. No reserved caption band in
 * landscape; marginX is the inboard padding that keeps critical text alive
 * through downstream crops and re-encodes.
 */
export const SPACE = {
  marginX: 56,
  marginY: 52,
  contentW: LANDSCAPE.width - 56 * 2, // 1808
} as const;

/**
 * Stage 10's Data Ribbon runs across "the extreme bottom edge of the frame".
 * It is persistent broadcast furniture, not narrative content, so it sits
 * outside the SAFE band above by design; SAFE continues to govern everything
 * the viewer has to read to follow the argument.
 */
export const RIBBON = {
  landscape: { height: 34, inset: 18, fontSize: 13, tracking: 1.7 },
  portrait: { height: 62, inset: 12, fontSize: 12.5, tracking: 0.55 },
} as const;

/** Shivansh watermark — Stage 10: top-right safe margin, 60% opacity, always. */
export const WATERMARK = {
  opacity: 0.6,
  landscape: { width: 188, top: 40, right: 56 },
  portrait: { width: 150, top: 54, right: 56 },
} as const;

export const RADII = { plate: 6, chip: 2, card: 10 } as const;

/**
 * Stage 5 forbids organic camera movement outright ("handheld, erratic, or
 * organic camera movements are strictly prohibited"), so every move in this
 * build is driven linearly at constant velocity. The AVB reference's spring /
 * eased gimbal float is deliberately NOT inherited — only the shot grammar is.
 */
export const TIMING = {
  transition: 20,
  in: 14,
  hold: 10,
  out: 12,
} as const;
