/** Beat model shared by all four deliverables. */
import type { UnitId } from "./spec.ts";

export type BeatKind =
  | "cold" | "statement" | "editorial"
  | "macro" | "sweep" | "hero" | "montage"
  | "specs" | "compare"
  | "broll" | "realvideo"
  | "tripath" | "db25" | "timecode"
  | "outro";

export interface Beat {
  id: string;
  kind: BeatKind;
  /** Seconds. Frame count is derived so runtime is exact by construction. */
  sec: number;
  unit?: UnitId;
  units?: UnitId[];
  label?: string;
  hero?: string;
  sub?: string;
  body?: string[];
  /** Real product images, by manifest id. */
  images?: string[];
  /** Real product video, by manifest id. Natural speed, never cropped. */
  video?: string;
  /** Permitted B-roll clip number, 1..16. */
  clip?: number;
  /** Seconds into the clip to start; clips carry full editorial freedom. */
  clipFrom?: number;
  clipRate?: number;
  /** Stage 8 keys to surface as Level 1 figures. */
  specKeys?: string[];
  phase?: string;
}

export const frames = (sec: number, fps = 30) => Math.round(sec * fps);

export function starts(beats: Beat[], fps = 30): number[] {
  const out: number[] = [];
  let acc = 0;
  for (const b of beats) { out.push(acc); acc += frames(b.sec, fps); }
  return out;
}

export const totalFrames = (beats: Beat[], fps = 30) =>
  beats.reduce((n, b) => n + frames(b.sec, fps), 0);
