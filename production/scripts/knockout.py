#!/usr/bin/env python3
"""
Background knockout for the light-ground product photography.

Stage 5 puts every subject on a "deep, pure black void". Roughly 40 of the 101
product images are studio shots on pure white, and seating those on a near-black
page as framed plates turns each one into a glowing white block — the opposite
of the restrained, high-contrast treatment the brief asks for.

So the white STUDIO BACKGROUND is removed and the unit is composited directly
onto the void. This is explicitly not a crop: the complete physical unit is
preserved intact, pixel for pixel. Only background that was never part of the
hardware is discarded, exactly as was done for the logo marks.

Safety rails, because a bad knockout is worse than a plate:
  * only near-white, low-saturation pixels CONNECTED TO THE BORDER are removed,
    so white fader caps and silk-screening inside the unit are never touched;
  * a 1px feather keeps edges from aliasing against the void;
  * if the result would remove less than 8% or more than 92% of the frame, the
    knockout is rejected and the image keeps its plate treatment.
"""
import json, os, sys
import numpy as np
from PIL import Image
from scipy.ndimage import label, binary_erosion, uniform_filter

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
ASSETS = os.path.join(ROOT, "assets")

def knockout(path):
    im = Image.open(path).convert("RGB")
    a = np.asarray(im).astype(np.int16)
    mx, mn = a.max(2), a.min(2)
    # near-white and near-neutral: studio sweep, not product
    bg = (mn > 232) & ((mx - mn) < 16)
    lab, n = label(bg)
    if n == 0:
        return None
    border = set(lab[0, :]) | set(lab[-1, :]) | set(lab[:, 0]) | set(lab[:, -1])
    border.discard(0)
    if not border:
        return None
    out = np.isin(lab, list(border))
    frac = out.mean()
    if frac < 0.08 or frac > 0.92:
        return None
    alpha = (~out).astype(np.float32)
    alpha = uniform_filter(alpha, size=3)          # 1px feather
    alpha = np.clip((alpha - 0.35) / 0.5, 0, 1)
    rgba = np.dstack([np.asarray(im), (alpha * 255).astype(np.uint8)])
    return Image.fromarray(rgba, "RGBA"), frac

def stats(im):
    """Colour statistics over the OPAQUE residue, used to tell a photographed
    unit apart from line-art and from a flat UI screenshot."""
    a = np.asarray(im.convert("RGBA")).astype(np.int16)
    rgb, al = a[..., :3], a[..., 3]
    op = al > 128
    if op.sum() == 0:
        return 0.0, 0.0, 0.0, 0.0
    mx, mn, lum = rgb.max(2), rgb.min(2), rgb.mean(2)
    return (float(((mx - mn)[op] > 45).mean()),      # colour content
            float((lum[op] > 225).mean()),           # near-white residue
            float((lum[op] < 80).mean()),            # dark residue
            float(op.mean()))                        # how much of the frame survives

def schematic(path):
    """Line-art on white: re-render as a white schematic on transparency, the
    same treatment the logo marks get. Black ink on a black void would simply
    disappear, and these diagrams carry real technical content."""
    im = Image.open(path).convert("RGB")
    lum = np.asarray(im.convert("L")).astype(float)
    alpha = np.clip((248.0 - lum) / 210.0, 0, 1)
    rgba = np.zeros((*lum.shape, 4), dtype=np.uint8)
    rgba[..., 0:3] = 236
    rgba[..., 3] = (alpha * 255).astype(np.uint8)
    return Image.fromarray(rgba, "RGBA")

def main():
    man = json.load(open(os.path.join(ASSETS, "manifest.json")))
    counts = {"cutout": 0, "schematic": 0, "plate": 0}
    for e in man["images"]:
        if e["unit"].startswith("logo") or e["ground"] in ("dark",):
            continue
        was_mixed = e["ground"] == "mixed"
        src = os.path.join(ASSETS, e["path"])
        r = knockout(src)
        if r is None:
            # A photograph in a real environment keeps its well; only a genuine
            # studio sweep or reference sheet was ever a knockout candidate.
            if was_mixed:
                continue
            e["ground"] = "plate"; counts["plate"] += 1; continue

        im, frac = r
        sat, white, dark, opaque = stats(im)

        # Line-art diagram: either a big near-white residue (the interior fill
        # of its own boxes survived) or very sparse ink over a removed sweep.
        if white > 0.35 or (opaque < 0.25 and sat < 0.25):
            im = schematic(src); mode = "schematic"
        # Flat, light UI screenshot: neither dark enough to sit on the void nor
        # sparse enough to invert. Keep it as a deliberate framed reference.
        elif dark < 0.45 and white < 0.35 and sat < 0.10:
            if was_mixed:
                continue
            e["ground"] = "plate"; counts["plate"] += 1; continue
        else:
            mode = "cutout"

        newpath = e["path"].rsplit(".", 1)[0] + ".png"
        im.save(os.path.join(ASSETS, newpath))
        if newpath != e["path"]:
            os.remove(src)
        e["path"] = newpath
        e["ground"] = mode
        e["bgFrac"] = round(float(frac), 3)
        counts[mode] += 1

    json.dump(man, open(os.path.join(ASSETS, "manifest.json"), "w"), indent=1)
    print("light-ground treatment: " + ", ".join(f"{v} {k}" for k, v in counts.items()))

if __name__ == "__main__":
    main()
