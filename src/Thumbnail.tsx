import React from 'react';
import {AbsoluteFill, Img} from 'remotion';
import {Rule} from './components/Bits';
import {Ground} from './components/Frame';
import {imgSrc} from './lib/assets';
import {BRAND, PRICE, PRICE_NOTE} from './lib/copy';
import {loadFonts} from './lib/fonts';
import {C, CANVAS, F, ZONE} from './lib/theme';

loadFonts();

// Portrait thumbnail, 1080x1920, same light ground and type system as the reel.
// No logo files anywhere — same exclusion as the video. Five products is a real
// layout problem in portrait, so it is solved as a ledger: one row each, image
// left, identity centre, price right, nothing overlapping anything.

const ROWS = [
  {k: 'm12' as const, img: 'm12-06', c: C.m12, tag: 'DESKTOP HYBRID', spec: '12-TRACK · 10 IN'},
  {k: 'm16' as const, img: 'm16-00', c: C.m16, tag: 'LIVE TRACKER', spec: '16-TRACK · 14 IN'},
  {k: 'm24' as const, img: 'm24-06', c: C.m24, tag: 'LARGE FORMAT', spec: '24-TRACK · 22 IN'},
  {k: 'm2400' as const, img: 'm2400-07', c: C.m2400, tag: 'FLAGSHIP', spec: '24-TRACK · 4 SUBGROUPS'},
  {k: 'sb' as const, img: 'sb-06', c: C.sb, tag: 'CONTROLLER-LESS · 6U', spec: '24-TRACK · DB-25'},
];

const X = ZONE.side;
const W = CANVAS.w - ZONE.side * 2; // 924

/** Ambient bleed for the top/bottom bands — the same two-tier idea the reel
 *  uses: atmosphere where Instagram's own UI sits, nothing to read. */
const AmbientBleed: React.FC<{name: string; top: number; height: number; flip?: boolean}> = ({
  name,
  top,
  height,
  flip = false,
}) => (
  <div style={{position: 'absolute', left: 0, top, width: CANVAS.w, height, overflow: 'hidden'}}>
    <Img
      src={imgSrc(name)}
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        filter: 'blur(38px) saturate(0.5) brightness(1.24)',
        transform: `scale(1.3)${flip ? ' scaleY(-1)' : ''}`,
        opacity: 0.34,
        display: 'block',
      }}
    />
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: flip
          ? `linear-gradient(180deg, ${C.paper} 0%, ${C.paper}E6 18%, ${C.paper}A6 60%, ${C.paper}CC 100%)`
          : `linear-gradient(180deg, ${C.paper}CC 0%, ${C.paper}A6 40%, ${C.paper}E6 82%, ${C.paper} 100%)`,
      }}
    />
  </div>
);

export const Thumbnail: React.FC = () => {
  const rowH = 148;
  const gap = 13;
  const rowsTop = 610;

  return (
    <AbsoluteFill style={{backgroundColor: C.paper}}>
      <Ground />

      <AmbientBleed name="m24-06" top={0} height={ZONE.topAmbient} />
      <AmbientBleed
        name="m2400-07"
        top={ZONE.bottomAmbient}
        height={CANVAS.h - ZONE.bottomAmbient}
        flip
      />

      {/* soft high-key wash so the ground is not a flat plate */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(70% 38% at 22% 12%, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 62%)',
        }}
      />

      {/* ---------------- header ---------------- */}
      <div style={{position: 'absolute', left: X, top: 262, width: W}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
          <div style={{width: 9, height: 9, borderRadius: 99, background: C.gold}} />
          <span
            style={{
              fontFamily: F.ui,
              fontWeight: 800,
              fontSize: 23,
              letterSpacing: 3.6,
              color: C.inkSoft,
            }}
          >
            {BRAND.designation}
          </span>
        </div>

        <div
          style={{
            fontFamily: F.display,
            fontWeight: 800,
            fontSize: 122,
            lineHeight: 0.84,
            letterSpacing: -1.6,
            color: C.ink,
            marginTop: 16,
          }}
        >
          TASCAM
          <br />
          MODEL SERIES
        </div>

        <div
          style={{
            fontFamily: F.display,
            fontWeight: 600,
            fontSize: 44,
            letterSpacing: -0.2,
            color: C.m2400,
            marginTop: 6,
          }}
        >
          &amp; STUDIO BRIDGE
        </div>

        <div style={{marginTop: 20}}>
          <Rule w={W} accent={C.gold} thickness={3} />
        </div>
      </div>

      {/* ---------------- five product rows ---------------- */}
      {ROWS.map((r, i) => {
        const p = PRICE[r.k];
        const top = rowsTop + i * (rowH + gap);
        return (
          <div
            key={r.k}
            style={{
              position: 'absolute',
              left: X,
              top,
              width: W,
              height: rowH,
              borderRadius: 16,
              background: C.card,
              border: `1px solid ${C.cardEdge}`,
              borderLeft: `7px solid ${r.c}`,
              boxShadow: '0 16px 36px -20px rgba(20,26,34,0.32)',
              display: 'flex',
              alignItems: 'center',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: 224,
                height: rowH - 24,
                marginLeft: 16,
                borderRadius: 10,
                overflow: 'hidden',
                background: '#FFFFFF',
                flex: '0 0 auto',
              }}
            >
              <Img
                src={imgSrc(r.img)}
                style={{width: '100%', height: '100%', objectFit: 'contain', display: 'block'}}
              />
            </div>

            <div style={{flex: 1, minWidth: 0, marginLeft: 20}}>
              <div
                style={{
                  fontFamily: F.ui,
                  fontWeight: 700,
                  fontSize: 15,
                  letterSpacing: 2.6,
                  color: r.c,
                }}
              >
                {r.tag}
              </div>
              <div
                style={{
                  fontFamily: F.display,
                  fontWeight: 800,
                  fontSize: 58,
                  letterSpacing: -0.4,
                  color: C.ink,
                  lineHeight: 1.02,
                  whiteSpace: 'nowrap',
                }}
              >
                {p.name}
              </div>
              <div
                style={{
                  fontFamily: F.mono,
                  fontSize: 16,
                  letterSpacing: 1.4,
                  color: C.inkDim,
                  marginTop: 2,
                }}
              >
                {r.spec}
              </div>
            </div>

            <div style={{textAlign: 'right', marginRight: 22, flex: '0 0 auto'}}>
              <div
                style={{
                  fontFamily: F.display,
                  fontWeight: 800,
                  fontSize: 64,
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
                  fontSize: 14,
                  letterSpacing: 1.6,
                  color: C.inkDim,
                  marginTop: 4,
                }}
              >
                {PRICE_NOTE}
              </div>
            </div>
          </div>
        );
      })}

      {/* ---------------- CTA ---------------- */}
      <div style={{position: 'absolute', left: X, top: 1424, width: W}}>
        <Rule w={W} accent={C.gold} thickness={3} />
        <div
          style={{
            marginTop: 18,
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
          }}
        >
          <div
            style={{
              fontFamily: F.display,
              fontWeight: 800,
              fontSize: 68,
              letterSpacing: -0.6,
              color: C.ink,
              lineHeight: 1,
            }}
          >
            {BRAND.cta}
          </div>
          <div
            style={{
              fontFamily: F.display,
              fontWeight: 800,
              fontSize: 68,
              letterSpacing: -0.4,
              color: C.gold,
              lineHeight: 1,
            }}
          >
            {BRAND.ctaSub}
          </div>
        </div>
        <div
          style={{
            fontFamily: F.ui,
            fontWeight: 700,
            fontSize: 26,
            letterSpacing: 3,
            color: C.inkSoft,
            marginTop: 12,
          }}
        >
          {BRAND.partner}
        </div>
      </div>
    </AbsoluteFill>
  );
};
