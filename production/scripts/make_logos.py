#!/usr/bin/env python3
"""
Prepares the two supplied logo files for use in the films.

LOGO RULE, taken from the MOTU AVB and MOTU UltraLite-mk5 / 828 productions and
absolute here: both files are used EXACTLY as given — opaque, carrying their own
white ground, with nothing keyed, alpha-masked or knocked out, and with no box,
card, plate or panel added behind them. The white ground is part of the artwork
and was kept deliberately.

This replaces an earlier pass that re-rendered the Shivansh mark as a white
monochrome watermark on transparency and knocked the surround out of the TASCAM
mark. Both of those variants are gone.

The only operations here are lossless in intent:
  1. trim fully TRANSPARENT padding (the TASCAM file carries empty bands above
     and below its white band) so sizing by height is predictable;
  2. flatten onto white, which removes the residual soft alpha at the artwork
     edges so the dark page cannot show through the mark itself.

No white is removed by either step.
"""
import os
import numpy as np
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
LOGO = os.path.join(os.path.dirname(HERE), "assets", "logo")

SOURCES = [
    ("SHIVANSH ELECTRONICS LOGO FOR VIDEO.png", "shivansh.png"),
    ("TASCAM BRAND LOGO (2).png", "tascam.png"),
]


def prepare(src_name, dst_name):
    im = Image.open(os.path.join(ROOT, src_name)).convert("RGBA")
    a = np.array(im)
    ys, xs = np.where(a[..., 3] > 128)
    im = im.crop((xs.min(), ys.min(), xs.max() + 1, ys.max() + 1))
    flat = Image.new("RGB", im.size, (255, 255, 255))
    flat.paste(im, mask=im.getchannel("A"))
    out = os.path.join(LOGO, dst_name)
    flat.save(out)
    return dst_name, flat.size


if __name__ == "__main__":
    os.makedirs(LOGO, exist_ok=True)
    for src, dst in SOURCES:
        name, size = prepare(src, dst)
        print(f"{name:14s} {size[0]}x{size[1]}  aspect {size[0]/size[1]:.3f}")
