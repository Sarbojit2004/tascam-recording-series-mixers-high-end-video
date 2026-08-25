#!/usr/bin/env bash
# GitHub hard-rejects any file over 100 MB and git-lfs is not available in this
# environment, so the 898-second render ships as phase-aligned chunks plus a
# join step — the same approach the approved MOTU AVB long-form used.
#
# The split is made by the segment muxer, which can only cut on keyframes. That
# matters: cutting at arbitrary phase timestamps with -ss/-to and -c copy snaps
# to the nearest keyframe and produces overlapping parts that do NOT rejoin to
# the original. Keyframe-aligned segments do, so `join.sh` reconstructs the
# delivered render exactly, with a stream copy and no re-encode.
set -euo pipefail
cd "$(dirname "$0")/.."

SRC=longform/out/tascam-model-series-longform.mp4
OUT=longform/out/parts
mkdir -p "$OUT"; rm -f "$OUT"/*.mp4

ffmpeg -v error -y -i "$SRC" -c copy -map 0 -f segment -segment_time 100 \
       -reset_timestamps 1 -segment_format mp4 "$OUT/chunk-%02d.mp4"

for f in "$OUT"/chunk-*.mp4; do
  printf '  %-26s %6.1f MB  %8.2fs
' "$(basename "$f")" \
    "$(echo "scale=1; $(stat -c%s "$f")/1048576" | bc)" \
    "$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$f")"
done
