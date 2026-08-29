#!/usr/bin/env bash
# Reconstruct the full 898 s long-form from its committed chunks.
# Stream copy only — no re-encode — so the result is the delivered render.
set -euo pipefail
cd "$(dirname "$0")/.."
OUT=longform/out
( cd "$OUT/parts" && ls chunk-*.mp4 | sort | sed "s|^|file '|;s|$|'|" > list.txt )
ffmpeg -v error -y -f concat -safe 0 -i "$OUT/parts/list.txt" -c copy \
       -movflags +faststart "$OUT/tascam-model-series-longform.mp4"
rm -f "$OUT/parts/list.txt"
echo "joined -> $OUT/tascam-model-series-longform.mp4"
