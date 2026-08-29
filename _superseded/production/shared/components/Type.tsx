/**
 * STAGE 10 INFORMATION HIERARCHY.
 *
 * Level 1 (Hero)  — crucial VERIFIED metrics, monospaced/geometric, stark white
 *                   or technical amber. This layer stands in the position that
 *                   pricing normally occupies; there is no pricing anywhere in
 *                   this project, and every string here traces to a Stage 8
 *                   master table (spec.ts enforces it).
 * Level 2 (Sub)   — brief technical context supporting the hero metric, in a
 *                   standard sans at regular weight and "50% opacity relative
 *                   to the hero text".
 *
 * Contrast is re-derived for this dark ground. The MOTU AVB reference's
 * dark-ink-on-light-page ratios are deliberately not assumed to transfer.
 */
import React from "react";
import { COLOR } from "../theme.ts";
import { MONO, SANS } from "../fonts.ts";

export const Hero: React.FC<{
  children: React.ReactNode;
  size?: number;
  tone?: "ink" | "amber";
  weight?: number;
  tracking?: number;
  style?: React.CSSProperties;
}> = ({ children, size = 96, tone = "ink", weight = 700, tracking = -1, style }) => (
  <div
    style={{
      fontFamily: MONO,
      fontSize: size,
      fontWeight: weight,
      letterSpacing: tracking,
      lineHeight: 1.02,
      color: tone === "amber" ? COLOR.amber : COLOR.ink,
      fontVariantNumeric: "tabular-nums",
      ...style,
    }}
  >
    {children}
  </div>
);

/** Level 2 — held at 50% relative to the hero, exactly as Stage 10 specifies. */
export const Sub: React.FC<{
  children: React.ReactNode; size?: number; style?: React.CSSProperties;
}> = ({ children, size = 27, style }) => (
  <div
    style={{
      fontFamily: SANS,
      fontSize: size,
      fontWeight: 400,
      letterSpacing: 0.2,
      lineHeight: 1.34,
      color: COLOR.ink,
      opacity: 0.5,
      ...style,
    }}
  >
    {children}
  </div>
);

/** Small tracked label — chapter marks, unit names, tier tags. */
export const Label: React.FC<{
  children: React.ReactNode; size?: number; tone?: string; style?: React.CSSProperties;
}> = ({ children, size = 17, tone = COLOR.rimBright, style }) => (
  <div
    style={{
      fontFamily: MONO,
      fontSize: size,
      fontWeight: 500,
      letterSpacing: size * 0.19,
      textTransform: "uppercase",
      color: tone,
      ...style,
    }}
  >
    {children}
  </div>
);

/** A spec row: parameter on the left, verified value on the right. */
export const SpecRow: React.FC<{
  k: string; v: string; size?: number; opacity?: number;
}> = ({ k, v, size = 21, opacity = 1 }) => (
  <div
    style={{
      display: "flex", gap: 20, alignItems: "baseline", opacity,
      borderTop: `1px solid ${COLOR.line}`, padding: "11px 0",
    }}
  >
    <div style={{ fontFamily: SANS, fontSize: size * 0.84, color: COLOR.inkDim, flex: "0 0 36%", letterSpacing: 0.3 }}>
      {k}
    </div>
    <div style={{ fontFamily: MONO, fontSize: size, color: COLOR.ink, fontVariantNumeric: "tabular-nums", fontWeight: 500 }}>
      {v}
    </div>
  </div>
);

/** Tier tag. The four-tier architecture is load-bearing, so it is stated
 *  explicitly wherever a unit is introduced rather than left implicit. */
export const TierTag: React.FC<{ n: number; name: string; size?: number }> = ({ n, name, size = 15 }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
    <div
      style={{
        fontFamily: MONO, fontSize: size, fontWeight: 700, color: COLOR.void,
        background: COLOR.amber, padding: "3px 9px", letterSpacing: 1,
      }}
    >
      TIER {n}
    </div>
    <Label size={size} tone={COLOR.inkDim}>{name}</Label>
  </div>
);
