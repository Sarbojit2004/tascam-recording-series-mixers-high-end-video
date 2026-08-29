import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Rule} from '../components/Bits';
import {ClipCard} from '../components/Clip';
import {Photo} from '../components/Photo';
import {Display, Kicker, Mono, SpecRow} from '../components/Type';
import {pop, ramp, stag} from '../lib/anim';
import type {ClipId} from '../lib/assets';
import {PRODUCT, ProductKey} from '../lib/copy';
import {C, F, SAFE} from '../lib/theme';
import {grid} from './shell';

/** Product title block — the three-tier hierarchy from the brief's Section 8. */
export const ProductTitle: React.FC<{
  k: ProductKey;
  index: string;
  accent: string;
  top?: number;
  size?: number;
  showSpecs?: boolean;
  specDelay?: number;
}> = ({k, index, accent, top = 0, size = 138, showSpecs = true, specDelay = 22}) => {
  const f = useCurrentFrame();
  const p = PRODUCT[k];
  const s = pop(f, 2, 18);
  return (
    <div style={{position: 'absolute', left: 0, top, width: SAFE.w}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
        <Kicker color={accent}>{index}</Kicker>
        <div style={{flex: 1, marginTop: 2}}>
          <Rule w={SAFE.w - 190} accent={accent} p={ramp(f, [4, 26], [0, 1])} thickness={2} />
        </div>
      </div>
      <Display
        size={size}
        color={C.ink}
        style={{
          marginTop: 12,
          opacity: Math.min(1, s * 1.6),
          transform: `translateY(${(1 - s) * 22}px)`,
        }}
      >
        {p.name}
      </Display>
      <div
        style={{
          fontFamily: F.display,
          fontWeight: 600,
          fontSize: 46,
          letterSpacing: -0.2,
          color: accent,
          marginTop: 4,
          opacity: ramp(f, [10, 28], [0, 1]),
        }}
      >
        {p.hook}
      </div>
      {showSpecs ? (
        <SpecRow items={p.specs} accent={accent} delay={specDelay} style={{marginTop: 22}} />
      ) : null}
    </div>
  );
};

/** A montage grid — every cell is one asset, staggered in, held for the beat. */
export const MontageGrid: React.FC<{
  names: string[];
  cols: number;
  rows: number;
  top: number;
  h: number;
  dur: number;
  accent: string;
  gap?: number;
  fit?: 'cover' | 'contain';
  pad?: number;
  captions?: readonly string[];
  delay?: number;
  per?: number;
  extra?: React.ReactNode;
}> = ({
  names,
  cols,
  rows,
  top,
  h,
  dur,
  accent,
  gap = 18,
  fit = 'cover',
  pad = 0,
  captions,
  delay = 6,
  per = 5,
  extra,
}) => {
  const f = useCurrentFrame();
  const g = grid(cols, rows, SAFE.w, h, gap, top, 0);
  return (
    <>
      {names.map((n, i) => {
        const b = g(i);
        const s = pop(f, stag(i, per, delay), 17);
        const dir = i % 2 === 0 ? 1 : -1;
        return (
          <div
            key={n}
            style={{
              position: 'absolute',
              left: b.l,
              top: b.t,
              width: b.w,
              height: b.h,
              opacity: Math.min(1, s * 1.5),
              transform: `translate3d(${(1 - s) * 26 * dir}px, ${(1 - s) * 16}px, 0)`,
            }}
          >
            <Photo
              name={n}
              box={{l: 0, t: 0, w: b.w, h: b.h}}
              dur={dur}
              fit={fit}
              pad={pad}
              radius={14}
              accent={i === 0 ? accent : null}
              elev={0.75}
              kb={{
                z: fit === 'cover' ? [1.05, 1.13] : [1, 1],
                x: [0, dir * 1.4],
              }}
            />
            {captions?.[i] ? (
              <div
                style={{
                  position: 'absolute',
                  left: 12,
                  bottom: 10,
                  padding: '6px 11px',
                  borderRadius: 7,
                  background: 'rgba(255,255,255,0.92)',
                  fontFamily: F.mono,
                  fontSize: 16,
                  letterSpacing: 1.3,
                  color: C.inkSoft,
                  opacity: ramp(f, [delay + i * per + 8, delay + i * per + 20], [0, 1]),
                }}
              >
                {captions[i]}
              </div>
            ) : null}
          </div>
        );
      })}
      {extra}
    </>
  );
};

/**
 * The clip beat. A trimmed segment of source footage playing at native speed,
 * framed with its own blurred background extension, plus the copy line that
 * says what the motion is actually showing.
 */
export const ClipBeat: React.FC<{
  id: ClipId;
  accent: string;
  headline: string;
  sub: string;
  motionLabel: string;
  stats: readonly {v: number; l: string}[];
  top?: number;
  h?: number;
}> = ({id, accent, headline, sub, motionLabel, stats, top = 214, h = 500}) => {
  const f = useCurrentFrame();
  const s = pop(f, 0, 18);
  return (
    <>
      <div style={{position: 'absolute', left: 0, top: 0, width: SAFE.w}}>
        <Kicker color={accent}>IN MOTION</Kicker>
        <Display
          size={92}
          color={C.ink}
          style={{
            marginTop: 12,
            opacity: Math.min(1, s * 1.6),
            transform: `translateY(${(1 - s) * 18}px)`,
          }}
        >
          {headline}
        </Display>
      </div>

      <ClipCard id={id} box={{l: 0, t: top, w: SAFE.w, h}} accent={accent} label={motionLabel} />

      <div style={{position: 'absolute', left: 0, top: top + h + 30, width: SAFE.w}}>
        <Rule w={SAFE.w} accent={accent} p={ramp(f, [6, 30], [0, 1])} thickness={2} />
        <Mono size={23} color={C.inkSoft} style={{marginTop: 15}}>
          {sub}
        </Mono>
      </div>

      {/* The ascending ladder, restated numerically on each clip beat — the
          four of them read as 12 -> 16 -> 24 -> 24 as the act progresses. */}
      <div style={{position: 'absolute', left: 0, top: top + h + 116, width: SAFE.w, display: 'flex', gap: 16}}>
        {stats.map((st, i) => {
          const g = pop(f, stag(i, 6, 8), 17);
          return (
            <div
              key={st.l}
              style={{
                flex: 1,
                padding: '20px 20px 18px',
                borderRadius: 14,
                background: C.card,
                border: `1px solid ${C.cardEdge}`,
                borderTop: `4px solid ${accent}`,
                opacity: Math.min(1, g * 1.5),
                transform: `translateY(${(1 - g) * 16}px)`,
                boxShadow: '0 14px 30px -18px rgba(20,26,34,0.3)',
              }}
            >
              <div
                style={{
                  fontFamily: F.display,
                  fontWeight: 800,
                  fontSize: 82,
                  lineHeight: 0.9,
                  letterSpacing: -1,
                  color: accent,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {st.v}
              </div>
              <div
                style={{
                  fontFamily: F.mono,
                  fontSize: 17,
                  letterSpacing: 1.6,
                  color: C.inkDim,
                  marginTop: 8,
                  lineHeight: 1.25,
                }}
              >
                {st.l}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};
