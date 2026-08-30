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
 * WHERE THEY APPEAR. On end screens, and nowhere else. Marks used to be placed
 * throughout the running video, where they collided with the pictures and copy
 * they sat beside and crowded out the contact details a viewer actually needs.
 * The body now carries contact strips instead (see contact.tsx), and the marks
 * are reserved for the closing block of every deliverable and every part.
 */
import React from "react";
import { Img, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { EASE_OUT, ramp } from "./anim.ts";

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
 * A mark laid out by the surrounding copy.
 *
 * This is now the ONLY way a logo reaches the screen. The slot-placement
 * machinery that used to drop marks into the corners of running scenes is gone
 * with the marks themselves — logos appear on end screens only, where the
 * layout around them decides where they sit.
 */
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
