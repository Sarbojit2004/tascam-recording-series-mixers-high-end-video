#!/usr/bin/env bash
# The two standalone audio deliverables per video, required separately from the
# embedded mix:
#   1. the full music-bed mix as actually deployed, spanning the exact runtime
#   2. the full transition-SFX layer on its own timeline, at the exact positions
#      used in the finished video, spanning the full runtime, as ONE continuous
#      synced file, with the music bed silent/absent
#
# Both are the very same files the compositions mount, so they are synchronous
# with the picture by construction rather than by re-alignment. FLAC keeps them
# lossless — identical samples to the deployed mix — at roughly half the size.
set -euo pipefail
cd "$(dirname "$0")/.."

emit () { # <slug> <projdir> <outname>
  local slug="$1" proj="$2" name="$3"
  for kind in music-bed sfx-timeline; do
    ffmpeg -v error -y -i "assets/audio/${slug}-${kind}.wav" \
           -c:a flac -compression_level 8 "${proj}/out/${name}-${kind}.flac"
    printf '  %-52s %s\n' "${name}-${kind}.flac" \
      "$(ffprobe -v error -show_entries format=duration -of csv=p=0 "${proj}/out/${name}-${kind}.flac" | cut -c1-7)s"
  done
}

emit longform longform tascam-model-series-longform
emit reel1    reels    tascam-reel-1
emit reel2    reels    tascam-reel-2
emit reel3    reels    tascam-reel-3
