import assets from "./assets.json";

// Every figure here is marked VERIFIED in "TASCAM Series Technical Production Brief" (repository
// root, Stage 8 master tables). House rule: no full stops anywhere in on-screen copy.
export type Item = {
  key: string;
  name: string;
  family: string;
  line: string;
  big: [string, string];
  chips: string[];
  views: string[]; // cut-outs, flipped one per beat
  clips: string[]; // B-roll behind the first beats
  photos: string[]; // every other still of this model, cycled behind + in the film strip
};

type Meta = [number, number, string, string];
export const A = (assets as unknown as { img: Record<string, Meta>; cards: string[] }).img;
export const CARDS = (assets as unknown as { cards: string[] }).cards;
const of = (p: string[], kind?: string) => Object.keys(A).filter((k) => p.includes(A[k][3]) && (!kind || A[k][2] === kind));
const rest = (p: string[], views: string[]) => of(p).filter((k) => !views.includes(k));

const V12 = ["m12-08", "m12-01", "m12-04", "m12-07", "m12-05", "m12-06", "m12-19", "m12-08"];
const V16 = ["m16-01", "m16-07", "m16-08", "m16-01", "m16-07", "m16-08"];
const V24 = ["m24-08", "m24-11", "m24-06", "m24-07", "m24-10", "m24-09", "m24-21"];
const V2400 = ["m2400-07", "m2400-06", "m2400-02", "m2400-08", "m2400-17", "m2400-05", "m2400-04"];
const VSB = ["sb-03", "sb-02", "sb-07", "sb-05", "sb-06", "sb-08", "sb-04"];

export const P: Record<string, Item> = {
  m12: {
    key: "m12",
    name: "MODEL 12",
    family: "SUB-COMPACT HYBRID",
    line: "Mixer, recorder and DAW controller in one",
    big: ["12", "TRACKS"],
    chips: ["10 INPUTS", "HUI / MCU", "MIDI + MTC", "SMARTPHONE MIX-MINUS"],
    views: V12,
    clips: ["b02", "b13"],
    photos: rest(["m12"], V12),
  },
  m16: {
    key: "m16",
    name: "MODEL 16",
    family: "ANALOG-FORWARD HYBRID",
    line: "The live desk that records itself",
    big: ["16", "TRACKS"],
    chips: ["14 INPUTS", "16-IN / 14-OUT USB", "ULTRA-HDDA PREAMPS"],
    views: V16,
    clips: ["b04", "b09"],
    photos: rest(["m16"], V16),
  },
  m24: {
    key: "m24",
    name: "MODEL 24",
    family: "ANALOG-FORWARD HYBRID",
    line: "Twenty-four tracks straight to SD",
    big: ["24", "TRACKS"],
    chips: ["22 INPUTS", "100 mm FADERS", "24-IN / 22-OUT USB"],
    views: V24,
    clips: ["b06", "b15"],
    photos: rest(["m24", "cs"], V24),
  },
  m2400: {
    key: "m2400",
    name: "MODEL 2400",
    family: "FLAGSHIP HYBRID",
    line: "The flagship with your DAW under its faders",
    big: ["24", "TRACKS"],
    chips: ["4 STEREO SUBGROUPS", "5 AUX SENDS", "MASTER BUS INSERT", "HUI / MCU + MTC"],
    views: V2400,
    clips: ["b08", "b16"],
    photos: rest(["m2400", "cmp"], V2400),
  },
  sb: {
    key: "sb",
    name: "STUDIO BRIDGE",
    family: "THE TRANSPARENT BRIDGE",
    line: "No preamps, on purpose",
    big: ["24×24", "DB25"],
    chips: ["24 IN / 24 OUT", "24-TRACK SD", "HUI / MCU", "6U RACK OR DESK"],
    views: VSB,
    clips: ["b10", "b12"],
    photos: rest(["sb"], VSB),
  },
};
export const ORDER = ["m12", "m16", "m24", "m2400", "sb"];

/** House rule: on-screen copy carries no full stops (a dot is allowed only between digits or
 *  inside the web address). Throws at bundle time if any string breaks it. */
export const ONSCREEN: string[] = [];
export const say = (s: string) => {
  if (/\.(?!\d)/.test(s.replace("shivanshelectronics.in", ""))) throw new Error(`full stop in on-screen copy: "${s}"`);
  ONSCREEN.push(s);
  return s;
};
for (const it of Object.values(P)) [it.name, it.family, it.line, ...it.chips, ...it.big].forEach(say);
