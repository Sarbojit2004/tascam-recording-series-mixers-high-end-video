#!/usr/bin/env bash
# Renders the three portrait reels, one after another.
#
# SEQUENTIALLY, not in parallel: each render is already configured for a
# concurrency of 4 on a 4-core container, so running three at once just makes
# all three slower and triples the peak disk footprint.
set -euo pipefail
cd "$(dirname "$0")/../reels"
node ../scripts/clean_bundles.mjs 2 >/dev/null || true
for pair in \
  "Reel1TriPathSurvey:tascam-reel-1-tri-path-survey" \
  "Reel2FlagshipSpecialist:tascam-reel-2-flagship-and-specialist" \
  "Reel3TransparentBridge:tascam-reel-3-transparent-bridge"
do
  comp="${pair%%:*}"; file="${pair##*:}"
  echo "=== $comp -> out/$file.mp4"
  npx remotion render "$comp" "out/$file.mp4" --log=info 2>&1 | tail -2
done
echo "REELS DONE"
