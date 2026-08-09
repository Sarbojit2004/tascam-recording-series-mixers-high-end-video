#!/usr/bin/env python3
"""Synthesises every audio asset for the 88-second TASCAM reel from scratch.

Nothing here is sourced, sampled or fetched. Three families are produced:

  1. music-bed.mp3   88.000s, six energy zones following the creative brief's
                     Section 10 arc (lo-fi -> live band -> large-format sweep
                     -> arpeggiated strip-back -> resolve).
  2. ambient-bed.mp3 88.000s, a continuous sub-audible room/drone layer that
                     runs underneath everything for the whole runtime.
  3. sfx/*.mp3       A wide transition palette plus TASCAM-specific mechanical
                     accents (fader slide, knob detent, relay, meter ripple,
                     SD insert, DB-25 lock) for the motion-synced beats.

Techniques are extended from the proven synthesis used on the Sonodyne/MOTU
reel: biquad filters, explicit envelopes, comb-filter reverb, stereo widening.

Run in isolation, BEFORE any scene code references a cue name:
    python3 scripts/gen_audio.py && python3 scripts/audit_audio.py
"""
import math
import os
import subprocess
import wave

import numpy as np
from scipy.signal import lfilter

SR = 48000
FPS = 30
TOTAL_FRAMES = 2640
DUR = TOTAL_FRAMES / FPS  # 88.000s exactly

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
WAV_DIR = os.path.join(
    "/tmp/claude-0/-home-user/b3b3e279-0048-5eaa-a909-767605bf3496/scratchpad", "tascam_wav"
)
os.makedirs(WAV_DIR, exist_ok=True)
rng = np.random.default_rng(2400)


# ---------------------------------------------------------------- primitives
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
    """Cheap comb-filter reverb — enough tail to make hits feel like a room."""
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
# MUSIC BED — 88.000s, six zones mapped to the brief's Section 10 arc
# ==========================================================================
N = int(round(DUR * SR))
BPM = 100.0
BEAT = 60 / BPM
BAR = BEAT * 4

# Am - F - C - G family, transposed up a step for the flagship stretch.
PROG = [
    [110.00, 130.81, 164.81],  # Am
    [87.31, 110.00, 130.81],   # F
    [130.81, 164.81, 196.00],  # C
    [98.00, 123.47, 146.83],   # G
]
TRANSPOSE_AT = 49.0
TRANSPOSE_RATIO = 2 ** (2 / 12)

# (start, end, energy, brightness, drums, arp) — the six musical zones:
#   hook / model 12 / model 16 / model 24 / model 2400 / studio bridge / outro
SEC = [
    (0.0, 10.0, 0.95, 1.30, True, False),    # hook — punchy, tight
    (10.0, 23.0, 0.62, 1.02, True, False),   # Model 12 — lo-fi, intimate
    (23.0, 35.0, 0.78, 1.10, True, False),   # Model 16 — warmer, live band
    (35.0, 49.0, 0.88, 1.22, True, False),   # Model 24 — large format opens up
    (49.0, 65.0, 1.00, 1.34, True, False),   # Model 2400 — widest, cinematic
    (65.0, 78.0, 0.70, 1.45, False, True),   # Studio Bridge — stripped, arp
    (78.0, 88.0, 0.92, 1.28, True, False),   # outro / price / CTA
]


def secval(ts, idx):
    """Sample a zone parameter at time ts, smoothed across zone boundaries."""
    out = np.zeros_like(ts)
    for (a, b, e, br, dr, ar) in SEC:
        v = (e, br, dr, ar)[idx]
        m = (ts >= a) & (ts < b)
        out[m] = float(v)
    out[ts >= SEC[-1][1]] = float(SEC[-1][idx + 2])
    # 0.9s smoothing so zones cross-fade instead of stepping
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

# --- pad / chord bed -------------------------------------------------------
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

# --- sub / bassline --------------------------------------------------------
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

# --- drums -----------------------------------------------------------------
def kick(n):
    return sine_sweep(n, 92, 42, 0.05) * expd(n, 0.15)


def sine_sweep(n, f0, f1, tau):
    fr = f1 + (f0 - f1) * np.exp(-t(n) / tau)
    return np.sin(2 * np.pi * np.cumsum(fr) / SR)


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

# --- Studio Bridge arpeggiator: precise, clean, electronic -----------------
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

# --- air / sparkle layer scaled by brightness ------------------------------
air = hpf(noise(N), 6500) * 0.045
mus += air * (bright - 0.9)

# --- sweeping analog filter motion on the large-format stretch -------------
mus = mus + lpf(mus, 900) * 0.25
mus = np.tanh(mus * 1.25) * 0.82

# programme fade so the bed never clips in or out
g = np.ones(N)
g[: int(1.2 * SR)] = np.linspace(0, 1, int(1.2 * SR))
g[-int(2.4 * SR):] = np.linspace(1, 0, int(2.4 * SR))
mus *= g
mus = np.stack([mus, np.concatenate([np.zeros(140), mus[:-140]])], 1)
mus /= max(1e-9, np.abs(mus).max())
wr("music-bed", mus * 0.72)
print(f"music bed: {DUR:.3f}s ({N} samples)")

# ==========================================================================
# AMBIENT BED — 88.000s continuous sub-audible presence, runs under all cuts
# ==========================================================================
amb = np.zeros(N)
# slow-breathing low drone, two detuned partials
for f, a in ((41.2, 0.55), (61.7, 0.30), (82.4, 0.16)):
    lfo = 1 + 0.05 * np.sin(2 * np.pi * 0.037 * ts + f)
    amb += np.sin(2 * np.pi * f * ts * lfo) * a
amb = lpf(amb, 190)
# faint filtered room hiss, gently modulated so it never sits perfectly still
room = lpf(hpf(noise(N), 320), 2600) * 0.10
room *= 0.75 + 0.25 * np.sin(2 * np.pi * 0.021 * ts)
amb += room
# occasional very soft high shimmer so the bed has an upper edge
amb += hpf(noise(N), 9000) * 0.018
amb = np.tanh(amb * 1.1)
ag = np.ones(N)
ag[: int(2.0 * SR)] = np.linspace(0, 1, int(2.0 * SR))
ag[-int(2.0 * SR):] = np.linspace(1, 0, int(2.0 * SR))
amb *= ag
amb = np.stack([amb, np.concatenate([np.zeros(310), amb[:-310]])], 1)
amb /= max(1e-9, np.abs(amb).max())
wr("ambient-bed", amb * 0.62)
print(f"ambient bed: {DUR:.3f}s")

# ==========================================================================
# SFX PALETTE
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


sfx("whoosh-air", whoosh(0.58, 780, 5400, 0.8))
sfx("whoosh-low", whoosh(0.82, 95, 1250, 1.1))
sfx("whoosh-rev", whoosh(0.66, 4400, 820, 0.9, rev=True))
sfx("whoosh-soft", whoosh(0.40, 520, 2500, 1.3))
sfx("whoosh-bright", whoosh(0.46, 1900, 7400, 0.9))

n = int(0.52 * SR)
sfx("whoosh-metal", stereo(
    hpf(noise(n), 2500) * np.hanning(n) * (1 + 0.5 * np.sin(2 * np.pi * 41 * t(n)))
    + np.sin(2 * np.pi * np.cumsum(np.linspace(1500, 6200, n)) / SR) * 0.3 * np.hanning(n),
    0.6, 0.005))

n = int(1.05 * SR)
sw = np.concatenate([np.linspace(320, 4300, n // 2), np.linspace(4300, 940, n - n // 2)])
sfx("whoosh-swoop", stereo(
    (hpf(noise(n), 520) * 0.5 + np.sin(2 * np.pi * np.cumsum(sw) / SR) * 0.35)
    * np.hanning(n) ** 0.6, 0.55, 0.007))

n = int(1.45 * SR)
imp = (np.sin(2 * np.pi * np.cumsum(60 * np.exp(-t(n) / 0.05) + 36) / SR) * expd(n, 0.30)
       + hpf(noise(n), 320) * expd(n, 0.020) * 0.5)
sfx("impact-deep", stereo(verb(imp, mix=0.22), 0.2, 0.004))

n = int(0.85 * SR)
imp2 = (hpf(noise(n), 950) * expd(n, 0.085) * 0.7
        + np.sin(2 * np.pi * np.cumsum(np.linspace(230, 74, n)) / SR) * expd(n, 0.16))
sfx("impact-mid", stereo(verb(imp2, mix=0.20), 0.3, 0.005))

n = int(0.38 * SR)
imp3 = hpf(noise(n), 2300) * expd(n, 0.032) * 0.8 + np.sin(2 * np.pi * 940 * t(n)) * expd(n, 0.028) * 0.5
sfx("impact-light", stereo(imp3, 0.25, 0.003))

n = int(1.25 * SR)
imp4 = (np.sin(2 * np.pi * np.cumsum(np.linspace(350, 94, n)) / SR) * expd(n, 0.42)
        + hpf(noise(n), 720) * expd(n, 0.05) * 0.4)
sfx("impact-hollow", stereo(verb(lpf(imp4, 2700), mix=0.26), 0.28, 0.006))

n = int(0.32 * SR)
sfx("tick", stereo(hpf(noise(n), 5400) * expd(n, 0.011)
                   + np.sin(2 * np.pi * 2500 * t(n)) * expd(n, 0.009) * 0.5, 0.35, 0.003))

n = int(0.40 * SR)
seg = int(0.09 * SR)
gap = int(0.085 * SR)
tk = np.zeros(n)
tk[:seg] = hpf(noise(seg), 5200) * expd(seg, 0.010) + np.sin(2 * np.pi * 2700 * t(seg)) * expd(seg, 0.008) * 0.5
tk[gap:gap + seg] += hpf(noise(seg), 5800) * expd(seg, 0.010) + np.sin(2 * np.pi * 3050 * t(seg)) * expd(seg, 0.008) * 0.5
sfx("tick-double", stereo(tk, 0.32, 0.003))

n = int(0.24 * SR)
sfx("click-ui", stereo(np.sin(2 * np.pi * 1700 * t(n)) * expd(n, 0.018) * 0.8
                       + hpf(noise(n), 4200) * expd(n, 0.006) * 0.5, 0.25, 0.002))

n = int(0.28 * SR)
sfx("click-soft", stereo(np.sin(2 * np.pi * 1010 * t(n)) * expd(n, 0.026) * 0.7
                         + lpf(noise(n), 3100) * expd(n, 0.011) * 0.3, 0.22, 0.002))

n = int(0.22 * SR)
sfx("click-deep", stereo(np.sin(2 * np.pi * 430 * t(n)) * expd(n, 0.022) * 0.85
                         + hpf(noise(n), 2300) * expd(n, 0.005) * 0.3, 0.24, 0.002))

n = int(1.6 * SR)
riser = ((hpf(noise(n), 520) * 0.55
          + np.sin(2 * np.pi * np.cumsum(np.linspace(230, 2700, n)) / SR) * 0.45)
         * np.linspace(0, 1, n) ** 2.6)
sfx("riser", stereo(riser, 0.55, 0.008))

n = int(0.80 * SR)
riserS = ((hpf(noise(n), 720) * 0.55
           + np.sin(2 * np.pi * np.cumsum(np.linspace(420, 3300, n)) / SR) * 0.4)
          * np.linspace(0, 1, n) ** 2.2)
sfx("riser-short", stereo(riserS, 0.50, 0.006))

n = int(2.6 * SR)
riserL = ((hpf(noise(n), 300) * 0.5
           + np.sin(2 * np.pi * np.cumsum(np.linspace(150, 2300, n)) / SR) * 0.4)
          * np.linspace(0, 1, n) ** 3.0)
sfx("riser-long", stereo(riserL, 0.55, 0.010))

n = int(0.72 * SR)
sfx("sub-drop", stereo(np.sin(2 * np.pi * np.cumsum(np.linspace(155, 27, n)) / SR) * expd(n, 0.26),
                       0.1, 0.003))

n = int(1.05 * SR)
sh = np.zeros(n)
for f in (2093, 2637, 3136, 4186, 5274):
    sh += np.sin(2 * np.pi * f * t(n)) * expd(n, 0.27) * rng.uniform(0.5, 1.0)
sfx("shimmer", stereo(verb(hpf(sh, 1500) * 0.5, mix=0.30), 0.7, 0.010))

n = int(1.25 * SR)
shb = np.zeros(n)
for f in (3136, 4186, 5274, 6272, 7040):
    shb += np.sin(2 * np.pi * f * t(n)) * expd(n, 0.33) * rng.uniform(0.55, 1.0)
sfx("shimmer-bright", stereo(verb(hpf(shb, 2200) * 0.5, mix=0.30), 0.75, 0.012))

n = int(0.42 * SR)
gl = noise(n) * expd(n, 0.05)
stp = int(0.011 * SR)
for i in range(0, n - stp, stp * 2):
    gl[i:i + stp] *= 0.06
sfx("glitch", stereo(hpf(gl, 1250), 0.6, 0.004))

n = int(1.25 * SR)
sfx("swell", stereo(lpf(noise(n), 1450) * (np.linspace(0, 1, n) ** 2) * 0.8
                    + np.sin(2 * np.pi * np.cumsum(np.linspace(85, 270, n)) / SR)
                    * np.linspace(0, 1, n) ** 2 * 0.4, 0.5, 0.012))

n = int(1.45 * SR)
sfx("swell-dark", stereo(lpf(noise(n), 820) * (np.linspace(0, 1, n) ** 2.2) * 0.8
                         + np.sin(2 * np.pi * np.cumsum(np.linspace(52, 145, n)) / SR)
                         * np.linspace(0, 1, n) ** 2.2 * 0.45, 0.5, 0.014))

n = int(0.26 * SR)
sfx("transition-blip", stereo(np.sin(2 * np.pi * np.cumsum(np.linspace(640, 2500, n)) / SR)
                              * expd(n, 0.042), 0.3, 0.002))

n = int(2.1 * SR)
ch = np.zeros(n)
for f in (261.63, 329.63, 392.00, 523.25):
    ch += np.sin(2 * np.pi * f * t(n)) * expd(n, 0.82)
sfx("chime-final", stereo(verb(ch * 0.5, mix=0.32), 0.6, 0.014))

n = int(1.35 * SR)
chs = np.zeros(n)
for f in (392.00, 493.88, 587.33):
    chs += np.sin(2 * np.pi * f * t(n)) * expd(n, 0.52)
sfx("chime-soft", stereo(verb(chs * 0.45, mix=0.26), 0.55, 0.010))

# ------------------------------------------------- TASCAM mechanical accents
# A 100mm fader travelling in its slot: damped friction noise with a soft
# end-stop. Cued to the fader-glide beats on the Model 24 / 2400.
n = int(0.70 * SR)
trav = np.linspace(0, 1, n)
fric = lpf(hpf(noise(n), 900), 4200) * (0.25 + 0.55 * np.sin(np.pi * trav) ** 0.7)
fric *= 1 + 0.25 * np.sin(2 * np.pi * 26 * t(n))
stop = np.zeros(n)
si = int(0.62 * n)
stop[si:] = (hpf(noise(n - si), 1800) * expd(n - si, 0.020) * 0.6
             + np.sin(2 * np.pi * 320 * t(n - si)) * expd(n - si, 0.030) * 0.4)
sfx("fader-slide", stereo(fric * 0.8 + stop, 0.4, 0.005))

# Rotary knob detents — six discrete clicks with slightly rising pitch.
n = int(0.62 * SR)
kn = np.zeros(n)
for i in range(6):
    j = int((0.02 + i * 0.095) * SR)
    ln = int(0.05 * SR)
    if j + ln < n:
        f = 1900 + i * 130
        kn[j:j + ln] += (np.sin(2 * np.pi * f * t(ln)) * expd(ln, 0.008) * 0.7
                         + hpf(noise(ln), 4800) * expd(ln, 0.004) * 0.5)
sfx("knob-detent", stereo(kn, 0.3, 0.003))

# Relay / channel-arm: a dry mechanical snap with a short metallic tail.
n = int(0.34 * SR)
rel = (hpf(noise(n), 2600) * expd(n, 0.008) * 0.9
       + np.sin(2 * np.pi * 780 * t(n)) * expd(n, 0.014) * 0.5
       + np.sin(2 * np.pi * 3100 * t(n)) * expd(n, 0.006) * 0.3)
sfx("relay-click", stereo(rel, 0.26, 0.002))

# Meter-LED ripple: twelve ascending blips, the SD-armed "wake up" cascade.
n = int(0.95 * SR)
mb = np.zeros(n)
for i in range(12):
    j = int((0.01 + i * 0.062) * SR)
    ln = int(0.055 * SR)
    if j + ln < n:
        f = 1050 * (2 ** (i / 12))
        mb[j:j + ln] += np.sin(2 * np.pi * f * t(ln)) * expd(ln, 0.016) * (0.35 + i * 0.045)
sfx("meter-ripple", stereo(verb(hpf(mb, 600), mix=0.22), 0.55, 0.008))

# SD card seating into its slot: plastic slide then a spring-loaded latch.
n = int(0.80 * SR)
slide = lpf(hpf(noise(n), 1400), 5200) * np.concatenate(
    [np.linspace(0, 1, int(0.32 * n)) ** 2, np.zeros(n - int(0.32 * n))]) * 0.5
latch = np.zeros(n)
li = int(0.40 * n)
latch[li:] = (hpf(noise(n - li), 3000) * expd(n - li, 0.010) * 0.85
              + np.sin(2 * np.pi * 1250 * t(n - li)) * expd(n - li, 0.018) * 0.5)
sfx("sd-insert", stereo(slide + latch, 0.32, 0.004))

# DB-25 thumbscrew locking down: a low metallic thread turn into a seated thud.
n = int(0.90 * SR)
thread = np.zeros(n)
for i in range(5):
    j = int((0.02 + i * 0.075) * SR)
    ln = int(0.06 * SR)
    if j + ln < n:
        thread[j:j + ln] += (hpf(noise(ln), 2200) * expd(ln, 0.012) * 0.45
                             + np.sin(2 * np.pi * (520 + i * 40) * t(ln)) * expd(ln, 0.018) * 0.35)
seat = np.zeros(n)
qi = int(0.52 * n)
seat[qi:] = (np.sin(2 * np.pi * np.cumsum(np.linspace(230, 90, n - qi)) / SR) * expd(n - qi, 0.10)
             + hpf(noise(n - qi), 900) * expd(n - qi, 0.018) * 0.4)
sfx("db25-lock", stereo(verb(thread + seat, mix=0.22), 0.3, 0.005))

# Transport engage: the HUI/MCU REC button arming, a firm switch plus a tone.
n = int(0.55 * SR)
tr = (hpf(noise(n), 2000) * expd(n, 0.009) * 0.8
      + np.sin(2 * np.pi * 620 * t(n)) * expd(n, 0.05) * 0.45
      + np.sin(2 * np.pi * 1240 * t(n)) * expd(n, 0.025) * 0.25)
sfx("transport-arm", stereo(verb(tr, mix=0.20), 0.28, 0.003))

# ------------------------------------------------------- silent VO placeholder
wr("vo-silent", np.zeros((N, 2)))

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


enc("music-bed", os.path.join(AUD_DIR, "music-bed.mp3"), "224k")
enc("ambient-bed", os.path.join(AUD_DIR, "ambient-bed.mp3"), "192k")
enc("vo-silent", os.path.join(VO_DIR, "voiceover-reel-tascam.mp3"), "96k")
sfx_names = [n for n in names if n not in ("music-bed", "ambient-bed", "vo-silent")]
for n_ in sfx_names:
    enc(n_, os.path.join(SFX_DIR, n_ + ".mp3"), "192k")

print(f"SFX encoded: {len(sfx_names)}")
for n_ in sfx_names:
    print("  ", n_)
print("done")
