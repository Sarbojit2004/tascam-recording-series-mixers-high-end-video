/**
 * TYPE SYSTEM — pulled from the MOTU M-SERIES repository specifically, per
 * Section 1, which names that repository as the font source rather than AVB or
 * UltraLite-mk5/828 generically.
 *
 * Verified at build time: all three MOTU repositories declare the identical
 * pair, and the M-Series file documents that it inherited the system from the
 * AVB long-form. So the M-Series choice governs as instructed AND happens to
 * agree with the other two — there was no conflict to resolve.
 *
 * The balance, unchanged from that source: ARCHIVO (technical grotesque)
 * carries the weight — uppercase tracked headlines, spec callouts with tabular
 * numerals, micro-callouts. FRAUNCES (editorial serif) is held back for the
 * genuinely editorial moments: the Problem chapter and the Transformation beat.
 *
 * The four woff2 faces are copied verbatim from the M-Series repository's
 * `_shared/fonts/` by scripts/prepare_assets.py.
 */
import type React from "react";
import { staticFile } from "remotion";

export const DISPLAY = "Fraunces";
export const LABEL = "Archivo";

export const FONT_FACE_CSS = `
@font-face {
  font-family: 'Fraunces';
  src: url('${staticFile("fonts/fraunces-normal.woff2")}') format('woff2');
  font-weight: 100 900; font-style: normal; font-display: block;
}
@font-face {
  font-family: 'Fraunces';
  src: url('${staticFile("fonts/fraunces-italic.woff2")}') format('woff2');
  font-weight: 100 900; font-style: italic; font-display: block;
}
@font-face {
  font-family: 'Archivo';
  src: url('${staticFile("fonts/archivo-normal.woff2")}') format('woff2');
  font-weight: 100 900; font-style: normal; font-display: block;
}
@font-face {
  font-family: 'Archivo';
  src: url('${staticFile("fonts/archivo-italic.woff2")}') format('woff2');
  font-weight: 100 900; font-style: italic; font-display: block;
}
`;

export async function loadFonts(): Promise<void> {
  if (typeof document === "undefined" || !("fonts" in document)) return;
  const probes = [
    "400 32px Archivo", "500 32px Archivo", "600 32px Archivo",
    "700 32px Archivo", "800 32px Archivo", "900 32px Archivo",
    "400 32px Fraunces", "600 32px Fraunces", "700 32px Fraunces",
    "italic 500 32px Fraunces",
  ];
  await Promise.all(probes.map((p) => (document as Document).fonts.load(p)));
  await (document as Document).fonts.ready;
}

/** Headline: bold, dominant, uppercase tracking to project authority. */
export const headline = (size: number, weight = 800): React.CSSProperties => ({
  fontFamily: LABEL, fontWeight: weight, fontSize: size,
  lineHeight: 1.02, letterSpacing: "-0.015em", textTransform: "uppercase",
});

/** Subheadline: medium weight, muted slate, contextual not competing. */
export const subhead = (size: number, weight = 500): React.CSSProperties => ({
  fontFamily: LABEL, fontWeight: weight, fontSize: size,
  lineHeight: 1.28, letterSpacing: "0.002em",
});

/** Level 1 specification callout: tracked, tabular numerals so animated
 *  counters do not reflow as digits change. */
export const spec = (size: number, weight = 700, tracking = "0.10em"): React.CSSProperties => ({
  fontFamily: LABEL, fontWeight: weight, fontSize: size, letterSpacing: tracking,
  fontVariantNumeric: "tabular-nums", fontFeatureSettings: '"tnum" 1',
});

/** Level 2 micro callout: small, highly legible, medium weight. */
export const micro = (size: number, weight = 600, tracking = "0.16em"): React.CSSProperties => ({
  fontFamily: LABEL, fontWeight: weight, fontSize: size,
  letterSpacing: tracking, textTransform: "uppercase",
});

/** Editorial serif — the Problem chapter and Transformation beats only. */
export const editorial = (size: number, weight = 600): React.CSSProperties => ({
  fontFamily: DISPLAY, fontWeight: weight, fontSize: size,
  lineHeight: 1.06, letterSpacing: "-0.02em",
});
