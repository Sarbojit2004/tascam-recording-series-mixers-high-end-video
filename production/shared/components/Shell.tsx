/**
 * THE FRAME. Every scene in every deliverable renders inside this.
 *
 * Stage 5's ground: hardware "isolated against deep, pure black voids" under
 * "highly directional, cool-temperature edge lighting". The page carries a
 * faint machine-vision reference grid and a directional 5600K rim wash so the
 * void reads as an instrumented environment rather than an empty black frame —
 * but both stay far below the imagery in contrast.
 *
 * Shell also mounts the two persistent Stage 10 elements, which is what makes
 * them structurally persistent rather than something each scene has to
 * remember: mount the shell, get the watermark and the ribbon.
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { COLOR } from "../theme.ts";
import { FONT_CSS } from "../fonts.ts";
import { DataRibbon, Watermark } from "./Brand.tsx";

export const Shell: React.FC<{
  children: React.ReactNode;
  portrait?: boolean;
  /** Hidden only for the thumbnail stills, which carry their own branding. */
  chrome?: boolean;
}> = ({ children, portrait, chrome = true }) => (
  <AbsoluteFill style={{ background: COLOR.void }}>
    <style>{FONT_CSS}</style>

    {/* machine-vision reference grid */}
    <AbsoluteFill
      style={{
        backgroundImage:
          `linear-gradient(rgba(242,245,248,0.028) 1px, transparent 1px),` +
          `linear-gradient(90deg, rgba(242,245,248,0.028) 1px, transparent 1px)`,
        backgroundSize: "112px 112px",
        opacity: 0.85,
      }}
    />
    {/* directional cool rim wash from frame left, per Stage 5's lighting */}
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(120% 90% at 6% 22%, rgba(92,102,114,0.20) 0%, rgba(92,102,114,0.05) 34%, rgba(8,9,11,0) 62%)",
      }}
    />

    {children}

    {/* vignette, applied over content so the void closes in at the edges */}
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        background:
          "radial-gradient(128% 118% at 50% 46%, rgba(8,9,11,0) 52%, rgba(8,9,11,0.55) 84%, rgba(8,9,11,0.86) 100%)",
      }}
    />

    {chrome && (
      <>
        <Watermark portrait={portrait} />
        <DataRibbon portrait={portrait} />
      </>
    )}
  </AbsoluteFill>
);
