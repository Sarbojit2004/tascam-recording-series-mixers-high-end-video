/**
 * CHANNEL ICONS — the marks that identify each contact row.
 *
 * The user supplied the five marks to use: Facebook, Instagram, YouTube, a WWW
 * globe for the website, and WhatsApp for the phone numbers. They are drawn
 * here as VECTOR geometry rather than shipped as raster files, for three
 * reasons that matter to this production specifically:
 *
 *   - They are rendered from 26 px (a lower-third) to 52 px (the outro rows)
 *     across two canvases. A vector mark is exact at every one of those sizes;
 *     a bitmap would be resampled at most of them.
 *   - The near-white ground means an icon's own edge quality is visible. These
 *     carry no baked-in matte, so nothing haloes against the paper.
 *   - Nothing third-party enters the repository as a binary.
 *
 * Each is built from primitives — circles, rounded rects, arcs, one clip — at
 * the platform's own brand colour, so the marks read as themselves at a glance,
 * which is the entire job Section 10 gives them.
 *
 * These are the platforms' trademarks, used nominatively: they identify
 * Shivansh Electronics' own presence on each service and nothing more.
 */
import React from "react";

export type IconKey = "website" | "instagram" | "facebook" | "youtube" | "whatsapp";

interface P { size?: number; style?: React.CSSProperties }

const wrap = (size: number, style?: React.CSSProperties): React.CSSProperties => ({
  width: size, height: size, display: "block", flexShrink: 0,
  filter: "drop-shadow(0 1px 2px rgba(14,17,22,0.16))",
  ...style,
});

/** FACEBOOK — #1877F2 disc, white lowercase f clipped by the disc. */
export const FacebookIcon: React.FC<P> = ({ size = 34, style }) => (
  <svg viewBox="0 0 100 100" style={wrap(size, style)} aria-label="Facebook">
    <defs>
      <clipPath id="fbClip"><circle cx="50" cy="50" r="50" /></clipPath>
    </defs>
    <circle cx="50" cy="50" r="50" fill="#1877F2" />
    <path
      clipPath="url(#fbClip)"
      fill="#FFFFFF"
      d="M57.4 101V62.6h12.9l2.45-15.6H57.4v-10.1c0-4.27 1.32-7.5 7.5-7.5h8.05V15.5
         c-1.4-.19-6.2-.6-11.8-.6-11.7 0-19.7 7.14-19.7 20.3v11.8H28.4v15.6h13.05V101z"
    />
  </svg>
);

/** INSTAGRAM — the corner-anchored gradient with the white camera outline. */
export const InstagramIcon: React.FC<P> = ({ size = 34, style }) => (
  <svg viewBox="0 0 100 100" style={wrap(size, style)} aria-label="Instagram">
    <defs>
      {/* warm sweep anchored bottom-left, then the violet corner over it */}
      <radialGradient id="igWarm" cx="28%" cy="102%" r="132%">
        <stop offset="0%" stopColor="#FFD600" />
        <stop offset="16%" stopColor="#FF9500" />
        <stop offset="34%" stopColor="#FF5100" />
        <stop offset="56%" stopColor="#FF2270" />
        <stop offset="78%" stopColor="#F4009B" />
        <stop offset="100%" stopColor="#E600A9" />
      </radialGradient>
      <radialGradient id="igCool" cx="16%" cy="-4%" r="82%">
        <stop offset="0%" stopColor="#5C1FE0" stopOpacity="0.95" />
        <stop offset="45%" stopColor="#8A15D6" stopOpacity="0.55" />
        <stop offset="100%" stopColor="#C400C4" stopOpacity="0" />
      </radialGradient>
    </defs>
    <rect x="0" y="0" width="100" height="100" rx="29" fill="url(#igWarm)" />
    <rect x="0" y="0" width="100" height="100" rx="29" fill="url(#igCool)" />
    <rect x="15.5" y="15.5" width="69" height="69" rx="21.5"
          fill="none" stroke="#FFFFFF" strokeWidth="8.4" />
    <circle cx="50" cy="50" r="17.5" fill="none" stroke="#FFFFFF" strokeWidth="8.4" />
    <circle cx="70.6" cy="29.6" r="5.3" fill="#FFFFFF" />
  </svg>
);

/** YOUTUBE — the red rounded screen with the white play triangle. */
export const YouTubeIcon: React.FC<P> = ({ size = 34, style }) => (
  <svg viewBox="0 0 128 90" style={{ ...wrap(size, style), height: (size * 90) / 128 }}
       aria-label="YouTube">
    <rect x="0" y="0" width="128" height="90" rx="26" ry="24" fill="#FF0000" />
    <path fill="#FFFFFF" d="M51 24.5 L88 45 L51 65.5 Z" />
  </svg>
);

/** WHATSAPP — the green speech bubble with its tail and the white handset. */
export const WhatsAppIcon: React.FC<P> = ({ size = 34, style }) => (
  <svg viewBox="0 0 100 100" style={wrap(size, style)} aria-label="WhatsApp">
    {/* white bubble + tail, then the green bubble inset inside it */}
    <path fill="#FFFFFF"
      d="M4.2 96.6 L11 74.8 A46.4 46.4 0 1 1 27.9 91.2 Z" />
    <path fill="#25D366"
      d="M12.9 88.2 L17.9 72.1 A38.9 38.9 0 1 1 31.6 84.6 Z" />
    {/* the handset: two swelled ends joined by the palm sweep */}
    <path fill="#FFFFFF"
      d="M38.6 30.4c-.9-2.1-1.9-2.1-2.8-2.2h-2.4c-.8 0-2.2.3-3.3 1.6-1.1 1.3-4.3 4.2-4.3 10.2
         0 6 4.4 11.8 5 12.6.6.8 8.5 13.6 21 18.5 10.4 4.1 12.5 3.3 14.8 3.1 2.2-.2 7.3-3 8.3-5.9
         1-2.9 1-5.3.7-5.9-.3-.6-1.1-.9-2.4-1.5-1.2-.6-7.3-3.6-8.4-4-1.1-.4-2-.6-2.8.6-.8 1.2-3.2 4-3.9 4.8
         -.7.8-1.4.9-2.7.3-1.2-.6-5.2-1.9-9.9-6.1-3.7-3.3-6.1-7.3-6.9-8.5-.7-1.2-.1-1.9.5-2.5.6-.6 1.2-1.4 1.8-2.1
         .6-.7.8-1.2 1.2-2 .4-.8.2-1.5-.1-2.1-.3-.6-2.7-6.7-3.7-9z" />
  </svg>
);

/** WEBSITE — the WWW globe with its cursor, as supplied. */
export const WebsiteIcon: React.FC<P> = ({ size = 34, style }) => (
  <svg viewBox="0 0 100 100" style={wrap(size, style)} aria-label="Website">
    <g fill="none" stroke="#12161C" strokeWidth="4.4" strokeLinecap="round">
      <circle cx="46" cy="48" r="36" />
      {/* meridians and the equator, so it reads as a globe not a ring */}
      <ellipse cx="46" cy="48" rx="16.5" ry="36" />
      <path d="M12.5 35 H79.5 M12.5 61 H79.5" />
      <path d="M46 12 V84" />
    </g>
    {/* the WWW banner sits across the middle, on its own capsule */}
    <rect x="9" y="36" width="70" height="22" rx="11"
          fill="#F6F8FA" stroke="#12161C" strokeWidth="4.4" />
    <text x="44" y="52.4" textAnchor="middle"
          style={{
            fontFamily: "Archivo, 'Archivo', system-ui, sans-serif",
            fontWeight: 800, fontSize: 17, letterSpacing: "-0.02em", fill: "#12161C",
          }}>WWW</text>
    {/* cursor arrow — clear of the capsule, emerging past the globe's edge */}
    <path fill="#12161C" stroke="#F6F8FA" strokeWidth="2.8" strokeLinejoin="round"
          d="M66 58 L95 76 L82 78.5 L87.5 92 L79.5 95.5 L74 82 L65 90 Z" />
  </svg>
);

export const ICONS: Record<IconKey, React.FC<P>> = {
  website: WebsiteIcon,
  instagram: InstagramIcon,
  facebook: FacebookIcon,
  youtube: YouTubeIcon,
  whatsapp: WhatsAppIcon,
};

export const ChannelIcon: React.FC<P & { icon: IconKey }> = ({ icon, ...rest }) => {
  const C = ICONS[icon];
  return <C {...rest} />;
};
