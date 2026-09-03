/**
 * THE MASTER POSTER — the one that has to show the whole range.
 *
 * WHY IT IS NOT THE GENERIC Thumbnail. The part posters each argue one part and
 * carry one photograph, which the shared component does well. The master claims
 * "five units, one architecture", and a poster that says five while picturing
 * one is simply not telling the truth about what is inside. It needs a layout
 * built around a ROW of products rather than a single hero, so it gets its own
 * component instead of a flag on the shared one.
 *
 * THE ROW IS THE CONSTRAINT. Five 16:9 product shots across 1712 px of content
 * width come out at roughly 328 x 184 each — that is arithmetic, not a choice,
 * and no crop can improve it because real photography is never cropped in this
 * production. So the copy above is kept tight to give the row as much of the
 * frame as it can have, and each unit is named beneath its own shot: at the size
 * a thumbnail is actually seen, the row reads as "five mixers" and the labels
 * carry the identification once someone looks closer.
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { COLORS, LANDSCAPE, SPACE } from "./theme.ts";
import { FONT_FACE_CSS, headline, micro, subhead } from "./fonts.ts";
import { LogoInline } from "./logo.tsx";
import { Shot, fit } from "./media.tsx";
import { ar } from "./assets.ts";
import { BRAND } from "./brand.ts";
import { UNITS, type UnitId } from "./spec.ts";

/**
 * One shot per unit, chosen so the five read as a FAMILY.
 *
 * This mattered more than picking the best individual photograph of each unit.
 * A first pass took the same hero shots the parts use, and the row came out
 * incoherent — a dark close-up of the Model 24's display beside a hard-angled
 * side view of the 2400 beside two clean product shots. Five units photographed
 * five different ways read as five unrelated things, which is the opposite of
 * "one architecture". These are all three-quarter product views on a light
 * ground, at comparable distance, so the row reads as one range.
 */
const ROW: { unit: UnitId; image: string }[] = [
  { unit: "model12", image: "model-12-0" },
  { unit: "model16", image: "model-16-0" },
  { unit: "model24", image: "model-24-6" },
  { unit: "model2400", image: "model-2400-6" },
  { unit: "studiobridge", image: "studio-bridge-6" },
];

export const MasterThumbnail: React.FC = () => {
  const W = LANDSCAPE.width;
  const H = LANDSCAPE.height;
  const padX = SPACE.marginX + 48;
  const padTop = SPACE.marginY + 26;
  const contentW = W - padX * 2;

  /**
   * The row takes a wider band than the copy does. Five 16:9 shots across the
   * text column would come out at 328 px each; letting them run closer to the
   * frame edge buys about 4% more, which is worth having when the whole point
   * of this poster is that the products are identifiable.
   */
  const rowPadX = SPACE.marginX + 16;
  const rowW = W - rowPadX * 2;
  const gap = 18;
  const cellW = Math.floor((rowW - gap * (ROW.length - 1)) / ROW.length);
  const cellH = Math.round(cellW / 1.778);
  const labelH = 40;
  // Centred in the band between the copy block and the logo block, so neither
  // a tall nor a short row leaves a pocket of dead paper under it.
  const rowTop = Math.round(372 + ((940 - 372) - (cellH + labelH)) / 2);

  return (
    <AbsoluteFill style={{ background: COLORS.paper, width: W, height: H }}>
      <style>{FONT_FACE_CSS}</style>
      <AbsoluteFill style={{
        background:
          `radial-gradient(120% 92% at 50% 4%, ${COLORS.paperLift} 0%, ${COLORS.paper} 46%, ${COLORS.paperEdge} 100%)`,
      }} />

      {/* the claim, kept tight so the row gets the frame */}
      <div style={{ position: "absolute", left: padX, top: padTop, width: contentW }}>
        <div style={{ ...micro(24, 700, "0.24em"), color: COLORS.accent,
                      marginBottom: 20 }}>
          TASCAM MODEL SERIES &#183; THE COMPLETE FILM
        </div>
        <div style={{ ...headline(96, 800), color: COLORS.ink, lineHeight: 0.95,
                      letterSpacing: "-0.02em" }}>
          FIVE UNITS. ONE ARCHITECTURE.
        </div>
        <div style={{ ...subhead(32, 500), color: COLORS.slate, marginTop: 22 }}>
          One preamp, three destinations &#8212; at the same time.
        </div>
      </div>

      {/* the range, every unit of it */}
      {ROW.map((r, i) => {
        const x = rowPadX + i * (cellW + gap);
        const box = fit(ar(r.image), x, rowTop, cellW, cellH);
        return (
          <React.Fragment key={r.unit}>
            <Shot id={r.image} box={box} dur={2} push={0} delay={-40} />
            <div style={{
              position: "absolute", left: x, top: rowTop + cellH + 14,
              width: cellW, textAlign: "center",
              ...micro(19, 700, "0.14em"), color: COLORS.inkSoft,
            }}>
              {UNITS[r.unit].name}
            </div>
          </React.Fragment>
        );
      })}

      {/* the marks, and the relationship */}
      <div style={{
        position: "absolute", left: padX, bottom: SPACE.marginY + 26,
        display: "flex", alignItems: "center", gap: 40,
      }}>
        <LogoInline brand="shivansh" size={86} delay={-40} />
        <div style={{ width: 1, height: 66, background: COLORS.lineStrong, opacity: 0.6 }} />
        <LogoInline brand="tascam" size={42} delay={-40} />
      </div>
      <div style={{
        position: "absolute", right: padX, bottom: SPACE.marginY + 44,
        ...subhead(27, 600), color: COLORS.slateDim, letterSpacing: "0.03em",
      }}>
        {BRAND.role}
      </div>

    </AbsoluteFill>
  );
};
