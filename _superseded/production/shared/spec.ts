/**
 * STAGE 8 — VERIFIED TECHNICAL SPECIFICATION MASTER TABLES.
 *
 * Transcribed verbatim from the TASCAM Series Technical Production Brief.
 * This file is the ONLY source of on-screen technical figures. Stage 10 is
 * explicit that Level 1 hero typography is "anchored entirely by the verified
 * technical specifications isolated in Stage 8", so nothing that is not in a
 * Stage 8 table may become a hero metric.
 *
 * Anything the brief marks UNVERIFIED is carried here as `null` and is
 * mechanically excluded from rendering (see `heroMetrics()` below). The one
 * such value is the Model 16's fader travel.
 *
 * Character set: the Roboto Mono / Inter latin subsets do not carry OHM, GTE
 * or LTE glyphs, so the brief's "Ω", "≥" and "≤" are written here in their
 * ASCII-exact equivalents ("ohm", ">=", "<="). scripts/check-glyphs.mjs fails
 * the build if any string in this file needs a glyph the fonts do not have.
 */

export type Tier =
  | "Sub-Compact Digital-Forward Hybrid"
  | "Classic Analog-Forward Hybrid"
  | "Advanced Flagship Hybrid"
  | "Transparent Digital Bridge";

export type UnitId = "model12" | "model16" | "model24" | "model2400" | "studiobridge";

export interface Unit {
  id: UnitId;
  name: string;
  tier: Tier;
  /** Stage 1 tier ordinal. Tier 2 is shared by the Model 16 and Model 24. */
  tierNo: 1 | 2 | 3 | 4;
  /** True only for the four consoles. The Studio Bridge has no preamp stage
   *  to split a signal from and therefore does not participate (Stage 3). */
  triPath: boolean;
  /** Gates the Timecode Synchronization Pulse graphic (Stage 6). */
  midiClock: boolean;
  arch: Record<string, string | null>;
  performance: Record<string, string | null>;
  digital: Record<string, string | null>;
  physical: Record<string, string | null>;
}

const ULTRA_HDDA = "Ultra-HDDA (High Definition Discrete Architecture)";

export const UNITS: Record<UnitId, Unit> = {
  model12: {
    id: "model12",
    name: "Model 12",
    tier: "Sub-Compact Digital-Forward Hybrid",
    tierNo: 1,
    triPath: true,
    midiClock: true,
    arch: {
      "Preamp Topology": ULTRA_HDDA,
      "Input Channels": "10 (8 XLR/TRS mono, 1 TRRS/Bluetooth stereo)",
      "Fader Travel": "60 mm",
    },
    performance: {
      "Equivalent Input Noise (EIN)": "-128 dBu (Rs=150 ohm, Gain Max, A-weighted)",
      "Total Harmonic Distortion (THD+N)": "< 0.003 % (MIC IN to MAIN OUT, 1 kHz, +2 dBu)",
      "Frequency Response": "20 Hz to 20 kHz, +0.1 / -0.15 dB",
    },
    digital: {
      "Multitrack SD Recorder": "12 tracks (10 inputs + 2 stereo mix) up to 24-bit/48 kHz",
      "USB Audio Interface": "12-in / 10-out, USB Type-C, USB 2.0 High-Speed",
      "DAW Control": "HUI/MCU Protocol Emulation",
      MIDI: "5-pin DIN IN/OUT, MTC, SPP",
    },
    physical: {
      "Power Consumption": "16 W (via PS-M1524 AC Adapter)",
      Dimensions: "343 (W) x 98.8 (H) x 360 (D) mm",
      Weight: "4.3 kg",
    },
  },

  model16: {
    id: "model16",
    name: "Model 16",
    tier: "Classic Analog-Forward Hybrid",
    tierNo: 2,
    triPath: true,
    midiClock: false,
    arch: {
      "Preamp Topology": ULTRA_HDDA,
      "Input Channels": "14 (10 XLR mic, 12 TRS line, 2 RCA/Mini stereo)",
      // Stage 8 marks this UNVERIFIED. Never rendered.
      "Fader Travel": null,
    },
    performance: {
      "Equivalent Input Noise (EIN)": "-128 dBu (Mono input, Rs=150 ohm, Gain max)",
      "Total Harmonic Distortion (THD+N)": "< 0.01 % (+10 dBu), < 0.004 % (+4 dBu)",
      "Frequency Response": "20 Hz to 30 kHz, +0.5 / -1.0 dB",
    },
    digital: {
      "Multitrack SD Recorder": "16 tracks (14 inputs + 2 stereo mix) up to 24-bit/48 kHz",
      "USB Audio Interface": "16-in / 14-out, USB 2.0",
      "DAW Control": "None (Audio interface operation only)",
      MIDI: "None",
    },
    physical: {
      "Power Consumption": "40 W",
      Dimensions: "430 (W) x 112.9 (H) x 463 (D) mm",
      Weight: "7.0 kg",
    },
  },

  model24: {
    id: "model24",
    name: "Model 24",
    tier: "Classic Analog-Forward Hybrid",
    tierNo: 2,
    triPath: true,
    midiClock: false,
    arch: {
      "Preamp Topology": ULTRA_HDDA,
      "Input Channels": "22 (16 XLR mic, 20 TRS line, 2 RCA/Bluetooth stereo)",
      "Fader Travel": "100 mm",
    },
    performance: {
      "Equivalent Input Noise (EIN)": "-128 dBu (Mono input, Rs=150 ohm, Gain max)",
      "Total Harmonic Distortion (THD+N)": "< 0.01 % (+10 dBu), < 0.004 % (+4 dBu)",
      "Frequency Response": "20 Hz to 30 kHz, +0.5 / -1.0 dB",
    },
    digital: {
      "Multitrack SD Recorder": "24 tracks (22 inputs + 2 stereo mix) up to 24-bit/48 kHz",
      "USB Audio Interface": "24-in / 22-out, USB 2.0",
      "DAW Control": "None (Audio interface operation only)",
      MIDI: "None",
    },
    physical: {
      "Power Consumption": "52 W",
      Dimensions: "576 x 112.5 x 513 mm",
      Weight: "10.2 kg / 22.49 lbs",
    },
  },

  model2400: {
    id: "model2400",
    name: "Model 2400",
    tier: "Advanced Flagship Hybrid",
    tierNo: 3,
    triPath: true,
    midiClock: true,
    arch: {
      "Preamp Topology": ULTRA_HDDA,
      "Input Channels": "22 (16 XLR mic, 20 TRS line, 2 TS inst)",
      "Fader Travel": "100 mm",
    },
    performance: {
      "Equivalent Input Noise (EIN)": "-128 dBu (Rs=150 ohm, Gain max, A-weighted)",
      "Total Harmonic Distortion (THD+N)": "0.003 % (MIC IN to MAIN OUT, +2 dBu, 1 kHz)",
      "Frequency Response": "20 Hz to 30 kHz (+0.5 / -1.0 dB)",
    },
    digital: {
      "Multitrack SD Recorder": "24 tracks (22 inputs + 2 stereo mix) up to 24-bit/48 kHz",
      "USB Audio Interface": "24-in / 22-out, USB 2.0",
      "DAW Control": "HUI/MCU Protocol Emulation",
      MIDI: "5-pin DIN IN/OUT, MTC, Click Tempo Control",
    },
    physical: {
      "Power Consumption": "65 W",
      Dimensions: "680.5 (W) x 132.5 (H) x 568.0 (D) mm",
      Weight: "14.0 kg",
    },
  },

  studiobridge: {
    id: "studiobridge",
    name: "Studio Bridge",
    tier: "Transparent Digital Bridge",
    tierNo: 4,
    // Stage 3: "Because the Studio Bridge inherently lacks preamplifiers,
    // faders, and a summing bus, it does not participate in the Tri-Path
    // Architecture." Gates the Tri-Path Splitter graphic off entirely.
    triPath: false,
    midiClock: false,
    arch: {
      "Preamp Topology": "None (Direct Line-Level A/D)",
      "Input/Output Topology": "24 x 24 DB25 (AES59-2012 compliant)",
      Impedance: "Input: >= 10 kohm / Output: 200 ohm",
    },
    performance: {
      "Equivalent Input Noise (EIN)": "N/A (No preamplification stage)",
      "Total Harmonic Distortion (THD+N)": "<= 0.003 % (1 kHz, at maximum input level)",
      "Dynamic Range": ">= 100 dB (22 kHz LPF + A-weight)",
    },
    digital: {
      "Multitrack SD Recorder": "24 tracks (BWF WAV) up to 24-bit/48 kHz",
      "USB Audio Interface": "24-in / 24-out, USB Type-B, USB 2.0 High-Speed",
      "DAW Control": "HUI/MCU Protocol Emulation",
      MIDI: "5-pin DIN IN/OUT, MTC, SPP",
    },
    physical: {
      "Power Consumption": "20 W",
      Dimensions: "446.5 (W) x 114.6 (H) x 269.5 (D) mm",
      Weight: "4.5 kg",
      Mounting: "6U 19-inch Rack-mountable (via optional AK-RMSTBG)",
    },
  },
};

export const UNIT_ORDER: UnitId[] = [
  "model12",
  "model16",
  "model24",
  "model2400",
  "studiobridge",
];

/** The four genuine consoles. Studio Bridge sits outside the console topology. */
export const CONSOLES: UnitId[] = ["model12", "model16", "model24", "model2400"];

/**
 * Every Stage 8 value for a unit, flattened, with UNVERIFIED entries dropped.
 * Any hero or callout string must originate here.
 */
export function specEntries(id: UnitId): [string, string][] {
  const u = UNITS[id];
  return [u.arch, u.performance, u.digital, u.physical]
    .flatMap((g) => Object.entries(g))
    .filter((e): e is [string, string] => e[1] !== null);
}

export function specValue(id: UnitId, key: string): string {
  const hit = specEntries(id).find(([k]) => k === key);
  if (!hit) {
    throw new Error(
      `spec: "${key}" is not a VERIFIED Stage 8 value for ${UNITS[id].name}. ` +
        `Only Stage 8 figures may reach the screen.`,
    );
  }
  return hit[1];
}

/** Stage 4 — feature prioritisation, used to weight narrative depth. */
export const STAGE4_PRIORITIES: { unit: UnitId; rank: number; feature: string }[] = [
  { unit: "model2400", rank: 1, feature: "24-Channel Analog Summing with 4 Subgroups" },
  { unit: "model2400", rank: 2, feature: "Integrated MIDI/MTC/SPP Clocking" },
  { unit: "model24", rank: 1, feature: "24-Track Standalone SDXC Engine" },
  { unit: "model16", rank: 1, feature: "14-Channel Tri-Path Signal Splitting" },
  { unit: "model12", rank: 1, feature: "HUI/MCU Protocol DAW Emulation" },
  { unit: "model12", rank: 2, feature: "TRRS Mix-Minus Topology" },
  { unit: "studiobridge", rank: 1, feature: "24x24 DB25 AES59-2012 Line I/O" },
  { unit: "studiobridge", rank: 2, feature: "Hardware DAW Transport Control" },
];
