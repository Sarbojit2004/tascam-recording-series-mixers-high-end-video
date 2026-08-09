import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {LFFrame, LFGuides} from './components/lf/LFFrame';
import {LFBrandBar} from './components/lf/LFBrandBar';
import {EASE_IN_OUT, ramp} from './lib/anim';
import {loadFonts} from './lib/fonts';
import {LF_CUES, lfSfxFile} from './lib/lf-sfx';
import {C, LF_SCENES, LF_TOTAL_FRAMES, lfAccentColor} from './lib/lf-theme';
import {LF_REGISTRY} from './scenes/lf/registry';

loadFonts();

export const LF_PLAN = (() => {
  const out: {id: string; from: number; dur: number; accent: string}[] = [];
  let f = 0;
  for (const s of LF_SCENES) {
    out.push({id: s.id, from: f, dur: s.dur, accent: lfAccentColor(s.accent)});
    f += s.dur;
  }
  return out;
})();

export const LF_REEL_FRAMES = LF_PLAN.reduce((a, s) => a + s.dur, 0);

const OVERLAP = 10;

const useAccent = (): string => {
  const f = useCurrentFrame();
  let cur: string = C.neutral;
  for (const s of LF_PLAN) if (f >= s.from) cur = s.accent;
  return cur;
};

/**
 * Master tail envelope — learned directly from the reel's render bug:
 * Remotion's muxer writes audio longer than the composition and overlaps a
 * chunk of the mix in the final second, so every audio layer here fades to
 * zero across the last 20 frames of the composition. The delivered file is
 * still trimmed to exactly 8940 frames by scripts/finalize.py, but the cut
 * lands in genuine silence rather than clipping whatever the muxer left
 * dangling past the last frame.
 */
export const lfTail = (f: number): number =>
  ramp(f, [LF_TOTAL_FRAMES - 20, LF_TOTAL_FRAMES - 2], [1, 0], EASE_IN_OUT);

export const LFReel: React.FC<{guides?: boolean}> = ({guides = false}) => {
  const f = useCurrentFrame();
  const accent = useAccent();

  const fade = Math.min(
    ramp(f, [0, 24], [0, 1]),
    ramp(f, [LF_REEL_FRAMES - 24, LF_REEL_FRAMES], [1, 0]),
  );

  return (
    <AbsoluteFill style={{backgroundColor: C.paper}}>
      <LFFrame>
        {LF_PLAN.map((s, i) => {
          const Comp = LF_REGISTRY[s.id as keyof typeof LF_REGISTRY];
          const last = i === LF_PLAN.length - 1;
          return (
            <Sequence
              key={s.id}
              from={s.from}
              durationInFrames={s.dur + (last ? 0 : OVERLAP)}
              name={s.id}
              layout="none"
            >
              <AbsoluteFill>
                <Comp dur={s.dur} accent={s.accent} />
              </AbsoluteFill>
            </Sequence>
          );
        })}
        <LFBrandBar accent={accent} />
      </LFFrame>

      <AbsoluteFill style={{backgroundColor: C.paper, opacity: 1 - fade, pointerEvents: 'none'}} />

      {/* ---- audio ------------------------------------------------------ */}
      <Audio src={staticFile('audio/ambient-bed-longform.mp3')} volume={(f2) => 0.28 * lfTail(f2)} />
      <Audio src={staticFile('audio/music-bed-longform.mp3')} volume={(f2) => 0.40 * lfTail(f2)} />
      <Audio src={staticFile('vo/voiceover-longform-tascam.mp3')} volume={(f2) => lfTail(f2)} />

      {LF_CUES.filter((c) => c.at < LF_REEL_FRAMES).map((c, i) => (
        <Sequence
          key={`${c.n}-${c.at}-${i}`}
          from={c.at}
          durationInFrames={LF_REEL_FRAMES - c.at}
          layout="none"
        >
          <Audio src={lfSfxFile(c.n)} volume={(local) => c.v * lfTail(local + c.at)} />
        </Sequence>
      ))}

      {guides ? <LFGuides /> : null}
    </AbsoluteFill>
  );
};
