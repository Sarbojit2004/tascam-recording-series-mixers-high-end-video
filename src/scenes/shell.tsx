import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {AmbientBands, Safe} from '../components/Frame';
import {Backdrop} from '../components/Photo';
import {ramp, sceneIn} from '../lib/anim';
import {PLACEMENTS} from '../lib/assets';
import type {SceneId} from '../lib/theme';

export type SceneProps = {dur: number; accent: string};

/**
 * Every scene renders through here, which guarantees three things without the
 * scene having to remember them: a washed atmospheric backdrop, the ambient
 * top/bottom bands populated from this scene's own ambient asset list, and a
 * content group clipped to the primary safe band.
 */
export const Shell: React.FC<{
  id: SceneId;
  dur: number;
  backdrop?: string;
  backdropOpacity?: number;
  children: React.ReactNode;
}> = ({id, dur, backdrop, backdropOpacity = 0.24, children}) => {
  const f = useCurrentFrame();
  const p = PLACEMENTS[id];
  const stills = [...p.primary, ...p.ambient].filter((n) => !n.endsWith('-clip'));
  const bd = backdrop ?? stills[0];
  const inGain = sceneIn(f, 8);
  const drift = ramp(f, [0, dur], [-26, 26]);

  return (
    <AbsoluteFill style={{opacity: inGain}}>
      {bd ? <Backdrop name={bd} opacity={backdropOpacity} drift={drift} /> : null}
      <AmbientBands
        ambient={p.ambient.filter((n) => !n.endsWith('-clip'))}
        fallback={stills}
        seed={id.charCodeAt(1) * 31 + id.charCodeAt(2)}
      />
      <Safe>{children}</Safe>
    </AbsoluteFill>
  );
};

/** Grid box helper — all boxes are in Safe-local coordinates. */
export const grid = (
  cols: number,
  rows: number,
  w: number,
  h: number,
  gap = 20,
  top = 0,
  left = 0,
) => {
  const cw = (w - gap * (cols - 1)) / cols;
  const ch = (h - gap * (rows - 1)) / rows;
  return (i: number) => ({
    l: left + (i % cols) * (cw + gap),
    t: top + Math.floor(i / cols) * (ch + gap),
    w: cw,
    h: ch,
  });
};
