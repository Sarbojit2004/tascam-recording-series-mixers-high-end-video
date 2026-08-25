/**
 * STAGE 10 TYPE SYSTEM.
 *
 * Stage 10 names the Level 1 face explicitly: "a clean, monospaced or highly
 * geometric sans-serif (such as DIN Alternate or Roboto Mono)". Roboto Mono was
 * confirmed available and is used, so no generic substitute was needed and the
 * coollabsio fallback is not in play.
 *
 * Both faces are self-hosted variable woff2, latin subset. Those subsets carry
 * no OHM / GTE / LTE glyph, which is why spec.ts writes the brief's "Ω", "≥"
 * and "≤" in ASCII-exact form; scripts/check-glyphs.mjs fails the build if any
 * rendered string needs a glyph the files do not contain.
 */
import { staticFile } from "remotion";

/** Level 1 hero metrics, spec callouts, all technical numerals. */
export const MONO = "RobotoMono";
/** Level 2 contextual text and the Data Ribbon. */
export const SANS = "Inter";

export const FONT_CSS = `
@font-face{font-family:'${MONO}';src:url('${staticFile("fonts/robotomono-var.woff2")}') format('woff2');font-weight:100 700;font-style:normal;font-display:block;}
@font-face{font-family:'${SANS}';src:url('${staticFile("fonts/inter-var.woff2")}') format('woff2');font-weight:100 900;font-style:normal;font-display:block;}
`;
