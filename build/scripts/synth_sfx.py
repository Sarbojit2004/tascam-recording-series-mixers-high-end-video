#!/usr/bin/env python3
"""Synthesizes the Layer 2 transition vocabulary from scratch.

Section 12: the eight supplied tracks contain no transition material, so every
transition sound in all four deliverables is synthesized here. Pure PCM - no
sample library, nothing inherited from any prior build.

The vocabulary is this hardware's own, as the section names it:

    fader-throw        60/100 mm fader travel - friction, not a click
    knob-rotary        rotary detent resistance
    sdxc-seat          SDXC card seating into its slot
    transport-engage   transport button engagement
    trs-insert         TRS insert-point seating
    db25-seat          DB25 multi-pin connector seating - 25 pins, staggered

Plus three structural marks the edit needs between beats:

    data-tick          a digital value settling
    spec-latch         a Level 1 figure landing
    phase-mark         a chapter boundary

EVERY SOUND IS HIGH-PASSED at 900 Hz or above. These sit under narration on a
clean, quiet production; anything with low-mid weight would crowd the voice and
fight the music bed. scripts/audit_audio.py fails the build if any sound puts
more than 0.5% of its energy below 900 Hz, or if anything clips.
"""
import os
import subprocess
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
BUILD = os.path.dirname(HERE)
OUT = os.path.join(BUILD, "assets", "audio", "sfx")
SR = 48000
rng = np.random.default_rng(0x7A5CA3)


def t(dur):
    return np.arange(int(dur * SR)) / SR


def env(n, a=0.002, d=0.08, curve=3.0):
    """Percussive attack/decay envelope."""
    e = np.zeros(n)
    ai = max(1, int(a * SR))
    e[:ai] = np.linspace(0, 1, ai)
    rest = n - ai
    if rest > 0:
        e[ai:] = np.exp(-np.linspace(0, curve, rest))
    return e


def hp(x, fc, order=2):
    """Simple one-pole-cascade high pass."""
    y = x.copy()
    for _ in range(order):
        a = np.exp(-2 * np.pi * fc / SR)
        out = np.zeros_like(y)
        prev_x = prev_y = 0.0
        for i in range(len(y)):
            out[i] = a * (prev_y + y[i] - prev_x)
            prev_x, prev_y = y[i], out[i]
        y = out
    return y


def hp_fft(x, fc):
    """FFT high-pass - far faster than the sample loop for long buffers."""
    n = len(x)
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(n, 1 / SR)
    g = np.clip((f / fc) ** 2 / (1 + (f / fc) ** 2), 0, 1)
    return np.fft.irfft(X * g, n)


def noise(n):
    return rng.standard_normal(n)


def partial(dur, freq, decay, amp=1.0, jitter=0.0):
    x = t(dur)
    f = freq * (1 + jitter * rng.standard_normal(len(x)).cumsum() / max(1, len(x)))
    return amp * np.sin(2 * np.pi * f * x) * np.exp(-decay * x)


def declick(x, ms=3.0):
    k = max(2, int(ms / 1000 * SR))
    w = 0.5 - 0.5 * np.cos(np.linspace(0, np.pi, k))
    x[:k] *= w
    x[-k:] *= w[::-1]
    return x


# ---------------------------------------------------------------- sounds ---
def fader_throw():
    """Travel friction across a fader's length. Sustained, not an impact."""
    d = 0.62
    n = int(d * SR)
    x = t(d)
    # Band-limited friction whose brightness rises with travel speed.
    speed = np.sin(np.pi * np.clip(x / d, 0, 1)) ** 0.7
    s = noise(n) * speed
    s = hp_fft(s, 1400) * 0.5
    # Faint track resonance so it reads as a physical slot, not hiss.
    s += partial(d, 2600, 5.0, 0.05) * speed
    s *= np.concatenate([np.linspace(0, 1, int(0.02 * SR)),
                         np.ones(n - int(0.04 * SR)),
                         np.linspace(1, 0, int(0.02 * SR))])
    return s


def knob_rotary():
    """Three detents, each a short damped click with a little grit."""
    d = 0.44
    n = int(d * SR)
    s = np.zeros(n)
    for i, at in enumerate([0.02, 0.17, 0.31]):
        k = int(at * SR)
        seg = min(int(0.10 * SR), n - k)
        e = env(seg, a=0.0008, d=0.05, curve=6.0)
        c = (partial(seg / SR, 3100 - i * 180, 46, 0.55)
             + partial(seg / SR, 5200 + i * 240, 60, 0.3)
             + hp_fft(noise(seg), 2200) * 0.18)
        s[k:k + seg] += c * e
    return hp_fft(s, 1200)


def sdxc_seat():
    """Plastic card sliding, then the spring latch catching."""
    d = 0.34
    n = int(d * SR)
    s = np.zeros(n)
    sl = int(0.16 * SR)
    s[:sl] += hp_fft(noise(sl), 2600) * np.linspace(0.05, 0.3, sl)
    k = int(0.20 * SR)
    seg = n - k
    s[k:] += (partial(seg / SR, 4200, 70, 0.5)
              + partial(seg / SR, 7100, 90, 0.28)) * env(seg, a=0.0005, d=0.04, curve=8.0)
    return hp_fft(s, 1500)


def transport_engage():
    """A single positive button press - short, damped, mechanical."""
    d = 0.13
    n = int(d * SR)
    s = (partial(d, 2400, 80, 0.6) + partial(d, 3900, 110, 0.35)
         + hp_fft(noise(n), 3000) * 0.2)
    return hp_fft(s * env(n, a=0.0004, d=0.03, curve=9.0), 1100)


def trs_insert():
    """Jack sleeve sliding past the contacts, then bottoming out."""
    d = 0.21
    n = int(d * SR)
    s = np.zeros(n)
    sl = int(0.11 * SR)
    s[:sl] += hp_fft(noise(sl), 1800) * np.linspace(0.08, 0.34, sl)
    k = int(0.13 * SR)
    seg = n - k
    s[k:] += (partial(seg / SR, 1900, 60, 0.5)
              + partial(seg / SR, 3300, 78, 0.3)) * env(seg, a=0.0006, d=0.04, curve=7.0)
    return hp_fft(s, 1000)


def db25_seat():
    """25 pins engaging in a staggered cascade, then shell and jackscrew.

    The signature sound of the Studio Bridge's whole argument, so it is built
    rather than approximated: a dense burst of many small contacts landing
    slightly out of step, a broader shell seat, then a short screw thread.
    """
    d = 0.46
    n = int(d * SR)
    s = np.zeros(n)
    # 25 contacts across ~90 ms, deliberately uneven.
    for i in range(25):
        at = 0.03 + (i / 25) * 0.09 + rng.uniform(0, 0.004)
        k = int(at * SR)
        seg = min(int(0.05 * SR), n - k)
        if seg <= 0:
            continue
        f = rng.uniform(3200, 6800)
        s[k:k + seg] += partial(seg / SR, f, 120, 0.10) * env(seg, a=0.0003, d=0.02, curve=10.0)
    # Shell seating.
    k = int(0.14 * SR)
    seg = min(int(0.14 * SR), n - k)
    s[k:k + seg] += (partial(seg / SR, 1500, 34, 0.42)
                     + hp_fft(noise(seg), 1400) * 0.16) * env(seg, a=0.001, d=0.05, curve=5.0)
    # Jackscrew.
    k = int(0.27 * SR)
    seg = n - k
    thread = hp_fft(noise(seg), 2400) * 0.14
    thread *= (0.6 + 0.4 * np.sin(2 * np.pi * 26 * t(seg / SR)))
    s[k:] += thread * np.exp(-np.linspace(0, 4, seg))
    return hp_fft(s, 900)


def data_tick():
    d = 0.072
    n = int(d * SR)
    s = partial(d, 5200, 150, 0.5) + partial(d, 8300, 200, 0.22)
    return hp_fft(s * env(n, a=0.0003, d=0.02, curve=12.0), 2200)


def spec_latch():
    d = 0.19
    n = int(d * SR)
    s = (partial(d, 2900, 55, 0.5) + partial(d, 4400, 70, 0.3)
         + partial(d, 6600, 95, 0.16))
    return hp_fft(s * env(n, a=0.0006, d=0.04, curve=7.0), 1500)


def phase_mark():
    """Chapter boundary - a soft, wide swell rather than an impact."""
    d = 1.0
    n = int(d * SR)
    x = t(d)
    s = np.zeros(n)
    for f, a in [(1800, 0.28), (2700, 0.2), (3600, 0.14), (5400, 0.08)]:
        s += a * np.sin(2 * np.pi * f * x) * np.exp(-2.2 * x)
    s += hp_fft(noise(n), 2600) * 0.1 * np.exp(-3.0 * x)
    swell = np.sin(np.pi * np.clip(x / 0.5, 0, 1)) ** 1.5
    s *= np.where(x < 0.5, swell, np.exp(-3.5 * (x - 0.5)))
    return hp_fft(s, 950)


SOUNDS = {
    "fader-throw": fader_throw, "knob-rotary": knob_rotary,
    "sdxc-seat": sdxc_seat, "transport-engage": transport_engage,
    "trs-insert": trs_insert, "db25-seat": db25_seat,
    "data-tick": data_tick, "spec-latch": spec_latch, "phase-mark": phase_mark,
}

if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    for name, fn in SOUNDS.items():
        s = declick(np.asarray(fn(), dtype=np.float64))
        s /= max(np.abs(s).max(), 1e-9)
        s *= 10 ** (-0.9 / 20)  # -0.9 dBFS, never clipped
        st = np.stack([s, s], axis=1)
        pcm = (np.clip(st, -1, 1) * 32767).astype("<i2")
        dst = os.path.join(OUT, f"{name}.wav")
        subprocess.run(
            ["ffmpeg", "-v", "error", "-y", "-f", "s16le", "-ar", str(SR),
             "-ac", "2", "-i", "-", dst],
            input=pcm.tobytes(), check=True,
        )
        print(f"  {name:18s} {len(s)/SR:5.3f}s")
    print(f"\n{len(SOUNDS)} Layer 2 sounds synthesized fresh.")
