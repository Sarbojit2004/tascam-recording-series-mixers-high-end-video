#!/usr/bin/env python3
"""
Derives HUD-grade logo variants for a near-black page.

Stage 10 asks for the Shivansh mark as "a continuous, 60% opacity watermark"
that reads as a technical overlay rather than a retail sticker. The supplied
file is black artwork on an opaque WHITE rounded plate — at 60% over Stage 5's
"deep, pure black void" that plate would be a glowing block, which is the exact
opposite of restrained. So the plate is removed and the artwork is re-rendered
as a single-weight white mark on transparency: same logo, correct medium.

The TASCAM mark is already built for dark grounds (white pill on black), so it
only needs its black surround knocked out.
"""
import os
import numpy as np
from PIL import Image
from scipy.ndimage import label, binary_dilation

HERE = os.path.dirname(os.path.abspath(__file__))
LOGO = os.path.join(os.path.dirname(HERE), "assets", "logo")

def outside_mask(lum, thr=70):
    """Dark pixels connected to the image border = the surround, not artwork."""
    dark = lum < thr
    lab, n = label(dark)
    border = set(lab[0, :]) | set(lab[-1, :]) | set(lab[:, 0]) | set(lab[:, -1])
    border.discard(0)
    return np.isin(lab, list(border))

def trim(im):
    a = np.asarray(im)[:, :, 3]
    ys, xs = np.where(a > 6)
    return im.crop((xs.min(), ys.min(), xs.max() + 1, ys.max() + 1))

# ---- Shivansh: white monochrome mark on transparency -----------------------
src = Image.open(os.path.join(LOGO, "shivansh-electronics-logo-for-video.png")).convert("RGB")
lum = np.asarray(src.convert("L")).astype(float)
out = outside_mask(lum)
alpha = np.clip((255.0 - lum) / 255.0, 0, 1)      # black artwork -> opaque
alpha[out] = 0.0                                   # surround -> gone
alpha[alpha < 0.10] = 0.0                          # kill the white plate
rgba = np.zeros((*lum.shape, 4), dtype=np.uint8)
rgba[..., 0:3] = 255                               # single-weight white
rgba[..., 3] = (alpha * 255).astype(np.uint8)
im = trim(Image.fromarray(rgba, "RGBA"))
im.save(os.path.join(LOGO, "shivansh-watermark.png"))
print(f"shivansh-watermark.png  {im.size[0]}x{im.size[1]}  white-on-transparent")

# ---- TASCAM: knock out the black surround, keep the mark as drawn ----------
src2 = Image.open(os.path.join(LOGO, "brand-logo-2.png")).convert("RGB")
l2 = np.asarray(src2.convert("L")).astype(float)
o2 = outside_mask(l2, 60)
rgba2 = np.dstack([np.asarray(src2), np.where(o2, 0, 255).astype(np.uint8)])
im2 = trim(Image.fromarray(rgba2, "RGBA"))
im2.save(os.path.join(LOGO, "tascam-mark.png"))
print(f"tascam-mark.png         {im2.size[0]}x{im2.size[1]}  knocked out")
