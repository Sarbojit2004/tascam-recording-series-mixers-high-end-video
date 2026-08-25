/**
 * The 898-second landscape composition.
 *
 * Audio is mounted as exactly two pre-rendered layers — the stem-built music
 * bed and the Layer 2 transition-SFX timeline — rather than as several hundred
 * individual <Audio> tags. Both files are generated from this same schedule,
 * so the two standalone audio deliverables and the audio inside the MP4 are
 * the same samples, and the SFX cannot drift against picture.
 */
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { BEATS } from "./schedule.ts";
import { frames, starts } from "./shared/beat.ts";
import { Scene } from "./shared/components/Scenes.tsx";
import { Shell } from "./shared/components/Shell.tsx";
import { COLOR } from "./shared/theme.ts";

const AT = starts(BEATS, 30);

export const LongForm: React.FC<{ silent?: boolean }> = ({ silent }) => (
  <AbsoluteFill style={{ background: COLOR.void }}>
    {!silent && (
      <>
        <Audio src={staticFile("audio/longform-music-bed.wav")} volume={1} />
        <Audio src={staticFile("audio/longform-sfx-timeline.wav")} volume={1} />
      </>
    )}

    <Shell>
      {BEATS.map((b, i) => {
        const d = frames(b.sec, 30);
        return (
          <Sequence key={b.id} from={AT[i]} durationInFrames={d} name={`${i + 1}. ${b.id}`}>
            <Scene beat={b} dur={d} portrait={false} />
          </Sequence>
        );
      })}
    </Shell>
  </AbsoluteFill>
);
