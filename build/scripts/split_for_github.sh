#!/usr/bin/env bash
# Splits any rendered deliverable larger than GitHub's 100 MB file limit into
# keyframe-aligned parts, so the pieces play individually and rejoin exactly.
#
# -c copy means no re-encode: the parts carry the same bitstream as the whole,
# and `ffmpeg -f concat` puts them back together bit-for-bit. Splitting on
# keyframes is what makes each part start cleanly rather than with a smear of
# undecodable frames.
set -euo pipefail
cd "$(dirname "$0")/.."
LIMIT=$((95 * 1024 * 1024))

for f in longform/out/*.mp4 reels/out/*.mp4; do
  [ -f "$f" ] || continue
  size=$(stat -c %s "$f")
  [ "$size" -le "$LIMIT" ] && continue
  dir="$(dirname "$f")/parts"; base="$(basename "$f" .mp4)"
  mkdir -p "$dir"; rm -f "$dir/$base".part*.mp4 "$dir/$base.parts.txt"
  dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$f")
  n=$(( (size + LIMIT - 1) / LIMIT ))
  seg=$(python3 -c "print(f'{$dur/$n:.3f}')")
  echo "=== $base: $((size/1024/1024)) MB -> $n parts of ~${seg}s"
  ffmpeg -v error -i "$f" -c copy -map 0 -f segment \
    -segment_time "$seg" -reset_timestamps 1 -segment_format mp4 \
    "$dir/$base.part%02d.mp4"
  for p in "$dir/$base".part*.mp4; do echo "file '$(basename "$p")'" >> "$dir/$base.parts.txt"; done
  echo "    rejoin: ffmpeg -f concat -safe 0 -i $base.parts.txt -c copy $base.mp4"
  ls -la "$dir/$base".part*.mp4 | awk '{printf "    %s %.1f MB\n", $NF, $5/1048576}'
done
