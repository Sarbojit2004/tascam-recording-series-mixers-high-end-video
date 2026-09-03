import React from "react";
import { Thumbnail } from "./shared/thumbnail.tsx";

/**
 * The master poster has its own layout — see shared/masterthumb.tsx. A poster
 * claiming five units has to picture five units, which the single-hero layout
 * the parts use cannot do.
 */
export { MasterThumbnail as MasterThumb } from "./shared/masterthumb.tsx";

/**
 * A poster per part.
 *
 * Each states what ITS part argues rather than repeating the series title, so
 * three thumbnails sitting together in a channel listing read as three
 * episodes of one argument instead of three uploads of the same video. The
 * part number is carried in the kicker, where a viewer looks to find their
 * place, not in the claim.
 */
export const Part1Thumb: React.FC = () => (
  <Thumbnail
    portrait={false}
    kicker="TASCAM MODEL SERIES · PART 1"
    hero={"ONE PREAMP.\nTHREE DESTINATIONS."}
    note="The architecture, and the smallest console that runs it."
    image="model-2400"
  />
);

export const Part2Thumb: React.FC = () => (
  <Thumbnail
    portrait={false}
    kicker="TASCAM MODEL SERIES · PART 2"
    hero={"THE SAME DESIGN,\nTHREE SIZES."}
    note="Model 12 · Model 16 · Model 24 — what the chassis buys you."
    image="model-24-1"
  />
);

export const Part3Thumb: React.FC = () => (
  <Thumbnail
    portrait={false}
    kicker="TASCAM MODEL SERIES · PART 3"
    hero={"THE FLAGSHIP,\nAND THE EXCEPTION."}
    note="Model 2400, and the Studio Bridge that has no preamps at all."
    image="studio-bridge-1"
  />
);
