"""Split a finished (video + audio) master into sequential, independently playable parts under
the GitHub 100 MB limit. Cuts fall on 2.5 s boundaries (every render chunk starts on a keyframe),
so video and audio are stream-copied, never re-encoded. Also writes <name>.concat.txt + JOIN.md.

  python3 scripts/split.py <master.mp4> <out-dir> <name> [max_mb]
"""
import math, os, subprocess, sys

src, outdir, name = sys.argv[1:4]
limit = float(sys.argv[4]) if len(sys.argv) > 4 else 90
size = os.path.getsize(src) / 1024 / 1024
dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", src], capture_output=True, text=True).stdout)
n = max(1, math.ceil(size / limit))
step = 2.5
cuts = [0.0] + [round(dur * k / n / step) * step for k in range(1, n)] + [dur]
os.makedirs(outdir, exist_ok=True)
parts = []
for i in range(n):
    a, b = cuts[i], cuts[i + 1]
    out = os.path.join(outdir, f"{name}-part{i + 1:02d}.mp4")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{a:.3f}", "-i", src, "-t", f"{b - a:.3f}", "-frames:v", str(round((b - a) * 60)), "-map", "0", "-c", "copy", "-avoid_negative_ts", "make_zero", "-movflags", "+faststart", out], check=True)
    parts.append((os.path.basename(out), a, b - a, os.path.getsize(out) / 1024 / 1024))
with open(os.path.join(outdir, f"{name}.concat.txt"), "w") as f:
    for p in parts:
        f.write(f"file '{p[0]}'\n")
with open(os.path.join(outdir, f"{name}-JOIN.md"), "w") as f:
    f.write(f"# {name}\n\n{n} sequential parts, each playable on its own, total {dur:.3f} s (2160x2160, 60 fps).\n")
    f.write("Video and audio are stream-copied from the master, never re-encoded.\n\n")
    for p in parts:
        f.write(f"- `{p[0]}` — {p[1]:.1f}–{p[1] + p[2]:.1f} s, {p[3]:.0f} MB\n")
    f.write(f"\nRejoin into one file:\n\n```\nffmpeg -f concat -safe 0 -i {name}.concat.txt -c copy {name}.mp4\n```\n")
for p in parts:
    print(p)
