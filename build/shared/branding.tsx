/**
 * THE BRANDING LAYER — renders the audited plan from brandplan.ts.
 *
 * Nothing here decides WHERE or WHEN a mark appears; that lives in the plan so
 * scripts/branding_cadence.mjs can audit it and fail the build. This file only
 * decides WHAT each of the four forms looks like.
 *
 * FOUR FORMS, per Section 10.2's requirement that the form vary and not only
 * the coordinates:
 *
 *   mark    a bare logo, sliding in from the nearest frame edge
 *   third   a lower-third carrying ONE rotating contact detail
 *   beat    a dedicated branding moment with the mark, the role line and a
 *           contact detail composed together
 *   outro   the closing block — every channel at once, the only place the full
 *           contact set appears together
 *
 * Section 10.5's role line reads "Authorized Partner of TASCAM" and carries no
 * territory clause. It comes from BRAND.role and is never retyped.
 */
import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, SAFE, SPACE } from "./theme.ts";
import { micro, spec, subhead } from "./fonts.ts";
import { BRAND, CONTACT, CONTACT_ICON, CONTACT_LABEL, type ContactKey } from "./brand.ts";
import { ChannelIcon, type IconKey } from "./icons.tsx";
import type { BrandAppearance } from "./brandplan.ts";
import { EASE_IN_OUT, EASE_OUT, ramp } from "./anim.ts";
import { LogoInline, LogoMark } from "./logo.tsx";

/**
 * Text that may land over a photograph gets a soft halo rather than a plate.
 * The near-white ground is only near-white where the page shows through; a
 * light product shot behind a rail can wash a thin amber line out entirely.
 */
const LEGIBLE: React.CSSProperties = {
  textShadow: "0 1px 2px rgba(246,248,250,0.92), 0 0 12px rgba(246,248,250,0.72)",
};

const contactValue = (k: ContactKey) => CONTACT[k];

// ---------------------------------------------------------------------------
// third — a lower-third carrying one rotating contact detail
// ---------------------------------------------------------------------------
const Third: React.FC<{ a: BrandAppearance }> = ({ a }) => {
  const f = useCurrentFrame() - a.at;
  const { width, height } = useVideoConfig();
  const portrait = height > width;

  const inP = ramp(f, 0, 20, EASE_OUT);
  const outP = 1 - ramp(f - (a.dur - 18), 0, 18, EASE_IN_OUT);
  const p = Math.min(inP, outP);
  if (p <= 0.002) return null;

  const bottom = portrait ? SAFE.bottom + 28 : SPACE.marginY + 44;
  const left = portrait ? SAFE.marginX + 12 : SPACE.marginX + 48;
  const right = a.pos.endsWith("r");
  const size = a.size ?? (portrait ? 40 : 44);
  const k = a.contact ?? "website";

  return (
    <div style={{
      position: "absolute", bottom, left: right ? undefined : left,
      right: right ? left : undefined,
      display: "flex", alignItems: "center", gap: portrait ? 16 : 22,
      opacity: p,
      transform: `translateX(${(1 - inP) * (right ? 30 : -30)}px)`,
      flexDirection: right ? "row-reverse" : "row",
    }}>
      <LogoInline brand={a.brand} size={size} delay={0} />
      <div style={{
        width: 1, height: size * 0.86, background: COLORS.lineStrong, opacity: 0.7,
      }} />
      {/* the channel's own mark does the identifying — no label text needed */}
      <ChannelIcon icon={CONTACT_ICON[k] as IconKey} size={size * 0.62} />
      <div style={{ ...spec(portrait ? 21 : 24, 600, "0.015em"),
                    color: COLORS.inkSoft, ...LEGIBLE }}>
        {contactValue(k)}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// beat — a dedicated branding moment between segments
// ---------------------------------------------------------------------------
const BrandBeat: React.FC<{ a: BrandAppearance }> = ({ a }) => {
  const f = useCurrentFrame() - a.at;
  const { width, height } = useVideoConfig();
  const portrait = height > width;

  const inP = ramp(f, 0, 22, EASE_OUT);
  const outP = 1 - ramp(f - (a.dur - 20), 0, 20, EASE_IN_OUT);
  const p = Math.min(inP, outP);
  if (p <= 0.002) return null;

  const k = a.contact ?? "website";
  const rule = ramp(f, 14, 26, EASE_OUT);

  return (
    <div style={{
      position: "absolute", inset: 0, display: "flex",
      flexDirection: "column", alignItems: "center", justifyContent: "center",
      opacity: p, gap: portrait ? 22 : 26,
      paddingTop: portrait ? SAFE.top : 0,
      paddingBottom: portrait ? SAFE.bottom : 0,
    }}>
      <LogoInline brand={a.brand} size={a.size ?? (portrait ? 96 : 116)} delay={2} />
      <div style={{ height: 2, width: `${rule * (portrait ? 46 : 30)}%`,
                    background: COLORS.accent, opacity: 0.34 }} />
      {a.brand === "shivansh" ? (
        <div style={{ ...subhead(portrait ? 26 : 30, 600), color: COLORS.slate,
                      letterSpacing: "0.04em", textAlign: "center", ...LEGIBLE }}>
          {BRAND.role}
        </div>
      ) : null}
      <div style={{ display: "flex", alignItems: "center",
                    gap: portrait ? 16 : 20 }}>
        <ChannelIcon icon={CONTACT_ICON[k] as IconKey} size={portrait ? 40 : 46} />
        <div style={{ ...spec(portrait ? 27 : 32, 600, "0.02em"),
                      color: COLORS.ink, ...LEGIBLE }}>
          {contactValue(k)}
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// outro — the closing block, the only place the whole contact set is together
// ---------------------------------------------------------------------------
/**
 * One closing contact row: the channel's own mark, then the detail.
 *
 * The icon column is a fixed width so every row's value starts on the same
 * vertical — five different marks, one alignment.
 */
const Row: React.FC<{ icon: IconKey; value: string; delay: number;
                      size: number; f: number }> = ({ icon, value, delay, size, f }) => {
  const p = ramp(f, delay, 20, EASE_OUT);
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: size * 0.68, opacity: p,
      transform: `translateY(${(1 - p) * 12}px)`,
    }}>
      <div style={{ width: size * 1.5, display: "flex", justifyContent: "center" }}>
        <ChannelIcon icon={icon} size={size * 1.28} />
      </div>
      <div style={{ ...spec(size, 600, "0.015em"), color: COLORS.ink, ...LEGIBLE }}>
        {value}
      </div>
    </div>
  );
};

export const Outro: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const portrait = height > width;
  const size = portrait ? 23 : 27;

  const outP = 1 - ramp(f - (dur - 24), 0, 24, EASE_IN_OUT);

  return (
    <div style={{
      position: "absolute", inset: 0, display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      gap: portrait ? 26 : 30, opacity: outP,
      paddingTop: portrait ? SAFE.top : 0,
      paddingBottom: portrait ? SAFE.bottom : 0,
    }}>
      <div style={{ display: "flex", alignItems: "center",
                    gap: portrait ? 30 : 44, marginBottom: portrait ? 4 : 8 }}>
        <LogoInline brand="shivansh" size={portrait ? 84 : 100} delay={0} />
        <div style={{ width: 1, height: portrait ? 66 : 80,
                      background: COLORS.lineStrong, opacity: 0.6 }} />
        <LogoInline brand="tascam" size={portrait ? 40 : 48} delay={10} />
      </div>

      <div style={{ ...subhead(portrait ? 25 : 29, 600), color: COLORS.slate,
                    letterSpacing: "0.045em", opacity: ramp(f, 20, 22), ...LEGIBLE }}>
        {BRAND.role}
      </div>

      <div style={{ height: 2, width: `${ramp(f, 26, 30) * (portrait ? 52 : 34)}%`,
                    background: COLORS.accent, opacity: 0.30 }} />

      <div style={{ display: "flex", flexDirection: "column",
                    gap: portrait ? 13 : 15 }}>
        <Row f={f} icon="website" value={BRAND.website} delay={34} size={size} />
        <Row f={f} icon="instagram" value={BRAND.instagram} delay={42} size={size} />
        <Row f={f} icon="facebook" value={BRAND.facebook} delay={50} size={size} />
        <Row f={f} icon="youtube" value={BRAND.youtube} delay={58} size={size} />
        <Row f={f} icon="whatsapp" value={BRAND.phones[0]} delay={66} size={size} />
        <Row f={f} icon="whatsapp" value={BRAND.phones[1]} delay={74} size={size} />
        <Row f={f} icon="whatsapp" value={BRAND.phones[2]} delay={82} size={size} />
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// The layer a scene mounts. Every appearance for this beat, and only this beat.
// ---------------------------------------------------------------------------
export const SceneBranding: React.FC<{
  beat: string; plan: BrandAppearance[];
}> = ({ beat, plan }) => (
  <>
    {plan.filter((a) => a.beat === beat).map((a, i) => {
      if (a.form === "mark") {
        return (
          <LogoMark key={i} brand={a.brand} pos={a.pos}
                    size={a.size ?? 54} at={a.at} dur={a.dur} />
        );
      }
      if (a.form === "third") return <Third key={i} a={a} />;
      if (a.form === "beat") return <BrandBeat key={i} a={a} />;
      return null; // "outro" composes itself
    })}
  </>
);
