/**
 * STAGE 10 PERSISTENT BRANDING.
 *
 * This replaces the MOTU AVB reference's intermittent logo-cadence pattern
 * outright — no cadence timer is layered on top. Both elements below are
 * mounted by Shell for the FULL runtime of every deliverable:
 *
 *   Watermark   Shivansh mark, top-right safe margin, continuous 60% opacity.
 *   Data Ribbon extreme bottom edge, continuous. Left = website, centre = the
 *               three social handles pipe-separated, right = the three contact
 *               lines. Micro-text, high tracking, medium grey, unobtrusive to
 *               the main visual but constantly available.
 *
 * The Ribbon sits outside the caption-safe band on purpose: it is persistent
 * broadcast furniture, and Stage 10 places it at "the extreme bottom edge of
 * the frame". The safe band continues to govern everything a viewer must read
 * to follow the argument.
 */
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { COLOR, RIBBON, WATERMARK } from "../theme.ts";
import { BRAND, RIBBON_CENTER, RIBBON_LEFT, RIBBON_RIGHT } from "../brand.ts";
import { MONO, SANS } from "../fonts.ts";

export const Watermark: React.FC<{ portrait?: boolean }> = ({ portrait }) => {
  const w = portrait ? WATERMARK.portrait : WATERMARK.landscape;
  return (
    <Img
      src={staticFile("logo/shivansh-watermark.png")}
      style={{
        position: "absolute", top: w.top, right: w.right, width: w.width,
        opacity: WATERMARK.opacity, pointerEvents: "none",
        // The mark is white, and it passes over light content (a lit master
        // section, a reference sheet's white gutter). A tight shadow keeps it
        // legible on any ground without making it louder on the dark default.
        filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.9))",
      }}
    />
  );
};

export const DataRibbon: React.FC<{ portrait?: boolean }> = ({ portrait }) => {
  const r = portrait ? RIBBON.portrait : RIBBON.landscape;
  const cell: React.CSSProperties = {
    fontFamily: SANS, fontSize: r.fontSize, letterSpacing: r.tracking,
    color: COLOR.ribbon, whiteSpace: "nowrap", fontWeight: 400,
  };
  const frame: React.CSSProperties = {
    position: "absolute", left: 0, right: 0, bottom: 0, height: r.height,
    paddingLeft: r.inset + 14, paddingRight: r.inset + 14,
    borderTop: `1px solid ${COLOR.line}`,
    background: "linear-gradient(180deg, rgba(8,9,11,0) 0%, rgba(8,9,11,0.92) 62%)",
    pointerEvents: "none",
  };

  // 1080px cannot carry the website, three social handles and three contact
  // lines on ONE row at a legible size — the zones collided. Portrait therefore
  // splits the same content across two rows, still at the extreme bottom edge
  // and still in Stage 10's left / centre / right reading order.
  if (portrait) {
    return (
      <div style={{ ...frame, display: "flex", flexDirection: "column", justifyContent: "center", gap: 3 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={cell}>{RIBBON_LEFT}</div>
          <div style={{ ...cell, color: COLOR.inkDim }}>{RIBBON_RIGHT}</div>
        </div>
        <div style={{ ...cell, textAlign: "center", fontSize: r.fontSize - 0.5 }}>{RIBBON_CENTER}</div>
      </div>
    );
  }

  return (
    <div style={{ ...frame, display: "flex", alignItems: "center" }}>
      <div style={{ ...cell, flex: "0 0 auto" }}>{RIBBON_LEFT}</div>
      <div style={{ ...cell, flex: 1, textAlign: "center", overflow: "hidden" }}>{RIBBON_CENTER}</div>
      <div style={{ ...cell, flex: "0 0 auto", color: COLOR.inkDim }}>{RIBBON_RIGHT}</div>
    </div>
  );
};

/**
 * The resolution screen. Stage 7 Phase 4 pivots off hardware entirely and
 * closes on engineering credibility — never on a price. Laid out as a
 * schematic legend: mark, descriptor, then the contact telemetry with the
 * three numbers stacked vertically and left-aligned so nothing crowds.
 */
export const OutroLegend: React.FC<{ portrait?: boolean; opacity?: number }> = ({ portrait, opacity = 1 }) => {
  const s = portrait ? 1.16 : 1.18;
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 26 * s }}>
        <Img src={staticFile("logo/shivansh-watermark.png")} style={{ width: 460 * s, opacity: 0.95 }} />
        <div
          style={{
            fontFamily: MONO, fontSize: 21 * s, letterSpacing: 6.5 * s,
            color: COLOR.amber, textTransform: "uppercase",
          }}
        >
          {BRAND.descriptor}
        </div>
        <div style={{ width: 300 * s, height: 1, background: COLOR.lineStrong, margin: `${6 * s}px 0` }} />

        <div style={{ display: "flex", flexDirection: "column", gap: 13 * s, alignItems: "flex-start" }}>
          <Row s={s} k="WEB" v={BRAND.website} />
          <Row s={s} k="IG " v={BRAND.socials[0]} />
          <Row s={s} k="FB " v={BRAND.socials[1]} />
          <Row s={s} k="YT " v={BRAND.socials[2]} />
        </div>

        <div style={{ width: 300 * s, height: 1, background: COLOR.lineStrong, margin: `${6 * s}px 0` }} />

        <div style={{ display: "flex", flexDirection: "column", gap: 11 * s, alignItems: "flex-start" }}>
          <div
            style={{
              fontFamily: MONO, fontSize: 15 * s, letterSpacing: 4.2 * s,
              color: COLOR.rimBright, textTransform: "uppercase", marginBottom: 3 * s,
            }}
          >
            Comms — Call / WhatsApp
          </div>
          {BRAND.numbers.map((n) => (
            <div
              key={n}
              style={{
                fontFamily: MONO, fontSize: 30 * s, fontWeight: 600, color: COLOR.ink,
                letterSpacing: 1.4 * s, fontVariantNumeric: "tabular-nums",
              }}
            >
              {n}
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Row: React.FC<{ s: number; k: string; v: string }> = ({ s, k, v }) => (
  <div style={{ display: "flex", gap: 16 * s, alignItems: "baseline" }}>
    <span style={{ fontFamily: MONO, fontSize: 14 * s, letterSpacing: 2.6 * s, color: COLOR.rim }}>{k}</span>
    <span style={{ fontFamily: SANS, fontSize: 19 * s, color: COLOR.inkDim, letterSpacing: 0.4 }}>{v}</span>
  </div>
);
