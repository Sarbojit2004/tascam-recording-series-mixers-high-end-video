import React from "react";
import { Thumbnail } from "./shared/thumbnail.tsx";

/**
 * THE MASTER POSTER — for the three parts joined back into one film.
 *
 * It has to do a different job from the part posters sitting beside it. A part
 * poster says which part this is; the master has to say "this is all of it", so
 * that someone choosing between the four uploads can tell at a glance which one
 * is the whole thing. Hence a claim about the RANGE rather than the thesis —
 * the thesis headline belongs to Part 1, and repeating it here would make the
 * master read as a duplicate of Part 1 in a channel listing.
 */
export const MasterThumb: React.FC = () => (
  <Thumbnail
    portrait={false}
    kicker="TASCAM MODEL SERIES · THE COMPLETE FILM"
    hero={"FIVE UNITS.\nONE ARCHITECTURE."}
    note="One preamp, three destinations — across Model 12, 16, 24, 2400 and the Studio Bridge."
    image="model-2400"
  />
);

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
