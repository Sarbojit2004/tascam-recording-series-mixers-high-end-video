#!/usr/bin/env bash
# Renders all six deliverables: three long-form parts, three reels.
# Sequential — each render already uses a concurrency of 4 on 4 cores.
set -euo pipefail
cd "$(dirname "$0")/.."
node scripts/clean_bundles.mjs 1 >/dev/null || true

render() { # <project> <composition> <basename>
  echo "=== $3"
  ( cd "$1" && npx remotion render "$2" "out/$3.mp4" --log=error 2>&1 | tail -1 )
}

render longform LongFormPart1 tascam-model-series-part-1
render longform LongFormPart2 tascam-model-series-part-2
render longform LongFormPart3 tascam-model-series-part-3
render reels Reel1TriPathSurvey      tascam-reel-1-tri-path-survey
render reels Reel2FlagshipSpecialist tascam-reel-2-flagship-and-specialist
render reels Reel3TransparentBridge  tascam-reel-3-transparent-bridge
echo "ALL RENDERS DONE"
