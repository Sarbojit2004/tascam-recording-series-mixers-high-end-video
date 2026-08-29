#!/usr/bin/env python3
"""Validates every generated audio asset before any scene code references it.

Checks, per file: it exists, ffprobe decodes it as a real audio stream, the
duration is sensible for its class, and the decoded signal is not silent
(a silent SFX would render as a missing cue with no error anywhere).

Run after scripts/gen_audio.py:
    python3 scripts/audit_audio.py
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
SFX_DIR = os.path.join(ROOT, "public", "audio", "sfx")
AUD_DIR = os.path.join(ROOT, "public", "audio")
VO_DIR = os.path.join(ROOT, "public", "vo")

SCRATCH = tempfile.mkdtemp(prefix="tascam-audio-audit-")
TOTAL_SECONDS = 88.0
fail = []


def probe(path):
    r = subprocess.run(
        ["npx", "remotion", "ffprobe", "-v", "error", "-show_streams",
         "-show_format", "-of", "json", path],
        capture_output=True, text=True, cwd=ROOT,
    )
    if r.returncode != 0:
        return None
    return json.loads(r.stdout)


def peak_dbfs(path):
    """Fully decode the file to PCM and measure its true peak in numpy.

    Remotion's bundled ffmpeg is a minimal build with neither the
    `volumedetect` filter nor the raw `s16le` muxer, so the file is decoded
    to a scratch WAV and measured off the samples. That also proves the MP3
    genuinely decodes end to end rather than merely having a readable header.
    """
    tmp = os.path.join(SCRATCH, "probe.wav")
    r = subprocess.run(
        ["npx", "remotion", "ffmpeg", "-v", "error", "-y", "-i", path,
         "-acodec", "pcm_s16le", "-ac", "1", tmp],
        capture_output=True, cwd=ROOT,
    )
    if r.returncode != 0 or not os.path.exists(tmp):
        return None
    with wave.open(tmp, "rb") as w:
        raw = w.readframes(w.getnframes())
    x = np.frombuffer(raw, dtype="<i2").astype(np.float32) / 32768.0
    if x.size == 0:
        return None
    pk = float(np.abs(x).max())
    return 20.0 * math.log10(pk) if pk > 0 else -120.0


def check(path, lo, hi, label, allow_silent=False):
    name = os.path.basename(path)
    if not os.path.exists(path):
        fail.append(f"{label} {name}: MISSING")
        return
    info = probe(path)
    if info is None:
        fail.append(f"{label} {name}: ffprobe could not decode")
        return
    audio = [s for s in info["streams"] if s.get("codec_type") == "audio"]
    if not audio:
        fail.append(f"{label} {name}: no audio stream")
        return
    dur = float(info["format"]["duration"])
    if not (lo <= dur <= hi):
        fail.append(f"{label} {name}: duration {dur:.3f}s outside [{lo}, {hi}]")
        return
    pk = peak_dbfs(path)
    if pk is None:
        fail.append(f"{label} {name}: could not be decoded to PCM")
        return
    if not allow_silent and pk < -40.0:
        fail.append(f"{label} {name}: effectively silent (peak {pk:.1f} dBFS)")
        return
    print(f"  ok  {label:8} {name:24} {dur:7.3f}s  peak {pk:6.1f} dBFS  "
          f"{audio[0]['codec_name']} {audio[0].get('sample_rate')}Hz "
          f"{audio[0].get('channels')}ch")


LF_SECONDS = 298.0
IS_LF = "--lf" in sys.argv

if IS_LF:
    print("LONG-FORM BEDS")
    check(os.path.join(AUD_DIR, "music-bed-longform.mp3"), LF_SECONDS - 0.4, LF_SECONDS + 0.4, "music")
    check(os.path.join(AUD_DIR, "ambient-bed-longform.mp3"), LF_SECONDS - 0.4, LF_SECONDS + 0.4, "ambient")

    print("VO PLACEHOLDER (silence is expected here)")
    check(os.path.join(VO_DIR, "voiceover-longform-tascam.mp3"), LF_SECONDS - 0.4,
          LF_SECONDS + 0.4, "vo", allow_silent=True)

    print("SFX (full palette — reel's 35 + this video's 4 new ones)")
    sfx = sorted(f for f in os.listdir(SFX_DIR) if f.endswith(".mp3"))
    for f in sfx:
        # chapter-out is the video's single closing resolve, deliberately
        # longer than any per-cut transition sound.
        hi = 3.4 if f == "chapter-out.mp3" else 3.2
        check(os.path.join(SFX_DIR, f), 0.15, hi, "sfx")

    print()
    if fail:
        print(f"FAILED — {len(fail)} problem(s):")
        for f in fail:
            print("  ", f)
        sys.exit(1)
    print(f"PASS — 2 long-form beds + 1 vo placeholder + {len(sfx)} sfx all valid.")
else:
    print("BEDS")
    check(os.path.join(AUD_DIR, "music-bed.mp3"), TOTAL_SECONDS - 0.4, TOTAL_SECONDS + 0.4, "music")
    check(os.path.join(AUD_DIR, "ambient-bed.mp3"), TOTAL_SECONDS - 0.4, TOTAL_SECONDS + 0.4, "ambient")

    print("VO PLACEHOLDER (silence is expected here)")
    check(os.path.join(VO_DIR, "voiceover-reel-tascam.mp3"), TOTAL_SECONDS - 0.4,
          TOTAL_SECONDS + 0.4, "vo", allow_silent=True)

    print("SFX")
    sfx = sorted(f for f in os.listdir(SFX_DIR) if f.endswith(".mp3"))
    for f in sfx:
        check(os.path.join(SFX_DIR, f), 0.15, 3.2, "sfx")

    print()
    if fail:
        print(f"FAILED — {len(fail)} problem(s):")
        for f in fail:
            print("  ", f)
        sys.exit(1)
    print(f"PASS — 2 beds + 1 vo placeholder + {len(sfx)} sfx all valid.")
