import React from "react";
import { AbsoluteFill, Img, continueRender, delayRender, staticFile } from "remotion";

export const im = (k: string) => staticFile(`rec/img/${k}.webp`);
export const card = (i: number) => staticFile(`rec/card/c${String(i).padStart(3, "0")}.webp`);
export const logo = (k: string) => staticFile(`rec/logo/${k}`);
export const icon = (k: string) => staticFile(`rec/icon/${k}.png`);
export const clip = (k: string) => staticFile(`rec/clip/${k}.mp4`);

export const INK = "#0A0806"; // warm studio black
export const PAPER = "#F6F0E6";
export const GOLD = "#F2B84B"; // Model-series master-section gold
export const WOOD = "#D2783A"; // walnut end-cheek highlight
export const REC = "#FF3B30"; // record-arm red
export const CREAM = "#FFE2A8";
// aliases kept so shared helpers read the same as the earlier reels
export const TEAL = GOLD;
export const VIOLET = REC;
export const AMBER = CREAM;
export const DISP = "'Archivo', sans-serif";
export const SERIF = "'Instrument Serif', serif";
export const MONO = "'JetBrains Mono', monospace";

export const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const ramp = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
export const expo = (x: number) => (clamp(x) >= 1 ? 1 : 1 - Math.pow(2, -10 * clamp(x)));
export const quint = (x: number) => 1 - Math.pow(1 - clamp(x), 5);
export const easeIO = (x: number) => {
  x = clamp(x);
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
};
export const backOut = (x: number, s = 1.6) => {
  x = clamp(x);
  return 1 + (s + 1) * Math.pow(x - 1, 3) + s * Math.pow(x - 1, 2);
};
export const rnd = (i: number) => {
  const s = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};

// ---------------------------------------------------------------- fonts
let fontPromise: Promise<void> | null = null;
const loadFonts = () => {
  if (!fontPromise) {
    const f = (fam: string, file: string, d: FontFaceDescriptors) => new FontFace(fam, `url(${staticFile("rec/fonts/" + file)})`, d);
    const faces = [
      f("Archivo", "archivo-latin-standard-normal.woff2", { weight: "100 900", stretch: "62% 125%" }),
      f("Instrument Serif", "instrument-serif-latin-400-normal.woff2", { weight: "400" }),
      f("Instrument Serif", "instrument-serif-latin-400-italic.woff2", { weight: "400", style: "italic" }),
      f("JetBrains Mono", "JetBrainsMono-normal-400.woff2", { weight: "400" }),
    ];
    fontPromise = Promise.all(faces.map((x) => x.load())).then((loaded) => {
      loaded.forEach((x) => (document.fonts as unknown as { add: (y: FontFace) => void }).add(x));
    });
  }
  return fontPromise;
};
export const useFonts = () => {
  const [h] = React.useState(() => delayRender("rec fonts"));
  React.useEffect(() => {
    loadFonts().then(
      () => continueRender(h),
      () => continueRender(h),
    );
  }, [h]);
};

// ---------------------------------------------------------------- product in 3D space
/** A transparent product cut-out placed in a perspective space, with floor reflection,
 *  coloured rim glow and a specular sweep masked to its alpha. */
export const Product3D: React.FC<{
  src: string;
  x: number;
  y: number;
  w: number;
  h: number;
  rx?: number;
  ry?: number;
  rz?: number;
  z?: number;
  scale?: number;
  opacity?: number;
  shine?: number;
  glow?: string;
  reflect?: boolean;
  blur?: number;
  persp?: number;
}> = ({ src, x, y, w, h, rx = 0, ry = 0, rz = 0, z = 0, scale = 1, opacity = 1, shine, glow = "rgba(242,184,75,.35)", reflect = true, blur = 0, persp = 1400 }) => {
  const sweep = shine !== undefined && shine > 0 && shine < 1;
  const sp = lerp(-30, 130, shine ?? 0);
  const body = (
    <div style={{ position: "relative", width: w, height: h }}>
      <Img src={src} style={{ width: "100%", height: "100%", objectFit: "contain", filter: `drop-shadow(0 0 28px ${glow}) drop-shadow(0 30px 40px rgba(0,0,0,.7))` }} />
      {sweep ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(100deg, transparent ${sp - 12}%, rgba(255,255,255,.5) ${sp}%, transparent ${sp + 12}%)`,
            WebkitMaskImage: `url(${src})`,
            WebkitMaskSize: "contain",
            WebkitMaskRepeat: "no-repeat",
            WebkitMaskPosition: "center",
            mixBlendMode: "screen",
          }}
        />
      ) : null}
    </div>
  );
  return (
    <div style={{ position: "absolute", left: x - w / 2, top: y - h / 2, width: w, height: h, perspective: persp, opacity, filter: blur > 0.3 ? `blur(${blur.toFixed(1)}px)` : undefined }}>
      <div style={{ width: w, height: h, transformStyle: "preserve-3d", transform: `translateZ(${z}px) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg) scale(${scale})` }}>
        {body}
        {reflect ? (
          <div
            style={{
              position: "absolute",
              left: 0,
              top: h * 0.98,
              width: w,
              height: h,
              transform: "scaleY(-1)",
              opacity: 0.22,
              WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,.9), transparent 45%)",
              filter: "blur(2px)",
            }}
          >
            <Img src={src} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export const Cover: React.FC<{ src: string; z?: number; x?: number; y?: number; opacity?: number; filter?: string; pos?: string; style?: React.CSSProperties }> = ({
  src,
  z = 1,
  x = 0,
  y = 0,
  opacity = 1,
  filter,
  pos = "center",
  style,
}) => (
  <AbsoluteFill style={{ overflow: "hidden", opacity, ...style }}>
    <Img src={src} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: pos, transform: `translate(${x}px, ${y}px) scale(${z})`, filter }} />
  </AbsoluteFill>
);

/** Masked word rise. */
export const Reveal: React.FC<{
  text: string;
  p: number;
  size: number;
  font?: string;
  weight?: number;
  italic?: boolean;
  color?: string;
  spacing?: number;
  stretch?: number;
  stagger?: number;
  upper?: boolean;
  style?: React.CSSProperties;
}> = ({ text, p, size, font = DISP, weight = 700, italic, color = PAPER, spacing = 0, stretch = 100, stagger = 0.045, upper, style }) => {
  const words = text.split(" ");
  return (
    <div style={{ position: "absolute", fontFamily: font, fontSize: size, fontWeight: weight, fontStretch: `${stretch}%`, fontStyle: italic ? "italic" : "normal", color, letterSpacing: spacing, lineHeight: 1.04, textTransform: upper ? "uppercase" : "none", whiteSpace: "nowrap", ...style }}>
      {words.map((w, i) => {
        const a = quint(ramp(p, i * stagger, i * stagger + 0.42));
        return (
          <span key={i} style={{ display: "inline-block", overflow: "hidden", verticalAlign: "top", paddingBottom: size * 0.14, marginBottom: -size * 0.14 }}>
            <span style={{ display: "inline-block", transform: `translateY(${(1 - a) * 115}%) rotate(${(1 - a) * 6}deg)`, transformOrigin: "left bottom" }}>
              {w}
              {i < words.length - 1 ? " " : ""}
            </span>
          </span>
        );
      })}
    </div>
  );
};

/** Per-letter 3D flip-in with tracking collapse. */
export const Chars: React.FC<{
  text: string;
  p: number;
  size: number;
  weight?: number;
  stretch?: number;
  color?: string;
  spacing?: number;
  from?: number;
  stagger?: number;
  style?: React.CSSProperties;
  stroke?: string;
}> = ({ text, p, size, weight = 800, stretch = 125, color = PAPER, spacing = 0, from = 0.6, stagger = 0.035, style, stroke }) => (
  <div style={{ position: "absolute", fontFamily: DISP, fontSize: size, fontWeight: weight, fontStretch: `${stretch}%`, color, whiteSpace: "nowrap", lineHeight: 1, perspective: 900, ...style }}>
    {text.split("").map((c, i) => {
      const a = quint(ramp(p, i * stagger, i * stagger + 0.5));
      return (
        <span
          key={i}
          style={{
            display: "inline-block",
            marginRight: lerp(size * from, spacing, a),
            opacity: a,
            transform: `rotateX(${(1 - a) * -90}deg) translateY(${(1 - a) * 30}px)`,
            transformOrigin: "50% 100%",
            color: stroke ? "transparent" : color,
            WebkitTextStroke: stroke,
          }}
        >
          {c === " " ? " " : c}
        </span>
      );
    })}
  </div>
);

export const Scramble: React.FC<{ text: string; p: number; size?: number; color?: string; style?: React.CSSProperties; spacing?: number }> = ({
  text,
  p,
  size = 16,
  color = "rgba(242,244,247,.78)",
  style,
  spacing = 3,
}) => {
  const n = text.length;
  const shown = Math.floor(clamp(p / 0.38) * n);
  const glyphs = "01<>/#=+*";
  let s = "";
  for (let i = 0; i < n; i++) {
    if (text[i] === " ") s += " ";
    else if (i < shown) s += text[i];
    else if (i < shown + 4 && p > 0) s += glyphs[Math.floor(rnd(i + Math.floor(p * 30)) * glyphs.length)];
    else s += " ";
  }
  return <div style={{ position: "absolute", fontFamily: MONO, fontSize: size, color, letterSpacing: spacing, whiteSpace: "pre", ...style }}>{s}</div>;
};

export const Brackets: React.FC<{ x: number; y: number; w: number; h: number; p: number; color?: string; len?: number }> = ({ x, y, w, h, p, color = "rgba(242,244,247,.6)", len = 26 }) => {
  const a = expo(p);
  const L = len * a;
  const st: React.CSSProperties = { position: "absolute", borderColor: color, borderStyle: "solid", width: L, height: L, opacity: a };
  return (
    <>
      <div style={{ ...st, left: x, top: y, borderWidth: "2px 0 0 2px" }} />
      <div style={{ ...st, left: x + w - L, top: y, borderWidth: "2px 2px 0 0" }} />
      <div style={{ ...st, left: x, top: y + h - L, borderWidth: "0 0 2px 2px" }} />
      <div style={{ ...st, left: x + w - L, top: y + h - L, borderWidth: "0 2px 2px 0" }} />
    </>
  );
};

/** Luminous line: walnut -> white -> gold with bloom. */
export const HorizonLine: React.FC<{ y: number; w: number; p?: number; glow?: number; opacity?: number; x?: number }> = ({ y, w, p = 1, glow = 1, opacity = 1, x = 540 }) => (
  <div
    style={{
      position: "absolute",
      top: y - 1.5,
      left: x - (w / 2) * p,
      width: w * p,
      height: 3,
      opacity,
      background: `linear-gradient(90deg, transparent, ${WOOD} 22%, #ffffff 50%, ${GOLD} 78%, transparent)`,
      boxShadow: `0 0 ${14 * glow}px rgba(242,184,75,.9), 0 0 ${46 * glow}px rgba(255,226,168,.45)`,
    }}
  />
);
