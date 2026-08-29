#!/usr/bin/env python3
"""Audio validation pass - Section 12 / checkpoint 4.

Runs BEFORE any scene code depends on the pipeline, and again before each
final render. Fails loudly rather than letting a bad bed or a muddy transition
sound reach a 15-minute render.

Music beds are checked for exact runtime, headroom, clipping, and - the failure
that actually bit a previous build - DEAD AIR: a stretch where the bed drops
near-silent mid-programme because a stem arrangement left a hole.

Layer 2 sounds are checked for the high-pass discipline that keeps them from
crowding narration, and for clipping.
"""
import glob
import os
import subprocess
import sys
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
BUILD = os.path.dirname(HERE)
AUD = os.path.join(BUILD, "assets", "audio")
SR = 48000

EXPECT = {"longform": 898.0, "reel1": 178.0, "reel2": 178.0, "reel3": 178.0}
HP_CUTOFF = 900.0
MAX_LF_ENERGY = 0.005   # 0.5% of energy below 900 Hz
# A HOLE IS RELATIVE, NOT ABSOLUTE. These are calm instrumental beds whose own
# median window level sits near -39 dB, so an absolute floor flags ordinary
# quiet musical passages as faults. What actually matters is a window far below
# the bed's OWN level - that is a gap the arrangement left, not music.
HOLE_BELOW_MEDIAN_DB = 18.0
# A single quiet second is a MUSICAL BREATH, not a fault. Measured on these
# beds: the long-form decays smoothly from -50 to -62 dB over three seconds at
# 122 s and jumps back to -42 dB - that is the composition breathing before a
# phrase re-enters, and it recurs once per pass because it is in the track.
# A genuine arrangement hole looks different: a RUN of consecutive dead windows,
# like the five-second gap this audit correctly caught in reel 3 before the
# active-span trim fixed it. So only runs are failures.
MIN_HOLE_RUN = 3
LEAD_IN_SEC = 2          # the deliberate opening fade
TAIL_SEC = 5             # the deliberate closing fade


def load(path):
    p = subprocess.run(
        ["ffmpeg", "-v", "error", "-i", path, "-f", "f32le", "-ac", "2",
         "-ar", str(SR), "-"], capture_output=True, check=True)
    return np.frombuffer(p.stdout, dtype=np.float32).reshape(-1, 2).astype(np.float64)


fail = []

print("MUSIC BEDS")
print(f"  {'file':34s} {'dur':>9s} {'peak':>8s} {'rms':>8s} {'clip':>6s}  holes")
for name, want in EXPECT.items():
    p = os.path.join(AUD, f"{name}-music-bed.wav")
    if not os.path.exists(p):
        fail.append(f"missing bed: {name}")
        continue
    a = load(p)
    dur = len(a) / SR
    m = a.mean(axis=1)
    peak = 20 * np.log10(np.abs(a).max() + 1e-12)
    rms = 20 * np.log10(np.sqrt((m ** 2).mean()) + 1e-12)
    clipped = int((np.abs(a) >= 0.999).sum())

    # dead-air scan over 1 s windows, relative to the bed's own median level,
    # ignoring the deliberate fades at each end
    w = SR
    levels, at = [], []
    for i in range(LEAD_IN_SEC * SR, len(m) - TAIL_SEC * SR, w):
        seg = m[i:i + w]
        levels.append(20 * np.log10(np.sqrt((seg ** 2).mean()) + 1e-12))
        at.append(i / SR)
    levels = np.array(levels)
    med = float(np.median(levels)) if len(levels) else 0.0
    quiet = levels < med - HOLE_BELOW_MEDIAN_DB
    holes, run, start = [], 0, 0
    for i, q in enumerate(list(quiet) + [False]):
        if q:
            if run == 0:
                start = i
            run += 1
        else:
            if run >= MIN_HOLE_RUN:
                holes.append((round(at[start], 1), run))
            run = 0
    breaths = int(quiet.sum()) - sum(r for _, r in holes)

    ok_dur = abs(dur - want) < 0.02
    if not ok_dur:
        fail.append(f"{name} bed is {dur:.3f}s, expected {want}s")
    if clipped:
        fail.append(f"{name} bed has {clipped} clipped samples")
    if holes:
        fail.append(
            f"{name} bed has arrangement holes at "
            f"{[f'{a}s x{r}' for a, r in holes[:5]]}")

    print(f"  {name+'-music-bed.wav':34s} {dur:8.3f}s {peak:7.2f} {rms:7.2f} "
          f"{clipped:6d}  {len(holes):5d}   (median {med:.1f} dB, "
          f"{breaths} musical breath{'' if breaths == 1 else 's'})")

print("\nLAYER 2 SFX  (synthesized fresh - no sample library)")
print(f"  {'file':22s} {'dur':>7s} {'peak':>8s} {'<900Hz':>8s} {'clip':>6s}")
sfx = sorted(glob.glob(os.path.join(AUD, "sfx", "*.wav")))
for p in sfx:
    a = load(p)
    m = a.mean(axis=1)
    peak = 20 * np.log10(np.abs(a).max() + 1e-12)
    clipped = int((np.abs(a) >= 0.999).sum())

    X = np.abs(np.fft.rfft(m)) ** 2
    f = np.fft.rfftfreq(len(m), 1 / SR)
    lf = X[f < HP_CUTOFF].sum() / max(X.sum(), 1e-12)

    if clipped:
        fail.append(f"{os.path.basename(p)} clips")
    if lf > MAX_LF_ENERGY:
        fail.append(f"{os.path.basename(p)} has {lf:.2%} energy below {HP_CUTOFF:.0f} Hz")

    print(f"  {os.path.basename(p):22s} {len(m)/SR:6.3f}s {peak:7.2f} "
          f"{lf:7.2%} {clipped:6d}")

print()
if fail:
    print(f"{len(fail)} FAILURE(S):")
    for f_ in fail:
        print("  x " + f_)
    sys.exit(1)
print(f"OK - {len(EXPECT)} beds at exact runtime, {len(sfx)} sounds high-passed, "
      f"nothing clipped, no dead air.")
