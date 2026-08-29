#!/usr/bin/env python3
"""Verify a rendered deliverable directly from the file rather than trusting the
renderer's exit code: frame count, duration, resolution, frame rate, both
streams present, and audio that is neither silent nor clipped."""
import json, subprocess, sys, math

path, want_frames, want_w, want_h = sys.argv[1], int(sys.argv[2]), int(sys.argv[3]), int(sys.argv[4])
fails = []

def probe(args):
    r = subprocess.run(["ffprobe", "-v", "error", *args, "-of", "json", path], capture_output=True)
    return json.loads(r.stdout or "{}")

v = probe(["-select_streams", "v:0", "-show_entries",
           "stream=width,height,r_frame_rate,nb_frames,codec_name,pix_fmt",
           "-show_entries", "format=duration,size"])
if not v.get("streams"):
    sys.exit(f"FAIL {path}: no video stream")
vs, fmt = v["streams"][0], v["format"]

# nb_frames can be absent on some muxers; count packets as the authority.
cnt = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0",
                      "-count_packets", "-show_entries", "stream=nb_read_packets",
                      "-of", "csv=p=0", path], capture_output=True).stdout.decode().strip()
frames = int(cnt) if cnt.isdigit() else int(vs.get("nb_frames", 0))

num, den = vs["r_frame_rate"].split("/")
fps = int(num) / int(den)
dur = float(fmt["duration"])

a = probe(["-select_streams", "a:0", "-show_entries", "stream=codec_name,channels,sample_rate"])
has_audio = bool(a.get("streams"))

lev = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-af",
                      "astats=metadata=1:reset=0", "-f", "null", "-"],
                     capture_output=True).stderr.decode()
peak = None
for line in lev.splitlines():
    if "Peak level dB" in line:
        try: peak = float(line.split(":")[1].strip())
        except Exception: pass

if frames != want_frames: fails.append(f"frame count {frames}, expected {want_frames}")
if vs["width"] != want_w or vs["height"] != want_h:
    fails.append(f"resolution {vs['width']}x{vs['height']}, expected {want_w}x{want_h}")
if abs(fps - 30) > 0.01: fails.append(f"frame rate {fps}, expected 30")
if abs(dur - want_frames / 30) > 0.08: fails.append(f"duration {dur:.3f}s, expected {want_frames/30:.3f}s")
if not has_audio: fails.append("no audio stream")
if peak is not None and peak < -40: fails.append(f"audio effectively silent (peak {peak} dB)")
if peak is not None and peak > -0.05: fails.append(f"audio clipping (peak {peak} dB)")

print(f"{path.split('/')[-1]}")
print(f"  video      {vs['codec_name']} {vs['width']}x{vs['height']} {fps:.3f}fps {vs['pix_fmt']}")
print(f"  frames     {frames}  (target {want_frames})")
print(f"  duration   {dur:.3f}s  (target {want_frames/30:.3f}s)")
print(f"  audio      {a['streams'][0]['codec_name'] if has_audio else 'NONE'}"
      + (f" {a['streams'][0]['channels']}ch {a['streams'][0]['sample_rate']}Hz" if has_audio else "")
      + (f"  peak {peak} dB" if peak is not None else ""))
print(f"  size       {int(fmt['size'])/1e6:.1f} MB")
if fails:
    print("\n  FAILED:"); [print("   -", f) for f in fails]; sys.exit(1)
print("  VERIFIED")
