/**
 * LOGO TREATMENT — taken from the MOTU AVB and MOTU UltraLite-mk5 / 828
 * productions and absolute here.
 *
 * Both supplied files are drawn EXACTLY as given: opaque, carrying their own
 * white ground, with NO box, card, plate, panel or rounded backing added
 * behind them, and nothing keyed or alpha-masked. The white ground is part of
 * the artwork and was kept deliberately.
 *
 * The one thing this build does that the MOTU reference does not: the marks
 * MOVE. `brandplan.ts` assigns every beat a different slot, so the Shivansh
 * logo and the website are on screen continuously but never twice in the same
 * place, and the socials, the contact numbers and the TASCAM mark rotate
 * alongside them.
 *
 * Note on the ground. The MOTU videos hold the page in a near-white range, so
 * a white-ground logo reads as continuous with the page. This production's
 * page is near-black by Stage 5, so the same file reads instead as a printed
 * white label on the void — high contrast, unmistakably a brand mark, and
 * legible over any imagery that passes beneath it. That is the intended
 * result of using the file as supplied on this palette.
 */
import React from "react";
import { AbsoluteFill, Img, useCurrentFrame } from "remotion";
import { COLOR, RAIL } from "../theme.ts";
import { BRAND } from "../brand.ts";
import { LOGO_SHIVANSH, LOGO_TASCAM } from "../assets.ts";
import type { Align, Band, BrandPlan } from "../brandplan.ts";
import { MONO, SANS } from "../fonts.ts";
import { fade } from "../anim.ts";

/** Either supplied logo, drawn as-is. Height-driven; width follows the file. */
export const Logo: React.FC<{
  which: "shivansh" | "tascam";
  height: number;
  style?: React.CSSProperties;
}> = ({ which, height, style }) => (
  <Img
    src={which === "shivansh" ? LOGO_SHIVANSH : LOGO_TASCAM}
    style={{ height, width: "auto", display: "block", objectFit: "contain", ...style }}
  />
);

const justify = (a: Align) =>
  a === "left" ? "flex-start" : a === "right" ? "flex-end" : "center";

/**
 * The rail travels over full-bleed imagery, so its TEXT has to survive a lit
 * frame as well as the near-black page. The logos need nothing — they carry
 * their own opaque white ground — but the website, the handles and the numbers
 * sit directly on the picture. This is invisible on the dark default and only
 * asserts itself over bright content.
 */
const LEGIBLE: React.CSSProperties = {
  textShadow: "0 1px 3px rgba(8,9,11,0.95), 0 0 9px rgba(8,9,11,0.75)",
};

/**
 * The rail. One absolutely-positioned band, top or bottom, outside the
 * caption-safe padding — which is where no scene ever draws type.
 */
const Rail: React.FC<{
  band: Band; align: Align; portrait: boolean; delay: number; children: React.ReactNode;
}> = ({ band, align, portrait, delay, children }) => {
  const f = useCurrentFrame();
  const r = portrait ? RAIL.portrait : RAIL.landscape;
  const t = fade(f, delay, delay + 16);
  return (
    <div
      style={{
        position: "absolute",
        left: r.inset, right: r.inset,
        ...(band === "top" ? { top: r.top } : { bottom: r.bottom }),
        display: "flex", justifyContent: justify(align), alignItems: "center",
        opacity: t,
        transform: `translateY(${(1 - t) * (band === "top" ? -10 : 10)}px)`,
        pointerEvents: "none",
      }}
    >
      {children}
    </div>
  );
};

/** Shivansh logo above the website — the most-repeated pairing in the set. */
const MarkLockup: React.FC<{ align: Align; portrait: boolean }> = ({ align, portrait }) => {
  const r = portrait ? RAIL.portrait : RAIL.landscape;
  return (
    <div
      style={{
        display: "flex", flexDirection: "column", gap: r.gap,
        alignItems: align === "left" ? "flex-start" : align === "right" ? "flex-end" : "center",
      }}
    >
      <Logo which="shivansh" height={r.markH} />
      <div style={{ fontFamily: MONO, fontSize: r.web, fontWeight: 600, letterSpacing: r.webTrack, color: COLOR.amber, ...LEGIBLE }}>
        {BRAND.website}
      </div>
    </div>
  );
};

/** The three channels, on one line in landscape and stacked in portrait. */
const SocialStrip: React.FC<{ portrait: boolean; align: Align }> = ({ portrait, align }) => {
  const r = portrait ? RAIL.portrait : RAIL.landscape;
  return (
    <div
      style={{
        display: "flex", flexDirection: portrait ? "column" : "row",
        gap: portrait ? r.gap + 2 : 26, flexWrap: "wrap",
        alignItems: portrait ? (align === "right" ? "flex-end" : "flex-start") : "baseline",
      }}
    >
      {BRAND.socials.map(([k, v]) => (
        <div key={k} style={{ display: "flex", gap: 9, alignItems: "baseline" }}>
          <span style={{ fontFamily: MONO, fontSize: r.tag, letterSpacing: r.tagTrack, color: COLOR.rimBright, ...LEGIBLE }}>
            {k.toUpperCase()}
          </span>
          <span style={{ fontFamily: SANS, fontSize: r.body, color: COLOR.inkDim, letterSpacing: 0.3, ...LEGIBLE }}>{v}</span>
        </div>
      ))}
    </div>
  );
};

/** The three call / WhatsApp lines. */
const NumberStrip: React.FC<{ portrait: boolean; align: Align }> = ({ portrait, align }) => {
  const r = portrait ? RAIL.portrait : RAIL.landscape;
  return (
    <div
      style={{
        display: "flex", flexDirection: portrait ? "column" : "row",
        gap: portrait ? r.gap : 24, alignItems: "baseline", flexWrap: "wrap",
        justifyContent: align === "right" ? "flex-end" : "flex-start",
      }}
    >
      <span style={{ fontFamily: MONO, fontSize: r.tag, letterSpacing: r.tagTrack, color: COLOR.rimBright, ...LEGIBLE }}>
        CALL / WHATSAPP
      </span>
      {BRAND.numbers.map((n) => (
        <span
          key={n}
          style={{
            fontFamily: MONO, fontSize: r.num, fontWeight: 600, color: COLOR.ink,
            letterSpacing: 0.8, fontVariantNumeric: "tabular-nums", ...LEGIBLE,
          }}
        >
          {n}
        </span>
      ))}
    </div>
  );
};

/** TASCAM mark under its relationship line — the less frequent of the two. */
const TascamLockup: React.FC<{ align: Align; portrait: boolean }> = ({ align, portrait }) => {
  const r = portrait ? RAIL.portrait : RAIL.landscape;
  return (
    <div
      style={{
        display: "flex", flexDirection: "column", gap: r.gap,
        alignItems: align === "right" ? "flex-end" : align === "left" ? "flex-start" : "center",
      }}
    >
      <span style={{ fontFamily: MONO, fontSize: r.tag, letterSpacing: r.tagTrack, color: COLOR.rimBright, ...LEGIBLE }}>
        {BRAND.role.toUpperCase()}
      </span>
      <Logo which="tascam" height={r.tascamH} />
    </div>
  );
};

/**
 * Mounted by every scene. Draws that beat's assigned rail contents and nothing
 * else; the plan guarantees the two rails are never in the same band.
 */
export const BrandLayer: React.FC<{ plan: BrandPlan; portrait: boolean }> = ({ plan, portrait }) => (
  <>
    {plan.mark && (
      <Rail band={plan.mark.band} align={plan.mark.align} portrait={portrait} delay={6}>
        <MarkLockup align={plan.mark.align} portrait={portrait} />
      </Rail>
    )}
    {plan.second && (
      <Rail band={plan.second.slot.band} align={plan.second.slot.align} portrait={portrait} delay={16}>
        {plan.second.payload === "socials" ? (
          <SocialStrip portrait={portrait} align={plan.second.slot.align} />
        ) : plan.second.payload === "numbers" ? (
          <NumberStrip portrait={portrait} align={plan.second.slot.align} />
        ) : (
          <TascamLockup align={plan.second.slot.align} portrait={portrait} />
        )}
      </Rail>
    )}
  </>
);

/**
 * The resolution screen. Everything marketed across the film lands here at
 * once: both logos, the partner designation, the website, all three social
 * channels and all three numbers.
 */
export const OutroLegend: React.FC<{ portrait?: boolean; opacity?: number }> = ({ portrait, opacity = 1 }) => {
  const s = portrait ? 1.0 : 1.12;
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 22 * s }}>
        <Logo which="shivansh" height={(portrait ? 104 : 96) * s} />

        <div style={{ fontFamily: MONO, fontSize: 20 * s, letterSpacing: 5.2 * s, color: COLOR.amber, textTransform: "uppercase", textAlign: "center" }}>
          {BRAND.role}
        </div>
        <div style={{ fontFamily: SANS, fontSize: 21 * s, color: COLOR.inkDim, letterSpacing: 1.2, textAlign: "center" }}>
          {BRAND.region}
        </div>

        <Logo which="tascam" height={(portrait ? 40 : 38) * s} />

        <div style={{ width: (portrait ? 320 : 360) * s, height: 1, background: COLOR.lineStrong, margin: `${4 * s}px 0` }} />

        <div style={{ fontFamily: MONO, fontSize: 31 * s, fontWeight: 700, letterSpacing: 0.6, color: COLOR.ink }}>
          {BRAND.website}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 9 * s, alignItems: "flex-start" }}>
          {BRAND.socials.map(([k, v]) => (
            <div key={k} style={{ display: "flex", gap: 14 * s, alignItems: "baseline" }}>
              <span style={{ fontFamily: MONO, fontSize: 13 * s, letterSpacing: 2.4 * s, color: COLOR.rim, width: 92 * s }}>
                {k.toUpperCase()}
              </span>
              <span style={{ fontFamily: SANS, fontSize: 18 * s, color: COLOR.inkDim, letterSpacing: 0.4 }}>{v}</span>
            </div>
          ))}
        </div>

        <div style={{ width: (portrait ? 320 : 360) * s, height: 1, background: COLOR.lineStrong, margin: `${4 * s}px 0` }} />

        <div style={{ fontFamily: MONO, fontSize: 13 * s, letterSpacing: 3.6 * s, color: COLOR.rimBright, textTransform: "uppercase" }}>
          Call / WhatsApp
        </div>
        <div style={{ display: "flex", flexDirection: portrait ? "column" : "row", gap: portrait ? 8 * s : 30 * s, alignItems: "center" }}>
          {BRAND.numbers.map((n) => (
            <div key={n} style={{ fontFamily: MONO, fontSize: 27 * s, fontWeight: 600, color: COLOR.ink, letterSpacing: 1.1, fontVariantNumeric: "tabular-nums" }}>
              {n}
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
