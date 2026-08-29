/**
 * THE MASTER MIX LEVEL — one measured calibration per deliverable.
 *
 * WHAT WENT WRONG. The first render came out at an integrated -40.3 LUFS,
 * about 26 dB below the level streaming platforms normalise to — and platforms
 * only turn loud material DOWN, so a viewer would have pressed play and heard
 * very close to nothing. Two quiet things had been multiplied: beds built with
 * generous headroom (RMS around -38 dBFS) and a further 0.34 gain on top, each
 * defensible alone and far too quiet together.
 *
 * WHY IT IS PER-DELIVERABLE AND NOT ONE NUMBER. Correcting with a single +12 dB
 * fixed the loudness but exposed a second problem: the four beds were composed
 * at different levels, so the same correction landed the long-form at -28.3
 * LUFS and Reel 1 at -22.7. Five and a half decibels apart is the difference a
 * viewer notices as "the reels are shouting", and reaches for the volume
 * control between videos. Each deliverable therefore carries its own factor,
 * measured from its own render rather than assumed.
 *
 * THE TARGET IS -28 LUFS, and it is a target for a BED, not for a finished
 * mix. These four ship as picture plus music; the voiceover is recorded from
 * docs/voiceover/ and laid in afterwards. -28 sits about 12 dB under a voice
 * tracked to the -16 LUFS platforms normalise to — the conventional place for
 * music under narration — so the delivered file is comfortably audible as it
 * stands and is already at the right level to take a voice without
 * re-balancing the bed.
 *
 * HOW THE NUMBERS WERE OBTAINED. Rendered at a uniform gain, measured with
 * `ffmpeg -af ebur128`, and the difference from -28 LUFS converted to a linear
 * factor. Re-derive with scripts/remix_audio.sh, which prints each file's
 * integrated loudness after muxing.
 *
 * SFX SCALE WITH THE BED. The per-sound numbers in sfx.ts express the BALANCE
 * against the bed, which was already right; applying the calibration to both
 * preserves it exactly instead of letting thirteen numbers drift apart.
 */

export type Deliverable = "longform" | "reel1" | "reel2" | "reel3";

/** The bed gain before calibration — the balance the mix was designed at. */
const BASE = 0.34;

/**
 * Measured at a uniform +12 dB (x3.98), then trimmed to a common -28 LUFS:
 *
 *   longform  -28.3 LUFS  ->  +0.3 dB
 *   reel1     -22.7 LUFS  ->  -5.3 dB
 *   reel2     -22.8 LUFS  ->  -5.2 dB
 *   reel3     -26.1 LUFS  ->  -1.9 dB
 */
export const CALIBRATION: Record<Deliverable, number> = {
  longform: 4.12,
  reel1: 2.16,
  reel2: 2.19,
  reel3: 3.20,
};

export const bedGain = (d: Deliverable) => BASE * CALIBRATION[d];

/** A Layer 2 sound's gain, calibrated with the bed so the balance holds. */
export const sfxGain = (relative: number, d: Deliverable) =>
  relative * CALIBRATION[d];
