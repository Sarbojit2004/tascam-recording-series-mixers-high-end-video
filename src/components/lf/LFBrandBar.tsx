import React from 'react';
import {useCurrentFrame} from 'remotion';
import {ramp} from '../../lib/anim';
import {BRAND, STRIP_ROTATION} from '../../lib/copy';
import {C, EDGE_PAD, F, lfSceneStart} from '../../lib/lf-theme';

/**
 * Persistent corner lockup — a small, single-line partner mark + rotating
 * contact strip pinned to the top-right corner. This is what keeps the
 * Shivansh Electronics presence continuous across the whole 298s runtime
 * (Section 9's "no gap longer than ~25-30s" requirement) between the
 * dedicated per-chapter branding beats, which carry the fuller treatment.
 *
 * Hidden only during PR2, the outro's own dedicated contact wall — showing
 * both at once would be redundant, not additive.
 */
const SLOT = 150; // 5s per contact item
const FADE = 14;
const HIDE_FROM = lfSceneStart('PR2');
const HIDE_UNTIL = lfSceneStart('PR3');

export const LFBrandBar: React.FC<{accent: string}> = ({accent}) => {
  const f = useCurrentFrame();

  const gIn = ramp(f, [20, 44], [0, 1]);
  const inWindow = f >= HIDE_FROM && f < HIDE_UNTIL;
  const gOut = inWindow ? 0 : 1;
  const vis = Math.min(gIn, gOut);
  if (vis <= 0.001) return null;

  const idx = Math.floor(f / SLOT) % STRIP_ROTATION.length;
  const local = f % SLOT;
  const itemOpacity = Math.min(
    ramp(local, [0, FADE], [0, 1]),
    ramp(local, [SLOT - FADE, SLOT], [1, 0]),
  );

  return (
    <div
      style={{
        position: 'absolute',
        right: EDGE_PAD,
        top: 24,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        opacity: vis,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          padding: '7px 14px',
          borderRadius: 10,
          background: 'rgba(255,255,255,0.88)',
          backdropFilter: 'blur(8px)',
          border: `1px solid ${C.cardEdge}`,
          display: 'flex',
          alignItems: 'center',
          gap: 9,
        }}
      >
        <div style={{width: 6, height: 6, borderRadius: 99, background: accent}} />
        <span
          style={{
            fontFamily: F.ui,
            fontWeight: 800,
            fontSize: 15,
            letterSpacing: 2.4,
            color: C.inkSoft,
          }}
        >
          {BRAND.partner}
        </span>
        <span style={{color: C.hair, fontSize: 13}}>|</span>
        <span
          style={{
            fontFamily: F.mono,
            fontWeight: 600,
            fontSize: 15,
            color: accent,
            opacity: itemOpacity,
            minWidth: 200,
            textAlign: 'right',
          }}
        >
          {STRIP_ROTATION[idx]}
        </span>
      </div>
    </div>
  );
};
