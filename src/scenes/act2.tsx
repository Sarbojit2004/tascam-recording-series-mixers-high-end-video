import React from 'react';
import {useCurrentFrame} from 'remotion';
import {MeterBridge, Rule, ScaleLadder} from '../components/Bits';
import {Photo} from '../components/Photo';
import {Body, Display, Kicker, Mono} from '../components/Type';
import {pop, ramp} from '../lib/anim';
import {PLACEMENTS} from '../lib/assets';
import {C, F, SAFE} from '../lib/theme';
import {ClipBeat, MontageGrid, ProductTitle} from './parts';
import {Shell, SceneProps} from './shell';

// ACT 2 — MODEL 16. Deliberately NOT a bigger Model 12. The DAW control
// surface is gone; what replaces it is a purer analog signal path, more
// inputs, and the one thing a rehearsal room actually needs — a recording
// that does not depend on a laptop staying alive.

export const S07: React.FC<SceneProps> = ({dur, accent}) => {
  const f = useCurrentFrame();
  const [hero, flat] = PLACEMENTS.S07.primary;
  return (
    <Shell id="S07" dur={dur} backdrop={hero} backdropOpacity={0.2}>
      <ProductTitle k="m16" index="02 / 05" accent={accent} />

      <Photo
        name={hero}
        box={{l: 0, t: 412, w: SAFE.w, h: 452}}
        dur={dur}
        fit="cover"
        accent={accent}
        kb={{z: [1.05, 1.12], x: [1.5, -1.5]}}
      />

      <Photo
        name={flat}
        box={{l: 476, t: 888, w: 448, h: 292}}
        dur={dur}
        fit="contain"
        pad={8}
        radius={14}
        elev={0.8}
      />

      <div style={{position: 'absolute', left: 0, top: 888, width: 448}}>
        <Mono size={22} color={accent} tracking={2.4}>
          430 × 112.9 × 463 mm · 7.0 kg
        </Mono>
        <Body size={29} color={C.inkSoft} style={{marginTop: 14}}>
          A true analog desk with a 16-track recorder inside it. No computer in
          the signal path, and none required to keep the take.
        </Body>
        <Rule w={448} accent={accent} p={ramp(f, [22, 50], [0, 1])} thickness={2} />
      </div>
    </Shell>
  );
};

export const S08: React.FC<SceneProps> = ({dur, accent}) => (
  <Shell id="S08" dur={dur} backdrop={PLACEMENTS.S08.ambient[1]} backdropOpacity={0.16}>
    <ClipBeat
      id="m16-clip"
      accent={accent}
      headline="ZERO-LATENCY ANALOG PATH"
      sub="14 ANALOG INPUTS · 10 ULTRA-HDDA PREAMPS · 60 mm FADERS"
      motionLabel="ON THE DESK · 1× SPEED"
      stats={[
        {v: 16, l: 'TRACKS TO SD'},
        {v: 14, l: 'ANALOG INPUTS'},
        {v: 10, l: 'ULTRA-HDDA PREAMPS'},
      ]}
    />
  </Shell>
);

export const S09: React.FC<SceneProps> = ({dur, accent}) => {
  const f = useCurrentFrame();
  const names = PLACEMENTS.S09.primary;
  const s = pop(f, 2, 18);
  return (
    <Shell id="S09" dur={dur} backdrop={names[1]} backdropOpacity={0.18}>
      <Kicker color={accent}>16 TRACKS · STRAIGHT TO SD</Kicker>
      <Display
        size={98}
        color={C.ink}
        style={{
          marginTop: 12,
          opacity: Math.min(1, s * 1.6),
          transform: `translateY(${(1 - s) * 18}px)`,
        }}
      >
        THE TAKE SURVIVES
        <br />
        <span style={{color: accent}}>THE LAPTOP.</span>
      </Display>

      <MontageGrid
        names={names}
        cols={2}
        rows={2}
        top={330}
        h={556}
        dur={dur}
        accent={accent}
        gap={16}
        per={5}
        captions={['CHANNEL STRIP', 'RECORDER + METERS', 'MONITOR SECTION', 'ULTRA-HDDA']}
      />

      <div style={{position: 'absolute', left: 0, top: 920, width: SAFE.w}}>
        <Mono size={21} color={C.inkDim} style={{marginBottom: 12}}>
          16-TRACK CAPTURE · 24-BIT / 48 kHz · WAV
        </Mono>
        <MeterBridge w={SAFE.w} h={168} cols={16} accent={accent} seed={11} />
      </div>

      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 1128,
          fontFamily: F.mono,
          fontSize: 21,
          letterSpacing: 1.6,
          color: C.inkDim,
          opacity: ramp(f, [40, 64], [0, 1]),
        }}
      >
        3 AUX SENDS · BLUETOOTH 5.0 · RACK-MOUNTABLE VIA AK-RM16
      </div>
    </Shell>
  );
};

export const S10: React.FC<SceneProps> = ({dur, accent}) => {
  const f = useCurrentFrame();
  const [hero] = PLACEMENTS.S10.primary;
  return (
    <Shell id="S10" dur={dur} backdrop={hero} backdropOpacity={0.22}>
      <Photo
        name={hero}
        box={{l: 0, t: 0, w: SAFE.w, h: 620}}
        dur={dur}
        fit="cover"
        accent={accent}
        kb={{z: [1.06, 1.16], x: [1.8, -1.2]}}
      />

      <div style={{position: 'absolute', left: 0, top: 664, width: SAFE.w}}>
        <Kicker color={accent}>REHEARSAL ROOM · SMALL VENUE</Kicker>
        <Display size={92} color={C.ink} style={{marginTop: 12}}>
          MIX THE ROOM.
          <br />
          <span style={{color: accent}}>KEEP EVERY TRACK.</span>
        </Display>
      </div>

      <div style={{position: 'absolute', left: 0, top: 950, width: SAFE.w}}>
        <ScaleLadder
          w={SAFE.w}
          h={214}
          p={ramp(f, [8, 56], [0, 1])}
          values={[
            {label: 'MODEL 12', v: 10, color: C.m12},
            {label: 'MODEL 16', v: 14, color: C.m16},
            {label: 'MODEL 24', v: 22, color: C.m24, dim: true},
            {label: 'MODEL 2400', v: 22, color: C.m2400, dim: true},
          ]}
        />
        <Mono size={19} color={C.inkDim} style={{marginTop: 10}}>
          ANALOG INPUT CHANNELS
        </Mono>
      </div>
    </Shell>
  );
};
