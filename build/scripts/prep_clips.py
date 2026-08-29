#!/usr/bin/env python3
"""Crops the Gemini watermark out of the 16 permitted B-roll clips.

The four-point sparkle sits at approximately (1159, 588) in every clip's
1280x720 frame - measured by averaging local contrast across mid-frames from
all 16, not assumed. Its bounding box runs roughly x 1108-1198, y 552-642.

Section 0.3 grants these clips complete editorial freedom - crop, speed, trim,
resize - unlike the absolute no-crop rule governing real photography. So the
watermark comes off with a baked-in crop rather than a blur patch.

Two presets, each chosen so the watermark falls entirely outside the kept region:

  LAND  crop=1104:621:0:0   16:9 from top-left. Keeps x 0..1103, so the mark
                            (x >= 1108) is fully excluded. Upscales 1.74x to
                            1920x1080 - acceptable softness for B-roll.
  PORT  crop=1104:720:0:0   full height, keeps x 0..1103. Used as a horizontal
                            BAND inside the 1080x1920 portrait frame, where
                            1104 -> 1080 is a slight DOWNscale, i.e. near-native.
                            Never full-bleed 9:16, which would have meant a
                            2.7x blow-up from a 405px-wide crop.

Audio is dropped (-an): the deliverables carry only the music bed and the
synthesized Layer 2 SFX.
"""
import os
import re
import subprocess

HERE = os.path.dirname(os.path.abspath(__file__))
BUILD = os.path.dirname(HERE)
ROOT = os.path.dirname(BUILD)
OUT = os.path.join(BUILD, "assets", "clips")

PRESETS = {"land": "crop=1104:621:0:0", "port": "crop=1104:720:0:0"}


def discover():
    """Maps clip number -> source path, from the repository root."""
    found = {}
    for f in os.listdir(ROOT):
        m = re.match(r"^B-ROLL (\d+) \[(.+)\]\.mp4$", f)
        if m:
            found[int(m.group(1))] = (f, m.group(2))
    return found


if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    clips = discover()
    missing = [n for n in range(1, 17) if n not in clips]
    if missing:
        raise SystemExit(f"HARD STOP - missing permitted B-rolls: {missing}")

    for n in sorted(clips):
        src, title = clips[n]
        for preset, vf in PRESETS.items():
            dst = os.path.join(OUT, f"c{n}-{preset}.mp4")
            subprocess.run(
                ["ffmpeg", "-v", "error", "-y", "-i", os.path.join(ROOT, src),
                 "-vf", vf, "-an", "-c:v", "libx264", "-crf", "18",
                 "-preset", "medium", "-pix_fmt", "yuv420p", dst],
                check=True,
            )
        print(f"c{n:<2} {title[:44]:<44} land+port")
    print(f"\n{len(clips)}/16 clips cropped, watermark removed, audio dropped")
