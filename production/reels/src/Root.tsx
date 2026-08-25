import React from "react";
import { Composition, Still } from "remotion";
import { Reel } from "./Reel.tsx";
import { ReelThumbnail } from "./Thumbnail.tsx";
import { BEATS as R1 } from "./schedule1.ts";
import { BEATS as R2 } from "./schedule2.ts";
import { BEATS as R3 } from "./schedule3.ts";
import { totalFrames } from "./shared/beat.ts";
import { FPS, PORTRAIT } from "./shared/theme.ts";

const REELS = [
  { id: "Reel1", slug: "reel1", beats: R1 },
  { id: "Reel2", slug: "reel2", beats: R2 },
  { id: "Reel3", slug: "reel3", beats: R3 },
] as const;

export const RemotionRoot: React.FC = () => (
  <>
    {REELS.flatMap((r) => [
      <Composition
        key={r.id}
        id={r.id}
        component={Reel}
        durationInFrames={totalFrames(r.beats, FPS)}
        fps={FPS}
        width={PORTRAIT.width}
        height={PORTRAIT.height}
        defaultProps={{ beats: r.beats as never, slug: r.slug, silent: false }}
      />,
      // Picture-only twin for the still-QA and whole-unit guards.
      <Composition
        key={`${r.id}Silent`}
        id={`${r.id}Silent`}
        component={Reel}
        durationInFrames={totalFrames(r.beats, FPS)}
        fps={FPS}
        width={PORTRAIT.width}
        height={PORTRAIT.height}
        defaultProps={{ beats: r.beats as never, slug: r.slug, silent: true }}
      />,
      <Still
        key={`${r.id}Thumb`}
        id={`${r.id}Thumbnail`}
        component={ReelThumbnail}
        width={PORTRAIT.width}
        height={PORTRAIT.height}
        defaultProps={{ which: r.slug as never }}
      />,
    ])}
  </>
);
