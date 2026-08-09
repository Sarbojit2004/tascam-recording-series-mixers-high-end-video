import React from 'react';
import {useCurrentFrame} from 'remotion';
import {SignalFlow} from '../../components/Bits';
import {BrandCard} from '../../components/lf/BrandCard';
import {LFBackdrop} from '../../components/lf/LFParts';
import {Photo} from '../../components/Photo';
import {Kicker, KineticLine, Body, Display} from '../../components/Type';
import {pop, ramp, stag} from '../../lib/anim';
import {PRODUCT} from '../../lib/copy';
import {LF_PLACEMENTS} from '../../lib/lf-assets';
import {C, EDGE_PAD, F, LF_CANVAS} from '../../lib/lf-theme';

export type LFSceneProps = {dur: number; accent: string};

/**
 * CO1 — the philosophy hook. Same core idea as the reel's own opener, given
 * the room a 20-second landscape beat affords: a kinetic headline, then the
 * thesis line, over an ambient ​backdrop (not a hero shot — nothing has been
 * introduced by name yet).
 */
export const CO1: React.FC<LFSceneProps> = ({accent}) => {
  const f = useCurrentFrame();
  const [bd] = LF_PLACEMENTS.CO1;

  return (
    <>
      <LFBackdrop name={bd} opacity={0.14} />

      <BrandCard brand="tascam" box={{l: LF_CANVAS.w / 2 - 130, t: 70, w: 260, h: 94}} accent={accent} delay={6} />

      <div
        style={{
          position: 'absolute',
          left: 0,
          top: LF_CANVAS.h / 2 - 170,
          width: LF_CANVAS.w,
          textAlign: 'center',
        }}
      >
        <Kicker color={C.inkDim} size={24} style={{justifyContent: 'center', display: 'flex'}}>
          RECORDING MIXER &amp; STUDIO INTERFACE RANGE
        </Kicker>
        <div style={{marginTop: 24, display: 'flex', justifyContent: 'center'}}>
          <KineticLine
            text="MIXING WAS NEVER MEANT TO LIVE BEHIND A SCREEN"
            size={84}
            align="center"
            delay={10}
            per={2.8}
            color={C.ink}
            highlight={[{word: 7, color: accent}]}
          />
        </div>
        <Body
          size={30}
          color={C.inkSoft}
          align="center"
          style={{marginTop: 34, opacity: ramp(f, [90, 118], [0, 1])}}
        >
          Genuine analog control. Standalone SD multitrack recording. Seamless DAW
          integration. One family, five ways in.
        </Body>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 0,
          bottom: 64,
          width: LF_CANVAS.w,
          textAlign: 'center',
          opacity: ramp(f, [150, 180], [0, 1]),
        }}
      >
        <div
          style={{
            fontFamily: F.mono,
            fontSize: 22,
            letterSpacing: 3,
            color: C.inkDim,
          }}
        >
          MODEL 12 · MODEL 16 · MODEL 24 · MODEL 2400 · STUDIO BRIDGE
        </div>
      </div>
    </>
  );
};

/**
 * FO1 — Family Overview. The five products as a single ecosystem, plus the
 * signal-flow diagram that explains the shared thread (XLR in -> Ultra-HDDA
 * -> split to SD + USB) before any per-product depth begins.
 */
const LADDER: {k: keyof typeof PRODUCT; color: string}[] = [
  {k: 'm12', color: C.m12},
  {k: 'm16', color: C.m16},
  {k: 'm24', color: C.m24},
  {k: 'm2400', color: C.m2400},
  {k: 'sb', color: C.sb},
];

export const FO1: React.FC<LFSceneProps> = ({accent}) => {
  const f = useCurrentFrame();
  const imgs = LF_PLACEMENTS.FO1;
  const cardW = 300;
  const cardH = 210;
  const gap = 24;
  const totalW = cardW * 5 + gap * 4;
  const startX = (LF_CANVAS.w - totalW) / 2;

  return (
    <>
      <BrandCard brand="tascam" box={{l: EDGE_PAD, t: 26, w: 180, h: 66}} accent={accent} delay={4} />

      <div style={{position: 'absolute', left: 0, top: 66, width: LF_CANVAS.w, textAlign: 'center'}}>
        <Kicker color={accent} size={22} style={{justifyContent: 'center', display: 'flex'}}>
          THE SHARED ENGINEERING DNA
        </Kicker>
        <Display size={78} color={C.ink} align="center" style={{marginTop: 14}}>
          ONE FAMILY. FIVE WAYS IN.
        </Display>
      </div>

      {LADDER.map((l, i) => {
        const s = pop(f, stag(i, 8, 40), 17);
        const x = startX + i * (cardW + gap);
        return (
          <div
            key={l.k}
            style={{
              position: 'absolute',
              left: x,
              top: 260,
              width: cardW,
              height: cardH + 60,
              opacity: Math.min(1, s * 1.5),
              transform: `translateY(${(1 - s) * 24}px)`,
            }}
          >
            <Photo
              name={imgs[i]}
              box={{l: 0, t: 0, w: cardW, h: cardH}}
              dur={540}
              fit="contain"
              pad={10}
              radius={16}
              accent={l.color}
              elev={0.8}
            />
            <div
              style={{
                marginTop: 12,
                fontFamily: F.display,
                fontWeight: 800,
                fontSize: 27,
                letterSpacing: -0.2,
                color: C.ink,
                textAlign: 'center',
              }}
            >
              {PRODUCT[l.k].name}
            </div>
          </div>
        );
      })}

      <div
        style={{
          position: 'absolute',
          left: EDGE_PAD + 260,
          top: 590,
          width: LF_CANVAS.w - (EDGE_PAD + 260) * 2,
          opacity: ramp(f, [130, 170], [0, 1]),
        }}
      >
        <SignalFlow
          w={LF_CANVAS.w - (EDGE_PAD + 260) * 2}
          h={180}
          accent={accent}
          p={ramp(f, [140, 220], [0, 1])}
          labels={['XLR MIC INPUT', 'ULTRA-HDDA PREAMP', 'SD RECORDER + USB INTERFACE']}
        />
      </div>

      <div
        style={{
          position: 'absolute',
          left: 0,
          bottom: 60,
          width: LF_CANVAS.w,
          textAlign: 'center',
          opacity: ramp(f, [200, 240], [0, 1]),
        }}
      >
        <div style={{fontFamily: F.mono, fontSize: 21, letterSpacing: 1.6, color: C.inkDim}}>
          FOUR MIXERS SCALE THE SURFACE · STUDIO BRIDGE REMOVES IT
        </div>
      </div>
    </>
  );
};
