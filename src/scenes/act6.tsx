import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Rule, ScaleLadder} from '../components/Bits';
import {Photo} from '../components/Photo';
import {Body, Display, Kicker, Mono} from '../components/Type';
import {pop, ramp, stag} from '../lib/anim';
import {PLACEMENTS} from '../lib/assets';
import {BRAND, CONTACT, PRICE, PRICE_NOTE} from '../lib/copy';
import {C, F, SAFE} from '../lib/theme';
import {Shell, SceneProps} from './shell';

// ACT 6 — the range together, then the commercial close.

/** S22 — the shared engine, stated once, with the two flagships side by side. */
export const S22: React.FC<SceneProps> = ({dur, accent}) => {
  const f = useCurrentFrame();
  const [vs] = PLACEMENTS.S22.primary;
  const s = pop(f, 2, 18);
  return (
    <Shell id="S22" dur={dur} backdrop={vs} backdropOpacity={0.2}>
      <Kicker color={C.inkDim}>SAME ENGINE · DIFFERENT ARCHITECTURE</Kicker>
      <Display
        size={96}
        color={C.ink}
        style={{
          marginTop: 12,
          opacity: Math.min(1, s * 1.6),
          transform: `translateY(${(1 - s) * 18}px)`,
        }}
      >
        PICK THE SURFACE.
        <br />
        <span style={{color: C.m2400}}>KEEP THE ENGINE.</span>
      </Display>

      <Photo
        name={vs}
        box={{l: 0, t: 316, w: SAFE.w, h: 396}}
        dur={dur}
        fit="contain"
        pad={10}
        accent={accent}
        kb={{z: [1.0, 1.05]}}
      />

      <div style={{position: 'absolute', left: 0, top: 748, width: SAFE.w}}>
        <ScaleLadder
          w={SAFE.w}
          h={222}
          p={ramp(f, [8, 54], [0, 1])}
          values={[
            {label: 'MODEL 12', v: 12, color: C.m12},
            {label: 'MODEL 16', v: 16, color: C.m16},
            {label: 'MODEL 24', v: 24, color: C.m24},
            {label: 'MODEL 2400', v: 24, color: C.m2400},
            {label: 'STUDIO BRIDGE', v: 24, color: C.sb},
          ]}
        />
        <Mono size={19} color={C.inkDim} style={{marginTop: 10}}>
          TRACKS RECORDED TO SD / SDXC
        </Mono>
      </div>

      <div style={{position: 'absolute', left: 0, top: 1064, width: SAFE.w}}>
        <Rule w={SAFE.w} accent={accent} p={ramp(f, [30, 70], [0, 1])} thickness={2} />
        <Body size={29} color={C.inkSoft} style={{marginTop: 16}}>
          Four consoles that scale with the room — and one 6U engine for the
          desk that is already in it.
        </Body>
      </div>
    </Shell>
  );
};

/** S23 — all five prices, once, unambiguously, inside the safe band. */
const ROWS = [
  {k: 'm12' as const, c: C.m12},
  {k: 'm16' as const, c: C.m16},
  {k: 'm24' as const, c: C.m24},
  {k: 'm2400' as const, c: C.m2400},
  {k: 'sb' as const, c: C.sb},
];

export const S23: React.FC<SceneProps> = ({dur, accent}) => {
  const f = useCurrentFrame();
  const rowH = 148;
  const gap = 13;
  return (
    <Shell id="S23" dur={dur} backdrop="m2400-07" backdropOpacity={0.14}>
      <Kicker color={accent}>{BRAND.designation}</Kicker>
      <Display size={112} color={C.ink} style={{marginTop: 10}}>
        THE FULL RANGE.
      </Display>
      <Mono size={22} color={C.inkDim} tracking={2.4} style={{marginTop: 8}}>
        {PRICE_NOTE}
      </Mono>

      {ROWS.map((r, i) => {
        const p = PRICE[r.k];
        const s = pop(f, stag(i, 8, 12), 17);
        const top = 296 + i * (rowH + gap);
        return (
          <div
            key={r.k}
            style={{
              position: 'absolute',
              left: 0,
              top,
              width: SAFE.w,
              height: rowH,
              borderRadius: 16,
              background: C.card,
              border: `1px solid ${C.cardEdge}`,
              borderLeft: `6px solid ${r.c}`,
              boxShadow: '0 14px 34px -18px rgba(20,26,34,0.30)',
              opacity: Math.min(1, s * 1.5),
              transform: `translateX(${(1 - s) * -30}px)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 30px 0 26px',
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: F.ui,
                  fontWeight: 700,
                  fontSize: 17,
                  letterSpacing: 3,
                  color: r.c,
                }}
              >
                TASCAM
              </div>
              <div
                style={{
                  fontFamily: F.display,
                  fontWeight: 800,
                  fontSize: 62,
                  letterSpacing: -0.4,
                  color: C.ink,
                  lineHeight: 1.02,
                }}
              >
                {p.name}
              </div>
            </div>
            <div style={{textAlign: 'right'}}>
              <div
                style={{
                  fontFamily: F.display,
                  fontWeight: 800,
                  fontSize: 70,
                  letterSpacing: -1,
                  color: C.gold,
                  lineHeight: 1,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                ₹{p.value}
              </div>
              <div
                style={{
                  fontFamily: F.mono,
                  fontSize: 15,
                  letterSpacing: 1.8,
                  color: C.inkDim,
                  marginTop: 5,
                }}
              >
                {PRICE_NOTE}
              </div>
            </div>
          </div>
        );
      })}

      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 1108,
          width: SAFE.w,
          opacity: ramp(f, [64, 92], [0, 1]),
        }}
      >
        <Rule w={SAFE.w} accent={C.gold} p={ramp(f, [64, 104], [0, 1])} thickness={3} />
        <div
          style={{
            fontFamily: F.display,
            fontWeight: 800,
            fontSize: 58,
            letterSpacing: -0.3,
            color: C.ink,
            marginTop: 14,
          }}
        >
          {BRAND.cta} — <span style={{color: C.gold}}>{BRAND.ctaSub}</span>
        </div>
      </div>
    </Shell>
  );
};

/** S24 — the close. Contact detail is critical copy, so it all sits inboard. */
const SOCIALS: {label: string; value: string}[] = [
  {label: 'INSTAGRAM', value: CONTACT.ig},
  {label: 'YOUTUBE', value: CONTACT.yt},
  {label: 'FACEBOOK', value: CONTACT.fb},
  {label: 'LINKEDIN', value: CONTACT.li},
  {label: 'THREADS', value: CONTACT.th},
  {label: 'X', value: CONTACT.x},
];

export const S24: React.FC<SceneProps> = ({dur, accent}) => {
  const f = useCurrentFrame();
  const s = pop(f, 2, 18);
  return (
    <Shell id="S24" dur={dur} backdrop="m24-06" backdropOpacity={0.12}>
      <Kicker color={accent}>{BRAND.designation}</Kicker>
      <Display
        size={92}
        color={C.ink}
        style={{
          marginTop: 10,
          opacity: Math.min(1, s * 1.6),
          transform: `translateY(${(1 - s) * 16}px)`,
        }}
      >
        {BRAND.partner}
      </Display>
      <div
        style={{
          fontFamily: F.display,
          fontWeight: 800,
          fontSize: 64,
          letterSpacing: -0.4,
          color: C.gold,
          marginTop: 6,
        }}
      >
        {BRAND.cta} — {BRAND.ctaSub}
      </div>

      <div style={{position: 'absolute', left: 0, top: 292, width: SAFE.w}}>
        <Rule w={SAFE.w} accent={C.gold} p={ramp(f, [6, 40], [0, 1])} thickness={3} />
      </div>

      {/* phones */}
      <div style={{position: 'absolute', left: 0, top: 328, width: SAFE.w, display: 'flex', gap: 14}}>
        {CONTACT.phones.map((p, i) => {
          const g = pop(f, stag(i, 6, 10), 17);
          return (
            <div
              key={p}
              style={{
                flex: 1,
                padding: '18px 8px',
                borderRadius: 12,
                background: C.card,
                border: `1px solid ${C.cardEdge}`,
                borderTop: `4px solid ${C.gold}`,
                textAlign: 'center',
                opacity: Math.min(1, g * 1.5),
                transform: `translateY(${(1 - g) * 14}px)`,
                boxShadow: '0 12px 28px -16px rgba(20,26,34,0.3)',
              }}
            >
              <div
                style={{
                  fontFamily: F.mono,
                  fontWeight: 700,
                  fontSize: 30,
                  letterSpacing: 0.2,
                  color: C.ink,
                }}
              >
                {p}
              </div>
            </div>
          );
        })}
      </div>

      {/* primary links */}
      <div style={{position: 'absolute', left: 0, top: 468, width: SAFE.w}}>
        {[
          {label: 'WEBSITE', value: CONTACT.web},
          {label: 'ALL LINKS', value: CONTACT.hub},
          {label: 'WHATSAPP CHANNEL', value: CONTACT.waChannel},
        ].map((r, i) => (
          <div
            key={r.label}
            style={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'space-between',
              padding: '13px 0',
              borderBottom: `1px solid ${C.hair}`,
              opacity: ramp(f, [14 + i * 5, 30 + i * 5], [0, 1]),
            }}
          >
            <span
              style={{
                fontFamily: F.ui,
                fontWeight: 700,
                fontSize: 18,
                letterSpacing: 2.6,
                color: C.inkDim,
              }}
            >
              {r.label}
            </span>
            <span
              style={{
                fontFamily: F.mono,
                fontWeight: 600,
                fontSize: 24,
                color: C.ink,
              }}
            >
              {r.value}
            </span>
          </div>
        ))}
      </div>

      {/* socials */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 700,
          width: SAFE.w,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 11,
        }}
      >
        {SOCIALS.map((r, i) => (
          <div
            key={r.label}
            style={{
              padding: '11px 15px',
              borderRadius: 10,
              background: C.card,
              border: `1px solid ${C.cardEdge}`,
              opacity: ramp(f, [22 + i * 3, 38 + i * 3], [0, 1]),
            }}
          >
            <div
              style={{
                fontFamily: F.ui,
                fontWeight: 700,
                fontSize: 15,
                letterSpacing: 2.4,
                color: accent,
              }}
            >
              {r.label}
            </div>
            <div
              style={{
                fontFamily: F.mono,
                fontSize: 19,
                color: C.inkSoft,
                marginTop: 3,
              }}
            >
              {r.value}
            </div>
          </div>
        ))}
      </div>

      {/* address */}
      <div style={{position: 'absolute', left: 0, top: 1010, width: SAFE.w}}>
        <Rule w={SAFE.w} accent={C.gold} p={ramp(f, [40, 78], [0, 1])} thickness={2} />
        <div style={{marginTop: 16, opacity: ramp(f, [42, 66], [0, 1])}}>
          {CONTACT.addressLines.map((l, i) => (
            <div
              key={l}
              style={{
                fontFamily: F.ui,
                fontWeight: i === 0 ? 700 : 500,
                fontSize: i === 0 ? 27 : 24,
                lineHeight: 1.36,
                color: i === 0 ? C.ink : C.inkSoft,
              }}
            >
              {l}
            </div>
          ))}
        </div>
        <Mono size={19} color={C.inkDim} tracking={2.2} style={{marginTop: 14}}>
          TASCAM MODEL 12 · MODEL 16 · MODEL 24 · MODEL 2400 · STUDIO BRIDGE
        </Mono>
      </div>
    </Shell>
  );
};
