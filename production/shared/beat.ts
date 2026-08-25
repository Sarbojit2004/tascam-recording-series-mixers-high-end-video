/**
 * The beat model shared by all four deliverables.
 *
 * Everything downstream is derived from this one table: the rendered scenes,
 * the real-asset coverage ledger, the Gemini-clip allocation audit, and the
 * Layer 2 SFX cue list (so the delivered SFX stem and the audio in the MP4 are
 * the same samples by construction). Editing a beat therefore cannot leave the
 * coverage ledger or the SFX timeline stale.
 */
import type { UnitId } from "./spec.ts";

export type BeatKind =
  | "cold"        // cold open: representational B-roll under a hero line
  | "statement"   // full-frame typographic argument, no imagery
  | "macro"       // MacroReveal on one real image (resolves to the whole unit)
  | "sweep"       // ConnectorSweep along a connector row (resolves likewise)
  | "unit"        // unit title card: tier tag + name + one complete image
  | "specs"       // Stage 8 spec table beside a real image
  | "montage"     // grid of complete images
  | "repr"        // representational B-roll with overlay type
  | "realvideo"   // real product video, natural speed, never sped up
  | "schematic"   // an inverted line-art diagram with callouts
  | "tripath"     // Stage 6 concept 1 — consoles only
  | "db25"        // Stage 6 concept 2 — Studio Bridge only
  | "timecode"    // Stage 6 concept 3 — Model 12 / Model 2400 only
  | "outro";      // Level 3 resolution legend

export interface Beat {
  id: string;
  kind: BeatKind;
  /** Duration in seconds. The schedule's total is asserted against the exact
   *  runtime, so these are the single source of timing truth. */
  sec: number;
  unit?: UnitId;
  /** Real product images placed in this beat. Feeds the coverage ledger. */
  images?: string[];
  /** Real product video. Natural speed only. */
  video?: string;
  /** Representational clip, by Stage 11 prompt number. */
  clip?: number;
  clipFrom?: number;
  clipRate?: number;
  /** Level 1 hero metric. Must originate in a Stage 8 table. */
  hero?: string;
  /** Level 2 contextual line. */
  sub?: string;
  /** Small tracked label — chapter marks and section names. */
  label?: string;
  /** Body copy for statement beats. */
  body?: string[];
  /** Stage 8 keys to render as a spec table. */
  specKeys?: string[];
  /** Focal point for macro beats, 0..1 in image space. */
  focus?: [number, number];
  /** Phase marker — triggers the phase-mark SFX and a chapter rule. */
  phase?: string;
}

export const frames = (sec: number, fps = 30) => Math.round(sec * fps);

export function starts(beats: Beat[], fps = 30): number[] {
  let f = 0;
  return beats.map((b) => {
    const s = f;
    f += frames(b.sec, fps);
    return s;
  });
}

export function totalFrames(beats: Beat[], fps = 30): number {
  return beats.reduce((n, b) => n + frames(b.sec, fps), 0);
}

/** Every real image referenced anywhere in a schedule. */
export function coveredImages(beats: Beat[]): string[] {
  return beats.flatMap((b) => b.images ?? []);
}
export function coveredVideos(beats: Beat[]): string[] {
  return beats.flatMap((b) => (b.video ? [b.video] : []));
}
export function usedClips(beats: Beat[]): number[] {
  return beats.flatMap((b) => (b.clip !== undefined ? [b.clip] : []));
}
