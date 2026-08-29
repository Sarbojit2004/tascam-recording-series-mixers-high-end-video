import React from 'react';
import {useCurrentFrame} from 'remotion';
import {CrossPhoto, type KB} from '../Photo';
import {Body, Kicker, Display} from '../Type';
import {ramp, EASE_IN_OUT} from '../../lib/anim';
import {C, F} from '../../lib/lf-theme';

/**
 * The long-form video's core content workhorse. A single Sequence holds a
 * fixed image slot + text block, and cycles through an array of beats — each
 * with its OWN explicit duration (a beat ends when its point is made, not on
 * a fixed timer, per Section 4). This is what lets a chapter deliver several
 * distinct, named features without a bespoke JSX block per feature.
 */
export type Beat = {
  img: string;
  fit?: 'cover' | 'contain';
  kicker?: string;
  headline: string;
  body?: string;
  specs?: readonly string[];
  dur: number; // frames
  kb?: KB;
};

const useBeatIndex = (beats: {dur: number}[], f: number) => {
  let acc = 0;
  for (let i = 0; i < beats.length; i++) {
    const d = beats[i].dur;
    if (f < acc + d || i === beats.length - 1) return {i, local: f - acc, dur: d};
    acc += d;
  }
  return {i: 0, local: f, dur: beats[0]?.dur ?? 1};
};

export const BeatCycle: React.FC<{
  beats: Beat[];
  accent: string;
  imgBox: {l: number; t: number; w: number; h: number};
  textBox: {l: number; t: number; w: number};
  align?: 'left' | 'right';
}> = ({beats, accent, imgBox, textBox, align = 'left'}) => {
  const f = useCurrentFrame();
  const {i, local, dur} = useBeatIndex(beats, f);
  const beat = beats[i];
  const g = ramp(local, [0, 12], [0, 1], EASE_IN_OUT);

  return (
    <>
      <CrossPhoto
        names={beats.map((b) => b.img)}
        i={i}
        local={local}
        box={imgBox}
        dur={dur}
        fade={10}
        fit={beat.fit ?? 'contain'}
        pad={beat.fit === 'cover' ? 0 : 14}
        radius={20}
        accent={accent}
        elev={0.9}
        kbAt={(idx) => beats[idx].kb ?? {}}
      />
      <div
        style={{
          position: 'absolute',
          left: textBox.l,
          top: textBox.t,
          width: textBox.w,
          opacity: g,
          transform: `translateY(${(1 - g) * 22}px)`,
          textAlign: align,
        }}
      >
        {beat.kicker ? (
          <Kicker color={accent} size={22} style={{marginBottom: 12}}>
            {beat.kicker}
          </Kicker>
        ) : null}
        <Display size={62} color={C.ink} lh={0.98}>
          {beat.headline}
        </Display>
        {beat.body ? (
          <Body size={26} color={C.inkSoft} style={{marginTop: 16, maxWidth: textBox.w}}>
            {beat.body}
          </Body>
        ) : null}
        {beat.specs ? (
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 10,
              marginTop: 20,
              justifyContent: align === 'right' ? 'flex-end' : 'flex-start',
            }}
          >
            {beat.specs.map((s, si) => {
              // Driven by `local`, not the global scene frame — every beat's
              // chips get their own fresh entrance, not just the first beat's.
              const p = ramp(local, [12 + si * 3, 12 + si * 3 + 16], [0, 1], EASE_IN_OUT);
              return (
                <div
                  key={s}
                  style={{
                    fontFamily: F.mono,
                    fontWeight: 500,
                    fontSize: 19,
                    letterSpacing: 1,
                    color: C.inkSoft,
                    padding: '9px 16px',
                    borderRadius: 8,
                    background: C.card,
                    border: `1px solid ${C.cardEdge}`,
                    borderLeft: `3px solid ${accent}`,
                    opacity: p,
                    transform: `translateY(${(1 - p) * 12}px)`,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {s}
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
    </>
  );
};
