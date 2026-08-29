/**
 * MEDIA PRESENTATION — the no-crop contract, and its one deliberate exception.
 *
 * REAL PHOTOGRAPHY AND REAL PRODUCT VIDEO ARE NEVER CROPPED. Two mechanisms
 * enforce that, both carried from the MOTU M-Series long-form:
 *
 *  1. `fit()` solves the largest box with the asset's EXACT aspect ratio that
 *     fits the space available, so an `objectFit: contain` asset fills its box
 *     precisely — no letterbox bars, and nothing cut off.
 *
 *  2. Motion scales the PLATE (frame and asset together), never the asset
 *     inside a fixed frame. A Ken-Burns zoom of the inner image is exactly what
 *     eats edges; growing the whole plate cannot. `platePush` then clamps that
 *     growth to the room the box actually has.
 *
 * THE EXCEPTION IS THE B-ROLL. Section 0.3 grants full editorial freedom over
 * the sixteen permitted clips — crop, speed, trim, loop — because they are
 * generated footage, not photography of the real hardware. `Clip` therefore
 * uses `cover` and is free to reframe.
 */
import React from "react";
import { Img, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, RADII } from "./theme.ts";
import { EASE_OUT, platePush, ramp } from "./anim.ts";
import { imageById, videoById, clipSrc } from "./assets.ts";

export interface Box { x: number; y: number; w: number; h: number }

const PLATE_SHADOW =
  "0 30px 74px -34px rgba(14,17,22,0.40), 0 4px 12px -3px rgba(14,17,22,0.08)";

/** The no-crop box solver. `ar` is the asset's true width/height. */
export function fit(
  ar: number, x: number, y: number, maxW: number, maxH: number,
  align: "center" | "left" | "right" = "center",
): Box {
  let w = maxW;
  let h = w / ar;
  if (h > maxH) { h = maxH; w = h * ar; }
  const dx = align === "center" ? (maxW - w) / 2 : align === "right" ? maxW - w : 0;
  return { x: Math.round(x + dx), y: Math.round(y), w: Math.round(w), h: Math.round(h) };
}

/** Vertically centred variant. */
export function fitC(ar: number, x: number, y: number, maxW: number, maxH: number,
                     align: "center" | "left" | "right" = "center"): Box {
  const b = fit(ar, x, y, maxW, maxH, align);
  return { ...b, y: Math.round(y + (maxH - b.h) / 2) };
}

/** Room to the canvas inset on the tightest side — feeds platePush. */
export function roomFor(box: Box, canvasW: number, canvasH: number, inset: number): number {
  return Math.max(0, Math.min(
    box.x - inset, canvasW - inset - (box.x + box.w),
    box.y - inset, canvasH - inset - (box.y + box.h),
  ));
}

/**
 * A REAL PHOTOGRAPH on a raised plate.
 *
 * `plate` gives the light ground the presence a bare cut-out would lack; the
 * knocked-out shots pass `plate` too, so their transparency shows the plate
 * colour and reads as an intentional spec card rather than a floating shape.
 */
export const Shot: React.FC<{
  id: string;
  box: Box;
  dur: number;
  push?: number;
  inset?: number;
  radius?: number;
  opacity?: number;
  plate?: boolean;
  pad?: number;
  bg?: string;
  shadow?: boolean;
  grayscale?: number;
  delay?: number;
  style?: React.CSSProperties;
}> = ({
  id, box, dur, push = 0.032, inset = 40, radius = RADII.plate, opacity = 1,
  plate = true, pad = 0, bg, shadow = true, grayscale = 0, delay = 0, style,
}) => {
  const f = useCurrentFrame() - delay;
  const { width, height } = useVideoConfig();
  const meta = imageById(id);
  const room = roomFor(box, width, height, inset);
  const s = platePush(f, Math.max(1, dur - delay), room, box.w, push);
  const inP = ramp(f, 0, 18, EASE_OUT);

  return (
    <div style={{
      position: "absolute", left: box.x, top: box.y, width: box.w, height: box.h,
      transform: `scale(${s})`, transformOrigin: "center center",
      opacity: opacity * inP,
      background: plate ? (bg ?? COLORS.paperLift) : "transparent",
      border: plate ? `1px solid ${COLORS.line}` : "none",
      borderRadius: radius, padding: pad,
      boxShadow: plate && shadow ? PLATE_SHADOW : "none",
      boxSizing: "border-box", ...style,
    }}>
      <Img
        src={staticFile(meta.path)}
        style={{
          width: "100%", height: "100%", objectFit: "contain",
          borderRadius: Math.max(0, radius - pad),
          filter: grayscale ? `grayscale(${grayscale})` : undefined,
          display: "block",
        }}
      />
    </div>
  );
};

/** REAL PRODUCT VIDEO. Natural speed, never cropped, never reframed. */
export const RealVideo: React.FC<{
  id: string; box: Box; dur: number; startFrom?: number;
  radius?: number; plate?: boolean; delay?: number; muted?: boolean;
}> = ({ id, box, dur, startFrom = 0, radius = RADII.plate, plate = true, delay = 0, muted = true }) => {
  const f = useCurrentFrame() - delay;
  const meta = videoById(id);
  const inP = ramp(f, 0, 18, EASE_OUT);
  return (
    <div style={{
      position: "absolute", left: box.x, top: box.y, width: box.w, height: box.h,
      opacity: inP, borderRadius: radius, overflow: "hidden",
      background: plate ? COLORS.paperWell : "transparent",
      border: plate ? `1px solid ${COLORS.line}` : "none",
      boxShadow: plate ? PLATE_SHADOW : "none", boxSizing: "border-box",
    }}>
      <OffthreadVideo
        src={staticFile(meta.path)}
        startFrom={startFrom}
        muted={muted}
        style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
      />
    </div>
  );
};

/**
 * PERMITTED B-ROLL, clips 1..16. Full editorial freedom applies here and only
 * here: `cover` reframing, playback rate, trim point, and looping are all
 * legitimate because these are generated clips rather than photography of the
 * hardware. `orientation` picks the pre-cropped, watermark-free master.
 */
export const Clip: React.FC<{
  n: number;
  orientation: "land" | "port";
  box: Box;
  from?: number;
  rate?: number;
  radius?: number;
  plate?: boolean;
  delay?: number;
  opacity?: number;
  grayscale?: number;
  style?: React.CSSProperties;
}> = ({ n, orientation, box, from = 0, rate = 1, radius = RADII.plate,
        plate = true, delay = 0, opacity = 1, grayscale = 0, style }) => {
  const f = useCurrentFrame() - delay;
  const inP = ramp(f, 0, 16, EASE_OUT);
  return (
    <div style={{
      position: "absolute", left: box.x, top: box.y, width: box.w, height: box.h,
      opacity: opacity * inP, borderRadius: radius, overflow: "hidden",
      background: COLORS.paperWell,
      border: plate ? `1px solid ${COLORS.line}` : "none",
      boxShadow: plate ? PLATE_SHADOW : "none", boxSizing: "border-box", ...style,
    }}>
      <OffthreadVideo
        src={staticFile(clipSrc(n, orientation))}
        startFrom={Math.round(from * 30)}
        playbackRate={rate}
        muted
        style={{
          width: "100%", height: "100%", objectFit: "cover", display: "block",
          filter: grayscale ? `grayscale(${grayscale})` : undefined,
        }}
      />
    </div>
  );
};
