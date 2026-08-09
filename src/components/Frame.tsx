import React from 'react';
import {AbsoluteFill, Img, useCurrentFrame} from 'remotion';
import {rnd} from '../lib/anim';
import {imgSrc} from '../lib/assets';
import {C, CANVAS, F, SAFE, ZONE} from '../lib/theme';

/**
 * The ambient bands.
 *
 * Top 0..250 and bottom 1580..1920 must never sit as a flat void, but nothing
 * a viewer has to read may live there either — that is exactly where Instagram
 * paints the profile row, caption, action rail and progress bar. So they carry
 * the reel's ambient asset tier: soft, blurred, desaturated tiles drifting
 * sideways, fading into the paper ground as they approach the safe zone.
 *
 * Each scene supplies its own explicit ambient list, so every tile here is a
 * countable placement in the coverage ledger rather than anonymous texture.
 */
const Rail: React.FC<{
  names: string[];
  top: number;
  height: number;
  dir: 1 | -1;
  speed?: number;
  tile?: number;
  seed?: number;
  fadeTowards: 'down' | 'up';
}> = ({names, top, height, dir, speed = 16, tile = 330, seed = 0, fadeTowards}) => {
  const f = useCurrentFrame();
  if (names.length === 0) return null;

  const gap = 22;
  const step = tile + gap;
  // Enough repeats to cover 1080px plus a full tile of overscan at both ends.
  const reps = Math.ceil((CANVAS.w + step * 2) / (step * names.length)) + 1;
  const seq: string[] = [];
  for (let r = 0; r < reps; r++) seq.push(...names);

  const span = step * names.length;
  const offset = -(((f * speed) / 30) * dir) % span;

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top,
        width: CANVAS.w,
        height,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: dir === 1 ? offset - step : offset - step,
          top: 0,
          height,
          display: 'flex',
          gap,
        }}
      >
        {seq.map((n, i) => {
          const j = i % names.length;
          const wob = Math.sin((f / 30) * (0.4 + rnd(seed + j) * 0.3) + j) * 6;
          return (
            <div
              key={`${n}-${i}`}
              style={{
                width: tile,
                height: height - 24,
                marginTop: 12 + wob,
                borderRadius: 16,
                overflow: 'hidden',
                flex: '0 0 auto',
                opacity: 0.5,
              }}
            >
              <Img
                src={imgSrc(n)}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: 'blur(9px) saturate(0.5) brightness(1.2) contrast(0.9)',
                  transform: 'scale(1.16)',
                  display: 'block',
                }}
              />
            </div>
          );
        })}
      </div>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            fadeTowards === 'down'
              ? `linear-gradient(180deg, ${C.paper}B8 0%, ${C.paper}70 42%, ${C.paper}F0 88%, ${C.paper} 100%)`
              : `linear-gradient(180deg, ${C.paper} 0%, ${C.paper}F0 12%, ${C.paper}70 58%, ${C.paper}B8 100%)`,
        }}
      />
    </div>
  );
};

/**
 * Ambient bands for one scene. If a scene has no ambient assets of its own it
 * falls back to its primary list — the bands still breathe, and the fallback
 * placement is not counted twice in the ledger because coverage only requires
 * each asset to appear at least once.
 */
export const AmbientBands: React.FC<{
  ambient: string[];
  fallback: string[];
  seed?: number;
}> = ({ambient, fallback, seed = 0}) => {
  const list = ambient.length ? ambient : fallback;
  if (list.length === 0) return null;
  const top = list;
  const bottom = list.length > 1 ? [...list].reverse() : list;
  return (
    <>
      <Rail
        names={top}
        top={0}
        height={ZONE.topAmbient}
        dir={1}
        speed={13}
        tile={300}
        seed={seed}
        fadeTowards="down"
      />
      <Rail
        names={bottom}
        top={ZONE.bottomAmbient}
        height={CANVAS.h - ZONE.bottomAmbient}
        dir={-1}
        speed={17}
        tile={360}
        seed={seed + 97}
        fadeTowards="up"
      />
    </>
  );
};

/** The paper ground: a warm light neutral with a soft high-key falloff. */
export const Ground: React.FC = () => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(128% 74% at 50% 34%, #FBFAF7 0%, ${C.paper} 46%, ${C.paperDeep} 100%)`,
    }}
  />
);

/** Positions a scene's real content inside the primary safe band. */
export const Safe: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({
  children,
  style,
}) => (
  <div
    style={{
      position: 'absolute',
      left: SAFE.x,
      top: SAFE.y,
      width: SAFE.w,
      height: SAFE.h,
      ...style,
    }}
  >
    {children}
  </div>
);

/**
 * Development overlay drawing the safe-zone geometry. Rendered only by the
 * `ReelGuides` composition, which exists so still checks can prove no critical
 * content crosses into the ambient bands or the side margins.
 */
export const Guides: React.FC = () => (
  <AbsoluteFill style={{pointerEvents: 'none'}}>
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: CANVAS.w,
        height: ZONE.topAmbient,
        background: 'rgba(255,0,80,0.16)',
        borderBottom: '2px solid rgba(255,0,80,0.85)',
      }}
    />
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: ZONE.bottomAmbient,
        width: CANVAS.w,
        height: CANVAS.h - ZONE.bottomAmbient,
        background: 'rgba(255,0,80,0.16)',
        borderTop: '2px solid rgba(255,0,80,0.85)',
      }}
    />
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: ZONE.side,
        height: CANVAS.h,
        background: 'rgba(0,120,255,0.14)',
      }}
    />
    <div
      style={{
        position: 'absolute',
        right: 0,
        top: 0,
        width: ZONE.side,
        height: CANVAS.h,
        background: 'rgba(0,120,255,0.14)',
      }}
    />
    <div
      style={{
        position: 'absolute',
        left: ZONE.side,
        top: ZONE.topAmbient,
        width: CANVAS.w - ZONE.side * 2,
        height: ZONE.bottomAmbient - ZONE.topAmbient,
        border: '2px dashed rgba(0,180,90,0.9)',
      }}
    />
    <div
      style={{
        position: 'absolute',
        left: 12,
        top: ZONE.topAmbient + 8,
        fontFamily: F.mono,
        fontSize: 20,
        color: '#0A7A3C',
      }}
    >
      SAFE 250 – 1580
    </div>
  </AbsoluteFill>
);
