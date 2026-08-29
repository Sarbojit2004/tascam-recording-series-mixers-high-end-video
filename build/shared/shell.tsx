/**
 * THE PAGE — the near-white ground every scene sits on, and the transition
 * grammar between scenes.
 *
 * The ground is not flat #F6F8FA. A single flat fill across fifteen minutes
 * reads as an empty render rather than a designed surface, so the page carries
 * a very wide, very low-contrast radial lift and a hairline baseline grid, both
 * far below the threshold where they compete with content. This is the MOTU
 * light-ground treatment; the palette token is the only thing that changed.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, TIMING } from "./theme.ts";
import { FONT_FACE_CSS } from "./fonts.ts";
import { EASE_IN_OUT, EASE_OUT, ramp } from "./anim.ts";

export const Page: React.FC<{ children: React.ReactNode; grid?: boolean }> = ({
  children, grid = true,
}) => {
  const { width, height } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: COLORS.paper }}>
      <style>{FONT_FACE_CSS}</style>
      <AbsoluteFill style={{
        background:
          `radial-gradient(120% 90% at 50% 8%, ${COLORS.paperLift} 0%, ${COLORS.paper} 46%, ${COLORS.paperEdge} 100%)`,
      }} />
      {grid ? (
        <AbsoluteFill style={{
          backgroundImage:
            `linear-gradient(${COLORS.line} 1px, transparent 1px)`,
          backgroundSize: `100% ${Math.round(height / 24)}px`,
          opacity: 0.35,
        }} />
      ) : null}
      <AbsoluteFill style={{ width, height }}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};

/**
 * SCENE TRANSITION. A short cross-dissolve with a 6px counter-drift, applied
 * at both ends of every beat so nothing ever hard-cuts. `TIMING.transition` is
 * the MOTU value carried unchanged.
 */
export const Beat: React.FC<{
  dur: number; children: React.ReactNode; drift?: number;
}> = ({ dur, children, drift = 6 }) => {
  const f = useCurrentFrame();
  const t = TIMING.transition;
  const inP = ramp(f, 0, t, EASE_OUT);
  const outP = 1 - ramp(f - (dur - t), 0, t, EASE_IN_OUT);
  const p = Math.min(inP, outP);
  return (
    <AbsoluteFill style={{
      opacity: p,
      transform: `translateY(${(1 - inP) * drift - (1 - outP) * drift}px)`,
    }}>
      {children}
    </AbsoluteFill>
  );
};

/**
 * CHAPTER RAIL — a persistent, quiet marker of where the viewer is in the
 * argument. Long-form only; a reel is too short to need one, and its
 * caption-safe band has no room to spare.
 *
 * IT LIVES IN THE BOTTOM MARGIN, not in the content area. Scenes lay copy and
 * spec callouts down to the SPACE.marginY floor, so a rail placed inside that
 * floor lands on top of them — which is exactly what a first pass did, putting
 * the rail through the Model 12's first spec figure. Sitting below the floor,
 * in the 52 px of page edge nothing else uses, it can be permanent without ever
 * having to negotiate for space.
 */
export const ChapterRail: React.FC<{
  phase: string; index: number; total: number; x: number; y: number;
}> = ({ phase, index, total, x, y }) => {
  const f = useCurrentFrame();
  const p = ramp(f, 8, 24, EASE_OUT);
  return (
    <div style={{
      position: "absolute", left: x, top: y, display: "flex",
      alignItems: "center", gap: 14, opacity: p * 0.75,
    }}>
      <div style={{
        fontFamily: "Archivo", fontWeight: 700, fontSize: 13,
        letterSpacing: "0.22em", textTransform: "uppercase",
        color: COLORS.accent,
        textShadow: "0 1px 2px rgba(246,248,250,0.92)",
      }}>
        {phase}
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        {Array.from({ length: total }, (_, i) => (
          <div key={i} style={{
            width: i === index ? 22 : 9, height: 3, borderRadius: 2,
            background: i === index ? COLORS.accent : COLORS.lineStrong,
            opacity: i === index ? 0.85 : 0.5,
          }} />
        ))}
      </div>
    </div>
  );
};
