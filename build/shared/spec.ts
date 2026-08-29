/**
 * STAGE 8 — VERIFIED TECHNICAL SPECIFICATION MASTER TABLES.
 *
 * The single source of every technical figure that reaches the screen.
 * Transcribed directly from the Gemini pre-production brief's own Stage 8
 * tables (Section 5 keeps that research authoritative). Nothing is rounded,
 * approximated or inferred.
 *
 * Anything the brief marks UNVERIFIED is stored as `null` and CANNOT reach the
 * screen: `specValue()` throws rather than returning it. The Model 16's fader
 * travel is the live case — it is UNVERIFIED in Stage 8 and is therefore
 * mechanically excluded from every deliverable.
 *
 * GLYPH NOTE. The Archivo/Fraunces latin subsets carry no OMEGA, GTE or LTE
 * glyph, so the brief's "Ω", "≥" and "≤" are written here in ASCII-exact form
 * ("ohm", ">=", "<="). scripts/check_glyphs.mjs fails the build if any rendered
 * string needs a glyph the shipped font files do not contain.
 */

export type UnitId = "model12" | "model16" | "model24" | "model2400" | "studiobridge";

export interface Unit {
  id: UnitId;
  name: string;
  /** Stage 1's verified four-tier architecture. */
  tier: string;
  tierNo: 1 | 2 | 3 | 4;
  /** Participates in the Tri-Path Architecture. FALSE only for Studio Bridge,
   *  which has no preamp stage to split from (Stage 1). */
  triPath: boolean;
  /** Carries the Stage 6 Timecode Synchronization Pulse. Scoped by Section 6
   *  to Model 12 and Model 2400 only. */
  timecode: boolean;
  arch: Record<string, string | null>;
  performance: Record<string, string | null>;
  digital: Record<string, string | null>;
  physical: Record<string, string | null>;
}

export const UNITS: Record<UnitId, Unit> = {
  model12: {
    id: "model12", name: "Model 12",
    tier: "Sub-Compact Digital-Forward Hybrid", tierNo: 1,
    triPath: true, timecode: true,
    arch: {
      "Preamp Topology": "Ultra-HDDA (High Definition Discrete Architecture)",
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
      "MIDI": "5-pin DIN IN/OUT, MTC, SPP",
    },
    physical: {
      "Power Consumption": "16 W (via PS-M1524 AC Adapter)",
      "Dimensions": "343 (W) x 98.8 (H) x 360 (D) mm",
      "Weight": "4.3 kg",
    },
  },

  model16: {
    id: "model16", name: "Model 16",
    tier: "Classic Analog-Forward Hybrid", tierNo: 2,
    triPath: true, timecode: false,
    arch: {
      "Preamp Topology": "Ultra-HDDA (High Definition Discrete Architecture)",
      "Input Channels": "14 (10 XLR mic, 12 TRS line, 2 RCA/Mini stereo)",
      "Fader Travel": null, // UNVERIFIED in Stage 8 — never stated.
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
      "MIDI": "None",
    },
    physical: {
      "Power Consumption": "40 W",
      "Dimensions": "430 (W) x 112.9 (H) x 463 (D) mm",
      "Weight": "7.0 kg",
    },
  },

  model24: {
    id: "model24", name: "Model 24",
    tier: "Classic Analog-Forward Hybrid", tierNo: 2,
    triPath: true, timecode: false,
    arch: {
      "Preamp Topology": "Ultra-HDDA (High Definition Discrete Architecture)",
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
      "MIDI": "None",
    },
    physical: {
      "Power Consumption": "52 W",
      "Dimensions": "576 x 112.5 x 513 mm",
      "Weight": "10.2 kg",
    },
  },

  model2400: {
    id: "model2400", name: "Model 2400",
    tier: "Advanced Flagship Hybrid", tierNo: 3,
    triPath: true, timecode: true,
    arch: {
      "Preamp Topology": "Ultra-HDDA (High Definition Discrete Architecture)",
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
      "MIDI": "5-pin DIN IN/OUT, MTC, Click Tempo Control",
    },
    physical: {
      "Power Consumption": "65 W",
      "Dimensions": "680.5 (W) x 132.5 (H) x 568.0 (D) mm",
      "Weight": "14.0 kg",
    },
  },

  studiobridge: {
    id: "studiobridge", name: "Studio Bridge",
    tier: "Transparent Digital Bridge", tierNo: 4,
    // Stage 1: no preamp stage, therefore nothing to split. Outside the
    // console topology entirely.
    triPath: false,
    // Section 6 scopes the Timecode Pulse to Model 12 and Model 2400 only.
    timecode: false,
    arch: {
      "Preamp Topology": "None (Direct Line-Level A/D)",
      "Input/Output Topology": "24 x 24 DB25 (AES59-2012 compliant)",
      "Impedance": "Input: >= 10 kohm / Output: 200 ohm",
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
      "MIDI": "5-pin DIN IN/OUT, MTC, SPP",
    },
    physical: {
      "Power Consumption": "20 W",
      "Dimensions": "446.5 (W) x 114.6 (H) x 269.5 (D) mm",
      "Weight": "4.5 kg",
      "Mounting": "6U 19-inch Rack-mountable (via optional AK-RMSTBG)",
    },
  },
};

export const TIERS = [
  { no: 1, label: "Sub-Compact Digital-Forward Hybrid", units: ["model12"] },
  { no: 2, label: "Classic Analog-Forward Hybrids", units: ["model16", "model24"] },
  { no: 3, label: "Advanced Flagship Hybrid", units: ["model2400"] },
  { no: 4, label: "Transparent Digital Bridge", units: ["studiobridge"] },
] as const;

/**
 * The only way a technical figure reaches the screen. Throws on a key that is
 * absent or UNVERIFIED, so an unverified value cannot be rendered by accident.
 */
export function specValue(unit: UnitId, key: string): string {
  const u = UNITS[unit];
  for (const group of [u.arch, u.performance, u.digital, u.physical]) {
    if (key in group) {
      const v = group[key];
      if (v === null) {
        throw new Error(
          `specValue("${unit}", "${key}"): this parameter is UNVERIFIED in the ` +
          `brief's Stage 8 table and must never be stated as fact.`,
        );
      }
      return v;
    }
  }
  throw new Error(`specValue("${unit}", "${key}"): no such VERIFIED Stage 8 parameter.`);
}
