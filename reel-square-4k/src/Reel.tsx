import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import {
  Brackets,
  CREAM,
  Chars,
  Cover,
  DISP,
  GOLD,
  HorizonLine as GlowLine,
  INK,
  MONO,
  PAPER,
  Product3D,
  REC,
  Reveal,
  SERIF,
  Scramble,
  WOOD,
  backOut,
  card,
  clamp,
  clip,
  easeIO,
  expo,
  icon,
  im,
  lerp,
  logo,
  quint,
  ramp,
  rnd,
  useFonts,
} from "./kit";
import { A, CARDS, ORDER, P, say, type Item } from "./data";
import music from "./music.json";

/**
 * TASCAM Recording Series — 60.78 s square beat-locked reel (Mortals, Hindi — NCS).
 * Built for retention: the first frame is already the hook (big claim over moving footage), the
 * drop lands at 2.67 s, every scene change sits on a downbeat and every in-scene change on a beat.
 * Outro (10.1 s from the downbeat at 50.67 s): rotating 3D carousel of every still, then the
 * carousel folds into the media card of the partner layout.
 */
type G = { t: number; beats: number[]; downs: number[] };
type TT = "split" | "whip" | "zoom" | "iris" | "wipe" | "punch";

const BEATS: number[] = music.beats;
const DOWNS: number[] = music.downbeats;
const DROPS: number[] = music.drops;
const W = 1080;

// ---------------------------------------------------------------- beat helpers
const idxAt = (b: number[], t: number) => {
  if (t < b[0]) return -1;
  let lo = 0;
  let hi = b.length - 1;
  while (lo < hi) {
    const m = (lo + hi + 1) >> 1;
    if (b[m] <= t) lo = m;
    else hi = m - 1;
  }
  return lo;
};
const beatLen = (b: number[], k: number) => (k >= 0 && k < b.length - 1 ? b[k + 1] - b[k] : 0.67);
const beatPulse = (g: G, decay = 0.11) => {
  const k = idxAt(g.beats, g.t);
  return k < 0 ? 0 : Math.exp(-(g.t - g.beats[k]) / decay);
};
const barPulse = (g: G, decay = 0.22) => {
  const k = idxAt(g.downs, g.t);
  return k < 0 ? 0 : Math.exp(-(g.t - g.downs[k]) / decay);
};
type SP = { g: G; u: number; d: number; s: number; si: number };
/** beat index inside the scene and time since that beat */
const local = (p: SP) => {
  const k = idxAt(p.g.beats, p.g.t);
  return { lb: Math.max(0, k - p.si), ub: p.g.t - p.g.beats[Math.max(0, k)], blen: beatLen(p.g.beats, k) };
};

// ---------------------------------------------------------------- environment
const Floor: React.FC<{ t: number; y?: number; opacity?: number }> = ({ t, y = 660, opacity = 1 }) => {
  const lines: React.ReactNode[] = [];
  const H = W - y;
  for (let i = 0; i < 14; i++) {
    const f = (i + ((t * 0.9) % 1)) / 14;
    const yy = y + Math.pow(f, 2.2) * H;
    lines.push(<line key={"h" + i} x1={0} x2={W} y1={yy} y2={yy} stroke={`rgba(242,184,75,${0.04 + f * 0.2})`} strokeWidth={1 + f} />);
  }
  for (let i = -12; i <= 12; i++) lines.push(<line key={"v" + i} x1={540 + i * 22} y1={y} x2={540 + i * 170} y2={W} stroke="rgba(242,184,75,0.11)" strokeWidth={1} />);
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, opacity }} width={W} height={W}>
      {lines}
    </svg>
  );
};

const Stage: React.FC<{ g: G; floor?: boolean; glowY?: number }> = ({ g, floor = true, glowY = 620 }) => {
  const bp = barPulse(g);
  return (
    <AbsoluteFill style={{ background: INK }}>
      <AbsoluteFill style={{ background: `radial-gradient(900px 440px at 540px ${glowY}px, rgba(210,120,58,.30), transparent 70%)` }} />
      <AbsoluteFill style={{ background: `radial-gradient(520px 250px at 540px ${glowY + 40}px, rgba(255,226,168,${0.12 + bp * 0.12}), transparent 70%)` }} />
      {floor ? <Floor t={g.t} y={glowY + 40} /> : null}
    </AbsoluteFill>
  );
};

/** Moving footage as a background plate: dimmed, warm-graded, slow push. */
const ClipBG: React.FC<{ id: string; u: number; from?: number; dim?: number; z?: number }> = ({ id, u, from = 1.2, dim = 0.42, z = 1.12 }) => (
  <AbsoluteFill style={{ overflow: "hidden" }}>
    <OffthreadVideo
      src={clip(id)}
      startFrom={Math.round(from * 60)}
      muted
      style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${z + u * 0.035})`, filter: `brightness(${dim}) saturate(1.08) contrast(1.06)` }}
    />
  </AbsoluteFill>
);

// ---------------------------------------------------------------- scene wrapper + transitions
const Scene: React.FC<{ g: G; s: number; e: number; tin: TT; tout: TT | null; dir: number; children: (u: number, d: number) => React.ReactNode }> = ({ g, s, e, tin, tout, dir, children }) => {
  const t = g.t;
  const pre = tin === "whip" || tin === "zoom" ? 0.1 : 0.03;
  if (t < s - pre || t > e + 0.3) return null;
  const a = expo((t - (s - pre)) / 0.28);
  let tf = "";
  let clipPath: string | undefined;
  let blur = 0;
  let op = 1;
  if (a < 1) {
    if (tin === "split") {
      clipPath = `inset(${50 - 50 * a}% 0 ${50 - 50 * a}% 0)`;
      tf += ` scale(${lerp(1.12, 1, a)})`;
    } else if (tin === "whip") {
      tf += ` translateX(${(1 - a) * dir * 105}%)`;
      blur += (1 - a) * 24;
    } else if (tin === "zoom") {
      tf += ` scale(${lerp(0.6, 1, a)})`;
      blur += (1 - a) * 12;
      op *= a;
    } else if (tin === "iris") {
      clipPath = `circle(${a * 76}% at 50% 50%)`;
      tf += ` scale(${lerp(1.18, 1, a)})`;
    } else if (tin === "punch") {
      tf += ` scale(${lerp(1.45, 1, a)})`;
      blur += (1 - a) * 16;
    } else {
      const q = lerp(-25, 125, a);
      clipPath = `polygon(0 0, ${q + 25}% 0, ${q}% 100%, 0 100%)`;
    }
  }
  if (tout && t > e - 0.18) {
    const b = expo((t - (e - (tout === "whip" || tout === "zoom" ? 0.1 : 0.03))) / 0.28);
    if (b >= 1) return null;
    if (tout === "whip") {
      tf += ` translateX(${-b * dir * 70}%)`;
      blur += b * 24;
    } else if (tout === "zoom" || tout === "punch") {
      tf += ` scale(${lerp(1, 1.45, b)})`;
      op *= 1 - b;
    } else {
      tf += ` scale(${lerp(1, 1.07, b)})`;
      op *= 1 - b * 0.6;
    }
  }
  return (
    <AbsoluteFill style={{ transform: tf || undefined, clipPath, filter: blur > 0.4 ? `blur(${blur.toFixed(1)}px)` : undefined, opacity: op, overflow: "hidden" }}>
      {children(t - s, e - s)}
    </AbsoluteFill>
  );
};

const CutFx: React.FC<{ g: G; cuts: { t: number; type: TT; dir: number; big?: boolean }[] }> = ({ g, cuts }) => (
  <>
    {cuts.map(({ t: T, type, dir, big }, i) => {
      const dt = g.t - T;
      if (dt < -0.15 || dt > 0.6) return null;
      const a = expo((dt + 0.04) / 0.3);
      const fade = 1 - ramp(dt, 0.15, 0.45);
      const flash = dt >= 0 ? Math.exp(-dt / (big ? 0.13 : 0.05)) * (big ? 0.9 : 0.3) : 0;
      return (
        <AbsoluteFill key={i} style={{ pointerEvents: "none" }}>
          <AbsoluteFill style={{ background: `rgba(255,236,200,${flash})` }} />
          {big && dt >= 0 ? (
            <div style={{ position: "absolute", left: 540 - dt * 1900, top: 540 - dt * 1900, width: dt * 3800, height: dt * 3800, borderRadius: "50%", border: `${lerp(14, 2, clamp(dt / 0.6))}px solid rgba(255,226,168,${0.75 * (1 - clamp(dt / 0.6))})`, boxShadow: `0 0 60px rgba(242,184,75,${0.6 * (1 - clamp(dt / 0.6))})` }} />
          ) : null}
          {type === "split" ? (
            <>
              <GlowLine y={540 - 540 * a} w={1400} glow={1.4} opacity={fade} />
              <GlowLine y={540 + 540 * a} w={1400} glow={1.4} opacity={fade} />
            </>
          ) : null}
          {type === "iris" ? (
            <div style={{ position: "absolute", left: 540 - a * 820, top: 540 - a * 820, width: a * 1640, height: a * 1640, borderRadius: "50%", border: `3px solid rgba(242,184,75,${0.9 * fade})`, boxShadow: `0 0 40px rgba(242,184,75,${0.7 * fade})` }} />
          ) : null}
          {type === "wipe" ? (
            <div style={{ position: "absolute", top: -200, height: 1480, width: 6, left: lerp(-25, 125, a) * 10.8 + 135, transform: "rotate(13deg)", background: "linear-gradient(transparent, #fff, transparent)", boxShadow: `0 0 30px ${GOLD}, 0 0 80px ${WOOD}`, opacity: fade }} />
          ) : null}
          {type === "whip" || type === "zoom" || type === "punch"
            ? [0, 1, 2, 3, 4, 5, 6, 7].map((k) => (
                <div
                  key={k}
                  style={{
                    position: "absolute",
                    top: 60 + rnd(i * 11 + k) * 960,
                    left: dir > 0 ? lerp(1200, -700, easeIO(ramp(dt, -0.12, 0.26))) + rnd(k) * 200 : lerp(-700, 1200, easeIO(ramp(dt, -0.12, 0.26))) - rnd(k) * 200,
                    width: 300 + rnd(k * 5 + i) * 420,
                    height: 1.5 + rnd(k + 3) * 2.5,
                    background: `linear-gradient(90deg, transparent, ${k % 3 === 0 ? REC : k % 2 ? GOLD : "#fff"}, transparent)`,
                    opacity: Math.sin(ramp(dt, -0.12, 0.26) * Math.PI) * 0.85,
                  }}
                />
              ))
            : null}
        </AbsoluteFill>
      );
    })}
  </>
);

// ---------------------------------------------------------------- REC HUD (persistent, music-driven)
const Hud: React.FC<{ g: G; frame: number; opacity: number }> = ({ g, frame, opacity }) => {
  if (opacity <= 0) return null;
  const bp = beatPulse(g, 0.16);
  const s = Math.floor(frame / 60);
  const tc = `00:${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}:${String(frame % 60).padStart(2, "0")}`;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 52, opacity, pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 30, top: 18, display: "flex", alignItems: "center", gap: 10, fontFamily: MONO, fontSize: 15, letterSpacing: 3, color: PAPER }}>
        <div style={{ width: 13, height: 13, borderRadius: 7, background: REC, boxShadow: `0 0 ${8 + bp * 16}px ${REC}`, opacity: 0.55 + bp * 0.45 }} />
        <span style={{ color: REC }}>REC</span>
        <span style={{ color: "rgba(246,240,230,.75)" }}>{tc}</span>
      </div>
      <div style={{ position: "absolute", right: 30, top: 16, display: "flex", alignItems: "flex-end", gap: 3, height: 20 }}>
        <span style={{ fontFamily: MONO, fontSize: 13, letterSpacing: 2, color: "rgba(246,240,230,.7)", marginRight: 8 }}>24 TRK</span>
        {Array.from({ length: 24 }).map((_, i) => {
          const lv = clamp(0.25 + 0.75 * bp * (0.55 + 0.45 * rnd(i * 13 + Math.floor(g.t * 12))));
          return <div key={i} style={{ width: 4, height: 4 + lv * 16, background: lv > 0.85 ? REC : lv > 0.6 ? GOLD : "rgba(246,240,230,.6)", borderRadius: 1 }} />;
        })}
      </div>
    </div>
  );
};

// ================================================================ HOOK (frame 0, pre-drop bar)
const HOOK: { word: string; clip: string; from: number; prod: string }[] = [
  { word: say("24 TRACKS"), clip: "b05", from: 2.0, prod: "m2400-07" },
  { word: say("NO COMPUTER"), clip: "g05", from: 1.5, prod: "m24-08" },
  { word: say("ZERO LATENCY"), clip: "b01", from: 3.0, prod: "m12-08" },
  { word: say("ONE DESK"), clip: "b09", from: 2.0, prod: "m16-08" },
];
const Hook: React.FC<SP> = (p) => {
  const { lb, ub } = local(p);
  const h = HOOK[Math.min(HOOK.length - 1, lb)];
  const a = expo(ramp(ub, 0, 0.18));
  const [w0, h0] = A[h.prod];
  const pw = 760;
  const size = Math.min(170, Math.floor(1000 / (h.word.length * 0.7)));
  const build = clamp(p.u / p.d);
  return (
    <AbsoluteFill style={{ background: INK }}>
      <ClipBG id={h.clip} u={ub} from={h.from} dim={0.36} z={lerp(1.3, 1.12, a)} />
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 45%, rgba(10,8,6,.15) 20%, rgba(10,8,6,.85) 78%)" }} />
      <Product3D key={h.prod} src={im(h.prod)} x={540 + (lb % 2 ? 1 : -1) * (1 - a) * 160} y={760} w={pw} h={(pw * h0) / w0} ry={(lb % 2 ? -1 : 1) * 16} rx={12} scale={lerp(1.25, 1, a) + ub * 0.06} opacity={clamp(a * 1.4)} reflect={false} glow="rgba(242,184,75,.5)" />
      <Scramble text={say("TASCAM  •  RECORDING MIXER SERIES")} p={p.u * 1.4} size={17} spacing={6} color={CREAM} style={{ left: 0, right: 0, top: 150, textAlign: "center" }} />
      <div key={lb} style={{ position: "absolute", left: 0, right: 0, top: 250, textAlign: "center" }}>
        <div
          style={{
            display: "inline-block",
            fontFamily: DISP,
            fontWeight: 900,
            fontStretch: "118%",
            fontSize: size,
            lineHeight: 1,
            letterSpacing: lerp(30, 2, a),
            color: PAPER,
            transform: `scale(${lerp(1.5, 1, a) + ub * 0.04})`,
            filter: a < 1 ? `blur(${(1 - a) * 10}px)` : undefined,
            textShadow: `0 0 40px rgba(242,184,75,.55), 0 14px 50px rgba(0,0,0,.9)`,
          }}
        >
          {h.word}
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 6, fontFamily: DISP, fontWeight: 900, fontStretch: "118%", fontSize: size, lineHeight: 1, color: "transparent", WebkitTextStroke: `2px ${GOLD}`, opacity: 0.55 * (1 - ramp(ub, 0.05, 0.32)), transform: `scale(${1.1 + ub * 0.5})` }}>
          {h.word}
        </div>
      </div>
      {/* the build: a level bar fills to the drop */}
      <div style={{ position: "absolute", left: 120, right: 120, bottom: 70, height: 6, borderRadius: 3, background: "rgba(255,255,255,.12)" }}>
        <div style={{ width: `${build * 100}%`, height: 6, borderRadius: 3, background: `linear-gradient(90deg, ${GOLD}, ${REC})`, boxShadow: `0 0 16px ${REC}` }} />
      </div>
      <AbsoluteFill style={{ background: `rgba(255,236,200,${Math.pow(ramp(p.u, p.d - 0.22, p.d), 3) * 0.7})` }} />
    </AbsoluteFill>
  );
};

// ================================================================ HERO (drop 1)
const LINEUP: [string, number, number, number][] = [
  ["m12-07", -330, 470, 0.5],
  ["sb-03", 330, 470, 0.5],
  ["m16-08", -250, 640, 0.66],
  ["m24-08", 250, 640, 0.66],
  ["m2400-07", 0, 720, 0.98],
];
const Hero: React.FC<SP> = (p) => {
  const { lb, ub } = local(p);
  const u = p.u;
  const L = quint(ramp(u, 0.15, 0.8));
  const lw = lerp(820, 420, L);
  const bp = beatPulse(p.g);
  return (
    <AbsoluteFill>
      <Stage g={p.g} glowY={700} />
      <Img src={logo("tascam-white.png")} style={{ position: "absolute", width: lw, left: 540 - lw / 2, top: lerp(380, 72, L), transform: `scale(${lerp(1.5, 1, expo(ramp(u, 0, 0.25)))})`, filter: `drop-shadow(0 0 ${20 + bp * 26}px rgba(242,184,75,.75))` }} />
      <Scramble text={say("MODEL SERIES  •  STUDIO BRIDGE")} p={u - 0.5} size={18} spacing={6} color={CREAM} style={{ left: 0, right: 0, top: 210, textAlign: "center" }} />
      {LINEUP.map(([k, x, y, sc], i) => {
        const tIn = 0.45 + i * 0.16;
        if (u < tIn) return null;
        const a = backOut(ramp(u, tIn, tIn + 0.42), 1.15);
        const [w0, h0] = A[k];
        const w = 640 * sc;
        return <Product3D key={k} src={im(k)} x={540 + x} y={lerp(y + 220, y, a)} w={w} h={(w * h0) / w0} ry={-x / 26 - u * 2} rx={10} z={lerp(-600, 0, a)} opacity={clamp(a * 1.4)} reflect={i === 4} shine={i === 4 ? ramp(u, 1.2, 2.4) : undefined} scale={i === 4 ? 1 + bp * 0.02 : 1} />;
      })}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 64, textAlign: "center" }}>
        <Reveal key={lb < 4 ? 0 : 1} text={say(lb < 4 ? "Four desks and a bridge" : "Mix, record and interface at once")} p={lb < 4 ? u - 0.6 : ub} size={58} font={SERIF} italic weight={400} style={{ position: "relative", display: "inline-block" }} />
      </div>
      <GlowLine y={960} w={900} p={expo(ramp(u, 0.3, 0.9))} glow={0.8 + bp} />
    </AbsoluteFill>
  );
};

// ================================================================ TRI-PATH (one preamp -> three destinations)
const PATHS: { y: number; title: string; sub: string; ic: "fader" | "sd" | "usb"; col: string }[] = [
  { y: 470, title: say("ANALOG MIX"), sub: say("zero-latency summing"), ic: "fader", col: GOLD },
  { y: 660, title: say("SD RECORDER"), sub: say("multitrack, 24-bit / 48 kHz"), ic: "sd", col: REC },
  { y: 850, title: say("USB INTERFACE"), sub: say("straight into your DAW"), ic: "usb", col: CREAM },
];
const Glyph: React.FC<{ k: "fader" | "sd" | "usb"; c: string }> = ({ k, c }) => (
  <svg width={54} height={54} viewBox="0 0 54 54" style={{ position: "absolute", left: 20, top: 30 }}>
    {k === "fader" ? (
      <>
        {[12, 27, 42].map((x, i) => (
          <g key={x}>
            <line x1={x} y1={6} x2={x} y2={48} stroke={c} strokeWidth={2} opacity={0.6} />
            <rect x={x - 6} y={[30, 14, 24][i]} width={12} height={8} rx={2} fill={c} />
          </g>
        ))}
      </>
    ) : k === "sd" ? (
      <path d="M14 6h20l10 10v32H14z M20 6v8 M26 6v8 M32 6v8" fill="none" stroke={c} strokeWidth={3} strokeLinejoin="round" />
    ) : (
      <path d="M27 48V8 M27 8l-6 8h12z M27 30l-12-8v-6 M27 24l12-6v-6 M13 14h4v4h-4z M37 10a2.5 2.5 0 1 0 .1 0" fill="none" stroke={c} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
    )}
  </svg>
);
const TriPath: React.FC<SP> = (p) => {
  const { lb, ub } = local(p);
  const all = lb >= 4;
  const sx = 170;
  const sy = 660;
  const bp = beatPulse(p.g);
  return (
    <AbsoluteFill style={{ background: INK }}>
      <ClipBG id={lb < 4 ? "b04" : "b03"} u={p.u} from={lb < 4 ? 1 : 2.5} dim={0.3} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(10,8,6,.92) 0%, rgba(10,8,6,.55) 34%, rgba(10,8,6,.7) 70%, rgba(10,8,6,.95) 100%)" }} />
      <Chars key={all ? "b" : "a"} text={say(all ? "ALL AT ONCE" : "ONE PREAMP")} p={all ? ub * 1.4 : p.u * 1.3} size={96} stretch={118} weight={900} from={0.3} stagger={0.02} style={{ left: 56, top: 92 }} />
      <Reveal key={all ? "sb" : "sa"} text={say(all ? "Nothing to choose between" : "Three destinations, every take")} p={all ? ub - 0.05 : p.u - 0.25} size={46} font={SERIF} italic weight={400} style={{ left: 60, top: 206 }} />
      <div style={{ position: "absolute", right: 56, top: 286, width: 190, height: 112, borderRadius: 18, background: "#f6f2ea", overflow: "hidden", boxShadow: `0 0 30px rgba(242,184,75,.45)`, transform: `scale(${lerp(0.7, 1, backOut(ramp(p.u, 0.3, 0.7)))})`, opacity: clamp(ramp(p.u, 0.3, 0.5)) }}>
        <Img src={im("m16-16")} style={{ width: "100%", height: "100%", objectFit: "contain", padding: 8 }} />
      </div>
      <svg style={{ position: "absolute", left: 0, top: 0 }} width={W} height={W}>
        {PATHS.map((q, i) => {
          const on = all ? 1 : expo(ramp(lb + ub / 0.6, i + 0.6, i + 1.4));
          const d = `M ${sx} ${sy} C ${sx + 260} ${sy}, ${520} ${q.y}, ${700} ${q.y}`;
          const len = 620;
          const pulse = all || lb > i ? (ub / 0.6) % 1 : -1;
          return (
            <g key={q.title}>
              <path d={d} fill="none" stroke={q.col} strokeWidth={6} strokeDasharray={len} strokeDashoffset={len * (1 - on)} style={{ filter: `drop-shadow(0 0 ${10 + bp * 12}px ${q.col})` }} opacity={0.9} />
              {pulse >= 0
                ? (() => {
                    // position the travelling signal along the bezier by hand (render is frame-exact)
                    const tt = clamp(pulse * 1.6);
                    const bx = (1 - tt) ** 3 * sx + 3 * (1 - tt) ** 2 * tt * (sx + 260) + 3 * (1 - tt) * tt * tt * 520 + tt ** 3 * 700;
                    const by = (1 - tt) ** 3 * sy + 3 * (1 - tt) ** 2 * tt * sy + 3 * (1 - tt) * tt * tt * q.y + tt ** 3 * q.y;
                    return <circle cx={bx} cy={by} r={10} fill="#fff" opacity={1 - ramp(tt, 0.85, 1)} style={{ filter: `drop-shadow(0 0 14px ${q.col}) drop-shadow(0 0 28px ${q.col})` }} />;
                  })()
                : null}
            </g>
          );
        })}
        <circle cx={sx} cy={sy} r={62 + bp * 6} fill="rgba(20,16,12,.9)" stroke={GOLD} strokeWidth={4} style={{ filter: `drop-shadow(0 0 20px ${GOLD})` }} />
        {[[-18, -10], [18, -10], [0, 18]].map(([dx, dy], i) => (
          <circle key={i} cx={sx + dx} cy={sy + dy} r={8} fill={GOLD} />
        ))}
      </svg>
      <div style={{ position: "absolute", left: sx - 110, top: sy + 82, width: 220, textAlign: "center", fontFamily: MONO, fontSize: 15, letterSpacing: 3, color: CREAM }}>ULTRA-HDDA PREAMP</div>
      {PATHS.map((q, i) => {
        const on = all ? 1 : expo(ramp(lb + ub / 0.6, i + 1, i + 1.5));
        const hit = all ? Math.exp(-ub / 0.15) : 0;
        return (
          <div key={q.title} style={{ position: "absolute", left: 700, top: q.y - 58, width: 350, height: 116, borderRadius: 20, background: "linear-gradient(160deg, rgba(36,28,20,.92), rgba(14,11,8,.92))", border: `1.5px solid ${q.col}`, boxShadow: `0 0 ${18 + hit * 30}px ${q.col}66`, opacity: on, transform: `translateX(${(1 - on) * 60}px) scale(${1 + hit * 0.04})` }}>
            <Glyph k={q.ic} c={q.col} />
            <div style={{ position: "absolute", left: 88, top: 28, fontFamily: DISP, fontWeight: 800, fontStretch: "106%", fontSize: 25, color: PAPER, letterSpacing: 1, whiteSpace: "nowrap" }}>{q.title}</div>
            <div style={{ position: "absolute", left: 88, top: 64, fontFamily: SERIF, fontStyle: "italic", fontSize: 23, color: "rgba(246,240,230,.82)", whiteSpace: "nowrap" }}>{q.sub}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ================================================================ PRODUCT scene
const ProductScene: React.FC<SP & { it: Item; ord: number }> = (p) => {
  const { it, ord } = p;
  const { lb, ub, blen } = local(p);
  const view = it.views[lb % it.views.length];
  const [w0, h0] = A[view];
  const ar = w0 / h0;
  const flip = expo(ramp(ub, 0, Math.min(0.26, blen * 0.8)));
  const side = lb % 2 ? -1 : 1;
  const bgPhotos = it.photos.filter((k) => A[k][2] === "photo");
  const useClip = lb < 2;
  const photo = bgPhotos[(lb - 2 + bgPhotos.length * 4) % bgPhotos.length];
  const Wd = ar > 3.2 ? 900 : ar > 1.7 ? 800 : ar > 1.2 ? 700 : 560;
  const H = Math.min(ar < 1.1 ? 440 : 400, Wd / ar);
  const Wf = H * ar;
  const nameSize = Math.min(104, Math.floor(1000 / (it.name.length * 0.82)));
  const bp = beatPulse(p.g);
  const num = Number(it.big[0]);
  const strip = it.photos;
  const tile = 150;
  const span = strip.length * (tile + 12) + W;
  const sx = W - clamp(p.u / (p.d + 0.25)) * span;
  return (
    <AbsoluteFill style={{ background: INK }}>
      {useClip ? (
        <ClipBG id={it.clips[0]} u={p.u} from={1.5} dim={0.4} z={1.14 + (1 - flip) * 0.06} />
      ) : (
        <Cover key={photo} src={im(photo)} z={1.2 + ub * 0.06} x={side * (1 - flip) * 40} filter="brightness(.38) saturate(1.1) contrast(1.05)" />
      )}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(10,8,6,.92) 0%, rgba(10,8,6,.3) 34%, rgba(10,8,6,.35) 60%, rgba(10,8,6,.97) 84%)" }} />
      <AbsoluteFill style={{ background: `radial-gradient(760px 300px at 540px 640px, rgba(210,120,58,${0.24 + bp * 0.12}), transparent 70%)` }} />
      <Scramble key={"f" + it.key} text={`${it.family}  •  ${String(ord).padStart(2, "0")} / 05`} p={p.u} size={17} spacing={6} color={CREAM} style={{ left: 60, top: 64 }} />
      <Chars key={"n" + it.key} text={it.name} p={p.u * 1.3} size={nameSize} stretch={118} weight={900} spacing={1} from={0.3} stagger={0.018} style={{ left: 54, top: 98 }} />
      <Reveal key={"l" + it.key} text={it.line} p={p.u - 0.2} size={42} font={SERIF} italic weight={400} style={{ left: 60, top: 102 + nameSize * 1.1 }} />
      <div style={{ position: "absolute", right: 56, top: 112 + nameSize * 1.1 + 60, textAlign: "right", fontFamily: DISP, fontWeight: 900, fontStretch: "112%", fontSize: 128, lineHeight: 1, color: PAPER, opacity: expo(ramp(p.u, 0.1, 0.4)), transform: `scale(${1 + bp * 0.035})`, transformOrigin: "right center", textShadow: "0 12px 40px rgba(0,0,0,.8)" }}>
        {Number.isFinite(num) ? Math.round(lerp(0, num, expo(ramp(p.u, 0.1, 0.8)))) : it.big[0]}
        <div style={{ fontFamily: MONO, fontWeight: 400, fontSize: 20, letterSpacing: 6, color: GOLD, marginTop: 6 }}>{it.big[1]}</div>
      </div>
      <Product3D
        key={view + lb}
        src={im(view)}
        x={540}
        y={ar > 3.2 ? 620 : 600}
        w={Wf}
        h={H}
        ry={lerp(side * 75, side * 10, flip) - ub * 4 * side}
        rx={ar > 3.2 ? 14 : 9}
        z={lerp(-280, 0, flip)}
        scale={1 + bp * 0.022}
        opacity={clamp(flip * 1.6)}
        shine={ramp(ub, 0.05, blen * 1.1)}
        glow="rgba(242,184,75,.5)"
      />
      {/* film strip: every other still of this model streams past */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 832, height: 104, overflow: "hidden" }}>
        {strip.map((k, i) => {
          const x = sx + i * (tile + 12);
          if (x < -tile || x > W) return null;
          const paper = A[k][2] === "paper";
          return (
            <div key={k} style={{ position: "absolute", left: x, top: 2, width: tile, height: 100, borderRadius: 10, overflow: "hidden", background: paper ? "#f6f2ea" : "#140f0a", border: "1px solid rgba(242,184,75,.35)", boxShadow: "0 8px 20px rgba(0,0,0,.6)" }}>
              <Img src={im(k)} style={{ width: "100%", height: "100%", objectFit: paper ? "contain" : "cover" }} />
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 60, right: 60, bottom: 66, display: "flex", gap: 10, flexWrap: "nowrap" }}>
        {it.chips.map((c, k) => {
          const on = quint(ramp(p.u, 0.15 + k * 0.1, 0.45 + k * 0.1));
          const lit = k === lb % it.chips.length;
          return (
            <div key={c} style={{ padding: "9px 14px", borderRadius: 10, border: `1px solid ${lit ? GOLD : "rgba(255,255,255,.22)"}`, background: lit ? "rgba(242,184,75,.18)" : "rgba(255,255,255,.05)", fontFamily: MONO, fontSize: 16, letterSpacing: 2, color: PAPER, whiteSpace: "nowrap", opacity: on, transform: `translateY(${(1 - on) * 20}px)` }}>
              {c}
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 60, right: 60, bottom: 42, height: 3, background: "rgba(255,255,255,.1)" }}>
        <div style={{ width: `${((ord - 1 + clamp(p.u / p.d)) / 5) * 100}%`, height: 3, background: `linear-gradient(90deg, ${WOOD}, ${GOLD})`, boxShadow: `0 0 10px ${GOLD}` }} />
      </div>
    </AbsoluteFill>
  );
};

// ================================================================ LADDER (pre-drop 2: pick your size)
const LADDER: { k: string; img: string; inp: string; trk: string; extra: string }[] = [
  { k: "MODEL 12", img: "m12-08", inp: "10", trk: "12", extra: say("DAW CONTROL") },
  { k: "MODEL 16", img: "m16-08", inp: "14", trk: "16", extra: say("LIVE + RECORD") },
  { k: "MODEL 24", img: "m24-08", inp: "22", trk: "24", extra: say("100 mm FADERS") },
  { k: "MODEL 2400", img: "m2400-07", inp: "22", trk: "24", extra: say("FLAGSHIP + DAW") },
];
const Ladder: React.FC<SP> = (p) => {
  const { lb, ub } = local(p);
  const c = LADDER[Math.min(3, lb)];
  const a = expo(ramp(ub, 0, 0.2));
  const [w0, h0] = A[c.img];
  const pw = lerp(560, 860, Math.min(3, lb) / 3);
  return (
    <AbsoluteFill>
      <Stage g={p.g} glowY={650} />
      <Chars text={say("PICK YOUR SIZE")} p={p.u * 1.4} size={84} stretch={118} weight={900} from={0.3} stagger={0.02} style={{ left: 0, right: 0, top: 80, textAlign: "center" }} />
      <Product3D key={c.img} src={im(c.img)} x={540} y={600} w={pw} h={(pw * h0) / w0} ry={-14 + ub * 6} rx={10} scale={lerp(1.3, 1, a)} opacity={clamp(a * 1.5)} glow="rgba(242,184,75,.55)" />
      <div key={"n" + lb} style={{ position: "absolute", left: 0, right: 0, top: 200, display: "flex", justifyContent: "center", gap: 70, opacity: a, transform: `translateY(${(1 - a) * 30}px)` }}>
        {[
          [c.inp, "INPUTS"],
          [c.trk, "TRACKS"],
        ].map(([v, l]) => (
          <div key={l} style={{ textAlign: "center" }}>
            <div style={{ fontFamily: DISP, fontWeight: 900, fontStretch: "112%", fontSize: 120, lineHeight: 1, color: PAPER, textShadow: "0 0 30px rgba(242,184,75,.5)" }}>{Math.round(lerp(0, Number(v), expo(ramp(ub, 0, 0.35))))}</div>
            <div style={{ fontFamily: MONO, fontSize: 18, letterSpacing: 6, color: GOLD }}>{l}</div>
          </div>
        ))}
      </div>
      <div key={"k" + lb} style={{ position: "absolute", left: 0, right: 0, bottom: 150, textAlign: "center", fontFamily: DISP, fontWeight: 800, fontStretch: "118%", fontSize: 54, letterSpacing: lerp(16, 3, a), color: PAPER }}>{c.k}</div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 112, textAlign: "center", fontFamily: MONO, fontSize: 18, letterSpacing: 5, color: CREAM }}>{c.extra}</div>
      {/* the ladder itself: four rising steps */}
      <div style={{ position: "absolute", left: 300, right: 300, bottom: 50, height: 46, display: "flex", alignItems: "flex-end", gap: 12 }}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={{ flex: 1, height: 12 + i * 11, borderRadius: 4, background: i <= lb ? `linear-gradient(90deg, ${WOOD}, ${GOLD})` : "rgba(255,255,255,.12)", boxShadow: i === lb ? `0 0 18px ${GOLD}` : undefined }} />
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ================================================================ FINALE (drop 2): widescreen bands -> the wall of every still
const BANDS: [string, string, number][] = [
  ["v12", "MODEL 12", 7.3],
  ["v16", "MODEL 16", 11.3],
  ["v24", "MODEL 24", 5.5],
  ["v2400", "MODEL 2400", 0.0],
];
const Finale: React.FC<SP> = (p) => {
  const { lb, ub } = local(p);
  const bp = beatPulse(p.g);
  if (lb < 4) {
    return (
      <AbsoluteFill style={{ background: INK }}>
        {BANDS.map(([id, label, from], i) => {
          if (i > lb) return null;
          const t0 = p.g.beats[p.si + i] - p.s;
          const a = expo(ramp(p.u - t0, 0, 0.28));
          const dir = i % 2 ? -1 : 1;
          return (
            <div key={id} style={{ position: "absolute", left: 0, top: 14 + i * 266, width: W, height: 252, overflow: "hidden", transform: `translateX(${(1 - a) * dir * 110}%)`, borderTop: `1px solid rgba(242,184,75,.4)`, borderBottom: `1px solid rgba(242,184,75,.4)` }}>
              <OffthreadVideo src={clip(id)} startFrom={Math.round(from * 60)} muted style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(.78) contrast(1.06)" }} />
              <div style={{ position: "absolute", left: dir > 0 ? 24 : undefined, right: dir < 0 ? 24 : undefined, bottom: 18, padding: "8px 14px", borderRadius: 10, background: "rgba(10,8,6,.7)", border: `1px solid ${GOLD}`, fontFamily: MONO, fontSize: 16, letterSpacing: 4, color: PAPER }}>{label}</div>
            </div>
          );
        })}
        {lb >= 2 ? (
          <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center", background: `rgba(10,8,6,${0.45 * expo(ramp(ub + (lb - 2) * 0.67, 0, 0.3))})` }}>
            <div style={{ fontFamily: DISP, fontWeight: 900, fontStretch: "118%", fontSize: 112, lineHeight: 0.95, textAlign: "center", color: PAPER, textShadow: "0 0 50px rgba(242,184,75,.6), 0 10px 40px rgba(0,0,0,.9)", transform: `scale(${1 + bp * 0.04})` }}>
              {say("RECORD")}
              <br />
              <span style={{ color: GOLD }}>{say("EVERYTHING")}</span>
            </div>
          </AbsoluteFill>
        ) : null}
      </AbsoluteFill>
    );
  }
  // the wall: every still, camera pulls back from one tile to the whole series
  const t4 = p.g.beats[p.si + 4] - p.s;
  const v = p.u - t4;
  const pull = easeIO(ramp(v, 0, 1.9));
  const cols = 15;
  const tw = 136;
  const th = 102;
  const gap = 8;
  const n = CARDS.length;
  const rows = Math.ceil(n / cols);
  const wallW = cols * (tw + gap);
  const wallH = rows * (th + gap);
  const sc = lerp(3.2, 0.76, pull);
  const lock = quint(ramp(v, 1.5, 2.1));
  return (
    <AbsoluteFill style={{ background: INK, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 540, top: 540, perspective: 1600 }}>
        <div style={{ position: "absolute", left: -wallW / 2, top: -wallH / 2, width: wallW, height: wallH, transform: `scale(${sc}) rotateX(${lerp(18, 8, pull)}deg) rotateZ(${lerp(-6, 0, pull)}deg)`, transformStyle: "preserve-3d" }}>
          {CARDS.map((k, i) => {
            const c = i % cols;
            const r = Math.floor(i / cols);
            const wave = Math.exp(-Math.abs(((lb - 4) * 4 + ub * 6) - (c + r) * 0.5) / 1.2);
            return (
              <div key={k} style={{ position: "absolute", left: c * (tw + gap), top: r * (th + gap), width: tw, height: th, borderRadius: 6, overflow: "hidden", boxShadow: wave > 0.6 ? `0 0 0 2px ${GOLD}, 0 0 24px rgba(242,184,75,.7)` : "0 6px 14px rgba(0,0,0,.6)" }}>
                <Img src={card(i)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: `brightness(${0.55 + wave * 0.5 - lock * 0.25})` }} />
              </div>
            );
          })}
        </div>
      </div>
      <AbsoluteFill style={{ background: "radial-gradient(520px 300px at 50% 50%, rgba(10,8,6,.85) 30%, transparent 100%)", opacity: lock }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 410, textAlign: "center", opacity: lock, transform: `scale(${lerp(0.85, 1, lock)})` }}>
        <Img src={logo("tascam-white.png")} style={{ width: 560, filter: `drop-shadow(0 0 ${20 + bp * 24}px rgba(242,184,75,.85))` }} />
        <div style={{ marginTop: 26, fontFamily: MONO, fontSize: 22, letterSpacing: lerp(18, 9, lock), color: CREAM }}>{say("105 IMAGES  •  ONE SERIES")}</div>
      </div>
    </AbsoluteFill>
  );
};

// ================================================================ OUTRO — rotating carousel of every still, folding into the partner card
const Carousel: React.FC<{ g: G; u: number; si: number }> = ({ g, u, si }) => {
  const PER = 26;
  const R = 1100;
  const step = 360 / PER;
  const k = idxAt(g.beats, g.t);
  const kb = Math.max(0, k - si);
  const ph = clamp((g.t - g.beats[Math.max(0, k)]) / beatLen(g.beats, k));
  const surge = (kb + easeIO(ph)) * 10;
  const tilt = Math.sin(u * 0.7) * 3;
  const bp = beatPulse(g, 0.12);
  const rowsY = [-625, -375, -125, 125, 375, 625];
  const n = CARDS.length;
  return (
    <div style={{ position: "absolute", inset: 0, perspective: 1200 }}>
      <div style={{ position: "absolute", left: 540, top: 540, transformStyle: "preserve-3d", transform: `rotateX(${tilt}deg)` }}>
        {rowsY.map((ry, r) => {
          const dirR = r % 2 ? -1 : 1;
          const base = r * 6.9 + dirR * (surge + u * 5);
          return Array.from({ length: PER }).map((_, i) => {
            const slot = (r * PER + i * 7) % n;
            const theta = base + i * step;
            const rel = ((((theta + 180) % 360) + 360) % 360) - 180;
            if (Math.abs(rel) > 76) return null;
            const st = 0.018 * ((i + r * 5) % 16);
            const fly = quint(ramp(u, st, st + 0.6));
            const shade = Math.min(1, Math.abs(rel) / 85) * 0.62;
            return (
              <div key={r + "-" + i} style={{ position: "absolute", left: -140, top: ry - 105, width: 280, height: 210, transform: `rotateY(${theta}deg) translateZ(${-R + lerp(-1400, 0, fly)}px)`, backfaceVisibility: "hidden", borderRadius: 10, overflow: "hidden", opacity: fly, background: "#140f0a" }}>
                <Img src={card(slot)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={{ position: "absolute", inset: 0, background: INK, opacity: shade - (Math.abs(rel) < 7 ? bp * 0.15 : 0) }} />
              </div>
            );
          });
        })}
      </div>
    </div>
  );
};

const Pill: React.FC<{ children: React.ReactNode; style?: React.CSSProperties; on: number }> = ({ children, style, on }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 10,
      height: 52,
      padding: "0 22px",
      borderRadius: 26,
      background: "rgba(255,255,255,.06)",
      border: "1px solid rgba(255,255,255,.22)",
      boxShadow: "inset 0 1px 0 rgba(255,255,255,.12), 0 10px 30px rgba(0,0,0,.45)",
      fontFamily: MONO,
      fontSize: 19,
      letterSpacing: 0.5,
      color: PAPER,
      whiteSpace: "nowrap",
      opacity: on,
      transform: `translateY(${(1 - on) * 24}px) scale(${lerp(0.92, 1, on)})`,
      ...style,
    }}
  >
    {children}
  </div>
);

const Outro: React.FC<SP> = (p) => {
  const { g, u } = p;
  const bp = beatPulse(g, 0.12);
  const fold = easeIO(ramp(u, 3.0, 4.1));
  const L = u - 3.6;
  const on = (a: number) => quint(ramp(L, a, a + 0.5));
  // card window (screenshot layout): x 122-958, y 214-604
  const cx0 = 122;
  const cy0 = 214;
  const cw = 836;
  const ch = 390;
  const top = lerp(0, cy0, fold);
  const left = lerp(0, cx0, fold);
  const right = lerp(0, W - cx0 - cw, fold);
  const bottom = lerp(0, W - cy0 - ch, fold);
  const rad = lerp(0, 28, fold);
  const scale = lerp(1, 0.62, fold);
  const shiftY = lerp(0, cy0 + ch / 2 - 540, fold);
  return (
    <AbsoluteFill style={{ background: INK, overflow: "hidden" }}>
      <AbsoluteFill style={{ background: "radial-gradient(900px 600px at 50% 40%, rgba(210,120,58,.2), transparent 70%)" }} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, #17120d 0%, #0a0806 55%, #060504 100%)", opacity: fold }} />
      {/* the carousel, folding into the media card */}
      <div style={{ position: "absolute", top, left, right, bottom, borderRadius: rad, overflow: "hidden", border: fold > 0.02 ? `1px solid rgba(255,255,255,${0.2 * fold})` : undefined, boxShadow: fold > 0.02 ? `0 40px 90px rgba(0,0,0,.75), 0 0 ${40 + bp * 30}px rgba(242,184,75,${0.18 * fold})` : undefined }}>
        <div style={{ position: "absolute", left: -left, top: -top, width: W, height: W, transform: `translateY(${shiftY}px) scale(${scale})`, transformOrigin: "50% 50%" }}>
          <Carousel g={g} u={u} si={p.si} />
        </div>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(10,8,6,.82) 0%, rgba(10,8,6,.25) 55%, rgba(10,8,6,.15) 100%)", opacity: fold }} />
        <div style={{ position: "absolute", left: 30, top: 26, opacity: on(0.15) }}>
          <div style={{ fontFamily: DISP, fontWeight: 800, fontStretch: "100%", fontSize: 36, color: PAPER, letterSpacing: 0.5, whiteSpace: "nowrap" }}>{say("Model 12 • 16 • 24 • 2400")}</div>
          <div style={{ fontFamily: MONO, fontSize: 16, color: "rgba(246,240,230,.82)", marginTop: 8, letterSpacing: 1, whiteSpace: "nowrap" }}>{say("Mix • Record • Interface  +  Studio Bridge")}</div>
        </div>
        <Pill on={on(0.3)} style={{ position: "absolute", right: 22, top: 24, height: 44, fontSize: 16, padding: "0 18px" }}>
          {say("Technical consultation")}
        </Pill>
        <Pill on={on(0.45)} style={{ position: "absolute", left: "50%", bottom: 22, height: 48, fontSize: 17, transform: `translateX(-50%) translateY(${(1 - on(0.45)) * 24}px)`, background: "rgba(10,8,6,.62)" }}>
          <span style={{ fontFamily: DISP, fontWeight: 800, letterSpacing: 2 }}>{say("RECORDING SERIES")}</span>
          <span style={{ opacity: 0.8 }}>{say("Hybrid analog • SD multitrack • USB audio")}</span>
        </Pill>
      </div>
      {/* phase 1 caption over the full carousel */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 40, textAlign: "center", opacity: quint(ramp(u, 0.3, 0.8)) * (1 - fold) }}>
        <Scramble text={say("THE TASCAM RECORDING MIXER SERIES  •  105 IMAGES")} p={u - 0.3} size={18} spacing={5} color={CREAM} style={{ position: "relative", display: "inline-block" }} />
      </div>
      {/* partner layout */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 60, textAlign: "center", opacity: on(0) }}>
        <Img src={logo("tascam-white.png")} style={{ width: 380, filter: `drop-shadow(0 0 ${10 + bp * 14}px rgba(242,184,75,.5))` }} />
        <div style={{ marginTop: 14, fontFamily: MONO, fontSize: 15, letterSpacing: 8, color: "rgba(246,240,230,.8)" }}>{say("RECORDING MIXER SERIES")}</div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 628, textAlign: "center", opacity: on(0.6), transform: `translateY(${(1 - on(0.6)) * 20}px)` }}>
        <Img src={logo("shivansh-white.png")} style={{ width: 420 }} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 772, textAlign: "center", fontFamily: DISP, fontWeight: 700, fontSize: 25, letterSpacing: 0.5, color: PAPER, opacity: on(0.8) }}>{say("TASCAM's Authorized Partner")}</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 826, display: "flex", justifyContent: "center", gap: 16 }}>
        {["+91 98316 62458", "+91 91477 00677", "+91 89818 07755"].map((n, i) => (
          <Pill key={n} on={on(1.0 + i * 0.14)}>
            <Img src={icon("whatsapp")} style={{ width: 26, height: 26 }} />
            {say(n)}
          </Pill>
        ))}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 896, display: "flex", justifyContent: "center", gap: 16 }}>
        <Pill on={on(1.5)}>
          <Img src={icon("website")} style={{ width: 26, height: 26 }} />
          {say("shivanshelectronics.in")}
        </Pill>
        <Pill on={on(1.65)}>
          {["instagram", "youtube", "facebook"].map((k) => (
            <Img key={k} src={icon(k)} style={{ width: 26, height: 26 }} />
          ))}
          <span style={{ marginLeft: 4 }}>{say("Follow Shivansh Electronics")}</span>
        </Pill>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 986, textAlign: "center", fontFamily: MONO, fontSize: 14, letterSpacing: 5, color: "rgba(246,240,230,.55)", opacity: on(1.9) }}>{say("STUDIO DESIGN  •  RECORDING WORKFLOW  •  SYSTEM INTEGRATION")}</div>
    </AbsoluteFill>
  );
};

// ================================================================ assembly
const NOISE = staticFile("rec/noise.png");
const PLAN: [string, number][] = [
  ["hook", 1],
  ["hero", 2],
  ["tripath", 2],
  ["m12", 2],
  ["m16", 2],
  ["m24", 2],
  ["m2400", 3],
  ["sb", 2],
  ["ladder", 1],
  ["finale", 2],
];
const TRANS: Record<string, TT> = { hook: "zoom", hero: "punch", tripath: "split", m12: "whip", m16: "wipe", m24: "whip", m2400: "iris", sb: "whip", ladder: "zoom", finale: "punch", outro: "iris" };

export const schedule = () => {
  const rows: { id: string; s: number; e: number; si: number }[] = [];
  let k = 0;
  for (const [id, n] of PLAN) {
    rows.push({ id, s: DOWNS[k], e: DOWNS[k + n], si: idxAt(BEATS, DOWNS[k] + 0.01) });
    k += n;
  }
  return { rows, outroAt: DOWNS[k], outroSi: idxAt(BEATS, DOWNS[k] + 0.01) };
};

export const Reel: React.FC = () => {
  useFonts();
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const t = frame / fps;
  const end = durationInFrames / fps;
  const g: G = { t, beats: BEATS, downs: DOWNS };
  const { rows, outroAt, outroSi } = schedule();
  const all = [...rows, { id: "outro", s: outroAt, e: end + 1, si: outroSi }];
  const dirs = all.map((_, i) => (i % 2 ? -1 : 1));
  const cuts = all.slice(1).map((r, i) => ({ t: r.s, type: TRANS[r.id] ?? "split", dir: dirs[i + 1], big: DROPS.some((d) => Math.abs(d - r.s) < 0.05) }));
  const onDrop = DROPS.some((d) => t >= d && t < d + 0.5);
  const shake = onDrop ? Math.exp(-(t - DROPS.filter((d) => t >= d).slice(-1)[0]) / 0.12) : 0;
  const cam = t >= DROPS[0] && t < outroAt ? 1 + beatPulse(g, 0.09) * 0.012 + barPulse(g) * 0.018 : 1;
  return (
    <AbsoluteFill style={{ background: INK, overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${cam}) translate(${(rnd(frame) - 0.5) * 22 * shake}px, ${(rnd(frame + 3) - 0.5) * 22 * shake}px)` }}>
        {all.map((r, i) => {
          const tin = TRANS[r.id] ?? "split";
          const tout = i < all.length - 1 ? (TRANS[all[i + 1].id] ?? "split") : null;
          const render = (u: number, dd: number) => {
            const sp: SP = { g, u, d: dd, s: r.s, si: r.si };
            if (r.id === "hook") return <Hook {...sp} />;
            if (r.id === "hero") return <Hero {...sp} />;
            if (r.id === "tripath") return <TriPath {...sp} />;
            if (r.id === "ladder") return <Ladder {...sp} />;
            if (r.id === "finale") return <Finale {...sp} />;
            if (r.id === "outro") return <Outro {...sp} />;
            return <ProductScene {...sp} it={P[r.id]} ord={ORDER.indexOf(r.id) + 1} />;
          };
          return (
            // the Sequence restarts the local clock so every clip plays from the start of its scene
            <Sequence key={r.id + i} from={Math.max(0, Math.round((r.s - 0.2) * fps))} layout="none">
              <Scene g={g} s={r.s} e={r.e} tin={tin} tout={tout} dir={dirs[i]}>
                {render}
              </Scene>
            </Sequence>
          );
        })}
      </AbsoluteFill>
      <CutFx g={g} cuts={cuts} />
      <Hud g={g} frame={frame} opacity={1 - ramp(t, outroAt - 0.2, outroAt + 0.1)} />
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 50%, transparent 58%, rgba(0,0,0,.5) 100%)", pointerEvents: "none" }} />
      <AbsoluteFill style={{ backgroundImage: `url(${NOISE})`, backgroundPosition: `${Math.floor(rnd(frame) * 256)}px ${Math.floor(rnd(frame + 7) * 256)}px`, opacity: 0.05, mixBlendMode: "overlay", pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};
