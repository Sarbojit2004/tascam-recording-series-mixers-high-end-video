#!/usr/bin/env bash
# Joins the three rendered parts into the complete ~15-minute film.
#
# STREAM COPY, NOT RE-ENCODE. The parts were rendered from one project with
# identical encoder settings, so `-c copy` concatenates the bitstreams directly:
# the result is bit-identical to the parts and costs seconds rather than a
# re-render. Verified at 26,940 frames — the exact sum of 9000 + 8970 + 8970.
#
# NOTE ON WHAT YOU GET. Each part ends with the full end screen, by design, so
# the joined film carries one at 5:00 and 10:00 as well as at the close. That
# reads as a chapter break. If a seamless single film is wanted instead, the
# fix is at the schedule level rather than here: drop `part1-end` and
# `part2-end` from schedule.ts and render one composition.
set -euo pipefail
cd "$(dirname "$0")/../longform/out"
ffmpeg -v error -f concat -safe 0 -i master.concat.txt \
  -c copy -movflags +faststart -y tascam-model-series-complete.mp4
ffprobe -v error -show_entries format=duration \
  -show_entries stream=nb_frames -of csv=p=0 tascam-model-series-complete.mp4
