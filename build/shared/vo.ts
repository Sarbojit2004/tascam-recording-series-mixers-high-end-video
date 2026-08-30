/**
 * THE VOICEOVER SCRIPTS — narration keyed to beat id.
 *
 * WHY IT LIVES HERE AND NOT IN A MARKDOWN FILE. A script written separately
 * from the schedule goes stale the first time a beat's duration changes, and
 * nobody notices until the read is recorded. Keyed to beat ids, it can be
 * checked: scripts/vo_check.mjs computes each beat's word budget from its
 * actual duration and fails on any line that cannot be read in the time the
 * picture allows. scripts/vo_export.mjs then emits the recording scripts as
 * markdown with per-beat timecodes.
 *
 * THE BUDGET. 150 words per minute is the comfortable narration rate this
 * production is cut to — 2.5 words per second. Every beat also owes the
 * picture some silence: a beat is not a slot to fill, and the concept
 * animations in particular need room to be watched rather than talked over.
 * So the budget is 78% of the arithmetic maximum, and the checker enforces it.
 *
 * WHERE A BEAT IS DELIBERATELY SILENT the entry is an empty string — the title
 * cards, the closing block, and the beats where a real product video is
 * carrying its own moment. Silence is written down here so it reads as a
 * decision rather than an omission.
 */

export const WPS = 2.5;
/** Fraction of the arithmetic maximum a line may use. */
export const BUDGET = 0.78;

export const wordBudget = (sec: number) => Math.floor(sec * WPS * BUDGET);

export const VO_LONGFORM: Record<string, string> = {
  "open-cold": "One preamp. Three destinations. At the same time.",
  "open-broll": "This is the TASCAM Model series.",
  "open-thesis":
    "Every channel is amplified once, by one preamp stage. That signal " +
    "reaches three destinations at the same time. Nothing is re-amplified, " +
    "nothing converted twice.",
  "open-sweep": "Five units share that architecture. What separates them is what comes after it.",
  "open-who":
    "For anyone doing two jobs with one signal. A live room that owes someone " +
    "a multitrack. A studio mixing on faders, delivering stems.",

  "pre-editorial": "Everything starts at the input stage.",
  "pre-macro":
    "The preamp is Ultra-HDDA — High Definition Discrete Architecture. The " +
    "same stage appears in every console in this range.",
  "pre-ein":
    "Equivalent input noise is quoted at minus one hundred and twenty-eight " +
    "dBu, under the same measurement conditions, across all four consoles.",
  "pre-statement":
    "So the preamp is not what separates these units. What does is how many " +
    "paths it feeds, and how wide.",
  "pre-montage": "One input stage. Five different chassis around it.",
  "pre-thd":
    "Total harmonic distortion is measured and quoted the same way throughout, " +
    "which is what makes the comparison mean anything.",

  "tri-editorial": "Then the signal splits. Once, internally, after amplification.",
  "tri-concept": "",
  "tri-analog":
    "The first path is analog: the mix bus and main outputs. That is the mix " +
    "the room hears, not a digital monitor feed.",
  "tri-sd":
    "The second path is the SD recorder. On the Model 12 that is twelve tracks " +
    "at up to twenty-four bit, forty-eight kilohertz.",
  "tri-usb":
    "The third path is USB. The same signal reaches the computer as discrete " +
    "channels while the card keeps recording.",
  "tri-broll": "Mixed, recorded and streamed in a single pass.",
  "tri-compare":
    "The recording path widens with the chassis — twelve tracks, sixteen, " +
    "twenty-four.",
  "tri-atonce": "",

  "m12-hero":
    "The Model 12 is the smallest console here, and the one with the most " +
    "control surface.",
  "m12-macro":
    "It controls the software it feeds. HUI and MCU protocol emulation, with " +
    "sixty millimetre faders.",
  "m12-timecode":
    "It carries five-pin MIDI, timecode and song position pointer — so it can " +
    "follow the rest of the room, or lead it.",
  "m12-video": "",
  "m12-specs":
    "Distortion under zero point zero zero three percent. Response from twenty " +
    "hertz to twenty kilohertz. Sixteen watts, and four point three kilograms.",
  "m12-montage": "",
  "m12-broll": "Desk-sized, without being scaled down in capability.",
  "m12-bt":
    "Channel nine-ten is not a jack. It takes TRRS or Bluetooth, so a phone " +
    "becomes an input.",

  "m16-editorial": "The Model 16 is wider, and more analog about it.",
  "m16-hero":
    "Ten microphone inputs. Sixteen recorded tracks. No control surface for a " +
    "computer.",
  "m16-macro":
    "Fewer layers between the hand and the signal. The controls are the " +
    "controls — nothing is buried on a page.",
  "m16-statement":
    "It does not emulate HUI or MCU, and carries no MIDI. It is an interface " +
    "and a recorder, not a control surface.",
  "m16-video": "",
  "m16-specs":
    "The same minus one hundred and twenty-eight dBu input noise. Response to " +
    "thirty kilohertz. Seven kilograms.",
  "m16-montage": "",
  "m16-rear": "The rear panel is where the three paths leave the chassis.",

  "m24-editorial": "Scale changes the numbers. It does not change the design.",
  "m24-hero":
    "Twenty-two inputs. Twenty-four tracks. Hundred millimetre faders.",
  "m24-sweep": "Longer fader travel means finer resolution under the finger.",
  "m24-compare":
    "Input count is what the larger chassis actually buys you — ten, fourteen, " +
    "twenty-two.",
  "m24-video": "",
  "m24-specs":
    "Twenty-four in, twenty-two out over USB. Fifty-two watts. Ten point two " +
    "kilograms.",
  "m24-broll": "A full band, tracked and mixed at a single desk.",
  "m24-vs":
    "Against the flagship, the width is the same. What the flagship adds is " +
    "not channels.",

  "m2400-editorial":
    "The Model 2400 keeps every path at full width — and puts the control " +
    "surface back.",
  "m2400-hero":
    "Twenty-two inputs, twenty-four tracks, HUI and MCU emulation, and MIDI " +
    "timecode.",
  "m2400-macro":
    "Nothing is traded away. It has the Model 24's width and the Model 12's " +
    "control surface.",
  "m2400-vs":
    "Sixty-five watts against fifty-two. The flagship draws more because it is " +
    "doing more.",
  "m2400-tri": "",
  "m2400-video": "",
  "m2400-specs":
    "Minus one hundred and twenty-eight dBu. Twenty hertz to thirty kilohertz. " +
    "Fourteen kilograms.",
  "m2400-montage": "",
  "m2400-broll": "Built for the room that needs all of it at once.",
  "m2400-timecode":
    "MIDI timecode and click tempo control keep it locked to everything else " +
    "in the room.",
  "m2400-case": "",

  "sb-editorial":
    "Then there is the one without a preamp, which is how you find out what " +
    "the preamp was doing.",
  "sb-hero":
    "No microphone preamps. No faders. No mix bus. Twenty-four channels in " +
    "each direction.",
  "sb-db25": "",
  "sb-statement":
    "The Studio Bridge takes line level in and puts line level out. Its input " +
    "noise is not a number: there is no stage to measure.",
  "sb-macro":
    "It disappears into a rack — six rack units, with the optional mounting kit.",
  "sb-specs":
    "Twenty-four track recording. Twenty-four in and twenty-four out over USB. " +
    "Dynamic range at or above one hundred dB.",
  "sb-montage": "",
  "sb-broll": "The link between the console you have and the system you need.",
  "sb-sweep": "Two DB25 connectors in, two out — AES59 compliant.",

  "close-thesis":
    "The preamp is constant. The number of paths, and their width, is not. " +
    "Choose by how many destinations you need to feed at once.",
  "close-compare":
    "The third path, across the whole range — from twelve channels out to " +
    "twenty-four.",
  "close-choose":
    "DAW control in the smallest chassis: Model 12. Faders and tracks without " +
    "one: Model 16, or Model 24 for width. All of it: Model 2400.",
  "close-broll": "Specified, supplied and supported by Shivansh Electronics in Kolkata.",
  // The three end screens are silent by design: the logos, the role line and
  // the five channels are the message there, and narration over them competes
  // with the one block a viewer is most likely to pause on.
  "part1-end": "",
  "part2-end": "",
  "part3-end": "",
};

export const VO_REEL1: Record<string, string> = {
  "r1-cold": "One preamp. Three destinations.",
  "r1-broll": "Mixed, recorded and streamed at the same time.",
  "r1-claim":
    "One Ultra-HDDA stage amplifies the channel. That signal reaches the mix " +
    "bus, the SD recorder and USB together. Nothing is re-amplified.",
  "r1-concept": "",
  "r1-m12": "Model 12. Ten inputs, twelve tracks, on a desk.",
  "r1-m16": "Model 16. Fourteen inputs, sixteen tracks, analog-forward.",
  "r1-m24": "Model 24. Twenty-two inputs, twenty-four tracks.",
  "r1-m2400": "Model 2400. The same width, with the control surface back.",
  "r1-ein":
    "Input noise is identical across all four — minus one hundred and " +
    "twenty-eight dBu.",
  "r1-usb":
    "What differs is the width of the paths that follow it.",
  "r1-editorial": "So choose by the destinations, not by the preamp.",
  "r1-close": "One architecture. Four answers to it.",
  "r1-end": "",
};

export const VO_REEL2: Record<string, string> = {
  "r2-cold": "The biggest desk and the smallest one share a trick.",
  "r2-broll": "Both of them control the software they feed.",
  "r2-m2400":
    "The Model 2400 — twenty-two inputs, twenty-four tracks, HUI and MCU " +
    "emulation.",
  "r2-2400macro": "Hundred millimetre faders. Full-size travel.",
  "r2-m12":
    "The Model 12 — ten inputs, twelve tracks, and the same control surface.",
  "r2-12macro": "Sixty millimetre faders, doing the same job in a smaller chassis.",
  "r2-timecode": "",
  "r2-compare": "Ten channels against twenty-two. That is the difference.",
  "r2-statement":
    "Both emulate HUI and MCU. Both carry MIDI timecode. Both put the same " +
    "preamp in front of the same three paths.",
  "r2-montage": "The same controls, at two scales.",
  "r2-editorial": "So pick the size of the room. The architecture comes with either.",
  "r2-close": "The same architecture, at two scales.",
  "r2-end": "",
};

export const VO_REEL3: Record<string, string> = {
  "r3-cold": "This one has no preamps at all.",
  "r3-broll": "Line level in. Line level out.",
  "r3-hero":
    "The TASCAM Studio Bridge — twenty-four channels each way, and nothing " +
    "amplifying them.",
  "r3-db25": "",
  "r3-statement":
    "Your console already has the preamps you chose. The Studio Bridge adds no " +
    "second stage in front of them. It converts, records and streams what you " +
    "have.",
  "r3-macro": "Six rack units, with the optional mounting kit.",
  "r3-specs":
    "Dynamic range at or above one hundred dB. Twenty-four track recording, " +
    "twenty-four in and out over USB.",
  "r3-compare": "The widest USB path in the range.",
  "r3-montage": "",
  "r3-sweep": "Two DB25 in, two DB25 out. AES59 compliant.",
  "r3-editorial": "The link, not the source.",
  "r3-close": "The link, not the source.",
  "r3-end": "",
};
