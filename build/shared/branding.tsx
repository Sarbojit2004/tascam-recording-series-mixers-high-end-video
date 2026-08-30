/**
 * THE BRANDING LAYER — contact strips during the body, logos only at the end.
 *
 * THE DIVISION IS ABSOLUTE. Nothing in this file draws the Shivansh or TASCAM
 * mark anywhere except EndScreen. The body of every deliverable carries contact
 * strips and nothing else. scripts/audit_contact.mjs asserts it by checking that
 * no non-outro beat has a logo appearance, so the rule cannot quietly erode the
 * next time a scene wants a mark in the corner.
 *
 * WHY THE LOGOS LEFT THE BODY. They were colliding with the pictures and copy
 * they sat beside, and the space they occupied was better spent on the details
 * a viewer needs to actually get in touch. A logo in the corner of a spec card
 * tells a viewer nothing they cannot see from the product in the middle of it;
 * a phone number does.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, SAFE, SPACE } from "./theme.ts";
import { subhead } from "./fonts.ts";
import { BRAND, CHANNELS } from "./brand.ts";
import { LogoInline } from "./logo.tsx";
import { ContactRow, ContactStrip } from "./contact.tsx";
import type { Slot, StripAppearance } from "./contactplan.ts";
import { EASE_IN_OUT, ramp } from "./anim.ts";

// ---------------------------------------------------------------------------
// Slot geometry
// ---------------------------------------------------------------------------

interface Placement {
  style: React.CSSProperties;
  dx: number;
  dy: number;
  align: "left" | "right";
}

/**
 * Resolves a slot to a position, an entrance offset and a text alignment.
 *
 * The portrait band slots deliberately sit at the INNER edge of the caption-
 * safe margin — just outside the content box, not out at the frame edge. Two
 * reasons: type hard against the edge of a phone screen reads as an accident,
 * and the outer part of that band is where platform chrome (captions, the
 * username, the action rail) is most likely to land.
 */
function placeSlot(slot: Slot, w: number, h: number): Placement {
  const portrait = h > w;
  const mx = portrait ? SAFE.marginX : SPACE.marginX + 48;

  if (slot.startsWith("band-")) {
    const top = slot.includes("top");
    /**
     * Seated in the band with real air between it and the content box.
     *
     * A hero beat's spec callouts run right down to the content floor at
     * y=1700, so a strip placed 30 px below that read as though it had fallen
     * off the bottom of the layout. Fifty-plus pixels of clear ground on both
     * sides makes the strip read as its own register rather than as content
     * that overflowed.
     */
    const y = top ? SAFE.top - 90 : h - SAFE.bottom + 52;
    const dy = top ? -26 : 26;
    if (slot.endsWith("center")) {
      return {
        style: { position: "absolute", left: 0, right: 0, top: y,
                 display: "flex", justifyContent: "center" },
        dx: 0, dy, align: "left",
      };
    }
    const right = slot.endsWith("right");
    return {
      style: { position: "absolute", top: y,
               ...(right ? { right: mx } : { left: mx }),
               display: "flex", justifyContent: right ? "flex-end" : "flex-start" },
      dx: right ? 22 : -22, dy: dy * 0.4, align: right ? "right" : "left",
    };
  }

  // Landscape corners and edges, inset well inboard of the page margin.
  const my = SPACE.marginY + 34;
  const vert = slot[0];
  const horiz = slot[1];
  const style: React.CSSProperties = { position: "absolute", display: "flex" };
  let dx = 0, dy = 0;
  let align: "left" | "right" = "left";

  if (vert === "t") { style.top = my; dy = -22; }
  else if (vert === "b") { style.bottom = my; dy = 22; }
  else { style.top = "50%"; style.transform = "translateY(-50%)"; }

  if (horiz === "l") { style.left = mx; dx = -26; }
  else if (horiz === "r") { style.right = mx; dx = 26; align = "right"; }
  else { style.left = 0; style.right = 0; style.justifyContent = "center"; }

  return { style, dx, dy, align };
}

// ---------------------------------------------------------------------------
// The body layer
// ---------------------------------------------------------------------------

export const ContactLayer: React.FC<{
  beat: string; plan: StripAppearance[];
}> = ({ beat, plan }) => {
  const { width, height } = useVideoConfig();
  return (
    <>
      {plan.filter((a) => a.beat === beat).map((a, i) => {
        const p = placeSlot(a.slot, width, height);
        return (
          <div key={i} style={p.style}>
            <ContactStrip channel={a.channel} at={a.at} dur={a.dur}
                          dx={p.dx} dy={p.dy} align={p.align} />
          </div>
        );
      })}
    </>
  );
};

// ---------------------------------------------------------------------------
// The end screen — the ONLY place a logo appears
// ---------------------------------------------------------------------------

/**
 * THE END SCREEN, identical in structure for every deliverable and for every
 * part of the long-form.
 *
 * Three blocks, in the order a viewer needs them: who is speaking (the two
 * marks), what the relationship is (the role line, with no territory clause),
 * and how to make contact (all five channels, each behind its own icon, with
 * the three WhatsApp numbers together on one line).
 */
export const EndScreen: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const portrait = height > width;
  const size = portrait ? 24 : 28;

  const out = 1 - ramp(f - (dur - 24), 0, 24, EASE_IN_OUT);
  const rule = ramp(f, 26, 30);

  return (
    <AbsoluteFill style={{
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      gap: portrait ? 30 : 34, opacity: out,
      paddingTop: portrait ? SAFE.top : SPACE.marginY,
      paddingBottom: portrait ? SAFE.bottom : SPACE.marginY,
    }}>
      <div style={{ display: "flex", alignItems: "center",
                    gap: portrait ? 32 : 46 }}>
        <LogoInline brand="shivansh" size={portrait ? 88 : 104} delay={0} />
        <div style={{ width: 1, height: portrait ? 70 : 84,
                      background: COLORS.lineStrong, opacity: 0.6 }} />
        <LogoInline brand="tascam" size={portrait ? 42 : 50} delay={10} />
      </div>

      <div style={{ ...subhead(portrait ? 26 : 30, 600), color: COLORS.slate,
                    letterSpacing: "0.045em", opacity: ramp(f, 20, 22),
                    textAlign: "center" }}>
        {BRAND.role}
      </div>

      <div style={{ height: 2, width: `${rule * (portrait ? 54 : 34)}%`,
                    background: COLORS.accent, opacity: 0.30 }} />

      <div style={{ display: "flex", flexDirection: "column",
                    gap: portrait ? 17 : 19, alignItems: "flex-start" }}>
        {CHANNELS.map((c, i) => (
          <ContactRow key={c} channel={c} delay={34 + i * 8} size={size} />
        ))}
      </div>
    </AbsoluteFill>
  );
};
