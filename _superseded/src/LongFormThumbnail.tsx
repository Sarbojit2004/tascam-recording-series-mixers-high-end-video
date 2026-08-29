import React from 'react';
import {AbsoluteFill, Img} from 'remotion';
import {Rule} from './components/Bits';
import {BrandCard} from './components/lf/BrandCard';
import {Ground} from './components/lf/LFFrame';
import {imgSrc} from './lib/lf-assets';
import {BRAND, PRICE, PRICE_NOTE} from './lib/copy';
import {loadFonts} from './lib/fonts';
import {C, EDGE_PAD, F, LF_CANVAS} from './lib/lf-theme';

loadFonts();

// Landscape thumbnail, 1920x1080, same light ground and type system as the
// long-form video. Both wordmarks are present (Section 10's requirement) —
// as styled text, per the same no-fabricated-logo reasoning as BrandCard.
//
// BrandCard normally springs in on entrance, which is correct for the video
// but renders as invisible on a still (a single frame at t=0, before the
// spring has moved at all) — both calls here pass animate={false}.

const ROWS = [
  {k: 'm12' as const, img: 'm12-06', c: C.m12, tag: 'DESKTOP HYBRID'},
  {k: 'm16' as const, img: 'm16-00', c: C.m16, tag: 'LIVE TRACKER'},
  {k: 'm24' as const, img: 'm24-06', c: C.m24, tag: 'LARGE FORMAT'},
  {k: 'm2400' as const, img: 'm2400-07', c: C.m2400, tag: 'FLAGSHIP'},
  {k: 'sb' as const, img: 'sb-06', c: C.sb, tag: 'CONTROLLER-LESS · 6U'},
];

export const LongFormThumbnail: React.FC = () => {
  const colW = (LF_CANVAS.w - EDGE_PAD * 2 - 24 * 4) / 5;
  const rowsTop = 452;

  return (
    <AbsoluteFill style={{backgroundColor: C.paper}}>
      <Ground />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(60% 42% at 18% 10%, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 60%)',
        }}
      />

      <div style={{position: 'absolute', left: EDGE_PAD, top: 56, width: 1180}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
          <div style={{width: 9, height: 9, borderRadius: 99, background: C.gold}} />
          <span style={{fontFamily: F.ui, fontWeight: 800, fontSize: 22, letterSpacing: 3.4, color: C.inkSoft}}>
            {BRAND.designation}
          </span>
        </div>
        <div style={{fontFamily: F.display, fontWeight: 800, fontSize: 102, lineHeight: 0.9, letterSpacing: -1.6, color: C.ink, marginTop: 16}}>
          TASCAM MODEL SERIES
          <br />
          <span style={{color: C.m2400}}>&amp; STUDIO BRIDGE</span>
        </div>
        <div
          style={{
            fontFamily: F.ui,
            fontWeight: 500,
            fontSize: 26,
            lineHeight: 1.4,
            color: C.inkSoft,
            marginTop: 22,
            maxWidth: 1000,
          }}
        >
          Four hybrid analog mixers, ascending in scale, and one controller-less
          24-track recording engine — genuine tactile control, standalone SD
          multitrack recording, and seamless DAW integration.
        </div>
      </div>

      <BrandCard brand="tascam" box={{l: LF_CANVAS.w - EDGE_PAD - 300 - 18 - 220, t: 64, w: 220, h: 84}} accent={C.gold} animate={false} />
      <BrandCard brand="shivansh" box={{l: LF_CANVAS.w - EDGE_PAD - 300, t: 64, w: 300, h: 84}} accent={C.gold} animate={false} />

      <div style={{position: 'absolute', left: EDGE_PAD, top: rowsTop - 26, width: LF_CANVAS.w - EDGE_PAD * 2}}>
        <Rule w={LF_CANVAS.w - EDGE_PAD * 2} accent={C.gold} thickness={2} />
      </div>

      <div style={{position: 'absolute', left: EDGE_PAD, top: rowsTop, display: 'flex', gap: 24}}>
        {ROWS.map((r) => {
          const p = PRICE[r.k];
          return (
            <div
              key={r.k}
              style={{
                width: colW,
                borderRadius: 16,
                background: C.card,
                border: `1px solid ${C.cardEdge}`,
                borderTop: `6px solid ${r.c}`,
                boxShadow: '0 16px 36px -20px rgba(20,26,34,0.32)',
                overflow: 'hidden',
              }}
            >
              <div style={{width: '100%', height: colW * 0.62, background: '#FFFFFF'}}>
                <Img src={imgSrc(r.img)} style={{width: '100%', height: '100%', objectFit: 'contain', display: 'block'}} />
              </div>
              <div style={{padding: '14px 16px'}}>
                <div style={{fontFamily: F.ui, fontWeight: 700, fontSize: 14, letterSpacing: 2, color: r.c}}>{r.tag}</div>
                <div style={{fontFamily: F.display, fontWeight: 800, fontSize: 34, color: C.ink, lineHeight: 1.05, marginTop: 2}}>{p.name}</div>
                <div style={{fontFamily: F.display, fontWeight: 800, fontSize: 36, color: C.gold, marginTop: 8, fontVariantNumeric: 'tabular-nums'}}>
                  ₹{p.value}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{position: 'absolute', left: EDGE_PAD, top: 890, width: LF_CANVAS.w - EDGE_PAD * 2}}>
        <Rule w={LF_CANVAS.w - EDGE_PAD * 2} accent={C.gold} thickness={3} />
        <div style={{fontFamily: F.mono, fontSize: 17, letterSpacing: 2, color: C.inkDim, marginTop: 10}}>{PRICE_NOTE}</div>
      </div>

      <div style={{position: 'absolute', left: EDGE_PAD, top: 940, display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', width: LF_CANVAS.w - EDGE_PAD * 2}}>
        <div style={{fontFamily: F.display, fontWeight: 800, fontSize: 60, letterSpacing: -0.5, color: C.ink}}>{BRAND.cta}</div>
        <div style={{fontFamily: F.display, fontWeight: 800, fontSize: 60, letterSpacing: -0.3, color: C.gold}}>{BRAND.ctaSub}</div>
      </div>
    </AbsoluteFill>
  );
};
