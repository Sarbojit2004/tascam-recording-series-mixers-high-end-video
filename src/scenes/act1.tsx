import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Rule, SignalFlow, TransportRow} from '../components/Bits';
import {Photo} from '../components/Photo';
import {Body, Display, Kicker, Mono} from '../components/Type';
import {pop, ramp} from '../lib/anim';
import {PLACEMENTS} from '../lib/assets';
import {C, F, SAFE} from '../lib/theme';
import {ClipBeat, MontageGrid, ProductTitle} from './parts';
import {Shell, SceneProps} from './shell';

// ACT 1 — MODEL 12. The emphasis here is consolidation: a whole production
// suite folded onto one desktop, and the only unit in the compact tiers with
// full HUI/MCU fader control. Its beats are hero → motion → the HUI/MCU
// transport idea → the rooms it actually gets used in.

export const S03: React.FC<SceneProps> = ({dur, accent}) => {
  const f = useCurrentFrame();
  const [hero, top] = PLACEMENTS.S03.primary;
  return (
    <Shell id="S03" dur={dur} backdrop={hero} backdropOpacity={0.2}>
      <ProductTitle k="m12" index="01 / 05" accent={accent} />

      <Photo
        name={hero}
        box={{l: 0, t: 412, w: SAFE.w, h: 470}}
        dur={dur}
        fit="contain"
        pad={12}
        accent={accent}
        kb={{z: [1.0, 1.03]}}
      />

      <Photo
        name={top}
        box={{l: 0, t: 906, w: 448, h: 274}}
        dur={dur}
        fit="contain"
        pad={8}
        radius={14}
        elev={0.8}
      />

      <div style={{position: 'absolute', left: 484, top: 906, width: SAFE.w - 484}}>
        <Mono size={22} color={accent} tracking={2.4}>
          343 × 98.8 × 360 mm · 4.3 kg
        </Mono>
        <Body size={30} color={C.inkSoft} style={{marginTop: 16}}>
          A mixer, a 12-track SD recorder, a USB interface and a DAW control
          surface — folded into one desktop footprint.
        </Body>
        <Rule w={SAFE.w - 484} accent={accent} p={ramp(f, [24, 52], [0, 1])} thickness={2} />
      </div>
    </Shell>
  );
};

export const S04: React.FC<SceneProps> = ({dur, accent}) => (
  <Shell id="S04" dur={dur} backdrop={PLACEMENTS.S04.ambient[0]} backdropOpacity={0.16}>
    <ClipBeat
      id="m12-clip"
      accent={accent}
      headline="EIGHT ULTRA-HDDA PREAMPS"
      sub="1-KNOB COMPRESSOR · 3-BAND EQ · SWEEPABLE MID"
      motionLabel="FADER BANK · 1× SPEED"
      stats={[
        {v: 12, l: 'TRACKS TO SD'},
        {v: 10, l: 'ANALOG INPUTS'},
        {v: 8, l: 'ULTRA-HDDA PREAMPS'},
      ]}
    />
  </Shell>
);

export const S05: React.FC<SceneProps> = ({dur, accent}) => {
  const f = useCurrentFrame();
  const names = PLACEMENTS.S05.primary;
  return (
    <Shell id="S05" dur={dur} backdrop={names[2]} backdropOpacity={0.18}>
      <Kicker color={accent}>HUI / MCU PROTOCOL EMULATION</Kicker>
      <Display size={96} color={C.ink} style={{marginTop: 12}}>
        YOUR DAW,
        <br />
        <span style={{color: accent}}>UNDER YOUR HANDS.</span>
      </Display>

      <MontageGrid
        names={names}
        cols={3}
        rows={2}
        top={330}
        h={528}
        dur={dur}
        accent={accent}
        gap={16}
        per={4}
        captions={[
          'REAR PANEL',
          'DEVICE SETTINGS',
          'METER BRIDGE',
          'ULTRA-HDDA',
          'TOP DOWN',
          '3/4 PROFILE',
        ]}
      />

      <div style={{position: 'absolute', left: 0, top: 892, width: SAFE.w}}>
        <TransportRow w={SAFE.w} accent={accent} armAt={30} />
      </div>

      <div style={{position: 'absolute', left: 0, top: 1150, opacity: ramp(f, [60, 84], [0, 1])}}>
        <Mono size={22} color={C.inkSoft}>
          FADERS · PANS · MUTES · TRANSPORT
        </Mono>
      </div>
    </Shell>
  );
};

export const S06: React.FC<SceneProps> = ({dur, accent}) => {
  const f = useCurrentFrame();
  const names = PLACEMENTS.S06.primary;
  const s = pop(f, 4, 18);
  return (
    <Shell id="S06" dur={dur} backdrop={names[0]} backdropOpacity={0.2}>
      <MontageGrid
        names={names}
        cols={2}
        rows={2}
        top={0}
        h={640}
        dur={dur}
        accent={accent}
        gap={16}
        per={4}
        captions={['PODCAST', 'BEAT ROOM', 'LIVE SET', 'STREAM']}
      />

      <div style={{position: 'absolute', left: 0, top: 690, width: SAFE.w}}>
        <Kicker color={accent}>TRRS SMARTPHONE INPUT · MIX-MINUS</Kicker>
        <Display
          size={94}
          color={C.ink}
          style={{
            marginTop: 14,
            opacity: Math.min(1, s * 1.6),
            transform: `translateY(${(1 - s) * 18}px)`,
          }}
        >
          BUILT FOR THE ROOM
          <br />
          <span style={{color: accent}}>YOU ACTUALLY WORK IN.</span>
        </Display>
      </div>

      <div style={{position: 'absolute', left: 0, top: 1000, width: SAFE.w}}>
        <SignalFlow
          w={SAFE.w}
          h={150}
          accent={accent}
          p={ramp(f, [16, 66], [0, 1])}
          labels={['XLR / TRRS IN', 'ULTRA-HDDA', 'SD + USB-C']}
        />
      </div>

      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 1166,
          fontFamily: F.mono,
          fontSize: 21,
          letterSpacing: 1.6,
          color: C.inkDim,
          opacity: ramp(f, [50, 72], [0, 1]),
        }}
      >
        BLUETOOTH 5.0 · 5-PIN MIDI IN/OUT · DUAL HEADPHONE OUTS
      </div>
    </Shell>
  );
};
