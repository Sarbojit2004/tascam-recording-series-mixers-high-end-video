import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {Ground, Guides} from './components/Frame';
import {Strip} from './components/Strip';
import {EASE_IN_OUT, ramp} from './lib/anim';
import {loadFonts} from './lib/fonts';
import {CUES, sfxFile} from './lib/sfx';
import {accentColor, C, SCENES, TOTAL_FRAMES} from './lib/theme';
import {REGISTRY} from './scenes/registry';

loadFonts();

/** Absolute start frame of every scene. Durations sum to exactly 2640. */
export const PLAN = (() => {
  const out: {id: string; from: number; dur: number; accent: string}[] = [];
  let f = 0;
  for (const s of SCENES) {
    out.push({id: s.id, from: f, dur: s.dur, accent: accentColor(s.accent)});
    f += s.dur;
  }
  return out;
})();

export const REEL_FRAMES = PLAN.reduce((a, s) => a + s.dur, 0);

/** Accent of whichever scene is on screen, for the persistent partner strip. */
const useAccent = (): string => {
  const f = useCurrentFrame();
  let cur: string = C.neutral;
  for (const s of PLAN) if (f >= s.from) cur = s.accent;
  return cur;
};

/**
 * Each scene's Sequence runs OVERLAP frames past its slot. The next scene is
 * later in DOM order so it paints on top and fades in over its predecessor —
 * a real cross-dissolve at each of the 23 cuts rather than a dip to the paper
 * ground.
 */
const OVERLAP = 8;

/**
 * Master tail envelope applied to every audio layer.
 *
 * Remotion's muxer writes the audio stream longer than the composition and
 * appends a duplicated chunk at the boundary, so the delivered file is trimmed
 * to exactly 2,640 frames by `scripts/finalize.py`. This envelope makes that
 * trim inaudible: by frame 2640 every layer has already reached zero, so the
 * cut lands in silence instead of clipping a decaying reverb tail. It runs
 * across the same 18 frames as the closing visual fade.
 */
export const tail = (f: number): number =>
  ramp(f, [TOTAL_FRAMES - 18, TOTAL_FRAMES - 2], [1, 0], EASE_IN_OUT);

export const Reel: React.FC<{guides?: boolean}> = ({guides = false}) => {
  const f = useCurrentFrame();
  const accent = useAccent();

  // Short programme fades only — the closing CTA is on screen for 90 frames
  // and must stay fully legible for most of them.
  const fade = Math.min(
    ramp(f, [0, 20], [0, 1]),
    ramp(f, [REEL_FRAMES - 22, REEL_FRAMES], [1, 0]),
  );

  return (
    <AbsoluteFill style={{backgroundColor: C.paper}}>
      <Ground />

      {PLAN.map((s, i) => {
        const Comp = REGISTRY[s.id as keyof typeof REGISTRY];
        const last = i === PLAN.length - 1;
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

      <Strip accent={accent} />

      {/* A programme-level fade so the light ground never snaps in or out. */}
      <AbsoluteFill
        style={{backgroundColor: C.paper, opacity: 1 - fade, pointerEvents: 'none'}}
      />

      {/* ---- audio ---------------------------------------------------- */}
      {/* continuous ambient presence, every frame of the runtime */}
      <Audio src={staticFile('audio/ambient-bed.mp3')} volume={(f2) => 0.30 * tail(f2)} />
      {/* the six-zone music arc */}
      <Audio src={staticFile('audio/music-bed.mp3')} volume={(f2) => 0.42 * tail(f2)} />
      {/* silent placeholder — the recorded read drops in here */}
      <Audio src={staticFile('vo/voiceover-reel-tascam.mp3')} volume={(f2) => tail(f2)} />

      {/* Each cue is explicitly bounded by the composition, and carries the
          same master tail envelope. `volume` receives the Sequence-relative
          frame, so the cue's absolute position is added back before the
          envelope is sampled. */}
      {CUES.filter((c) => c.at < REEL_FRAMES).map((c, i) => (
        <Sequence
          key={`${c.n}-${c.at}-${i}`}
          from={c.at}
          durationInFrames={REEL_FRAMES - c.at}
          layout="none"
        >
          <Audio src={sfxFile(c.n)} volume={(local) => c.v * tail(local + c.at)} />
        </Sequence>
      ))}

      {guides ? <Guides /> : null}
    </AbsoluteFill>
  );
};

export const REEL_TOTAL = TOTAL_FRAMES;
