/**
 * PORTRAIT THUMBNAILS — 1080 x 1920, one per reel.
 *
 * Each uses the strongest real images from that reel's OWN coverage portion,
 * shown complete and uncropped, on the same dark clinical ground as the films.
 *
 * Reel 3 deliberately shows the Studio Bridge alone. Compositing it beside
 * console imagery would imply it is a peer unit, which Stage 1 explicitly
 * rejects — so its thumbnail carries its own Tier 4 identity instead.
 *
 * Branding per Stage 10: the Shivansh mark, the website, the primary contact
 * line. No pricing, by founding constraint.
 */
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { Shell } from "./shared/components/Shell.tsx";
import { Plate } from "./shared/components/Media.tsx";
import { img } from "./shared/assets.ts";
import { COLOR } from "./shared/theme.ts";
import { MONO, SANS } from "./shared/fonts.ts";
import { BRAND } from "./shared/brand.ts";

type Which = "reel1" | "reel2" | "reel3";

const SPEC: Record<Which, {
  kicker: string; line1: string; line2: string; tags: string[]; note: string;
}> = {
  reel1: {
    kicker: "TASCAM  ·  MODEL SERIES",
    line1: "TRI-PATH",
    line2: "ARCHITECTURE",
    tags: ["-128 dBu EIN", "24-BIT / 48 kHz"],
    note: "Four consoles. One signal, split three ways at the preamp stage.",
  },
  reel2: {
    kicker: "TIER 3  +  TIER 1",
    line1: "THE FLAGSHIP",
    line2: "& THE SPECIALIST",
    tags: ["HUI/MCU EMULATION", "MIDI · MTC"],
    note: "The only two units in the range that command a DAW and a master clock.",
  },
  reel3: {
    kicker: "TIER 4  ·  STUDIO BRIDGE",
    line1: "THE TRANSPARENT",
    line2: "BRIDGE",
    tags: ["24 x 24 DB25", "THD+N <= 0.003 %"],
    note: "No preamps. No faders. A line-level graft for the desk you already own.",
  },
};

export const ReelThumbnail: React.FC<{ which: Which }> = ({ which }) => {
  const s = SPEC[which];
  return (
    <Shell portrait chrome={false}>
      <AbsoluteFill style={{ padding: "96px 64px 84px 64px", display: "flex", flexDirection: "column" }}>
        <Img
          src={staticFile("logo/shivansh-watermark.png")}
          style={{ width: 300, opacity: 0.85, alignSelf: "flex-start" }}
        />

        <div style={{ marginTop: 44 }}>
          <div style={{ fontFamily: MONO, fontSize: 21, letterSpacing: 6.5, color: COLOR.rimBright }}>
            {s.kicker}
          </div>
          <div
            style={{
              fontFamily: MONO, fontSize: 92, fontWeight: 700, letterSpacing: -1.8,
              color: COLOR.ink, lineHeight: 1.0, marginTop: 18,
            }}
          >
            {s.line1}
          </div>
          <div
            style={{
              fontFamily: MONO, fontSize: 92, fontWeight: 700, letterSpacing: -1.8,
              color: COLOR.amber, lineHeight: 1.0,
            }}
          >
            {s.line2}
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 24, flexWrap: "wrap" }}>
            {s.tags.map((t) => (
              <div
                key={t}
                style={{
                  fontFamily: MONO, fontSize: 19, letterSpacing: 1.4, color: COLOR.inkDim,
                  border: `1px solid ${COLOR.lineStrong}`, padding: "7px 12px",
                }}
              >
                {t}
              </div>
            ))}
          </div>
        </div>

        {/* ---- imagery, drawn from this reel's own coverage portion -------- */}
        <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", justifyContent: "center", gap: 22 }}>
          {which === "reel1" && (
            <>
              <Plate image={img("model-2400-6")} fit={{ width: "100%", height: "56%" }} />
              <div style={{ display: "flex", gap: 14, height: "34%" }}>
                <Plate image={img("model-24-6")} fit={{ width: "34%", height: "100%" }} />
                <Plate image={img("model-16-6")} fit={{ width: "33%", height: "100%" }} />
                <Plate image={img("model-12-6")} fit={{ width: "33%", height: "100%" }} />
              </div>
            </>
          )}
          {which === "reel2" && (
            <>
              <Plate image={img("model-2400-5")} fit={{ width: "100%", height: "50%" }} />
              <div style={{ height: 1, background: COLOR.lineStrong }} />
              <Plate image={img("model-12-7")} fit={{ width: "100%", height: "42%" }} />
            </>
          )}
          {which === "reel3" && (
            <>
              <Plate image={img("studio-bridge-7")} fit={{ width: "100%", height: "58%" }} />
              <Plate image={img("studio-bridge-4")} fit={{ width: "100%", height: "34%" }} />
            </>
          )}
        </div>

        <div style={{ fontFamily: SANS, fontSize: 24, color: COLOR.inkDim, opacity: 0.72, lineHeight: 1.36 }}>
          {s.note}
        </div>

        <div
          style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            borderTop: `1px solid ${COLOR.line}`, paddingTop: 20, marginTop: 24,
          }}
        >
          <div style={{ fontFamily: SANS, fontSize: 21, letterSpacing: 1.9, color: COLOR.ribbon }}>
            {BRAND.website}
          </div>
          <div style={{ fontFamily: MONO, fontSize: 25, fontWeight: 600, letterSpacing: 1.3, color: COLOR.ink }}>
            {BRAND.numbers[0]}
          </div>
        </div>
      </AbsoluteFill>
    </Shell>
  );
};
