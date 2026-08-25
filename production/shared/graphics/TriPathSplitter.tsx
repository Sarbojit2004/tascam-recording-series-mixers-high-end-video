/**
 * STAGE 6, CONCEPT 1 — THE TRI-PATH SPLITTER.
 *
 * "A single, glowing volumetric line representing an incoming analog audio
 *  signal enters the physical XLR input. Upon reaching the internal
 *  preamplifier circuit - indicated by a crisp wireframe schematic overlay -
 *  the single line fractures into three distinct, color-coded geometric
 *  streams. The primary stream flows down the physical channel strip to the
 *  fader, representing analog summing. The second stream dives into a
 *  micro-chip representation of the SD card slot, signifying standalone
 *  recording. The third stream transforms into a rapid binary data sequence
 *  routing out the USB port, representing the DAW interface."
 *
 * APPLICABLE TO THE MODEL 12, 16, 24 AND 2400 ONLY. The Studio Bridge has no
 * preamplifier stage to split a signal from and does not participate in the
 * Tri-Path Architecture (Stage 3), so passing it here is a hard error rather
 * than a silent mis-render.
 *
 * The three streams are deliberately drawn SIMULTANEOUSLY from one shared
 * progress value. Stage 3's whole claim is that the engineer "never has to
 * choose"; animating them in sequence would state the opposite.
 *
 * Two layouts, one animation. The landscape flow runs left-to-right; the
 * portrait flow runs top-to-bottom, because a 2.3:1 diagram letterboxed into a
 * 9:16 frame reads as a thin band rather than as an architecture.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLOR, PATH } from "../theme.ts";
import { MONO } from "../fonts.ts";
import { fade, linear } from "../anim.ts";
import { UNITS, type UnitId } from "../spec.ts";

interface Phases {
  feed: number; node: number; split: number; land: number; labels: number; t: number;
}

const Glow: React.FC<{ id: string; w: number; h: number }> = ({ id, w, h }) => (
  <filter id={id} filterUnits="userSpaceOnUse" x={-40} y={-40} width={w} height={h}>
    {/* userSpaceOnUse: a perfectly horizontal or vertical path has a zero-size
        bounding box on one axis, and an objectBoundingBox filter region
        collapses to nothing on it — silently hiding the straight segments. */}
    <feGaussianBlur stdDeviation="5" result="b" />
    <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
  </filter>
);

/* ------------------------------------------------------------- landscape */
const Wide: React.FC<Phases> = ({ feed, node, split, land, labels, t }) => {
  const P = {
    feed: "M 96 320 L 250 320 L 330 320",
    analog: "M 470 320 C 610 320 640 452 760 452 L 1012 452",
    sd: "M 470 320 C 610 320 640 168 760 168 L 1012 168",
    usb: "M 470 320 L 1012 320",
  };
  return (
    <svg viewBox="0 0 1520 660" style={{ width: "93.28%", overflow: "visible" }}>
      <defs><Glow id="tp-glow" w={1600} h={740} /></defs>

      <g opacity={node}>
        <rect x="330" y="236" width="140" height="168" fill="none" stroke={COLOR.rim} strokeWidth="1.4" />
        <text x="400" y="226" textAnchor="middle" fill={COLOR.rimBright} fontFamily={MONO} fontSize="15" letterSpacing="2.4">ULTRA-HDDA</text>
        <path d="M 352 320 L 372 320 M 372 306 L 372 334 M 372 320 L 392 320" stroke={COLOR.rimBright} strokeWidth="1.4" fill="none" />
        <circle cx="412" cy="320" r="15" fill="none" stroke={COLOR.rimBright} strokeWidth="1.4" />
        <path d="M 404 312 L 420 328 M 404 328 L 420 312" stroke={COLOR.rim} strokeWidth="1.1" />
        <path d="M 340 262 L 460 262 M 340 378 L 460 378" stroke={COLOR.line} strokeWidth="1" />
      </g>

      <g filter="url(#tp-glow)">
        <path d={P.feed} pathLength={1} fill="none" stroke={COLOR.ink} strokeWidth="3"
              strokeDasharray={1} strokeDashoffset={1 - feed} strokeLinecap="round" />
      </g>
      <g opacity={fade(t, 0, 0.08)}>
        <circle cx="72" cy="320" r="30" fill="none" stroke={COLOR.rimBright} strokeWidth="1.8" />
        <circle cx="72" cy="306" r="4.6" fill={COLOR.rimBright} />
        <circle cx="61" cy="330" r="4.6" fill={COLOR.rimBright} />
        <circle cx="83" cy="330" r="4.6" fill={COLOR.rimBright} />
        <text x="72" y="382" textAnchor="middle" fill={COLOR.rim} fontFamily={MONO} fontSize="14" letterSpacing="2">XLR</text>
      </g>

      <g filter="url(#tp-glow)">
        {([["analog", PATH.analog], ["sd", PATH.sd], ["usb", PATH.usb]] as const).map(([k, c]) => (
          <path key={k} d={P[k]} pathLength={1} fill="none" stroke={c} strokeWidth="3.2"
                strokeDasharray={1} strokeDashoffset={1 - split} strokeLinecap="round" />
        ))}
      </g>

      <g opacity={land}>
        <rect x="1016" y="404" width="74" height="96" fill="none" stroke={PATH.analog} strokeWidth="1.6" />
        <line x1="1053" y1="416" x2="1053" y2="488" stroke={COLOR.rim} strokeWidth="2" />
        <rect x="1036" y={476 - 48 * land} width="34" height="15" fill={PATH.analog} />
      </g>
      <g opacity={land}>
        <rect x="1016" y="128" width="74" height="80" fill="none" stroke={PATH.sd} strokeWidth="1.6" />
        <path d="M 1030 142 L 1064 142 L 1076 154 L 1076 194 L 1030 194 Z" fill="none" stroke={PATH.sd} strokeWidth="1.4" />
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={1036 + i * 9} y="150" width="5" height="13" fill={PATH.sd}
                opacity={0.45 + 0.55 * Math.abs(Math.sin(t * 22 + i))} />
        ))}
      </g>
      <g opacity={land}>
        <rect x="1016" y="292" width="74" height="56" fill="none" stroke={PATH.usb} strokeWidth="1.6" />
        <path d="M 1032 320 L 1046 320 M 1046 310 L 1046 330 M 1046 320 L 1074 320" stroke={PATH.usb} strokeWidth="1.6" fill="none" />
      </g>
      <g opacity={land * 0.92} fontFamily={MONO} fontSize="15" fill={PATH.usb}>
        {Array.from({ length: 14 }).map((_, i) => (
          <text key={i} x={528 + i * 33} y={300}>{(Math.floor(t * 26) + i * 5) % 3 === 0 ? "1" : "0"}</text>
        ))}
      </g>

      <g opacity={labels} fontFamily={MONO} fontSize="17" letterSpacing="2.2">
        <text x="1112" y="174" fill={PATH.sd}>SD  ·  24-BIT / 48 kHz</text>
        <text x="1112" y="326" fill={PATH.usb}>USB  ·  DAW STREAM</text>
        <text x="1112" y="458" fill={PATH.analog}>ANALOG  ·  ZERO-LATENCY</text>
      </g>
    </svg>
  );
};

/* -------------------------------------------------------------- portrait */
const Tall: React.FC<Phases> = ({ feed, node, split, land, labels, t }) => {
  const P = {
    feed: "M 430 140 L 430 250 L 430 320",
    sd: "M 430 470 C 430 600 170 620 170 760 L 170 852",
    usb: "M 430 470 L 430 852",
    analog: "M 430 470 C 430 600 690 620 690 760 L 690 852",
  };
  return (
    <svg viewBox="0 0 860 1180" style={{ height: "88%", overflow: "visible" }}>
      <defs><Glow id="tp-glow-p" w={960} h={1280} /></defs>

      {/* XLR input at the top of the flow */}
      <g opacity={fade(t, 0, 0.08)}>
        <circle cx="430" cy="86" r="34" fill="none" stroke={COLOR.rimBright} strokeWidth="1.9" />
        <circle cx="430" cy="70" r="5.2" fill={COLOR.rimBright} />
        <circle cx="417" cy="97" r="5.2" fill={COLOR.rimBright} />
        <circle cx="443" cy="97" r="5.2" fill={COLOR.rimBright} />
        <text x="500" y="92" fill={COLOR.rim} fontFamily={MONO} fontSize="19" letterSpacing="2.4">XLR</text>
      </g>

      <g filter="url(#tp-glow-p)">
        <path d={P.feed} pathLength={1} fill="none" stroke={COLOR.ink} strokeWidth="3.4"
              strokeDasharray={1} strokeDashoffset={1 - feed} strokeLinecap="round" />
      </g>

      {/* the preamp node: the fracture point */}
      <g opacity={node}>
        <rect x="326" y="322" width="208" height="150" fill="none" stroke={COLOR.rim} strokeWidth="1.5" />
        <text x="430" y="308" textAnchor="middle" fill={COLOR.rimBright} fontFamily={MONO} fontSize="19" letterSpacing="2.6">ULTRA-HDDA</text>
        <path d="M 356 397 L 380 397 M 380 381 L 380 413 M 380 397 L 404 397" stroke={COLOR.rimBright} strokeWidth="1.5" fill="none" />
        <circle cx="428" cy="397" r="17" fill="none" stroke={COLOR.rimBright} strokeWidth="1.5" />
        <path d="M 419 388 L 437 406 M 419 406 L 437 388" stroke={COLOR.rim} strokeWidth="1.2" />
        <path d="M 470 397 L 504 397" stroke={COLOR.rimBright} strokeWidth="1.5" />
        <path d="M 338 348 L 522 348 M 338 446 L 522 446" stroke={COLOR.line} strokeWidth="1" />
      </g>

      <g filter="url(#tp-glow-p)">
        {([["sd", PATH.sd], ["usb", PATH.usb], ["analog", PATH.analog]] as const).map(([k, c]) => (
          <path key={k} d={P[k]} pathLength={1} fill="none" stroke={c} strokeWidth="3.6"
                strokeDasharray={1} strokeDashoffset={1 - split} strokeLinecap="round" />
        ))}
      </g>

      {/* binary sequence along the USB leg */}
      <g opacity={land * 0.92} fontFamily={MONO} fontSize="17" fill={PATH.usb} textAnchor="middle">
        {Array.from({ length: 8 }).map((_, i) => (
          <text key={i} x={466} y={560 + i * 36}>{(Math.floor(t * 26) + i * 5) % 3 === 0 ? "1" : "0"}</text>
        ))}
      </g>

      {/* three destinations, side by side at the foot of the flow */}
      <g opacity={land}>
        {/* SD media slot */}
        <rect x="106" y="856" width="128" height="104" fill="none" stroke={PATH.sd} strokeWidth="1.8" />
        <path d="M 130 880 L 188 880 L 210 902 L 210 940 L 130 940 Z" fill="none" stroke={PATH.sd} strokeWidth="1.5" />
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={140 + i * 14} y="890" width="8" height="18" fill={PATH.sd}
                opacity={0.45 + 0.55 * Math.abs(Math.sin(t * 22 + i))} />
        ))}
        {/* USB port */}
        <rect x="366" y="856" width="128" height="104" fill="none" stroke={PATH.usb} strokeWidth="1.8" />
        <path d="M 398 908 L 420 908 M 420 892 L 420 924 M 420 908 L 462 908" stroke={PATH.usb} strokeWidth="1.8" fill="none" />
        {/* channel-strip fader */}
        <rect x="626" y="856" width="128" height="104" fill="none" stroke={PATH.analog} strokeWidth="1.8" />
        <line x1="690" y1="872" x2="690" y2="944" stroke={COLOR.rim} strokeWidth="2.4" />
        <rect x="666" y={930 - 48 * land} width="48" height="18" fill={PATH.analog} />
      </g>

      <g opacity={labels} fontFamily={MONO} fontSize="19" letterSpacing="1.6" textAnchor="middle">
        <text x="170" y="1004" fill={PATH.sd}>SD</text>
        <text x="170" y="1036" fill={PATH.sd} fontSize="15" opacity="0.75">24-BIT / 48 kHz</text>
        <text x="430" y="1004" fill={PATH.usb}>USB</text>
        <text x="430" y="1036" fill={PATH.usb} fontSize="15" opacity="0.75">DAW STREAM</text>
        <text x="690" y="1004" fill={PATH.analog}>ANALOG</text>
        <text x="690" y="1036" fill={PATH.analog} fontSize="15" opacity="0.75">ZERO-LATENCY</text>
        <text x="430" y="1112" fill={COLOR.inkDim} fontSize="17" letterSpacing="3.4">SIMULTANEOUS, NOT SEQUENTIAL</text>
      </g>
    </svg>
  );
};

export const TriPathSplitter: React.FC<{
  unit: UnitId; dur: number; scale?: number; portrait?: boolean;
}> = ({ unit, dur, portrait }) => {
  const u = UNITS[unit];
  if (!u.triPath) {
    throw new Error(
      `TriPathSplitter applied to ${u.name}, which does not participate in the ` +
        `Tri-Path Architecture (Stage 3). This graphic is for the four consoles only.`,
    );
  }
  const f = useCurrentFrame();
  const t = dur > 0 ? f / dur : 0;
  const p: Phases = {
    t,
    feed: linear(t, 0, 0.18, 0, 1),
    node: fade(t, 0.16, 0.3),
    split: linear(t, 0.3, 0.62, 0, 1),
    land: fade(t, 0.58, 0.72),
    labels: fade(t, 0.66, 0.8),
  };
  return (
    <AbsoluteFill
      style={{
        alignItems: "center", justifyContent: "center",
        // Clears the beat label, which sits in the top safe band in portrait.
        paddingTop: portrait ? 132 : 0,
      }}
    >
      {portrait ? <Tall {...p} /> : <Wide {...p} />}
    </AbsoluteFill>
  );
};
