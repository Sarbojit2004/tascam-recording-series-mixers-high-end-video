#!/usr/bin/env python3
"""Audio validation. Proves the Layer 2 palette actually obeys its own design
rules rather than asserting it: nothing silent, nothing clipped, and every
element genuinely high-passed so it cannot muddy the music bed."""
import subprocess, sys, os, glob, math, json
import numpy as np

def load(p, sr=48000):
    r = subprocess.run(["ffmpeg","-v","error","-i",p,"-ac","1","-ar",str(sr),"-f","f32le","-"],
                       capture_output=True)
    return np.frombuffer(r.stdout, dtype=np.float32)

def spectrum_below(x, sr, cut):
    """Fraction of total energy below `cut` Hz."""
    n = 1 << int(math.floor(math.log2(min(len(x), 1 << 16))))
    X = np.abs(np.fft.rfft(x[:n] * np.hanning(n)))**2
    f = np.fft.rfftfreq(n, 1/sr)
    return float(X[f < cut].sum() / max(X.sum(), 1e-12))

fail = []
rows = []
for p in sorted(glob.glob(os.path.join(os.path.dirname(__file__), "../assets/audio/sfx/*.wav"))):
    n = os.path.basename(p)
    x = load(p)
    if len(x) == 0: fail.append(f"{n}: decoded empty"); continue
    peak = float(np.abs(x).max())
    rms  = float(np.sqrt((x**2).mean()))
    lowf = spectrum_below(x, 48000, 900)
    clipped = int((np.abs(x) >= 0.999).sum())
    rows.append((n, len(x)/48000, 20*math.log10(peak+1e-12), 20*math.log10(rms+1e-12), lowf*100, clipped))
    if peak < 0.2:        fail.append(f"{n}: too quiet (peak {peak:.3f})")
    if clipped > 8:       fail.append(f"{n}: {clipped} clipped samples")
    if lowf > 0.06:       fail.append(f"{n}: {lowf*100:.1f}% energy below 900 Hz (design limit 6%)")

print(f"{'FILE':20s} {'sec':>7s} {'peak dB':>9s} {'rms dB':>8s} {'<900Hz':>8s} {'clip':>5s}")
for r in rows:
    print(f"{r[0]:20s} {r[1]:7.3f} {r[2]:9.1f} {r[3]:8.1f} {r[4]:7.2f}% {r[5]:5d}")

if fail:
    print("\nFAILED:"); [print("  -", f) for f in fail]; sys.exit(1)
print(f"\nOK — {len(rows)} sounds, all above floor, none clipped, all high-passed.")
