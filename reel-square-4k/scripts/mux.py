"""Mux the silent 4K render with the -14 LUFS bed and verify the result.

  python3 scripts/mux.py out/tascam-rec-video.mp4 out/tascam-rec-master.mp4

AAC encoding can move integrated loudness by ~0.1 LU, so the muxed file is measured and the gain
trimmed (pure gain, no limiter) until it reads -14.0 LUFS.
"""
import re, subprocess, sys

video, out = sys.argv[1:3]
bed = "public/rec/audio/bed.wav"


def lufs(path):
    err = subprocess.run(["ffmpeg", "-hide_banner", "-i", path, "-af", "ebur128=framelog=quiet", "-f", "null", "-"], capture_output=True, text=True).stderr
    return float(re.findall(r"I:\s+(-?[\d.]+) LUFS", err)[-1])


dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", video], capture_output=True, text=True).stdout)
gain = 0.0
for _ in range(3):
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", video, "-i", bed, "-map", "0:v", "-map", "1:a", "-c:v", "copy",
                    "-af", f"volume={gain:.2f}dB", "-c:a", "aac", "-b:a", "320k", "-ar", "48000", "-t", f"{dur:.3f}", "-movflags", "+faststart", out], check=True)
    got = lufs(out)
    print(f"gain {gain:+.2f} dB -> {got} LUFS")
    if abs(got + 14.0) < 0.05:
        break
    gain += -14.0 - got
