/**
 * THUMBNAILS — one per deliverable, rendered as stills from the same code that
 * renders the videos.
 *
 * WHY IT IS A COMPOSITION AND NOT AN IMAGE EDITOR JOB. A thumbnail made
 * separately drifts: the palette shifts, the logo comes back on its plate, the
 * headline gets retyped with a different figure. Built here it inherits the
 * real palette, the real plate-stripped marks, the real fonts and the real
 * photographs, so it cannot say anything the video does not.
 *
 * IT IS A POSTER, NOT A FRAME. A still lifted from the video would carry
 * mid-animation opacities and a headline sized for motion. This is composed for
 * the grid it will actually be seen in: one very large claim, one product, one
 * mark, legible at the size of a phone listing.
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { COLORS, SAFE, SPACE } from "./theme.ts";
import { FONT_FACE_CSS, headline, micro, subhead } from "./fonts.ts";
import { LogoInline } from "./logo.tsx";
import { Shot, fitC } from "./media.tsx";
import { ar } from "./assets.ts";
import { BRAND } from "./brand.ts";

export const Thumbnail: React.FC<{
  portrait: boolean;
  kicker: string;
  hero: string;
  image: string;
  /** Optional second line, set smaller under the claim. */
  note?: string;
}> = ({ portrait, kicker, hero, image, note }) => {
  const w = portrait ? 1080 : 1920;
  const h = portrait ? 1920 : 1080;
  const padX = portrait ? SAFE.marginX + 16 : SPACE.marginX + 48;
  const padTop = portrait ? SAFE.top : SPACE.marginY + 30;
  const padBottom = portrait ? SAFE.bottom : SPACE.marginY + 30;
  /**
   * PORTRAIT STACKS, LANDSCAPE SPLITS.
   *
   * A 16:9 poster has width to spare and no height to waste, so the copy takes
   * the left column and the photograph the right. Centring the photograph the
   * way the portrait posters do put the Model 2400's near-square top-down shot
   * straight through the word DESTINATIONS.
   */
  const fullW = w - padX * 2;
  const copyW = portrait ? fullW : Math.round(fullW * 0.50);
  const contentW = copyW;

  /**
   * The photograph is centred in the band between the copy and the marks rather
   * than pinned to a fixed y. Product shots here range from a near-square
   * three-quarter view to a very wide rack front, so a fixed top edge leaves a
   * different gap under each one; centring the fitted box in the band makes all
   * four posters sit the same way whatever their subject's proportions.
   */
  const bandTop = portrait ? 900 : padTop;
  const bandBottom = h - padBottom - (portrait ? 210 : 0);
  const box = fitC(
    ar(image),
    portrait ? padX : padX + fullW - Math.round(fullW * 0.46),
    bandTop,
    portrait ? fullW : Math.round(fullW * 0.46),
    bandBottom - bandTop,
    "right",
  );

  return (
    <AbsoluteFill style={{ background: COLORS.paper, width: w, height: h }}>
      <style>{FONT_FACE_CSS}</style>
      <AbsoluteFill style={{
        background:
          `radial-gradient(120% 92% at 50% 6%, ${COLORS.paperLift} 0%, ${COLORS.paper} 44%, ${COLORS.paperEdge} 100%)`,
      }} />

      {/* the claim, set as large as the canvas will take */}
      <div style={{ position: "absolute", left: padX, top: padTop, width: copyW }}>
        <div style={{ ...micro(portrait ? 24 : 26, 700, "0.24em"),
                      color: COLORS.accent, marginBottom: portrait ? 26 : 22 }}>
          {kicker}
        </div>
        {/*
          Sized to the COLUMN, not the canvas. At 128px the longest word in the
          long-form's claim — DESTINATIONS — measured wider than the copy column
          and ran under the photograph; 92px clears it with room to spare.
        */}
        <div style={{ ...headline(portrait ? 104 : 92, 800),
                      color: COLORS.ink, lineHeight: 0.96,
                      letterSpacing: "-0.02em", whiteSpace: "pre-line" }}>
          {hero}
        </div>
        {note ? (
          <div style={{ ...subhead(portrait ? 34 : 34, 500), color: COLORS.slate,
                        marginTop: portrait ? 28 : 26, maxWidth: copyW }}>
            {note}
          </div>
        ) : null}
      </div>

      <Shot id={image} box={box} dur={2} push={0} delay={-40} />

      {/*
        The marks, bare — the same plate-stripped files the videos use — with
        the role line STACKED ABOVE rather than set beside them. Right-aligning
        it on the same row ran it straight through the TASCAM wordmark on the
        portrait posters, where there is no width to share.
      */}
      <div style={{
        position: "absolute", left: padX, bottom: padBottom, width: copyW,
      }}>
        <div style={{
          ...subhead(portrait ? 24 : 27, 600), color: COLORS.slateDim,
          letterSpacing: "0.03em", marginBottom: portrait ? 22 : 20,
        }}>
          {BRAND.role}
        </div>
        <div style={{ display: "flex", alignItems: "center",
                      gap: portrait ? 30 : 40 }}>
          <LogoInline brand="shivansh" size={portrait ? 78 : 86} delay={-40} />
          <div style={{ width: 1, height: portrait ? 60 : 66,
                        background: COLORS.lineStrong, opacity: 0.6 }} />
          <LogoInline brand="tascam" size={portrait ? 38 : 42} delay={-40} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
