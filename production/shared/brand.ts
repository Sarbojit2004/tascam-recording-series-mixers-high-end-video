/**
 * BRANDING — logo-led, matching the MOTU AVB and MOTU UltraLite-mk5 / 828
 * productions.
 *
 * This replaces the earlier persistent-watermark + Data Ribbon mechanism
 * entirely. That mechanism keyed the Shivansh mark to transparency and locked
 * it to one corner for the whole runtime; both are gone.
 *
 * The two supplied logo files are now drawn EXACTLY as given — opaque, with
 * their own white ground intact, with no alpha keying and no box, card, plate
 * or panel added behind them. The white ground is part of the artwork and is
 * deliberately preserved.
 *
 * Where this build departs from the MOTU reference is placement. MOTU anchors
 * its corner lockup to one fixed corner; here the Shivansh mark is present on
 * every beat but MOVES every beat, cycling through six anchored slots, so the
 * website is marketed continuously without ever sitting still. The TASCAM mark
 * follows the same system at a lower rate, and never shares a slot with it.
 *
 * There is no pricing surface anywhere in this project, by founding constraint.
 */

export const BRAND = {
  name: "Shivansh Electronics",
  /**
   * The designation for this project. Deliberately NOT the distributor line
   * used in the MOTU videos — this is a TASCAM production and the relationship
   * is stated as a partnership with TASCAM.
   */
  role: "Authorised Partner of TASCAM",
  region: "East and North East India",
  descriptor: "Professional Audio Infrastructure",
  website: "www.shivanshelectronics.in",
  socials: [
    ["Instagram", "instagram.com/@shivanshelectronics.in"],
    ["Facebook", "facebook.com/@shivanshelectronics.in"],
    ["YouTube", "youtube.com/@shivanshelectronics-in"],
  ] as ReadonlyArray<readonly [string, string]>,
  numbers: ["+91 98316 62458", "+91 91477 00677", "+91 89818 07755"],
} as const;

/**
 * Strings that must never appear in any rendered text, in any deliverable.
 *
 *  - Pricing: absolute founding constraint of the brief.
 *  - Other audio brands: competitor exclusion. TASCAM itself is deliberately
 *    absent from this list — this IS a TASCAM product line, the brand is named
 *    throughout, and its logo is now marketed alongside Shivansh's.
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
