/**
 * THE CONTACT STRIP — the only branding that appears during main content.
 *
 * WHAT CHANGED AND WHY. This production used to place the Shivansh and TASCAM
 * logos throughout the running video. Two things were wrong with that: the
 * marks landed on the pictures and copy they were meant to accompany, and the
 * details a viewer actually needs in order to make contact — the website, the
 * social handles, the phone numbers — were surfaced far too rarely to be
 * useful. So the logos have moved out of the body entirely and now appear only
 * on the end screens, and the body instead carries these strips: an icon and
 * the detail it identifies, and nothing else.
 *
 * A STRIP IS NEVER STATIC. It slides in from the nearest frame edge, holds, and
 * leaves the same way; the next one appears somewhere else. Nothing is pinned,
 * which is both what was asked for and what stops a repeated element from
 * turning into furniture the eye learns to skip.
 *
 * WHATSAPP CARRIES ALL THREE NUMBERS AT ONCE, behind a single icon, in the
 * order the client specified. It is the widest strip by some margin, so its
 * type steps down a size and its placement is restricted to slots with the
 * width to hold it — see fitsWide() below.
 */
import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "./theme.ts";
import { spec } from "./fonts.ts";
import { CHANNEL_VALUE, isWide, type ChannelKey } from "./brand.ts";
import { ChannelIcon, type IconKey } from "./icons.tsx";
import { EASE_IN_OUT, EASE_OUT, ramp } from "./anim.ts";

/**
 * A strip may sit over a photograph, so its text carries a soft halo rather
 * than a plate. A plate would be a box, and boxes are what this design avoids.
 */
const LEGIBLE: React.CSSProperties = {
  textShadow:
    "0 1px 2px rgba(246,248,250,0.94), 0 0 10px rgba(246,248,250,0.80), " +
    "0 0 22px rgba(246,248,250,0.55)",
};

export const ContactStrip: React.FC<{
  channel: ChannelKey;
  /** Local frame the strip appears at, and how long it stays. */
  at?: number;
  dur?: number;
  /** Entrance direction, as a unit offset. Set by the placement plan. */
  dx?: number;
  dy?: number;
  size?: number;
  align?: "left" | "right";
  style?: React.CSSProperties;
}> = ({ channel, at = 0, dur = 90, dx = 0, dy = 0, size, align = "left", style }) => {
  const f = useCurrentFrame() - at;
  const { width, height } = useVideoConfig();
  const portrait = height > width;

  const inF = 18;
  const outF = 16;
  const inP = ramp(f, 0, inF, EASE_OUT);
  const outP = 1 - ramp(f - (dur - outF), 0, outF, EASE_IN_OUT);
  const p = Math.min(inP, outP);
  if (p <= 0.002) return null;

  // WhatsApp's line is about twice as long, so it steps down rather than
  // forcing every other strip to be small enough for the worst case.
  // Portrait steps UP rather than down: these strips are the marketing, they
  // are read on a phone, and the band has the room. Landscape can afford more
  // still, since its strips sit in scene corners rather than a fixed band.
  const base = size ?? (portrait ? 23 : 25);
  const fs = isWide(channel) ? Math.round(base * 0.86) : base;
  const icon = Math.round(fs * 1.5);

  const tx = (1 - inP) * dx - (1 - outP) * dx * 0.5;
  const ty = (1 - inP) * dy - (1 - outP) * dy * 0.5;

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: Math.round(fs * 0.62),
      opacity: p,
      transform: `translate3d(${tx}px, ${ty}px, 0)`,
      flexDirection: align === "right" ? "row-reverse" : "row",
      whiteSpace: "nowrap",
      ...style,
    }}>
      <ChannelIcon icon={channel as IconKey} size={icon} />
      <div style={{ ...spec(fs, 600, "0.012em"), color: COLORS.ink, ...LEGIBLE }}>
        {CHANNEL_VALUE[channel]}
      </div>
    </div>
  );
};

/**
 * The end-screen row: the same pairing, larger, arriving in sequence.
 *
 * Kept in this file rather than the end screen's so the two can never drift
 * into showing the same detail two different ways.
 */
export const ContactRow: React.FC<{
  channel: ChannelKey; delay: number; size: number;
}> = ({ channel, delay, size }) => {
  const f = useCurrentFrame();
  const p = ramp(f, delay, 20, EASE_OUT);
  const fs = isWide(channel) ? Math.round(size * 0.88) : size;
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: size * 0.66, opacity: p,
      transform: `translateY(${(1 - p) * 12}px)`, whiteSpace: "nowrap",
    }}>
      <div style={{ width: size * 1.5, display: "flex", justifyContent: "center" }}>
        <ChannelIcon icon={channel as IconKey} size={size * 1.28} />
      </div>
      <div style={{ ...spec(fs, 600, "0.015em"), color: COLORS.ink, ...LEGIBLE }}>
        {CHANNEL_VALUE[channel]}
      </div>
    </div>
  );
};
