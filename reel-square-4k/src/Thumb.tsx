import React from "react";
import { AbsoluteFill, Img } from "remotion";
import { CREAM, DISP, GOLD, HorizonLine as GlowLine, INK, MONO, PAPER, Product3D, REC, SERIF, WOOD, im, logo, useFonts } from "./kit";
import { A, say } from "./data";

/** 4K portrait cover (1080 x 1920 design, rendered at 2x = 2160 x 3840). The hook claim from the
 *  reel's first frame, carried large enough to read as a grid tile; the whole range below it. */
const STACK: [string, number, number, number, number][] = [
  ["sb-03", 800, 870, 420, 14],
  ["m12-07", 260, 900, 440, -14],
  ["m24-08", 330, 1060, 700, -10],
  ["m2400-07", 600, 1140, 900, -8],
];

export const Thumb: React.FC = () => {
  useFonts();
  const chips: [string, string, string][] = [
    [say("MIX"), say("ANALOG, ZERO LATENCY"), GOLD],
    [say("REC"), say("24-TRACK SD"), REC],
    [say("USB"), say("AUDIO INTERFACE"), CREAM],
  ];
  return (
    <AbsoluteFill style={{ background: INK, overflow: "hidden" }}>
      <AbsoluteFill style={{ background: "radial-gradient(900px 900px at 540px 1060px, rgba(210,120,58,.36), transparent 70%)" }} />
      <AbsoluteFill style={{ background: "radial-gradient(520px 420px at 540px 420px, rgba(242,184,75,.16), transparent 70%)" }} />
      <AbsoluteFill
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,.07) 1.1px, transparent 1.3px)",
          backgroundSize: "15px 15px",
          WebkitMaskImage: "radial-gradient(620px 760px at 50% 52%, black, transparent 75%)",
          opacity: 0.55,
        }}
      />
      <svg style={{ position: "absolute", left: 0, top: 0 }} width={1080} height={1920}>
        {[1.2, 1.4].map((r) => (
          <circle key={r} cx={540} cy={1040} r={430 * r} fill="none" stroke="rgba(255,255,255,.06)" strokeWidth={1.5} />
        ))}
        <circle cx={540} cy={1040} r={430} fill="none" stroke={GOLD} strokeWidth={5} style={{ filter: `drop-shadow(0 0 18px ${GOLD}) drop-shadow(0 0 44px rgba(210,120,58,.7))` }} />
      </svg>

      <Img src={logo("tascam-white.png")} style={{ position: "absolute", width: 520, left: 280, top: 96, filter: "drop-shadow(0 0 24px rgba(242,184,75,.6))" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 240, textAlign: "center", fontFamily: MONO, fontSize: 24, letterSpacing: 9, color: CREAM }}>{say("RECORDING MIXER SERIES")}</div>

      {/* the hook */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 310, textAlign: "center", fontFamily: DISP, fontWeight: 900, fontStretch: "110%", fontSize: 150, lineHeight: 1, letterSpacing: 1, background: `linear-gradient(180deg, #ffffff 25%, ${GOLD} 120%)`, WebkitBackgroundClip: "text", color: "transparent", filter: "drop-shadow(0 0 30px rgba(242,184,75,.45))", whiteSpace: "nowrap" }}>
        {say("24 TRACKS")}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 482, textAlign: "center", fontFamily: DISP, fontWeight: 900, fontStretch: "106%", fontSize: 96, lineHeight: 1, color: "transparent", WebkitTextStroke: `3px ${PAPER}`, letterSpacing: 2, whiteSpace: "nowrap" }}>
        {say("NO COMPUTER")}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 616, display: "flex", justifyContent: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 26px", borderRadius: 40, background: "rgba(255,59,48,.12)", border: `2px solid ${REC}`, boxShadow: `0 0 30px rgba(255,59,48,.4)` }}>
          <div style={{ width: 22, height: 22, borderRadius: 11, background: REC, boxShadow: `0 0 18px ${REC}` }} />
          <span style={{ fontFamily: MONO, fontSize: 30, letterSpacing: 6, color: PAPER }}>{say("REC  •  STRAIGHT TO SD")}</span>
        </div>
      </div>

      {STACK.map(([k, x, y, w, ry]) => {
        const [w0, h0] = A[k];
        return <Product3D key={k} src={im(k)} x={x} y={y} w={w} h={(w * h0) / w0} ry={ry} rx={8} reflect={k === "m2400-07"} shine={k === "m2400-07" ? 0.55 : undefined} glow="rgba(242,184,75,.5)" />;
      })}

      <GlowLine y={1400} w={1020} glow={1.4} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 1420, textAlign: "center", fontFamily: SERIF, fontStyle: "italic", fontSize: 60, color: PAPER }}>{say("Model 12 • 16 • 24 • 2400 + Studio Bridge")}</div>

      <div style={{ position: "absolute", left: 60, right: 60, top: 1520, display: "flex", gap: 18 }}>
        {chips.map(([v, l, c]) => (
          <div key={v} style={{ flex: 1, padding: "18px 0 14px", borderRadius: 18, border: `1px solid ${c}99`, background: "rgba(255,255,255,.05)", textAlign: "center", boxShadow: `0 0 24px ${c}33` }}>
            <div style={{ fontFamily: DISP, fontWeight: 900, fontStretch: "112%", fontSize: 54, color: c, lineHeight: 1 }}>{v}</div>
            <div style={{ fontFamily: MONO, fontSize: 15, letterSpacing: 2, color: PAPER, marginTop: 8 }}>{l}</div>
          </div>
        ))}
      </div>

      <Img src={logo("shivansh-white.png")} style={{ position: "absolute", width: 640, left: 220, top: 1700 }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 8, background: `linear-gradient(90deg, ${WOOD}, ${GOLD}, ${REC})` }} />
    </AbsoluteFill>
  );
};
