// Every on-screen string in one place.
//
// Constraints enforced here, not left to individual scenes:
//   · no comparison with any brand other than TASCAM, anywhere;
//   · Shivansh Electronics is TASCAM's AUTHORIZED PARTNER — the words
//     "distributor", "dealer" and "reseller" appear nowhere;
//   · availability is framed nationally. No region-limiting phrasing.
// Specifications are taken from the creative brief's Section 4 master table,
// which marks each of them VERIFIED.

export const BRAND = {
  partner: 'SHIVANSH ELECTRONICS',
  designation: 'AUTHORIZED TASCAM PARTNER',
  cta: 'BEST PRICE ACROSS INDIA',
  ctaSub: 'DM OR CALL',
} as const;

export const CONTACT = {
  web: 'shivanshelectronics.in',
  hub: 'shivanshelectronics.in/linktree-hub',
  waChannel: 'shivanshelectronics.in/whatsapp-channel',
  ig: 'shivanshelectronics.in/instagram-page',
  fb: 'shivanshelectronics.in/facebook-page',
  li: 'shivanshelectronics.in/linkedin-page',
  th: 'shivanshelectronics.in/threads-profile',
  x: 'shivanshelectronics.in/x-twitter-profile',
  yt: 'shivanshelectronics.in/youtube-channel',
  phones: ['+91 98316 62458', '+91 91477 00677', '+91 89818 07755'] as const,
  addressLines: [
    'Raja Electric — Shivansh Electronics',
    '3, Ramanath Das Road, Dhakuria, Tanu Pukur,',
    'Garfa, Kolkata, West Bengal 700031',
  ] as const,
} as const;

/** Rotating strip content — weaves the full contact list through the runtime. */
export const STRIP_ROTATION: string[] = [
  CONTACT.web,
  CONTACT.phones[0],
  CONTACT.ig,
  CONTACT.hub,
  CONTACT.phones[1],
  CONTACT.yt,
  CONTACT.waChannel,
  CONTACT.phones[2],
  CONTACT.fb,
  CONTACT.li,
  CONTACT.th,
  CONTACT.x,
];

export type ProductKey = 'm12' | 'm16' | 'm24' | 'm2400' | 'sb';

export const PRICE: Record<ProductKey, {name: string; value: string}> = {
  m12: {name: 'MODEL 12', value: '85,800'},
  m16: {name: 'MODEL 16', value: '1,17,100'},
  m24: {name: 'MODEL 24', value: '1,47,000'},
  m2400: {name: 'MODEL 2400', value: '2,54,900'},
  sb: {name: 'STUDIO BRIDGE', value: '1,26,700'},
};

export const PRICE_NOTE = 'PER UNIT · INCLUDING GST';

/** Per-product identity. `hook` is the subheadline — the reason it exists. */
export const PRODUCT = {
  m12: {
    name: 'MODEL 12',
    hook: 'The Compact Desktop Hybrid',
    specs: ['10 ANALOG INPUTS', '8 ULTRA-HDDA PREAMPS', '12-TRACK SD', '12-IN / 10-OUT USB'],
  },
  m16: {
    name: 'MODEL 16',
    hook: 'The Live Ensemble Tracker',
    specs: ['14 ANALOG INPUTS', '10 ULTRA-HDDA PREAMPS', '16-TRACK SD', '16-IN / 14-OUT USB'],
  },
  m24: {
    name: 'MODEL 24',
    hook: 'The Large-Format Console',
    specs: ['22 ANALOG INPUTS', '16 ULTRA-HDDA PREAMPS', '24-TRACK SD', '100 mm FADERS'],
  },
  m2400: {
    name: 'MODEL 2400',
    hook: 'The Flagship 24-Track Centrepiece',
    specs: ['4 STEREO SUBGROUPS', '5 AUX SENDS', 'MASTER BUS PROCESSOR', 'HUI / MCU TRANSPORT'],
  },
  sb: {
    name: 'STUDIO BRIDGE',
    hook: 'The Controller-Less 24-Track Engine',
    specs: ['24 IN / 24 OUT USB', 'DB-25 · AES59-2012', '24-TRACK SDXC', '6U RACK-MOUNTABLE'],
  },
} as const satisfies Record<ProductKey, {name: string; hook: string; specs: string[]}>;
