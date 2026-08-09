import React from 'react';
import {useCurrentFrame} from 'remotion';
import {LFBackdrop} from '../../components/lf/LFParts';
import {Body, Kicker, Display} from '../../components/Type';
import {pop, ramp, stag} from '../../lib/anim';
import {LF_PLACEMENTS} from '../../lib/lf-assets';
import {C, EDGE_PAD, F, LF_CANVAS} from '../../lib/lf-theme';
import type {LFSceneProps} from './ColdOpenAndFamily';

// A dedicated chapter matching each product to the real context it actually
// serves — per the creative brief's Section 3 customer-psychology research.
// This is the connective tissue between the four Model-series deep dives and
// Studio Bridge's own chapter: "who is this actually for."

const ROWS: {name: string; color: string; context: string; who: string}[] = [
  {name: 'MODEL 12', color: C.m12, context: 'DESKTOP · PODCAST · BEDROOM STUDIO', who: 'The producer who wants one unified desktop brain — not a mixer, an interface, and a controller as three separate boxes.'},
  {name: 'MODEL 16', color: C.m16, context: 'REHEARSAL ROOM · SMALL VENUE', who: 'The engineer who can’t risk a live set on a laptop’s uptime — a true analog path with the take already safe on SD.'},
  {name: 'MODEL 24', color: C.m24, context: 'PROJECT STUDIO · MID-SIZED VENUE', who: 'The studio that’s outgrown a desktop interface and wants the big-board feel, permanently patched in.'},
  {name: 'MODEL 2400', color: C.m2400, context: 'COMMERCIAL TRACKING FACILITY', who: 'The facility running full sessions daily — subgroups, Master Bus processing, and DAW transport, all day, every day.'},
  {name: 'STUDIO BRIDGE', color: C.sb, context: 'ALREADY OWNS A CONSOLE', who: 'The engineer with a console already on the wall, who wants the 24-track engine — without paying for redundant controls.'},
];

export const WF1: React.FC<LFSceneProps> = ({accent}) => {
  const f = useCurrentFrame();
  const [bd] = LF_PLACEMENTS.WF1;
  return (
    <>
      <LFBackdrop name={bd} opacity={0.12} />
      <div style={{position: 'absolute', left: 0, top: 90, width: LF_CANVAS.w, textAlign: 'center'}}>
        <Kicker color={accent} size={22} style={{justifyContent: 'center', display: 'flex'}}>
          WHO USES WHAT
        </Kicker>
        <Display size={76} color={C.ink} align="center" style={{marginTop: 12}}>
          FIVE PRODUCTS. FIVE REAL ROOMS.
        </Display>
      </div>

      <div style={{position: 'absolute', left: EDGE_PAD, top: 260, width: LF_CANVAS.w - EDGE_PAD * 2}}>
        {ROWS.map((r, i) => {
          const s = pop(f, stag(i, 12, 30), 16);
          return (
            <div
              key={r.name}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 26,
                padding: '16px 0',
                borderBottom: i < ROWS.length - 1 ? `1px solid ${C.hair}` : undefined,
                opacity: Math.min(1, s * 1.5),
                transform: `translateX(${(1 - s) * -28}px)`,
              }}
            >
              <div style={{width: 8, height: 8, borderRadius: 99, background: r.color, flex: '0 0 auto'}} />
              <div style={{width: 300, flex: '0 0 auto'}}>
                <div style={{fontFamily: F.display, fontWeight: 800, fontSize: 34, color: C.ink}}>{r.name}</div>
                <div style={{fontFamily: F.mono, fontSize: 16, letterSpacing: 1.4, color: r.color, marginTop: 4}}>{r.context}</div>
              </div>
              <Body size={23} color={C.inkSoft} style={{flex: 1}}>{r.who}</Body>
            </div>
          );
        })}
      </div>
    </>
  );
};

export const WF2: React.FC<LFSceneProps> = ({accent}) => {
  const f = useCurrentFrame();
  const [bd] = LF_PLACEMENTS.WF2;
  const s = pop(f, 4, 17);
  return (
    <>
      <LFBackdrop name={bd} opacity={0.14} />
      <div style={{position: 'absolute', left: 0, top: LF_CANVAS.h / 2 - 130, width: LF_CANVAS.w, textAlign: 'center'}}>
        <Display
          size={72}
          color={C.ink}
          align="center"
          style={{opacity: Math.min(1, s * 1.5), transform: `translateY(${(1 - s) * 20}px)`}}
        >
          THE SHARED THREAD:
          <br />
          <span style={{color: accent}}>NO SCREEN IN THE WAY.</span>
        </Display>
        <Body
          size={28}
          color={C.inkSoft}
          align="center"
          style={{marginTop: 30, maxWidth: 1200, marginLeft: 'auto', marginRight: 'auto', opacity: ramp(f, [40, 70], [0, 1])}}
        >
          Every one of the five restores physical interaction with the audio signal —
          scaled to whatever room you actually work in.
        </Body>
      </div>
    </>
  );
};
