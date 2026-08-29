/**
 * ASSET LEDGER — generated from build/assets/manifest.json by
 * scripts/prepare_assets.py, then frozen into TypeScript so every asset
 * reference is checked at build time rather than at render time.
 *
 * 101 UNIQUE real images. The source directory holds 105 files, but pixel-
 * content hashing found four byte-identical pairs whose filenames gave no hint
 * they were duplicates. Deduplicating by CONTENT rather than by name is the
 * point: `MODEL 12 (23)` and `MODEL 12 (1)` are the same photograph.
 *
 * `w`/`h` are the TRUE dimensions of the prepared file and are what the
 * no-crop box solver in media.tsx uses. `ground` is the measured luminance of
 * the border ring; `treatment` is "cutout" where a light ground was knocked
 * out so the product sits directly on the paper, "plate" where the photograph
 * keeps its own background on a raised card.
 */

export interface ImageAsset {
  id: string; src: string; unit: string; path: string;
  w: number; h: number; ar: number;
  ground: "light" | "dark" | "mixed";
  treatment: "cutout" | "plate";
  deliverable: string;
}

export const IMAGES: ImageAsset[] = [
  { id: "model-12-0", src: "TASCAM MODEL 12 (0).jpg", unit: "model12", path: "img/model-12-0.png", w: 1600, h: 900, ar: 1.777778, ground: "light", treatment: "cutout", deliverable: "reel1" },
  { id: "model-12-1", src: "TASCAM MODEL 12 (1).jpg", unit: "model12", path: "img/model-12-1.jpg", w: 1600, h: 900, ar: 1.777778, ground: "dark", treatment: "plate", deliverable: "reel1" },
  { id: "model-12-10", src: "TASCAM MODEL 12 (10).jpg", unit: "model12", path: "img/model-12-10.jpg", w: 1600, h: 900, ar: 1.777778, ground: "dark", treatment: "plate", deliverable: "reel1" },
  { id: "model-12-11", src: "TASCAM MODEL 12 (11).jpg", unit: "model12", path: "img/model-12-11.jpg", w: 1600, h: 900, ar: 1.777778, ground: "dark", treatment: "plate", deliverable: "reel1" },
  { id: "model-12-12", src: "TASCAM MODEL 12 (12).jpg", unit: "model12", path: "img/model-12-12.jpg", w: 1600, h: 900, ar: 1.777778, ground: "dark", treatment: "plate", deliverable: "reel1" },
  { id: "model-12-13", src: "TASCAM MODEL 12 (13).jpg", unit: "model12", path: "img/model-12-13.jpg", w: 1600, h: 900, ar: 1.777778, ground: "dark", treatment: "plate", deliverable: "reel2" },
  { id: "model-12-14", src: "TASCAM MODEL 12 (14).jpg", unit: "model12", path: "img/model-12-14.jpg", w: 1600, h: 900, ar: 1.777778, ground: "dark", treatment: "plate", deliverable: "reel2" },
  { id: "model-12-15", src: "TASCAM MODEL 12 (15).jpg", unit: "model12", path: "img/model-12-15.jpg", w: 1600, h: 900, ar: 1.777778, ground: "dark", treatment: "plate", deliverable: "reel2" },
  { id: "model-12-16", src: "TASCAM MODEL 12 (16).jpg", unit: "model12", path: "img/model-12-16.jpg", w: 1600, h: 1069, ar: 1.496726, ground: "dark", treatment: "plate", deliverable: "reel2" },
  { id: "model-12-17", src: "TASCAM MODEL 12 (17).jpg", unit: "model12", path: "img/model-12-17.png", w: 1600, h: 900, ar: 1.777778, ground: "light", treatment: "cutout", deliverable: "reel2" },
  { id: "model-12-18", src: "TASCAM MODEL 12 (18).jpg", unit: "model12", path: "img/model-12-18.png", w: 1600, h: 500, ar: 3.2, ground: "light", treatment: "cutout", deliverable: "reel2" },
  { id: "model-12-19", src: "TASCAM MODEL 12 (19).jpg", unit: "model12", path: "img/model-12-19.png", w: 1000, h: 420, ar: 2.380952, ground: "light", treatment: "cutout", deliverable: "longform" },
  { id: "model-12-2", src: "TASCAM MODEL 12 (2).jpg", unit: "model12", path: "img/model-12-2.jpg", w: 1600, h: 900, ar: 1.777778, ground: "dark", treatment: "plate", deliverable: "longform" },
  { id: "model-12-20", src: "TASCAM MODEL 12 (20).jpg", unit: "model12", path: "img/model-12-20.jpg", w: 1600, h: 900, ar: 1.777778, ground: "dark", treatment: "plate", deliverable: "longform" },
  { id: "model-12-21", src: "TASCAM MODEL 12 (21).jpg", unit: "model12", path: "img/model-12-21.jpg", w: 1600, h: 900, ar: 1.777778, ground: "dark", treatment: "plate", deliverable: "longform" },
  { id: "model-12-22", src: "TASCAM MODEL 12 (22).jpg", unit: "model12", path: "img/model-12-22.png", w: 1600, h: 260, ar: 6.153846, ground: "light", treatment: "cutout", deliverable: "longform" },
  { id: "model-12-3", src: "TASCAM MODEL 12 (3).jpg", unit: "model12", path: "img/model-12-3.png", w: 1600, h: 900, ar: 1.777778, ground: "light", treatment: "cutout", deliverable: "longform" },
  { id: "model-12-4", src: "TASCAM MODEL 12 (4).jpg", unit: "model12", path: "img/model-12-4.png", w: 1600, h: 900, ar: 1.777778, ground: "light", treatment: "cutout", deliverable: "longform" },
  { id: "model-12-5", src: "TASCAM MODEL 12 (5).jpg", unit: "model12", path: "img/model-12-5.png", w: 1600, h: 900, ar: 1.777778, ground: "light", treatment: "cutout", deliverable: "longform" },
  { id: "model-12-6", src: "TASCAM MODEL 12 (6).jpg", unit: "model12", path: "img/model-12-6.png", w: 1600, h: 900, ar: 1.777778, ground: "light", treatment: "cutout", deliverable: "longform" },
  { id: "model-12-7", src: "TASCAM MODEL 12 (7).jpg", unit: "model12", path: "img/model-12-7.png", w: 1600, h: 900, ar: 1.777778, ground: "light", treatment: "cutout", deliverable: "longform" },
  { id: "model-12-8", src: "TASCAM MODEL 12 (8).jpg", unit: "model12", path: "img/model-12-8.png", w: 1600, h: 900, ar: 1.777778, ground: "light", treatment: "cutout", deliverable: "longform" },
  { id: "model-12-9", src: "TASCAM MODEL 12 (9).jpg", unit: "model12", path: "img/model-12-9.jpg", w: 1600, h: 900, ar: 1.777778, ground: "mixed", treatment: "plate", deliverable: "longform" },
  { id: "model-16-0", src: "TASCAM MODEL 16 (0).jpg", unit: "model16", path: "img/model-16-0.png", w: 1600, h: 900, ar: 1.777778, ground: "light", treatment: "cutout", deliverable: "reel1" },
  { id: "model-16-1", src: "TASCAM MODEL 16 (1).jpg", unit: "model16", path: "img/model-16-1.jpg", w: 1600, h: 900, ar: 1.777778, ground: "mixed", treatment: "plate", deliverable: "reel1" },
  { id: "model-16-10", src: "TASCAM MODEL 16 (10).jpg", unit: "model16", path: "img/model-16-10.jpg", w: 1600, h: 1069, ar: 1.496726, ground: "dark", treatment: "plate", deliverable: "reel1" },
  { id: "model-16-11", src: "TASCAM MODEL 16 (11).jpg", unit: "model16", path: "img/model-16-11.jpg", w: 1600, h: 900, ar: 1.777778, ground: "mixed", treatment: "plate", deliverable: "reel1" },
  { id: "model-16-12", src: "TASCAM MODEL 16 (12).jpg", unit: "model16", path: "img/model-16-12.jpg", w: 1600, h: 900, ar: 1.777778, ground: "dark", treatment: "plate", deliverable: "reel1" },
  { id: "model-16-13", src: "TASCAM MODEL 16 (13).jpg", unit: "model16", path: "img/model-16-13.jpg", w: 1600, h: 900, ar: 1.777778, ground: "mixed", treatment: "plate", deliverable: "longform" },
  { id: "model-16-14", src: "TASCAM MODEL 16 (14).jpg", unit: "model16", path: "img/model-16-14.jpg", w: 1600, h: 900, ar: 1.777778, ground: "dark", treatment: "plate", deliverable: "longform" },
  { id: "model-16-15", src: "TASCAM MODEL 16 (15).jpg", unit: "model16", path: "img/model-16-15.png", w: 1600, h: 900, ar: 1.777778, ground: "light", treatment: "cutout", deliverable: "longform" },
  { id: "model-16-2", src: "TASCAM MODEL 16 (2).jpg", unit: "model16", path: "img/model-16-2.jpg", w: 1600, h: 900, ar: 1.777778, ground: "dark", treatment: "plate", deliverable: "longform" },
  { id: "model-16-3", src: "TASCAM MODEL 16 (3).jpg", unit: "model16", path: "img/model-16-3.jpg", w: 1600, h: 900, ar: 1.777778, ground: "dark", treatment: "plate", deliverable: "longform" },
  { id: "model-16-4", src: "TASCAM MODEL 16 (4).jpg", unit: "model16", path: "img/model-16-4.jpg", w: 1600, h: 900, ar: 1.777778, ground: "dark", treatment: "plate", deliverable: "longform" },
  { id: "model-16-5", src: "TASCAM MODEL 16 (5).jpg", unit: "model16", path: "img/model-16-5.jpg", w: 1600, h: 1067, ar: 1.499531, ground: "dark", treatment: "plate", deliverable: "longform" },
  { id: "model-16-6", src: "TASCAM MODEL 16 (6).jpg", unit: "model16", path: "img/model-16-6.png", w: 1600, h: 900, ar: 1.777778, ground: "light", treatment: "cutout", deliverable: "longform" },
  { id: "model-16-7", src: "TASCAM MODEL 16 (7).jpg", unit: "model16", path: "img/model-16-7.png", w: 1600, h: 900, ar: 1.777778, ground: "light", treatment: "cutout", deliverable: "longform" },
  { id: "model-16-8", src: "TASCAM MODEL 16 (8).jpg", unit: "model16", path: "img/model-16-8.jpg", w: 1600, h: 900, ar: 1.777778, ground: "mixed", treatment: "plate", deliverable: "longform" },
  { id: "model-16-9", src: "TASCAM MODEL 16 (9).jpg", unit: "model16", path: "img/model-16-9.jpg", w: 1600, h: 900, ar: 1.777778, ground: "mixed", treatment: "plate", deliverable: "longform" },
  { id: "model-24-1", src: "TASCAM MODEL 24 (1).jpg", unit: "model24", path: "img/model-24-1.jpg", w: 2000, h: 1125, ar: 1.777778, ground: "dark", treatment: "plate", deliverable: "reel1" },
  { id: "model-24-10", src: "TASCAM MODEL 24 (10).jpg", unit: "model24", path: "img/model-24-10.jpg", w: 1600, h: 1400, ar: 1.142857, ground: "mixed", treatment: "plate", deliverable: "reel1" },
  { id: "model-24-11", src: "TASCAM MODEL 24 (11).jpg", unit: "model24", path: "img/model-24-11.png", w: 1600, h: 850, ar: 1.882353, ground: "light", treatment: "cutout", deliverable: "reel1" },
  { id: "model-24-12", src: "TASCAM MODEL 24 (12).jpg", unit: "model24", path: "img/model-24-12.jpg", w: 2000, h: 1125, ar: 1.777778, ground: "dark", treatment: "plate", deliverable: "reel1" },
  { id: "model-24-13", src: "TASCAM MODEL 24 (13).jpg", unit: "model24", path: "img/model-24-13.jpg", w: 2000, h: 1125, ar: 1.777778, ground: "dark", treatment: "plate", deliverable: "reel1" },
  { id: "model-24-15", src: "TASCAM MODEL 24 (15).jpg", unit: "model24", path: "img/model-24-15.jpg", w: 2000, h: 1125, ar: 1.777778, ground: "dark", treatment: "plate", deliverable: "reel1" },
  { id: "model-24-17", src: "TASCAM MODEL 24 (17).jpg", unit: "model24", path: "img/model-24-17.jpg", w: 2000, h: 1125, ar: 1.777778, ground: "dark", treatment: "plate", deliverable: "longform" },
  { id: "model-24-18", src: "TASCAM MODEL 24 (18).jpg", unit: "model24", path: "img/model-24-18.jpg", w: 1600, h: 1069, ar: 1.496726, ground: "dark", treatment: "plate", deliverable: "longform" },
  { id: "model-24-19", src: "TASCAM MODEL 24 (19).jpg", unit: "model24", path: "img/model-24-19.jpg", w: 2000, h: 1125, ar: 1.777778, ground: "dark", treatment: "plate", deliverable: "longform" },
  { id: "model-24-2", src: "TASCAM MODEL 24 (2).jpg", unit: "model24", path: "img/model-24-2.jpg", w: 2000, h: 1125, ar: 1.777778, ground: "dark", treatment: "plate", deliverable: "longform" },
  { id: "model-24-21", src: "TASCAM MODEL 24 (21).jpg", unit: "model24", path: "img/model-24-21.png", w: 1600, h: 320, ar: 5.0, ground: "light", treatment: "cutout", deliverable: "longform" },
  { id: "model-24-3", src: "TASCAM MODEL 24 (3).jpg", unit: "model24", path: "img/model-24-3.jpg", w: 2000, h: 1125, ar: 1.777778, ground: "dark", treatment: "plate", deliverable: "longform" },
  { id: "model-24-4", src: "TASCAM MODEL 24 (4).jpg", unit: "model24", path: "img/model-24-4.jpg", w: 1920, h: 1440, ar: 1.333333, ground: "dark", treatment: "plate", deliverable: "longform" },
  { id: "model-24-5", src: "TASCAM MODEL 24 (5).jpg", unit: "model24", path: "img/model-24-5.jpg", w: 1920, h: 1440, ar: 1.333333, ground: "dark", treatment: "plate", deliverable: "longform" },
  { id: "model-24-6", src: "TASCAM MODEL 24 (6).jpg", unit: "model24", path: "img/model-24-6.png", w: 1600, h: 970, ar: 1.649485, ground: "light", treatment: "cutout", deliverable: "longform" },
  { id: "model-24-7", src: "TASCAM MODEL 24 (7).jpg", unit: "model24", path: "img/model-24-7.png", w: 1600, h: 590, ar: 2.711864, ground: "light", treatment: "cutout", deliverable: "longform" },
  { id: "model-24-8", src: "TASCAM MODEL 24 (8).jpg", unit: "model24", path: "img/model-24-8.png", w: 1600, h: 980, ar: 1.632653, ground: "light", treatment: "cutout", deliverable: "longform" },
  { id: "model-24-9", src: "TASCAM MODEL 24 (9).jpg", unit: "model24", path: "img/model-24-9.png", w: 1600, h: 610, ar: 2.622951, ground: "light", treatment: "cutout", deliverable: "longform" },
  { id: "model-24-case-study-1", src: "TASCAM MODEL 24 CASE STUDY (1).jpg", unit: "model24", path: "img/model-24-case-study-1.jpg", w: 1200, h: 900, ar: 1.333333, ground: "mixed", treatment: "plate", deliverable: "longform" },
  { id: "model-24-case-study-2", src: "TASCAM MODEL 24 CASE STUDY (2).jpg", unit: "model24", path: "img/model-24-case-study-2.jpg", w: 1000, h: 563, ar: 1.776199, ground: "mixed", treatment: "plate", deliverable: "longform" },
  { id: "model-24-case-study-3", src: "TASCAM MODEL 24 CASE STUDY (3).jpg", unit: "model24", path: "img/model-24-case-study-3.jpg", w: 1600, h: 900, ar: 1.777778, ground: "dark", treatment: "plate", deliverable: "longform" },
  { id: "model-24-case-study-4", src: "TASCAM MODEL 24 CASE STUDY (4).jpg", unit: "model2400", path: "img/model-24-case-study-4.jpg", w: 1600, h: 1000, ar: 1.6, ground: "mixed", treatment: "plate", deliverable: "reel1" },
  { id: "model-24-case-study", src: "TASCAM MODEL 24 CASE STUDY.jpg", unit: "model24", path: "img/model-24-case-study.jpg", w: 1200, h: 900, ar: 1.333333, ground: "mixed", treatment: "plate", deliverable: "longform" },
  { id: "model-24-vs-model-2400", src: "TASCAM MODEL 24 VS MODEL 2400.jpg", unit: "model24", path: "img/model-24-vs-model-2400.jpg", w: 1200, h: 488, ar: 2.459016, ground: "dark", treatment: "plate", deliverable: "longform" },
  { id: "model-2400-1", src: "TASCAM MODEL 2400 (1).jpg", unit: "model2400", path: "img/model-2400-1.jpg", w: 2000, h: 1500, ar: 1.333333, ground: "dark", treatment: "plate", deliverable: "reel1" },
  { id: "model-2400-10", src: "TASCAM MODEL 2400 (10).jpg", unit: "model2400", path: "img/model-2400-10.jpg", w: 1000, h: 668, ar: 1.497006, ground: "dark", treatment: "plate", deliverable: "reel1" },
  { id: "model-2400-11", src: "TASCAM MODEL 2400 (11).jpg", unit: "model2400", path: "img/model-2400-11.jpg", w: 1000, h: 563, ar: 1.776199, ground: "mixed", treatment: "plate", deliverable: "reel1" },
  { id: "model-2400-12", src: "TASCAM MODEL 2400 (12).jpg", unit: "model2400", path: "img/model-2400-12.jpg", w: 1000, h: 1000, ar: 1.0, ground: "dark", treatment: "plate", deliverable: "reel1" },
  { id: "model-2400-13", src: "TASCAM MODEL 2400 (13).jpg", unit: "model2400", path: "img/model-2400-13.jpg", w: 1000, h: 1000, ar: 1.0, ground: "mixed", treatment: "plate", deliverable: "reel2" },
  { id: "model-2400-14", src: "TASCAM MODEL 2400 (14).jpg", unit: "model2400", path: "img/model-2400-14.jpg", w: 1000, h: 1000, ar: 1.0, ground: "dark", treatment: "plate", deliverable: "reel2" },
  { id: "model-2400-15", src: "TASCAM MODEL 2400 (15).jpg", unit: "model2400", path: "img/model-2400-15.jpg", w: 1000, h: 1000, ar: 1.0, ground: "dark", treatment: "plate", deliverable: "reel2" },
  { id: "model-2400-16", src: "TASCAM MODEL 2400 (16).jpg", unit: "model2400", path: "img/model-2400-16.jpg", w: 1000, h: 1000, ar: 1.0, ground: "dark", treatment: "plate", deliverable: "reel2" },
  { id: "model-2400-2", src: "TASCAM MODEL 2400 (2).jpg", unit: "model2400", path: "img/model-2400-2.png", w: 2000, h: 1125, ar: 1.777778, ground: "light", treatment: "cutout", deliverable: "reel2" },
  { id: "model-2400-3", src: "TASCAM MODEL 2400 (3).jpg", unit: "model2400", path: "img/model-2400-3.png", w: 2000, h: 1500, ar: 1.333333, ground: "light", treatment: "cutout", deliverable: "reel2" },
  { id: "model-2400-4", src: "TASCAM MODEL 2400 (4).jpg", unit: "model2400", path: "img/model-2400-4.png", w: 2000, h: 1125, ar: 1.777778, ground: "light", treatment: "cutout", deliverable: "longform" },
  { id: "model-2400-5", src: "TASCAM MODEL 2400 (5).jpg", unit: "model2400", path: "img/model-2400-5.png", w: 2000, h: 1125, ar: 1.777778, ground: "light", treatment: "cutout", deliverable: "longform" },
  { id: "model-2400-6", src: "TASCAM MODEL 2400 (6).jpg", unit: "model2400", path: "img/model-2400-6.png", w: 2000, h: 1125, ar: 1.777778, ground: "light", treatment: "cutout", deliverable: "longform" },
  { id: "model-2400-7", src: "TASCAM MODEL 2400 (7).jpg", unit: "model2400", path: "img/model-2400-7.png", w: 2000, h: 1500, ar: 1.333333, ground: "light", treatment: "cutout", deliverable: "longform" },
  { id: "model-2400-8", src: "TASCAM MODEL 2400 (8).jpg", unit: "model2400", path: "img/model-2400-8.png", w: 2000, h: 1500, ar: 1.333333, ground: "light", treatment: "cutout", deliverable: "longform" },
  { id: "model-2400-9", src: "TASCAM MODEL 2400 (9).jpg", unit: "model2400", path: "img/model-2400-9.jpg", w: 1000, h: 902, ar: 1.108647, ground: "dark", treatment: "plate", deliverable: "longform" },
  { id: "model-2400", src: "TASCAM MODEL 2400.jpg", unit: "model2400", path: "img/model-2400.png", w: 2000, h: 1750, ar: 1.142857, ground: "light", treatment: "cutout", deliverable: "longform" },
  { id: "studio-bridge-1", src: "TASCAM STUDIO BRIDGE (1).jpg", unit: "studiobridge", path: "img/studio-bridge-1.jpg", w: 1600, h: 500, ar: 3.2, ground: "dark", treatment: "plate", deliverable: "reel3" },
  { id: "studio-bridge-10", src: "TASCAM STUDIO BRIDGE (10).jpg", unit: "studiobridge", path: "img/studio-bridge-10.jpg", w: 1200, h: 801, ar: 1.498127, ground: "mixed", treatment: "plate", deliverable: "reel3" },
  { id: "studio-bridge-11", src: "TASCAM STUDIO BRIDGE (11).jpg", unit: "studiobridge", path: "img/studio-bridge-11.jpg", w: 1000, h: 1000, ar: 1.0, ground: "mixed", treatment: "plate", deliverable: "reel3" },
  { id: "studio-bridge-12", src: "TASCAM STUDIO BRIDGE (12).jpg", unit: "studiobridge", path: "img/studio-bridge-12.jpg", w: 1350, h: 900, ar: 1.5, ground: "dark", treatment: "plate", deliverable: "reel3" },
  { id: "studio-bridge-13", src: "TASCAM STUDIO BRIDGE (13).jpg", unit: "studiobridge", path: "img/studio-bridge-13.jpg", w: 1600, h: 1069, ar: 1.496726, ground: "mixed", treatment: "plate", deliverable: "reel3" },
  { id: "studio-bridge-14", src: "TASCAM STUDIO BRIDGE (14).jpg", unit: "studiobridge", path: "img/studio-bridge-14.jpg", w: 1600, h: 1600, ar: 1.0, ground: "dark", treatment: "plate", deliverable: "reel3" },
  { id: "studio-bridge-15", src: "TASCAM STUDIO BRIDGE (15).jpg", unit: "studiobridge", path: "img/studio-bridge-15.jpg", w: 1600, h: 1600, ar: 1.0, ground: "dark", treatment: "plate", deliverable: "reel3" },
  { id: "studio-bridge-16", src: "TASCAM STUDIO BRIDGE (16).jpg", unit: "studiobridge", path: "img/studio-bridge-16.jpg", w: 1600, h: 1600, ar: 1.0, ground: "dark", treatment: "plate", deliverable: "reel3" },
  { id: "studio-bridge-17", src: "TASCAM STUDIO BRIDGE (17).jpg", unit: "studiobridge", path: "img/studio-bridge-17.jpg", w: 1600, h: 1600, ar: 1.0, ground: "dark", treatment: "plate", deliverable: "reel3" },
  { id: "studio-bridge-18", src: "TASCAM STUDIO BRIDGE (18).jpg", unit: "studiobridge", path: "img/studio-bridge-18.png", w: 1600, h: 1600, ar: 1.0, ground: "light", treatment: "cutout", deliverable: "reel3" },
  { id: "studio-bridge-19", src: "TASCAM STUDIO BRIDGE (19).jpg", unit: "studiobridge", path: "img/studio-bridge-19.png", w: 1600, h: 1600, ar: 1.0, ground: "light", treatment: "cutout", deliverable: "reel3" },
  { id: "studio-bridge-2", src: "TASCAM STUDIO BRIDGE (2).jpg", unit: "studiobridge", path: "img/studio-bridge-2.png", w: 1200, h: 900, ar: 1.333333, ground: "light", treatment: "cutout", deliverable: "reel3" },
  { id: "studio-bridge-20", src: "TASCAM STUDIO BRIDGE (20).jpg", unit: "studiobridge", path: "img/studio-bridge-20.png", w: 1600, h: 1600, ar: 1.0, ground: "light", treatment: "cutout", deliverable: "reel3" },
  { id: "studio-bridge-21", src: "TASCAM STUDIO BRIDGE (21).jpg", unit: "studiobridge", path: "img/studio-bridge-21.png", w: 1600, h: 1600, ar: 1.0, ground: "light", treatment: "cutout", deliverable: "longform" },
  { id: "studio-bridge-3", src: "TASCAM STUDIO BRIDGE (3).jpg", unit: "studiobridge", path: "img/studio-bridge-3.png", w: 1200, h: 900, ar: 1.333333, ground: "light", treatment: "cutout", deliverable: "longform" },
  { id: "studio-bridge-4", src: "TASCAM STUDIO BRIDGE (4).jpg", unit: "studiobridge", path: "img/studio-bridge-4.png", w: 1200, h: 600, ar: 2.0, ground: "light", treatment: "cutout", deliverable: "longform" },
  { id: "studio-bridge-5", src: "TASCAM STUDIO BRIDGE (5).jpg", unit: "studiobridge", path: "img/studio-bridge-5.png", w: 1200, h: 900, ar: 1.333333, ground: "light", treatment: "cutout", deliverable: "longform" },
  { id: "studio-bridge-6", src: "TASCAM STUDIO BRIDGE (6).jpg", unit: "studiobridge", path: "img/studio-bridge-6.png", w: 1200, h: 600, ar: 2.0, ground: "light", treatment: "cutout", deliverable: "longform" },
  { id: "studio-bridge-7", src: "TASCAM STUDIO BRIDGE (7).jpg", unit: "studiobridge", path: "img/studio-bridge-7.png", w: 1200, h: 900, ar: 1.333333, ground: "light", treatment: "cutout", deliverable: "longform" },
  { id: "studio-bridge-8", src: "TASCAM STUDIO BRIDGE (8).jpg", unit: "studiobridge", path: "img/studio-bridge-8.png", w: 1200, h: 900, ar: 1.333333, ground: "light", treatment: "cutout", deliverable: "longform" },
  { id: "studio-bridge-9", src: "TASCAM STUDIO BRIDGE (9).jpg", unit: "studiobridge", path: "img/studio-bridge-9.jpg", w: 1200, h: 800, ar: 1.5, ground: "mixed", treatment: "plate", deliverable: "longform" },
];

export interface VideoAsset { id: string; src: string; unit: string; path: string; }
export const VIDEOS: VideoAsset[] = [
  { id: "model-12-video", src: "TASCAM MODEL 12 VIDEO.mp4", unit: "model12", path: "video/model-12-video.mp4" },
  { id: "model-16-video", src: "TASCAM MODEL 16 VIDEO.mp4", unit: "model16", path: "video/model-16-video.mp4" },
  { id: "model-24-video", src: "TASCAM MODEL 24 VIDEO.mp4", unit: "model24", path: "video/model-24-video.mp4" },
  { id: "model-2400-video", src: "TASCAM MODEL 2400 VIDEO.mp4", unit: "model2400", path: "video/model-2400-video.mp4" },
];

/** The sixteen permitted B-roll clips. Section 0.3 admits no others. */
export const CLIP_COUNT = 16;

export function clipSrc(n: number, orientation: "land" | "port"): string {
  if (!Number.isInteger(n) || n < 1 || n > CLIP_COUNT) {
    throw new Error(
      `clipSrc(${n}): only B-ROLL clips 1..${CLIP_COUNT} are permitted footage. ` +
      `The seventeen GEMINI files are permanently excluded (Section 0.2).`,
    );
  }
  return `clips/c${n}-${orientation}.mp4`;
}

const IMG_BY_ID = new Map(IMAGES.map((i) => [i.id, i]));
const VID_BY_ID = new Map(VIDEOS.map((v) => [v.id, v]));

export function imageById(id: string): ImageAsset {
  const a = IMG_BY_ID.get(id);
  if (!a) throw new Error(`imageById("${id}"): no such prepared image.`);
  return a;
}

export function videoById(id: string): VideoAsset {
  const a = VID_BY_ID.get(id);
  if (!a) throw new Error(`videoById("${id}"): no such prepared product video.`);
  return a;
}

export const imagesFor = (unit: string): ImageAsset[] =>
  IMAGES.filter((i) => i.unit === unit);

export const ar = (id: string): number => imageById(id).ar;
