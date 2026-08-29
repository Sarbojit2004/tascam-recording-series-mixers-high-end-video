import React from 'react';
import {useCurrentFrame} from 'remotion';
import {DB25FanOut, RackWire, Rule} from '../components/Bits';
import {Photo} from '../components/Photo';
import {Body, Display, Kicker, Mono} from '../components/Type';
import {pop, ramp} from '../lib/anim';
import {PLACEMENTS} from '../lib/assets';
import {C, F, SAFE} from '../lib/theme';
import {MontageGrid, ProductTitle} from './parts';
import {Shell, SceneProps} from './shell';

// ACT 5 — STUDIO BRIDGE. The pivot. Everything before this act added surface;
// this one removes it. No preamps, no faders, no channel EQ — the Model 2400's
// 24-track engine on its own, in 6U, wired by DB-25 to a console the engineer
// already owns. Its beats are shaped by subtraction, not scale.

export const S19: React.FC<SceneProps> = ({dur, accent}) => {
  const f = useCurrentFrame();
  const [front, dark] = PLACEMENTS.S19.primary;
  const s = pop(f, 8, 18);

  const struck = ['FADERS', 'MIC PREAMPS', 'CHANNEL EQ'];

  return (
    <Shell id="S19" dur={dur} backdrop={dark} backdropOpacity={0.18}>
      <ProductTitle k="sb" index="05 / 05" accent={accent} size={112} showSpecs={false} />

      {/* the removal, stated as removal */}
      <div style={{position: 'absolute', left: 0, top: 296, display: 'flex', gap: 12}}>
        {struck.map((w, i) => {
          const g = ramp(f, [14 + i * 7, 30 + i * 7], [0, 1]);
          return (
            <div
              key={w}
              style={{
                position: 'relative',
                padding: '10px 18px',
                borderRadius: 8,
                border: `1px solid ${C.cardEdge}`,
                background: C.card,
                fontFamily: F.mono,
                fontSize: 21,
                letterSpacing: 1.4,
                color: g > 0.6 ? C.inkDim : C.inkSoft,
              }}
            >
              {w}
              <div
                style={{
                  position: 'absolute',
                  left: 12,
                  top: '52%',
                  width: `calc((100% - 24px) * ${g})`,
                  height: 2.5,
                  background: accent,
                }}
              />
            </div>
          );
        })}
      </div>

      <Photo
        name={front}
        box={{l: 0, t: 376, w: SAFE.w, h: 452}}
        dur={dur}
        fit="contain"
        pad={10}
        accent={accent}
        kb={{z: [1.0, 1.04]}}
      />

      <Photo
        name={dark}
        box={{l: 494, t: 852, w: 430, h: 262}}
        dur={dur}
        fit="cover"
        radius={14}
        elev={0.8}
      />

      <div style={{position: 'absolute', left: 0, top: 852, width: 462}}>
        <Display
          size={62}
          color={C.ink}
          style={{opacity: Math.min(1, s * 1.6), lineHeight: 0.92}}
        >
          NOT THE FIFTH
          <br />
          <span style={{color: accent}}>MIXER.</span>
        </Display>
        <Body size={27} color={C.inkSoft} style={{marginTop: 14}}>
          The flagship's 24-track engine, for a studio that already owns its
          console.
        </Body>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 1146,
          fontFamily: F.mono,
          fontSize: 21,
          letterSpacing: 1.6,
          color: C.inkDim,
          opacity: ramp(f, [58, 84], [0, 1]),
        }}
      >
        446.5 × 114.6 × 269.5 mm · 4.5 kg · 6U VIA AK-RMSTBG
      </div>
    </Shell>
  );
};

export const S20: React.FC<SceneProps> = ({dur, accent}) => {
  const f = useCurrentFrame();
  const names = PLACEMENTS.S20.primary;
  const s = pop(f, 2, 18);
  return (
    <Shell id="S20" dur={dur} backdrop={names[0]} backdropOpacity={0.18}>
      <Kicker color={accent}>DB-25 · AES59-2012</Kicker>
      <Display
        size={94}
        color={C.ink}
        style={{
          marginTop: 12,
          opacity: Math.min(1, s * 1.6),
          transform: `translateY(${(1 - s) * 18}px)`,
        }}
      >
        TWENTY-FOUR IN.
        <br />
        <span style={{color: accent}}>TWENTY-FOUR OUT.</span>
      </Display>

      <div style={{position: 'absolute', left: 0, top: 316, width: SAFE.w}}>
        <DB25FanOut w={SAFE.w} h={288} accent={accent} p={ramp(f, [6, 62], [0, 1])} />
      </div>

      <MontageGrid
        names={names}
        cols={2}
        rows={2}
        top={640}
        h={470}
        dur={dur}
        accent={accent}
        gap={16}
        per={5}
        captions={['REAR PANEL', 'D-SUB WIRED', 'MIDI IN / OUT', 'FRONT FASCIA']}
      />

      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 1142,
          fontFamily: F.mono,
          fontSize: 21,
          letterSpacing: 1.6,
          color: C.inkDim,
          opacity: ramp(f, [50, 76], [0, 1]),
        }}
      >
        ONE MULTIPIN RUN INSTEAD OF TWENTY-FOUR CABLES
      </div>
    </Shell>
  );
};

export const S21: React.FC<SceneProps> = ({dur, accent}) => {
  const f = useCurrentFrame();
  const names = PLACEMENTS.S21.primary;
  const s = pop(f, 4, 18);
  return (
    <Shell id="S21" dur={dur} backdrop={names[6]} backdropOpacity={0.16}>
      <Kicker color={accent}>FOUR WAYS TO WIRE IT IN</Kicker>
      <Display
        size={88}
        color={C.ink}
        style={{
          marginTop: 10,
          opacity: Math.min(1, s * 1.6),
          transform: `translateY(${(1 - s) * 16}px)`,
        }}
      >
        BUILT AROUND THE DESK
        <br />
        <span style={{color: accent}}>YOU ALREADY HAVE.</span>
      </Display>

      {/* the four system diagrams — the clearest explanation in the asset set */}
      <MontageGrid
        names={names.slice(0, 4)}
        cols={2}
        rows={2}
        top={296}
        h={470}
        dur={dur}
        accent={accent}
        gap={14}
        per={4}
        fit="contain"
        pad={4}
        captions={['LIVE MULTITRACK', 'WITH A DAW', 'DAW-LESS', 'WITH MIC PREAMPS']}
      />

      {/* transport, local monitoring, and the rack context */}
      <MontageGrid
        names={names.slice(4)}
        cols={3}
        rows={1}
        top={790}
        h={244}
        dur={dur}
        accent={accent}
        gap={14}
        delay={26}
        per={5}
        captions={['TRANSPORT', 'LOCAL MONITOR', 'HUI / MCU']}
      />

      <div style={{position: 'absolute', left: 0, top: 1056, width: 250}}>
        <RackWire w={188} h={132} accent={accent} p={ramp(f, [40, 92], [0, 1])} />
      </div>

      <div style={{position: 'absolute', left: 224, top: 1064, width: SAFE.w - 224}}>
        <Rule w={SAFE.w - 224} accent={accent} p={ramp(f, [46, 96], [0, 1])} thickness={2} />
        <Body size={27} color={C.inkSoft} style={{marginTop: 14}}>
          24 tracks of BWF to SDXC, a 24-in / 24-out USB interface and HUI/MCU
          transport — in six rack units.
        </Body>
        <Mono size={19} color={C.inkDim} style={{marginTop: 10}}>
          MIDI IN/OUT · MTC · CLICK OUT · DUAL FOOTSWITCH
        </Mono>
      </div>
    </Shell>
  );
};
