import React from "react";
import { Thumbnail } from "./shared/thumbnail.tsx";

/**
 * The long-form's poster. It states the thesis, not the product name: the
 * claim is what distinguishes this from every other mixer video in the grid.
 */
export const LongFormThumb: React.FC = () => (
  <Thumbnail
    portrait={false}
    kicker="TASCAM MODEL SERIES"
    hero={"ONE PREAMP.\nTHREE DESTINATIONS."}
    note="Model 12 · Model 16 · Model 24 · Model 2400 · Studio Bridge"
    image="model-2400"
  />
);
