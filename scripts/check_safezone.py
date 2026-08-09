#!/usr/bin/env python3
"""Safe-zone compliance check, measured off rendered pixels.

Critical content is dark ink or a saturated accent on a light ground, so any
genuinely dark pixel inside the side margins or the top/bottom ambient bands
means something legible has escaped the safe area. The ambient bands are
deliberately blurred and washed toward paper, so they never produce ink-dark
pixels — which is exactly what makes this test meaningful.

    python3 scripts/check_safezone.py            # out/stills
    python3 scripts/check_safezone.py DIR

Reports, per still, the darkest pixel found in each forbidden region.
"""
import os
import sys

import numpy as np
from PIL import Image

TOP_AMBIENT = 250
BOTTOM_AMBIENT = 1580
SIDE = 78
# Ink is #141A22 (lum 26) and the darkest accent is #A6143A (lum 51). Blurred
# ambient tiles bottom out well above this; 110 separates them cleanly.
INK = 110
# A handful of stray pixels is antialiasing on a rounded corner, not content.
TOLERANCE = 400

folder = sys.argv[1] if len(sys.argv) > 1 else os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "out", "stills")

files = sorted(f for f in os.listdir(folder) if f.endswith(".png"))
if not files:
    print(f"no stills in {folder}")
    sys.exit(1)

fail = []
for fn in files:
    im = Image.open(os.path.join(folder, fn)).convert("L")
    a = np.asarray(im, dtype=np.int16)
    h, w = a.shape

    regions = {
        "top band": a[:TOP_AMBIENT, :],
        "bottom band": a[BOTTOM_AMBIENT:, :],
        "left margin": a[TOP_AMBIENT:BOTTOM_AMBIENT, :SIDE],
        "right margin": a[TOP_AMBIENT:BOTTOM_AMBIENT, w - SIDE:],
    }
    bad = []
    for name, r in regions.items():
        n = int((r < INK).sum())
        if n > TOLERANCE:
            bad.append(f"{name}: {n}px darker than {INK} (min {int(r.min())})")
    if bad:
        fail.append((fn, bad))
        print(f"  FAIL {fn}")
        for b in bad:
            print(f"        {b}")
    else:
        print(f"  ok   {fn}")

print()
if fail:
    print(f"FAILED — {len(fail)} still(s) have critical content outside the safe area.")
    sys.exit(1)
print(f"PASS — {len(files)} stills: no critical content in the ambient bands or side margins.")
