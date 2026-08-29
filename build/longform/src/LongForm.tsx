/**
 * THE 898-SECOND LANDSCAPE LONG-FORM.
 *
 * The composition is a thin assembler: it walks the schedule, gives each beat
 * its own <Sequence> at the frame the schedule puts it at, and mounts the
 * shared Scene renderer. All content decisions live in schedule.ts, all
 * branding decisions in brand-longform.ts, and all appearance in shared/.
 *
 * AUDIO. Layer 1 is the stem-built music bed, one continuous file for the full
 * runtime so nothing has to be crossfaded at beat boundaries. Layer 2 is the
 * synthesised sound set, placed per beat by kind — a concept beat gets its
 * mechanism's sound, a media beat gets a soft plate seat. Both sit far under
 * the voiceover headroom the audio audit checks for.
 */
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { LANDSCAPE } from "./shared/theme.ts";
import { frames, starts } from "./shared/beat.ts";
import { Beat as BeatShell, ChapterRail, Page } from "./shared/shell.tsx";
import { Scene } from "./shared/scenes.tsx";
import { SPACE } from "./shared/theme.ts";
import { BEATS } from "./schedule.ts";
import { PLAN } from "./brand-longform.ts";
import { SFX_FOR } from "./shared/sfx.ts";
import { bedGain, sfxGain } from "./shared/mix.ts";

const PHASES = [...new Set(BEATS.map((b) => b.phase ?? ""))];

export const LongForm: React.FC = () => {
  const st = starts(BEATS, LANDSCAPE.fps);
  return (
    <Page>
      <Audio src={staticFile("audio/longform-music-bed.wav")} volume={bedGain("longform")} />

      {BEATS.map((b, i) => {
        const dur = frames(b.sec, LANDSCAPE.fps);
        const sfx = SFX_FOR[b.kind];
        return (
          <Sequence key={b.id} from={st[i]} durationInFrames={dur} name={b.id}>
            <BeatShell dur={dur}>
              <Scene beat={b} dur={dur} plan={PLAN} />
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
                <Audio src={staticFile(`audio/sfx/${sfx.file}`)} volume={sfxGain(sfx.gain, "longform")} />
              </Sequence>
            ) : null}
          </Sequence>
        );
      })}
    </Page>
  );
};
