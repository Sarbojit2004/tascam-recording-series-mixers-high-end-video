import React from 'react';
import {useCurrentFrame} from 'remotion';
import {ramp, rnd} from '../lib/anim';
import {C, F} from '../lib/theme';

// The vector overlays the creative brief's Section 11 calls for, drawn as
// native SVG/CSS on the light ground: signal flow, a DAW-transport abstraction,
// a Meter Bridge recreation, the DB-25 breakout, and a 6U rack contextualiser.
// Every stroke is dark ink or the scene accent so nothing needs a scrim.

/** Glowing signal path: XLR in, through the preamp, splitting to SD and USB. */
export const SignalFlow: React.FC<{
  w: number;
  h: number;
  accent: string;
  p: number; // 0..1 draw progress
  labels?: [string, string, string];
}> = ({w, h, accent, p, labels = ['XLR IN', 'ULTRA-HDDA', 'SD + USB']}) => {
  const midY = h * 0.5;
  const path = `M 8 ${midY} L ${w * 0.3} ${midY} L ${w * 0.46} ${midY}`;
  const up = `M ${w * 0.46} ${midY} C ${w * 0.62} ${midY}, ${w * 0.66} ${h * 0.22}, ${w * 0.94} ${h * 0.22}`;
  const dn = `M ${w * 0.46} ${midY} C ${w * 0.62} ${midY}, ${w * 0.66} ${h * 0.78}, ${w * 0.94} ${h * 0.78}`;
  const dash = (len: number) => ({
    strokeDasharray: len,
    strokeDashoffset: len * (1 - p),
  });
  return (
    <svg width={w} height={h} style={{display: 'block', overflow: 'visible'}}>
      <path d={path} stroke={C.hair} strokeWidth={6} fill="none" strokeLinecap="round" />
      <path d={up} stroke={C.hair} strokeWidth={6} fill="none" strokeLinecap="round" />
      <path d={dn} stroke={C.hair} strokeWidth={6} fill="none" strokeLinecap="round" />
      <path d={path} stroke={accent} strokeWidth={5} fill="none" strokeLinecap="round" style={dash(w * 0.46)} />
      <path d={up} stroke={accent} strokeWidth={5} fill="none" strokeLinecap="round" style={dash(w * 0.62)} />
      <path d={dn} stroke={accent} strokeWidth={5} fill="none" strokeLinecap="round" style={dash(w * 0.62)} />
      <circle cx={8} cy={midY} r={11} fill={C.card} stroke={accent} strokeWidth={4} />
      <rect
        x={w * 0.3 - 4}
        y={midY - 26}
        width={64}
        height={52}
        rx={9}
        fill={C.card}
        stroke={accent}
        strokeWidth={3}
      />
      <circle cx={w * 0.94} cy={h * 0.22} r={10} fill={accent} opacity={p} />
      <circle cx={w * 0.94} cy={h * 0.78} r={10} fill={accent} opacity={p} />
      <text x={0} y={midY + 46} fill={C.inkDim} fontFamily={F.mono} fontSize={18} letterSpacing={1.6}>
        {labels[0]}
      </text>
      <text x={w * 0.28} y={midY - 40} fill={C.inkDim} fontFamily={F.mono} fontSize={18} letterSpacing={1.6}>
        {labels[1]}
      </text>
      <text
        x={w * 0.94}
        y={h * 0.5}
        fill={C.inkDim}
        fontFamily={F.mono}
        fontSize={18}
        letterSpacing={1.6}
        textAnchor="end"
      >
        {labels[2]}
      </text>
    </svg>
  );
};

/** TASCAM Meter Bridge recreation — peak-hold VU columns bouncing to the bed. */
export const MeterBridge: React.FC<{
  w: number;
  h: number;
  cols?: number;
  accent: string;
  seed?: number;
}> = ({w, h, cols = 22, accent, seed = 3}) => {
  const f = useCurrentFrame();
  const gap = 5;
  const cw = (w - gap * (cols - 1)) / cols;
  const seg = 14;
  const sh = (h - (seg - 1) * 3) / seg;
  return (
    <div style={{width: w, height: h, display: 'flex', gap, alignItems: 'flex-end'}}>
      {Array.from({length: cols}).map((_, i) => {
        const base = 0.34 + rnd(seed + i) * 0.42;
        const wob = 0.3 * Math.sin((f / 30) * (3.4 + rnd(seed + i * 7) * 3) + i * 0.8);
        const lvl = Math.max(0.1, Math.min(1, base + wob));
        const lit = Math.round(lvl * seg);
        const hold = Math.min(seg - 1, lit + 1);
        return (
          <div key={i} style={{width: cw, height: h, display: 'flex', flexDirection: 'column-reverse', gap: 3}}>
            {Array.from({length: seg}).map((__, j) => {
              const on = j < lit;
              const isHold = j === hold;
              const col =
                j > seg - 3 ? '#D0342C' : j > seg - 6 ? '#D9A310' : accent;
              return (
                <div
                  key={j}
                  style={{
                    height: sh,
                    borderRadius: 2,
                    background: on ? col : C.hair,
                    opacity: on ? 1 : 0.35,
                    boxShadow: isHold ? `0 0 0 1px ${col}` : undefined,
                  }}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

/** 100 mm long-throw fader travelling in its slot. */
export const FaderTravel: React.FC<{
  w: number;
  h: number;
  accent: string;
  count?: number;
  p: number;
}> = ({w, h, accent, count = 8, p}) => {
  const f = useCurrentFrame();
  const slotW = w / count;
  return (
    <div style={{width: w, height: h, display: 'flex'}}>
      {Array.from({length: count}).map((_, i) => {
        const target = 0.26 + rnd(i * 13 + 5) * 0.5;
        const travel = target * Math.min(1, Math.max(0, p * 1.6 - i * 0.07));
        const bob = 0.012 * Math.sin((f / 30) * 2.2 + i);
        const y = h * (1 - travel - bob) - 34;
        return (
          <div key={i} style={{width: slotW, height: h, position: 'relative'}}>
            <div
              style={{
                position: 'absolute',
                left: slotW / 2 - 3,
                top: 0,
                width: 6,
                height: h,
                borderRadius: 3,
                background: C.hair,
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: slotW / 2 - 3,
                top: Math.max(0, y + 34),
                width: 6,
                height: Math.max(0, h - y - 34),
                borderRadius: 3,
                background: `${accent}55`,
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: slotW / 2 - 19,
                top: Math.max(0, Math.min(h - 34, y)),
                width: 38,
                height: 34,
                borderRadius: 6,
                background: C.card,
                border: `1px solid ${C.cardEdge}`,
                boxShadow: '0 6px 14px -6px rgba(20,26,34,0.5)',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: 5,
                  top: 15,
                  width: 28,
                  height: 3,
                  borderRadius: 2,
                  background: accent,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

/** HUI/MCU transport row — REC arming against a DAW timeline abstraction. */
export const TransportRow: React.FC<{w: number; accent: string; armAt?: number}> = ({
  w,
  accent,
  armAt = 20,
}) => {
  const f = useCurrentFrame();
  const armed = f >= armAt;
  const blink = 0.45 + 0.55 * Math.abs(Math.sin((f - armAt) / 6));
  const keys = ['◀◀', '▶▶', '■', '▶', '●'];
  return (
    <div style={{width: w}}>
      <div style={{display: 'flex', gap: 12, marginBottom: 18}}>
        {keys.map((k, i) => {
          const isRec = i === keys.length - 1;
          return (
            <div
              key={k}
              style={{
                width: 74,
                height: 54,
                borderRadius: 9,
                background: isRec && armed ? '#D0342C' : C.card,
                border: `1px solid ${isRec && armed ? '#D0342C' : C.cardEdge}`,
                color: isRec && armed ? '#FFF' : C.inkSoft,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: F.ui,
                fontSize: 22,
                fontWeight: 700,
                opacity: isRec && armed ? blink : 1,
                boxShadow: '0 6px 16px -8px rgba(20,26,34,0.4)',
              }}
            >
              {k}
            </div>
          );
        })}
      </div>
      {/* DAW timeline abstraction — no software screenshots, pure vector */}
      <div style={{display: 'flex', flexDirection: 'column', gap: 7}}>
        {Array.from({length: 4}).map((_, r) => (
          <div key={r} style={{height: 22, position: 'relative', background: C.card, borderRadius: 5, border: `1px solid ${C.cardEdge}`}}>
            {Array.from({length: 5}).map((__, b) => {
              const x = ((b * 197 + r * 61) % (w - 130)) + 6;
              const bw = 60 + rnd(r * 9 + b) * 90;
              const on = armed && f > armAt + b * 4 + r * 2;
              return (
                <div
                  key={b}
                  style={{
                    position: 'absolute',
                    left: x,
                    top: 4,
                    width: bw,
                    height: 14,
                    borderRadius: 3,
                    background: on ? accent : C.hair,
                    opacity: on ? 0.85 : 0.5,
                  }}
                />
              );
            })}
            <div
              style={{
                position: 'absolute',
                left: ramp(f, [armAt, armAt + 70], [10, w - 20]),
                top: -2,
                width: 2,
                height: 26,
                background: '#D0342C',
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

/** DB-25 breakout — one 25-pin shell fanning out into eight channel lines. */
export const DB25FanOut: React.FC<{w: number; h: number; accent: string; p: number}> = ({
  w,
  h,
  accent,
  p,
}) => {
  const lanes = 8;
  const shellW = 150;
  const shellH = 74;
  const sx = 6;
  const sy = h / 2 - shellH / 2;
  return (
    <svg width={w} height={h} style={{display: 'block', overflow: 'visible'}}>
      {/* the 25-pin shell */}
      <path
        d={`M ${sx} ${sy + 12} L ${sx + 14} ${sy} L ${sx + shellW - 14} ${sy} L ${sx + shellW} ${sy + 12} L ${sx + shellW} ${sy + shellH - 12} L ${sx + shellW - 14} ${sy + shellH} L ${sx + 14} ${sy + shellH} L ${sx} ${sy + shellH - 12} Z`}
        fill={C.card}
        stroke={C.ink}
        strokeWidth={3}
      />
      {Array.from({length: 13}).map((_, i) => (
        <circle key={`a${i}`} cx={sx + 20 + i * 8.6} cy={sy + 26} r={2.6} fill={C.inkDim} />
      ))}
      {Array.from({length: 12}).map((_, i) => (
        <circle key={`b${i}`} cx={sx + 24 + i * 8.6} cy={sy + 48} r={2.6} fill={C.inkDim} />
      ))}
      {/* fan-out */}
      {Array.from({length: lanes}).map((_, i) => {
        const y1 = sy + shellH / 2;
        const y2 = 18 + (i * (h - 36)) / (lanes - 1);
        const x1 = sx + shellW;
        const x2 = w - 92;
        const d = `M ${x1} ${y1} C ${x1 + 120} ${y1}, ${x2 - 150} ${y2}, ${x2} ${y2}`;
        const len = 420;
        const local = Math.max(0, Math.min(1, p * 1.5 - i * 0.06));
        return (
          <g key={i}>
            <path d={d} stroke={C.hair} strokeWidth={3} fill="none" />
            <path
              d={d}
              stroke={accent}
              strokeWidth={3}
              fill="none"
              strokeDasharray={len}
              strokeDashoffset={len * (1 - local)}
            />
            <circle cx={x2} cy={y2} r={5} fill={accent} opacity={local} />
            <text
              x={x2 + 14}
              y={y2 + 6}
              fill={C.inkSoft}
              fontFamily={F.mono}
              fontSize={17}
              letterSpacing={1.2}
              opacity={local}
            >
              CH {i + 1}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

/** 6U rack contextualiser — a 19-inch rack with the Studio Bridge slot lit. */
export const RackWire: React.FC<{w: number; h: number; accent: string; p: number}> = ({
  w,
  h,
  accent,
  p,
}) => {
  const units = 12;
  const uh = (h - 26) / units;
  const highlightFrom = 3;
  const highlightCount = 6;
  return (
    <svg width={w} height={h} style={{display: 'block'}}>
      <rect x={1} y={1} width={w - 2} height={h - 2} rx={8} fill="none" stroke={C.ink} strokeWidth={2.5} />
      {Array.from({length: units}).map((_, i) => {
        const y = 13 + i * uh;
        const inSlot = i >= highlightFrom && i < highlightFrom + highlightCount;
        const reveal = inSlot ? Math.max(0, Math.min(1, p * 2 - (i - highlightFrom) * 0.14)) : 1;
        return (
          <g key={i}>
            <rect
              x={13}
              y={y}
              width={w - 26}
              height={uh - 4}
              rx={3}
              fill={inSlot ? accent : 'none'}
              opacity={inSlot ? 0.14 * reveal : 1}
              stroke={inSlot ? accent : C.hair}
              strokeWidth={inSlot ? 2 : 1.4}
            />
            <circle cx={7} cy={y + uh / 2 - 2} r={2.4} fill={C.hair} />
            <circle cx={w - 7} cy={y + uh / 2 - 2} r={2.4} fill={C.hair} />
          </g>
        );
      })}
      <text
        x={w / 2}
        y={13 + highlightFrom * uh + (highlightCount * uh) / 2}
        fill={accent}
        fontFamily={F.display}
        fontWeight={800}
        fontSize={40}
        letterSpacing={1}
        textAnchor="middle"
        opacity={p}
      >
        6U
      </text>
    </svg>
  );
};

/** Subgroup / aux routing matrix for the flagship's advanced routing beat. */
export const RoutingMatrix: React.FC<{w: number; h: number; accent: string; p: number}> = ({
  w,
  h,
  accent,
  p,
}) => {
  const rows = 4;
  const cols = 5;
  const cw = w / cols;
  const rh = h / rows;
  return (
    <svg width={w} height={h} style={{display: 'block'}}>
      {Array.from({length: rows + 1}).map((_, r) => (
        <line key={`r${r}`} x1={0} y1={r * rh} x2={w} y2={r * rh} stroke={C.hair} strokeWidth={1.4} />
      ))}
      {Array.from({length: cols + 1}).map((_, c) => (
        <line key={`c${c}`} x1={c * cw} y1={0} x2={c * cw} y2={h} stroke={C.hair} strokeWidth={1.4} />
      ))}
      {Array.from({length: rows}).map((_, r) =>
        Array.from({length: cols}).map((__, c) => {
          const on = rnd(r * 11 + c * 3) > 0.45;
          const local = Math.max(0, Math.min(1, p * 2 - (r * cols + c) * 0.05));
          if (!on) return null;
          return (
            <circle
              key={`${r}-${c}`}
              cx={c * cw + cw / 2}
              cy={r * rh + rh / 2}
              r={Math.min(cw, rh) * 0.22 * local}
              fill={accent}
              opacity={0.85}
            />
          );
        }),
      )}
    </svg>
  );
};

/** Ascending scale ladder used on the range beats. */
export const ScaleLadder: React.FC<{
  values: readonly {label: string; v: number; color: string; dim?: boolean}[];
  w: number;
  h: number;
  p: number;
}> = ({values, w, h, p}) => {
  const max = Math.max(...values.map((v) => v.v));
  const gap = 16;
  const bw = (w - gap * (values.length - 1)) / values.length;
  return (
    <div style={{width: w, height: h, display: 'flex', gap, alignItems: 'flex-end'}}>
      {values.map((v, i) => {
        const local = Math.max(0, Math.min(1, p * 1.8 - i * 0.12));
        const bh = (v.v / max) * (h - 44) * local;
        return (
          <div
            key={v.label}
            style={{
              width: bw,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              opacity: v.dim ? 0.34 : 1,
            }}
          >
            <div
              style={{
                fontFamily: F.display,
                fontWeight: 800,
                fontSize: 30,
                color: v.color,
                opacity: local,
                marginBottom: 6,
              }}
            >
              {v.v}
            </div>
            <div
              style={{
                width: bw,
                height: bh,
                borderRadius: '6px 6px 0 0',
                background: `linear-gradient(180deg, ${v.color}, ${v.color}99)`,
              }}
            />
            <div
              style={{
                fontFamily: F.ui,
                fontWeight: 700,
                fontSize: 16,
                letterSpacing: 1.4,
                color: C.inkDim,
                marginTop: 8,
                whiteSpace: 'nowrap',
              }}
            >
              {v.label}
            </div>
          </div>
        );
      })}
    </div>
  );
};

/** Thin accent rule used to anchor headline blocks. */
export const Rule: React.FC<{w: number; accent: string; p?: number; thickness?: number}> = ({
  w,
  accent,
  p = 1,
  thickness = 3,
}) => (
  <div
    style={{
      width: w * Math.max(0, Math.min(1, p)),
      height: thickness,
      borderRadius: 2,
      background: `linear-gradient(90deg, ${accent}, ${accent}22)`,
    }}
  />
);
