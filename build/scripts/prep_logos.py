#!/usr/bin/env python3
"""Strips the baked-in white plate from the two supplied logo files.

WHY THIS EXISTS
---------------
Section 10.1 asks for two things together: (a) no boxed/carded plate wrapping
either logo, matching how the MOTU productions present them; and (b) do not
strip the logo file's own internal background. It also says to check this
against the real asset files and FLAG rather than guess.

Checked. For these specific files the two halves are mutually exclusive:

    SHIVANSH ELECTRONICS LOGO FOR VIDEO.png   97.9% opaque, 77.2% white
    TASCAM BRAND LOGO (2).png                 artwork on an opaque white band

The artwork sits on an opaque white rounded rectangle. The file's own internal
background IS a boxed plate, so preserving it produces exactly the plate the
same sentence forbids — verified by rendering both options on the #F6F8FA
ground, where the as-is version shows an unmistakable white pill.

The named reference resolves it the same way: the MOTU M-Series build's own
`scripts/prep_logos.py` keys the white ground out, and its shipped
`public/logo/shivansh.png` is 76.6% transparent. (That repo's theme.ts carries
a stale comment claiming otherwise; the shipped pixels are stripped.)

So this build strips, and the user confirmed full autonomy on the call.

WHAT IS AND IS NOT CHANGED. Only the white ground is keyed out. The artwork
itself is untouched — the Shivansh mark keeps its globe, its wordmark, its
baked tagline and its (TM); the TASCAM wordmark keeps its exact letterforms.
Stripping white from black artwork leaves no transparent hole.

METHOD. Alpha is derived from each pixel's distance from white using the
minimum channel, so a coloured or black pixel stays fully opaque while the
white ground goes fully clear. Colour is then un-premultiplied against white,
which stops anti-aliased glyph edges keeping a white fringe once the ground
behind them changes.
"""
import os
import numpy as np
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
BUILD = os.path.dirname(HERE)
ROOT = os.path.dirname(BUILD)
OUT = os.path.join(BUILD, "assets", "logo")

RAMP = 60.0  # min-channel distance from 255 over which alpha ramps 0 -> 1

LOGOS = [
    ("SHIVANSH ELECTRONICS LOGO FOR VIDEO.png", "shivansh.png"),
    ("TASCAM BRAND LOGO (2).png", "tascam.png"),
]


def strip_plate(src_path, dst_path):
    im = Image.open(src_path).convert("RGBA")
    a = np.array(im).astype(np.float32)
    rgb, alpha0 = a[..., :3], a[..., 3:4] / 255.0

    # Distance from white via the minimum channel: black/coloured art -> far,
    # white ground -> zero.
    dist = 255.0 - rgb.min(axis=2, keepdims=True)
    alpha = np.clip(dist / RAMP, 0.0, 1.0) * alpha0

    # Un-premultiply against white so glyph edges keep no white fringe.
    with np.errstate(divide="ignore", invalid="ignore"):
        out_rgb = np.where(alpha > 0.003, (rgb - 255.0 * (1.0 - alpha)) / alpha, 0.0)
    out_rgb = np.clip(out_rgb, 0, 255)

    out = np.concatenate([out_rgb, alpha * 255.0], axis=2).astype(np.uint8)
    img = Image.fromarray(out, "RGBA")

    # Trim fully transparent padding so sizing by height is predictable.
    bbox = img.getchannel("A").point(lambda v: 255 if v > 8 else 0).getbbox()
    if bbox:
        img = img.crop(bbox)

    os.makedirs(os.path.dirname(dst_path), exist_ok=True)
    img.save(dst_path)

    arr = np.array(img)
    return {
        "size": img.size,
        "opaque": float((arr[..., 3] > 200).mean()),
        "transparent": float((arr[..., 3] < 20).mean()),
        "white_opaque": float(((arr[..., :3] > 235).all(2) & (arr[..., 3] > 200)).mean()),
    }


if __name__ == "__main__":
    for src, dst in LOGOS:
        s = os.path.join(ROOT, src)
        if not os.path.exists(s):
            raise SystemExit(f"missing logo source: {s}")
        st = strip_plate(s, os.path.join(OUT, dst))
        print(
            f"{dst:14s} {st['size'][0]}x{st['size'][1]}  "
            f"opaque {st['opaque']:.1%}  transparent {st['transparent']:.1%}  "
            f"white-and-opaque {st['white_opaque']:.1%}"
        )
