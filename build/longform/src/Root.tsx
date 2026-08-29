import React from "react";
import { Composition } from "remotion";
import { LANDSCAPE } from "./shared/theme.ts";
import { totalFrames } from "./shared/beat.ts";
import { BEATS } from "./schedule.ts";
import { LongForm } from "./LongForm.tsx";
import { LongFormThumb } from "./Thumb.tsx";

export const Root: React.FC = () => (
  <>
  <Composition id="LongFormThumb" component={LongFormThumb} durationInFrames={1}
               fps={30} width={1920} height={1080} />
  <Composition
    id="LongForm"
    component={LongForm}
    durationInFrames={totalFrames(BEATS, LANDSCAPE.fps)}
    fps={LANDSCAPE.fps}
    width={LANDSCAPE.width}
    height={LANDSCAPE.height}
  />
  </>
);
