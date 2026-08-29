import React from "react";
import { Composition } from "remotion";
import { PORTRAIT } from "./shared/theme.ts";
import { totalFrames } from "./shared/beat.ts";
import { REELS, type ReelId } from "./schedules.ts";
import { PLANS } from "./plans.ts";
import { Reel } from "./Reel.tsx";
import { Reel1Thumb, Reel2Thumb, Reel3Thumb } from "./Thumbs.tsx";

const THUMBS = { reel1: Reel1Thumb, reel2: Reel2Thumb, reel3: Reel3Thumb };

const BEDS: Record<ReelId, string> = {
  reel1: "reel1-music-bed.wav",
  reel2: "reel2-music-bed.wav",
  reel3: "reel3-music-bed.wav",
};

const IDS: Record<ReelId, string> = {
  reel1: "Reel1TriPathSurvey",
  reel2: "Reel2FlagshipSpecialist",
  reel3: "Reel3TransparentBridge",
};

export const Root: React.FC = () => (
  <>
    {(Object.keys(REELS) as ReelId[]).map((k) => (
      <Composition
        key={k}
        id={IDS[k]}
        component={Reel}
        defaultProps={{ beats: REELS[k], plan: PLANS[k], bed: BEDS[k] }}
        durationInFrames={totalFrames(REELS[k], PORTRAIT.fps)}
        fps={PORTRAIT.fps}
        width={PORTRAIT.width}
        height={PORTRAIT.height}
      />
    ))}
    {(Object.keys(REELS) as ReelId[]).map((k) => (
      <Composition key={`${k}-thumb`} id={`${IDS[k]}Thumb`} component={THUMBS[k]}
                   durationInFrames={1} fps={PORTRAIT.fps}
                   width={PORTRAIT.width} height={PORTRAIT.height} />
    ))}
  </>
);
