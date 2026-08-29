import React from 'react';
import {BeatCycle} from '../../components/lf/BeatCycle';
import {GallerySweep} from '../../components/lf/GallerySweep';
import {BrandingBeat, ChapterHero, ClipMotionBeat} from '../../components/lf/LFParts';
import {LF_PLACEMENTS} from '../../lib/lf-assets';
import {EDGE_PAD, LF_CANVAS} from '../../lib/lf-theme';
import type {LFSceneProps} from './ColdOpenAndFamily';

// MODEL 16 — deliberately NOT a bigger Model 12. The DAW control surface is
// gone; what replaces it is a purer analog signal path, more inputs, and the
// one thing a rehearsal room actually needs: a recording that survives the
// laptop crashing.

export const M16_1: React.FC<LFSceneProps> = ({accent}) => (
  <ChapterHero
    k="m16"
    index="CHAPTER 02 / 05"
    accent={accent}
    hero={LF_PLACEMENTS.M16_1[0]}
    dims="430 × 112.9 × 463 mm · 7.0 kg"
    blurb="A true analog desk with a 16-track recorder inside it. No computer sits in the signal path, and none is required to keep the take — the recording survives whatever happens to the laptop."
  />
);

export const M16_2: React.FC<LFSceneProps> = ({accent}) => (
  <ClipMotionBeat
    id="m16-clip"
    accent={accent}
    headline="ZERO-LATENCY ANALOG PATH"
    sub="14 ANALOG INPUTS · 10 ULTRA-HDDA PREAMPS · 60 mm FADERS"
    motionLabel="ON THE DESK · 1× SPEED"
  />
);

export const M16_3: React.FC<LFSceneProps> = ({accent}) => {
  const [knobs, lcd, badge] = LF_PLACEMENTS.M16_3;
  return (
    <BeatCycle
      accent={accent}
      imgBox={{l: 980, t: 130, w: LF_CANVAS.w - 980 - EDGE_PAD, h: 780}}
      textBox={{l: EDGE_PAD, t: 300, w: 860}}
      beats={[
        {
          img: knobs,
          fit: 'contain',
          kicker: '1-KNOB COMPRESSOR · 3-BAND SWEEPABLE EQ',
          headline: 'Fourteen analog inputs.',
          body: '10 Ultra-HDDA mic preamps, 12 line inputs and a stereo Bluetooth/RCA channel — a genuinely expanded signal path built for a full live ensemble.',
          specs: ['10 ULTRA-HDDA PREAMPS', '12 LINE INPUTS', 'BLUETOOTH / RCA'],
          dur: 105,
        },
        {
          img: lcd,
          fit: 'contain',
          kicker: '16-TRACK STANDALONE RECORDING',
          headline: 'Every input, captured independently.',
          body: '14 inputs plus the main stereo mix, all recorded simultaneously at 24-bit / 48 kHz to SD media — the archival safety a live take needs.',
          specs: ['24-BIT / 48 kHz', 'SD / SDHC / SDXC'],
          dur: 115,
        },
        {
          img: badge,
          fit: 'contain',
          kicker: 'THREE AUX OUTPUTS',
          headline: 'A permanent venue installation, if you want one.',
          body: 'True 60mm faders, expanded aux routing, and rack-mountability via the optional AK-RM16 kit — built to live in a venue, not just travel to one.',
          specs: ['60 mm FADERS', '3 AUX SENDS', 'AK-RM16 RACK KIT'],
          dur: 110,
        },
      ]}
    />
  );
};

export const M16_4: React.FC<LFSceneProps> = ({dur, accent}) => (
  <GallerySweep
    names={LF_PLACEMENTS.M16_4}
    dur={dur}
    accent={accent}
    box={{l: EDGE_PAD, t: 150, w: LF_CANVAS.w - EDGE_PAD * 2, h: 780}}
    kicker="LIVE ENSEMBLE"
    headline="Rehearsal room to small venue, wired in and ready."
  />
);

export const M16_5: React.FC<LFSceneProps> = ({accent}) => (
  <BrandingBeat accent={accent} nextUp="MODEL 24 — THE LARGE-FORMAT CONSOLE" />
);
