/**
 * THE SCENE LIBRARY — one renderer per beat kind, laid out for whichever
 * canvas it is mounted on.
 *
 * ONE FILE, BOTH ORIENTATIONS. The long-form and the reels share every scene
 * kind; what changes is the shape of the space. A landscape beat lays copy and
 * media side by side; the same beat in portrait stacks them and pulls
 * everything inside the caption-safe band. Writing that as one component with a
 * `portrait` branch — rather than two parallel scene libraries — is what keeps
 * the four deliverables recognisably one production, which Section 3 requires:
 * a fact typeset once is typeset the same way everywhere it appears.
 *
 * NOTHING HERE INVENTS CONTENT. Copy arrives on the Beat; figures arrive
 * through specValue(); images and clips arrive by manifest id. A scene that
 * cannot find what it was asked for throws rather than rendering a placeholder,
 * so a schedule error surfaces at build time instead of shipping as a gap.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, RADII, SAFE, SPACE } from "./theme.ts";
import { micro, spec, subhead } from "./fonts.ts";
import { EASE_IN_OUT, EASE_OUT, gimbal, ramp } from "./anim.ts";
import { Chip, KineticHeadline, Micro, SpecCallout, Sub } from "./type.tsx";
import { Clip, RealVideo, Shot, fit, fitC, type Box } from "./media.tsx";
import { ar, imageById } from "./assets.ts";
import { UNITS, specValue, type UnitId } from "./spec.ts";
import { DB25Injection, TimecodePulse, TriPathSplitter } from "./concepts.tsx";
import { ContactLayer, EndScreen } from "./branding.tsx";
import type { Beat } from "./beat.ts";
import type { StripAppearance } from "./contactplan.ts";

/** Layout frame for the mounted canvas. */
interface Frame {
  w: number; h: number; portrait: boolean;
  padX: number; padTop: number; padBottom: number;
  contentW: number; contentH: number;
}

function useFrame(): Frame {
  const { width: w, height: h } = useVideoConfig();
  const portrait = h > w;
  const padX = portrait ? SAFE.marginX : SPACE.marginX;
  const padTop = portrait ? SAFE.top : SPACE.marginY;
  const padBottom = portrait ? SAFE.bottom : SPACE.marginY;
  return {
    w, h, portrait, padX, padTop, padBottom,
    contentW: w - padX * 2, contentH: h - padTop - padBottom,
  };
}

const LEGIBLE: React.CSSProperties = {
  textShadow: "0 1px 2px rgba(246,248,250,0.90), 0 0 12px rgba(246,248,250,0.68)",
};

// ---------------------------------------------------------------------------
// COLD OPEN / STATEMENT / EDITORIAL — type-led beats
// ---------------------------------------------------------------------------

const Cold: React.FC<{ b: Beat; dur: number }> = ({ b, dur }) => {
  const F = useFrame();
  const f = useCurrentFrame();
  const size = F.portrait ? 88 : 128;

  // A cold open earns its silence: the headline arrives alone, the qualifier
  // follows only once the headline has fully landed.
  return (
    <AbsoluteFill style={{
      paddingLeft: F.padX, paddingRight: F.padX,
      paddingTop: F.padTop, paddingBottom: F.padBottom,
      display: "flex", flexDirection: "column", justifyContent: "center",
      alignItems: F.portrait ? "center" : "flex-start",
    }}>
      <KineticHeadline text={b.hero ?? ""} size={size} weight={800}
                       align={F.portrait ? "center" : "left"} serif
                       per={F.portrait ? 2.2 : 2.8} delay={8}
                       style={{ ...LEGIBLE, maxWidth: F.contentW }} />
      {b.sub ? (
        <Sub size={F.portrait ? 30 : 38} delay={44}
             style={{ marginTop: F.portrait ? 26 : 34, maxWidth: F.contentW,
                      textAlign: F.portrait ? "center" : "left", ...LEGIBLE }}>
          {b.sub}
        </Sub>
      ) : null}
      <div style={{
        height: 2, background: COLORS.accent, opacity: 0.30, marginTop: 30,
        width: `${ramp(f, 60, 34) * (F.portrait ? 60 : 26)}%`,
      }} />
    </AbsoluteFill>
  );
};

const Statement: React.FC<{ b: Beat; dur: number }> = ({ b, dur }) => {
  const F = useFrame();
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{
      paddingLeft: F.padX, paddingRight: F.padX,
      paddingTop: F.padTop,
      // biased above centre in portrait: a block sitting dead-centre in a
      // 1520px band reads as floating rather than placed
      paddingBottom: F.padBottom + (F.portrait ? 190 : 0),
      display: "flex", flexDirection: "column", justifyContent: "center",
      alignItems: "flex-start",
    }}>
      {b.label ? <Micro delay={4} style={{ marginBottom: 20, ...LEGIBLE }}>{b.label}</Micro> : null}
      <KineticHeadline text={b.hero ?? ""} size={F.portrait ? 64 : 84}
                       weight={700} align="left" delay={14} per={2.0}
                       style={{ ...LEGIBLE, maxWidth: F.contentW }} />
      {b.body?.length ? (
        <div style={{ marginTop: F.portrait ? 30 : 40, display: "flex",
                      flexDirection: "column", gap: F.portrait ? 18 : 22 }}>
          {b.body.map((line, i) => {
            const p = ramp(f, 46 + i * 12, 22, EASE_OUT);
            return (
              <div key={i} style={{
                display: "flex", gap: 18, alignItems: "baseline", opacity: p,
                transform: `translateX(${(1 - p) * 18}px)`, maxWidth: F.contentW,
              }}>
                <div style={{ width: 8, height: 8, borderRadius: 8, flexShrink: 0,
                              background: COLORS.accent, opacity: 0.7,
                              transform: "translateY(-4px)" }} />
                <div style={{ ...subhead(F.portrait ? 27 : 32, 500),
                              color: COLORS.slate, ...LEGIBLE }}>{line}</div>
              </div>
            );
          })}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

/**
 * EDITORIAL — the argument's connective tissue, set over a B-roll bed held far
 * back. The clip is grayscaled and dimmed so the type stays the subject; this
 * is the one place a clip runs full-bleed, and it earns it by carrying no
 * information of its own.
 */
const Editorial: React.FC<{ b: Beat; dur: number }> = ({ b, dur }) => {
  const F = useFrame();
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      {b.clip ? (
        <Clip n={b.clip} orientation={F.portrait ? "port" : "land"}
              box={{ x: 0, y: 0, w: F.w, h: F.h }}
              from={b.clipFrom ?? 0} rate={b.clipRate ?? 1}
              radius={0} plate={false} opacity={0.20} grayscale={0.72} />
      ) : null}
      <AbsoluteFill style={{
        background: `linear-gradient(180deg, ${COLORS.paper} 0%, rgba(246,248,250,0.72) 38%, rgba(246,248,250,0.72) 62%, ${COLORS.paper} 100%)`,
      }} />
      <AbsoluteFill style={{
        paddingLeft: F.padX, paddingRight: F.padX,
        paddingTop: F.padTop, paddingBottom: F.padBottom,
        display: "flex", flexDirection: "column", justifyContent: "center",
        alignItems: "center", textAlign: "center",
      }}>
        <KineticHeadline text={b.hero ?? ""} size={F.portrait ? 62 : 82}
                         weight={700} align="center" serif delay={10} per={2.4}
                         style={{ ...LEGIBLE, maxWidth: F.contentW }} />
        {b.sub ? (
          <Sub size={F.portrait ? 26 : 32} delay={40}
               style={{ marginTop: 26, maxWidth: F.contentW * 0.88,
                        textAlign: "center", ...LEGIBLE }}>{b.sub}</Sub>
        ) : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// MACRO / SWEEP / HERO / MONTAGE — real photography
// ---------------------------------------------------------------------------

/**
 * MACRO. One real photograph, arriving oversized and settling to true scale.
 * The PLATE scales, never the image inside it, so nothing is ever cropped —
 * the whole point of the no-crop contract.
 */
const Macro: React.FC<{ b: Beat; dur: number }> = ({ b, dur }) => {
  const F = useFrame();
  const f = useCurrentFrame();
  const id = b.images?.[0];
  if (!id) throw new Error(`macro beat "${b.id}" has no image`);

  const maxW = F.contentW * (F.portrait ? 1 : 0.62);
  const maxH = F.contentH * (F.portrait ? 0.56 : 0.82);
  const box = F.portrait
    ? fit(ar(id), F.padX, F.padTop + F.contentH * 0.10, maxW, maxH)
    : fitC(ar(id), F.padX + F.contentW - maxW, F.padTop, maxW, F.contentH, "right");

  const copyW = F.portrait ? F.contentW : F.contentW * 0.34;
  const copyY = F.portrait ? F.padTop + F.contentH * 0.70 : 0;

  return (
    <AbsoluteFill>
      <Shot id={id} box={box} dur={dur} push={0.055} />
      <div style={{
        position: "absolute", left: F.padX,
        top: F.portrait ? copyY : undefined,
        width: copyW,
        ...(F.portrait ? {} : { top: "50%", transform: "translateY(-50%)" }),
      }}>
        {b.label ? <Micro delay={16} style={{ marginBottom: 16, ...LEGIBLE }}>{b.label}</Micro> : null}
        <KineticHeadline text={b.hero ?? ""} size={F.portrait ? 52 : 62}
                         weight={700} align="left" delay={22} per={1.8}
                         style={{ ...LEGIBLE }} />
        {b.sub ? (
          <Sub size={F.portrait ? 24 : 27} delay={48}
               style={{ marginTop: 20, ...LEGIBLE }}>{b.sub}</Sub>
        ) : null}
        {b.unit && b.specKeys?.length ? (
          <div style={{ marginTop: 30, display: "flex", flexDirection: "column", gap: 22 }}>
            {b.specKeys.slice(0, 2).map((k, i) => (
              <SpecCallout key={k} label={k} value={specValue(b.unit as UnitId, k)}
                           delay={60 + i * 14} size={F.portrait ? 30 : 34}
                           style={LEGIBLE} />
            ))}
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

/**
 * SWEEP. A slow lateral traverse across a wide photograph — the closest this
 * production comes to a camera move, and it moves the PLATE, not the crop.
 */
const Sweep: React.FC<{ b: Beat; dur: number }> = ({ b, dur }) => {
  const F = useFrame();
  const f = useCurrentFrame();
  const id = b.images?.[0];
  if (!id) throw new Error(`sweep beat "${b.id}" has no image`);

  const box = fitC(ar(id), F.padX, F.padTop, F.contentW,
                   F.contentH * (F.portrait ? 0.62 : 0.78));
  const g = gimbal(f, dur, F.portrait ? 6 : 10);

  return (
    <AbsoluteFill>
      <div style={{ transform: `translate3d(${g.x}px, ${g.y}px, 0)` }}>
        <Shot id={id} box={box} dur={dur} push={0.04} />
      </div>
      <div style={{
        position: "absolute", left: F.padX, right: F.padX,
        top: F.portrait ? box.y + box.h + 48 : undefined,
        bottom: F.portrait ? undefined : F.padBottom,
        display: "flex", flexDirection: F.portrait ? "column" : "row",
        alignItems: F.portrait ? "flex-start" : "flex-end",
        justifyContent: "space-between", gap: 24,
      }}>
        <div style={{ maxWidth: F.portrait ? "100%" : "56%" }}>
          {b.label ? <Micro delay={18} style={{ marginBottom: 14, ...LEGIBLE }}>{b.label}</Micro> : null}
          <KineticHeadline text={b.hero ?? ""} size={F.portrait ? 46 : 56}
                           weight={700} align="left" delay={24} per={1.6}
                           style={LEGIBLE} />
        </div>
        {b.unit && b.specKeys?.[0] ? (
          <SpecCallout label={b.specKeys[0]}
                       value={specValue(b.unit as UnitId, b.specKeys[0])}
                       delay={54} size={F.portrait ? 32 : 40}
                       align={F.portrait ? "left" : "right"}
                       style={{ ...LEGIBLE, minWidth: 260,
                                marginTop: F.portrait ? 24 : 0 }} />
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

/** HERO. The unit named, at full presence, with its tier and two figures. */
const Hero: React.FC<{ b: Beat; dur: number }> = ({ b, dur }) => {
  const F = useFrame();
  const f = useCurrentFrame();
  const id = b.images?.[0];
  const unit = b.unit ? UNITS[b.unit] : undefined;
  if (!id || !unit) throw new Error(`hero beat "${b.id}" needs an image and a unit`);

  const maxH = F.contentH * (F.portrait ? 0.44 : 0.56);
  const box = fit(ar(id), F.padX, F.padTop + (F.portrait ? F.contentH * 0.20 : F.contentH * 0.30),
                  F.contentW, maxH);

  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: F.padX, right: F.padX,
                    top: F.padTop + (F.portrait ? 10 : 6), textAlign: "left" }}>
        <Chip delay={6} style={{ marginBottom: 18 }}>{unit.tier}</Chip>
        <KineticHeadline text={unit.name} size={F.portrait ? 66 : 92}
                         weight={800} align="left" delay={14} per={2.2}
                         style={LEGIBLE} />
        {b.sub ? (
          <Sub size={F.portrait ? 25 : 30} delay={40} style={{ marginTop: 16, ...LEGIBLE }}>
            {b.sub}
          </Sub>
        ) : null}
      </div>

      <Shot id={id} box={box} dur={dur} push={0.05} delay={20} />

      {b.specKeys?.length ? (
        <div style={{
          position: "absolute", left: F.padX, right: F.padX,
          bottom: F.padBottom, display: "flex",
          flexDirection: F.portrait ? "column" : "row",
          gap: F.portrait ? 20 : 60,
          justifyContent: "space-between",
        }}>
          {b.specKeys.slice(0, F.portrait ? 2 : 3).map((k, i) => (
            <SpecCallout key={k} label={k} value={specValue(b.unit as UnitId, k)}
                         delay={56 + i * 12} size={F.portrait ? 28 : 34}
                         style={{ ...LEGIBLE, flex: 1 }} />
          ))}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

/**
 * MONTAGE. Several real photographs of the same unit, each fitted to its own
 * true ratio inside its own cell — mixed portrait and landscape source shots
 * therefore sit together without a single one being cropped to match.
 */
const Montage: React.FC<{ b: Beat; dur: number }> = ({ b, dur }) => {
  const F = useFrame();
  const ids = b.images ?? [];
  if (ids.length < 2) throw new Error(`montage beat "${b.id}" needs 2+ images`);

  const cols = F.portrait ? 1 : Math.min(3, ids.length);
  const rows = Math.ceil(ids.length / cols);
  const gap = F.portrait ? 22 : 34;
  const topBand = F.portrait ? 150 : 130;
  const cellW = (F.contentW - gap * (cols - 1)) / cols;
  const cellH = (F.contentH - topBand - gap * (rows - 1)) / rows;

  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: F.padX, top: F.padTop, width: F.contentW }}>
        {b.label ? <Micro delay={4} style={{ marginBottom: 14, ...LEGIBLE }}>{b.label}</Micro> : null}
        <KineticHeadline text={b.hero ?? ""} size={F.portrait ? 46 : 58}
                         weight={700} align="left" delay={10} per={1.6}
                         style={LEGIBLE} />
      </div>
      {ids.map((id, i) => {
        const c = i % cols;
        const r = Math.floor(i / cols);
        const box = fitC(ar(id), F.padX + c * (cellW + gap),
                         F.padTop + topBand + r * (cellH + gap), cellW, cellH);
        return <Shot key={id} id={id} box={box} dur={dur} push={0.03}
                     delay={16 + i * 10} />;
      })}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// SPECS / COMPARE — Level 1 figures
// ---------------------------------------------------------------------------

const Specs: React.FC<{ b: Beat; dur: number }> = ({ b, dur }) => {
  const F = useFrame();
  const f = useCurrentFrame();
  const unit = b.unit ? UNITS[b.unit] : undefined;
  const keys = b.specKeys ?? [];
  if (!unit || !keys.length) throw new Error(`specs beat "${b.id}" needs a unit and keys`);

  const id = b.images?.[0];
  const mediaW = F.portrait ? F.contentW : F.contentW * 0.44;
  const box = id
    ? (F.portrait
        ? fit(ar(id), F.padX, F.padTop + 130, mediaW, F.contentH * 0.30)
        : fitC(ar(id), F.padX, F.padTop, mediaW, F.contentH))
    : null;

  const listX = F.portrait ? F.padX : F.padX + F.contentW - F.contentW * 0.48;
  const listW = F.portrait ? F.contentW : F.contentW * 0.48;
  const listY = F.portrait
    ? F.padTop + 130 + F.contentH * 0.30 + 46
    : F.padTop;

  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: F.padX, top: F.padTop, width: F.contentW }}>
        <Chip delay={4}>{unit.tier}</Chip>
        <KineticHeadline text={unit.name} size={F.portrait ? 48 : 56} weight={700}
                         align="left" delay={10} per={1.6}
                         style={{ marginTop: 14, ...LEGIBLE }} />
      </div>

      {box && id ? <Shot id={id} box={box} dur={dur} push={0.035} delay={18} /> : null}

      <div style={{
        position: "absolute", left: listX, top: listY, width: listW,
        display: "flex", flexDirection: "column",
        gap: F.portrait ? 16 : 20,
        ...(F.portrait ? {} : { justifyContent: "center", height: F.contentH }),
      }}>
        {keys.map((k, i) => {
          const p = ramp(f, 30 + i * 11, 22, EASE_OUT);
          return (
            <div key={k} style={{
              display: "flex", justifyContent: "space-between", alignItems: "baseline",
              gap: 22, opacity: p, transform: `translateY(${(1 - p) * 10}px)`,
              borderBottom: `1px solid ${COLORS.line}`,
              paddingBottom: F.portrait ? 12 : 15,
            }}>
              <div style={{ ...micro(F.portrait ? 14 : 16, 700, "0.16em"),
                            color: COLORS.slateDim, flexShrink: 0, ...LEGIBLE }}>{k}</div>
              <div style={{ ...spec(F.portrait ? 22 : 27, 600, "0.01em"),
                            color: COLORS.ink, textAlign: "right", ...LEGIBLE }}>
                {specValue(b.unit as UnitId, k)}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/**
 * COMPARE. Two or three units side by side on ONE key.
 *
 * The bar length is proportional to the parsed figure where the key is
 * numeric, so the comparison is visible as well as readable; where it is not
 * numeric the row falls back to the value alone rather than inventing a scale.
 */
const Compare: React.FC<{ b: Beat; dur: number }> = ({ b, dur }) => {
  const F = useFrame();
  const f = useCurrentFrame();
  const units = b.units ?? [];
  const key = b.specKeys?.[0];
  if (units.length < 2 || !key) throw new Error(`compare beat "${b.id}" needs 2+ units and a key`);

  const values = units.map((u) => specValue(u, key));
  const nums = values.map((v) => {
    const m = v.match(/[\d.]+/);
    return m ? parseFloat(m[0]) : NaN;
  });
  const scalable = nums.every((n) => Number.isFinite(n) && n > 0);
  const max = scalable ? Math.max(...nums) : 1;

  const rowH = F.portrait ? 128 : 118;
  /**
   * The row stack is CENTRED in the space under the title rather than pinned
   * beneath it. A two-unit comparison pinned to the top of a 1520 px portrait
   * band leaves two-thirds of the frame empty below it, which reads as a
   * rendering fault rather than as space. Centring makes a two-row and a
   * five-row comparison both sit deliberately.
   */
  const titleBand = F.portrait ? 190 : 168;
  const stackH = units.length * rowH;
  const room = F.contentH - titleBand;
  const top = F.padTop + titleBand +
    (F.portrait ? Math.max(0, Math.round((room - stackH) * 0.42)) : 0);
  const barW = F.contentW * (F.portrait ? 0.60 : 0.52);

  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: F.padX, top: F.padTop, width: F.contentW }}>
        {b.label ? <Micro delay={4} style={{ marginBottom: 14, ...LEGIBLE }}>{b.label}</Micro> : null}
        <KineticHeadline text={b.hero ?? key} size={F.portrait ? 46 : 58}
                         weight={700} align="left" delay={10} per={1.6}
                         style={LEGIBLE} />
      </div>

      {units.map((u, i) => {
        const p = ramp(f, 30 + i * 14, 26, EASE_OUT);
        const grow = ramp(f, 40 + i * 14, 34, EASE_IN_OUT);
        const w = scalable ? (nums[i] / max) * barW * grow : 0;
        return (
          <div key={u} style={{
            position: "absolute", left: F.padX, top: top + i * rowH,
            width: F.contentW, opacity: p,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between",
                          alignItems: "baseline", marginBottom: 12 }}>
              <div style={{ ...subhead(F.portrait ? 27 : 31, 600),
                            color: COLORS.ink, ...LEGIBLE }}>{UNITS[u].name}</div>
              <div style={{ ...spec(F.portrait ? 28 : 34, 700, "0.01em"),
                            color: COLORS.accent, ...LEGIBLE }}>{values[i]}</div>
            </div>
            {scalable ? (
              <div style={{ height: 10, borderRadius: 6, background: COLORS.paperWell,
                            border: `1px solid ${COLORS.line}`, overflow: "hidden" }}>
                <div style={{ width: w, height: "100%",
                              background: COLORS.accent, opacity: 0.80 }} />
              </div>
            ) : null}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// BROLL / REALVIDEO
// ---------------------------------------------------------------------------

const BRoll: React.FC<{ b: Beat; dur: number }> = ({ b, dur }) => {
  const F = useFrame();
  if (!b.clip) throw new Error(`broll beat "${b.id}" has no clip`);
  const inset = F.portrait ? 0 : 0;
  const box: Box = { x: inset, y: inset, w: F.w - inset * 2, h: F.h - inset * 2 };
  return (
    <AbsoluteFill>
      <Clip n={b.clip} orientation={F.portrait ? "port" : "land"} box={box}
            from={b.clipFrom ?? 0} rate={b.clipRate ?? 1}
            radius={0} plate={false} />
      {/*
        A TOP SCRIM, to match the bottom one.
        This is the only scene that runs footage full-bleed, so it is the only
        place a contact strip can land on a dark frame — and the B-roll here is
        largely dark. Without this the strip's light-ground halo works against
        it and the detail disappears into the picture. The wash is short and
        weak: enough to seat type, not enough to look like a bar.
      */}
      <AbsoluteFill style={{
        background:
          "linear-gradient(180deg, rgba(246,248,250,0.93) 0%, " +
          "rgba(246,248,250,0.62) 42%, rgba(246,248,250,0) 100%)",
        height: F.portrait ? 300 : 210,
      }} />
      {b.hero ? (
        <>
          <AbsoluteFill style={{
            background: `linear-gradient(0deg, rgba(246,248,250,0.94) 0%, rgba(246,248,250,0.55) 26%, rgba(246,248,250,0) 52%)`,
          }} />
          <div style={{ position: "absolute", left: F.padX, right: F.padX,
                        bottom: F.padBottom }}>
            {b.label ? <Micro delay={10} style={{ marginBottom: 12, ...LEGIBLE }}>{b.label}</Micro> : null}
            <KineticHeadline text={b.hero} size={F.portrait ? 44 : 56} weight={700}
                             align="left" delay={16} per={1.6} style={LEGIBLE} />
          </div>
        </>
      ) : null}
    </AbsoluteFill>
  );
};

/** REAL PRODUCT VIDEO. Natural speed, uncropped, given the whole frame. */
const RealVid: React.FC<{ b: Beat; dur: number }> = ({ b, dur }) => {
  const F = useFrame();
  if (!b.video) throw new Error(`realvideo beat "${b.id}" has no video`);
  const topBand = b.hero ? (F.portrait ? 170 : 150) : 0;
  const box = fitC(16 / 9, F.padX, F.padTop + topBand, F.contentW,
                   F.contentH - topBand);
  return (
    <AbsoluteFill>
      {b.hero ? (
        <div style={{ position: "absolute", left: F.padX, top: F.padTop, width: F.contentW }}>
          {b.label ? <Micro delay={4} style={{ marginBottom: 14, ...LEGIBLE }}>{b.label}</Micro> : null}
          <KineticHeadline text={b.hero} size={F.portrait ? 44 : 56} weight={700}
                           align="left" delay={10} per={1.6} style={LEGIBLE} />
        </div>
      ) : null}
      <RealVideo id={b.video} box={box} dur={dur} delay={14} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// CONCEPT BEATS
// ---------------------------------------------------------------------------

const ConceptFrame: React.FC<{
  b: Beat; children: (x: number, y: number, w: number, h: number) => React.ReactNode;
}> = ({ b, children }) => {
  const F = useFrame();
  const topBand = F.portrait ? 200 : 170;
  const x = F.padX;
  const y = F.padTop + topBand;
  const w = F.contentW;
  /**
   * PORTRAIT RESERVES A BRANDING BAND AT THE FOOT.
   *
   * A concept diagram in portrait fills the frame edge to edge, which leaves
   * the branding layer nowhere to put a mark: the first pass dropped it in the
   * top centre, straight through the DB25 headline. Rather than let the mark
   * hunt for a gap that does not exist, the diagram gives up 120 px at the
   * bottom and the plan places concept marks there. Landscape has room in the
   * top-right and needs no such reservation.
   */
  const h = F.contentH - topBand - (F.portrait ? 160 : 30);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: F.padX, top: F.padTop, width: F.contentW }}>
        {b.label ? <Micro delay={4} style={{ marginBottom: 14, ...LEGIBLE }}>{b.label}</Micro> : null}
        <KineticHeadline text={b.hero ?? ""} size={F.portrait ? 46 : 58} weight={700}
                         align="left" delay={10} per={1.6} style={LEGIBLE} />
      </div>
      {children(x, y, w, h)}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// The dispatcher
// ---------------------------------------------------------------------------

export const Scene: React.FC<{
  beat: Beat; dur: number; plan: StripAppearance[];
}> = ({ beat, dur, plan }) => {
  const body = (() => {
    switch (beat.kind) {
      case "cold": return <Cold b={beat} dur={dur} />;
      case "statement": return <Statement b={beat} dur={dur} />;
      case "editorial": return <Editorial b={beat} dur={dur} />;
      case "macro": return <Macro b={beat} dur={dur} />;
      case "sweep": return <Sweep b={beat} dur={dur} />;
      case "hero": return <Hero b={beat} dur={dur} />;
      case "montage": return <Montage b={beat} dur={dur} />;
      case "specs": return <Specs b={beat} dur={dur} />;
      case "compare": return <Compare b={beat} dur={dur} />;
      case "broll": return <BRoll b={beat} dur={dur} />;
      case "realvideo": return <RealVid b={beat} dur={dur} />;
      case "tripath":
        return (
          <ConceptFrame b={beat}>
            {(x, y, w, h) => (
              <TriPathSplitter unit={beat.unit as UnitId} x={x} y={y} w={w} h={h} delay={18} />
            )}
          </ConceptFrame>
        );
      case "db25":
        return (
          <ConceptFrame b={beat}>
            {(x, y, w, h) => (
              <DB25Injection unit={beat.unit as UnitId} x={x} y={y} w={w} h={h} delay={18} />
            )}
          </ConceptFrame>
        );
      case "timecode":
        return (
          <ConceptFrame b={beat}>
            {(x, y, w, h) => (
              <TimecodePulse unit={beat.unit as UnitId} x={x} y={y} w={w} h={h} delay={18} />
            )}
          </ConceptFrame>
        );
      case "outro": return <EndScreen dur={dur} />;
    }
  })();

  return (
    <AbsoluteFill>
      {body}
      <ContactLayer beat={beat.id} plan={plan} />
    </AbsoluteFill>
  );
};
