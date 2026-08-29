import React from 'react';
import {useCurrentFrame} from 'remotion';
import {ramp} from '../lib/anim';
import {BRAND, STRIP_ROTATION} from '../lib/copy';
import {C, CANVAS, F, STRIP, ZONE, sceneStart} from '../lib/theme';

/**
 * Persistent partner strip with a rotating contact detail.
 *
 * It sits at y=1462..1554 — inside the primary safe band, above the 1580px
 * ambient floor — because contact details are critical content and must never
 * risk being covered by the caption or action rail.
 *
 * The rotation is what weaves the full contact list through the 88 seconds:
 * twelve entries at 3.4s each cycles the whole list roughly twice.
 */
const SLOT = 102; // 3.4s per contact item
const FADE = 10;

const HIDE_FROM = sceneStart('S24'); // the closing scene is itself a contact block

export const Strip: React.FC<{accent: string}> = ({accent}) => {
  const f = useCurrentFrame();

  const gIn = ramp(f, [18, 38], [0, 1]);
  const gOut = ramp(f, [HIDE_FROM - 14, HIDE_FROM], [1, 0]);
  const vis = Math.min(gIn, gOut);
  if (vis <= 0.001) return null;

  const idx = Math.floor(f / SLOT) % STRIP_ROTATION.length;
  const local = f % SLOT;
  const itemOpacity = Math.min(
    ramp(local, [0, FADE], [0, 1]),
    ramp(local, [SLOT - FADE, SLOT], [1, 0]),
  );
  const slide = (1 - ramp(local, [0, FADE], [0, 1])) * 11;

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: STRIP.y,
        width: CANVAS.w,
        height: STRIP.h,
        opacity: vis,
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: ZONE.side,
          top: 0,
          width: CANVAS.w - ZONE.side * 2,
          height: 1,
          background: `linear-gradient(90deg, ${accent}00, ${accent}AA, ${accent}33, ${accent}00)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: ZONE.side,
          top: 20,
          width: CANVAS.w - ZONE.side * 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{display: 'flex', flexDirection: 'column', gap: 5}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 11}}>
            <div
              style={{
                width: 7,
                height: 7,
                borderRadius: 99,
                background: accent,
              }}
            />
            <span
              style={{
                fontFamily: F.ui,
                fontWeight: 800,
                fontSize: 21,
                letterSpacing: 3.2,
                color: C.ink,
              }}
            >
              {BRAND.partner}
            </span>
          </div>
          <span
            style={{
              fontFamily: F.ui,
              fontWeight: 600,
              fontSize: 16,
              letterSpacing: 2.6,
              color: C.inkDim,
              marginLeft: 18,
            }}
          >
            {BRAND.designation}
          </span>
        </div>
        <span
          style={{
            fontFamily: F.mono,
            fontWeight: 600,
            fontSize: 20,
            letterSpacing: 0.4,
            color: accent,
            opacity: itemOpacity,
            transform: `translateY(${slide}px)`,
            display: 'inline-block',
            textAlign: 'right',
            maxWidth: 560,
          }}
        >
          {STRIP_ROTATION[idx]}
        </span>
      </div>
    </div>
  );
};
