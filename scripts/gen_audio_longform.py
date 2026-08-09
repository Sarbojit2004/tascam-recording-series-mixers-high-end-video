#!/usr/bin/env python3
"""Synthesises the long-form-specific audio: the 298s music bed, the 298s
ambient bed, the silent 298s voiceover placeholder, and four SFX unique to
this video's own beat vocabulary (chapter transitions, gallery sweeps,
dedicated branding beats, the closing card).

Everything else the long-form video needs — the 35-clip transition/mechanical
SFX palette — is the reel's own public/audio/sfx/*.mp3, already synthesised
and validated by scripts/gen_audio.py / scripts/audit_audio.py. Re-synthesising
an identical palette a second time for the same repository would be pure
waste, so this script only adds what's new.

Run in isolation, BEFORE any long-form scene code references a cue name:
    python3 scripts/gen_audio_longform.py
    python3 scripts/audit_audio.py --lf
"""
import math
import os
import subprocess
import wave

import numpy as np
from scipy.signal import lfilter

SR = 48000
FPS = 30
TOTAL_FRAMES = 8940
DUR = TOTAL_FRAMES / FPS  # 298.000s exactly

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
WAV_DIR = os.path.join(
    "/tmp/claude-0/-home-user/b3b3e279-0048-5eaa-a909-767605bf3496/scratchpad", "tascam_lf_wav"
)
os.makedirs(WAV_DIR, exist_ok=True)
rng = np.random.default_rng(298)


# ---------------------------------------------------------------- primitives
# (identical techniques to scripts/gen_audio.py — duplicated intentionally so
# each script stays a single, independently-runnable file, matching the
# reel/MOTU precedent of not sharing DSP code across generator scripts.)
def wr(name, x):
    x = np.clip(x, -1, 1)
    if x.ndim == 1:
        x = np.stack([x, x], 1)
    d = (x * 32767).astype("<i2")
    with wave.open(os.path.join(WAV_DIR, name + ".wav"), "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(d.tobytes())


def t(n):
    return np.arange(n) / SR


def expd(n, tau):
    return np.exp(-t(n) / tau)


def noise(n):
    return rng.standard_normal(n)


def _bq(fc, q, kind):
    fc = float(np.clip(fc, 20.0, SR / 2 * 0.97))
    w = 2 * math.pi * fc / SR
    al = math.sin(w) / (2 * q)
    c = math.cos(w)
    a0 = 1 + al
    if kind == "lp":
        b = [(1 - c) / 2 / a0, (1 - c) / a0, (1 - c) / 2 / a0]
    else:
        b = [(1 + c) / 2 / a0, -(1 + c) / a0, (1 + c) / 2 / a0]
    return b, [1.0, -2 * c / a0, (1 - al) / a0]


def lpf(x, fc, q=0.707):
    b, a = _bq(fc, q, "lp")
    return lfilter(b, a, x)


def hpf(x, fc, q=0.707):
    b, a = _bq(fc, q, "hp")
    return lfilter(b, a, x)


def saw(f, n, det=0.0):
    ph = np.cumsum(np.full(n, f / SR))
    o = np.zeros(n)
    for k in range(1, 14):
        o += np.sin(2 * np.pi * k * (ph + det * k * 0.001)) / k
    return o * 0.5


def sq(f, n):
    ph = np.cumsum(np.full(n, f / SR))
    o = np.zeros(n)
    for k in range(1, 12, 2):
        o += np.sin(2 * np.pi * k * ph) / k
    return o * 0.6


def sine(f, n):
    return np.sin(2 * np.pi * np.cumsum(np.full(n, f / SR)))


def stereo(x, width=0.25, pre=0.012):
    d = int(pre * SR)
    r = np.concatenate([np.zeros(d), x[:-d]]) if d else x.copy()
    return np.stack(
        [x * (1 - width * 0.5) + r * width * 0.5, r * (1 - width * 0.5) + x * width * 0.5], 1
    )


def verb(x, taps=((0.031, 0.34), (0.047, 0.26), (0.071, 0.19), (0.103, 0.12)), mix=0.28):
    y = np.zeros_like(x)
    for dt, g in taps:
        d = int(dt * SR)
        if d < len(x):
            y[d:] += x[:-d] * g
    return x * (1 - mix) + y * mix


def sfx(name, x, norm=0.90):
    x = np.asarray(x, dtype=float)
    m = np.abs(x).max()
    if m > 0:
        x = x / m * norm
    wr(name, x)


# ==========================================================================
# MUSIC BED — 298.000s, ten zones mapped to the long-form chapter structure
# ==========================================================================
N = int(round(DUR * SR))
BPM = 100.0
BEAT = 60 / BPM
BAR = BEAT * 4

PROG = [
    [110.00, 130.81, 164.81],  # Am
    [87.31, 110.00, 130.81],   # F
    [130.81, 164.81, 196.00],  # C
    [98.00, 123.47, 146.83],   # G
]
TRANSPOSE_AT = 140.0  # lift at the Model 2400 chapter
TRANSPOSE_RATIO = 2 ** (2 / 12)

# (start, end, energy, brightness, drums, arp) — ten chapters:
#  cold open / family / m12 / m16 / m24 / m2400 / workflows / studio bridge
#  / range together / pricing+outro
SEC = [
    (0, 20, 0.95, 1.25, True, False),
    (20, 38, 0.55, 1.00, False, False),
    (38, 74, 0.62, 1.02, True, False),
    (74, 104, 0.78, 1.10, True, False),
    (104, 140, 0.88, 1.22, True, False),
    (140, 198, 1.00, 1.34, True, False),
    (198, 218, 0.62, 1.05, False, False),
    (218, 260, 0.68, 1.45, False, True),
    (260, 274, 0.80, 1.15, True, False),
    (274, 298, 0.92, 1.28, True, False),
]


def secval(ts, idx):
    out = np.zeros_like(ts)
    for (a, b, e, br, dr, ar) in SEC:
        v = (e, br, dr, ar)[idx]
        m = (ts >= a) & (ts < b)
        out[m] = float(v)
    out[ts >= SEC[-1][1]] = float(SEC[-1][idx + 2])
    k = int(0.9 * SR)
    if k > 1:
        out = np.convolve(out, np.ones(k) / k, mode="same")
    return out


ts = np.arange(N) / SR
energy = secval(ts, 0)
bright = secval(ts, 1)
drums_on = secval(ts, 2)
arp_on = secval(ts, 3)

mus = np.zeros(N)

bar_len = int(BAR * SR)
for i in range(0, N, bar_len):
    n = min(bar_len, N - i)
    ch = PROG[(i // bar_len) % len(PROG)]
    tr = TRANSPOSE_RATIO if (i / SR) >= TRANSPOSE_AT else 1.0
    seg = np.zeros(n)
    for j, f in enumerate(ch):
        seg += saw(f * tr, n, det=1.2 + j * 0.7) * (0.34 - j * 0.07)
        seg += sine(f * tr * 2, n) * 0.05
    a = np.minimum(np.linspace(0, 1, n) * 6.0, 1.0)
    r = np.minimum(np.linspace(1, 0, n) * 8.0, 1.0)
    mus[i:i + n] += seg * a * r * 0.55

mus = lpf(mus, 1500)
mus = mus * (0.55 + 0.45 * energy)

bass = np.zeros(N)
step = int(BEAT * SR / 2)
for i in range(0, N, step):
    n = min(step, N - i)
    bar_i = (i // bar_len) % len(PROG)
    root = PROG[bar_i][0] / 2
    if (i / SR) >= TRANSPOSE_AT:
        root *= TRANSPOSE_RATIO
    k = (i // step) % 8
    f = root * (1.0 if k in (0, 1, 4) else (1.5 if k in (2, 6) else 1.0))
    bass[i:i + n] += (sine(f, n) * 0.8 + saw(f, n) * 0.18) * expd(n, 0.16)
bass = lpf(bass, 220)
mus += bass * (0.34 + 0.30 * energy)


def sine_sweep(n, f0, f1, tau):
    fr = f1 + (f0 - f1) * np.exp(-t(n) / tau)
    return np.sin(2 * np.pi * np.cumsum(fr) / SR)


def kick(n):
    return sine_sweep(n, 92, 42, 0.05) * expd(n, 0.15)


drum = np.zeros(N)
half = int(BEAT * SR / 2)
for i in range(0, N, half):
    n = min(half, N - i)
    k = (i // half) % 8
    if k in (0, 3, 6):
        drum[i:i + n] += kick(n) * 0.95
    if k in (2, 6):
        sn = (hpf(noise(n), 1500) * expd(n, 0.075) * 0.75
              + sine(190, n) * expd(n, 0.055) * 0.35)
        drum[i:i + n] += sn * 0.62
    hh = hpf(noise(n), 7200) * expd(n, 0.020) * (0.30 if k % 2 == 0 else 0.18)
    drum[i:i + n] += hh
mus += drum * drums_on * (0.34 + 0.34 * energy)

arp = np.zeros(N)
sixteenth = int(BEAT * SR / 4)
ARP = [0, 7, 12, 16, 19, 16, 12, 7]
for i in range(0, N, sixteenth):
    n = min(sixteenth, N - i)
    bar_i = (i // bar_len) % len(PROG)
    root = PROG[bar_i][0] * 2 * TRANSPOSE_RATIO
    semi = ARP[(i // sixteenth) % len(ARP)]
    f = root * (2 ** (semi / 12))
    v = sq(f, n) * expd(n, 0.055) * 0.5 + sine(f * 2, n) * expd(n, 0.030) * 0.18
    arp[i:i + n] += v
arp = hpf(lpf(arp, 5200), 260)
mus += arp * arp_on * 0.50

air = hpf(noise(N), 6500) * 0.045
mus += air * (bright - 0.9)

mus = mus + lpf(mus, 900) * 0.25
mus = np.tanh(mus * 1.25) * 0.82

g = np.ones(N)
g[: int(1.5 * SR)] = np.linspace(0, 1, int(1.5 * SR))
g[-int(3.0 * SR):] = np.linspace(1, 0, int(3.0 * SR))
mus *= g
mus = np.stack([mus, np.concatenate([np.zeros(140), mus[:-140]])], 1)
mus /= max(1e-9, np.abs(mus).max())
wr("music-bed-longform", mus * 0.70)
print(f"music bed (longform): {DUR:.3f}s ({N} samples)")

# ==========================================================================
# AMBIENT BED — 298.000s continuous sub-audible presence
# ==========================================================================
amb = np.zeros(N)
for f, a in ((41.2, 0.55), (61.7, 0.30), (82.4, 0.16)):
    lfo = 1 + 0.05 * np.sin(2 * np.pi * 0.031 * ts + f)
    amb += np.sin(2 * np.pi * f * ts * lfo) * a
amb = lpf(amb, 190)
room = lpf(hpf(noise(N), 320), 2600) * 0.10
room *= 0.75 + 0.25 * np.sin(2 * np.pi * 0.017 * ts)
amb += room
amb += hpf(noise(N), 9000) * 0.018
amb = np.tanh(amb * 1.1)
ag = np.ones(N)
ag[: int(2.5 * SR)] = np.linspace(0, 1, int(2.5 * SR))
ag[-int(2.5 * SR):] = np.linspace(1, 0, int(2.5 * SR))
amb *= ag
amb = np.stack([amb, np.concatenate([np.zeros(310), amb[:-310]])], 1)
amb /= max(1e-9, np.abs(amb).max())
wr("ambient-bed-longform", amb * 0.60)
print(f"ambient bed (longform): {DUR:.3f}s")

# ==========================================================================
# FOUR NEW SFX unique to the long-form video's beat vocabulary
# ==========================================================================


def whoosh(dur, f0, f1, q, rev=False):
    n = int(dur * SR)
    nz = noise(n)
    sh = (np.linspace(0, 1, n) ** 1.7) if not rev else (np.linspace(1, 0, n) ** 1.7)
    y = hpf(lpf(nz, (f0 + f1) / 2 * 1.2, q), f0 * 0.55, q)
    y *= sh
    sw = np.linspace(f0, f1, n)
    y += np.sin(2 * np.pi * np.cumsum(sw) / SR) * 0.22 * sh
    return stereo(y * np.hanning(n) ** 0.5, 0.5, 0.006)


# Chapter-transition swell: a longer, gentler bridge between chapters than
# the reel's per-cut whooshes — this video's cuts are seconds apart, not
# frames apart, so the transition SFX affords more time to breathe.
n = int(2.4 * SR)
sw = (hpf(noise(n), 260) * 0.5 + np.sin(2 * np.pi * np.cumsum(np.linspace(90, 900, n)) / SR) * 0.35)
sw *= np.linspace(0, 1, n) ** 1.6 * np.linspace(1, 0, n) ** 0.6
sfx("chapter-swell", stereo(verb(sw, mix=0.30), 0.55, 0.012))

# Gallery-tick: a soft, dry two-tone marker for a montage group change.
n = int(0.30 * SR)
gt = (np.sin(2 * np.pi * 1450 * t(n)) * expd(n, 0.030) * 0.6
      + np.sin(2 * np.pi * 2175 * t(n)) * expd(n, 0.022) * 0.35)
sfx("gallery-tick", stereo(gt, 0.28, 0.003))

# Brand-chime: a clean, confident two-note ping for the dedicated branding
# beats — distinct from chime-soft/chime-final, pitched lower and shorter.
n = int(0.9 * SR)
bc = (np.sin(2 * np.pi * 587.33 * t(n)) * expd(n, 0.20) * 0.6
      + np.sin(2 * np.pi * 739.99 * t(n)) * expd(n, 0.16) * 0.5)
sfx("brand-chime", stereo(verb(bc, mix=0.24), 0.4, 0.008))

# Chapter-out: the closing-card resolve — warm, full, longer tail than
# chime-final, for the single moment the whole video ends on.
n = int(3.2 * SR)
notes = [261.63, 329.63, 392.00, 523.25, 659.25]
co = np.zeros(n)
for i, f in enumerate(notes):
    co += np.sin(2 * np.pi * f * t(n)) * expd(n, 1.1) * (0.5 - i * 0.05)
sfx("chapter-out", stereo(verb(co * 0.5, mix=0.34), 0.6, 0.016))

# ------------------------------------------------------- silent VO placeholder
wr("vo-silent-longform", np.zeros((N, 2)))

names = sorted(f[:-4] for f in os.listdir(WAV_DIR) if f.endswith(".wav"))
print(f"WAV written: {len(names)}")

# ==========================================================================
# ENCODE — WAV -> MP3 via Remotion's bundled ffmpeg
# ==========================================================================
SFX_DIR = os.path.join(ROOT, "public", "audio", "sfx")
AUD_DIR = os.path.join(ROOT, "public", "audio")
VO_DIR = os.path.join(ROOT, "public", "vo")
for d in (SFX_DIR, AUD_DIR, VO_DIR):
    os.makedirs(d, exist_ok=True)


def enc(src, dst, br="192k"):
    subprocess.run(
        ["npx", "remotion", "ffmpeg", "-v", "error", "-y", "-i",
         os.path.join(WAV_DIR, src + ".wav"), "-codec:a", "libmp3lame", "-b:a", br, dst],
        check=True, cwd=ROOT,
    )


enc("music-bed-longform", os.path.join(AUD_DIR, "music-bed-longform.mp3"), "224k")
enc("ambient-bed-longform", os.path.join(AUD_DIR, "ambient-bed-longform.mp3"), "192k")
enc("vo-silent-longform", os.path.join(VO_DIR, "voiceover-longform-tascam.mp3"), "96k")
for n_ in ("chapter-swell", "gallery-tick", "brand-chime", "chapter-out"):
    enc(n_, os.path.join(SFX_DIR, n_ + ".mp3"), "192k")

print("done — 2 beds + 1 vo placeholder + 4 new sfx encoded")
