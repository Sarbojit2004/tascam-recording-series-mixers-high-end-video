import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Photo} from '../Photo';
import {Kicker, Display} from '../Type';
import {pop, ramp, stag, EASE_IN_OUT} from '../../lib/anim';
import {C} from '../../lib/lf-theme';

/**
 * Clears a large leftover asset pool efficiently and still on-brand: chunks
 * the pool into small groups (default 4 per group), holds each group for an
 * even share of the scene, and cross-fades to the next. This is the
 * long-form equivalent of the reel's MontageGrid, used per Section 5's
 * explicit allowance — "reserve 3+ assets in a single frame for brief
 * montage/overview passages" — for the parts of each product's pool that
 * don't get individual hero/feature treatment.
 */
export const GallerySweep: React.FC<{
  names: string[];
  dur: number;
  accent: string;
  box: {l: number; t: number; w: number; h: number};
  groupSize?: number;
  headline?: string;
  kicker?: string;
  fit?: 'cover' | 'contain';
}> = ({names, dur, accent, box, groupSize = 4, headline, kicker, fit = 'cover'}) => {
  const f = useCurrentFrame();
  const groups: string[][] = [];
  for (let i = 0; i < names.length; i += groupSize) groups.push(names.slice(i, i + groupSize));
  const per = Math.max(1, Math.floor(dur / groups.length));
  const gi = Math.min(groups.length - 1, Math.floor(f / per));
  const local = f - gi * per;
  const group = groups[gi];
  const prevGroup = gi > 0 ? groups[gi - 1] : null;

  const headOffset = headline ? 118 : 0;
  const gap = 16;
  const cellW = (box.w - gap * (groupSize - 1)) / groupSize;
  const cellH = box.h - headOffset;

  // Cross-dissolve, not a hard cut: the outgoing group is still rendered and
  // fading out for the first CROSS frames while the incoming group fades in
  // over it, so a group change never passes through a fully blank frame.
  const CROSS = 14;
  const incomingOpacity = ramp(local, [0, CROSS], [0, 1], EASE_IN_OUT);
  const outgoingOpacity = ramp(local, [0, CROSS], [1, 0], EASE_IN_OUT);

  const renderGroup = (g: string[], opacity: number, animate: boolean, keyPrefix: string) => (
    <>
      {g.map((n, i) => {
        const s = animate ? pop(local, stag(i, 3, 0), 18) : 1;
        return (
          <div
            key={`${keyPrefix}-${n}`}
            style={{
              position: 'absolute',
              left: i * (cellW + gap),
              top: 0,
              width: cellW,
              height: cellH,
              opacity: Math.min(1, s * 1.5) * opacity,
              transform: `translateY(${(1 - s) * 16}px)`,
            }}
          >
            <Photo
              name={n}
              box={{l: 0, t: 0, w: cellW, h: cellH}}
              dur={per}
              fit={fit}
              pad={fit === 'cover' ? 0 : 8}
              radius={14}
              accent={i === 0 ? accent : null}
              elev={0.7}
              kb={{z: fit === 'cover' ? [1.05, 1.12] : [1, 1]}}
            />
          </div>
        );
      })}
    </>
  );

  return (
    <div style={{position: 'absolute', left: box.l, top: box.t, width: box.w, height: box.h}}>
      {headline ? (
        <div style={{marginBottom: 22}}>
          {kicker ? (
            <Kicker color={accent} size={20} style={{marginBottom: 8}}>
              {kicker}
            </Kicker>
          ) : null}
          <Display size={44} color={C.ink}>
            {headline}
          </Display>
        </div>
      ) : null}
      <div style={{position: 'relative', width: box.w, height: cellH}}>
        {prevGroup && outgoingOpacity > 0.001
          ? renderGroup(prevGroup, outgoingOpacity, false, `prev-${gi}`)
          : null}
        {renderGroup(group, gi === 0 ? 1 : incomingOpacity, gi === 0, `cur-${gi}`)}
      </div>
      {/* progress dots — reads as a deliberate sweep, not a slideshow glitch */}
      <div style={{position: 'absolute', left: 0, top: cellH + headOffset + 14, display: 'flex', gap: 6}}>
        {groups.map((_, i) => (
          <div
            key={i}
            style={{
              width: 22,
              height: 3,
              borderRadius: 2,
              background: i <= gi ? accent : C.hair,
              opacity: i <= gi ? 1 : 0.6,
            }}
          />
        ))}
      </div>
    </div>
  );
};
