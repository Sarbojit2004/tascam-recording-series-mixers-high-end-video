import React from 'react';
import {BeatCycle} from '../../components/lf/BeatCycle';
import {GallerySweep} from '../../components/lf/GallerySweep';
import {BrandingBeat, ChapterHero, ClipMotionBeat} from '../../components/lf/LFParts';
import {LF_PLACEMENTS} from '../../lib/lf-assets';
import {EDGE_PAD, LF_CANVAS} from '../../lib/lf-theme';
import type {LFSceneProps} from './ColdOpenAndFamily';

// MODEL 12 — the desktop hybrid. Its identity is consolidation: a whole
// production suite (mixer, 12-track recorder, USB interface, DAW control
// surface) folded onto one desktop. It's the only unit in the compact tiers
// with full HUI/MCU fader control — that's the chapter's centre of gravity.

export const M12_1: React.FC<LFSceneProps> = ({accent}) => (
  <ChapterHero
    k="m12"
    index="CHAPTER 01 / 05"
    accent={accent}
    hero={LF_PLACEMENTS.M12_1[0]}
    dims="343 × 98.8 × 360 mm · 4.3 kg"
    blurb="A mixer, a 12-track SD recorder, a USB interface, and a full DAW control surface — folded into one desktop footprint. Built for the producer who wants an entire studio without the clutter of a separate interface, controller and recorder."
  />
);

export const M12_2: React.FC<LFSceneProps> = ({accent}) => (
  <ClipMotionBeat
    id="m12-clip"
    accent={accent}
    headline="EIGHT ULTRA-HDDA PREAMPS"
    sub="1-KNOB COMPRESSOR · 3-BAND EQ WITH SWEEPABLE MID · 12-TRACK SD RECORDING"
    motionLabel="FADER BANK · 1× SPEED"
  />
);

export const M12_3: React.FC<LFSceneProps> = ({accent}) => {
  const [meterBridge, settings, transport, streaming] = LF_PLACEMENTS.M12_3;
  return (
    <BeatCycle
      accent={accent}
      imgBox={{l: 980, t: 130, w: LF_CANVAS.w - 980 - EDGE_PAD, h: 780}}
      textBox={{l: EDGE_PAD, t: 280, w: 860}}
      beats={[
        {
          img: meterBridge,
          fit: 'contain',
          kicker: 'HUI / MCU PROTOCOL EMULATION',
          headline: 'Your DAW, under your hands.',
          body: 'The Model 12 is the only unit in the compact tiers offering tactile DAW control — faders, mutes, pans and transport across Pro Tools, Logic and Ableton.',
          specs: ['FADERS', 'MUTES', 'PANS', 'TRANSPORT'],
          dur: 110,
        },
        {
          img: settings,
          fit: 'contain',
          kicker: 'DEVICE + DRIVER',
          headline: 'A 12-in, 10-out USB Type-C interface.',
          body: 'Configures as a native audio device on macOS and Windows, with dedicated sample-rate and buffer-size control from the desktop.',
          specs: ['12-IN / 10-OUT USB', 'TYPE-C', 'UP TO 48 kHz'],
          dur: 100,
        },
        {
          img: transport,
          fit: 'contain',
          kicker: 'SD / SDHC / SDXC',
          headline: '12-track standalone recording.',
          body: 'Every channel captures independently to SD media at 24-bit / 48 kHz — a full multitrack take with no computer in the signal path at all.',
          specs: ['WAV 24-BIT / 48 kHz', 'NO COMPUTER REQUIRED'],
          dur: 100,
        },
        {
          img: streaming,
          fit: 'contain',
          kicker: 'LIVE STREAMING WORKFLOW',
          headline: 'Built for the broadcast desk.',
          body: 'A 3.5mm TRRS smartphone input with mix-minus prevents feedback loops during live phone-call broadcasts — plus an internal metronome and output delay up to 2000ms.',
          specs: ['TRRS MIX-MINUS', 'OUTPUT DELAY 2000ms'],
          dur: 110,
        },
      ]}
    />
  );
};

export const M12_4: React.FC<LFSceneProps> = ({dur, accent}) => (
  <GallerySweep
    names={LF_PLACEMENTS.M12_4}
    dur={dur}
    accent={accent}
    box={{l: EDGE_PAD, t: 140, w: LF_CANVAS.w - EDGE_PAD * 2, h: 800}}
    kicker="IN THE ROOM"
    headline="Podcast desk. Beat room. Live set. Streaming rig."
  />
);

export const M12_5: React.FC<LFSceneProps> = ({accent}) => (
  <BrandingBeat accent={accent} nextUp="MODEL 16 — THE LIVE ENSEMBLE TRACKER" />
);
