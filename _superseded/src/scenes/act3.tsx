import React from 'react';
import {useCurrentFrame} from 'remotion';
import {FaderTravel, Rule} from '../components/Bits';
import {Photo} from '../components/Photo';
import {Body, CountUp, Display, Kicker, Mono} from '../components/Type';
import {pop, ramp} from '../lib/anim';
import {PLACEMENTS} from '../lib/assets';
import {C, F, SAFE} from '../lib/theme';
import {ClipBeat, MontageGrid, ProductTitle} from './parts';
import {Shell, SceneProps} from './shell';

// ACT 3 — MODEL 24. The beat that belongs to this unit is physical throw:
// 100 mm faders, 22 inputs, and a board big enough that a whole kit stays
// patched in. Its closing beat is the only real-world case-study material in
// the asset set, so it gets the room.

export const S11: React.FC<SceneProps> = ({dur, accent}) => {
  const f = useCurrentFrame();
  const [hero, topDown] = PLACEMENTS.S11.primary;
  return (
    <Shell id="S11" dur={dur} backdrop={hero} backdropOpacity={0.2}>
      <ProductTitle k="m24" index="03 / 05" accent={accent} />

      <Photo
        name={hero}
        box={{l: 0, t: 412, w: SAFE.w, h: 448}}
        dur={dur}
        fit="contain"
        pad={10}
        accent={accent}
        kb={{z: [1.0, 1.04]}}
      />

      <Photo
        name={topDown}
        box={{l: 0, t: 884, w: 500, h: 296}}
        dur={dur}
        fit="contain"
        pad={8}
        radius={14}
        elev={0.8}
      />

      <div style={{position: 'absolute', left: 536, top: 884, width: SAFE.w - 536}}>
        <Mono size={22} color={accent} tracking={2.4}>
          576 × 112.5 × 513 mm
        </Mono>
        <Body size={29} color={C.inkSoft} style={{marginTop: 14}}>
          The classic large-format footprint, back in the project studio — and
          recording 24 tracks without a computer in sight.
        </Body>
        <Rule w={SAFE.w - 536} accent={accent} p={ramp(f, [24, 52], [0, 1])} thickness={2} />
      </div>
    </Shell>
  );
};

export const S12: React.FC<SceneProps> = ({dur, accent}) => (
  <Shell id="S12" dur={dur} backdrop={PLACEMENTS.S12.ambient[0]} backdropOpacity={0.16}>
    <ClipBeat
      id="m24-clip"
      accent={accent}
      headline="SIXTEEN ULTRA-HDDA PREAMPS"
      sub="7-BAND GRAPHIC EQ ON THE MASTER BUS · 1-KNOB COMP ON CH 1–12"
      motionLabel="LIT CONSOLE · 1× SPEED"
      stats={[
        {v: 24, l: 'TRACKS TO SD'},
        {v: 22, l: 'ANALOG INPUTS'},
        {v: 16, l: 'ULTRA-HDDA PREAMPS'},
      ]}
    />
  </Shell>
);

export const S13: React.FC<SceneProps> = ({dur, accent}) => {
  const f = useCurrentFrame();
  const names = PLACEMENTS.S13.primary;
  return (
    <Shell id="S13" dur={dur} backdrop={names[0]} backdropOpacity={0.18}>
      <Kicker color={accent}>100 mm LONG-THROW</Kicker>
      <div style={{display: 'flex', alignItems: 'flex-end', gap: 18, marginTop: 10}}>
        <CountUp to={100} dur={40} size={150} color={accent} />
        <Display size={92} color={C.ink} style={{marginBottom: 12}}>
          MILLIMETRES
          <br />
          OF TRAVEL.
        </Display>
      </div>

      <div style={{position: 'absolute', left: 0, top: 340, width: SAFE.w}}>
        <FaderTravel w={SAFE.w} h={210} accent={accent} count={11} p={ramp(f, [6, 62], [0, 1])} />
      </div>

      <MontageGrid
        names={names}
        cols={2}
        rows={2}
        top={584}
        h={504}
        dur={dur}
        accent={accent}
        gap={16}
        per={5}
        fit="contain"
        pad={6}
        captions={['TOP DOWN', 'PROFILE', 'ELEVATION', 'REAR PANEL']}
      />

      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 1120,
          fontFamily: F.mono,
          fontSize: 21,
          letterSpacing: 1.6,
          color: C.inkDim,
          opacity: ramp(f, [46, 70], [0, 1]),
        }}
      >
        22 ANALOG INPUTS · 24-IN / 22-OUT USB · SD / SDHC / SDXC
      </div>
    </Shell>
  );
};

export const S14: React.FC<SceneProps> = ({dur, accent}) => {
  const f = useCurrentFrame();
  const names = PLACEMENTS.S14.primary;
  const s = pop(f, 4, 18);
  return (
    <Shell id="S14" dur={dur} backdrop={names[1]} backdropOpacity={0.2}>
      <Kicker color={accent}>PERMANENTLY PATCHED IN</Kicker>
      <Display
        size={94}
        color={C.ink}
        style={{
          marginTop: 12,
          opacity: Math.min(1, s * 1.6),
          transform: `translateY(${(1 - s) * 18}px)`,
        }}
      >
        A WHOLE ROOM,
        <br />
        <span style={{color: accent}}>READY TO RECORD.</span>
      </Display>

      <MontageGrid
        names={names}
        cols={3}
        rows={2}
        top={322}
        h={620}
        dur={dur}
        accent={accent}
        gap={14}
        per={4}
        captions={[
          'CHANNEL LABELS',
          'FULL BAND',
          'GROOVEBOX',
          'AUX + TALKBACK',
          'HOME STUDIO',
          'IN THE ROOM',
        ]}
      />

      <div style={{position: 'absolute', left: 0, top: 980, width: SAFE.w}}>
        <Rule w={SAFE.w} accent={accent} p={ramp(f, [30, 66], [0, 1])} thickness={2} />
        <Body size={30} color={C.inkSoft} style={{marginTop: 18}}>
          Drums, bass rig, guitars and vocal mics stay wired. The board is the
          room — you just press record.
        </Body>
      </div>
    </Shell>
  );
};
