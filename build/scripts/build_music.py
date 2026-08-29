#!/usr/bin/env python3
"""Builds one music bed per deliverable, at that deliverable's exact runtime.

LAYER 1 (Section 12). One distinct track per deliverable, zero repetition
across the four videos. Four of the eight supplied tracks go unused, which the
section says is expected and correct.

    longform  898 s   Idiosyncrasies            Gavin Luke          226.5 s
    reel1     178 s   Stay For A Minute         Windshield          210.0 s
    reel2     178 s   Box of Black Pearls       Vivera              226.5 s
    reel3     178 s   Like the Palm of Your Hand Harper Rey         148.8 s

    unused:   ACTIVE, Fable, Impossible Theory, The Light from Within

WHY STEMS RATHER THAN A LOOP. The long-form needs 898 s from a 226.5 s track.
Looping the full mix four times is audible and dull. Instead each pass is
re-voiced from the isolated stems - an opening that enters on instruments and
melody with the drums held back, a full-weight body, and a decaying close -
so the bed evolves across the runtime instead of repeating. Passes are
phase-locked to the track's own length so bar boundaries stay aligned and the
joins land musically.

Beds sit low under narration and are ducked further under Layer 2 transitions
by the scene mix, not here.
"""
import os
import subprocess
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
BUILD = os.path.dirname(HERE)
ROOT = os.path.dirname(BUILD)
SRC = os.path.join(ROOT, "sfx-audio-files")
OUT = os.path.join(BUILD, "assets", "audio")
SR = 48000

TRACKS = {
    "longform": {"key": "Idiosyncrasies", "seconds": 898, "peak": -14.0},
    "reel1":    {"key": "Stay For A Minute", "seconds": 178, "peak": -13.0},
    "reel2":    {"key": "Box of Black Pearls", "seconds": 178, "peak": -13.0},
    "reel3":    {"key": "Like the Palm of Your Hand", "seconds": 178, "peak": -14.5},
}
STEMS = ["BASS", "DRUMS", "INSTRUMENTS", "MELODY"]


def load(path):
    """Decode to float32 stereo at SR via ffmpeg."""
    p = subprocess.run(
        ["ffmpeg", "-v", "error", "-i", path, "-f", "f32le",
         "-ac", "2", "-ar", str(SR), "-"],
        capture_output=True, check=True,
    )
    return np.frombuffer(p.stdout, dtype=np.float32).reshape(-1, 2).astype(np.float64)


def find(key, stem=None):
    for f in os.listdir(SRC):
        if not f.endswith(".mp3") or key.lower() not in f.lower():
            continue
        has = "STEMS" in f
        if stem is None and not has:
            return os.path.join(SRC, f)
        if stem is not None and has and f"STEMS {stem}" in f:
            return os.path.join(SRC, f)
    return None


def fade(n, a_in, a_out):
    """Raised-cosine in/out envelope, sample counts."""
    e = np.ones(n)
    if a_in > 0:
        k = min(a_in, n // 2)
        e[:k] = 0.5 - 0.5 * np.cos(np.linspace(0, np.pi, k))
    if a_out > 0:
        k = min(a_out, n // 2)
        e[-k:] = 0.5 + 0.5 * np.cos(np.linspace(0, np.pi, k))
    return e[:, None]


def build(name, cfg):
    total = int(cfg["seconds"] * SR)
    stems = {}
    for s in STEMS:
        p = find(cfg["key"], s)
        if p:
            stems[s] = load(p)
    full = load(find(cfg["key"]))
    if not stems:
        stems = {"FULL": full}

    L = min(len(v) for v in stems.values())
    for k in stems:
        stems[k] = stems[k][:L]

    # ACTIVE SPAN. Several of these tracks open with a long, very quiet intro
    # AND close with their own fade-out - Stay For A Minute sits near -56 dB
    # for five seconds, Like the Palm of Your Hand decays over its last seven.
    # Starting at the top leaves a reel silent exactly where Section 8.2 wants
    # its hook; and simply rotating the track (an earlier attempt) just moved
    # the quiet outro into the MIDDLE of the bed, which the audio audit caught
    # as five seconds of dead air at 142 s in reel 3.
    #
    # So both ends are trimmed instead: the bed is built only from the span
    # where the track is actually playing, which loops cleanly because every
    # join now lands between two active passages.
    mono = full[:L].mean(axis=1)
    win = SR
    lv = np.array([
        20 * np.log10(np.sqrt((mono[i:i + win] ** 2).mean()) + 1e-12)
        for i in range(0, max(1, len(mono) - win), win)
    ])
    target = np.median(lv) - 6.0
    active = np.where(lv >= target)[0]
    if len(active) >= 4:
        a0, a1 = int(active[0]) * win, min(L, (int(active[-1]) + 1) * win)
        for k in stems:
            stems[k] = stems[k][a0:a1]
        L = min(len(v) for v in stems.values())

    bed = np.zeros((total, 2))
    pos = 0
    npass = 0
    XF = int(2.5 * SR)  # crossfade between passes

    while pos < total:
        take = min(L, total - pos + XF)
        # Per-pass voicing: which stems are present, and how loud.
        # Cycles so consecutive passes never sound identical.
        phase = npass % 3
        gains = {
            0: {"BASS": 0.85, "DRUMS": 0.35, "INSTRUMENTS": 1.0, "MELODY": 0.9, "FULL": 0.8},
            1: {"BASS": 1.0, "DRUMS": 0.95, "INSTRUMENTS": 1.0, "MELODY": 0.75, "FULL": 1.0},
            2: {"BASS": 0.9, "DRUMS": 0.6, "INSTRUMENTS": 0.9, "MELODY": 1.0, "FULL": 0.85},
        }[phase]

        seg = np.zeros((take, 2))
        for k, v in stems.items():
            seg += v[:take] * gains.get(k, 0.8)

        seg *= fade(take, XF if pos > 0 else int(0.6 * SR), XF)

        end = min(pos + take, total)
        bed[pos:end] += seg[: end - pos]
        pos += L - XF
        npass += 1

    # Close the whole bed cleanly at both ends.
    bed *= fade(total, int(0.5 * SR), int(3.5 * SR))

    peak = np.abs(bed).max()
    if peak > 0:
        bed *= (10 ** (cfg["peak"] / 20)) / peak

    os.makedirs(OUT, exist_ok=True)
    dst = os.path.join(OUT, f"{name}-music-bed.wav")
    pcm = (np.clip(bed, -1, 1) * 32767).astype("<i2")
    subprocess.run(
        ["ffmpeg", "-v", "error", "-y", "-f", "s16le", "-ar", str(SR),
         "-ac", "2", "-i", "-", dst],
        input=pcm.tobytes(), check=True,
    )
    return {
        "file": os.path.basename(dst), "track": cfg["key"], "passes": npass,
        "stems": sorted(stems.keys()), "seconds": total / SR,
        "peak_db": 20 * np.log10(np.abs(bed).max() + 1e-12),
    }


if __name__ == "__main__":
    used = []
    for name, cfg in TRACKS.items():
        r = build(name, cfg)
        used.append(r["track"])
        print(f"{name:9s} {r['seconds']:7.3f}s  peak {r['peak_db']:6.2f} dB  "
              f"{r['passes']} passes  stems={','.join(s[:3] for s in r['stems'])}  "
              f"<- {r['track']}")
    assert len(set(used)) == 4, "MUSIC OVERLAP - a track was used twice"
    print(f"\n4/4 distinct tracks, zero overlap confirmed.")
