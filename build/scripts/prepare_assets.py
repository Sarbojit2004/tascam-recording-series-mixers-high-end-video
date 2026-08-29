#!/usr/bin/env python3
"""Enumerates, classifies and distributes the real product library.

Section 3.1 requires a genuine directory listing, real de-duplication (filenames
that LOOK like duplicates are not assumed to be), classification by unit, and
compulsory full coverage - every real asset appears exactly once somewhere
across the four deliverables.

GROUND CLASSIFICATION, and why it matters more on this build than the last one.
The palette is now near-white. That inverts the old problem: it is the
DARK-background product shots that now risk reading as black holes punched in
the page, where before it was the white-background ones that glared. So each
image is measured and treated accordingly:

    light   near-white studio ground -> background keyed out, product sits
            directly on the paper with no visible edge
    dark    near-black studio ground -> framed as a deliberate photographic
            plate with a soft edge, so it reads as a panel, not a hole
    mixed   real-world/lifestyle photography -> plate, ungraded

NO CROPPING, EVER. Whatever treatment an image receives, the complete product
is always shown fully and legibly. Nothing here resizes or crops content; the
scene components use object-fit: contain throughout.
"""
import hashlib
import json
import os
import re
import shutil

import numpy as np
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
BUILD = os.path.dirname(HERE)
ROOT = os.path.dirname(BUILD)
IMG_OUT = os.path.join(BUILD, "assets", "img")
VID_OUT = os.path.join(BUILD, "assets", "video")

UNIT_PATTERNS = [
    # Checked in order; first match wins. The 2400 rule must precede the 24
    # rule, and the CASE STUDY (4) reclassification must precede both.
    (r"^TASCAM MODEL 24 CASE STUDY \(4\)", "model2400"),
    (r"^TASCAM MODEL 2400", "model2400"),
    (r"^TASCAM MODEL 24", "model24"),
    (r"^TASCAM MODEL 16", "model16"),
    (r"^TASCAM MODEL 12", "model12"),
    (r"^TASCAM STUDIO BRIDGE", "studiobridge"),
]

# How many images of each unit each deliverable receives. Sums to the real
# count per unit; every image lands exactly once.
DISTRIBUTION = {
    "model12":      {"reel1": 5,  "reel2": 6,  "longform": None},
    "model16":      {"reel1": 5,  "longform": None},
    "model24":      {"reel1": 6,  "longform": None},
    "model2400":    {"reel1": 5,  "reel2": 6,  "longform": None},
    "studiobridge": {"reel3": 13, "longform": None},
}

VIDEO_ASSIGN = {
    "TASCAM MODEL 12 VIDEO.mp4": ("model12", "reel2"),
    "TASCAM MODEL 16 VIDEO.mp4": ("model16", "longform"),
    "TASCAM MODEL 24 VIDEO.mp4": ("model24", "longform"),
    "TASCAM MODEL 2400 VIDEO.mp4": ("model2400", "longform"),
}


def classify(name):
    for pat, unit in UNIT_PATTERNS:
        if re.match(pat, name):
            return unit
    return None


def slugify(name):
    s = os.path.splitext(name)[0].lower()
    s = s.replace("tascam ", "").replace("model ", "model-")
    s = re.sub(r"[^a-z0-9]+", "-", s).strip("-")
    return s


def analyse(path):
    """Pixel hash for real de-duplication, plus ground classification."""
    im = Image.open(path).convert("RGB")
    a = np.array(im)
    # Exact content hash - two files with identical pixels dedupe even if their
    # names look unrelated, and two similar names do NOT dedupe if they differ.
    sha = hashlib.sha1(a.tobytes()).hexdigest()[:16]
    # Ground = median luminance of the border ring.
    g = np.array(im.convert("L")).astype(float)
    h, w = g.shape
    ring = np.concatenate([
        g[:max(1, h // 20), :].ravel(), g[-max(1, h // 20):, :].ravel(),
        g[:, :max(1, w // 20)].ravel(), g[:, -max(1, w // 20):].ravel(),
    ])
    lum = float(np.median(ring))
    ground = "light" if lum > 200 else "dark" if lum < 60 else "mixed"
    return sha, im.size, lum, ground


if __name__ == "__main__":
    os.makedirs(IMG_OUT, exist_ok=True)
    os.makedirs(VID_OUT, exist_ok=True)

    # ---- enumerate -------------------------------------------------------
    raw = []
    for f in sorted(os.listdir(ROOT)):
        if not f.lower().endswith((".jpg", ".jpeg", ".png")):
            continue
        if re.search(r"logo", f, re.I) or f.startswith("B-ROLL"):
            continue
        unit = classify(f)
        if unit is None:
            print(f"  [skip, unclassified] {f}")
            continue
        raw.append((f, unit))

    # ---- de-duplicate by real pixel content ------------------------------
    seen, images, dupes = {}, [], []
    for f, unit in raw:
        sha, size, lum, ground = analyse(os.path.join(ROOT, f))
        if sha in seen:
            dupes.append((f, seen[sha]))
            continue
        seen[sha] = f
        images.append({
            "id": slugify(f), "src": f, "unit": unit, "sha": sha,
            "w": size[0], "h": size[1], "groundLum": round(lum, 1), "ground": ground,
            "path": f"img/{slugify(f)}.jpg",
        })

    # ---- distribute, every asset exactly once -----------------------------
    by_unit = {}
    for im in images:
        by_unit.setdefault(im["unit"], []).append(im)

    for unit, plan in DISTRIBUTION.items():
        pool = by_unit.get(unit, [])
        i = 0
        for target, n in plan.items():
            if n is None:
                continue
            for im in pool[i:i + n]:
                im["deliverable"] = target
            i += n
        for im in pool[i:]:
            im["deliverable"] = "longform"

    # ---- copy ------------------------------------------------------------
    for im in images:
        dst = os.path.join(IMG_OUT, f"{im['id']}.jpg")
        Image.open(os.path.join(ROOT, im["src"])).convert("RGB").save(dst, quality=94)

    videos = []
    for f, (unit, target) in VIDEO_ASSIGN.items():
        if not os.path.exists(os.path.join(ROOT, f)):
            print(f"  [missing video] {f}")
            continue
        vid = {"id": slugify(f), "src": f, "unit": unit,
               "deliverable": target, "path": f"video/{slugify(f)}.mp4"}
        shutil.copy2(os.path.join(ROOT, f), os.path.join(VID_OUT, f"{vid['id']}.mp4"))
        videos.append(vid)

    clips = [{"id": f"c{n}", "n": n,
              "land": f"clips/c{n}-land.mp4", "port": f"clips/c{n}-port.mp4"}
             for n in range(1, 17)]

    manifest = {"images": images, "videos": videos, "clips": clips}
    with open(os.path.join(BUILD, "assets", "manifest.json"), "w") as fh:
        json.dump(manifest, fh, indent=1)

    # ---- report ----------------------------------------------------------
    print(f"\n{len(images)} unique images  ({len(dupes)} byte-identical duplicates folded)")
    for f, orig in dupes:
        print(f"    {f}  ==  {orig}")
    print(f"{len(videos)} real product videos, {len(clips)} B-roll clips\n")

    for unit in ["model12", "model16", "model24", "model2400", "studiobridge"]:
        pool = by_unit.get(unit, [])
        grounds = {}
        for im in pool:
            grounds[im["ground"]] = grounds.get(im["ground"], 0) + 1
        dist = {}
        for im in pool:
            dist[im["deliverable"]] = dist.get(im["deliverable"], 0) + 1
        print(f"  {unit:14s} {len(pool):3d}  ground={grounds}  ->  {dist}")

    tot = {}
    for im in images:
        tot[im["deliverable"]] = tot.get(im["deliverable"], 0) + 1
    print(f"\n  TOTAL per deliverable: {tot}  = {sum(tot.values())}")
