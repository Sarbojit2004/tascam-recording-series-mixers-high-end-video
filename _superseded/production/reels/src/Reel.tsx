/**
 * The three portrait compositions.
 *
 * The reels share ONE Remotion project with three clearly separated
 * compositions rather than three projects: they share the palette, the Stage 10
 * branding system, the fonts, the Stage 6 motion concepts, the SFX synthesis
 * and the asset pipeline, so a shared project guarantees they look like one
 * series and avoids maintaining three copies of the same system. Each reel
 * keeps its own beat schedule, music bed, SFX timeline, render target and
 * thumbnail, so they remain fully independent deliverables.
 */
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import type { Beat } from "./shared/beat.ts";
import { frames, starts } from "./shared/beat.ts";
import { Scene } from "./shared/components/Scenes.tsx";
import { Shell } from "./shared/components/Shell.tsx";
import { planBrand } from "./shared/brandplan.ts";
import { COLOR } from "./shared/theme.ts";

export const Reel: React.FC<{ beats: Beat[]; slug: string; silent?: boolean }> = ({
  beats, slug, silent,
}) => {
  const at = starts(beats, 30);
  const PLAN = planBrand(beats);
  return (
    <AbsoluteFill style={{ background: COLOR.void }}>
      {!silent && (
        <>
          <Audio src={staticFile(`audio/${slug}-music-bed.wav`)} volume={1} />
          <Audio src={staticFile(`audio/${slug}-sfx-timeline.wav`)} volume={1} />
        </>
      )}
      <Shell>
        {beats.map((b, i) => {
          const d = frames(b.sec, 30);
          return (
            <Sequence key={b.id} from={at[i]} durationInFrames={d} name={`${i + 1}. ${b.id}`}>
              <Scene beat={b} dur={d} portrait brand={PLAN[i]} />
            </Sequence>
          );
        })}
      </Shell>
    </AbsoluteFill>
  );
};
