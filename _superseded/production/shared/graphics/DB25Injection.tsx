/**
 * STAGE 6, CONCEPT 2 — THE DB25 INJECTION.
 *
 * "Because this unit bypasses the Tri-Path architecture, the visualization
 *  begins with a wide, 24-lane data highway representing the multi-channel
 *  audio originating from an external analog desk. These lanes converge
 *  flawlessly into a high-density DB25 connector. As the signal passes through
 *  the Studio Bridge housing, the motion graphic illustrates the absence of
 *  acoustic alteration. A perfectly flat, uncolored frequency response curve is
 *  overlaid on the signal path, proving that no preamplification or
 *  equalization is applied. This highlights the absolute transparency of the
 *  A/D conversion before the signal exits via USB to the digital workstation."
 *
 * ENGINEERED EXCLUSIVELY FOR THE STUDIO BRIDGE. Applying it to a console is a
 * hard error: the consoles route through preamps and the Tri-Path split, and
 * this graphic asserts the opposite of that.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLOR, PATH } from "../theme.ts";
import { MONO } from "../fonts.ts";
import { fade, linear } from "../anim.ts";
import { UNITS, type UnitId } from "../spec.ts";

const LANES = 24;

interface Phases {
  t: number; lanes: number; converge: number; housing: number;
  curve: number; exit: number; labels: number;
}

/* ------------------------------------------------------------- landscape */
const Wide: React.FC<Phases> = ({ t, lanes, converge, housing, curve, exit, labels }) => {
  const topY = 96, botY = 544, span = botY - topY;
  return (
    <>
      <svg viewBox="0 0 1180 640" style={{ width: "93.28%", overflow: "visible" }}>
        <defs>
          {/* userSpaceOnUse — see TriPathSplitter: the flat response curve is
              a horizontal path and would otherwise be filtered into nothing. */}
          <filter id="db-glow" filterUnits="userSpaceOnUse" x="-40" y="-40" width="1300" height="740">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* --- the external analog desk this grafts onto -------------------- */}
        <g opacity={fade(t, 0, 0.1)}>
          <rect x="24" y={topY - 22} width="86" height={span + 44} fill="none"
                stroke={COLOR.rim} strokeWidth="1.4" />
          <text x="67" y={botY + 42} textAnchor="middle" fill={COLOR.rimBright}
                fontFamily={MONO} fontSize="14" letterSpacing="1.8">EXTERNAL</text>
          <text x="67" y={botY + 64} textAnchor="middle" fill={COLOR.rimBright}
                fontFamily={MONO} fontSize="14" letterSpacing="1.8">ANALOG DESK</text>
        </g>

        {/* --- 24-lane line-level highway, converging on the connector ------ */}
        <g filter="url(#db-glow)">
          {Array.from({ length: LANES }).map((_, i) => {
            const y = topY + (span * i) / (LANES - 1);
            const cy = 320 + (y - 320) * (1 - converge);
            const d = `M 112 ${y} L 380 ${y} C 460 ${y} 470 ${cy} 540 ${cy}`;
            return (
              <path key={i} d={d} pathLength={1} fill="none" stroke={COLOR.rimBright}
                    strokeWidth="1.7" opacity={0.34 + 0.5 * lanes}
                    strokeDasharray={1} strokeDashoffset={1 - lanes} />
            );
          })}
        </g>
        <text x="246" y={topY - 34} textAnchor="middle" fill={COLOR.inkDim}
              fontFamily={MONO} fontSize="15" letterSpacing="2.2" opacity={lanes}>
          24 LANES  ·  LINE LEVEL
        </text>

        {/* --- the DB25 shell: two staggered rows, 13 + 12 pins ------------- */}
        <g opacity={fade(t, 0.24, 0.4)}>
          <path d="M 548 258 L 612 250 L 612 390 L 548 382 Z" fill="none"
                stroke={COLOR.ink} strokeWidth="1.8" />
          {Array.from({ length: 13 }).map((_, i) => (
            <circle key={`a${i}`} cx={562} cy={272 + i * 8.4} r="2.5" fill={COLOR.rimBright}
                    opacity={0.4 + 0.6 * converge} />
          ))}
          {Array.from({ length: 12 }).map((_, i) => (
            <circle key={`b${i}`} cx={580} cy={278 + i * 8.4} r="2.5" fill={COLOR.rimBright}
                    opacity={0.4 + 0.6 * converge} />
          ))}
          <text x="580" y="418" textAnchor="middle" fill={COLOR.amber} fontFamily={MONO}
                fontSize="16" letterSpacing="2">DB25</text>
          <text x="580" y="440" textAnchor="middle" fill={COLOR.rim} fontFamily={MONO}
                fontSize="13" letterSpacing="1.6">AES59-2012</text>
        </g>

        {/* --- the Studio Bridge housing: NO preamp, NO EQ, NO fader -------- */}
        <g opacity={housing}>
          <rect x="628" y="222" width="322" height="196" fill="rgba(16,19,23,0.72)"
                stroke={COLOR.ink} strokeWidth="1.6" />
          <text x="789" y="206" textAnchor="middle" fill={COLOR.inkDim} fontFamily={MONO}
                fontSize="15" letterSpacing="2.6">TRANSPARENT A / D</text>

          {/* the flat, uncoloured response curve — the proof of the claim */}
          <line x1="656" y1="318" x2="922" y2="318" stroke={COLOR.line} strokeWidth="1" />
          <path d={`M 656 318 L ${656 + 266 * curve} 318`} fill="none" stroke={PATH.sd}
                strokeWidth="3" strokeLinecap="round" filter="url(#db-glow)" />
          <text x="656" y="348" fill={COLOR.rim} fontFamily={MONO} fontSize="12" letterSpacing="1.4"
                opacity={curve}>20 Hz</text>
          <text x="922" y="348" textAnchor="end" fill={COLOR.rim} fontFamily={MONO} fontSize="12"
                letterSpacing="1.4" opacity={curve}>20 kHz</text>
          <text x="789" y="292" textAnchor="middle" fill={PATH.sd} fontFamily={MONO} fontSize="14"
                letterSpacing="2" opacity={curve}>0 dB  ·  UNCOLOURED</text>

          {/* what is explicitly absent — stated, not implied */}
          <g opacity={curve * 0.9} fontFamily={MONO} fontSize="12.5" letterSpacing="1.1" fill={COLOR.rim}>
            <text x="789" y="392" textAnchor="middle">NO PREAMP · NO EQ · NO SUMMING BUS</text>
          </g>
        </g>

        {/* --- exit to the workstation ------------------------------------- */}
        <g filter="url(#db-glow)">
          <path d="M 950 318 L 1096 318" pathLength={1} fill="none" stroke={PATH.usb}
                strokeWidth="3" strokeDasharray={1} strokeDashoffset={1 - exit} strokeLinecap="round" />
        </g>
        <g opacity={labels}>
          <rect x="1100" y="292" width="58" height="56" fill="none" stroke={PATH.usb} strokeWidth="1.6" />
          <text x="1129" y="378" textAnchor="middle" fill={PATH.usb} fontFamily={MONO}
                fontSize="14" letterSpacing="1.8">USB</text>
          <text x="1129" y="266" textAnchor="middle" fill={COLOR.inkDim} fontFamily={MONO}
                fontSize="14" letterSpacing="1.8">24 IN / 24 OUT</text>
        </g>
      </svg>
    </>
  );
};

/* -------------------------------------------------------------- portrait */
const LANES_P = 24;
const Tall: React.FC<Phases> = ({ t, lanes, converge, housing, curve, exit, labels }) => {
  const leftX = 96, rightX = 764, spanX = rightX - leftX;
  return (
    <svg viewBox="0 0 860 1240" style={{ height: "88%", overflow: "visible" }}>
      <defs>
        <filter id="db-glow-p" filterUnits="userSpaceOnUse" x={-40} y={-40} width={960} height={1340}>
          <feGaussianBlur stdDeviation="4" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* the external analog desk this grafts onto, at the head of the flow */}
      <g opacity={fade(t, 0, 0.1)}>
        <rect x={leftX - 22} y="52" width={spanX + 44} height="74" fill="none" stroke={COLOR.rim} strokeWidth="1.5" />
        <text x="430" y="38" textAnchor="middle" fill={COLOR.rimBright} fontFamily={MONO} fontSize="19" letterSpacing="2.4">
          EXTERNAL ANALOG DESK
        </text>
      </g>

      {/* 24 line-level lanes descending and converging on the connector */}
      <g filter="url(#db-glow-p)">
        {Array.from({ length: LANES_P }).map((_, i) => {
          const x = leftX + (spanX * i) / (LANES_P - 1);
          const cx = 430 + (x - 430) * (1 - converge);
          const d = `M ${x} 128 L ${x} 330 C ${x} 420 ${cx} 420 ${cx} 508`;
          return (
            <path key={i} d={d} pathLength={1} fill="none" stroke={COLOR.rimBright}
                  strokeWidth="1.8" opacity={0.34 + 0.5 * lanes}
                  strokeDasharray={1} strokeDashoffset={1 - lanes} />
          );
        })}
      </g>
      <text x="430" y="200" textAnchor="middle" fill={COLOR.inkDim} fontFamily={MONO}
            fontSize="19" letterSpacing="2.6" opacity={lanes * 0.9}>
        24 LANES  ·  LINE LEVEL
      </text>

      {/* the DB25 shell: two staggered rows, 13 + 12 pins */}
      <g opacity={fade(t, 0.24, 0.4)}>
        <path d="M 336 516 L 524 502 L 524 588 L 336 574 Z" fill="none" stroke={COLOR.ink} strokeWidth="1.9" />
        {Array.from({ length: 13 }).map((_, i) => (
          <circle key={`a${i}`} cx={358 + i * 12.6} cy={534} r="3" fill={COLOR.rimBright} opacity={0.4 + 0.6 * converge} />
        ))}
        {Array.from({ length: 12 }).map((_, i) => (
          <circle key={`b${i}`} cx={366 + i * 12.6} cy={558} r="3" fill={COLOR.rimBright} opacity={0.4 + 0.6 * converge} />
        ))}
        <text x="596" y="540" fill={COLOR.amber} fontFamily={MONO} fontSize="21" letterSpacing="2">DB25</text>
        <text x="596" y="566" fill={COLOR.rim} fontFamily={MONO} fontSize="15" letterSpacing="1.6">AES59-2012</text>
      </g>

      {/* the housing: NO preamp, NO EQ, NO summing bus */}
      <g opacity={housing}>
        <rect x="126" y="632" width="608" height="286" fill="rgba(16,19,23,0.72)" stroke={COLOR.ink} strokeWidth="1.7" />
        <text x="430" y="614" textAnchor="middle" fill={COLOR.inkDim} fontFamily={MONO} fontSize="19" letterSpacing="2.8">
          TRANSPARENT A / D
        </text>

        {/* the flat, uncoloured response curve — the proof of the claim */}
        <line x1="176" y1="792" x2="684" y2="792" stroke={COLOR.line} strokeWidth="1" />
        <path d={`M 176 792 L ${176 + 508 * curve} 792`} fill="none" stroke={PATH.sd}
              strokeWidth="3.4" strokeLinecap="round" filter="url(#db-glow-p)" />
        <text x="176" y="828" fill={COLOR.rim} fontFamily={MONO} fontSize="15" letterSpacing="1.4" opacity={curve}>20 Hz</text>
        <text x="684" y="828" textAnchor="end" fill={COLOR.rim} fontFamily={MONO} fontSize="15" letterSpacing="1.4" opacity={curve}>20 kHz</text>
        <text x="430" y="760" textAnchor="middle" fill={PATH.sd} fontFamily={MONO} fontSize="19" letterSpacing="2" opacity={curve}>
          0 dB  ·  UNCOLOURED
        </text>
        <text x="430" y="884" textAnchor="middle" fill={COLOR.rim} fontFamily={MONO} fontSize="15"
              letterSpacing="1.3" opacity={curve * 0.9}>
          NO PREAMP · NO EQ · NO SUMMING BUS
        </text>
      </g>

      {/* exit to the workstation */}
      <g filter="url(#db-glow-p)">
        <path d="M 430 918 L 430 1060" pathLength={1} fill="none" stroke={PATH.usb}
              strokeWidth="3.4" strokeDasharray={1} strokeDashoffset={1 - exit} strokeLinecap="round" />
      </g>
      <g opacity={labels}>
        <rect x="366" y="1064" width="128" height="72" fill="none" stroke={PATH.usb} strokeWidth="1.8" />
        <path d="M 396 1100 L 418 1100 M 418 1084 L 418 1116 M 418 1100 L 462 1100" stroke={PATH.usb} strokeWidth="1.8" fill="none" />
        <text x="430" y="1180" textAnchor="middle" fill={PATH.usb} fontFamily={MONO} fontSize="19" letterSpacing="2">
          USB  ·  24 IN / 24 OUT
        </text>
      </g>
    </svg>
  );
};

export const DB25Injection: React.FC<{
  unit: UnitId; dur: number; scale?: number; portrait?: boolean;
}> = ({ unit, dur, portrait }) => {
  if (unit !== "studiobridge") {
    throw new Error(
      `DB25Injection applied to ${UNITS[unit].name}. This graphic is engineered ` +
        `exclusively for the Studio Bridge (Stage 6) and asserts the absence of a ` +
        `preamplification stage, which is false for every console in the range.`,
    );
  }
  const f = useCurrentFrame();
  const t = dur > 0 ? f / dur : 0;
  const p: Phases = {
    t,
    lanes: linear(t, 0.02, 0.34, 0, 1),
    converge: linear(t, 0.28, 0.52, 0, 1),
    housing: fade(t, 0.44, 0.56),
    curve: linear(t, 0.56, 0.78, 0, 1),
    exit: linear(t, 0.72, 0.9, 0, 1),
    labels: fade(t, 0.8, 0.92),
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
