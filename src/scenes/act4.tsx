import React from 'react';
import {useCurrentFrame} from 'remotion';
import {MeterBridge, RoutingMatrix, Rule} from '../components/Bits';
import {Photo} from '../components/Photo';
import {Body, CountUp, Display, Kicker, Mono} from '../components/Type';
import {pop, ramp} from '../lib/anim';
import {PLACEMENTS} from '../lib/assets';
import {C, F, SAFE} from '../lib/theme';
import {ClipBeat, MontageGrid, ProductTitle} from './parts';
import {Shell, SceneProps} from './shell';

// ACT 4 — MODEL 2400. The flagship gets the most runtime because the thing
// that separates it is not size — the Model 24 is already large — but routing
// depth: four stereo subgroups, five aux sends, a Master Bus Processor, and
// HUI/MCU transport coming back after two units without it.

export const S15: React.FC<SceneProps> = ({dur, accent}) => {
  const f = useCurrentFrame();
  const [hero, topDown] = PLACEMENTS.S15.primary;
  return (
    <Shell id="S15" dur={dur} backdrop={hero} backdropOpacity={0.2}>
      <ProductTitle k="m2400" index="04 / 05" accent={accent} size={128} />

      <Photo
        name={hero}
        box={{l: 0, t: 402, w: SAFE.w, h: 460}}
        dur={dur}
        fit="contain"
        pad={10}
        accent={accent}
        kb={{z: [1.0, 1.045]}}
      />

      <Photo
        name={topDown}
        box={{l: 470, t: 886, w: 454, h: 294}}
        dur={dur}
        fit="contain"
        pad={8}
        radius={14}
        elev={0.8}
      />

      <div style={{position: 'absolute', left: 0, top: 886, width: 442}}>
        <Mono size={22} color={accent} tracking={2.4}>
          680.5 × 132.5 × 568 mm · 14.0 kg
        </Mono>
        <Body size={29} color={C.inkSoft} style={{marginTop: 14}}>
          The permanent centrepiece: flagship analog capacity with digital
          Master Bus processing on the board itself.
        </Body>
        <Rule w={442} accent={accent} p={ramp(f, [24, 54], [0, 1])} thickness={2} />
      </div>
    </Shell>
  );
};

export const S16: React.FC<SceneProps> = ({dur, accent}) => (
  <Shell id="S16" dur={dur} backdrop={PLACEMENTS.S16.ambient[0]} backdropOpacity={0.16}>
    <ClipBeat
      id="m2400-clip"
      accent={accent}
      headline="TWELVE ULTRA-HDDA. PLUS FOUR."
      sub="TALKBACK MIC INPUT · MIDI IN/OUT WITH MTC AND CLOCK · CLICK OUT"
      motionLabel="FLAGSHIP SURFACE · 1× SPEED"
      stats={[
        {v: 24, l: 'TRACKS TO SDXC'},
        {v: 5, l: 'AUX SENDS'},
        {v: 4, l: 'STEREO SUBGROUPS'},
      ]}
    />
  </Shell>
);

export const S17: React.FC<SceneProps> = ({dur, accent}) => {
  const f = useCurrentFrame();
  const names = PLACEMENTS.S17.primary;
  const s = pop(f, 2, 18);
  return (
    <Shell id="S17" dur={dur} backdrop={names[1]} backdropOpacity={0.18}>
      <Kicker color={accent}>MASTER BUS PROCESSOR</Kicker>
      <Display
        size={92}
        color={C.ink}
        style={{
          marginTop: 12,
          opacity: Math.min(1, s * 1.6),
          transform: `translateY(${(1 - s) * 18}px)`,
        }}
      >
        FOUR SUBGROUPS.
        <br />
        <span style={{color: accent}}>FIVE AUX SENDS.</span>
      </Display>

      <div style={{position: 'absolute', left: 0, top: 322, width: 430}}>
        <RoutingMatrix w={430} h={216} accent={accent} p={ramp(f, [8, 58], [0, 1])} />
        <Mono size={19} color={C.inkDim} style={{marginTop: 10}}>
          SUBGROUP / AUX ROUTING
        </Mono>
      </div>

      <div style={{position: 'absolute', left: 470, top: 322, width: 454}}>
        <MeterBridge w={454} h={216} cols={12} accent={accent} seed={23} />
        <Mono size={19} color={C.inkDim} style={{marginTop: 10}}>
          4-BAND PARAMETRIC EQ · STEREO BUS COMP
        </Mono>
      </div>

      <MontageGrid
        names={names}
        cols={2}
        rows={2}
        top={606}
        h={512}
        dur={dur}
        accent={accent}
        gap={16}
        per={5}
        captions={[
          'MASTER BUS SECTION',
          'REAR I/O',
          'REAR PANEL',
          'METER BRIDGE APP',
        ]}
      />

      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 1146,
          fontFamily: F.mono,
          fontSize: 21,
          letterSpacing: 1.6,
          color: C.inkDim,
          opacity: ramp(f, [54, 80], [0, 1]),
        }}
      >
        HUI / MCU TRANSPORT AND REC READY · 24-TRACK SDXC
      </div>
    </Shell>
  );
};

export const S18: React.FC<SceneProps> = ({dur, accent}) => {
  const f = useCurrentFrame();
  const [live, rehearsal] = PLACEMENTS.S18.primary;
  const s = pop(f, 6, 18);
  return (
    <Shell id="S18" dur={dur} backdrop={live} backdropOpacity={0.22}>
      <Photo
        name={live}
        box={{l: 0, t: 0, w: SAFE.w, h: 470}}
        dur={dur}
        fit="cover"
        accent={accent}
        kb={{z: [1.06, 1.15], x: [1.4, -1.4]}}
      />
      <Photo
        name={rehearsal}
        box={{l: 0, t: 486, w: SAFE.w, h: 360}}
        dur={dur}
        fit="cover"
        radius={16}
        elev={0.85}
        kb={{z: [1.08, 1.16], y: [-1.2, 1.2]}}
      />

      <div style={{position: 'absolute', left: 0, top: 884, width: SAFE.w}}>
        <div style={{display: 'flex', gap: 46, alignItems: 'flex-end'}}>
          {[
            {v: 22, l: 'ANALOG IN'},
            {v: 24, l: 'TRACKS TO SDXC'},
            {v: 4, l: 'STEREO SUBGROUPS'},
          ].map((x, i) => (
            <div key={x.l}>
              <CountUp to={x.v} dur={34} delay={8 + i * 8} size={104} color={accent} />
              <Mono size={19} color={C.inkDim} tracking={2} style={{marginTop: 6}}>
                {x.l}
              </Mono>
            </div>
          ))}
        </div>
        <Rule w={SAFE.w} accent={accent} p={ramp(f, [40, 84], [0, 1])} thickness={2} />
        <Body
          size={29}
          color={C.inkSoft}
          style={{
            marginTop: 18,
            opacity: Math.min(1, s * 1.5),
          }}
        >
          Dedicated drum busses, independent headphone mixes, talkback to the
          live room — settled on the board, before the DAW ever sees it.
        </Body>
      </div>
    </Shell>
  );
};
