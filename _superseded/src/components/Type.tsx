import React from 'react';
import {useCurrentFrame} from 'remotion';
import {pop, stag} from '../lib/anim';
import {C, F} from '../lib/theme';

// Structural type system ported from the MOTU reel. What is NOT ported: the
// dark-background scrim. On this light ground every face renders as dark ink
// with no drop shadow — a shadow under dark-on-light type only muddies it.
// Where copy has to sit over photography, wrap it in <Plate/> instead.

export const Display: React.FC<{
  children: React.ReactNode;
  size?: number;
  weight?: 600 | 700 | 800;
  color?: string;
  lh?: number;
  tracking?: number;
  align?: 'left' | 'center' | 'right';
  caps?: boolean;
  style?: React.CSSProperties;
}> = ({
  children,
  size = 96,
  weight = 800,
  color = C.ink,
  lh = 0.9,
  tracking = -0.5,
  align = 'left',
  caps = true,
  style,
}) => (
  <div
    style={{
      fontFamily: F.display,
      fontWeight: weight,
      fontSize: size,
      lineHeight: lh,
      letterSpacing: tracking,
      color,
      textAlign: align,
      textTransform: caps ? 'uppercase' : 'none',
      ...style,
    }}
  >
    {children}
  </div>
);

/** Small all-caps eyebrow. Never below 18px — it has to survive a feed crop. */
export const Kicker: React.FC<{
  children: React.ReactNode;
  color?: string;
  size?: number;
  weight?: 600 | 700 | 800;
  style?: React.CSSProperties;
}> = ({children, color = C.inkDim, size = 22, weight = 700, style}) => (
  <div
    style={{
      fontFamily: F.ui,
      fontWeight: weight,
      fontSize: size,
      letterSpacing: 3.8,
      textTransform: 'uppercase',
      color,
      ...style,
    }}
  >
    {children}
  </div>
);

export const Body: React.FC<{
  children: React.ReactNode;
  size?: number;
  color?: string;
  weight?: 400 | 500 | 600 | 700;
  lh?: number;
  align?: 'left' | 'center' | 'right';
  style?: React.CSSProperties;
}> = ({children, size = 30, color = C.inkSoft, weight = 500, lh = 1.32, align = 'left', style}) => (
  <div
    style={{
      fontFamily: F.ui,
      fontWeight: weight,
      fontSize: size,
      lineHeight: lh,
      color,
      textAlign: align,
      letterSpacing: 0.1,
      ...style,
    }}
  >
    {children}
  </div>
);

/** The technical layer — hard verified numbers only. */
export const Mono: React.FC<{
  children: React.ReactNode;
  size?: number;
  color?: string;
  weight?: 400 | 500 | 700;
  tracking?: number;
  style?: React.CSSProperties;
}> = ({children, size = 24, color = C.inkSoft, weight = 500, tracking = 1.2, style}) => (
  <div
    style={{
      fontFamily: F.mono,
      fontWeight: weight,
      fontSize: size,
      letterSpacing: tracking,
      color,
      ...style,
    }}
  >
    {children}
  </div>
);

/**
 * A soft light plate. The only technique used to keep copy legible where it
 * overlaps imagery — replaces the dark scrim the source system used.
 */
export const Plate: React.FC<{
  children: React.ReactNode;
  pad?: [number, number];
  radius?: number;
  alpha?: number;
  style?: React.CSSProperties;
}> = ({children, pad = [16, 26], radius = 14, alpha = 0.9, style}) => (
  <div
    style={{
      display: 'inline-block',
      padding: `${pad[0]}px ${pad[1]}px`,
      borderRadius: radius,
      background: `rgba(255,255,255,${alpha})`,
      backdropFilter: 'blur(10px) saturate(1.05)',
      boxShadow: '0 10px 34px -14px rgba(20,26,34,0.32)',
      ...style,
    }}
  >
    {children}
  </div>
);

/** Word-by-word kinetic headline. */
export const KineticLine: React.FC<{
  text: string;
  size?: number;
  color?: string;
  weight?: 600 | 700 | 800;
  delay?: number;
  per?: number;
  gap?: number;
  align?: 'left' | 'center' | 'right';
  highlight?: {word: number; color: string}[];
  style?: React.CSSProperties;
}> = ({
  text,
  size = 92,
  color = C.ink,
  weight = 800,
  delay = 0,
  per = 3.2,
  gap = 18,
  align = 'left',
  highlight = [],
  style,
}) => {
  const f = useCurrentFrame();
  const words = text.split(' ');
  const hl = new Map(highlight.map((h) => [h.word, h.color]));
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: `${gap * 0.3}px ${gap}px`,
        justifyContent:
          align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start',
        ...style,
      }}
    >
      {words.map((w, i) => {
        const s = pop(f, stag(i, per, delay), 15);
        return (
          <span
            key={i}
            style={{
              fontFamily: F.display,
              fontWeight: weight,
              fontSize: size,
              lineHeight: 0.94,
              letterSpacing: -0.5,
              textTransform: 'uppercase',
              color: hl.get(i) ?? color,
              display: 'inline-block',
              transform: `translateY(${(1 - s) * 30}px)`,
              opacity: Math.min(1, s * 1.5),
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};

/** Odometer-style number that counts up then holds. */
export const CountUp: React.FC<{
  to: number;
  dur: number;
  from?: number;
  decimals?: number;
  size?: number;
  color?: string;
  suffix?: string;
  delay?: number;
  style?: React.CSSProperties;
}> = ({to, dur, from = 0, decimals = 0, size = 120, color = C.ink, suffix = '', delay = 0, style}) => {
  const f = useCurrentFrame();
  const p = Math.max(0, Math.min(1, (f - delay) / Math.max(1, dur)));
  const eased = 1 - Math.pow(1 - p, 3);
  const v = from + (to - from) * eased;
  return (
    <div
      style={{
        fontFamily: F.display,
        fontWeight: 800,
        fontSize: size,
        lineHeight: 0.86,
        color,
        letterSpacing: -1,
        fontVariantNumeric: 'tabular-nums',
        ...style,
      }}
    >
      {v.toFixed(decimals)}
      {suffix ? <span style={{fontSize: size * 0.4, marginLeft: 8}}>{suffix}</span> : null}
    </div>
  );
};

/** Spec chips — the "22 Analog Inputs | 16 Ultra-HDDA" layer from the brief. */
export const SpecRow: React.FC<{
  items: readonly string[];
  accent: string;
  delay?: number;
  size?: number;
  style?: React.CSSProperties;
}> = ({items, accent, delay = 0, size = 21, style}) => {
  const f = useCurrentFrame();
  return (
    <div style={{display: 'flex', flexWrap: 'wrap', gap: 10, ...style}}>
      {items.map((s, i) => {
        const p = pop(f, stag(i, 3, delay), 18);
        return (
          <div
            key={s}
            style={{
              fontFamily: F.mono,
              fontWeight: 500,
              fontSize: size,
              letterSpacing: 1.1,
              color: C.inkSoft,
              padding: '9px 16px',
              borderRadius: 8,
              background: C.card,
              border: `1px solid ${C.cardEdge}`,
              borderLeft: `3px solid ${accent}`,
              opacity: Math.min(1, p * 1.4),
              transform: `translateY(${(1 - p) * 14}px)`,
              whiteSpace: 'nowrap',
            }}
          >
            {s}
          </div>
        );
      })}
    </div>
  );
};
