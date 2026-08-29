#!/usr/bin/env python3
"""Keys the studio ground out of the light-background product shots.

WHY, on this build specifically. The page is near-white (#F6F8FA). A product
shot on a white studio ground, dropped into a plate, reads as a white card on a
white page - a faint rectangle with no reason to exist. Keying that ground out
instead lets the product sit DIRECTLY on the paper, which is both cleaner and
truer to the MOTU productions' own light identity.

Dark- and mixed-ground shots are deliberately NOT keyed. Pulling a black studio
ground off a black-bodied mixer is unreliable, and the attempt tends to eat the
product's own edges. Those images keep their full frame and are presented as
deliberate photographic plates with a soft shadow instead - the same treatment
the MOTU base uses for all its media.

SAFETY RAILS. A knockout is accepted only when the result is sane:
  - at least 8% of the frame survives as opaque (something is actually left)
  - at most 92% survives (something was actually removed)
Anything outside that band is rejected and the image falls back to a plate,
reported rather than silently accepted.

NOTHING IS CROPPED. Only alpha changes; every pixel of the product remains.
"""
import json
import os

import numpy as np
from PIL import Image
from scipy.ndimage import binary_closing, label

HERE = os.path.dirname(os.path.abspath(__file__))
BUILD = os.path.dirname(HERE)
IMG = os.path.join(BUILD, "assets", "img")
MANIFEST = os.path.join(BUILD, "assets", "manifest.json")

THRESH = 232      # luminance above which a pixel is "studio white"
MIN_KEEP = 0.08
MAX_KEEP = 0.92


def knockout(path):
    im = Image.open(path).convert("RGB")
    a = np.array(im)
    lum = np.array(im.convert("L")).astype(float)

    near_white = lum > THRESH

    # Only the ground CONNECTED TO THE BORDER is removed, so a white fader cap
    # or a lit LCD in the middle of the product is never punched out.
    lab, n = label(near_white)
    border = set(lab[0, :]) | set(lab[-1, :]) | set(lab[:, 0]) | set(lab[:, -1])
    border.discard(0)
    ground = np.isin(lab, list(border))

    # Close pin-holes so speckle inside the ground doesn't survive as confetti.
    ground = binary_closing(ground, structure=np.ones((3, 3)), iterations=2)

    keep = ~ground
    frac = float(keep.mean())
    if not (MIN_KEEP <= frac <= MAX_KEEP):
        return None, frac

    # Soft edge: ramp alpha over the last few luminance steps so the cut edge
    # is not aliased against the paper.
    soft = np.clip((THRESH + 14 - lum) / 14.0, 0.0, 1.0)
    alpha = np.where(keep, np.maximum(soft, 0.35), 0.0)
    alpha = np.where(keep & (lum <= THRESH), 1.0, alpha)

    out = np.dstack([a, (alpha * 255).astype(np.uint8)])
    return Image.fromarray(out, "RGBA"), frac


if __name__ == "__main__":
    man = json.load(open(MANIFEST))
    done = rejected = 0
    for im in man["images"]:
        if im["ground"] != "light":
            im["treatment"] = "plate"
            continue
        src = os.path.join(IMG, f"{im['id']}.jpg")
        res, frac = knockout(src)
        if res is None:
            im["treatment"] = "plate"
            im["knockoutRejected"] = round(frac, 3)
            rejected += 1
            print(f"  rejected (keep {frac:.1%}) -> plate: {im['id']}")
            continue
        dst = os.path.join(IMG, f"{im['id']}.png")
        res.save(dst)
        im["treatment"] = "cutout"
        im["path"] = f"img/{im['id']}.png"
        im["keepFrac"] = round(frac, 3)
        done += 1

    json.dump(man, open(MANIFEST, "w"), indent=1)

    counts = {}
    for im in man["images"]:
        counts[im["treatment"]] = counts.get(im["treatment"], 0) + 1
    print(f"\n{done} keyed to cutout, {rejected} rejected back to plate")
    print(f"treatments: {counts}")
