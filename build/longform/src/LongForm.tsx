/**
 * THE LONG-FORM, AS THREE PARTS.
 *
 * WHY THREE COMPOSITIONS AND NOT ONE FILE CUT UP. The series is published as
 * three roughly five-minute parts, and a part is a thing a viewer finishes —
 * so each one has to end properly, with the end screen that says who made it
 * and how to reach them. Slicing one continuous render with ffmpeg gave three
 * files that simply stopped mid-argument. Building them as real compositions
 * means each carries its own closing block, and the three still sum to exactly
 * 898 seconds because the schedule declares the parts and the audit checks it.
 *
 * The assembler is otherwise unchanged: walk the part's beats, give each its
 * own Sequence, mount the shared Scene renderer, and lay the contact strips
 * over it from the audited plan.
 */
import React from "react";
import { Audio, Sequence, staticFile } from "remotion";
import { LANDSCAPE, SPACE } from "./shared/theme.ts";
import { frames, starts, type Beat } from "./shared/beat.ts";
import { Beat as BeatShell, ChapterRail, Page } from "./shared/shell.tsx";
import { Scene } from "./shared/scenes.tsx";
import { SFX_FOR } from "./shared/sfx.ts";
import { bedGain, sfxGain, type Deliverable } from "./shared/mix.ts";
import type { StripAppearance } from "./shared/contactplan.ts";
import { BEATS } from "./schedule.ts";

/** Chapter phases across the WHOLE series, so the rail is continuous. */
const PHASES = [...new Set(BEATS.map((b) => b.phase ?? ""))];

export const LongFormPart: React.FC<{
  beats: Beat[];
  plan: StripAppearance[];
  /** Seconds of the series already elapsed, so the bed keeps running. */
  bedFrom: number;
  /** Which part's mix calibration applies. */
  mix: Deliverable;
}> = ({ beats, plan, bedFrom, mix }) => {
  const st = starts(beats, LANDSCAPE.fps);
  return (
    <Page>
      {/*
        ONE BED ACROSS THE SERIES. Each part plays its own window of the single
        898-second bed rather than restarting it, so a viewer watching all three
        back to back hears one continuous piece of music instead of the same
        opening bars three times.
      */}
      <Audio
        src={staticFile("audio/longform-music-bed.wav")}
        volume={bedGain(mix)}
        startFrom={Math.round(bedFrom * LANDSCAPE.fps)}
      />

      {beats.map((b, i) => {
        const dur = frames(b.sec, LANDSCAPE.fps);
        const sfx = SFX_FOR[b.kind];
        return (
          <Sequence key={b.id} from={st[i]} durationInFrames={dur} name={b.id}>
            <BeatShell dur={dur}>
              <Scene beat={b} dur={dur} plan={plan} />
              {b.phase && b.kind !== "outro" && b.kind !== "cold" ? (
                <ChapterRail
                  phase={b.phase}
                  index={PHASES.indexOf(b.phase)}
                  total={PHASES.length}
                  x={SPACE.marginX}
                  y={LANDSCAPE.height - 32}
                />
              ) : null}
            </BeatShell>
            {sfx ? (
              <Sequence from={sfx.at} durationInFrames={Math.min(dur - sfx.at, 120)}>
                <Audio src={staticFile(`audio/sfx/${sfx.file}`)}
                       volume={sfxGain(sfx.gain, mix)} />
              </Sequence>
            ) : null}
          </Sequence>
        );
      })}
    </Page>
  );
};
