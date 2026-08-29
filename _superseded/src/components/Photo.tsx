import React from 'react';
import {Img, useCurrentFrame} from 'remotion';
import {kenBurns, ramp} from '../lib/anim';
import {imgSrc} from '../lib/assets';
import {C} from '../lib/theme';

export type Box = {l: number; t: number; w: number; h: number};
export type KB = {z?: [number, number]; x?: [number, number]; y?: [number, number]};

/**
 * A photo card on the light ground: white plate, hairline edge, soft cast
 * shadow, image clipped inside with a slow Ken-Burns move under it.
 *
 * Every source asset is landscape or square, so `contain` is offered for the
 * renders on white (which must not be cropped) and `cover` for photography.
 */
export const Photo: React.FC<{
  name: string;
  box: Box;
  dur: number;
  fit?: 'cover' | 'contain';
  kb?: KB;
  radius?: number;
  opacity?: number;
  pad?: number;
  bg?: string;
  accent?: string | null;
  rotate?: number;
  scale?: number;
  elev?: number;
  style?: React.CSSProperties;
}> = ({
  name,
  box,
  dur,
  fit = 'cover',
  kb,
  radius = 20,
  opacity = 1,
  pad = 0,
  bg,
  accent = null,
  rotate = 0,
  scale = 1,
  elev = 1,
  style,
}) => {
  const f = useCurrentFrame();
  const z = kb?.z ?? (fit === 'cover' ? [1.06, 1.14] : [1, 1]);
  const t = kenBurns(f, dur, z, kb?.x ?? [0, 0], kb?.y ?? [0, 0]);

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
        opacity,
        backgroundColor: bg ?? C.card,
        border: `1px solid ${C.cardEdge}`,
        boxShadow: `0 ${18 * elev}px ${48 * elev}px -${18 * elev}px rgba(20,26,34,${0.30 * elev}), 0 2px 6px -2px rgba(20,26,34,0.10)`,
        transform: `rotate(${rotate}deg) scale(${scale})`,
        ...style,
      }}
    >
      <Img
        src={imgSrc(name)}
        style={{
          width: `calc(100% - ${pad * 2}px)`,
          height: `calc(100% - ${pad * 2}px)`,
          marginLeft: pad,
          marginTop: pad,
          objectFit: fit,
          transform: t,
          transformOrigin: 'center center',
          display: 'block',
        }}
      />
      {accent ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            width: '100%',
            height: 4,
            background: `linear-gradient(90deg, ${accent}, ${accent}00)`,
          }}
        />
      ) : null}
    </div>
  );
};

/**
 * Beat-driven photo slot: the outgoing image is held underneath while the
 * incoming one fades over it, so a montage beat change never flashes to the
 * paper ground.
 */
export const CrossPhoto: React.FC<{
  names: string[];
  i: number;
  local: number;
  box: Box;
  dur: number;
  fade?: number;
  fit?: 'cover' | 'contain';
  kbAt?: (i: number) => KB;
  radius?: number;
  accent?: string | null;
  pad?: number;
  bg?: string;
  elev?: number;
}> = ({names, i, local, box, dur, fade = 8, kbAt, ...rest}) => {
  const prev = i > 0 ? names[i - 1] : null;
  const g = prev ? Math.max(0, Math.min(1, local / fade)) : 1;
  return (
    <>
      {prev && g < 1 ? (
        <Photo key={`prev-${i}`} name={prev} box={box} dur={dur} kb={kbAt?.(i - 1)} {...rest} />
      ) : null}
      <Photo key={`cur-${i}`} name={names[i]} box={box} dur={dur} kb={kbAt?.(i)} opacity={g} {...rest} />
    </>
  );
};

/**
 * Full-canvas atmospheric wash behind everything. Deliberately washed out to
 * near-paper so it never competes with dark ink in the safe zone — this is the
 * "high-key soft-wrap diffusion" the brief asks for, done in the compositor.
 */
export const Backdrop: React.FC<{
  name: string;
  opacity?: number;
  blur?: number;
  scale?: number;
  drift?: number;
}> = ({name, opacity = 0.22, blur = 58, scale = 1.3, drift = 0}) => (
  <div style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
    <Img
      src={imgSrc(name)}
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        filter: `blur(${blur}px) saturate(0.55) brightness(1.28)`,
        transform: `scale(${scale}) translateX(${drift}px)`,
        opacity,
        display: 'block',
      }}
    />
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: `radial-gradient(120% 80% at 50% 42%, ${C.paper}D9 0%, ${C.paper}F2 58%, ${C.paper} 100%)`,
      }}
    />
  </div>
);

/**
 * Directional clip-path reveal. Spans its parent by default so the percentage
 * clip resolves against a real box — a zero-size wrapper would clip its
 * children away entirely.
 */
export const Reveal: React.FC<{
  p: number;
  dir?: 'l' | 'r' | 'u' | 'd';
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({p, dir = 'l', children, style}) => {
  const v = Math.max(0, Math.min(1, p));
  const off = (1 - v) * 100;
  const clip =
    dir === 'l'
      ? `inset(0 ${off}% 0 0)`
      : dir === 'r'
        ? `inset(0 0 0 ${off}%)`
        : dir === 'u'
          ? `inset(${off}% 0 0 0)`
          : `inset(0 0 ${off}% 0)`;
  return <div style={{position: 'absolute', inset: 0, clipPath: clip, ...style}}>{children}</div>;
};

/**
 * Hard-cut strobe slot — one asset per `per` frames.
 *
 * The whip-in happens to the image INSIDE the card, never to the card itself:
 * scaling the card would push its corners past the safe-zone boundary on every
 * cut, which is exactly the kind of overflow the geometry exists to prevent.
 * It also re-derives its own per-cut clock, since a Ken-Burns driven by the
 * scene frame would sit pinned at its end state from the second cut onward.
 */
export const Strobe: React.FC<{
  names: string[];
  per: number;
  box: Box;
  fit?: 'cover' | 'contain';
  radius?: number;
  accent?: string | null;
}> = ({names, per, box, fit = 'cover', radius = 20, accent = null}) => {
  const f = useCurrentFrame();
  const i = Math.min(names.length - 1, Math.floor(f / per));
  const local = f - i * per;
  const t = Math.min(1, local / per);
  const z = ramp(local, [0, 9], [1.16, 1.07]) + t * 0.03;
  const dir = i % 2 === 0 ? -1 : 1;
  const flash = ramp(local, [0, 5], [0.5, 0]);

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
        backgroundColor: C.card,
        border: `1px solid ${C.cardEdge}`,
        boxShadow:
          '0 22px 54px -20px rgba(20,26,34,0.34), 0 2px 6px -2px rgba(20,26,34,0.12)',
      }}
    >
      <Img
        src={imgSrc(names[i])}
        style={{
          width: '100%',
          height: '100%',
          objectFit: fit,
          transform: `translate3d(${dir * (1 - t) * 1.6}%, 0, 0) scale(${z})`,
          transformOrigin: 'center center',
          display: 'block',
        }}
      />
      {/* a light snap on each cut — the equivalent of a shutter on a bright set */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: '#FFFFFF',
          opacity: flash,
        }}
      />
      {accent ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            width: '100%',
            height: 4,
            background: `linear-gradient(90deg, ${accent}, ${accent}00)`,
          }}
        />
      ) : null}
    </div>
  );
};
