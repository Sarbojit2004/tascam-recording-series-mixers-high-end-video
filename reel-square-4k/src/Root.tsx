import React from "react";
import { Composition, Still } from "remotion";
import { Reel } from "./Reel";
import { Thumb } from "./Thumb";
import music from "./music.json";

/** Design space 1080 (render with --scale=2): reel 2160 x 2160 @ 60 fps, thumbnail 2160 x 3840. */
export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="TascamRec" component={Reel} durationInFrames={music.frames} fps={60} width={1080} height={1080} />
    <Still id="TascamRecThumb" component={Thumb} width={1080} height={1920} />
  </>
);
