#!/usr/bin/env bash
# Restores the WAVs this project's compositions mount, from the FLACs shipped in
# the zip. FLAC is lossless, so the result is byte-identical PCM to the audio
# used in the delivered render.
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p public/audio
shopt -s nullglob
for f in out/*-music-bed.flac out/*-sfx-timeline.flac; do
  b=$(basename "$f" .flac)
  # tascam-model-series-longform-music-bed -> longform-music-bed
  slug=$(echo "$b" | sed -E 's/^tascam-model-series-longform/longform/; s/^tascam-reel-([0-9])/reel\1/')
  ffmpeg -v error -y -i "$f" -c:a pcm_s16le "public/audio/${slug}.wav"
  echo "  public/audio/${slug}.wav"
done
