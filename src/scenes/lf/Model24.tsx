import React from 'react';
import {useCurrentFrame} from 'remotion';
import {FaderTravel} from '../../components/Bits';
import {BeatCycle} from '../../components/lf/BeatCycle';
import {GallerySweep} from '../../components/lf/GallerySweep';
import {BrandingBeat, ChapterHero, ClipMotionBeat} from '../../components/lf/LFParts';
import {ramp} from '../../lib/anim';
import {LF_PLACEMENTS} from '../../lib/lf-assets';
import {EDGE_PAD, LF_CANVAS} from '../../lib/lf-theme';
import type {LFSceneProps} from './ColdOpenAndFamily';

// MODEL 24 — the classic large-format footprint, back in the project studio.
// 100mm faders, 22 inputs, a physical canvas big enough that a whole drum kit
// and band stays permanently patched in.

export const M24_1: React.FC<LFSceneProps> = ({accent}) => (
  <ChapterHero
    k="m24"
    index="CHAPTER 03 / 05"
    accent={accent}
    hero={LF_PLACEMENTS.M24_1[0]}
    dims="576 × 112.5 × 513 mm"
    blurb="The classic large-format footprint returns to the project studio — 22 analog inputs, 16 Ultra-HDDA preamps, and a physical canvas big enough for a permanent commercial-tracking setup."
  />
);

export const M24_2: React.FC<LFSceneProps> = ({accent}) => {
  const f = useCurrentFrame();
  return (
    <>
      <ClipMotionBeat
        id="m24-clip"
        accent={accent}
        headline="SIXTEEN ULTRA-HDDA PREAMPS"
        sub="7-BAND GRAPHIC EQ ON THE MASTER BUS · 1-KNOB COMPRESSOR ON CHANNELS 1–12"
        motionLabel="100 mm FADERS · 1× SPEED"
      />
      <div style={{position: 'absolute', left: EDGE_PAD, bottom: 40, width: LF_CANVAS.w - EDGE_PAD * 2, opacity: ramp(f, [90, 130], [0, 1])}}>
        <FaderTravel w={LF_CANVAS.w - EDGE_PAD * 2} h={90} accent={accent} count={16} p={ramp(f, [90, 150], [0, 1])} />
      </div>
    </>
  );
};

export const M24_3: React.FC<LFSceneProps> = ({accent}) => {
  const [darkHero, rearPanel, faderCloseup] = LF_PLACEMENTS.M24_3;
  return (
    <BeatCycle
      accent={accent}
      imgBox={{l: 980, t: 130, w: LF_CANVAS.w - 980 - EDGE_PAD, h: 780}}
      textBox={{l: EDGE_PAD, t: 300, w: 860}}
      beats={[
        {
          img: darkHero,
          fit: 'contain',
          kicker: '100 mm LONG-THROW FADERS',
          headline: 'Granular precision, real travel.',
          body: 'A vast physical canvas for complex analog routing — the extra fader length translates directly into finer level control in the mix.',
          specs: ['100 mm THROW', '22 ANALOG INPUTS', '16 ULTRA-HDDA PREAMPS'],
          dur: 110,
        },
        {
          img: rearPanel,
          fit: 'contain',
          kicker: '24-TRACK STANDALONE RECORDING',
          headline: 'A massive tracking session, captured whole.',
          body: '22 inputs plus the stereo mix, all recorded at 24-bit / 48 kHz to SD/SDHC/SDXC media — the full session, every time, without a computer.',
          specs: ['24-IN / 22-OUT USB', 'SD / SDHC / SDXC'],
          dur: 110,
        },
        {
          img: faderCloseup,
          fit: 'contain',
          kicker: 'MASTER / MONITOR BUS PROCESSING',
          headline: 'A 7-band graphic EQ on the master bus.',
          body: 'Assignable to the master or monitor bus, alongside a 1-knob compressor on the first twelve channels — studio-grade shaping, on the board itself.',
          specs: ['7-BAND GRAPHIC EQ', '1-KNOB COMP · CH 1–12'],
          dur: 110,
        },
      ]}
    />
  );
};

export const M24_4: React.FC<LFSceneProps> = ({dur, accent}) => (
  <GallerySweep
    names={LF_PLACEMENTS.M24_4}
    dur={dur}
    accent={accent}
    box={{l: EDGE_PAD, t: 150, w: LF_CANVAS.w - EDGE_PAD * 2, h: 760}}
    kicker="A PERMANENT BIG-BOARD SETUP"
    headline="Drums, bass rig, guitars, vocals — all permanently patched in."
  />
);

export const M24_5: React.FC<LFSceneProps> = ({dur, accent}) => (
  <GallerySweep
    names={LF_PLACEMENTS.M24_5}
    dur={dur}
    accent={accent}
    box={{l: EDGE_PAD, t: 150, w: LF_CANVAS.w - EDGE_PAD * 2, h: 760}}
    groupSize={3}
    kicker="CASE STUDY"
    headline="A working studio, tracked live."
  />
);

export const M24_6: React.FC<LFSceneProps> = ({accent}) => (
  <BrandingBeat accent={accent} nextUp="MODEL 2400 — THE FLAGSHIP" />
);
