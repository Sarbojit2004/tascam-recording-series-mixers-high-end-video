import React from 'react';
import {useCurrentFrame} from 'remotion';
import {DB25FanOut, RackWire} from '../../components/Bits';
import {BeatCycle} from '../../components/lf/BeatCycle';
import {BrandingBeat} from '../../components/lf/LFParts';
import {Photo} from '../../components/Photo';
import {Body, Kicker, Display} from '../../components/Type';
import {pop, ramp} from '../../lib/anim';
import {LF_PLACEMENTS} from '../../lib/lf-assets';
import {C, EDGE_PAD, F, LF_CANVAS} from '../../lib/lf-theme';
import type {LFSceneProps} from './ColdOpenAndFamily';

// STUDIO BRIDGE — the pivot. Everything before this chapter added scale; this
// one removes the control surface. Built on subtraction throughout, exactly
// like the reel's own treatment, deepened: not the fifth mixer, but the
// flagship's 24-track engine on its own, for a studio that already owns a
// console.

const STRUCK = ['FADERS', 'MIC PREAMPS', 'CHANNEL EQ'];

export const SB_1: React.FC<LFSceneProps> = ({accent}) => {
  const f = useCurrentFrame();
  const [front, dark] = LF_PLACEMENTS.SB_1;
  const s = pop(f, 12, 17);

  return (
    <>
      <div style={{position: 'absolute', left: EDGE_PAD, top: 90, width: 780}}>
        <Kicker color={accent} size={22}>CHAPTER 05 / 05</Kicker>
        <Display size={104} color={C.ink} style={{marginTop: 14, lineHeight: 0.9}}>
          STUDIO BRIDGE
        </Display>
        <div style={{display: 'flex', gap: 10, marginTop: 20}}>
          {STRUCK.map((w, i) => {
            const g = ramp(f, [30 + i * 10, 50 + i * 10], [0, 1]);
            return (
              <div
                key={w}
                style={{
                  position: 'relative',
                  padding: '9px 16px',
                  borderRadius: 8,
                  border: `1px solid ${C.cardEdge}`,
                  background: C.card,
                  fontFamily: F.mono,
                  fontSize: 19,
                  letterSpacing: 1.2,
                  color: g > 0.6 ? C.inkDim : C.inkSoft,
                }}
              >
                {w}
                <div style={{position: 'absolute', left: 10, top: '52%', width: `calc((100% - 20px) * ${g})`, height: 2.5, background: accent}} />
              </div>
            );
          })}
        </div>
        <Body size={28} color={C.inkSoft} style={{marginTop: 26, opacity: Math.min(1, s * 1.5), maxWidth: 720}}>
          Not the fifth mixer. The flagship&apos;s 24-track recording and interface
          engine, for a studio that already owns its console.
        </Body>
      </div>

      <Photo name={front} box={{l: 980, t: 130, w: LF_CANVAS.w - 980 - EDGE_PAD, h: 460}} dur={180} fit="contain" pad={14} accent={accent} elev={1} />
      <Photo name={dark} box={{l: 980, t: 620, w: LF_CANVAS.w - 980 - EDGE_PAD, h: 320}} dur={180} fit="cover" radius={18} elev={0.85} />
    </>
  );
};

export const SB_2: React.FC<LFSceneProps> = ({accent}) => {
  const f = useCurrentFrame();
  const [bd] = LF_PLACEMENTS.SB_2;
  const p = ramp(f, [10, 130], [0, 1]);
  return (
    <>
      <Photo name={bd} box={{l: EDGE_PAD, t: 700, w: 460, h: 260}} dur={240} fit="cover" radius={18} elev={0.8} />
      <div style={{position: 'absolute', left: EDGE_PAD, top: 90, width: 820}}>
        <Kicker color={accent} size={22}>DB-25 · AES59-2012</Kicker>
        <Display size={80} color={C.ink} style={{marginTop: 14}}>
          TWENTY-FOUR IN.
          <br />
          <span style={{color: accent}}>TWENTY-FOUR OUT.</span>
        </Display>
        <Body size={26} color={C.inkSoft} style={{marginTop: 20, maxWidth: 760}}>
          One multipin run replaces twenty-four individual TRS cables — solving the
          wiring nightmare of interfacing a full analog console.
        </Body>
      </div>
      <div style={{position: 'absolute', left: 940, top: 260, width: LF_CANVAS.w - 940 - EDGE_PAD}}>
        <DB25FanOut w={LF_CANVAS.w - 940 - EDGE_PAD} h={480} accent={accent} p={p} />
      </div>
    </>
  );
};

export const SB_3: React.FC<LFSceneProps> = ({accent}) => {
  const [lcd, rear, rackArray] = LF_PLACEMENTS.SB_3;
  return (
    <BeatCycle
      accent={accent}
      imgBox={{l: 980, t: 130, w: LF_CANVAS.w - 980 - EDGE_PAD, h: 780}}
      textBox={{l: EDGE_PAD, t: 320, w: 860}}
      beats={[
        {
          img: lcd,
          fit: 'contain',
          kicker: 'HUI / MCU TRANSPORT — DESPITE NO FADERS',
          headline: 'A full DAW transport controller.',
          body: 'No mixing surface, but Studio Bridge still maps Play, Record, Rewind and REC-ready directly to your DAW timeline via HUI/MCU.',
          specs: ['TRANSPORT + REC READY', 'HUI / MCU PROTOCOL'],
          dur: 120,
        },
        {
          img: rear,
          fit: 'contain',
          kicker: '24-TRACK SDXC RECORDING',
          headline: 'Uncompressed WAV, straight to media.',
          body: '24 tracks of BWF audio at up to 24-bit / 48 kHz, recorded to SDXC media supporting capacities up to 512 GB.',
          specs: ['24-TRACK BWF WAV', 'SDXC UP TO 512 GB'],
          dur: 120,
        },
        {
          img: rackArray,
          fit: 'contain',
          kicker: 'MIDI I/O · METRONOME CLICK · FOOTSWITCH',
          headline: 'Everything a session needs, nothing it doesn’t.',
          body: 'MIDI In/Out with MTC and Clock, a dedicated click output, dual footswitch control, and local headphone monitoring round out the engine.',
          specs: ['MIDI IN/OUT · MTC · CLOCK', 'DUAL FOOTSWITCH'],
          dur: 120,
        },
      ]}
    />
  );
};

export const SB_4: React.FC<LFSceneProps> = ({accent}) => {
  const f = useCurrentFrame();
  const imgs = LF_PLACEMENTS.SB_4;
  const cw = (LF_CANVAS.w - EDGE_PAD * 2 - 60) / 4;
  return (
    <>
      <div style={{position: 'absolute', left: 0, top: 80, width: LF_CANVAS.w, textAlign: 'center'}}>
        <Kicker color={accent} size={22} style={{justifyContent: 'center', display: 'flex'}}>
          FOUR WAYS TO WIRE IT IN
        </Kicker>
        <Display size={64} color={C.ink} align="center" style={{marginTop: 12}}>
          BUILT AROUND THE DESK YOU ALREADY HAVE.
        </Display>
      </div>
      <div style={{position: 'absolute', left: EDGE_PAD, top: 300, display: 'flex', gap: 20}}>
        {imgs.map((n, i) => {
          const p = pop(f, 20 + i * 10, 17);
          const label = ['LIVE MULTITRACK', 'WITH A DAW', 'DAW-LESS SYSTEM', 'WITH MIC PREAMPS'][i];
          return (
            <div key={n} style={{width: cw, opacity: Math.min(1, p * 1.5), transform: `translateY(${(1 - p) * 18}px)`}}>
              <Photo name={n} box={{l: 0, t: 0, w: cw, h: cw * 1.05}} dur={210} fit="contain" pad={8} radius={14} elev={0.7} />
              <div style={{marginTop: 10, textAlign: 'center', fontFamily: F.mono, fontSize: 17, letterSpacing: 1.3, color: C.inkDim}}>{label}</div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export const SB_5: React.FC<LFSceneProps> = ({dur, accent}) => {
  const f = useCurrentFrame();
  const imgs = LF_PLACEMENTS.SB_5;
  const rackW = 340;
  return (
    <>
      <div style={{position: 'absolute', left: EDGE_PAD, top: 90, width: rackW}}>
        <Kicker color={accent} size={20}>6U RACK-MOUNTABLE</Kicker>
        <RackWire w={rackW} h={420} accent={accent} p={ramp(f, [10, 90], [0, 1])} />
        <div style={{marginTop: 14, fontFamily: F.mono, fontSize: 18, letterSpacing: 1.2, color: C.inkDim}}>
          446.5 × 114.6 × 269.5 mm · 4.5 kg
          <br />6U VIA AK-RMSTBG
        </div>
      </div>
      <div style={{position: 'absolute', left: EDGE_PAD + rackW + 50, top: 90, width: LF_CANVAS.w - EDGE_PAD * 2 - rackW - 50, display: 'flex', flexWrap: 'wrap', gap: 18}}>
        {imgs.map((n, i) => {
          const p = pop(f, 30 + i * 12, 17);
          const cw = (LF_CANVAS.w - EDGE_PAD * 2 - rackW - 50 - 18 * 2) / 3;
          return (
            <div key={n} style={{width: cw, opacity: Math.min(1, p * 1.5), transform: `translateY(${(1 - p) * 16}px)`}}>
              <Photo name={n} box={{l: 0, t: 0, w: cw, h: cw * 0.95}} dur={dur} fit="cover" radius={14} elev={0.7} />
            </div>
          );
        })}
      </div>
    </>
  );
};

export const SB_6: React.FC<LFSceneProps> = ({accent}) => (
  <BrandingBeat accent={accent} nextUp="THE SAME ENGINE — TWO FORM FACTORS" />
);
