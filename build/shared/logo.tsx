/**
 * A LOGO PLACED DIRECTLY ON SCREEN — no box, card or plate.
 *
 * SECTION 10.1, AND THE CONTRADICTION IN IT. The instruction is to drop the
 * boxed plate while preserving the logo's own internal background. Measured,
 * the supplied Shivansh file is 97.9% opaque and 77.2% pure white: the artwork
 * sits on an opaque white ROUNDED RECTANGLE. That shape IS its internal
 * background, so preserving it renders exactly the boxed plate the same
 * sentence forbids — the two halves of the instruction cannot both hold.
 *
 * The named reference decides it. All three MOTU productions strip the plate
 * (the M-Series ships a 76.6%-transparent mark, which scripts/prep_logos.py
 * reproduces byte-for-byte), and Section 1 makes those productions the base.
 * So the plate comes off and the mark is drawn bare. The ARTWORK is untouched:
 * globe, tagline and the trademark glyph all survive intact — what is removed
 * is only the white rectangle behind them.
 *
 * LEGIBILITY WITHOUT A BOX. Both marks are near-black on a near-white ground,
 * so contrast is not the risk; separation is, once a mark lands over a light
 * photograph. Each gets a faint drop-shadow. A shadow is not a box: no edge, no
 * fill, just the artwork lifted off the paper.
 *
 * MOVEMENT. Section 10.2 requires marks that change position constantly rather
 * than sitting pinned. Placement comes from the audited plan in brandplan.ts,
 * and each appearance slides in from the NEAREST FRAME EDGE and leaves the same
 * way, so a mark reads as arriving into the frame, never materialising in place.
 */
import React from "react";
import { Img, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { SAFE, SPACE } from "./theme.ts";
import type { Pos } from "./brandplan.ts";
import { EASE_IN_OUT, EASE_OUT, ramp } from "./anim.ts";

export type BrandKey = "shivansh" | "tascam";

const SRC: Record<BrandKey, string> = {
  shivansh: "logo/shivansh.png",
  tascam: "logo/tascam.png",
};

/** True pixel ratios of the plate-stripped files. Width follows from height. */
const RATIO: Record<BrandKey, number> = {
  shivansh: 2322 / 664,  // 3.4970
  tascam: 2143 / 350,    // 6.1229
};

const SHADOW = "drop-shadow(0 2px 12px rgba(14,17,22,0.14)) drop-shadow(0 1px 2px rgba(14,17,22,0.09))";

export const logoSize = (brand: BrandKey, h: number) => ({
  w: Math.round(h * RATIO[brand]), h,
});

/**
 * Resolves a slot to a top-left coordinate plus an entrance offset.
 *
 * Landscape insets sit well inboard of the SPACE floor; portrait insets respect
 * the caption-safe band, so a mark never lands under platform UI.
 */
export function logoAnchor(
  pos: Pos, w: number, h: number, canvasW: number, canvasH: number,
): { x: number; y: number; dx: number; dy: number } {
  const portrait = canvasH > canvasW;
  const mx = portrait ? SAFE.marginX + 12 : SPACE.marginX + 48;
  const top = portrait ? SAFE.top + 24 : SPACE.marginY + 44;
  const bottomInset = portrait ? SAFE.bottom + 24 : SPACE.marginY + 44;

  const left = mx;
  const right = canvasW - mx - w;
  const cx = Math.round((canvasW - w) / 2);
  const bottom = canvasH - bottomInset - h;
  const cy = Math.round((canvasH - h) / 2);

  const map: Record<Pos, { x: number; y: number; dx: number; dy: number }> = {
    tl: { x: left, y: top, dx: -34, dy: 0 },
    tc: { x: cx, y: top, dx: 0, dy: -28 },
    tr: { x: right, y: top, dx: 34, dy: 0 },
    cl: { x: left, y: cy, dx: -34, dy: 0 },
    center: { x: cx, y: cy, dx: 0, dy: 20 },
    cr: { x: right, y: cy, dx: 34, dy: 0 },
    bl: { x: left, y: bottom, dx: -34, dy: 0 },
    bc: { x: cx, y: bottom, dx: 0, dy: 28 },
    br: { x: right, y: bottom, dx: 34, dy: 0 },
  };
  return map[pos];
}

/** One logo appearance. `at`/`dur` are local to the enclosing beat. */
export const LogoMark: React.FC<{
  brand: BrandKey; pos: Pos; size?: number;
  at?: number; dur?: number; inF?: number; outF?: number;
  x?: number; y?: number; opacity?: number;
}> = ({ brand, pos, size = 54, at = 0, dur = 120, inF = 20, outF = 18,
        x, y, opacity = 1 }) => {
  const f = useCurrentFrame() - at;
  const { width, height } = useVideoConfig();
  const { w, h } = logoSize(brand, size);
  const a = logoAnchor(pos, w, h, width, height);

  const inP = ramp(f, 0, inF, EASE_OUT);
  const outP = 1 - ramp(f - (dur - outF), 0, outF, EASE_IN_OUT);
  const p = Math.min(inP, outP);
  if (p <= 0.002) return null;

  const tx = (1 - inP) * a.dx - (1 - outP) * a.dx * 0.45;
  const ty = (1 - inP) * a.dy - (1 - outP) * a.dy * 0.45;
  const s = 0.955 + 0.045 * inP;

  return (
    <div style={{
      position: "absolute", left: x ?? a.x, top: y ?? a.y, width: w, height: h,
      opacity: p * opacity,
      transform: `translate3d(${tx}px, ${ty}px, 0) scale(${s})`,
      transformOrigin: "center center",
    }}>
      <Img src={staticFile(SRC[brand])}
           style={{ width: "100%", height: "100%", objectFit: "contain",
                    display: "block", filter: SHADOW }} />
    </div>
  );
};

/** A bare mark laid out by the surrounding copy, for composed brand beats. */
export const LogoInline: React.FC<{
  brand: BrandKey; size?: number; delay?: number; style?: React.CSSProperties;
}> = ({ brand, size = 72, delay = 0, style }) => {
  const f = useCurrentFrame();
  const { w, h } = logoSize(brand, size);
  const p = ramp(f, delay, 22, EASE_OUT);
  return (
    <div style={{
      width: w, height: h, opacity: p,
      transform: `translateY(${(1 - p) * 14}px) scale(${0.96 + 0.04 * p})`, ...style,
    }}>
      <Img src={staticFile(SRC[brand])}
           style={{ width: "100%", height: "100%", objectFit: "contain",
                    display: "block", filter: SHADOW }} />
    </div>
  );
};
