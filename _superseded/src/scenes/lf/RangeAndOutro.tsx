import React from 'react';
import {useCurrentFrame} from 'remotion';
import {ScaleLadder} from '../../components/Bits';
import {BrandCard} from '../../components/lf/BrandCard';
import {Photo} from '../../components/Photo';
import {Body, Kicker, Display} from '../../components/Type';
import {pop, ramp, stag} from '../../lib/anim';
import {BRAND, CONTACT, PRICE, PRICE_NOTE, type ProductKey} from '../../lib/copy';
import {LF_PLACEMENTS} from '../../lib/lf-assets';
import {C, EDGE_PAD, F, LF_CANVAS} from '../../lib/lf-theme';
import type {LFSceneProps} from './ColdOpenAndFamily';

/** RT1 — "same engine, different form factor": the Model 2400 and Studio
 *  Bridge relationship, per the creative brief's Section 2. */
export const RT1: React.FC<LFSceneProps> = ({accent}) => {
  const f = useCurrentFrame();
  const [vs] = LF_PLACEMENTS.RT1;
  const s = pop(f, 4, 17);
  return (
    <>
      <BrandCard brand="tascam" box={{l: EDGE_PAD, t: 30, w: 190, h: 68}} accent={accent} delay={4} />

      <div style={{position: 'absolute', left: 0, top: 76, width: LF_CANVAS.w, textAlign: 'center'}}>
        <Kicker color={C.inkDim} size={22} style={{justifyContent: 'center', display: 'flex'}}>
          SAME ENGINE · DIFFERENT ARCHITECTURE
        </Kicker>
        <Display
          size={78}
          color={C.ink}
          align="center"
          style={{marginTop: 12, opacity: Math.min(1, s * 1.5), transform: `translateY(${(1 - s) * 18}px)`}}
        >
          PICK THE SURFACE. <span style={{color: C.m2400}}>KEEP THE ENGINE.</span>
        </Display>
      </div>

      <Photo name={vs} box={{l: (LF_CANVAS.w - 1240) / 2, t: 250, w: 1240, h: 480}} dur={420} fit="contain" pad={16} accent={accent} elev={1} />

      <div style={{position: 'absolute', left: EDGE_PAD, top: 780, width: LF_CANVAS.w - EDGE_PAD * 2, opacity: ramp(f, [40, 70], [0, 1])}}>
        <ScaleLadder
          w={LF_CANVAS.w - EDGE_PAD * 2}
          h={190}
          p={ramp(f, [30, 90], [0, 1])}
          values={[
            {label: 'MODEL 12', v: 12, color: C.m12},
            {label: 'MODEL 16', v: 16, color: C.m16},
            {label: 'MODEL 24', v: 24, color: C.m24},
            {label: 'MODEL 2400', v: 24, color: C.m2400},
            {label: 'STUDIO BRIDGE', v: 24, color: C.sb},
          ]}
        />
      </div>
    </>
  );
};

/** PR1 — the five-price recap. */
const ROWS: {k: ProductKey; color: string}[] = [
  {k: 'm12', color: C.m12}, {k: 'm16', color: C.m16}, {k: 'm24', color: C.m24},
  {k: 'm2400', color: C.m2400}, {k: 'sb', color: C.sb},
];

export const PR1: React.FC<LFSceneProps> = ({accent}) => {
  const f = useCurrentFrame();
  const colW = (LF_CANVAS.w - EDGE_PAD * 2 - 40 * 4) / 5;
  return (
    <>
      <div style={{position: 'absolute', left: 0, top: 60, width: LF_CANVAS.w, textAlign: 'center'}}>
        <Kicker color={accent} size={22} style={{justifyContent: 'center', display: 'flex'}}>{BRAND.designation}</Kicker>
        <Display size={68} color={C.ink} align="center" style={{marginTop: 10}}>THE FULL RANGE</Display>
        <div style={{fontFamily: F.mono, fontSize: 19, letterSpacing: 2, color: C.inkDim, marginTop: 6}}>{PRICE_NOTE}</div>
      </div>
      <div style={{position: 'absolute', left: EDGE_PAD, top: 260, display: 'flex', gap: 40}}>
        {ROWS.map((r, i) => {
          const p = PRICE[r.k];
          const s = pop(f, stag(i, 8, 20), 17);
          return (
            <div
              key={r.k}
              style={{
                width: colW,
                borderRadius: 18,
                background: C.card,
                border: `1px solid ${C.cardEdge}`,
                borderTop: `6px solid ${r.color}`,
                boxShadow: '0 18px 40px -22px rgba(20,26,34,0.32)',
                padding: '26px 18px',
                textAlign: 'center',
                opacity: Math.min(1, s * 1.5),
                transform: `translateY(${(1 - s) * 20}px)`,
              }}
            >
              <div style={{fontFamily: F.display, fontWeight: 800, fontSize: 30, color: C.ink, lineHeight: 1.05}}>{p.name}</div>
              <div style={{fontFamily: F.display, fontWeight: 800, fontSize: 40, color: C.gold, marginTop: 14, fontVariantNumeric: 'tabular-nums'}}>
                ₹{p.value}
              </div>
              <div style={{fontFamily: F.mono, fontSize: 14, letterSpacing: 1.4, color: C.inkDim, marginTop: 6}}>{PRICE_NOTE}</div>
            </div>
          );
        })}
      </div>
      <div style={{position: 'absolute', left: 0, top: 780, width: LF_CANVAS.w, textAlign: 'center', opacity: ramp(f, [110, 150], [0, 1])}}>
        <Display size={56} color={C.ink} align="center">
          {BRAND.cta} — <span style={{color: C.gold}}>{BRAND.ctaSub}</span>
        </Display>
      </div>
    </>
  );
};

/** PR2 — full contact/social outro wall. */
const SOCIALS: {label: string; value: string}[] = [
  {label: 'INSTAGRAM', value: CONTACT.ig},
  {label: 'YOUTUBE', value: CONTACT.yt},
  {label: 'FACEBOOK', value: CONTACT.fb},
  {label: 'LINKEDIN', value: CONTACT.li},
  {label: 'THREADS', value: CONTACT.th},
  {label: 'X', value: CONTACT.x},
];

export const PR2: React.FC<LFSceneProps> = ({accent}) => {
  const f = useCurrentFrame();
  const s = pop(f, 2, 17);
  return (
    <>
      <div style={{position: 'absolute', left: EDGE_PAD, top: 70, width: 900}}>
        <Kicker color={accent} size={22}>{BRAND.designation}</Kicker>
        <Display size={72} color={C.ink} style={{marginTop: 10, opacity: Math.min(1, s * 1.5)}}>
          {BRAND.partner}
        </Display>
      </div>

      <div style={{position: 'absolute', left: EDGE_PAD, top: 240, width: 900, display: 'flex', gap: 14}}>
        {CONTACT.phones.map((p, i) => (
          <div
            key={p}
            style={{
              flex: 1,
              padding: '18px 10px',
              borderRadius: 12,
              background: C.card,
              border: `1px solid ${C.cardEdge}`,
              borderTop: `4px solid ${C.gold}`,
              textAlign: 'center',
              opacity: ramp(f, [10 + i * 6, 30 + i * 6], [0, 1]),
            }}
          >
            <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 26, color: C.ink}}>{p}</div>
          </div>
        ))}
      </div>

      <div style={{position: 'absolute', left: EDGE_PAD, top: 360, width: 900}}>
        {[
          {label: 'WEBSITE', value: CONTACT.web},
          {label: 'ALL LINKS', value: CONTACT.hub},
          {label: 'WHATSAPP CHANNEL', value: CONTACT.waChannel},
        ].map((r, i) => (
          <div
            key={r.label}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '13px 0',
              borderBottom: `1px solid ${C.hair}`,
              opacity: ramp(f, [18 + i * 6, 36 + i * 6], [0, 1]),
            }}
          >
            <span style={{fontFamily: F.ui, fontWeight: 700, fontSize: 17, letterSpacing: 2, color: C.inkDim}}>{r.label}</span>
            <span style={{fontFamily: F.mono, fontWeight: 600, fontSize: 21, color: C.ink}}>{r.value}</span>
          </div>
        ))}
      </div>

      <div style={{position: 'absolute', left: EDGE_PAD, top: 620, width: 900}}>
        {CONTACT.addressLines.map((l, i) => (
          <div
            key={l}
            style={{
              fontFamily: F.ui,
              fontWeight: i === 0 ? 700 : 500,
              fontSize: i === 0 ? 24 : 21,
              lineHeight: 1.4,
              color: i === 0 ? C.ink : C.inkSoft,
              opacity: ramp(f, [40, 64], [0, 1]),
            }}
          >
            {l}
          </div>
        ))}
      </div>

      <div style={{position: 'absolute', left: 980, top: 240, width: LF_CANVAS.w - 980 - EDGE_PAD, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14}}>
        {SOCIALS.map((r, i) => (
          <div
            key={r.label}
            style={{
              padding: '16px 20px',
              borderRadius: 12,
              background: C.card,
              border: `1px solid ${C.cardEdge}`,
              opacity: ramp(f, [24 + i * 5, 44 + i * 5], [0, 1]),
            }}
          >
            <div style={{fontFamily: F.ui, fontWeight: 700, fontSize: 16, letterSpacing: 2.4, color: accent}}>{r.label}</div>
            <div style={{fontFamily: F.mono, fontSize: 21, color: C.inkSoft, marginTop: 5}}>{r.value}</div>
          </div>
        ))}
      </div>

      <BrandCard brand="tascam" box={{l: 980, t: 700, w: LF_CANVAS.w - 980 - EDGE_PAD, h: 160}} accent={accent} delay={60} />
    </>
  );
};

/** PR3 — closing card, both wordmarks together. */
export const PR3: React.FC<LFSceneProps> = ({accent}) => {
  const f = useCurrentFrame();
  const cardW = 420;
  const cardH = 150;
  const gap = 40;
  const groupL = LF_CANVAS.w / 2 - (cardW * 2 + gap) / 2;
  return (
    <>
      <BrandCard brand="tascam" box={{l: groupL, t: 330, w: cardW, h: cardH}} accent={accent} />
      <BrandCard brand="shivansh" box={{l: groupL + cardW + gap, t: 330, w: cardW, h: cardH}} accent={accent} delay={12} />
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 560,
          width: LF_CANVAS.w,
          textAlign: 'center',
          opacity: Math.min(1, ramp(f, [40, 70], [0, 1]) * 1.4),
        }}
      >
        <Body size={26} color={C.inkSoft} align="center">
          Thank you for watching.
        </Body>
      </div>
    </>
  );
};
