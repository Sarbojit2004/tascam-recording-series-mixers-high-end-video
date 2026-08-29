/**
 * THE LONG-FORM SCHEDULE — 898 seconds, declared beat by beat.
 *
 * WHY A DATA FILE. Runtime is a hard requirement (Section 2), and the surest
 * way to miss it is to let it emerge from whatever the scenes happen to do.
 * Here every beat states its own duration in seconds, the composition derives
 * its frame count by summing them, and scripts/audit_schedule.mjs fails the
 * build if the sum is not exactly 898. Runtime is therefore correct by
 * construction rather than by measurement after the fact.
 *
 * THE ARGUMENT. Section 4 asks for one thesis carried across five units, not
 * five product tours stapled together. The thesis is the TRI-PATH: a single
 * Ultra-HDDA preamp stage feeding an analog mix bus, an SD multitrack recorder
 * and a USB interface AT THE SAME TIME, so the same signal is mixed, recorded
 * and streamed without being split, re-amplified or converted twice.
 *
 * The nine phases develop that claim and then test it:
 *
 *   OPEN        the claim, stated cold
 *   PREAMP      the common foundation every unit shares
 *   TRI-PATH    the mechanism itself
 *   MODEL 12    the claim at its smallest — and where it gains DAW control
 *   MODEL 16    the claim in its classic analog-forward form
 *   MODEL 24    the same architecture, scaled, unchanged in kind
 *   MODEL 2400  the flagship, where every path is at full width
 *   BRIDGE      the counter-example — the unit with NO preamp at all, which
 *               is what proves the preamp was the variable all along
 *   CLOSE       the distributor, and the contact set
 *
 * The Studio Bridge is deliberately last and deliberately framed as the
 * exception: a tri-path argument that never met a unit outside it would be a
 * slogan. Section 6 restricts the DB25 concept to this unit for the same
 * reason — it is the only one whose I/O topology is DB25.
 */
import type { Beat } from "./shared/beat.ts";

export const BEATS: Beat[] = [
  // ---------------------------------------------------------------- OPEN
  { id: "open-cold", kind: "cold", sec: 11, phase: "OPEN",
    hero: "One preamp.\nThree destinations.\nAt once.",
    sub: "The architecture behind the TASCAM Model series." },
  { id: "open-broll", kind: "broll", sec: 8, phase: "OPEN", clip: 1, clipFrom: 0.4,
    label: "TASCAM MODEL SERIES", hero: "Recording, mixing and interfacing — one desk." },
  { id: "open-thesis", kind: "statement", sec: 14, phase: "OPEN",
    label: "THE CLAIM", hero: "A signal that is not split\nis a signal that is not degraded.",
    body: [
      "Every Model-series channel is amplified once, by one preamp stage.",
      "That single amplified signal reaches three destinations simultaneously.",
      "No re-amplification. No second conversion. No Y-cable.",
    ] },
  { id: "open-sweep", kind: "sweep", sec: 10, phase: "OPEN",
    images: ["model-2400-1"], unit: "model2400",
    label: "THE RANGE", hero: "Five units. One architecture." },

  { id: "open-who", kind: "statement", sec: 12, phase: "OPEN",
    label: "WHO THIS IS FOR", hero: "Anyone who has to do two jobs\nwith one signal.",
    body: [
      "A live room that also has to deliver a multitrack recording.",
      "A studio that mixes on faders but delivers stems to a DAW.",
      "A rehearsal space, a house of worship, a podcast desk, a school.",
    ] },

  // -------------------------------------------------------------- PREAMP
  { id: "pre-editorial", kind: "editorial", sec: 9, phase: "PREAMP", clip: 2,
    hero: "It begins at the input.",
    sub: "Everything downstream inherits whatever the first stage does to the signal." },
  { id: "pre-macro", kind: "macro", sec: 13, phase: "PREAMP",
    images: ["model-12-3"], unit: "model12",
    label: "THE PREAMP STAGE", hero: "Ultra-HDDA",
    sub: "High Definition Discrete Architecture — the same stage in every unit here.",
    specKeys: ["Preamp Topology", "Equivalent Input Noise (EIN)"] },
  { id: "pre-ein", kind: "compare", sec: 14, phase: "PREAMP",
    label: "EQUIVALENT INPUT NOISE", hero: "The same floor, across the range.",
    units: ["model12", "model16", "model24", "model2400"],
    specKeys: ["Equivalent Input Noise (EIN)"] },
  { id: "pre-statement", kind: "statement", sec: 12, phase: "PREAMP",
    label: "WHAT THAT MEANS", hero: "Identical at the input.\nDifferent in what follows.",
    body: [
      "Every unit here quotes -128 dBu EIN at the same measurement conditions.",
      "The preamp is therefore not what separates them.",
      "What separates them is how many paths that preamp can feed, and how wide.",
    ] },
  { id: "pre-montage", kind: "montage", sec: 11, phase: "PREAMP",
    label: "THE INPUT STAGE", hero: "One stage, five chassis.",
    images: ["model-12-5", "model-16-4", "model-24-5"] },

  { id: "pre-thd", kind: "compare", sec: 13, phase: "PREAMP",
    label: "TOTAL HARMONIC DISTORTION", hero: "Measured the same way, quoted the same way.",
    units: ["model12", "model24", "model2400", "studiobridge"],
    specKeys: ["Total Harmonic Distortion (THD+N)"] },

  // ------------------------------------------------------------ TRI-PATH
  { id: "tri-editorial", kind: "editorial", sec: 8, phase: "TRI-PATH", clip: 3,
    hero: "Then it splits.",
    sub: "Once — internally, after amplification, before anything is lost." },
  { id: "tri-concept", kind: "tripath", sec: 18, phase: "TRI-PATH", unit: "model12",
    label: "TRI-PATH ARCHITECTURE", hero: "Where one signal becomes three." },
  { id: "tri-analog", kind: "statement", sec: 12, phase: "TRI-PATH",
    label: "PATH ONE — ANALOG", hero: "The mix bus.",
    body: [
      "The amplified signal reaches the analog mix bus and the main outputs.",
      "This is the path a front-of-house engineer hears, in real time.",
      "It is not a monitor feed of a digital mix — it is the mix.",
    ] },
  { id: "tri-sd", kind: "specs", sec: 13, phase: "TRI-PATH", unit: "model12",
    images: ["model-12-8"],
    specKeys: ["Multitrack SD Recorder", "USB Audio Interface", "DAW Control"] },
  { id: "tri-usb", kind: "statement", sec: 12, phase: "TRI-PATH",
    label: "PATH THREE — USB", hero: "The interface.",
    body: [
      "The same signal reaches the computer as discrete channels.",
      "The SD recorder keeps running while it does.",
      "A failed laptop does not take the session down with it.",
    ] },
  { id: "tri-broll", kind: "broll", sec: 9, phase: "TRI-PATH", clip: 4, clipFrom: 0.5,
    label: "THREE PATHS, ONE PASS", hero: "Mixed, recorded and streamed in the same pass." },
  { id: "tri-compare", kind: "compare", sec: 14, phase: "TRI-PATH",
    label: "SD MULTITRACK WIDTH", hero: "How wide the recording path gets.",
    units: ["model12", "model16", "model24", "model2400"],
    specKeys: ["Multitrack SD Recorder"] },

  { id: "tri-atonce", kind: "broll", sec: 9, phase: "TRI-PATH", clip: 14, clipFrom: 0.3,
    label: "SIMULTANEOUS", hero: "All three, in the same pass." },

  // ------------------------------------------------------------ MODEL 12
  { id: "m12-hero", kind: "hero", sec: 14, phase: "MODEL 12", unit: "model12",
    images: ["model-12-0"],
    sub: "The smallest chassis in the range — and the one with the most control surface.",
    specKeys: ["Input Channels", "Multitrack SD Recorder", "USB Audio Interface"] },
  { id: "m12-macro", kind: "macro", sec: 12, phase: "MODEL 12", unit: "model12",
    images: ["model-12-11"], label: "CONTROL SURFACE", hero: "It controls the DAW it feeds.",
    sub: "HUI/MCU emulation, in a unit this size.",
    specKeys: ["DAW Control", "Fader Travel"] },
  { id: "m12-timecode", kind: "timecode", sec: 16, phase: "MODEL 12", unit: "model12",
    label: "MIDI TIMECODE", hero: "It can follow, or be followed." },
  { id: "m12-video", kind: "realvideo", sec: 16, phase: "MODEL 12", video: "model-12-video",
    label: "MODEL 12", hero: "In use." },
  { id: "m12-specs", kind: "specs", sec: 14, phase: "MODEL 12", unit: "model12",
    images: ["model-12-14"],
    specKeys: ["Total Harmonic Distortion (THD+N)", "Frequency Response",
               "MIDI", "Power Consumption", "Weight"] },
  { id: "m12-montage", kind: "montage", sec: 11, phase: "MODEL 12",
    label: "MODEL 12", hero: "Every surface, working.",
    images: ["model-12-16", "model-12-18", "model-12-20"] },
  { id: "m12-broll", kind: "broll", sec: 9, phase: "MODEL 12", clip: 5, clipFrom: 0.3,
    label: "SUB-COMPACT", hero: "Desk-sized. Not scaled down in capability." },

  { id: "m12-bt", kind: "macro", sec: 12, phase: "MODEL 12", unit: "model12",
    images: ["model-12-22"], label: "THE TENTH CHANNEL",
    hero: "A stereo input that is not a jack.",
    sub: "Channel 9/10 accepts TRRS or Bluetooth — a phone is an input.",
    specKeys: ["Input Channels"] },

  // ------------------------------------------------------------ MODEL 16
  { id: "m16-editorial", kind: "editorial", sec: 8, phase: "MODEL 16", clip: 6,
    hero: "Wider, and more analog about it.",
    sub: "The same architecture, expressed for a different room." },
  { id: "m16-hero", kind: "hero", sec: 14, phase: "MODEL 16", unit: "model16",
    images: ["model-16-0"],
    sub: "Ten mic inputs, sixteen recorded tracks, no DAW control surface.",
    specKeys: ["Input Channels", "Multitrack SD Recorder", "USB Audio Interface"] },
  { id: "m16-macro", kind: "macro", sec: 12, phase: "MODEL 16", unit: "model16",
    images: ["model-16-6"], label: "ANALOG-FORWARD", hero: "Fewer layers between hand and signal.",
    sub: "The controls are the controls. Nothing is on a page.",
    specKeys: ["Frequency Response", "Total Harmonic Distortion (THD+N)"] },
  { id: "m16-statement", kind: "statement", sec: 12, phase: "MODEL 16",
    label: "AN HONEST OMISSION", hero: "No DAW control. No MIDI.",
    body: [
      "The Model 16 does not emulate HUI or MCU, and carries no MIDI ports.",
      "It is an audio interface and a recorder, not a control surface.",
      "That is a design position, and it is worth stating plainly.",
    ] },
  { id: "m16-video", kind: "realvideo", sec: 15, phase: "MODEL 16", video: "model-16-video",
    label: "MODEL 16", hero: "In use." },
  { id: "m16-specs", kind: "specs", sec: 14, phase: "MODEL 16", unit: "model16",
    images: ["model-16-9"],
    specKeys: ["Equivalent Input Noise (EIN)", "Frequency Response",
               "DAW Control", "MIDI", "Weight"] },
  { id: "m16-montage", kind: "montage", sec: 11, phase: "MODEL 16",
    label: "MODEL 16", hero: "Built to be reached across.",
    images: ["model-16-11", "model-16-13", "model-16-15"] },

  { id: "m16-rear", kind: "montage", sec: 11, phase: "MODEL 16",
    label: "REAR PANEL", hero: "Where the three paths leave.",
    images: ["model-16-2", "model-16-5", "model-16-8"] },

  // ------------------------------------------------------------ MODEL 24
  { id: "m24-editorial", kind: "editorial", sec: 8, phase: "MODEL 24", clip: 7,
    hero: "Scale changes the numbers, not the design.",
    sub: "Twenty-two inputs, twenty-four tracks, the same three paths." },
  { id: "m24-hero", kind: "hero", sec: 14, phase: "MODEL 24", unit: "model24",
    images: ["model-24-1"],
    sub: "The largest of the classic analog-forward pair.",
    specKeys: ["Input Channels", "Multitrack SD Recorder", "Fader Travel"] },
  { id: "m24-sweep", kind: "sweep", sec: 12, phase: "MODEL 24", unit: "model24",
    images: ["model-24-3"], label: "100 MM FADERS",
    hero: "Longer travel, finer resolution.", specKeys: ["Fader Travel"] },
  { id: "m24-compare", kind: "compare", sec: 14, phase: "MODEL 24",
    label: "INPUT CHANNELS", hero: "What the chassis buys you.",
    units: ["model12", "model16", "model24", "model2400"],
    specKeys: ["Input Channels"] },
  { id: "m24-video", kind: "realvideo", sec: 15, phase: "MODEL 24", video: "model-24-video",
    label: "MODEL 24", hero: "In use." },
  { id: "m24-case", kind: "montage", sec: 12, phase: "MODEL 24",
    label: "IN THE ROOM", hero: "Where a desk this size lands.",
    images: ["model-24-case-study-1", "model-24-case-study-2", "model-24-case-study-3"] },
  { id: "m24-specs", kind: "specs", sec: 14, phase: "MODEL 24", unit: "model24",
    images: ["model-24-9"],
    specKeys: ["USB Audio Interface", "Total Harmonic Distortion (THD+N)",
               "Power Consumption", "Dimensions", "Weight"] },
  { id: "m24-broll", kind: "broll", sec: 9, phase: "MODEL 24", clip: 8, clipFrom: 0.6,
    label: "MODEL 24", hero: "A full band, tracked and mixed at one desk." },

  { id: "m24-vs", kind: "macro", sec: 12, phase: "MODEL 24", unit: "model24",
    images: ["model-24-vs-model-2400"], label: "SIDE BY SIDE",
    hero: "The same width, twice.",
    sub: "What the flagship adds is not channels.",
    specKeys: ["Multitrack SD Recorder", "DAW Control"] },

  // ---------------------------------------------------------- MODEL 2400
  { id: "m2400-editorial", kind: "editorial", sec: 9, phase: "MODEL 2400", clip: 9,
    hero: "Then everything at once.",
    sub: "The flagship keeps every path at full width — and adds the control surface back." },
  { id: "m2400-hero", kind: "hero", sec: 15, phase: "MODEL 2400", unit: "model2400",
    images: ["model-2400"],
    sub: "Twenty-two inputs, twenty-four tracks, HUI/MCU control and MIDI timecode.",
    specKeys: ["Input Channels", "Multitrack SD Recorder", "DAW Control"] },
  { id: "m2400-macro", kind: "macro", sec: 13, phase: "MODEL 2400", unit: "model2400",
    images: ["model-2400-4"], label: "THE FLAGSHIP", hero: "Nothing traded away.",
    sub: "The Model 24's width, with the Model 12's control surface.",
    specKeys: ["Fader Travel", "Total Harmonic Distortion (THD+N)"] },
  { id: "m2400-vs", kind: "compare", sec: 15, phase: "MODEL 2400",
    label: "MODEL 24 AND MODEL 2400", hero: "Same width. Different intent.",
    units: ["model24", "model2400"], specKeys: ["Power Consumption"] },
  { id: "m2400-tri", kind: "tripath", sec: 17, phase: "MODEL 2400", unit: "model2400",
    label: "TRI-PATH AT FULL WIDTH", hero: "Twenty-four tracks down all three paths." },
  { id: "m2400-video", kind: "realvideo", sec: 16, phase: "MODEL 2400", video: "model-2400-video",
    label: "MODEL 2400", hero: "In use." },
  { id: "m2400-specs", kind: "specs", sec: 15, phase: "MODEL 2400", unit: "model2400",
    images: ["model-2400-9"],
    specKeys: ["Equivalent Input Noise (EIN)", "Frequency Response", "MIDI",
               "Power Consumption", "Dimensions", "Weight"] },
  { id: "m2400-montage", kind: "montage", sec: 12, phase: "MODEL 2400",
    label: "MODEL 2400", hero: "The full surface.",
    images: ["model-2400-11", "model-2400-13", "model-2400-15"] },
  { id: "m2400-broll", kind: "broll", sec: 9, phase: "MODEL 2400", clip: 10, clipFrom: 0.4,
    label: "FLAGSHIP", hero: "Built for the room that needs all of it." },

  { id: "m2400-timecode", kind: "timecode", sec: 16, phase: "MODEL 2400", unit: "model2400",
    label: "MIDI TIMECODE", hero: "Locked to the rest of the room." },
  { id: "m2400-case", kind: "macro", sec: 12, phase: "MODEL 2400", unit: "model2400",
    images: ["model-24-case-study-4"], label: "IN THE ROOM",
    hero: "Where the flagship goes.",
    sub: "A desk that has to be the whole signal path.",
    specKeys: ["Input Channels", "Fader Travel"] },

  // -------------------------------------------------------------- BRIDGE
  { id: "sb-editorial", kind: "editorial", sec: 10, phase: "BRIDGE", clip: 11,
    hero: "And then the one without a preamp.",
    sub: "Which is how you tell what the preamp was doing all along." },
  { id: "sb-hero", kind: "hero", sec: 15, phase: "BRIDGE", unit: "studiobridge",
    images: ["studio-bridge-1"],
    sub: "No mic preamps, no faders, no mix bus. Twenty-four channels each way.",
    specKeys: ["Preamp Topology", "Input/Output Topology", "Dynamic Range"] },
  { id: "sb-db25", kind: "db25", sec: 19, phase: "BRIDGE", unit: "studiobridge",
    label: "DB25 INJECTION", hero: "Twenty-four in, twenty-four out." },
  { id: "sb-statement", kind: "statement", sec: 13, phase: "BRIDGE",
    label: "THE COUNTER-EXAMPLE", hero: "It amplifies nothing.\nThat is the point.",
    body: [
      "The Studio Bridge takes line level in and puts line level out.",
      "Its EIN figure is not a number — there is no preamplification stage to measure.",
      "It is the transparent link between a console that already has preamps and everything else.",
    ] },
  { id: "sb-macro", kind: "macro", sec: 13, phase: "BRIDGE", unit: "studiobridge",
    images: ["studio-bridge-8"], label: "RACK FORMAT", hero: "It disappears into the rack.",
    sub: "Six rack units, with the optional mounting kit.",
    specKeys: ["Mounting", "Power Consumption"] },
  { id: "sb-specs", kind: "specs", sec: 15, phase: "BRIDGE", unit: "studiobridge",
    images: ["studio-bridge-13"],
    specKeys: ["Multitrack SD Recorder", "USB Audio Interface", "DAW Control",
               "MIDI", "Impedance", "Weight"] },
  { id: "sb-montage", kind: "montage", sec: 12, phase: "BRIDGE",
    label: "STUDIO BRIDGE", hero: "Connector-dense, by design.",
    images: ["studio-bridge-16", "studio-bridge-18", "studio-bridge-20"] },
  { id: "sb-broll", kind: "broll", sec: 9, phase: "BRIDGE", clip: 12, clipFrom: 0.5,
    label: "TRANSPARENT BRIDGE", hero: "Between the console you have and the system you need." },

  { id: "sb-sweep", kind: "sweep", sec: 12, phase: "BRIDGE", unit: "studiobridge",
    images: ["studio-bridge-4"], label: "TWENTY-FOUR EACH WAY",
    hero: "Two DB25 in, two DB25 out.",
    specKeys: ["Input/Output Topology"] },

  // --------------------------------------------------------------- CLOSE
  { id: "close-thesis", kind: "statement", sec: 14, phase: "CLOSE",
    label: "THE RANGE, RESOLVED", hero: "One architecture.\nFive answers to it.",
    body: [
      "The preamp is constant; the number and width of the paths is not.",
      "Choose by how many destinations you need to feed at once — and how wide.",
      "The Studio Bridge is what the range looks like with the preamp removed.",
    ] },
  { id: "close-compare", kind: "compare", sec: 15, phase: "CLOSE",
    label: "USB INTERFACE WIDTH", hero: "The third path, across the range.",
    units: ["model12", "model16", "model24", "model2400", "studiobridge"],
    specKeys: ["USB Audio Interface"] },
  { id: "close-choose", kind: "statement", sec: 13, phase: "CLOSE",
    label: "HOW TO CHOOSE", hero: "Count the destinations.\nThen count the channels.",
    body: [
      "Need DAW control in the smallest chassis: Model 12.",
      "Need faders and tracks without a control surface: Model 16, or Model 24 for width.",
      "Need all of it at once: Model 2400. Need none of the preamps: Studio Bridge.",
    ] },
  { id: "close-brand", kind: "brandbeat", sec: 12, phase: "CLOSE" },
  { id: "close-broll2", kind: "broll", sec: 9, phase: "CLOSE", clip: 15, clipFrom: 0.5,
    label: "THE RANGE", hero: "Five units. One architecture." },
  { id: "close-broll", kind: "broll", sec: 9, phase: "CLOSE", clip: 13, clipFrom: 0.4,
    label: "SHIVANSH ELECTRONICS", hero: "Specified, supplied and supported in Kolkata." },
  { id: "close-outro", kind: "outro", sec: 26, phase: "CLOSE" },
];
