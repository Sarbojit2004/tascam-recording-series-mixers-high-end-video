/**
 * A PORTRAIT REEL — the same assembler as the long-form, on the 1080x1920
 * canvas and against its own schedule and music bed.
 *
 * NO CHAPTER RAIL. The long-form earns one because a viewer fifteen minutes in
 * needs to know where they are; 178 seconds does not, and the caption-safe band
 * has no room to give it.
 */
import React from "react";
import { Audio, Sequence, staticFile } from "remotion";
import { PORTRAIT } from "./shared/theme.ts";
import { frames, starts, type Beat } from "./shared/beat.ts";
import { Beat as BeatShell, Page } from "./shared/shell.tsx";
import { Scene } from "./shared/scenes.tsx";
import { SFX_FOR } from "./shared/sfx.ts";
import { bedGain, sfxGain, type Deliverable } from "./shared/mix.ts";
import type { StripAppearance } from "./shared/contactplan.ts";

export const Reel: React.FC<{
  beats: Beat[]; plan: StripAppearance[]; bed: string; mix: Deliverable;
}> = ({ beats, plan, bed, mix }) => {
  const st = starts(beats, PORTRAIT.fps);
  return (
    <Page>
      <Audio src={staticFile(`audio/${bed}`)} volume={bedGain(mix)} />
      {beats.map((b, i) => {
        const dur = frames(b.sec, PORTRAIT.fps);
        const sfx = SFX_FOR[b.kind];
        return (
          <Sequence key={b.id} from={st[i]} durationInFrames={dur} name={b.id}>
            <BeatShell dur={dur}>
              <Scene beat={b} dur={dur} plan={plan} />
            </BeatShell>
            {sfx ? (
              <Sequence from={sfx.at} durationInFrames={Math.min(dur - sfx.at, 120)}>
                <Audio src={staticFile(`audio/sfx/${sfx.file}`)} volume={sfxGain(sfx.gain, mix)} />
              </Sequence>
            ) : null}
          </Sequence>
        );
      })}
    </Page>
  );
};
