/**
 * Typed access to the prepared asset manifest.
 *
 * REAL and REPRESENTATIONAL assets are kept in separate types and separate
 * lookups on purpose. Section 0.3 requires they never be confused in scene
 * code, naming or coverage tracking: real product photography is under an
 * absolute never-crop rule and its coverage is compulsory, while the Gemini
 * clips carry complete editorial freedom and discretionary usage.
 */
import { staticFile } from "remotion";
import manifest from "./manifest.json";
import type { UnitId } from "./spec.ts";

export interface RealImage {
  id: string; src: string; unit: string; kind: "real-image";
  w: number; h: number; srcW: number; srcH: number;
  ground: "cutout" | "schematic" | "plate" | "dark" | "mixed"; groundLum: number;
  sha: string; path: string; note: string | null;
  duplicateOf?: string[];
  bgFrac?: number;
}
export interface RealVideo {
  id: string; src: string; unit: string; kind: "real-video";
  w: number; h: number; dur: number; path: string;
}
export interface ReprClip {
  id: string; n: number; title: string; kind: "repr-clip";
  crop: "land" | "port"; w: number; h: number; dur: number; path: string;
}

export const IMAGES = manifest.images as RealImage[];
export const VIDEOS = manifest.videos as RealVideo[];
export const CLIPS = manifest.clips as ReprClip[];

const imgIdx = new Map(IMAGES.map((i) => [i.id, i]));
const vidIdx = new Map(VIDEOS.map((v) => [v.id, v]));
const clipIdx = new Map(CLIPS.map((c) => [c.n, c]));

/** A real product image. Throws on a typo rather than rendering a blank slot. */
export function img(id: string): RealImage {
  const r = imgIdx.get(id);
  if (!r) throw new Error(`real image not found: "${id}"`);
  return r;
}
export function vid(id: string): RealVideo {
  const r = vidIdx.get(id);
  if (!r) throw new Error(`real video not found: "${id}"`);
  return r;
}
/** A Gemini representational clip, by its Stage 11 prompt number. */
export function clip(n: number): ReprClip {
  const r = clipIdx.get(n);
  if (!r) {
    throw new Error(
      `representational clip ${n} is not available to this deliverable. ` +
        `Clips are partitioned across deliverables and none may be reused.`,
    );
  }
  return r;
}

export const url = (a: { path: string }) => staticFile(a.path);

export const byUnit = (u: UnitId | "cross") => IMAGES.filter((i) => i.unit === u);

export const LOGO_SHIVANSH = staticFile(
  IMAGES.find((i) => i.unit === "logo_shivansh")!.path,
);
export const LOGO_TASCAM = staticFile(
  IMAGES.find((i) => i.unit === "logo_tascam")!.path,
);
