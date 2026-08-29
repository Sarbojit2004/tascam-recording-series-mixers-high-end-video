import React from 'react';
import {Img, useCurrentFrame} from 'remotion';
import {ClipCard} from '../Clip';
import {Photo} from '../Photo';
import {Body, Display, Kicker} from '../Type';
import {pop, ramp, EASE_IN_OUT} from '../../lib/anim';
import type {ClipId} from '../../lib/lf-assets';
import {LF_CLIPS, imgSrc} from '../../lib/lf-assets';
import {PRODUCT, type ProductKey} from '../../lib/copy';
import {C, EDGE_PAD, F, LF_CANVAS} from '../../lib/lf-theme';
import {BrandCard} from './BrandCard';

/** Product chapter opener: name, hook, index, hero image, dimensions line. */
export const ChapterHero: React.FC<{
  k: ProductKey;
  index: string;
  accent: string;
  hero: string;
  dims: string;
  blurb: string;
}> = ({k, index, accent, hero, dims, blurb}) => {
  const f = useCurrentFrame();
  const p = PRODUCT[k];
  const s = pop(f, 4, 17);
  const heroG = pop(f, 10, 15);

  return (
    <>
      <div style={{position: 'absolute', left: EDGE_PAD, top: 96, width: 760}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20}}>
          <Kicker color={accent} size={22}>{index}</Kicker>
          <div style={{flex: 1, height: 2, background: `linear-gradient(90deg, ${accent}, ${accent}22)`}} />
        </div>
        <Display
          size={128}
          color={C.ink}
          style={{opacity: Math.min(1, s * 1.6), transform: `translateY(${(1 - s) * 24}px)`, lineHeight: 0.88}}
        >
          {p.name}
        </Display>
        <div
          style={{
            fontFamily: F.display,
            fontWeight: 600,
            fontSize: 46,
            letterSpacing: -0.2,
            color: accent,
            marginTop: 6,
            opacity: ramp(f, [16, 40], [0, 1]),
          }}
        >
          {p.hook}
        </div>
        <Body size={27} color={C.inkSoft} style={{marginTop: 24, maxWidth: 660, opacity: ramp(f, [28, 52], [0, 1])}}>
          {blurb}
        </Body>
        <div
          style={{
            fontFamily: F.mono,
            fontWeight: 500,
            fontSize: 21,
            letterSpacing: 1.4,
            color: C.inkDim,
            marginTop: 18,
            opacity: ramp(f, [36, 58], [0, 1]),
          }}
        >
          {dims}
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 820,
          top: 90,
          width: LF_CANVAS.w - 820 - EDGE_PAD,
          height: LF_CANVAS.h - 180,
          opacity: Math.min(1, heroG * 1.5),
          transform: `translateX(${(1 - heroG) * 34}px)`,
        }}
      >
        <Photo
          name={hero}
          box={{l: 0, t: 0, w: LF_CANVAS.w - 820 - EDGE_PAD, h: LF_CANVAS.h - 180}}
          dur={9999}
          fit="contain"
          pad={16}
          accent={accent}
          elev={1}
          kb={{z: [1.0, 1.035]}}
        />
      </div>
    </>
  );
};

/** The clip-motion beat: a headline, the clip playing at native speed, a
 *  supporting spec line, and a small numeric readout. */
export const ClipMotionBeat: React.FC<{
  id: ClipId;
  accent: string;
  headline: string;
  sub: string;
  motionLabel: string;
}> = ({id, accent, headline, sub, motionLabel}) => {
  const f = useCurrentFrame();
  const s = pop(f, 0, 17);
  const clipW = 1180;
  const clipH = 560;
  const clipL = (LF_CANVAS.w - clipW) / 2;
  const clipT = 300;

  return (
    <>
      <div style={{position: 'absolute', left: 0, top: 84, width: LF_CANVAS.w, textAlign: 'center'}}>
        <Kicker color={accent} size={22}>IN MOTION</Kicker>
        <Display
          size={80}
          color={C.ink}
          align="center"
          style={{marginTop: 12, opacity: Math.min(1, s * 1.6), transform: `translateY(${(1 - s) * 16}px)`}}
        >
          {headline}
        </Display>
      </div>

      <ClipCard id={id} box={{l: clipL, t: clipT, w: clipW, h: clipH}} accent={accent} label={motionLabel} trim={LF_CLIPS[id]} />

      <div style={{position: 'absolute', left: 0, top: clipT + clipH + 34, width: LF_CANVAS.w, textAlign: 'center'}}>
        <div
          style={{
            fontFamily: F.mono,
            fontWeight: 500,
            fontSize: 23,
            letterSpacing: 1.4,
            color: C.inkSoft,
            opacity: ramp(f, [10, 32], [0, 1]),
          }}
        >
          {sub}
        </div>
      </div>
    </>
  );
};

/**
 * A dedicated, prominent branding beat — the fuller treatment that
 * complements the persistent corner strip. Every product chapter includes
 * at least one of these (Section 9's per-chapter requirement).
 */
export const BrandingBeat: React.FC<{accent: string; nextUp?: string; showTascam?: boolean}> = ({
  accent,
  nextUp,
  showTascam = false,
}) => {
  const f = useCurrentFrame();
  const cardW = 900;
  const cardH = 180;

  return (
    <>
      <BrandCard
        brand="shivansh"
        box={{l: (LF_CANVAS.w - cardW) / 2, t: LF_CANVAS.h / 2 - cardH / 2 - (nextUp ? 40 : 0), w: cardW, h: cardH}}
        accent={accent}
      />
      {showTascam ? (
        <BrandCard brand="tascam" box={{l: EDGE_PAD, t: 40, w: 200, h: 72}} accent={accent} delay={8} />
      ) : null}
      {nextUp ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: LF_CANVAS.h / 2 + cardH / 2 - 20,
            width: LF_CANVAS.w,
            textAlign: 'center',
            opacity: ramp(f, [22, 46], [0, 1]),
          }}
        >
          <div
            style={{
              fontFamily: F.ui,
              fontWeight: 700,
              fontSize: 20,
              letterSpacing: 3,
              color: C.inkDim,
            }}
          >
            NEXT — {nextUp}
          </div>
        </div>
      ) : null}
    </>
  );
};

/** Full-screen chapter title card — used for Cold Open text and the two
 *  connective chapters (Workflows, Range Together). */
export const ChapterTitle: React.FC<{
  kicker: string;
  lines: string[];
  accent: string;
  sub?: string;
}> = ({kicker, lines, accent, sub}) => {
  const f = useCurrentFrame();
  const g = pop(f, 4, 16);
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: LF_CANVAS.w, height: LF_CANVAS.h, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{textAlign: 'center', maxWidth: LF_CANVAS.w - EDGE_PAD * 2}}>
        <Kicker color={accent} size={24} style={{justifyContent: 'center', display: 'flex'}}>{kicker}</Kicker>
        <div
          style={{
            marginTop: 20,
            opacity: Math.min(1, g * 1.5),
            transform: `translateY(${(1 - g) * 26}px)`,
          }}
        >
          {lines.map((l, i) => (
            <Display key={i} size={104} color={C.ink} align="center" lh={0.98}>
              {l}
            </Display>
          ))}
        </div>
        {sub ? (
          <Body size={30} color={C.inkSoft} align="center" style={{marginTop: 28, opacity: ramp(f, [30, 56], [0, 1])}}>
            {sub}
          </Body>
        ) : null}
      </div>
    </div>
  );
};

/** Ambient blurred backdrop for chapters without a dominant hero image. */
export const LFBackdrop: React.FC<{name: string; opacity?: number}> = ({name, opacity = 0.16}) => {
  const f = useCurrentFrame();
  const drift = ramp(f, [0, 300], [-16, 16], EASE_IN_OUT);
  return (
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
      <Img
        src={imgSrc(name)}
        style={{
          width: '108%',
          height: '108%',
          objectFit: 'cover',
          filter: 'blur(64px) saturate(0.5) brightness(1.28)',
          opacity,
          transform: `translateX(${drift}px)`,
          display: 'block',
        }}
      />
    </div>
  );
};
