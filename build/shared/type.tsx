/**
 * TYPOGRAPHIC COMPONENTS.
 *
 * The style objects live in fonts.ts; these are the animated carriers. The
 * kinetic headline lays out ONE FLEX ROW PER AUTHORED LINE while keeping a
 * single continuous word index for the stagger — the M-Series long-form found
 * that splitting on spaces into one wrapping row lets the browser break
 * wherever the column runs out, which reads as a typesetting mistake. Authored
 * "\n" is therefore honoured literally.
 */
import React from "react";
import { useCurrentFrame } from "remotion";
import { COLORS } from "./theme.ts";
import { headline, subhead, spec, micro, editorial } from "./fonts.ts";
import { EASE_OUT, ramp } from "./anim.ts";

/** Per-word stagger: word i starts `per` frames after word i-1. */
const stag = (i: number, per: number, delay: number) => delay + i * per;

const pop = (f: number, at: number, len: number) =>
  ramp(f - at, 0, len, EASE_OUT);

export const KineticHeadline: React.FC<{
  text: string;
  size?: number;
  color?: string;
  weight?: 600 | 700 | 800 | 900;
  delay?: number;
  per?: number;
  gap?: number;
  align?: "left" | "center" | "right";
  serif?: boolean;
  style?: React.CSSProperties;
}> = ({
  text, size = 92, color = COLORS.ink, weight = 800, delay = 0,
  per = 2.4, gap = 18, align = "left", serif = false, style,
}) => {
  const f = useCurrentFrame();
  const lines = text.split("\n");
  let idx = 0;
  const justify = align === "center" ? "center" : align === "right" ? "flex-end" : "flex-start";
  const base = serif ? editorial(size, weight === 900 ? 700 : 600) : headline(size, weight);

  return (
    <div style={{ display: "flex", flexDirection: "column", ...style }}>
      {lines.map((line, li) => (
        <div
          key={li}
          style={{
            display: "flex", flexWrap: "wrap",
            gap: `${gap * 0.26}px ${gap}px`, justifyContent: justify,
          }}
        >
          {line.split(" ").filter(Boolean).map((w, wi) => {
            const s = pop(f, stag(idx++, per, delay), 15);
            return (
              <span
                key={wi}
                style={{
                  ...base, color, display: "inline-block",
                  transform: `translateY(${(1 - s) * 26}px)`,
                  opacity: Math.min(1, s * 1.6),
                }}
              >
                {w}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export const Sub: React.FC<{
  children: React.ReactNode; size?: number; color?: string;
  weight?: 400 | 500 | 600; delay?: number; style?: React.CSSProperties;
}> = ({ children, size = 30, color = COLORS.slate, weight = 500, delay = 0, style }) => {
  const f = useCurrentFrame();
  const p = ramp(f, delay, 20);
  return (
    <div style={{ ...subhead(size, weight), color, opacity: p,
      transform: `translateY(${(1 - p) * 14}px)`, ...style }}>
      {children}
    </div>
  );
};

export const Micro: React.FC<{
  children: React.ReactNode; size?: number; color?: string;
  weight?: 500 | 600 | 700; tracking?: string; delay?: number;
  style?: React.CSSProperties;
}> = ({ children, size = 19, color = COLORS.slateDim, weight = 600,
        tracking = "0.16em", delay = 0, style }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ ...micro(size, weight, tracking), color,
      opacity: ramp(f, delay, 18), ...style }}>
      {children}
    </div>
  );
};

/**
 * LEVEL 1 SPECIFICATION CALLOUT. Tabular numerals mean the value never
 * reflows, so the latch animation reads as a mechanical seat rather than a
 * shimmy. Values arrive here only via specValue(), so an UNVERIFIED figure
 * cannot be typeset.
 */
export const SpecCallout: React.FC<{
  label: string; value: string; delay?: number;
  size?: number; labelSize?: number; accent?: string;
  align?: "left" | "right"; style?: React.CSSProperties;
}> = ({ label, value, delay = 0, size = 40, labelSize = 17,
        accent = COLORS.accent, align = "left", style }) => {
  const f = useCurrentFrame();
  const p = ramp(f, delay, 16);
  const rule = ramp(f, delay + 6, 22);
  return (
    <div style={{ opacity: p, textAlign: align, ...style }}>
      <div style={{ ...micro(labelSize, 700, "0.20em"), color: accent,
        marginBottom: 10 }}>{label}</div>
      <div style={{ height: 2, background: accent, opacity: 0.30,
        width: `${rule * 100}%`, marginLeft: align === "right" ? "auto" : 0,
        marginBottom: 12 }} />
      <div style={{ ...spec(size, 700, "0.01em"), color: COLORS.ink,
        transform: `translateY(${(1 - p) * 8}px)` }}>{value}</div>
    </div>
  );
};

/** A tracked chip — tier badges, path names, port counts. */
export const Chip: React.FC<{
  children: React.ReactNode; color?: string; bg?: string;
  size?: number; delay?: number; style?: React.CSSProperties;
}> = ({ children, color = COLORS.accent, bg, size = 17, delay = 0, style }) => {
  const f = useCurrentFrame();
  const p = ramp(f, delay, 16);
  return (
    <div style={{
      ...micro(size, 700, "0.18em"), color,
      background: bg ?? "rgba(138,58,18,0.07)",
      border: `1px solid ${color}`, borderRadius: 999,
      padding: `${size * 0.42}px ${size * 1.0}px`,
      display: "inline-block", opacity: p,
      transform: `translateY(${(1 - p) * 10}px)`, ...style,
    }}>
      {children}
    </div>
  );
};
