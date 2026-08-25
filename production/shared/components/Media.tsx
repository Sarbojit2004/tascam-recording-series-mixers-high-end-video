/**
 * IMAGE AND VIDEO TREATMENT — the rule this build exists to honour.
 *
 * `Plate` renders through object-fit:contain, so a real product image can never
 * be cropped: the complete physical unit is always in frame. Where an image's
 * aspect ratio does not match its slot, the difference is absorbed by ground
 * treatment, never by cutting into the subject.
 *
 * The two CAMERA moves (MacroReveal, ConnectorSweep) do scale their container
 * above 1.0 inside an overflow:hidden box, so during the move the frame IS a
 * crop — by design. The rule is that no image is cropped "such that the viewer
 * never sees the whole physical unit", i.e. every move must RESOLVE. Each one
 * returns to scale <= 1.0 before its beat ends, and scripts/whole-unit.mjs
 * proves it by rendering the last frame of every beat that carries a move.
 *
 * Ground handling is inverted relative to the MOTU AVB reference. AVB seated
 * dark photos on a light page; Stage 5 here puts everything on a near-black
 * void, so it is the LIGHT-ground product shots that need a deliberate frame
 * and the dark ones that dissolve into the page.
 */
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, useCurrentFrame } from "remotion";
import { COLOR, RADII } from "../theme.ts";
import { linear, nodalDrift } from "../anim.ts";
import { url, type RealImage, type RealVideo, type ReprClip } from "../assets.ts";

type Fit = { width?: number | string; height?: number | string };

/**
 * Seating for an image's own background against the near-black page.
 *
 *  dark       photographed on black already -> present bare, it dissolves in
 *  cutout     white studio sweep removed at asset-prep -> present bare
 *  schematic  line-art re-rendered white on transparency -> present bare
 *  mixed      a real environment photograph -> a soft well, just enough to seat it
 *  plate      a light UI screenshot -> a deliberate framed technical reference
 */
function seat(ground: RealImage["ground"]): React.CSSProperties {
  if (ground === "dark" || ground === "cutout" || ground === "schematic") {
    return { background: "transparent" };
  }
  if (ground === "plate") {
    return {
      background: COLOR.panel,
      border: `1px solid ${COLOR.lineStrong}`,
      borderRadius: RADII.plate,
      padding: 10,
      boxShadow: "0 24px 60px rgba(0,0,0,0.55)",
      // A light UI screenshot is the one asset class that cannot be seated on
      // the void without glaring. Held back so it reads as a framed technical
      // reference rather than the brightest object in the film.
      filter: "brightness(0.84) contrast(1.04)",
    };
  }
  return {
    background: "rgba(16,19,23,0.62)",
    border: `1px solid ${COLOR.line}`,
    borderRadius: RADII.plate,
    padding: 6,
  };
}

/**
 * A studio shot on black still carries its OWN near-black rectangle, which is
 * a slightly different black from the page and reads as a visible box floating
 * on the void. A soft edge feather dissolves that boundary. It is a
 * presentation treatment on the frame margin only — the subject sits well
 * inside it, so the complete unit stays visible and nothing is cropped.
 */
const FEATHER =
  "radial-gradient(ellipse 78% 78% at 50% 50%, #000 62%, rgba(0,0,0,0.55) 84%, transparent 100%)";

export const Plate: React.FC<{
  image: RealImage;
  style?: React.CSSProperties;
  fit?: Fit;
  /** Suppress seating when the layout provides its own frame. */
  bare?: boolean;
}> = ({ image, style, fit, bare }) => {
  const feather = image.ground === "dark";
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        ...(bare ? {} : seat(image.ground)),
        ...fit,
        ...style,
      }}
    >
      <Img
        src={url(image)}
        style={{
          width: "100%", height: "100%", objectFit: "contain", display: "block",
          ...(feather ? { WebkitMaskImage: FEATHER, maskImage: FEATHER } : {}),
        }}
      />
    </div>
  );
};

/**
 * NODAL DRIFT — the AVB "gimbal micro-movement" technique, rebuilt linear.
 * Constant velocity, no rotation, no organic float (Stage 5). The image stays
 * `contain`ed throughout, so the whole unit never leaves the frame.
 */
export const NodalDrift: React.FC<{
  image: RealImage; dur: number; ax?: number; ay?: number; style?: React.CSSProperties;
}> = ({ image, dur, ax = 1, ay = 0.4, style }) => {
  const f = useCurrentFrame();
  const d = nodalDrift(f, dur, ax, ay);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", ...style }}>
      <div style={{ transform: `translate(${d.x}px, ${d.y}px) scale(${d.scale})`, width: "100%", height: "100%" }}>
        <Plate image={image} fit={{ width: "100%", height: "100%" }} />
      </div>
    </AbsoluteFill>
  );
};

/**
 * MACRO-TO-FULL-REVEAL. Opens hard on an engineering detail with simulated
 * shallow depth of field, then pulls back at constant velocity until the
 * complete, uncropped unit is on screen, and holds. Macro phase ~35% of the
 * beat, reveal-and-hold ~65% — the ratio the reference established.
 *
 * ALWAYS RESOLVES: scale returns to exactly 1 by `macroPart + reveal` and the
 * hold runs at 1, so the last frame of the beat shows the entire unit.
 */
export const MacroReveal: React.FC<{
  image: RealImage;
  dur: number;
  /** Focal point of the macro phase, 0..1 in image space. */
  focus?: [number, number];
  /** Scale at the tightest point. */
  from?: number;
  macroPart?: number;
}> = ({ image, dur, focus = [0.5, 0.5], from = 2.35, macroPart = 0.35 }) => {
  const f = useCurrentFrame();
  const macroEnd = Math.round(dur * macroPart);
  const revealEnd = Math.round(dur * 0.82);
  const scale = f <= macroEnd ? from : linear(f, macroEnd, revealEnd, from, 1);
  const s = Math.max(1, scale);
  const ox = (focus[0] - 0.5) * (s - 1) * 100;
  const oy = (focus[1] - 0.5) * (s - 1) * 100;
  const blur = f <= macroEnd ? 0 : linear(f, macroEnd, revealEnd, 2.2, 0);
  return (
    <AbsoluteFill style={{ overflow: "hidden", alignItems: "center", justifyContent: "center" }}>
      <div
        style={{
          width: "100%", height: "100%",
          transform: `scale(${s}) translate(${-ox}%, ${-oy}%)`,
          filter: blur > 0.05 ? `blur(${blur}px)` : undefined,
        }}
      >
        <Plate image={image} fit={{ width: "100%", height: "100%" }} />
      </div>
    </AbsoluteFill>
  );
};

/**
 * CONNECTOR SWEEP — the AVB "port density sweep", re-aimed at this hardware.
 * A slow lateral tracking move along a connector row at fixed height, at
 * constant velocity. Stage 5 makes this the PRIMARY axis for the Studio
 * Bridge specifically: "camera movements should glide laterally across the
 * dense array of rear-panel DB25 connectors, treating the multi-pin clusters
 * as complex industrial architecture."
 *
 * ALWAYS RESOLVES: the last 30% pulls out to scale 1, showing the whole unit.
 */
export const ConnectorSweep: React.FC<{
  image: RealImage; dur: number; zoom?: number; from?: number; to?: number;
}> = ({ image, dur, zoom = 1.85, from = 0.14, to = 0.86 }) => {
  const f = useCurrentFrame();
  const sweepEnd = Math.round(dur * 0.7);
  const s = f <= sweepEnd ? zoom : linear(f, sweepEnd, dur - 1, zoom, 1);
  const t = f <= sweepEnd ? linear(f, 0, sweepEnd, from, to) : to;
  const sc = Math.max(1, s);
  const ox = (t - 0.5) * (sc - 1) * 100;
  return (
    <AbsoluteFill style={{ overflow: "hidden", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: "100%", height: "100%", transform: `scale(${sc}) translateX(${-ox}%)` }}>
        <Plate image={image} fit={{ width: "100%", height: "100%" }} />
      </div>
    </AbsoluteFill>
  );
};

/**
 * Real product video. Standing rule: natural speed, never sped up, never
 * reduced to a single frame — so there is deliberately no playbackRate prop
 * here, and no still fallback. The source clips are 1600x500, which already
 * frames the complete unit, and object-fit:contain keeps it that way.
 */
export const RealClip: React.FC<{ video: RealVideo; style?: React.CSSProperties }> = ({ video, style }) => (
  <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", ...style }}>
    <OffthreadVideo
      src={url(video)}
      muted
      style={{ width: "100%", height: "auto", objectFit: "contain", display: "block" }}
    />
  </AbsoluteFill>
);

/**
 * Representational B-roll. Governed by a completely different rule set from
 * the real hardware: Section 0.3 grants complete editorial freedom, so speed,
 * trim, scale and grade are all fair game here and only here. The Gemini
 * watermark is already gone — removed by a baked-in crop at asset-prep time.
 */
export const Repr: React.FC<{
  source: ReprClip;
  startFrom?: number;
  playbackRate?: number;
  opacity?: number;
  grade?: boolean;
  /** "band" keeps the clip at its own aspect (no upscaling past ~1.5x, which
   *  720p source cannot survive); "fill" crops it to the frame. */
  mode?: "band" | "fill";
  style?: React.CSSProperties;
}> = ({ source, startFrom = 0, playbackRate = 1, opacity = 1, grade = true, mode = "band", style }) => (
  <AbsoluteFill style={{ overflow: "hidden", alignItems: "center", justifyContent: "center", ...style }}>
    <OffthreadVideo
      src={url(source)}
      muted
      startFrom={startFrom}
      playbackRate={playbackRate}
      style={{
        width: "100%",
        height: mode === "fill" ? "100%" : "auto",
        objectFit: mode === "fill" ? "cover" : "contain",
        display: "block",
        opacity,
        // Graded toward Stage 5's clinical, cool-rimmed, low-key look so the
        // representational layer sits in the same world as the stills — but
        // kept light enough that the footage stays readable rather than muddy.
        filter: grade ? "saturate(0.72) contrast(1.24) brightness(0.88)" : undefined,
      }}
    />
  </AbsoluteFill>
);

/** Montage tile. A grouping shortens an image's screen time; it never crops it. */
export const MontageTile: React.FC<{ image: RealImage; style?: React.CSSProperties }> = ({ image, style }) => (
  <Plate image={image} fit={{ width: "100%", height: "100%" }} style={style} />
);
