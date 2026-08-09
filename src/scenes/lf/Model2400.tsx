import React from 'react';
import {useCurrentFrame} from 'remotion';
import {RoutingMatrix} from '../../components/Bits';
import {BeatCycle} from '../../components/lf/BeatCycle';
import {GallerySweep} from '../../components/lf/GallerySweep';
import {BrandingBeat, ChapterHero, ClipMotionBeat} from '../../components/lf/LFParts';
import {Photo} from '../../components/Photo';
import {Body, CountUp, Kicker, Display} from '../../components/Type';
import {pop, ramp, stag} from '../../lib/anim';
import {LF_PLACEMENTS} from '../../lib/lf-assets';
import {C, EDGE_PAD, F, LF_CANVAS} from '../../lib/lf-theme';
import type {LFSceneProps} from './ColdOpenAndFamily';

// MODEL 2400 — the flagship. Earns the largest single-product share (58s of
// 298, matching the brief's own proportionally largest allocation) because
// what separates it from the Model 24 is not size but ROUTING DEPTH: four
// stereo subgroups, five aux sends, a Master Bus Processor, and HUI/MCU
// transport returning after two chapters without it.

export const M2400_1: React.FC<LFSceneProps> = ({accent}) => (
  <ChapterHero
    k="m2400"
    index="CHAPTER 04 / 05"
    accent={accent}
    hero={LF_PLACEMENTS.M2400_1[0]}
    dims="680.5 × 132.5 × 568 mm · 14.0 kg"
    blurb="The flagship of the range. Flagship analog capacity, advanced routing architecture, and digital Master Bus processing — reintegrating full HUI/MCU DAW transport control on the way."
  />
);

export const M2400_2: React.FC<LFSceneProps> = ({accent}) => (
  <ClipMotionBeat
    id="m2400-clip"
    accent={accent}
    headline="TWELVE ULTRA-HDDA. PLUS FOUR."
    sub="TALKBACK MIC INPUT · MIDI IN/OUT WITH MTC AND CLOCK · DEDICATED METRONOME CLICK OUT"
    motionLabel="FLAGSHIP SURFACE · 1× SPEED"
  />
);

export const M2400_3: React.FC<LFSceneProps> = ({accent}) => {
  const [masterBus, hdda, meterApp, rear] = LF_PLACEMENTS.M2400_3;
  return (
    <BeatCycle
      accent={accent}
      imgBox={{l: 980, t: 110, w: LF_CANVAS.w - 980 - EDGE_PAD, h: 820}}
      textBox={{l: EDGE_PAD, t: 260, w: 860}}
      beats={[
        {
          img: masterBus,
          fit: 'contain',
          kicker: 'MASTER BUS PROCESSOR',
          headline: 'Digital processing, on an analog board.',
          body: 'A 4-band digital parametric EQ and a stereo bus compressor sit directly on the master section — mix-bus shaping without leaving the console.',
          specs: ['4-BAND PARAMETRIC EQ', 'STEREO BUS COMPRESSOR'],
          dur: 120,
        },
        {
          img: hdda,
          fit: 'contain',
          kicker: 'REFINED PREAMP ALLOCATION',
          headline: 'Twelve Ultra-HDDA, plus four standard.',
          body: 'The same 22 analog inputs as the Model 24, with the preamp bank refined for the flagship’s routing depth, recording to high-capacity SDXC media.',
          specs: ['12 ULTRA-HDDA + 4 STANDARD', 'SDXC MEDIA'],
          dur: 120,
        },
        {
          img: meterApp,
          fit: 'contain',
          kicker: 'TASCAM METER BRIDGE APP',
          headline: 'Every channel, monitored digitally.',
          body: 'Peak-hold VU meters mirror the analog signal in real time — a digital-glow companion to the physical board.',
          specs: ['PEAK-HOLD METERING', 'REAL-TIME MONITORING'],
          dur: 110,
        },
        {
          img: rear,
          fit: 'contain',
          kicker: 'HUI / MCU TRANSPORT RETURNS',
          headline: 'DAW transport and REC-ready control.',
          body: 'After two chapters without it, tactile DAW transport comes back on the flagship — Play, Record, Rewind, and REC-arm, mapped straight to the timeline.',
          specs: ['TRANSPORT + REC READY', 'HUI / MCU PROTOCOL'],
          dur: 130,
        },
      ]}
    />
  );
};

export const M2400_4: React.FC<LFSceneProps> = ({accent}) => {
  const f = useCurrentFrame();
  const [rearCabled] = LF_PLACEMENTS.M2400_4;
  const p = ramp(f, [16, 90], [0, 1]);
  return (
    <>
      <div style={{position: 'absolute', left: EDGE_PAD, top: 90, width: 820}}>
        <Kicker color={accent} size={22}>ADVANCED ROUTING ARCHITECTURE</Kicker>
        <Display size={70} color={C.ink} style={{marginTop: 14}}>
          FOUR SUBGROUPS.
          <br />
          <span style={{color: accent}}>FIVE AUX SENDS.</span>
        </Display>
        <Body size={26} color={C.inkSoft} style={{marginTop: 22, maxWidth: 760}}>
          Dedicated drum busses, independent headphone mixes for multiple artists,
          complex send chains — routing frustrations the simpler mixers can&apos;t solve.
        </Body>
      </div>
      <div style={{position: 'absolute', left: EDGE_PAD, top: 460, width: 820, opacity: ramp(f, [8, 40], [0, 1])}}>
        <RoutingMatrix w={820} h={280} accent={accent} p={p} />
      </div>
      <Photo
        name={rearCabled}
        box={{l: 980, t: 130, w: LF_CANVAS.w - 980 - EDGE_PAD, h: 760}}
        dur={270}
        fit="contain"
        pad={16}
        accent={accent}
        elev={0.9}
      />
    </>
  );
};

export const M2400_5: React.FC<LFSceneProps> = ({dur, accent}) => (
  <GallerySweep
    names={LF_PLACEMENTS.M2400_5}
    dur={dur}
    accent={accent}
    box={{l: EDGE_PAD, t: 140, w: LF_CANVAS.w - EDGE_PAD * 2, h: 780}}
    kicker="THE FLAGSHIP CENTREPIECE"
    headline="Total studio centralization, in one console."
  />
);

export const M2400_6: React.FC<LFSceneProps> = ({dur, accent}) => {
  const f = useCurrentFrame();
  const [live, rehearsal] = LF_PLACEMENTS.M2400_6;
  const cw = (LF_CANVAS.w - EDGE_PAD * 2 - 24) / 2;
  return (
    <>
      <div style={{position: 'absolute', left: EDGE_PAD, top: 80, width: LF_CANVAS.w - EDGE_PAD * 2, textAlign: 'center'}}>
        <Kicker color={accent} size={22} style={{justifyContent: 'center', display: 'flex'}}>
          COMMERCIAL FACILITY · PROFESSIONAL SESSION
        </Kicker>
        <Display size={62} color={C.ink} align="center" style={{marginTop: 12}}>
          TALKBACK. HEADPHONE MIXES. TOTAL CONTROL.
        </Display>
      </div>
      <Photo name={live} box={{l: EDGE_PAD, t: 250, w: cw, h: 640}} dur={dur} fit="cover" radius={20} accent={accent} elev={0.9} />
      <Photo name={rehearsal} box={{l: EDGE_PAD + cw + 24, t: 250, w: cw, h: 640}} dur={dur} fit="cover" radius={20} elev={0.9} kb={{z: [1.06, 1.14]}} />
      <div style={{position: 'absolute', left: 0, bottom: 40, width: LF_CANVAS.w, display: 'flex', justifyContent: 'center', gap: 60}}>
        {[{v: 22, l: 'ANALOG IN'}, {v: 24, l: 'TRACKS TO SDXC'}, {v: 4, l: 'STEREO SUBGROUPS'}].map((x, i) => {
          const g = pop(f, stag(i, 8, 20), 17);
          return (
            <div key={x.l} style={{textAlign: 'center', opacity: Math.min(1, g * 1.5)}}>
              <CountUp to={x.v} dur={30} delay={20 + i * 8} size={70} color={accent} />
              <div style={{fontFamily: F.mono, fontSize: 17, letterSpacing: 1.8, color: C.inkDim, marginTop: 4}}>{x.l}</div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export const M2400_7: React.FC<LFSceneProps> = ({accent}) => (
  <BrandingBeat accent={accent} nextUp="WHO USES WHAT — REAL-WORLD WORKFLOWS" showTascam />
);
