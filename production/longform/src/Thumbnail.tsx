/**
 * LANDSCAPE THUMBNAIL — 1920 x 1080.
 *
 * Reflects the confirmed architecture rather than a flat five-up line-up: the
 * four consoles read as one Tri-Path family on the left, and the Studio Bridge
 * is separated by a rule into its own zone with its own tier tag, because it is
 * not a peer console (Stage 1). Every unit is shown complete and uncropped.
 *
 * Branding follows Stage 10: the Shivansh mark, the website and the primary
 * contact line. No pricing, by founding constraint.
 */
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { Shell } from "./shared/components/Shell.tsx";
import { Plate } from "./shared/components/Media.tsx";
import { img } from "./shared/assets.ts";
import { COLOR } from "./shared/theme.ts";
import { MONO, SANS } from "./shared/fonts.ts";
import { BRAND } from "./shared/brand.ts";

export const LongFormThumbnail: React.FC = () => (
  <Shell chrome={false}>
    <AbsoluteFill style={{ padding: "58px 64px 54px 64px", display: "flex", flexDirection: "column" }}>
      {/* ---- header ------------------------------------------------------ */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontFamily: MONO, fontSize: 21, letterSpacing: 7, color: COLOR.rimBright }}>
            TASCAM  ·  MODEL SERIES
          </div>
          <div
            style={{
              fontFamily: MONO, fontSize: 118, fontWeight: 700, letterSpacing: -2.5,
              color: COLOR.ink, lineHeight: 0.98, marginTop: 14,
            }}
          >
            TRI-PATH
          </div>
          <div
            style={{
              fontFamily: MONO, fontSize: 118, fontWeight: 700, letterSpacing: -2.5,
              color: COLOR.amber, lineHeight: 0.98,
            }}
          >
            ARCHITECTURE
          </div>
          <div style={{ display: "flex", gap: 16, alignItems: "center", marginTop: 22 }}>
            {["-128 dBu EIN", "24-BIT / 48 kHz", "AES59-2012 DB25"].map((t) => (
              <div
                key={t}
                style={{
                  fontFamily: MONO, fontSize: 19, letterSpacing: 1.6, color: COLOR.inkDim,
                  border: `1px solid ${COLOR.lineStrong}`, padding: "7px 13px",
                }}
              >
                {t}
              </div>
            ))}
          </div>
        </div>
        <Img src={staticFile("logo/shivansh-watermark.png")} style={{ width: 300, opacity: 0.85 }} />
      </div>

      {/* ---- the four consoles, then the bridge, separated --------------- */}
      <div style={{ flex: 1, minHeight: 0, display: "flex", alignItems: "center", gap: 30, marginTop: 8, overflow: "hidden" }}>
        <div style={{ flex: "0 0 46%", display: "flex", flexDirection: "column", height: "100%", justifyContent: "center", gap: 10, minHeight: 0 }}>
          <Plate image={img("model-2400-6")} fit={{ width: "100%", height: "58%" }} />
          <div style={{ display: "flex", gap: 14, height: "26%" }}>
            <Plate image={img("model-24-8")} fit={{ width: "34%", height: "100%" }} />
            <Plate image={img("model-16-6")} fit={{ width: "33%", height: "100%" }} />
            <Plate image={img("model-12-6")} fit={{ width: "33%", height: "100%" }} />
          </div>
          <div style={{ fontFamily: MONO, fontSize: 17, letterSpacing: 3.4, color: COLOR.rim }}>
            TIERS 1-3  ·  FOUR CONSOLES
          </div>
        </div>

        {/* the rule that says "not a peer unit" */}
        <div style={{ width: 1, height: "78%", background: COLOR.lineStrong }} />

        <div style={{ flex: 1, height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", gap: 14, minHeight: 0 }}>
          <Plate image={img("studio-bridge-7")} fit={{ width: "100%", height: "48%" }} />
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                fontFamily: MONO, fontSize: 16, fontWeight: 700, color: COLOR.void,
                background: COLOR.amber, padding: "4px 10px", letterSpacing: 1.2,
              }}
            >
              TIER 4
            </div>
            <div style={{ fontFamily: MONO, fontSize: 17, letterSpacing: 3, color: COLOR.inkDim }}>
              STUDIO BRIDGE
            </div>
          </div>
          <div style={{ fontFamily: SANS, fontSize: 21, color: COLOR.inkDim, opacity: 0.72, lineHeight: 1.35 }}>
            No preamps. No faders. A transparent 24 x 24 line-level bridge for a desk you already own.
          </div>
        </div>
      </div>

      {/* ---- footer ------------------------------------------------------ */}
      <div
        style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          borderTop: `1px solid ${COLOR.line}`, paddingTop: 18, marginTop: 10, flexShrink: 0,
        }}
      >
        <div style={{ fontFamily: SANS, fontSize: 22, letterSpacing: 2.4, color: COLOR.ribbon }}>
          {BRAND.website}
        </div>
        <div style={{ fontFamily: MONO, fontSize: 26, fontWeight: 600, letterSpacing: 1.6, color: COLOR.ink }}>
          {BRAND.numbers[0]}
        </div>
      </div>
    </AbsoluteFill>
  </Shell>
);
