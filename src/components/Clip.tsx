import React from 'react';
import {OffthreadVideo, useCurrentFrame} from 'remotion';
import {ramp} from '../lib/anim';
import {CLIPS, ClipId, clipSrc} from '../lib/assets';
import {C, F} from '../lib/theme';

/**
 * A source clip playing as motion inside the portrait frame.
 *
 * The four TASCAM clips are natively 1600x500 — a wide letterbox crop that is
 * neither this reel's 9:16 canvas nor a landscape 16:9. Rather than crop into
 * the footage to force a portrait fit, each clip is placed as a sharp
 * full-card-width band with a heavily blurred, scaled copy of the same footage
 * filling the card above and below it. The subject is never cut into; the
 * background extension does the aspect-ratio work.
 *
 * Playback is always 1x. Each clip is TRIMMED to a short chosen segment and
 * then cut away from — the pace comes from the edit, never from speeding the
 * footage up.
 */
export const ClipCard: React.FC<{
  id: ClipId;
  box: {l: number; t: number; w: number; h: number};
  accent: string;
  label?: string;
  radius?: number;
  /** Overrides the default CLIPS[id] trim — used by the long-form video,
   *  which affords a longer 3-6s segment than the reel's sub-3s inserts. */
  trim?: {trimBefore: number; dur: number};
}> = ({id, box, accent, label, radius = 22, trim}) => {
  const f = useCurrentFrame();
  const {trimBefore, dur} = trim ?? CLIPS[id];
  const src = clipSrc(id);

  // Sharp band keeps the source's exact 16:5 geometry.
  const bandH = Math.round((box.w * 500) / 1600);
  const bandT = Math.round((box.h - bandH) / 2);

  // A slow push-in across the segment, so the card itself has camera movement
  // on top of whatever the footage is doing.
  const push = ramp(f, [0, dur], [1.0, 1.045]);
  const enter = ramp(f, [0, 10], [0.965, 1]);

  return (
    <div
      style={{
        position: 'absolute',
        left: box.l,
        top: box.t,
        width: box.w,
        height: box.h,
        borderRadius: radius,
        overflow: 'hidden',
        background: C.card,
        border: `1px solid ${C.cardEdge}`,
        boxShadow:
          '0 26px 64px -22px rgba(20,26,34,0.36), 0 2px 8px -2px rgba(20,26,34,0.12)',
        transform: `scale(${enter})`,
      }}
    >
      {/* background extension — same footage, blurred and blown up to fill */}
      <div style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
        <OffthreadVideo
          src={src}
          trimBefore={trimBefore}
          muted
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: 'scale(1.5)',
            filter: 'blur(34px) saturate(0.6) brightness(1.22)',
            display: 'block',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(180deg, ${C.paper}D0 0%, ${C.paper}5A 34%, ${C.paper}5A 66%, ${C.paper}D0 100%)`,
          }}
        />
      </div>

      {/* the sharp band */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: bandT,
          width: box.w,
          height: bandH,
          overflow: 'hidden',
          borderTop: `1px solid ${accent}44`,
          borderBottom: `1px solid ${accent}44`,
          boxShadow: '0 18px 44px -20px rgba(20,26,34,0.5)',
        }}
      >
        <OffthreadVideo
          src={src}
          trimBefore={trimBefore}
          muted
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: `scale(${push})`,
            display: 'block',
          }}
        />
      </div>

      {/* live-motion marker — reads as a camera framing cue, not a UI chrome */}
      <div
        style={{
          position: 'absolute',
          left: 22,
          top: bandT - 40,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <div
          style={{
            width: 9,
            height: 9,
            borderRadius: 99,
            background: accent,
            opacity: 0.55 + 0.45 * Math.sin((f / 30) * 6),
          }}
        />
        {label ? (
          <span
            style={{
              fontFamily: F.mono,
              fontSize: 19,
              letterSpacing: 2.4,
              fontWeight: 500,
              color: C.inkDim,
              textTransform: 'uppercase',
            }}
          >
            {label}
          </span>
        ) : null}
      </div>

      {/* corner brackets — the "engineered camera path" language from the brief */}
      {[
        {l: 16, t: bandT + 12, r: 0, b: 0, bl: `2px solid ${accent}`, bt: `2px solid ${accent}`},
      ].map((_, i) => (
        <React.Fragment key={i}>
          <div
            style={{
              position: 'absolute',
              left: 16,
              top: bandT + 12,
              width: 34,
              height: 34,
              borderLeft: `2px solid ${accent}`,
              borderTop: `2px solid ${accent}`,
              opacity: 0.75,
            }}
          />
          <div
            style={{
              position: 'absolute',
              right: 16,
              top: bandT + bandH - 46,
              width: 34,
              height: 34,
              borderRight: `2px solid ${accent}`,
              borderBottom: `2px solid ${accent}`,
              opacity: 0.75,
            }}
          />
        </React.Fragment>
      ))}
    </div>
  );
};
