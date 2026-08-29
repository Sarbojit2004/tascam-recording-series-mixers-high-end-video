/**
 * STAGE 6, CONCEPT 3 — THE TIMECODE SYNCHRONIZATION PULSE.
 *
 * "This motion sequence visualizes a rhythmic, expanding ripple effect
 *  emanating from the 5-pin DIN MIDI output of the console. This visual pulse
 *  washes over ghostly, wireframe representations of external drum machines and
 *  synthesizers in the background, snapping their internal step-sequencers into
 *  perfect, frame-accurate alignment with the console's centralized master
 *  clock."
 *
 * SPECIFIC TO THE MODEL 12 AND MODEL 2400 — the only two units in the range
 * with MIDI I/O and MTC generation. The Model 16 and Model 24 explicitly lack
 * MIDI, MTC and HUI/MCU transport (Stage 1, tier 2), so passing either is a
 * hard error rather than a claim the hardware cannot support.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLOR, PATH } from "../theme.ts";
import { MONO } from "../fonts.ts";
import { fade, linear } from "../anim.ts";
import { UNITS, type UnitId } from "../spec.ts";

/**
 * One ghostly wireframe device: a step sequencer waiting on the clock.
 *
 * `drift` is the device's own free-running offset. As `locked` rises the drift
 * is interpolated to zero, so all three devices resolve onto the SAME step
 * index. That convergence is the entire claim of the shot — "snapping their
 * internal step-sequencers into perfect, frame-accurate alignment with the
 * console's centralized master clock" — so it has to actually happen on
 * screen, not merely brighten.
 */
const Device: React.FC<{
  x: number; y: number; steps: number; locked: number; label: string;
  phase: number; drift: number;
}> = ({ x, y, steps, locked, label, phase, drift }) => {
  const effective = phase + drift * (1 - locked);
  const head = ((Math.floor(effective * steps) % steps) + steps) % steps;
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="0" y="0" width={steps * 22 + 18} height="72" fill="none"
            stroke={COLOR.rim} strokeWidth="1.2" opacity={0.45 + 0.55 * locked} />
      <text x="9" y="-12" fill={COLOR.rim} fontFamily={MONO} fontSize="12" letterSpacing="1.8"
            opacity={0.5 + 0.5 * locked}>{label}</text>
      {Array.from({ length: steps }).map((_, i) => {
        const active = i === head;
        return (
          <rect key={i} x={9 + i * 22} y="22" width="15" height="28"
                fill={active ? PATH.analog : "none"}
                stroke={active ? PATH.analog : COLOR.rim}
                strokeWidth="1.1"
                opacity={active ? 0.55 + 0.45 * locked : 0.3} />
        );
      })}
    </g>
  );
};

export const TimecodePulse: React.FC<{
  unit: UnitId; dur: number; scale?: number; portrait?: boolean;
}> = ({ unit, dur, portrait }) => {
  const u = UNITS[unit];
  if (!u.midiClock) {
    throw new Error(
      `TimecodePulse applied to ${u.name}, which has no MIDI I/O and no MTC ` +
        `generation (Stage 8: MIDI "None"). This graphic is for the Model 12 and ` +
        `Model 2400 only.`,
    );
  }

  const f = useCurrentFrame();
  const t = dur > 0 ? f / dur : 0;

  const din = fade(t, 0, 0.1);
  const devices = fade(t, 0.08, 0.24);
  // Ripples emit on a steady beat from the DIN — the master clock made visible.
  const beat = 0.115;
  const emitFrom = 0.2;
  const locked = fade(t, 0.62, 0.76);
  const label = fade(t, 0.78, 0.9);
  const phase = t * 4.6;

  const ripples: number[] = [];
  for (let k = 0; k < 9; k++) {
    const born = emitFrom + k * beat;
    if (t >= born) ripples.push(Math.min(1, (t - born) / (beat * 3.0)));
  }

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingTop: portrait ? 132 : 0 }}>
      <svg
        viewBox={portrait ? "100 -170 920 1265" : "0 0 1120 620"}
        style={portrait ? { height: "86%", overflow: "visible" } : { width: "91.16%", overflow: "visible" }}
      >
        <defs>
          <filter id="tc-glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="4.5" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* ghostly wireframe outboard, waiting on the clock */}
        <g opacity={devices}>
          {portrait ? (
            <>
              <Device x={463} y={556} steps={8} locked={locked} label="DRUM MACHINE" phase={phase} drift={0.37} />
              <Device x={463} y={700} steps={8} locked={locked} label="SEQUENCER"    phase={phase} drift={0.68} />
              <Device x={463} y={844} steps={8} locked={locked} label="SYNTHESIZER"  phase={phase} drift={0.14} />
            </>
          ) : (
            <>
              <Device x={520} y={96}  steps={8} locked={locked} label="DRUM MACHINE" phase={phase} drift={0.37} />
              <Device x={560} y={272} steps={8} locked={locked} label="SEQUENCER"    phase={phase} drift={0.68} />
              <Device x={520} y={448} steps={8} locked={locked} label="SYNTHESIZER"  phase={phase} drift={0.14} />
            </>
          )}
        </g>

        {/* expanding ripples from the DIN, on the master clock's own beat */}
        <g filter="url(#tc-glow)">
          {ripples.map((r, i) => (
            <circle key={i} cx={portrait ? 560 : 188} cy={portrait ? 130 : 310} r={54 + r * 620} fill="none"
                    stroke={PATH.analog} strokeWidth={3.2 * (1 - r * 0.75)}
                    opacity={Math.max(0, 1 - r) ** 1.35 * 0.95} />
          ))}
        </g>

        {/* the 5-pin DIN MIDI output the pulse emanates from */}
        <g opacity={din}>
          {(() => {
            const cx = portrait ? 560 : 188;
            const cy = portrait ? 130 : 310;
            return (
              <>
                <circle cx={cx} cy={cy} r="52" fill={COLOR.void} stroke={COLOR.ink} strokeWidth="2" />
                <circle cx={cx} cy={cy} r="38" fill="none" stroke={COLOR.rim} strokeWidth="1.2" />
                {[-90, -35, 0, 35, 90].map((a, i) => {
                  const rad = ((a - 90) * Math.PI) / 180;
                  return (
                    <circle key={i} cx={cx + Math.cos(rad) * 23} cy={cy + Math.sin(rad) * 23}
                            r="5.4" fill={COLOR.rimBright} />
                  );
                })}
                <text x={cx} y={cy + 86} textAnchor="middle" fill={COLOR.inkDim} fontFamily={MONO}
                      fontSize="17" letterSpacing="2.2">5-PIN DIN  ·  MIDI OUT</text>
                <text x={cx} y={cy - 78} textAnchor="middle" fill={COLOR.amber} fontFamily={MONO}
                      fontSize="18" letterSpacing="2.4">MASTER CLOCK</text>
              </>
            );
          })()}
        </g>

        <g opacity={label}>
          <text x={portrait ? 560 : 560} y={portrait ? 1008 : 596} textAnchor="middle"
                fill={PATH.analog} fontFamily={MONO} fontSize={portrait ? 20 : 17} letterSpacing="3">
            {u.digital.MIDI}
          </text>
          <text x={portrait ? 560 : 560} y={portrait ? 480 : 52} textAnchor="middle"
                fill={COLOR.inkDim} fontFamily={MONO} fontSize={portrait ? 17 : 14}
                letterSpacing="2.6" opacity={locked}>
            FRAME-ACCURATE ALIGNMENT
          </text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
