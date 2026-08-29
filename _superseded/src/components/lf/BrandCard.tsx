import React from 'react';
import {useCurrentFrame} from 'remotion';
import {pop} from '../../lib/anim';
import {C, F} from '../../lib/lf-theme';

/**
 * Text-wordmark brand card — NOT a reproduction of either company's actual
 * logo artwork. This repository contains no logo image files for either
 * TASCAM or Shivansh Electronics (verified against the repo's tracked files),
 * and this project does not fabricate a real company's trademarked mark. This
 * card carries the same on-screen weight and cadence Section 9 asks a logo
 * card to carry, built from styled type instead of a graphic mark. Swapping
 * in real logo artwork later is a one-component change.
 *
 * The two brands get visually distinct treatments so they read as two
 * different entities, not one design reused twice: TASCAM is a plain, heavy
 * block wordmark (matching how the hardware's own printed nameplate reads);
 * Shivansh Electronics carries a small mark-dot + the authorized-partner
 * designation as its subline, matching the reel's own brand-strip treatment.
 */
export const BrandCard: React.FC<{
  brand: 'tascam' | 'shivansh';
  box: {l: number; t: number; w: number; h: number};
  accent: string;
  delay?: number;
  /** Skips the entrance spring — required for still-frame compositions
   *  (thumbnails render a single frame at t=0, before any spring settles,
   *  so an animated card would render invisible). */
  animate?: boolean;
}> = ({brand, box, accent, delay = 0, animate = true}) => {
  const f = useCurrentFrame();
  const g = animate ? pop(f, delay, 16) : 1;

  return (
    <div
      style={{
        position: 'absolute',
        left: box.l,
        top: box.t,
        width: box.w,
        height: box.h,
        borderRadius: 18,
        background: C.card,
        border: `1px solid ${C.cardEdge}`,
        boxShadow: '0 20px 48px -22px rgba(20,26,34,0.34), 0 2px 8px -2px rgba(20,26,34,0.12)',
        opacity: Math.min(1, g * 1.4),
        transform: `translateY(${(1 - g) * 18}px)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 8%',
      }}
    >
      {brand === 'tascam' ? (
        <div
          style={{
            fontFamily: F.display,
            fontWeight: 800,
            fontSize: box.h * 0.46,
            letterSpacing: 2,
            color: C.ink,
            lineHeight: 1,
          }}
        >
          TASCAM
        </div>
      ) : (
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: box.h * 0.06}}>
          <div style={{display: 'flex', alignItems: 'center', gap: box.h * 0.08}}>
            <div
              style={{
                width: box.h * 0.11,
                height: box.h * 0.11,
                borderRadius: 99,
                background: accent,
              }}
            />
            <div
              style={{
                fontFamily: F.ui,
                fontWeight: 800,
                fontSize: box.h * 0.24,
                letterSpacing: 2,
                color: C.ink,
                lineHeight: 1,
                whiteSpace: 'nowrap',
              }}
            >
              SHIVANSH ELECTRONICS
            </div>
          </div>
          <div
            style={{
              fontFamily: F.ui,
              fontWeight: 700,
              fontSize: box.h * 0.13,
              letterSpacing: 3,
              color: accent,
              whiteSpace: 'nowrap',
            }}
          >
            AUTHORIZED TASCAM PARTNER
          </div>
        </div>
      )}
    </div>
  );
};
