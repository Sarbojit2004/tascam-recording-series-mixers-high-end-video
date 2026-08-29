/**
 * MOTION PRIMITIVES.
 *
 * Camera vocabulary pulled from across the three MOTU productions (Section 1):
 * gimbal micro-movement, dolly, macro-to-full-reveal, port-density sweep.
 * Moves are eased rather than linear — the MOTU builds use a settled ease-out
 * for entrances and a slow constant drift for gimbal work, and that grammar is
 * what this build inherits.
 */
import { interpolate, Easing } from "remotion";

export const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);
export const EASE_IN_OUT = Easing.bezier(0.65, 0, 0.35, 1);

/** 0 -> 1 over [from, from+len], eased, clamped. */
export const ramp = (f: number, from: number, len: number, easing = EASE_OUT) =>
  interpolate(f, [from, from + len], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing,
  });

/** Constant-velocity 0 -> 1, for gimbal drift that must not accelerate. */
export const linear = (f: number, from: number, len: number) =>
  interpolate(f, [from, from + len], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

/** Fade in then out across a beat, so nothing pops at a cut. */
export const beatOpacity = (f: number, dur: number, inF = 12, outF = 12) =>
  interpolate(f, [0, inF, Math.max(inF + 1, dur - outF), dur], [0, 1, 1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

export const fade = (f: number, from: number, to: number) =>
  interpolate(f, [from, to], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

/**
 * MACRO-TO-FULL-REVEAL. Opens at extreme detail, pulls back smoothly, and
 * RESOLVES TO THE COMPLETE UNIT with time left to hold on it.
 *
 * The whole-product rule is enforced by construction: the scale curve ends at
 * exactly 1.0 by `resolveAt` and stays there, so however tight the opening was,
 * the complete product is on screen, uncropped, for the rest of the beat.
 */
export function macroReveal(f: number, dur: number, startScale = 2.6, resolveAt = 0.72) {
  const end = Math.round(dur * resolveAt);
  const s = interpolate(f, [0, end], [startScale, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE_IN_OUT,
  });
  return Math.max(1, s);
}

/** Gimbal micro-movement: a slow, tiny, constant drift. Never organic. */
export function gimbal(f: number, dur: number, amount = 10) {
  const p = linear(f, 0, dur);
  return { x: (p - 0.5) * amount, y: (p - 0.5) * amount * 0.45 };
}

/**
 * PLATE PUSH-IN, clamped so the plate can never cross the edge inset.
 *
 * Pulled from the MOTU M-Series `LFMedia` approach: motion scales the PLATE
 * (frame and image together), never the image inside a fixed frame. Scaling
 * the inner image is exactly what eats edges and breaks the no-crop rule;
 * growing the whole plate cannot. Where a box lacks the room to grow outward,
 * the push is re-expressed as a settle-IN, which reads as the same deliberate
 * move but grows inward.
 */
export function platePush(
  f: number, dur: number, room: number, boxW: number, want = 0.035,
): number {
  const canGrow = boxW > 0 ? Math.max(0, room / boxW) : 0;
  const grow = Math.min(want, canGrow);
  return grow > 0.004
    ? interpolate(f, [0, dur], [1, 1 + grow], { extrapolateRight: "clamp", easing: EASE_IN_OUT })
    : interpolate(f, [0, dur], [1 - want, 1], { extrapolateRight: "clamp", easing: EASE_IN_OUT });
}
