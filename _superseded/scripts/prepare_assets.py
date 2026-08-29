#!/usr/bin/env python3
"""Copies the repository's source assets into public/ under render-safe ids.

The 105 stills and 4 clips live at the repository root with spaces and
parentheses in their filenames. Remotion's staticFile() wants stable, simple
ids, so they are mirrored into public/img and public/video as slugs, and
src/lib/asset-map.json records the mapping both ways.

These mirrored copies are gitignored — they are byte-identical duplicates of
files already tracked at the root, and duplicating ~90 MB of binaries in git
would slow every clone. Run this once after cloning:

    python3 scripts/prepare_assets.py     (or: npm run assets)
"""
import glob
import json
import os
import re
import shutil
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG = os.path.join(ROOT, "public", "img")
VID = os.path.join(ROOT, "public", "video")

FAMILY = {
    "MODEL 12": "m12",
    "MODEL 16": "m16",
    "MODEL 24": "m24",
    "MODEL 24 CASE STUDY": "m24cs",
    "MODEL 24 VS MODEL 2400": "vs",
    "MODEL 2400": "m2400",
    "STUDIO BRIDGE": "sb",
}
# Longest first so "MODEL 24 CASE STUDY" is not swallowed by "MODEL 24".
PATTERN = re.compile(
    r"TASCAM (MODEL 24 VS MODEL 2400|MODEL 24 CASE STUDY|MODEL 2400|MODEL 24|MODEL 16|MODEL 12|STUDIO BRIDGE)"
    r"\s*(?:\((\d+)\))?\.jpg$"
)
CLIPS = {
    "TASCAM MODEL 12 VIDEO.mp4": "m12-clip",
    "TASCAM MODEL 16 VIDEO.mp4": "m16-clip",
    "TASCAM MODEL 24 VIDEO.mp4": "m24-clip",
    "TASCAM MODEL 2400 VIDEO.mp4": "m2400-clip",
}


def slug(basename):
    m = PATTERN.match(basename)
    if not m:
        raise SystemExit(f"unrecognised asset filename: {basename}")
    fam = FAMILY[m.group(1)]
    n = m.group(2)
    return f"{fam}-{int(n):02d}" if n is not None else f"{fam}-xx"


def main():
    os.makedirs(IMG, exist_ok=True)
    os.makedirs(VID, exist_ok=True)

    mapping = []
    seen = {}

    stills = sorted(glob.glob(os.path.join(ROOT, "TASCAM *.jpg")))
    for p in stills:
        b = os.path.basename(p)
        s = slug(b)
        if s in seen:
            raise SystemExit(f"slug collision: {b} and {seen[s]} both map to {s}")
        seen[s] = b
        shutil.copy2(p, os.path.join(IMG, s + ".jpg"))
        mapping.append({"src": b, "id": s, "kind": "still"})

    clips = sorted(glob.glob(os.path.join(ROOT, "TASCAM *.mp4")))
    for p in clips:
        b = os.path.basename(p)
        if b not in CLIPS:
            raise SystemExit(f"unrecognised clip filename: {b}")
        shutil.copy2(p, os.path.join(VID, CLIPS[b] + ".mp4"))
        mapping.append({"src": b, "id": CLIPS[b], "kind": "video"})

    with open(os.path.join(ROOT, "src", "lib", "asset-map.json"), "w") as fh:
        json.dump(mapping, fh, indent=1)

    n_still = sum(1 for m in mapping if m["kind"] == "still")
    n_video = sum(1 for m in mapping if m["kind"] == "video")
    print(f"prepared {n_still} stills + {n_video} clips = {len(mapping)} assets")
    if len(mapping) != 109:
        print(f"WARNING: expected 109 compulsory assets, found {len(mapping)}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
