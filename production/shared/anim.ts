/**
 * MOTION PRIMITIVES.
 *
 * Stage 5 is categorical: "Camera motion must adhere to a robotic, linear,
 * perfectly stabilized grammar... Handheld, erratic, or organic camera
 * movements are strictly prohibited within this visual framework."
 *
 * So the MOTU AVB reference's shot GRAMMAR is inherited (macro-to-full-reveal,
 * connector sweep, drift, montage) but its spring/eased gimbal float is NOT:
 * every move here runs at constant velocity, and the only easing permitted is
 * on opacity, which is a grade, not a camera move.
 */
import { interpolate } from "remotion";

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Constant-velocity ramp. The only motion curve used for position/scale. */
export const linear = (f: number, a: number, b: number, from: number, to: number) =>
  interpolate(f, [a, b], [from, to], clamp);

/** Opacity fade. Easing here is a grade on light, not a camera movement. */
export const fade = (f: number, a: number, b: number, from = 0, to = 1) =>
  interpolate(f, [a, b], [from, to], clamp);

/** Fade in, hold, fade out across a beat of `dur` frames. */
export function beatOpacity(f: number, dur: number, inF = 14, outF = 12) {
  return Math.min(fade(f, 0, inF), fade(f, dur - outF, dur, 1, 0));
}

/** Staggered reveal index for lists of callouts. */
export const stagger = (i: number, every = 7) => i * every;

/**
 * A nodal linear drift — the AVB "gimbal micro-movement" technique rebuilt to
 * Stage 5's constraint. Constant velocity, no rotation, no float; just enough
 * travel that a still frame is never truly static.
 */
export function nodalDrift(f: number, dur: number, ax = 1, ay = 0.5, scale = 0.012) {
  const t = dur > 0 ? f / dur : 0;
  return {
    x: (t - 0.5) * 2 * ax * 9,
    y: (t - 0.5) * 2 * ay * 9,
    scale: 1 + t * scale,
  };
}

/** Deterministic PRNG — identical output on every render. */
export function prng(seed: number) {
  let s = seed >>> 0 || 1;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}
