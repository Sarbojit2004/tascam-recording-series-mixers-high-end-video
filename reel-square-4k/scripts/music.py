"""Cut "Mortals (Hindi)" (Zeus X Crona, Warriyo, Panther — NCS) to a 60.78 s reel and export its beat map.

  python3 scripts/music.py <song.mp3>

Edit (song time, ~89.55 BPM, bar 2.674 s, 4-bar phrases):
  A  29.42 -> 72.18   bar 10 (pre-hook) + hook 1 (bars 11-25)   reel 0.00 -> 42.76  (drop at 2.67 s)
  B  109.60 -> end    bar 40 (pre-hook) + hook 2 (bars 41-...)  reel 42.76 -> 60.78 (second drop 45.43 s)
The splice joins two pre-hook bars of the same function, with a 40 ms equal-power crossfade that
ends on the refined downbeat. 1.0 s fade-in (the reel opens on the hook, not a slow intro),
2.0 s fade-out, then pure-gain normalisation to -14.0 LUFS integrated.

Writes public/rec/audio/bed.wav and src/music.json {fps, frames, duration, beats[], downbeats[],
drops[], outro} in reel time.
"""
import json, os, re, subprocess, sys
import numpy as np
from scipy import signal

HERE = os.path.dirname(os.path.abspath(__file__))
PROJ = os.path.dirname(HERE)
SR = 48000
FPS = 60
BPM = 89.55
A = (29.42, 72.18)
B0 = 109.60
DUR = 60.78
FADE_IN, FADE_OUT = 1.0, 2.0


def decode(path):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-f", "f32le", "-ac", "2", "-ar", str(SR), "-"], check=True, capture_output=True).stdout
    return np.frombuffer(raw, np.float32).reshape(-1, 2).copy()


def flux_env(mono, hop=480):
    f, t, Z = signal.stft(mono, SR, nperseg=2048, noverlap=2048 - hop)
    M = np.log1p(np.abs(Z) * 100)
    d = np.maximum(0, np.diff(M, axis=1)).sum(0)
    return np.r_[0, d], hop


def track(fl, hop):
    """Dynamic-programming beat tracker (Ellis 2007) with a fixed tempo prior."""
    fps = SR / hop
    o = fl / (fl.std() + 1e-9)
    o = np.convolve(o, [0.25, 0.5, 1, 0.5, 0.25], "same")
    P = fps * 60 / BPM
    n = len(o)
    score = o.copy()
    back = -np.ones(n, int)
    lo, hi = int(P * 0.85), int(P * 1.18)
    for i in range(hi, n):
        prev = np.arange(i - hi, i - lo + 1)
        c = score[prev] - 120.0 * np.log((i - prev) / P) ** 2
        k = np.argmax(c)
        score[i] = o[i] + c[k]
        back[i] = prev[k]
    i = int(np.argmax(score[-int(P * 1.5):]) + n - int(P * 1.5))
    out = []
    while i >= 0:
        out.append(i)
        i = back[i]
    return np.array(out[::-1]) / fps


def lufs(path):
    err = subprocess.run(["ffmpeg", "-hide_banner", "-i", path, "-af", "ebur128=framelog=quiet", "-f", "null", "-"], capture_output=True, text=True).stderr
    return float(re.findall(r"I:\s+(-?[\d.]+) LUFS", err)[-1])


def main():
    x = decode(sys.argv[1])
    mono = x.mean(1)
    fl, hop = flux_env(mono)
    beats = track(fl, hop)
    # downbeats: the beat phase with the most sub-bass (kick/808) energy
    sos = signal.butter(4, [30, 120], "band", fs=SR, output="sos")
    lo = np.abs(signal.sosfilt(sos, mono))
    e = np.array([lo[int(t * SR):int((t + 0.08) * SR)].mean() for t in beats])
    ph = int(np.argmax([e[p::4][4:].mean() for p in range(4)]))
    down = beats[ph::4]

    def snap(t):
        """nearest tracked downbeat, refined to the strongest onset within +-30 ms"""
        t = down[np.argmin(np.abs(down - t))]
        i0, i1 = int((t - 0.03) * SR / hop), int((t + 0.03) * SR / hop)
        return (i0 + int(np.argmax(fl[i0:i1]))) * hop / SR

    a0, a1, b0 = snap(A[0]), snap(A[1]), snap(B0)
    b1 = b0 + (DUR - (a1 - a0))
    XF = int(0.040 * SR)
    segA = x[int(a0 * SR):int(a1 * SR)].copy()
    pre = x[int(b0 * SR) - XF:int(b0 * SR)]
    t = np.linspace(0, np.pi / 2, XF)[:, None]
    segA[-XF:] = segA[-XF:] * np.cos(t) + pre * np.sin(t)
    out = np.concatenate([segA, x[int(b0 * SR):int(b1 * SR)]])
    n = int(round(DUR * SR))
    out = out[:n] if len(out) >= n else np.concatenate([out, np.zeros((n - len(out), 2), np.float32)])
    fi, fo = int(FADE_IN * SR), int(FADE_OUT * SR)
    out[:fi] *= (np.sin(np.linspace(0, np.pi / 2, fi)) ** 2)[:, None]
    out[-fo:] *= (np.cos(np.linspace(0, np.pi / 2, fo)) ** 2)[:, None]

    os.makedirs(os.path.join(PROJ, "public", "rec", "audio"), exist_ok=True)
    raw = os.path.join(PROJ, "public", "rec", "audio", "bed-raw.wav")
    bed = os.path.join(PROJ, "public", "rec", "audio", "bed.wav")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "2", "-i", "-", "-c:a", "pcm_s24le", raw],
                   input=np.ascontiguousarray(out, np.float32).tobytes(), check=True)
    g = -14.0 - lufs(raw)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", raw, "-af", f"volume={g:.2f}dB", "-c:a", "pcm_s24le", bed], check=True)
    os.remove(raw)
    peak = subprocess.run(["ffmpeg", "-hide_banner", "-i", bed, "-af", "astats=measure_overall=Peak_level:measure_perchannel=none", "-f", "null", "-"], capture_output=True, text=True).stderr
    print(f"splice A {a0:.4f}->{a1:.4f}  B {b0:.4f}->{b1:.4f}  gain {g:+.2f} dB  bed {lufs(bed)} LUFS",
          re.findall(r"Peak level dB: (-?[\d.]+)", peak)[-1:])

    def to_reel(s):
        if a0 - 0.02 <= s < a1 - 0.02:
            return s - a0
        if b0 - 0.02 <= s < b1:
            return (a1 - a0) + (s - b0)
        return None

    rb = sorted({round(r, 4) for r in (to_reel(s) for s in beats) if r is not None and r < DUR})
    clean = []
    for r in rb:
        if not clean or r - clean[-1] > 0.3:
            clean.append(r)
    rdown = sorted({round(r, 4) for r in (to_reel(s) for s in down) if r is not None and r < DUR})
    # the splice point itself is a downbeat
    split = round(a1 - a0, 4)
    if all(abs(d - split) > 0.1 for d in rdown):
        rdown = sorted(rdown + [split])
    if all(abs(d - split) > 0.1 for d in clean):
        clean = sorted(clean + [split])
    data = {
        "fps": FPS,
        "frames": int(round(DUR * FPS)),
        "duration": DUR,
        "bpm": BPM,
        "beats": clean,
        "downbeats": rdown,
        "drops": [round(snap(32.09) - a0, 4), round(split + (snap(112.27) - b0), 4)],
        "splice": split,
        "song": {"a": [round(a0, 4), round(a1, 4)], "b": [round(b0, 4), round(b1, 4)]},
    }
    json.dump(data, open(os.path.join(PROJ, "src", "music.json"), "w"), indent=1)
    print("beats", len(clean), "downbeats", len(rdown), "drops", data["drops"])
    print("downbeats", rdown)


if __name__ == "__main__":
    main()
