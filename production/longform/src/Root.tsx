import React from "react";
import { Composition, Still } from "remotion";
import { LongForm } from "./LongForm.tsx";
import { LongFormThumbnail } from "./Thumbnail.tsx";
import { BEATS } from "./schedule.ts";
import { totalFrames } from "./shared/beat.ts";
import { FPS, LANDSCAPE } from "./shared/theme.ts";

const DURATION = totalFrames(BEATS, FPS); // asserted at 26,940 by scripts/audit.mjs

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="LongForm"
      component={LongForm}
      durationInFrames={DURATION}
      fps={FPS}
      width={LANDSCAPE.width}
      height={LANDSCAPE.height}
      defaultProps={{ silent: false }}
    />
    {/* Picture-only variant used by the still-QA and whole-unit guards, so
        they never pay for audio decoding. */}
    <Composition
      id="LongFormSilent"
      component={LongForm}
      durationInFrames={DURATION}
      fps={FPS}
      width={LANDSCAPE.width}
      height={LANDSCAPE.height}
      defaultProps={{ silent: true }}
    />
    <Still
      id="Thumbnail"
      component={LongFormThumbnail}
      width={LANDSCAPE.width}
      height={LANDSCAPE.height}
    />
  </>
);
