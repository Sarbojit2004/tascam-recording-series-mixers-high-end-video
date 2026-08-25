/**
 * STAGE 10 — BRANDING, TYPOGRAPHY AND CONTACT.
 *
 * This replaces the AVB reference's intermittent logo-cadence pattern entirely.
 * Stage 10 specifies a PERSISTENT system: a continuous 60%-opacity watermark
 * locked to the top-right safe margin, plus a Data Ribbon running the full
 * width of the extreme bottom edge — both present for the whole runtime of all
 * four deliverables, never on a cadence timer.
 *
 * There is no pricing surface anywhere in this project, by founding constraint.
 * Level 1 hero typography stands in the position pricing normally occupies and
 * is drawn exclusively from the Stage 8 master tables (see spec.ts).
 */

export const BRAND = {
  name: "Shivansh Electronics",
  /** Stage 7 Phase 4 — resolves on engineering authority, never on a price. */
  descriptor: "Professional Audio Infrastructure",
  website: "www.shivanshelectronics.in",
  socials: [
    "instagram.com/@shivanshelectronics.in",
    "facebook.com/@shivanshelectronics.in",
    "youtube.com/@shivanshelectronics-in",
  ],
  numbers: ["+91 98316 62458", "+91 91477 00677", "+91 89818 07755"],
} as const;

/** Centre zone of the Data Ribbon, piped exactly as Stage 10 specifies. */
export const RIBBON_CENTER = `| ${BRAND.socials.join(" | ")} |`;
/** Right zone of the Data Ribbon. */
export const RIBBON_RIGHT = BRAND.numbers.join(" | ");
/** Left zone of the Data Ribbon. */
export const RIBBON_LEFT = BRAND.website;

/**
 * Strings that must never appear in any rendered text, in any deliverable.
 * scripts/check-content.mjs greps the built scene copy for all of these.
 *
 *  - Pricing: absolute founding constraint of the brief.
 *  - Other audio brands: Stage 14-equivalent competitor exclusion. TASCAM
 *    itself is deliberately absent from this list — this IS a TASCAM product
 *    line and the brand is named throughout, accurately and confidently.
 */
export const FORBIDDEN = {
  pricing: [
    "price", "pricing", "mrp", "mop", "rs.", "inr", "₹", "usd", "$",
    "cost", "discount", "offer", "deal", "cheap", "afford", "budget",
    "buy now", "order now", "emi", "gst",
  ],
  competitors: [
    "behringer", "zoom", "yamaha", "ssl", "solid state logic", "soundcraft",
    "mackie", "presonus", "rme", "allen & heath", "midas", "motu",
    "focusrite", "universal audio", "apogee", "audient", "roland", "korg",
  ],
} as const;
