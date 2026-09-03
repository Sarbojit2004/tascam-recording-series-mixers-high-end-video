import React from "react";
import { Composition } from "remotion";
import { LANDSCAPE } from "./shared/theme.ts";
import { totalFrames } from "./shared/beat.ts";
import { PARTS, type PartId } from "./schedule.ts";
import { PLANS } from "./plans.ts";
import { LongFormPart } from "./LongForm.tsx";
import { MasterThumb, Part1Thumb, Part2Thumb, Part3Thumb } from "./Thumb.tsx";

const THUMBS = { part1: Part1Thumb, part2: Part2Thumb, part3: Part3Thumb };

const IDS: Record<PartId, string> = {
  part1: "LongFormPart1",
  part2: "LongFormPart2",
  part3: "LongFormPart3",
};

/** Seconds of the series before each part, so the bed runs continuously. */
const BED_FROM: Record<PartId, number> = { part1: 0, part2: 300, part3: 599 };

export const Root: React.FC = () => (
  <>
    {(Object.keys(PARTS) as PartId[]).map((k) => (
      <Composition
        key={k}
        id={IDS[k]}
        component={LongFormPart}
        defaultProps={{ beats: PARTS[k], plan: PLANS[k], bedFrom: BED_FROM[k], mix: k }}
        durationInFrames={totalFrames(PARTS[k], LANDSCAPE.fps)}
        fps={LANDSCAPE.fps}
        width={LANDSCAPE.width}
        height={LANDSCAPE.height}
      />
    ))}
    {(Object.keys(PARTS) as PartId[]).map((k) => (
      <Composition key={`${k}-thumb`} id={`${IDS[k]}Thumb`} component={THUMBS[k]}
                   durationInFrames={1} fps={LANDSCAPE.fps}
                   width={LANDSCAPE.width} height={LANDSCAPE.height} />
    ))}
    {/* the poster for the three parts joined back into one film */}
    <Composition id="MasterThumb" component={MasterThumb} durationInFrames={1}
                 fps={LANDSCAPE.fps}
                 width={LANDSCAPE.width} height={LANDSCAPE.height} />
  </>
);
