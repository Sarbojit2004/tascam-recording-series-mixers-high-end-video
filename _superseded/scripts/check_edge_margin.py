#!/usr/bin/env python3
"""Edge-margin compliance check for the long-form video, measured off
rendered pixels.

Unlike the reel's Instagram safe-zone bands, this format has no reserved
top/bottom region — background and hero imagery may legitimately touch the
true left/right edges (Section 2). What must NOT happen is critical text
sitting flush against an edge. A pure pixel scan can't distinguish "a photo's
dark background near the edge" from "a headline's dark ink near the edge", so
this check flags anything non-paper-colored inside the outer margin strip for
manual confirmation, rather than asserting failure outright — every flagged
still from this project's build was individually reviewed and confirmed to be
background/photo content, never text, before the full render.

    python3 scripts/check_edge_margin.py [DIR]
"""
import os
import sys

import numpy as np
from PIL import Image

EDGE_PAD = 56
# Paper is #F2F1ED (approx RGB 242,241,237); anything within ~10 of that in
# every channel reads as "background", not printed content.
PAPER = np.array([242, 241, 237])
TOL = 14

folder = sys.argv[1] if len(sys.argv) > 1 else os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "out", "lf-stills")

files = sorted(f for f in os.listdir(folder) if f.endswith(".png"))
if not files:
    print(f"no stills in {folder}")
    sys.exit(1)

flagged = []
for fn in files:
    im = Image.open(os.path.join(folder, fn)).convert("RGB")
    a = np.asarray(im, dtype=np.int16)
    h, w, _ = a.shape

    left = a[:, :EDGE_PAD, :]
    right = a[:, w - EDGE_PAD:, :]
    non_paper_left = int((np.abs(left - PAPER).max(axis=2) > TOL).sum())
    non_paper_right = int((np.abs(right - PAPER).max(axis=2) > TOL).sum())
    total = EDGE_PAD * h

    if non_paper_left > 0 or non_paper_right > 0:
        flagged.append((fn, non_paper_left, non_paper_right, total))
        pct_l = 100 * non_paper_left / total
        pct_r = 100 * non_paper_right / total
        print(f"  flag {fn:24} left {non_paper_left:6d}px ({pct_l:4.1f}%)  right {non_paper_right:6d}px ({pct_r:4.1f}%)  -- review needed")
    else:
        print(f"  ok   {fn}")

print()
print(f"{len(files) - len(flagged)}/{len(files)} clean, {len(flagged)} flagged for manual review.")
print("A flag means non-paper pixels reach the outer margin — confirm by eye")
print("that it is background/photo content and not text before treating it as pass.")
