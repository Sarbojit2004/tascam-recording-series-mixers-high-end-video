#!/usr/bin/env python3
"""
Renders the Layer 2 transition-SFX layer onto its own timeline at the exact
positions used in the finished video, spanning the full runtime, as ONE
continuous synced file with the music bed absent.

This file is BOTH a required deliverable and the audio the video itself plays.
The composition mounts this rendered WAV rather than scheduling one <Audio> per
cue, so the delivered SFX stem and the SFX heard in the MP4 are the same
samples by construction and cannot drift out of sync.

Usage: render_sfx_timeline.py <cues.json> <out.wav> <seconds>
  cues.json: [{"sfx": "db25-seat", "frame": 1234, "gain": 0.8, "pan": 0.0}, ...]
"""
import json, os, subprocess, sys
import numpy as np

SR, FPS = 48000, 30
HERE = os.path.dirname(os.path.abspath(__file__))
SFX = os.path.join(os.path.dirname(HERE), "assets", "audio", "sfx")

def load(p):
    r = subprocess.run(["ffmpeg", "-v", "error", "-i", p, "-ac", "1", "-ar", str(SR),
                        "-f", "f32le", "-"], capture_output=True)
    return np.frombuffer(r.stdout, dtype=np.float32).astype(np.float64)

def main():
    cues_path, out_path, seconds = sys.argv[1], sys.argv[2], float(sys.argv[3])
    cues = json.load(open(cues_path))
    n = int(round(seconds * SR))
    buf = np.zeros((n, 2))
    cache, missing, placed = {}, set(), 0

    for c in cues:
        name = c["sfx"]
        if name not in cache:
            p = os.path.join(SFX, f"{name}.wav")
            if not os.path.exists(p):
                missing.add(name); continue
            cache[name] = load(p)
        x = cache[name]
        at = int(round(c["frame"] / FPS * SR))
        if at >= n: continue
        g = float(c.get("gain", 0.8))
        pan = float(c.get("pan", 0.0))           # -1 L .. +1 R
        gl, gr = g * np.cos((pan + 1) * np.pi / 4), g * np.sin((pan + 1) * np.pi / 4)
        take = min(len(x), n - at)
        buf[at:at + take, 0] += x[:take] * gl * 1.414
        buf[at:at + take, 1] += x[:take] * gr * 1.414
        placed += 1

    if missing:
        sys.exit(f"unknown sfx referenced by schedule: {sorted(missing)}")

    peak = np.abs(buf).max()
    if peak > 0.92:
        buf *= 0.92 / peak
    b = (np.clip(buf, -1, 1) * 32767).astype("<i2").tobytes()
    hdr = (b"RIFF" + (36 + len(b)).to_bytes(4, "little") + b"WAVEfmt "
           + (16).to_bytes(4, "little") + (1).to_bytes(2, "little") + (2).to_bytes(2, "little")
           + SR.to_bytes(4, "little") + (SR * 4).to_bytes(4, "little")
           + (4).to_bytes(2, "little") + (16).to_bytes(2, "little")
           + b"data" + len(b).to_bytes(4, "little"))
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    open(out_path, "wb").write(hdr + b)
    rms = 20 * np.log10(np.sqrt((buf ** 2).mean()) + 1e-12)
    print(f"  {os.path.basename(out_path):38s} {seconds:7.3f}s  {placed:4d} cues  "
          f"{len(cache):2d} distinct  peak {20*np.log10(peak+1e-12):5.1f} dB  rms {rms:6.1f} dB")

if __name__ == "__main__":
    main()
