/**
 * BRANDING CONSTANTS (Section 10).
 *
 * Contact set confirmed directly by the user. Note it deliberately does NOT
 * carry the LinkedIn handle the MOTU productions' own BRAND constant holds —
 * the confirmed set for this project is Instagram, Facebook, YouTube plus the
 * three numbers and the website.
 */
export const BRAND = {
  name: "Shivansh Electronics",

  /**
   * Section 10.5 — the ONE piece of wording that does not port from the MOTU
   * reference productions. Their "Authorized Distributor ... for East and North
   * East India" is replaced, and no territory clause is carried.
   */
  role: "Authorized Partner of TASCAM",

  website: "www.shivanshelectronics.in",
  instagram: "instagram.com/@shivanshelectronics.in",
  facebook: "facebook.com/@shivanshelectronics.in",
  youtube: "youtube.com/@shivanshelectronics-in",
  phones: ["+91 98316 62458", "+91 91477 00677", "+91 89818 07755"],
} as const;

/**
 * THE FIVE MARKETED CHANNELS.
 *
 * The rotation works in CHANNELS, not in individual contact details, because
 * the three phone numbers are one channel: whenever WhatsApp is marketed, all
 * three numbers appear together on a single line behind one icon, never one at
 * a time. Surfacing them singly made the viewer wait through three separate
 * appearances to learn there were three numbers.
 */
export const CHANNELS = ["website", "instagram", "facebook", "youtube", "whatsapp"] as const;
export type ChannelKey = (typeof CHANNELS)[number];

/** What each channel puts on screen beside its icon. */
export const CHANNEL_VALUE: Record<ChannelKey, string> = {
  website: BRAND.website,
  instagram: BRAND.instagram,
  facebook: BRAND.facebook,
  youtube: BRAND.youtube,
  // all three, together, always — the structure the client specified
  whatsapp: BRAND.phones.join(", "),
};

/**
 * WhatsApp's three numbers make a strip roughly twice as wide as any other
 * channel's, which decides both its type size and which slots can hold it.
 *
 * It lives here rather than beside the component because the placement planner
 * needs it too, and the planner is plain TypeScript that the audit runs under
 * `node --experimental-strip-types` — which cannot load a .tsx module.
 */
export const isWide = (c: ChannelKey) => c === "whatsapp";

/** Every contact detail the rotation can surface, so all of it circulates. */
export const CONTACT = {
  website: BRAND.website,
  instagram: BRAND.instagram,
  facebook: BRAND.facebook,
  youtube: BRAND.youtube,
  phone0: BRAND.phones[0],
  phone1: BRAND.phones[1],
  phone2: BRAND.phones[2],
} as const;

export type ContactKey = keyof typeof CONTACT;

/**
 * The mark that identifies each contact detail on screen, per the user's
 * supplied icon set. The three numbers are all reachable on WhatsApp, so they
 * share that mark; CONTACT_LABEL below stays as the accessible/alt wording and
 * as the fallback wherever a row is too small to carry an icon.
 */
export const CONTACT_ICON = {
  website: "website",
  instagram: "instagram",
  facebook: "facebook",
  youtube: "youtube",
  phone0: "whatsapp",
  phone1: "whatsapp",
  phone2: "whatsapp",
} as const satisfies Record<keyof typeof CONTACT, string>;

/** Human label shown beside a rotating contact detail. */
export const CONTACT_LABEL: Record<ContactKey, string> = {
  website: "Web",
  instagram: "Instagram",
  facebook: "Facebook",
  youtube: "YouTube",
  phone0: "Call / WhatsApp",
  phone1: "Call / WhatsApp",
  phone2: "Call / WhatsApp",
};

/**
 * Strings that must never appear in any rendered text, in any deliverable.
 * Pricing is an absolute founding constraint; the competitor list enforces
 * Section 5 fact 5. TASCAM is deliberately absent from the competitor list —
 * this IS a TASCAM production and the brand is named throughout. MOTU IS on
 * the list: the MOTU productions are this build's structural reference, but
 * MOTU must never be named on screen in a TASCAM video.
 */
export const FORBIDDEN = {
  pricing: [
    "price", "pricing", "mrp", "mop", "rs.", "inr", "usd",
    "cost", "discount", "offer", "deal", "cheap", "afford", "budget",
    "buy now", "order now", "emi", "gst",
  ],
  competitors: [
    "behringer", "zoom", "yamaha", "ssl", "solid state logic", "soundcraft",
    "mackie", "presonus", "rme", "allen & heath", "midas", "motu",
    "mark of the unicorn", "focusrite", "universal audio", "apogee",
    "audient", "roland", "korg",
  ],
} as const;
