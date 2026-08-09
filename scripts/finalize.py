#!/usr/bin/env python3
"""Turns Remotion's render into the exact deliverable: 2,640 frames / 88.000 s.

Why this step exists
--------------------
Two things about Remotion's muxing had to be corrected downstream:

1. The audio stream is written longer than the composition (89.2 s against
   88.0 s), and the video is then padded by one or two frames to cover it. So
   the raw render lands at 88.03–88.07 s, not the 88.000 s deliverable.
2. Within the final second, the muxer overlaps a chunk of the mix, so the
   composition's own closing fade does not survive into the file. Rendering the
   same frames as an isolated range reaches true digital silence at frame 2638;
   the full render does not.

Audio/video sync itself is correct — a sample-level comparison of an isolated
range render against the full render aligns at exactly zero lag — so only the
length and the tail need fixing.

What this does
--------------
* Cuts the video to exactly 2,640 packets with a stream copy (lossless).
* Decodes the audio, cuts it to exactly 88.000 s, and applies a cosine fade
  across the last 0.6 s so the ending is a clean, monotonic decay to silence
  regardless of what the muxer left there.
* Re-muxes: video copied untouched, audio re-encoded once to AAC.

    python3 scripts/finalize.py            # out/_raw-reel.mp4 -> out/tascam-model-series-reel.mp4
    python3 scripts/finalize.py IN OUT
"""
import math
import os
import subprocess
import sys
import tempfile
import wave

import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW = os.path.join(ROOT, "out", "_raw-reel.mp4")
FINAL = os.path.join(ROOT, "out", "tascam-model-series-reel.mp4")

TOTAL_FRAMES = 2640
FPS = 30
SECONDS = TOTAL_FRAMES / FPS  # 88.000
FADE_SECONDS = 0.6


def ff(args, **kw):
    return subprocess.run(["npx", "remotion", "ffmpeg", "-v", "error", "-y"] + args,
                          cwd=ROOT, capture_output=True, text=True, **kw)


def main(src, dst):
    if not os.path.exists(src):
        print(f"FAIL — {src} does not exist. Run `npm run render:raw` first.")
        return 1

    tmp = tempfile.mkdtemp(prefix="tascam-finalize-")
    vid = os.path.join(tmp, "video.mp4")
    raw_wav = os.path.join(tmp, "raw.wav")
    fixed_wav = os.path.join(tmp, "fixed.wav")

    # 1 — video, exactly 2640 packets, stream copy.
    #     `-frames:v` rather than `-t`: with a copy, `-t 88.0` keeps the packet
    #     whose timestamp IS 88.0 and yields 2,641 frames. A packet count is exact.
    r = ff(["-i", src, "-frames:v", str(TOTAL_FRAMES), "-c:v", "copy", "-an", vid])
    if r.returncode != 0:
        print(f"FAIL — video trim:\n{r.stderr}")
        return 1

    # 2 — audio out, cut to length, faded to silence.
    r = ff(["-i", src, "-vn", "-acodec", "pcm_s16le", "-ac", "2", "-ar", "48000", raw_wav])
    if r.returncode != 0:
        print(f"FAIL — audio decode:\n{r.stderr}")
        return 1

    with wave.open(raw_wav, "rb") as w:
        sr = w.getframerate()
        ch = w.getnchannels()
        data = np.frombuffer(w.readframes(w.getnframes()), dtype="<i2")
    x = data.astype(np.float32).reshape(-1, ch) / 32768.0

    want = int(round(SECONDS * sr))
    if x.shape[0] < want:
        x = np.vstack([x, np.zeros((want - x.shape[0], ch), np.float32)])
    x = x[:want]

    n_fade = int(FADE_SECONDS * sr)
    env = 0.5 * (1.0 + np.cos(np.linspace(0.0, math.pi, n_fade)))  # 1 -> 0, no corner
    x[-n_fade:] *= env[:, None]

    with wave.open(fixed_wav, "wb") as w:
        w.setnchannels(ch)
        w.setsampwidth(2)
        w.setframerate(sr)
        w.writeframes(np.clip(x, -1, 1).__mul__(32767).astype("<i2").tobytes())

    # 3 — remux. Video is copied; audio is encoded once.
    r = ff(["-i", vid, "-i", fixed_wav, "-map", "0:v:0", "-map", "1:a:0",
            "-c:v", "copy", "-c:a", "aac", "-b:a", "192k",
            "-movflags", "+faststart", "-shortest", dst])
    if r.returncode != 0:
        print(f"FAIL — remux:\n{r.stderr}")
        return 1

    print(f"finalized {os.path.basename(src)} -> {os.path.basename(dst)}  "
          f"({TOTAL_FRAMES} frames, {SECONDS:.3f}s, {FADE_SECONDS}s tail fade)")
    return 0


if __name__ == "__main__":
    a = sys.argv[1] if len(sys.argv) > 1 else RAW
    b = sys.argv[2] if len(sys.argv) > 2 else FINAL
    raise SystemExit(main(a, b))
