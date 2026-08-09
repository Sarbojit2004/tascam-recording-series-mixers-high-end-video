#!/usr/bin/env python3
"""Final delivery check on the rendered MP4.

Verifies the things a broken render can still look fine while getting wrong:
the exact frame count and duration, the canvas size and frame rate, that both
a video and an audio stream are present, that the audio is neither silent nor
clipped, and — the failure this check was added for — that the audio stream
does not run past the last video frame.

    python3 scripts/verify_output.py [path/to/render.mp4]
"""
import json
import math
import os
import subprocess
import sys
import tempfile
import wave

import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DEFAULT = os.path.join(ROOT, "out", "tascam-model-series-reel.mp4")

EXPECT_FRAMES = 2640
EXPECT_FPS = 30
EXPECT_W, EXPECT_H = 1080, 1920
EXPECT_SECONDS = EXPECT_FRAMES / EXPECT_FPS  # 88.000
# One AAC packet is 1024/48000 s ≈ 21 ms; allow a couple of packets of muxer slack.
AUDIO_TAIL_TOLERANCE = 0.10

path = sys.argv[1] if len(sys.argv) > 1 else DEFAULT
fail = []


def run(args):
    return subprocess.run(args, capture_output=True, text=True, cwd=ROOT)


if not os.path.exists(path):
    print(f"FAIL — {path} does not exist")
    sys.exit(1)

r = run(["npx", "remotion", "ffprobe", "-v", "error", "-show_streams",
         "-show_format", "-of", "json", path])
if r.returncode != 0:
    print(f"FAIL — ffprobe could not read {path}\n{r.stderr}")
    sys.exit(1)
info = json.loads(r.stdout)

video = next((s for s in info["streams"] if s["codec_type"] == "video"), None)
audio = next((s for s in info["streams"] if s["codec_type"] == "audio"), None)

if video is None:
    fail.append("no video stream")
if audio is None:
    fail.append("no audio stream")

if video:
    n = int(video.get("nb_frames", 0))
    w, h = int(video["width"]), int(video["height"])
    num, den = video["r_frame_rate"].split("/")
    fps = int(num) / int(den)
    vdur = float(video.get("duration", 0))
    print(f"  video  {w}x{h}  {fps:g} fps  {n} frames  {vdur:.3f}s  {video['codec_name']}")
    if n != EXPECT_FRAMES:
        fail.append(f"frame count {n}, expected {EXPECT_FRAMES}")
    if (w, h) != (EXPECT_W, EXPECT_H):
        fail.append(f"resolution {w}x{h}, expected {EXPECT_W}x{EXPECT_H}")
    if abs(fps - EXPECT_FPS) > 0.01:
        fail.append(f"frame rate {fps}, expected {EXPECT_FPS}")
    if abs(vdur - EXPECT_SECONDS) > 0.02:
        fail.append(f"video duration {vdur:.3f}s, expected {EXPECT_SECONDS:.3f}s")

if audio:
    adur = float(audio.get("duration", 0))
    print(f"  audio  {audio['codec_name']}  {audio.get('sample_rate')} Hz  "
          f"{audio.get('channels')} ch  {adur:.3f}s")
    if adur > EXPECT_SECONDS + AUDIO_TAIL_TOLERANCE:
        fail.append(
            f"audio runs {adur - EXPECT_SECONDS:.3f}s past the last video frame "
            f"— a cue's tail is not bounded by the composition")

fdur = float(info["format"]["duration"])
size = int(info["format"]["size"])
print(f"  file   {fdur:.3f}s  {size / 1e6:.1f} MB  {info['format'].get('bit_rate')} bps")
if fdur > EXPECT_SECONDS + AUDIO_TAIL_TOLERANCE:
    fail.append(f"container duration {fdur:.3f}s, expected {EXPECT_SECONDS:.3f}s")

# Decode the audio and measure it — a stream can exist and still be silent.
if audio:
    tmp = os.path.join(tempfile.mkdtemp(prefix="tascam-verify-"), "a.wav")
    r = run(["npx", "remotion", "ffmpeg", "-v", "error", "-y", "-i", path,
             "-acodec", "pcm_s16le", "-ac", "1", tmp])
    if r.returncode != 0:
        fail.append("audio stream could not be decoded to PCM")
    else:
        with wave.open(tmp, "rb") as w_:
            raw = w_.readframes(w_.getnframes())
        x = np.frombuffer(raw, dtype="<i2").astype(np.float32) / 32768.0
        peak = float(np.abs(x).max())
        rms = float(np.sqrt((x ** 2).mean()))
        pk_db = 20 * math.log10(peak) if peak else -120
        rms_db = 20 * math.log10(rms) if rms else -120
        clipped = int((np.abs(x) >= 0.999).sum())
        print(f"  level  peak {pk_db:.1f} dBFS   rms {rms_db:.1f} dBFS   "
              f"clipped samples {clipped}")
        if pk_db < -30:
            fail.append(f"audio is effectively silent (peak {pk_db:.1f} dBFS)")
        if clipped > 480:  # >10 ms of hard clipping
            fail.append(f"{clipped} clipped samples")

print()
if fail:
    print(f"FAILED — {len(fail)} problem(s):")
    for f in fail:
        print("   ", f)
    sys.exit(1)
print(f"PASS — {os.path.basename(path)}: {EXPECT_FRAMES} frames, "
      f"{EXPECT_SECONDS:.3f}s, {EXPECT_W}x{EXPECT_H} @ {EXPECT_FPS}fps, video + audio present.")
