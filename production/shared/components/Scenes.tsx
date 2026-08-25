/**
 * Beat renderers. One branch per BeatKind, shared by all four deliverables so
 * the visual language is identical across the set; only layout metrics differ
 * between the landscape and portrait canvases.
 *
 * Stage 5 governs every camera move here (linear, nodal, perfectly stabilised —
 * never organic). Stage 10 governs every type layer. Stage 8 governs every
 * figure: `specValue` throws if a key is not a VERIFIED entry, so an
 * UNVERIFIED value such as the Model 16's fader travel cannot reach the screen
 * even by accident.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import type { Beat } from "../beat.ts";
import type { BrandPlan } from "../brandplan.ts";
import { COLOR, RAIL_CLEAR, SAFE, SPACE } from "../theme.ts";
import { MONO } from "../fonts.ts";
import { beatOpacity, fade, linear } from "../anim.ts";
import { Hero, Label, SpecRow, Sub, TierTag } from "./Type.tsx";
import { ConnectorSweep, MacroReveal, MontageTile, NodalDrift, Plate, RealClip, Repr } from "./Media.tsx";
import { BrandLayer, OutroLegend } from "./Brand.tsx";
import { TriPathSplitter } from "../graphics/TriPathSplitter.tsx";
import { DB25Injection } from "../graphics/DB25Injection.tsx";
import { TimecodePulse } from "../graphics/TimecodePulse.tsx";
import { UNITS, specValue } from "../spec.ts";
import { clip as reprClip, img, vid } from "../assets.ts";

export interface SceneProps {
  beat: Beat;
  dur: number;
  portrait: boolean;
  /** This beat's slot assignment from the branding rotation. */
  brand: BrandPlan;
}

const padX = (p: boolean) => (p ? SAFE.marginX : SPACE.marginX);

/**
 * Type is inset far enough to clear the branding rail — but only on the edge
 * the rail actually occupies for this beat. Reserving both edges everywhere
 * would cost content height on every beat and, on the motion-graphics beats,
 * pushed the scene label down into the graphic's own heading.
 */
const bands = (brand: BrandPlan) => ({
  top: brand.mark?.band === "top" || brand.second?.slot.band === "top",
  bottom: brand.mark?.band === "bottom" || brand.second?.slot.band === "bottom",
});
const padTop = (p: boolean, rail: boolean) =>
  rail ? (p ? RAIL_CLEAR.portrait.top : RAIL_CLEAR.landscape.top)
       : (p ? SAFE.top : SPACE.marginY + 16);
const padBot = (p: boolean, rail: boolean) =>
  rail ? (p ? RAIL_CLEAR.portrait.bottom : RAIL_CLEAR.landscape.bottom)
       : (p ? SAFE.bottom : SPACE.marginY + 44);

/** Content column that respects the caption-safe zone in portrait. */
const Safe: React.FC<{
  portrait: boolean; rail: { top: boolean; bottom: boolean };
  children: React.ReactNode; style?: React.CSSProperties;
}> = ({ portrait, rail, children, style }) => (
  <AbsoluteFill
    style={{
      paddingLeft: padX(portrait), paddingRight: padX(portrait),
      paddingTop: padTop(portrait, rail.top), paddingBottom: padBot(portrait, rail.bottom),
      ...style,
    }}
  >
    {children}
  </AbsoluteFill>
);

/** Level 1 + Level 2 block. Level 2 sits at 50% relative opacity (Stage 10). */
const HeroBlock: React.FC<{
  beat: Beat; portrait: boolean; align?: "flex-start" | "center"; heroSize?: number;
}> = ({ beat, portrait, align = "flex-start", heroSize }) => {
  const f = useCurrentFrame();
  const size = heroSize ?? (portrait ? 72 : 92);
  return (
    <div
      style={{
        display: "flex", flexDirection: "column", alignItems: align,
        gap: portrait ? 16 : 15, textAlign: align === "center" ? "center" : "left",
      }}
    >
      {beat.label && (
        <div style={{ opacity: fade(f, 0, 12) }}>
          <Label size={portrait ? 17 : 16}>{beat.label}</Label>
        </div>
      )}
      {beat.unit && beat.kind === "unit" && (
        <div style={{ opacity: fade(f, 4, 16) }}>
          <TierTag n={UNITS[beat.unit].tierNo} name={UNITS[beat.unit].tier} size={portrait ? 15 : 15} />
        </div>
      )}
      {beat.hero && (
        <div style={{ opacity: fade(f, 8, 22) }}>
          <Hero size={size} tone="amber">{beat.hero}</Hero>
        </div>
      )}
      {beat.sub && (
        <div style={{ opacity: fade(f, 16, 30), maxWidth: portrait ? "100%" : "62%" }}>
          <Sub size={portrait ? 27 : 26}>{beat.sub}</Sub>
        </div>
      )}
    </div>
  );
};

/** Thin rule that draws itself in at constant velocity — a chapter marker. */
const Rule: React.FC<{ w: number | string }> = ({ w }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ width: w, height: 1, background: COLOR.lineStrong, transform: `scaleX(${linear(f, 0, 26, 0, 1)})`, transformOrigin: "left" }} />
  );
};

export const Scene: React.FC<SceneProps> = ({ beat, dur, portrait, brand }) => {
  const f = useCurrentFrame();
  const o = beatOpacity(f, dur);
  const B = beat;
  const rail = bands(brand);

  const inner = (() => {
    switch (B.kind) {
      /* ------------------------------------------ representational B-roll */
      case "cold":
      case "repr": {
        const src = reprClip(B.clip!);
        // Section 0.3 gives this layer complete editorial freedom, so a 10s
        // clip under a longer beat is slowed to fill it rather than freezing on
        // its last frame. The resulting slow, deliberate motion is the register
        // Stage 5 asks for anyway. (Real product video is never treated this
        // way — see RealClip, which has no playbackRate at all.)
        const rate = B.clipRate ?? Math.min(1, src.dur / B.sec);
        return (
          <>
            <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: "100%", opacity: fade(f, 0, 20) }}>
                <Repr
                  source={src}
                  startFrom={Math.round((B.clipFrom ?? 0) * 30)}
                  playbackRate={rate}
                  mode={portrait ? "fill" : "band"}
                />
              </div>
            </AbsoluteFill>
            {/* legibility scrim under the type, kept off the imagery centre */}
            <AbsoluteFill
              style={{
                background: portrait
                  ? "linear-gradient(180deg, rgba(8,9,11,0.88) 0%, rgba(8,9,11,0.20) 34%, rgba(8,9,11,0.30) 62%, rgba(8,9,11,0.94) 100%)"
                  : "linear-gradient(90deg, rgba(8,9,11,0.94) 0%, rgba(8,9,11,0.62) 38%, rgba(8,9,11,0.10) 72%)",
              }}
            />
            <Safe portrait={portrait} rail={rail} style={{ justifyContent: portrait ? "flex-start" : "center" }}>
              <HeroBlock beat={B} portrait={portrait} />
            </Safe>
          </>
        );
      }

      /* ------------------------------------------- typographic statement */
      case "statement":
        return (
          <Safe portrait={portrait} rail={rail} style={{ justifyContent: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: portrait ? 30 : 28 }}>
              {B.label && (
                <div style={{ opacity: fade(f, 0, 12) }}>
                  <Label size={portrait ? 17 : 16}>{B.label}</Label>
                </div>
              )}
              <Rule w={portrait ? 200 : 300} />
              {B.hero && (
                <div style={{ opacity: fade(f, 6, 22) }}>
                  <Hero size={portrait ? 74 : 82} tone="ink">{B.hero}</Hero>
                </div>
              )}
              <div style={{ display: "flex", flexDirection: "column", gap: portrait ? 20 : 16, maxWidth: portrait ? "100%" : "72%" }}>
                {(B.body ?? []).map((line, i) => (
                  <div key={i} style={{ opacity: fade(f, 22 + i * 9, 40 + i * 9) }}>
                    <Sub size={portrait ? 30 : 30}>{line}</Sub>
                  </div>
                ))}
              </div>
            </div>
          </Safe>
        );

      /* ------------------------------------------------- macro-to-reveal */
      case "macro":
        return (
          <>
            <MacroReveal image={img(B.images![0])} dur={dur} focus={B.focus ?? [0.5, 0.5]} />
            <AbsoluteFill
              style={{
                pointerEvents: "none",
                background: portrait
                  ? "linear-gradient(180deg, rgba(8,9,11,0) 46%, rgba(8,9,11,0.84) 76%, rgba(8,9,11,0.96) 100%)"
                  : "linear-gradient(180deg, rgba(8,9,11,0) 42%, rgba(8,9,11,0.62) 72%, rgba(8,9,11,0.92) 100%)",
              }}
            />
            <Safe portrait={portrait} rail={rail} style={{ justifyContent: "flex-end" }}>
              <div style={{ opacity: fade(f, Math.round(dur * 0.42), Math.round(dur * 0.56)) }}>
                <HeroBlock beat={B} portrait={portrait} />
              </div>
            </Safe>
          </>
        );

      /* ------------------------------------------------- connector sweep */
      case "sweep":
        return (
          <>
            <ConnectorSweep image={img(B.images![0])} dur={dur} />
            <AbsoluteFill
              style={{
                pointerEvents: "none",
                background: portrait
                  ? "linear-gradient(180deg, rgba(8,9,11,0) 46%, rgba(8,9,11,0.84) 76%, rgba(8,9,11,0.96) 100%)"
                  : "linear-gradient(180deg, rgba(8,9,11,0) 42%, rgba(8,9,11,0.62) 72%, rgba(8,9,11,0.92) 100%)",
              }}
            />
            <Safe portrait={portrait} rail={rail} style={{ justifyContent: "flex-end" }}>
              <div style={{ opacity: fade(f, 16, 34) }}>
                <HeroBlock beat={B} portrait={portrait} />
              </div>
            </Safe>
          </>
        );

      /* ------------------------------------------------- unit title card */
      case "unit": {
        const im = img(B.images![0]);
        return portrait ? (
          <Safe portrait rail={rail} style={{ justifyContent: "center", gap: 44 }}>
            <div style={{ height: "44%", opacity: fade(f, 12, 32), flexShrink: 0 }}>
              <NodalDrift image={im} dur={dur} ax={0.7} />
            </div>
            <HeroBlock beat={B} portrait />
          </Safe>
        ) : (
          <>
            <AbsoluteFill style={{ left: "40%", opacity: fade(f, 10, 30) }}>
              <NodalDrift image={im} dur={dur} ax={0.8} />
            </AbsoluteFill>
            <Safe portrait={false} rail={rail} style={{ justifyContent: "center" }}>
              <div style={{ width: "44%" }}>
                <HeroBlock beat={B} portrait={false} />
              </div>
            </Safe>
          </>
        );
      }

      /* ----------------------------------------------- Stage 8 spec table */
      case "specs": {
        const keys = B.specKeys ?? [];
        const rows = keys.map((k) => [k, specValue(B.unit!, k)] as const);
        const table = (
          <div style={{ width: "100%" }}>
            {rows.map(([k, v], i) => (
              <div key={k} style={{ opacity: fade(f, 14 + i * 8, 30 + i * 8) }}>
                <SpecRow k={k} v={v} size={portrait ? 21 : 21} />
              </div>
            ))}
          </div>
        );
        const im = B.images?.[0] ? img(B.images[0]) : null;
        return portrait ? (
          <Safe portrait rail={rail} style={{ justifyContent: "center", gap: 36 }}>
            <HeroBlock beat={B} portrait heroSize={64} />
            {im && (
              <div style={{ height: "32%", opacity: fade(f, 10, 26), flexShrink: 0 }}>
                <Plate image={im} fit={{ width: "100%", height: "100%" }} />
              </div>
            )}
            {table}
          </Safe>
        ) : (
          <>
            {im && (
              <AbsoluteFill style={{ left: "50%", opacity: fade(f, 8, 26) }}>
                <NodalDrift image={im} dur={dur} ax={0.5} />
              </AbsoluteFill>
            )}
            <Safe portrait={false} rail={rail} style={{ justifyContent: "center" }}>
              <div style={{ width: "46%", display: "flex", flexDirection: "column", gap: 26 }}>
                <HeroBlock beat={B} portrait={false} heroSize={62} />
                {table}
              </div>
            </Safe>
          </>
        );
      }

      /* ------------------------------------------------------- montage */
      case "montage": {
        const ims = (B.images ?? []).map(img);
        const cols = portrait ? (ims.length >= 3 ? 2 : 1) : ims.length > 4 ? 3 : ims.length;
        return (
          <Safe portrait={portrait} rail={rail} style={{ justifyContent: "center", gap: portrait ? 20 : 26 }}>
            <HeroBlock beat={B} portrait={portrait} heroSize={portrait ? 54 : 58} />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${cols}, 1fr)`,
                gap: portrait ? 14 : 20,
                flex: 1,
                minHeight: 0,
              }}
            >
              {ims.map((im, i) => (
                <div key={im.id} style={{ opacity: fade(f, 10 + i * 6, 26 + i * 6), minHeight: 0 }}>
                  <MontageTile image={im} />
                </div>
              ))}
            </div>
          </Safe>
        );
      }

      /* -------------------------------------- real product video, as shot */
      case "realvideo":
        return (
          <>
            <AbsoluteFill style={{ opacity: fade(f, 0, 16) }}>
              <RealClip video={vid(B.video!)} />
            </AbsoluteFill>
            <AbsoluteFill
              style={{
                pointerEvents: "none",
                background: portrait
                  ? "linear-gradient(180deg, rgba(8,9,11,0) 46%, rgba(8,9,11,0.84) 76%, rgba(8,9,11,0.96) 100%)"
                  : "linear-gradient(180deg, rgba(8,9,11,0) 42%, rgba(8,9,11,0.62) 72%, rgba(8,9,11,0.92) 100%)",
              }}
            />
            <Safe
              portrait={portrait}
              rail={rail}
              style={{ justifyContent: portrait ? "space-between" : "flex-end" }}
            >
              <div style={{ opacity: fade(f, 14, 30) }}>
                <HeroBlock beat={B} portrait={portrait} heroSize={portrait ? 58 : 64} />
              </div>
              {portrait && B.unit && (
                <div style={{ opacity: fade(f, 26, 44) }}>
                  <SpecRow k="Multitrack SD Recorder" v={specValue(B.unit, "Multitrack SD Recorder")} size={19} />
                  <SpecRow k="USB Audio Interface" v={specValue(B.unit, "USB Audio Interface")} size={19} />
                </div>
              )}
            </Safe>
          </>
        );

      /* ------------------------------------- inverted line-art schematic */
      case "schematic": {
        const ims = (B.images ?? []).map(img);
        return (
          <Safe portrait={portrait} rail={rail} style={{ justifyContent: "center", gap: portrait ? 26 : 30 }}>
            <HeroBlock beat={B} portrait={portrait} heroSize={portrait ? 54 : 58} />
            <div style={{ display: "flex", flexDirection: portrait ? "column" : "row", gap: portrait ? 20 : 26, flex: 1, minHeight: 0, alignItems: "center" }}>
              {ims.map((im, i) => (
                <div key={im.id} style={{ flex: 1, width: "100%", height: portrait ? undefined : "100%", minHeight: 0, opacity: fade(f, 12 + i * 10, 30 + i * 10) }}>
                  <Plate image={im} fit={{ width: "100%", height: "100%" }} />
                </div>
              ))}
            </div>
          </Safe>
        );
      }

      /* ------------------------------------------ Stage 6 motion concepts */
      case "tripath":
        return (
          <>
            <TriPathSplitter unit={B.unit ?? "model2400"} dur={dur} portrait={portrait} />
            <Safe portrait={portrait} rail={rail} style={{ justifyContent: "flex-start" }}>
              <div style={{ opacity: fade(f, 0, 18) }}>
                <Label size={portrait ? 17 : 16}>{B.label ?? "The Tri-Path Architecture"}</Label>
              </div>
            </Safe>
          </>
        );

      case "db25":
        return (
          <>
            <DB25Injection unit="studiobridge" dur={dur} portrait={portrait} />
            <Safe portrait={portrait} rail={rail} style={{ justifyContent: "flex-start" }}>
              <div style={{ opacity: fade(f, 0, 18) }}>
                <Label size={portrait ? 17 : 16}>{B.label ?? "The DB25 Injection"}</Label>
              </div>
            </Safe>
          </>
        );

      case "timecode":
        return (
          <>
            <TimecodePulse unit={B.unit!} dur={dur} portrait={portrait} />
            <Safe portrait={portrait} rail={rail} style={{ justifyContent: "flex-start" }}>
              <div style={{ opacity: fade(f, 0, 18) }}>
                <Label size={portrait ? 17 : 16}>{B.label ?? "Timecode Synchronisation"}</Label>
              </div>
            </Safe>
          </>
        );

      /* --------------------------------------------------------- outro */
      case "outro":
        return <OutroLegend portrait={portrait} opacity={fade(f, 8, 34)} />;
    }
  })();

  return (
    <AbsoluteFill style={{ opacity: o }}>
      {inner}
      <BrandLayer plan={brand} portrait={portrait} />
    </AbsoluteFill>
  );
};
