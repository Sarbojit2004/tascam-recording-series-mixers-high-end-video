/**
 * THE THREE STAGE 6 DEMONSTRATIVE ANIMATIONS.
 *
 * Section 2 carries forward only the signal-flow demonstratives, and only as
 * CONCEPT: re-skinned onto the light ground and pushed further than a diagram
 * that merely draws a line. Each one below actually demonstrates its claim —
 * the tri-path emits a packet that arrives at three destinations on the same
 * frame, the DB25 seats and then registers twenty-four channels a side, and
 * the timecode pulse runs a readout that visibly locks.
 *
 * SCOPE IS ENFORCED, NOT DOCUMENTED. Section 6 scopes each concept to the
 * units it actually applies to, so each component throws on a unit outside its
 * scope rather than rendering a claim the hardware does not support:
 *
 *   TriPathSplitter   4 consoles (UNITS[u].triPath) — throws on Studio Bridge,
 *                     which has no preamp stage to split from.
 *   DB25Injection     Studio Bridge only — throws on any console.
 *   TimecodePulse     Model 12 and Model 2400 only (UNITS[u].timecode).
 *
 * Every figure on screen arrives through specValue(), so an UNVERIFIED value
 * cannot reach the frame.
 */
import React from "react";
import { useCurrentFrame } from "remotion";
import { COLORS } from "./theme.ts";
import { headline, micro, spec } from "./fonts.ts";
import { EASE_OUT, ramp } from "./anim.ts";
import { UNITS, specValue, type UnitId } from "./spec.ts";

// ---------------------------------------------------------------------------
// Shared drawing helpers
// ---------------------------------------------------------------------------

/** A rounded node card in the flow. */
const Node: React.FC<{
  x: number; y: number; w: number; h: number;
  title: string; sub?: string; color?: string;
  delay?: number; f: number; emphasis?: number;
}> = ({ x, y, w, h, title, sub, color = COLORS.ink, delay = 0, f, emphasis = 0 }) => {
  const p = ramp(f, delay, 20);
  const lift = 1 + emphasis * 0.028;
  return (
    <g opacity={p} transform={`translate(${x + w / 2} ${y + h / 2}) scale(${lift}) translate(${-x - w / 2} ${-y - h / 2})`}>
      <rect
        x={x} y={y} width={w} height={h} rx={14}
        fill={COLORS.paperLift}
        stroke={color}
        strokeWidth={1.4 + emphasis * 1.6}
        opacity={0.32 + 0.68 * p}
      />
      <text
        x={x + w / 2} y={y + (sub ? h * 0.44 : h * 0.60)}
        textAnchor="middle"
        style={{ ...micro(15, 700, "0.14em"), fill: color } as React.CSSProperties}
      >
        {title}
      </text>
      {sub ? (
        <text
          x={x + w / 2} y={y + h * 0.74}
          textAnchor="middle"
          style={{ ...spec(15, 600, "0.02em"), fill: COLORS.slate } as React.CSSProperties}
        >
          {sub}
        </text>
      ) : null}
    </g>
  );
};

/**
 * AN ORTHOGONAL POLYLINE, drawn progressively, with a packet riding it.
 *
 * Geometry is solved in pure JS from the point list rather than by asking the
 * DOM for `getTotalLength()`. A measured path would need an effect and a state
 * write, and a render that depends on an effect having already run is exactly
 * the kind of thing that renders correctly in the Studio and intermittently
 * blank in a headless frame-by-frame render. Orthogonal segment lengths are
 * trivial to sum, so nothing needs measuring.
 */
type Pt = { x: number; y: number };

function polyLen(pts: Pt[]): number[] {
  const seg: number[] = [];
  for (let i = 1; i < pts.length; i++) {
    seg.push(Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y));
  }
  return seg;
}

function pointAt(pts: Pt[], t: number): Pt {
  const seg = polyLen(pts);
  const total = seg.reduce((a, b) => a + b, 0);
  let want = Math.max(0, Math.min(1, t)) * total;
  for (let i = 0; i < seg.length; i++) {
    if (want <= seg[i] || i === seg.length - 1) {
      const k = seg[i] === 0 ? 0 : want / seg[i];
      return {
        x: pts[i].x + (pts[i + 1].x - pts[i].x) * k,
        y: pts[i].y + (pts[i + 1].y - pts[i].y) * k,
      };
    }
    want -= seg[i];
  }
  return pts[pts.length - 1];
}

const dOf = (pts: Pt[]) =>
  pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

const Path: React.FC<{
  pts: Pt[]; color: string; draw: number; width?: number;
  packet?: number | null; dash?: boolean;
}> = ({ pts, color, draw, width = 3, packet = null, dash = false }) => {
  const total = polyLen(pts).reduce((a, b) => a + b, 0);
  const pt = packet === null ? null : pointAt(pts, packet);
  return (
    <g>
      <path
        d={dOf(pts)} fill="none" stroke={color} strokeWidth={width}
        strokeLinecap="round" strokeLinejoin="round"
        strokeDasharray={dash ? "1 10" : total}
        strokeDashoffset={dash ? 0 : total * (1 - draw)}
        opacity={dash ? 0.34 : 0.9}
      />
      {pt ? (
        <>
          <circle cx={pt.x} cy={pt.y} r={11} fill={color} opacity={0.16} />
          <circle cx={pt.x} cy={pt.y} r={5.2} fill={color} />
        </>
      ) : null}
    </g>
  );
};

// ---------------------------------------------------------------------------
// 1. THE TRI-PATH SPLITTER — four consoles only
//
// One preamp output, three simultaneous destinations. The demonstration is the
// SIMULTANEITY: a packet leaves the preamp, reaches the split, and the three
// copies advance in lockstep so all three arrive on the same frame. A diagram
// asserts the split; this shows it arriving three times at once.
// ---------------------------------------------------------------------------
export const TriPathSplitter: React.FC<{
  unit: UnitId; x: number; y: number; w: number; h: number; delay?: number;
}> = ({ unit, x, y, w, h, delay = 0 }) => {
  const u = UNITS[unit];
  if (!u.triPath) {
    throw new Error(
      `TriPathSplitter: ${u.name} is outside this concept's scope. Section 6 ` +
      `restricts the Tri-Path Architecture to the four consoles — the Studio ` +
      `Bridge is a direct line-level A/D with no preamp stage to split from.`,
    );
  }

  const f = useCurrentFrame() - delay;

  const colW = Math.round(w * 0.215);
  const nodeH = 92;
  const srcX = x;
  const preX = x + Math.round(w * 0.255);
  const dstX = x + w - colW;
  const midY = y + Math.round(h / 2) - nodeH / 2;
  const gapY = Math.round(h * 0.355);
  const rows = [midY - gapY, midY, midY + gapY];

  const splitX = preX + colW + Math.round((dstX - preX - colW) * 0.36);

  const trunkY = midY + nodeH / 2;
  // The trunk is drawn ONCE, in the preamp's own accent, and the branches start
  // at the split point rather than at the preamp. Running all three branches
  // back to the preamp would stack three coloured strokes on the same trunk
  // segment and whichever drew last would own it — which is the opposite of the
  // point, since the trunk is precisely the part that has NOT split yet.
  const trunk: Pt[] = [{ x: preX + colW, y: trunkY }, { x: splitX, y: trunkY }];
  const branchTo = (row: number): Pt[] => [
    { x: splitX, y: trunkY },
    { x: splitX, y: rows[row] + nodeH / 2 },
    { x: dstX, y: rows[row] + nodeH / 2 },
  ];

  // Every label below is derived from a VERIFIED Stage 8 string, never typed
  // in by hand: the track count and the USB channel count come straight out of
  // the unit's own digital table.
  const sdTracks = specValue(unit, "Multitrack SD Recorder").split(" ")[0];
  const usbIo = specValue(unit, "USB Audio Interface").split(",")[0];

  const paths = [
    { pts: branchTo(0), color: COLORS.pathAnalog, title: "ANALOG MIX BUS", sub: "MAIN OUT" },
    { pts: branchTo(1), color: COLORS.pathSD, title: "SD MULTITRACK", sub: `${sdTracks} TRACKS` },
    { pts: branchTo(2), color: COLORS.pathUSB, title: "USB INTERFACE", sub: usbIo },
  ];

  // Trunk draws, then the three branches draw together, then packets cycle.
  const trunkDraw = ramp(f, 22, 26);
  const branch = ramp(f, 46, 30);
  const CYCLE = 54;
  const cycleStart = 82;
  const t = f - cycleStart;
  const phase = t >= 0 ? (t % CYCLE) / CYCLE : null;

  // ONE journey parameter for the whole packet: the first SPLIT_AT of it runs
  // the trunk, the rest runs all three branches. The three branch packets read
  // off the same number, so simultaneity is structural — not three curves that
  // happen to agree — and the split is visible as the moment one packet becomes
  // three rather than as a static fork in a drawing.
  const SPLIT_AT = 0.34;
  const journey = phase === null ? null : Math.min(1, EASE_OUT(phase) * 1.16);
  const onTrunk = journey !== null && journey < SPLIT_AT;
  const trunkPacket = journey === null ? null
    : onTrunk ? journey / SPLIT_AT : null;
  const branchPacket = journey === null || onTrunk ? null
    : (journey - SPLIT_AT) / (1 - SPLIT_AT);
  const splitting = journey !== null && Math.abs(journey - SPLIT_AT) < 0.06;
  const arriving = branchPacket !== null && branchPacket > 0.97;

  return (
    <svg width={w + 4} height={h + 4} viewBox={`${x - 2} ${y - 2} ${w + 4} ${h + 4}`}
         style={{ position: "absolute", left: x - 2, top: y - 2, overflow: "visible" }}>
      {/* source -> preamp */}
      <Path pts={[{ x: srcX + colW, y: trunkY }, { x: preX, y: trunkY }]}
            color={COLORS.slateDim} draw={ramp(f, 12, 20)} width={2.4}
            packet={phase === null ? null : Math.min(1, phase * 3.4)} />

      {/* the undivided trunk — one signal, still one */}
      <Path pts={trunk} color={COLORS.accent} draw={trunkDraw} width={3.4}
            packet={trunkPacket} />

      {/* the three branches, all riding one travel parameter */}
      {paths.map((p, i) => (
        <React.Fragment key={i}>
          <Path pts={p.pts} color={p.color} draw={branch} dash />
          <Path pts={p.pts} color={p.color} draw={branch} width={3.4}
                packet={branchPacket} />
        </React.Fragment>
      ))}

      {/* the split point itself */}
      <circle cx={splitX} cy={trunkY} r={splitting ? 9.5 : 7.5}
              fill={COLORS.accent} opacity={branch * 0.9} />
      <circle cx={splitX} cy={trunkY} r={9.5 + 26 * (branchPacket ?? 0)}
              fill="none" stroke={COLORS.accent} strokeWidth={2}
              opacity={branchPacket === null ? 0 : 0.5 * (1 - branchPacket)} />

      <Node f={f} x={srcX} y={midY} w={colW} h={nodeH} delay={0}
            title="MIC / LINE IN" sub={specValue(unit, "Input Channels").split(" (")[0] + " CH"}
            color={COLORS.slate} />
      <Node f={f} x={preX} y={midY} w={colW} h={nodeH} delay={10}
            title="ULTRA-HDDA" sub="PREAMP" color={COLORS.accent}
            emphasis={onTrunk ? 1 : 0} />

      {paths.map((p, i) => (
        <Node key={i} f={f} x={dstX} y={rows[i]} w={colW} h={nodeH} delay={40 + i * 5}
              title={p.title} sub={p.sub} color={p.color}
              emphasis={arriving ? 1 : 0} />
      ))}

      <text x={x} y={y - 18} style={{ ...micro(17, 700, "0.22em"), fill: COLORS.accent } as React.CSSProperties}
            opacity={ramp(f, 0, 18)}>
        TRI-PATH ARCHITECTURE
      </text>
      <text x={x + w} y={y - 18} textAnchor="end"
            style={{ ...micro(15, 600, "0.14em"), fill: COLORS.slateDim } as React.CSSProperties}
            opacity={ramp(f, 60, 22)}>
        ONE PREAMP &#183; THREE SIMULTANEOUS DESTINATIONS
      </text>
    </svg>
  );
};

// ---------------------------------------------------------------------------
// 2. THE DB25 INJECTION — Studio Bridge only
//
// The connector travels in, seats, its pins register, and only then does the
// channel ladder count out twenty-four a side. The count is the demonstration:
// twenty-four in and twenty-four out is the entire claim of the unit, and it
// is enumerated rather than asserted.
// ---------------------------------------------------------------------------
export const DB25Injection: React.FC<{
  unit: UnitId; x: number; y: number; w: number; h: number; delay?: number;
}> = ({ unit, x, y, w, h, delay = 0 }) => {
  const u = UNITS[unit];
  if (u.id !== "studiobridge") {
    throw new Error(
      `DB25Injection: ${u.name} is outside this concept's scope. Section 6 ` +
      `restricts the DB25 Injection to the Studio Bridge, the only unit whose ` +
      `I/O topology is DB25 (AES59-2012).`,
    );
  }

  const f = useCurrentFrame() - delay;

  // Three movements: the shell travels in and seats; the pins register; the
  // channels enumerate. The count is the whole demonstration — twenty-four a
  // side is the unit's entire claim, so it is counted out rather than asserted.
  const seat = ramp(f, 10, 34);
  const reg = ramp(f, 48, 26);
  const COUNT_FROM = 78;
  const COUNT_LEN = 66;
  const count = ramp(f, COUNT_FROM, COUNT_LEN);
  const lit = Math.floor(count * 24 + 1e-6);

  const ladW = Math.round(w * 0.128);
  const inX = x;
  const outX = x + w - ladW;
  const rowH = (h - 30) / 24;

  // The D-subminiature shell. A DB25 is unmistakable for two reasons: the
  // strongly trapezoidal ("D") shroud, and the offset two-row pin field of 13
  // over 12. Both are drawn to those proportions rather than approximated by a
  // rounded rectangle with dots in it.
  const shW = Math.round(w * 0.33);
  const shH = Math.round(Math.min(h * 0.36, shW * 0.42));
  const shX = x + Math.round((w - shW) / 2);
  const shY = y + Math.round((h - shH) / 2);
  const chamfer = Math.round(shH * 0.30);
  const travelY = (1 - seat) * -Math.round(h * 0.42);

  const pitch = (shW - 66) / 12;
  const pinRow = (n: number, row: 0 | 1) =>
    Array.from({ length: n }, (_, i) => ({
      // the bottom row sits half a pitch inboard — the real DB25 stagger
      cx: shX + 33 + pitch * (i + (row === 1 ? 0.5 : 0)),
      cy: shY + shH * (row === 0 ? 0.38 : 0.66),
      i: row === 0 ? i : 13 + i,
    }));
  const pins = [...pinRow(13, 0), ...pinRow(12, 1)];

  const ladder = (side: "in" | "out") => {
    const lx = side === "in" ? inX : outX;
    const color = side === "in" ? COLORS.pathSD : COLORS.pathUSB;
    return (
      <g>
        <text x={lx + ladW / 2} y={y - 16} textAnchor="middle"
              style={{ ...micro(15, 700, "0.18em"), fill: color } as React.CSSProperties}
              opacity={ramp(f, 60, 18)}>
          {side === "in" ? "24 IN" : "24 OUT"}
        </text>
        {Array.from({ length: 24 }, (_, i) => {
          const on = i < lit;
          const ry = y + 8 + i * rowH;
          const grow = on ? ramp(f - COUNT_FROM - i * (COUNT_LEN / 26), 0, 11) : 0;
          return (
            <g key={i}>
              <rect x={lx} y={ry} width={ladW} height={rowH - 4} rx={3}
                    fill={COLORS.paperWell} stroke={COLORS.line} strokeWidth={0.8} />
              <rect x={lx} y={ry} width={ladW * grow} height={rowH - 4} rx={3}
                    fill={color} opacity={0.86} />
              {i % 4 === 0 ? (
                <text
                  x={side === "in" ? lx - 12 : lx + ladW + 12}
                  y={ry + rowH * 0.62}
                  textAnchor={side === "in" ? "end" : "start"}
                  style={{ ...spec(13, 600, "0.04em"), fill: COLORS.slateDim } as React.CSSProperties}
                  opacity={ramp(f, 66, 18)}
                >
                  {String(i + 1).padStart(2, "0")}
                </text>
              ) : null}
            </g>
          );
        })}
        <text x={lx + ladW / 2} y={y + h + 6} textAnchor="middle"
              style={{ ...spec(21, 700, "0.02em"), fill: COLORS.ink } as React.CSSProperties}
              opacity={ramp(f, COUNT_FROM, 16)}>
          {String(lit).padStart(2, "0")} / 24
        </text>
      </g>
    );
  };

  // Signal fans: each channel's line leaves the shell and reaches its rung, and
  // lights only once that rung has counted.
  const fan = (side: "in" | "out") => {
    const toX = side === "in" ? inX + ladW : outX;
    const fromX = side === "in" ? shX : shX + shW;
    const color = side === "in" ? COLORS.pathSD : COLORS.pathUSB;
    return Array.from({ length: 24 }, (_, i) => {
      const ry = y + 8 + i * rowH + (rowH - 4) / 2;
      const mid = (fromX + toX) / 2;
      const on = i < lit;
      return (
        <path key={i}
              d={`M ${fromX} ${shY + shH / 2} C ${mid} ${shY + shH / 2}, ${mid} ${ry}, ${toX} ${ry}`}
              fill="none" stroke={color} strokeWidth={on ? 1.6 : 1}
              opacity={(on ? 0.42 : 0.10) * ramp(f, 62, 20)} />
      );
    });
  };

  return (
    <svg width={w + 140} height={h + 64} viewBox={`${x - 70} ${y - 36} ${w + 140} ${h + 64}`}
         style={{ position: "absolute", left: x - 70, top: y - 36, overflow: "visible" }}>
      {fan("in")}
      {fan("out")}
      {ladder("in")}
      {ladder("out")}

      {/* receptacle */}
      <rect x={shX - 16} y={shY - 12} width={shW + 32} height={shH + 24} rx={10}
            fill={COLORS.paperWell} stroke={COLORS.lineStrong} strokeWidth={1.4}
            opacity={ramp(f, 0, 18)} />

      <g transform={`translate(0 ${travelY})`} opacity={ramp(f, 6, 14)}>
        {/* screw lugs, one each side — the DB25's other unmistakable feature */}
        {[shX - 10, shX + shW + 10].map((lx, i) => (
          <circle key={i} cx={lx} cy={shY + shH / 2} r={8}
                  fill={COLORS.paperLift} stroke={COLORS.slate} strokeWidth={1.6} />
        ))}
        {/* the D-shaped shroud */}
        <path
          d={`M ${shX + chamfer} ${shY}
              H ${shX + shW - chamfer * 0.62}
              L ${shX + shW} ${shY + chamfer}
              V ${shY + shH - chamfer}
              L ${shX + shW - chamfer * 0.62} ${shY + shH}
              H ${shX + chamfer}
              L ${shX} ${shY + shH - chamfer}
              V ${shY + chamfer} Z`}
          fill={COLORS.paperLift} stroke={COLORS.ink} strokeWidth={2.6}
          strokeLinejoin="round" />
        {/* inner pin field */}
        <path
          d={`M ${shX + chamfer + 9} ${shY + 10}
              H ${shX + shW - chamfer * 0.62 - 9}
              L ${shX + shW - 10} ${shY + chamfer + 4}
              V ${shY + shH - chamfer - 4}
              L ${shX + shW - chamfer * 0.62 - 9} ${shY + shH - 10}
              H ${shX + chamfer + 9}
              L ${shX + 10} ${shY + shH - chamfer - 4}
              V ${shY + chamfer + 4} Z`}
          fill={COLORS.paperWell} stroke={COLORS.line} strokeWidth={1.2} />
        {pins.map((p) => {
          const o = ramp(f - 48 - p.i * 0.7, 0, 12);
          return (
            <circle key={p.i} cx={p.cx} cy={p.cy} r={4.6}
                    fill={COLORS.accent} opacity={(0.18 + 0.82 * o) * Math.max(0.25, reg)} />
          );
        })}
      </g>

      <text x={x + w / 2} y={y + h + 44} textAnchor="middle"
            style={{ ...micro(16, 700, "0.20em"), fill: COLORS.accent } as React.CSSProperties}
            opacity={ramp(f, 26, 20)}>
        {specValue(unit, "Input/Output Topology")}
      </text>
      <text x={x + w / 2} y={shY - 26} textAnchor="middle"
            style={{ ...micro(14, 600, "0.16em"), fill: COLORS.slateDim } as React.CSSProperties}
            opacity={ramp(f, 34, 20)}>
        25-PIN D-SUB &#183; 13 OVER 12
      </text>
    </svg>
  );
};

// ---------------------------------------------------------------------------
// 3. THE TIMECODE SYNCHRONIZATION PULSE — Model 12 and Model 2400 only
//
// The benchmark of the three. Two transports run free, drift visibly apart,
// then the MTC link opens and the readouts SNAP into agreement and stay there.
// The lock is demonstrated by the drift that precedes it — a diagram of two
// boxes and an arrow proves nothing.
// ---------------------------------------------------------------------------
export const TimecodePulse: React.FC<{
  unit: UnitId; x: number; y: number; w: number; h: number; delay?: number;
}> = ({ unit, x, y, w, h, delay = 0 }) => {
  const u = UNITS[unit];
  if (!u.timecode) {
    throw new Error(
      `TimecodePulse: ${u.name} is outside this concept's scope. Section 6 ` +
      `restricts the Timecode Synchronization Pulse to the Model 12 and the ` +
      `Model 2400.`,
    );
  }

  const f = useCurrentFrame() - delay;

  const LOCK_AT = 96;
  const locked = f >= LOCK_AT;
  const lockP = ramp(f, LOCK_AT, 14);

  // Master runs from frame 0. The slave runs free and drifts, then converges.
  const masterF = Math.max(0, f - 20);
  const driftMax = 43;
  const drift = locked
    ? Math.round(driftMax * (1 - EASE_OUT(Math.min(1, (f - LOCK_AT) / 16))))
    : Math.round(driftMax * ramp(f, 24, 68));
  const slaveF = Math.max(0, masterF - drift);

  const tc = (fr: number) => {
    const ff = fr % 30;
    const ss = Math.floor(fr / 30) % 60;
    const mm = Math.floor(fr / 1800) % 60;
    const hh = Math.floor(fr / 108000) % 24;
    const p = (n: number) => String(n).padStart(2, "0");
    return `${p(hh)}:${p(mm)}:${p(ss)}:${p(ff)}`;
  };

  const boxW = Math.round(w * 0.325);
  const boxH = Math.round(h * 0.62);
  const boxY = y + Math.round((h - boxH) / 2);
  const leftX = x;
  const rightX = x + w - boxW;
  const linkY = boxY + boxH / 2;

  // MTC quarter-frame traffic: eight messages per frame, so the ticks run fast
  // and only settle into an even cadence once the link is locked.
  const qf = 8;
  const ticks = Array.from({ length: qf }, (_, i) => i);

  const readout = (bx: number, label: string, value: string, color: string, live: boolean) => (
    <g opacity={ramp(f, live ? 8 : 0, 20)}>
      <rect x={bx} y={boxY} width={boxW} height={boxH} rx={16}
            fill={COLORS.paperLift}
            stroke={locked ? COLORS.signal : color}
            strokeWidth={locked ? 2.4 : 1.4} />
      <text x={bx + boxW / 2} y={boxY + boxH * 0.30} textAnchor="middle"
            style={{ ...micro(15, 700, "0.18em"), fill: color } as React.CSSProperties}>
        {label}
      </text>
      <text x={bx + boxW / 2} y={boxY + boxH * 0.62} textAnchor="middle"
            style={{ ...spec(Math.round(boxW * 0.148), 700, "0.03em"), fill: COLORS.ink } as React.CSSProperties}>
        {value}
      </text>
      <text x={bx + boxW / 2} y={boxY + boxH * 0.83} textAnchor="middle"
            style={{ ...micro(14, 700, "0.20em"),
              fill: locked ? COLORS.signal : COLORS.alert } as React.CSSProperties}>
        {locked ? "LOCK" : "FREE"}
      </text>
    </g>
  );

  return (
    <svg width={w + 4} height={h + 50} viewBox={`${x - 2} ${y - 34} ${w + 4} ${h + 50}`}
         style={{ position: "absolute", left: x - 2, top: y - 34, overflow: "visible" }}>
      {/* the 5-pin DIN link */}
      <line x1={leftX + boxW} y1={linkY} x2={rightX} y2={linkY}
            stroke={locked ? COLORS.signal : COLORS.lineStrong}
            strokeWidth={locked ? 3 : 2} opacity={ramp(f, 30, 20)} />
      {ticks.map((i) => {
        const span = rightX - (leftX + boxW);
        const speed = locked ? 0.020 : 0.013;
        const p = (f * speed + i / qf) % 1;
        const px = leftX + boxW + span * p;
        return (
          <circle key={i} cx={px} cy={linkY} r={locked ? 4.2 : 3.0}
                  fill={locked ? COLORS.signal : COLORS.slateDim}
                  opacity={ramp(f, 30, 20) * (locked ? 0.95 : 0.45)} />
        );
      })}

      {readout(leftX, "MASTER TRANSPORT", tc(masterF), COLORS.accent, false)}
      {readout(rightX, `${u.name.toUpperCase()} SLAVE`, tc(slaveF), COLORS.pathUSB, true)}

      {/* offset counter — the number that has to reach zero */}
      <text x={x + w / 2} y={boxY - 16} textAnchor="middle"
            style={{ ...spec(24, 700, "0.04em"),
              fill: drift === 0 ? COLORS.signal : COLORS.alert } as React.CSSProperties}
            opacity={ramp(f, 34, 18)}>
        {drift === 0 ? "OFFSET 00 FRAMES" : `OFFSET ${String(drift).padStart(2, "0")} FRAMES`}
      </text>

      <text x={x + w / 2} y={boxY + boxH + 38} textAnchor="middle"
            style={{ ...micro(16, 700, "0.20em"),
              fill: locked ? COLORS.signal : COLORS.slateDim } as React.CSSProperties}
            opacity={Math.max(ramp(f, 40, 18) * 0.55, lockP)}>
        {specValue(unit, "MIDI")}
      </text>
    </svg>
  );
};
