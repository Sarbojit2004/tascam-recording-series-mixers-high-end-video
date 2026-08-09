import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Rule} from '../components/Bits';
import {Photo, Strobe} from '../components/Photo';
import {Display, Kicker, KineticLine, Mono} from '../components/Type';
import {pop, ramp, stag} from '../lib/anim';
import {PLACEMENTS} from '../lib/assets';
import {C, F, SAFE} from '../lib/theme';
import {Shell, SceneProps} from './shell';

/**
 * S01 — the philosophy hook.
 *
 * Ten hard cuts in five seconds through the most tactile frame each product
 * has: fingers on faders, a knob field, a lit console under someone's hands.
 * Nothing is named yet. The whole point is the physical gesture.
 */
export const S01: React.FC<SceneProps> = ({dur, accent}) => {
  const f = useCurrentFrame();
  const names = PLACEMENTS.S01.primary;
  const per = Math.floor(dur / names.length); // 15f — 0.5s a cut
  const idx = Math.min(names.length - 1, Math.floor(f / per));

  return (
    <Shell id="S01" dur={dur} backdropOpacity={0.18}>
      <Strobe names={names} per={per} box={{l: 0, t: 0, w: SAFE.w, h: 700}} accent={accent} />

      {/* cut counter — reads as a camera slate, not UI chrome */}
      <div style={{position: 'absolute', left: 0, top: 716, display: 'flex', gap: 6}}>
        {names.map((n, i) => (
          <div
            key={n}
            style={{
              width: (SAFE.w - 6 * (names.length - 1)) / names.length,
              height: 4,
              borderRadius: 2,
              background: i <= idx ? accent : C.hair,
              opacity: i <= idx ? 1 : 0.6,
            }}
          />
        ))}
      </div>

      <div style={{position: 'absolute', left: 0, top: 752}}>
        <Kicker color={C.inkDim}>TASCAM · RECORDING SERIES</Kicker>
      </div>

      <div style={{position: 'absolute', left: 0, top: 796, width: SAFE.w}}>
        <KineticLine
          text="MIXING WAS NEVER MEANT TO LIVE BEHIND A SCREEN"
          size={92}
          delay={8}
          per={2.6}
          color={C.ink}
          highlight={[{word: 7, color: accent}]}
        />
      </div>

      <div style={{position: 'absolute', left: 0, top: 1096, opacity: ramp(f, [58, 76], [0, 1])}}>
        <Rule w={SAFE.w} accent={accent} p={ramp(f, [58, 92], [0, 1])} />
        <Mono size={25} color={C.inkSoft} style={{marginTop: 18}}>
          ANALOG SUMMING · SD MULTITRACK · USB INTERFACE
        </Mono>
      </div>
    </Shell>
  );
};

/**
 * S02 — the range as a ladder.
 *
 * Five hero renders, each card wider than the last, so the ascending physical
 * scale is legible before a single specification is spoken. The fifth card is
 * flagged RACK, because Studio Bridge is not the next size up — it is the
 * pattern break the whole reel ends on.
 */
const LADDER = [
  {name: 'MODEL 12', w: 430, h: 148, c: C.m12, tag: 'DESKTOP'},
  {name: 'MODEL 16', w: 478, h: 162, c: C.m16, tag: 'LIVE ENSEMBLE'},
  {name: 'MODEL 24', w: 526, h: 176, c: C.m24, tag: 'LARGE FORMAT'},
  {name: 'MODEL 2400', w: 574, h: 190, c: C.m2400, tag: 'FLAGSHIP'},
  {name: 'STUDIO BRIDGE', w: 622, h: 202, c: C.sb, tag: '6U RACK · NO SURFACE'},
] as const;

/** Labels live in their own column to the right of the ladder, never over it. */
const LABEL_X = 650;

export const S02: React.FC<SceneProps> = ({dur, accent}) => {
  const f = useCurrentFrame();
  const names = PLACEMENTS.S02.primary;

  let y = 242;
  const rows = LADDER.map((l, i) => {
    const box = {l: 0, t: y, w: l.w, h: l.h};
    y += l.h + 13;
    return {...l, box, name: l.name, asset: names[i], i};
  });

  return (
    <Shell id="S02" dur={dur} backdrop={names[3]} backdropOpacity={0.2}>
      <Kicker color={C.inkDim}>FOUR MIXERS · ONE CONTROLLER-LESS ENGINE</Kicker>
      <Display size={104} style={{marginTop: 18, lineHeight: 0.86}} color={C.ink}>
        ONE FAMILY.
        <br />
        <span style={{color: accent}}>FIVE WAYS IN.</span>
      </Display>

      {rows.map((r) => {
        const s = pop(f, stag(r.i, 12, 16), 17);
        return (
          <div
            key={r.name}
            style={{
              position: 'absolute',
              left: 0,
              top: r.box.t,
              width: SAFE.w,
              height: r.box.h,
              opacity: Math.min(1, s * 1.5),
              transform: `translateX(${(1 - s) * -46}px)`,
            }}
          >
            <Photo
              name={r.asset}
              box={{l: 0, t: 0, w: r.box.w, h: r.box.h}}
              dur={dur}
              fit="contain"
              pad={8}
              radius={14}
              accent={r.c}
              elev={0.8}
            />
            <div
              style={{
                position: 'absolute',
                left: LABEL_X,
                top: r.box.h / 2 - 34,
                width: SAFE.w - LABEL_X,
              }}
            >
              <div
                style={{
                  width: 46,
                  height: 3,
                  borderRadius: 2,
                  background: r.c,
                  marginBottom: 9,
                }}
              />
              <div
                style={{
                  fontFamily: F.display,
                  fontWeight: 800,
                  fontSize: 38,
                  letterSpacing: -0.4,
                  color: C.ink,
                  lineHeight: 0.96,
                }}
              >
                {r.name}
              </div>
              <div
                style={{
                  fontFamily: F.mono,
                  fontSize: 15,
                  letterSpacing: 1.8,
                  color: r.c,
                  marginTop: 6,
                }}
              >
                {r.tag}
              </div>
            </div>
          </div>
        );
      })}

      <div style={{position: 'absolute', left: 0, top: 1158, opacity: ramp(f, [96, 118], [0, 1])}}>
        <Mono size={21} color={C.inkDim}>
          ASCENDING SCALE — THEN A DELIBERATE ARCHITECTURAL BREAK
        </Mono>
      </div>
    </Shell>
  );
};
